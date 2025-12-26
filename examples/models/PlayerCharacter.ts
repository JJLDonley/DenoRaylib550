import * as RL from "raylib";

function fileUrlToPath(url: string): string {
  if (!url.startsWith("file://")) return url;
  const decoded = decodeURIComponent(url.slice("file://".length));
  if (decoded.startsWith("/") && decoded.length > 2 && decoded[2] === ":") {
    return decoded.slice(1);
  }
  return decoded;
}

function assetPath(relativePath: string): string {
  return fileUrlToPath(new URL(relativePath, import.meta.url).toString());
}

const Constants = {
  Screen: {
    Width: 1280,
    Height: 720,
    Title: "Player Character Example",
  },
  Assets: {
    Animations: {
      general: assetPath(
        "./assets/KayKitAdventures/Animations/gltf/Rig_Medium/Rig_Medium_General.glb",
      ),
      movement: assetPath(
        "./assets/KayKitAdventures/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb",
      ),
    },
    Characters: {
      Barbarian: {
        glb: assetPath(
          "./assets/KayKitAdventures/Characters/gltf/Barbarian.glb",
        ),
        png: assetPath(
          "./assets/KayKitAdventures/Characters/gltf/barbarian_texture.png",
        ),
      },
      Knight: {
        glb: assetPath(
          "./assets/KayKitAdventures/Characters/gltf/Knight.glb",
        ),
        png: assetPath(
          "./assets/KayKitAdventures/Characters/gltf/knight_texture.png",
        ),
      },
      Mage: {
        glb: assetPath("./assets/KayKitAdventures/Characters/gltf/Mage.glb"),
        png: assetPath(
          "./assets/KayKitAdventures/Characters/gltf/mage_texture.png",
        ),
      },
      Ranger: {
        glb: assetPath(
          "./assets/KayKitAdventures/Characters/gltf/Ranger.glb",
        ),
        png: assetPath(
          "./assets/KayKitAdventures/Characters/gltf/ranger_texture.png",
        ),
      },
      Rogue: {
        glb: assetPath(
          "./assets/KayKitAdventures/Characters/gltf/Rogue.glb",
        ),
        png: assetPath(
          "./assets/KayKitAdventures/Characters/gltf/rogue_texture.png",
        ),
      },
      RogueHooded: {
        glb: assetPath(
          "./assets/KayKitAdventures/Characters/gltf/Rogue_Hooded.glb",
        ),
        png: assetPath(
          "./assets/KayKitAdventures/Characters/gltf/rogue_texture.png",
        ),
      },
    },
  },
};

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

type MoveState = "idle" | "walk" | "run";

function normalizeAnimName(name: string): string {
  return name.trim().toLowerCase();
}

function pickAnimation(
  animations: RL.ModelAnimation[],
  preferredNames: string[],
  excludeNames: string[] = [],
  allowFallback = true,
): RL.ModelAnimation | null {
  if (animations.length === 0) return null;
  const excludes = excludeNames.map((exclude) => normalizeAnimName(exclude));
  const preferred = preferredNames.map((name) => normalizeAnimName(name));

  for (const target of preferred) {
    for (const anim of animations) {
      const animName = normalizeAnimName(anim.name);
      if (excludes.some((exclude) => animName.includes(exclude))) continue;
      if (animName === target || animName.startsWith(target)) return anim;
    }
  }

  if (!allowFallback) return null;

  for (const anim of animations) {
    const animName = normalizeAnimName(anim.name);
    if (excludes.some((exclude) => animName.includes(exclude))) continue;
    return anim;
  }

  return animations[0];
}

const POINTER_SIZE = 8;
const BONE_INFO_SIZE = 36;
const TRANSFORM_SIZE = 40;

function readBufferFromPtr(ptr: bigint, byteLength: number): Uint8Array {
  if (ptr === 0n || byteLength <= 0) return new Uint8Array();
  const view = new Deno.UnsafePointerView(Deno.UnsafePointer.create(ptr)!);
  return new Uint8Array(view.getArrayBuffer(byteLength));
}

function readBoneNames(ptr: bigint, count: number): string[] {
  const bones = readBufferFromPtr(ptr, count * BONE_INFO_SIZE);
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const offset = i * BONE_INFO_SIZE;
    const bytes = bones.subarray(offset, offset + 32);
    let end = bytes.indexOf(0);
    if (end === -1) end = 32;
    names.push(new TextDecoder().decode(bytes.subarray(0, end)));
  }
  return names;
}

function buildBoneRemap(
  modelBones: string[],
  animBones: string[],
): number[] | null {
  const remap = modelBones.map((name) => animBones.indexOf(name));
  if (remap.some((idx) => idx < 0)) return null;
  return remap;
}

type RetargetedAnimations = {
  animations: RL.ModelAnimation[];
  keepAlive: Uint8Array[];
};

function retargetAnimations(
  model: RL.Model,
  animations: RL.ModelAnimation[],
): RetargetedAnimations {
  if (animations.length === 0) {
    return { animations, keepAlive: [] };
  }
  if (model.bonesPtr === 0n || model.boneCount === 0) {
    return { animations, keepAlive: [] };
  }

  const modelBoneNames = readBoneNames(model.bonesPtr, model.boneCount);
  const keepAlive: Uint8Array[] = [];
  const retargeted: RL.ModelAnimation[] = [];
  for (const anim of animations) {
    if (anim.boneCount !== model.boneCount) {
      retargeted.push(anim);
      continue;
    }
    const animBoneNames = readBoneNames(anim.bonesPtr, anim.boneCount);
    const remap = buildBoneRemap(modelBoneNames, animBoneNames);
    if (!remap) {
      retargeted.push(anim);
      continue;
    }
    const isIdentity = remap.every((idx, i) => idx === i);
    if (isIdentity) {
      retargeted.push(anim);
      continue;
    }

    const framePtrsBuffer = readBufferFromPtr(
      anim.framePosesPtr,
      anim.frameCount * POINTER_SIZE,
    );
    const framePtrsView = new DataView(framePtrsBuffer.buffer);
    const remappedFrames: Uint8Array[] = [];

    for (let frame = 0; frame < anim.frameCount; frame++) {
      const framePtr = framePtrsView.getBigUint64(
        frame * POINTER_SIZE,
        true,
      );
      const srcFrame = readBufferFromPtr(
        framePtr,
        anim.boneCount * TRANSFORM_SIZE,
      );
      const dstFrame = new Uint8Array(anim.boneCount * TRANSFORM_SIZE);
      for (let modelIndex = 0; modelIndex < remap.length; modelIndex++) {
        const animIndex = remap[modelIndex];
        const srcOffset = animIndex * TRANSFORM_SIZE;
        const dstOffset = modelIndex * TRANSFORM_SIZE;
        dstFrame.set(
          srcFrame.subarray(srcOffset, srcOffset + TRANSFORM_SIZE),
          dstOffset,
        );
      }
      remappedFrames.push(dstFrame);
      keepAlive.push(dstFrame);
    }

    const remappedFramePtrs = new Uint8Array(
      anim.frameCount * POINTER_SIZE,
    );
    const remappedFramePtrsView = new DataView(remappedFramePtrs.buffer);
    for (let frame = 0; frame < remappedFrames.length; frame++) {
      const ptr = Deno.UnsafePointer.of(
        remappedFrames[frame].buffer as BufferSource,
      );
      remappedFramePtrsView.setBigUint64(
        frame * POINTER_SIZE,
        Deno.UnsafePointer.value(ptr),
        true,
      );
    }
    keepAlive.push(remappedFramePtrs);

    const animBuffer = new Uint8Array(56);
    const animView = new DataView(animBuffer.buffer);
    animView.setInt32(0, anim.boneCount, true);
    animView.setInt32(4, anim.frameCount, true);
    animView.setBigUint64(8, model.bonesPtr, true);
    animView.setBigUint64(
      16,
      Deno.UnsafePointer.value(
        Deno.UnsafePointer.of(remappedFramePtrs.buffer),
      ),
      true,
    );
    animBuffer.fill(0, 24, 56);
    const encodedName = new TextEncoder().encode(anim.name);
    animBuffer.set(encodedName.subarray(0, 32), 24);
    keepAlive.push(animBuffer);

    retargeted.push(new RL.ModelAnimation(animBuffer));
  }

  return { animations: retargeted, keepAlive };
}

RL.SetConfigFlags(RL.ConfigFlags.MSAA_4X_HINT);
RL.InitWindow(
  Constants.Screen.Width,
  Constants.Screen.Height,
  Constants.Screen.Title,
);
RL.SetTargetFPS(60);
RL.DisableCursor();

const movementData = RL.LoadModelAnimations(
  Constants.Assets.Animations.movement,
);
const generalData = RL.LoadModelAnimations(Constants.Assets.Animations.general);
const movementSourceAnimations = movementData.animations;
const generalSourceAnimations = generalData.animations;

const model = RL.LoadModel(Constants.Assets.Characters.Knight.glb);
const bbox = RL.GetModelBoundingBox(model);
const modelHeight = bbox.max.y - bbox.min.y;
const modelYOffset = -bbox.min.y;
const modelScale = new RL.Vector3(1, 1, 1);

const movementRetarget = retargetAnimations(model, movementSourceAnimations);
const generalRetarget = retargetAnimations(model, generalSourceAnimations);
const movementAnimSet = movementRetarget.animations;
const generalAnimSet = generalRetarget.animations;
const retargetKeepAlive: Uint8Array[] = [
  ...movementRetarget.keepAlive,
  ...generalRetarget.keepAlive,
];
const idleAnimation = pickAnimation(
  generalAnimSet,
  ["Idle_A", "Idle_B", "Idle"],
  ["t-pose", "t pose", "tpose"],
  false,
);
const walkAnimation = pickAnimation(
  movementAnimSet,
  ["Walking_A", "Walking_B", "Walking_C", "Walking"],
  ["t-pose", "t pose", "tpose"],
  false,
);
const runAnimation = pickAnimation(
  movementAnimSet,
  ["Running_A", "Running_B", "Running"],
  ["t-pose", "t pose", "tpose"],
  false,
);

console.log(`Idle animation: ${idleAnimation ? idleAnimation.name : "none"}`);
console.log(`Walk animation: ${walkAnimation ? walkAnimation.name : "none"}`);
console.log(`Run animation: ${runAnimation ? runAnimation.name : "none"}`);

const animEnabled = !!(idleAnimation || walkAnimation || runAnimation);
const walkAnimFps = 24;
const runAnimFps = 32;
const idleAnimFps = 12;
let animFrame = 0;
let moveState: MoveState = "idle";
let activeAnim: RL.ModelAnimation | null = idleAnimation ?? walkAnimation ??
  runAnimation;
let activeAnimFps = idleAnimation
  ? idleAnimFps
  : walkAnimation
  ? walkAnimFps
  : runAnimFps;

function setActiveAnimation(
  nextAnim: RL.ModelAnimation | null,
  fps: number,
): void {
  if (activeAnim === nextAnim && activeAnimFps === fps) return;
  if (!nextAnim) return;
  activeAnim = nextAnim;
  activeAnimFps = fps;
  animFrame = 0;
}

function setMoveState(next: MoveState): void {
  if (moveState === next && activeAnim) return;
  moveState = next;
  if (!animEnabled) return;
  if (next === "run") {
    setActiveAnimation(
      runAnimation ?? walkAnimation ?? idleAnimation,
      runAnimation ? runAnimFps : walkAnimation ? walkAnimFps : idleAnimFps,
    );
    return;
  }
  if (next === "walk") {
    setActiveAnimation(
      walkAnimation ?? runAnimation ?? idleAnimation,
      walkAnimation ? walkAnimFps : runAnimation ? runAnimFps : idleAnimFps,
    );
    return;
  }
  setActiveAnimation(
    idleAnimation ?? walkAnimation ?? runAnimation,
    idleAnimation ? idleAnimFps : walkAnimation ? walkAnimFps : runAnimFps,
  );
}

const characterPos = new RL.Vector3(0, 0, 0);
let characterYaw = 0;

const walkSpeed = 3.4;
const runSpeed = 6.2;
const cameraDistance = 9.5;
const cameraTargetHeight = modelHeight * 0.72 * modelScale.y;
const groundSize = new RL.Vector2(120, 120);
const gridSlices = 80;
const gridSpacing = 1;
const groundColor = RL.ColorFromHSV(110, 0.25, 0.65);

let cameraYaw = 0;
let cameraPitch = 35 * DEG2RAD;
const minPitch = 8 * DEG2RAD;
const maxPitch = 75 * DEG2RAD;
const mouseSensitivity = 0.0035;

const camera = new RL.Camera3D({
  position: new RL.Vector3(0, 4.5, 9.5),
  target: new RL.Vector3(0, cameraTargetHeight, 0),
  up: new RL.Vector3(0, 1, 0),
  fovy: 45,
  projection: RL.CameraProjection.PERSPECTIVE,
});

type NpcCharacter = {
  name: string;
  model: RL.Model;
  movementAnimations: RL.ModelAnimation[];
  generalAnimations: RL.ModelAnimation[];
  animFrame: number;
  activeAnim: RL.ModelAnimation | null;
  activeAnimFps: number;
  position: RL.Vector3;
  yaw: number;
  modelYOffset: number;
  modelScale: RL.Vector3;
  keepAlive: Uint8Array[];
};

const npcConfigs = [
  { name: "Barbarian", asset: Constants.Assets.Characters.Barbarian },
  { name: "Mage", asset: Constants.Assets.Characters.Mage },
  { name: "Ranger", asset: Constants.Assets.Characters.Ranger },
  { name: "Rogue", asset: Constants.Assets.Characters.Rogue },
  { name: "Rogue Hooded", asset: Constants.Assets.Characters.RogueHooded },
];

const npcRadius = 12;
const npcCharacters: NpcCharacter[] = [];
for (let i = 0; i < npcConfigs.length; i++) {
  const config = npcConfigs[i];
  const angle = (i / npcConfigs.length) * Math.PI * 2;
  const position = new RL.Vector3(
    Math.cos(angle) * npcRadius,
    0,
    Math.sin(angle) * npcRadius,
  );
  const yaw = angle + Math.PI;
  const npcModel = RL.LoadModel(config.asset.glb);
  const npcMovement = retargetAnimations(npcModel, movementSourceAnimations);
  const npcGeneral = retargetAnimations(npcModel, generalSourceAnimations);
  const npcMovementSet = npcMovement.animations;
  const npcGeneralSet = npcGeneral.animations;
  const npcIdle = pickAnimation(
    npcGeneralSet,
    ["Idle_A", "Idle_B", "Idle"],
    ["t-pose", "t pose", "tpose"],
    false,
  );
  const npcWalk = pickAnimation(
    npcMovementSet,
    ["Walking_A", "Walking_B", "Walking_C", "Walking"],
    ["t-pose", "t pose", "tpose"],
    false,
  );
  const npcRun = pickAnimation(
    npcMovementSet,
    ["Running_A", "Running_B", "Running"],
    ["t-pose", "t pose", "tpose"],
    false,
  );
  const npcAnim = npcIdle ?? npcWalk ?? npcRun;
  const npcAnimFps = npcIdle ? idleAnimFps : npcWalk ? walkAnimFps : runAnimFps;
  const npcBox = RL.GetModelBoundingBox(npcModel);
  const npcKeepAlive = [
    ...npcMovement.keepAlive,
    ...npcGeneral.keepAlive,
  ];
  retargetKeepAlive.push(...npcKeepAlive);
  npcCharacters.push({
    name: config.name,
    model: npcModel,
    movementAnimations: npcMovementSet,
    generalAnimations: npcGeneralSet,
    animFrame: 0,
    activeAnim: npcAnim,
    activeAnimFps: npcAnimFps,
    position,
    yaw,
    modelYOffset: -npcBox.min.y,
    modelScale: new RL.Vector3(1, 1, 1),
    keepAlive: npcKeepAlive,
  });
}

if (animEnabled) {
  setMoveState("idle");
}

while (!RL.WindowShouldClose()) {
  const dt = RL.GetFrameTime();

  const mouse = RL.GetMouseDelta();
  cameraYaw += mouse.x * mouseSensitivity;
  cameraPitch += mouse.y * mouseSensitivity;
  cameraPitch = clamp(cameraPitch, minPitch, maxPitch);
  characterYaw = cameraYaw;

  const forwardX = Math.sin(characterYaw);
  const forwardZ = Math.cos(characterYaw);
  const rightX = forwardZ;
  const rightZ = -forwardX;

  let moveX = 0;
  let moveZ = 0;
  if (RL.IsKeyDown(RL.KeyboardKey.W)) moveZ += 1;
  if (RL.IsKeyDown(RL.KeyboardKey.S)) moveZ -= 1;
  if (RL.IsKeyDown(RL.KeyboardKey.D)) moveX += 1;
  if (RL.IsKeyDown(RL.KeyboardKey.A)) moveX -= 1;

  const hasMove = moveX !== 0 || moveZ !== 0;
  const isRunning = hasMove &&
    (RL.IsKeyDown(RL.KeyboardKey.LEFT_SHIFT) ||
      RL.IsKeyDown(RL.KeyboardKey.RIGHT_SHIFT));
  setMoveState(hasMove ? (isRunning ? "run" : "walk") : "idle");

  if (hasMove) {
    const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
    moveX /= len;
    moveZ /= len;
    const worldX = forwardX * moveZ + rightX * moveX;
    const worldZ = forwardZ * moveZ + rightZ * moveX;
    const moveSpeed = isRunning ? runSpeed : walkSpeed;
    characterPos.x += worldX * moveSpeed * dt;
    characterPos.z += worldZ * moveSpeed * dt;
  }

  if (animEnabled && activeAnim) {
    const currentAnim = activeAnim;
    const animFps = activeAnimFps;
    if (moveState !== "idle" || currentAnim.frameCount > 1) {
      animFrame += dt * animFps;
    } else {
      animFrame = 0;
    }
    const frame = currentAnim.frameCount > 0
      ? Math.floor(animFrame) % currentAnim.frameCount
      : 0;
    RL.UpdateModelAnimation(model, currentAnim, frame);
  }

  for (const npc of npcCharacters) {
    if (!npc.activeAnim) continue;
    if (npc.activeAnim.frameCount > 1) {
      npc.animFrame += dt * npc.activeAnimFps;
    } else {
      npc.animFrame = 0;
    }
    const frame = npc.activeAnim.frameCount > 0
      ? Math.floor(npc.animFrame) % npc.activeAnim.frameCount
      : 0;
    RL.UpdateModelAnimation(npc.model, npc.activeAnim, frame);
  }

  const camYaw = characterYaw + Math.PI;
  const camOffsetX = Math.sin(camYaw) * Math.cos(cameraPitch) *
    cameraDistance;
  const camOffsetY = Math.sin(cameraPitch) * cameraDistance +
    cameraTargetHeight;
  const camOffsetZ = Math.cos(camYaw) * Math.cos(cameraPitch) *
    cameraDistance;
  camera.position = new RL.Vector3(
    characterPos.x + camOffsetX,
    characterPos.y + camOffsetY,
    characterPos.z + camOffsetZ,
  );
  camera.target = new RL.Vector3(
    characterPos.x,
    characterPos.y + cameraTargetHeight,
    characterPos.z,
  );

  RL.BeginDrawing();
  RL.ClearBackground(RL.SkyBlue);

  RL.BeginMode3D(camera);
  RL.DrawPlane(new RL.Vector3(0, 0, 0), groundSize, groundColor);
  RL.DrawGrid(gridSlices, gridSpacing);

  const drawPos = new RL.Vector3(
    characterPos.x,
    characterPos.y + modelYOffset * modelScale.y,
    characterPos.z,
  );
  RL.DrawModelEx(
    model,
    drawPos,
    new RL.Vector3(0, 1, 0),
    characterYaw * RAD2DEG,
    modelScale,
    RL.White,
  );
  RL.DrawCircle3D(
    new RL.Vector3(characterPos.x, characterPos.y, characterPos.z),
    0.25,
    new RL.Vector3(1, 0, 0),
    90,
    RL.Red,
  );

  for (const npc of npcCharacters) {
    const npcPos = new RL.Vector3(
      npc.position.x,
      npc.position.y + npc.modelYOffset * npc.modelScale.y,
      npc.position.z,
    );
    RL.DrawModelEx(
      npc.model,
      npcPos,
      new RL.Vector3(0, 1, 0),
      npc.yaw * RAD2DEG,
      npc.modelScale,
      RL.White,
    );
  }

  RL.EndMode3D();

  RL.DrawText("WASD to move (Shift to run)", 20, 20, 20, RL.White);
  RL.DrawText("Mouse to orbit camera and turn character", 20, 45, 20, RL.White);

  RL.EndDrawing();
}

RL.UnloadModel(model);
if (movementSourceAnimations.length) {
  RL.UnloadModelAnimations(movementSourceAnimations);
}
if (generalSourceAnimations.length) {
  RL.UnloadModelAnimations(generalSourceAnimations);
}
for (const npc of npcCharacters) {
  RL.UnloadModel(npc.model);
}
RL.CloseWindow();
