import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);
const DEG2RAD = Math.PI / 180;

const getMesh = (model: RL.Model, index: number): RL.Mesh => {
  const ptr = Deno.UnsafePointer.create(model.meshesPtr);
  if (!ptr) throw new Error("Model meshes pointer is null");
  const view = new Deno.UnsafePointerView(ptr);
  const offset = index * RL.Mesh.SIZE;
  const buf = view.getArrayBuffer(offset + RL.Mesh.SIZE);
  return new RL.Mesh(new Uint8Array(buf, offset, RL.Mesh.SIZE) as Uint8Array<ArrayBuffer>);
};

const getMaterial = (model: RL.Model, index: number): RL.Material => {
  const ptr = Deno.UnsafePointer.create(model.materialsPtr);
  if (!ptr) throw new Error("Model materials pointer is null");
  const view = new Deno.UnsafePointerView(ptr);
  const offset = index * RL.Material.SIZE;
  const buf = view.getArrayBuffer(offset + RL.Material.SIZE);
  return new RL.Material(new Uint8Array(buf, offset, RL.Material.SIZE) as Uint8Array<ArrayBuffer>);
};

const getBoneInfo = (model: RL.Model, index: number): RL.BoneInfo => {
  const ptr = Deno.UnsafePointer.create(model.bonesPtr);
  if (!ptr) throw new Error("Model bones pointer is null");
  const view = new Deno.UnsafePointerView(ptr);
  const offset = index * RL.BoneInfo.SIZE;
  const buf = view.getArrayBuffer(offset + RL.BoneInfo.SIZE);
  return new RL.BoneInfo(new Uint8Array(buf, offset, RL.BoneInfo.SIZE) as Uint8Array<ArrayBuffer>);
};

const getBindPose = (model: RL.Model, index: number): RL.Transform => {
  const ptr = Deno.UnsafePointer.create(model.bindPosePtr);
  if (!ptr) throw new Error("Model bind pose pointer is null");
  const view = new Deno.UnsafePointerView(ptr);
  const offset = index * RL.Transform.SIZE;
  const buf = view.getArrayBuffer(offset + RL.Transform.SIZE);
  return new RL.Transform(new Uint8Array(buf, offset, RL.Transform.SIZE) as Uint8Array<ArrayBuffer>);
};

const getFramePose = (
  anim: RL.ModelAnimation,
  frameIndex: number,
  boneIndex: number,
): RL.Transform => {
  const ptr = Deno.UnsafePointer.create(anim.framePosesPtr);
  if (!ptr) throw new Error("Animation frame poses pointer is null");
  const view = new Deno.UnsafePointerView(ptr);
  const framePtr = view.getPointer(frameIndex * 8);
  if (!framePtr) throw new Error("Animation frame pointer is null");
  const frameView = new Deno.UnsafePointerView(framePtr);
  const offset = boneIndex * RL.Transform.SIZE;
  const buf = frameView.getArrayBuffer(offset + RL.Transform.SIZE);
  return new RL.Transform(new Uint8Array(buf, offset, RL.Transform.SIZE) as Uint8Array<ArrayBuffer>);
};

const quatFromAxisAngle = (axis: RL.Vector3, angleRad: number): RL.Quaternion => {
  const half = angleRad * 0.5;
  const s = Math.sin(half);
  return new RL.Quaternion(axis.x * s, axis.y * s, axis.z * s, Math.cos(half));
};

const quatMultiply = (q1: RL.Quaternion, q2: RL.Quaternion): RL.Quaternion => {
  const x = q1.x * q2.w + q1.w * q2.x + q1.y * q2.z - q1.z * q2.y;
  const y = q1.y * q2.w + q1.w * q2.y + q1.z * q2.x - q1.x * q2.z;
  const z = q1.z * q2.w + q1.w * q2.z + q1.x * q2.y - q1.y * q2.x;
  const w = q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z;
  return new RL.Quaternion(x, y, z, w);
};

const quatInvert = (q: RL.Quaternion): RL.Quaternion => {
  const len = q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w;
  if (len === 0) return new RL.Quaternion(0, 0, 0, 1);
  const inv = 1 / len;
  return new RL.Quaternion(-q.x * inv, -q.y * inv, -q.z * inv, q.w * inv);
};

const quatToMatrix = (q: RL.Quaternion): RL.Matrix => {
  const xx = q.x * q.x;
  const yy = q.y * q.y;
  const zz = q.z * q.z;
  const xy = q.x * q.y;
  const xz = q.x * q.z;
  const yz = q.y * q.z;
  const wx = q.w * q.x;
  const wy = q.w * q.y;
  const wz = q.w * q.z;

  // Match raymath QuaternionToMatrix (column-major semantic, row-major memory layout)
  return new RL.Matrix({
    m0: 1 - 2 * (yy + zz),
    m1: 2 * (xy + wz),
    m2: 2 * (xz - wy),
    m3: 0,
    m4: 2 * (xy - wz),
    m5: 1 - 2 * (xx + zz),
    m6: 2 * (yz + wx),
    m7: 0,
    m8: 2 * (xz + wy),
    m9: 2 * (yz - wx),
    m10: 1 - 2 * (xx + yy),
    m11: 0,
    m12: 0,
    m13: 0,
    m14: 0,
    m15: 1,
  });
};

const matrixTranslate = (x: number, y: number, z: number): RL.Matrix =>
  new RL.Matrix({
    m0: 1,
    m4: 0,
    m8: 0,
    m12: x,
    m1: 0,
    m5: 1,
    m9: 0,
    m13: y,
    m2: 0,
    m6: 0,
    m10: 1,
    m14: z,
    m3: 0,
    m7: 0,
    m11: 0,
    m15: 1,
  });

const matrixMultiply = (left: RL.Matrix, right: RL.Matrix): RL.Matrix =>
  new RL.Matrix({
    m0: left.m0 * right.m0 + left.m1 * right.m4 + left.m2 * right.m8 + left.m3 * right.m12,
    m1: left.m0 * right.m1 + left.m1 * right.m5 + left.m2 * right.m9 + left.m3 * right.m13,
    m2: left.m0 * right.m2 + left.m1 * right.m6 + left.m2 * right.m10 + left.m3 * right.m14,
    m3: left.m0 * right.m3 + left.m1 * right.m7 + left.m2 * right.m11 + left.m3 * right.m15,
    m4: left.m4 * right.m0 + left.m5 * right.m4 + left.m6 * right.m8 + left.m7 * right.m12,
    m5: left.m4 * right.m1 + left.m5 * right.m5 + left.m6 * right.m9 + left.m7 * right.m13,
    m6: left.m4 * right.m2 + left.m5 * right.m6 + left.m6 * right.m10 + left.m7 * right.m14,
    m7: left.m4 * right.m3 + left.m5 * right.m7 + left.m6 * right.m11 + left.m7 * right.m15,
    m8: left.m8 * right.m0 + left.m9 * right.m4 + left.m10 * right.m8 + left.m11 * right.m12,
    m9: left.m8 * right.m1 + left.m9 * right.m5 + left.m10 * right.m9 + left.m11 * right.m13,
    m10: left.m8 * right.m2 + left.m9 * right.m6 + left.m10 * right.m10 + left.m11 * right.m14,
    m11: left.m8 * right.m3 + left.m9 * right.m7 + left.m10 * right.m11 + left.m11 * right.m15,
    m12: left.m12 * right.m0 + left.m13 * right.m4 + left.m14 * right.m8 + left.m15 * right.m12,
    m13: left.m12 * right.m1 + left.m13 * right.m5 + left.m14 * right.m9 + left.m15 * right.m13,
    m14: left.m12 * right.m2 + left.m13 * right.m6 + left.m14 * right.m10 + left.m15 * right.m14,
    m15: left.m12 * right.m3 + left.m13 * right.m7 + left.m14 * right.m11 + left.m15 * right.m15,
  });

const BONE_SOCKETS = 3;
const BONE_SOCKET_HAT = 0;
const BONE_SOCKET_HAND_R = 1;
const BONE_SOCKET_HAND_L = 2;

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - bone socket");

const camera = new RL.Camera3D({
  position: vec3(5.0, 5.0, 5.0),
  target: vec3(0.0, 2.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const characterModel = RL.LoadModel(resource("models/gltf/greenman.glb"));
const equipModels = [
  RL.LoadModel(resource("models/gltf/greenman_hat.glb")),
  RL.LoadModel(resource("models/gltf/greenman_sword.glb")),
  RL.LoadModel(resource("models/gltf/greenman_shield.glb")),
];

const showEquip = [true, true, true];

const { animations, count } = RL.LoadModelAnimations(resource("models/gltf/greenman.glb"));
let animIndex = 0;
let animCurrentFrame = 0;

const boneSocketIndex = [-1, -1, -1];
for (let i = 0; i < characterModel.boneCount; i++) {
  const bone = getBoneInfo(characterModel, i);
  if (bone.name === "socket_hat") boneSocketIndex[BONE_SOCKET_HAT] = i;
  if (bone.name === "socket_hand_R") boneSocketIndex[BONE_SOCKET_HAND_R] = i;
  if (bone.name === "socket_hand_L") boneSocketIndex[BONE_SOCKET_HAND_L] = i;
}

const position = vec3(0.0, 0.0, 0.0);
let angle = 0;

const characterMesh = getMesh(characterModel, 0);
const characterMaterial = getMaterial(characterModel, 1);
const equipMeshes = equipModels.map((m) => getMesh(m, 0));
const equipMaterials = equipModels.map((m) => getMaterial(m, 1));

RL.DisableCursor();
RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.UpdateCamera(camera, RL.CameraMode.THIRD_PERSON);

  if (RL.IsKeyDown(RL.KeyboardKey.F)) angle = (angle + 1) % 360;
  else if (RL.IsKeyDown(RL.KeyboardKey.H)) angle = (360 + angle - 1) % 360;

  if (RL.IsKeyPressed(RL.KeyboardKey.T)) animIndex = (animIndex + 1) % count;
  else if (RL.IsKeyPressed(RL.KeyboardKey.G)) animIndex = (animIndex + count - 1) % count;

  if (RL.IsKeyPressed(RL.KeyboardKey.ONE)) showEquip[BONE_SOCKET_HAT] = !showEquip[BONE_SOCKET_HAT];
  if (RL.IsKeyPressed(RL.KeyboardKey.TWO)) showEquip[BONE_SOCKET_HAND_R] = !showEquip[BONE_SOCKET_HAND_R];
  if (RL.IsKeyPressed(RL.KeyboardKey.THREE)) showEquip[BONE_SOCKET_HAND_L] = !showEquip[BONE_SOCKET_HAND_L];

  const anim = animations[animIndex];
  animCurrentFrame = (animCurrentFrame + 1) % anim.frameCount;

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  const characterRotate = quatFromAxisAngle(vec3(0.0, 1.0, 0.0), angle * DEG2RAD);
  const characterTransform = matrixMultiply(
    quatToMatrix(characterRotate),
    matrixTranslate(position.x, position.y, position.z),
  );
  characterModel.transform = characterTransform;
  RL.UpdateModelAnimation(characterModel, anim, animCurrentFrame);

  RL.DrawMesh(characterMesh, characterMaterial, characterModel.transform);

  for (let i = 0; i < BONE_SOCKETS; i++) {
    if (!showEquip[i]) continue;
    if (boneSocketIndex[i] < 0) continue;

    const transform = getFramePose(anim, animCurrentFrame, boneSocketIndex[i]);
    const inRotation = getBindPose(characterModel, boneSocketIndex[i]).rotation;
    const outRotation = transform.rotation;

    const rotate = quatMultiply(outRotation as RL.Quaternion, quatInvert(inRotation as RL.Quaternion));
    let matrixTransform = quatToMatrix(rotate);
    matrixTransform = matrixMultiply(
      matrixTransform,
      matrixTranslate(transform.translation.x, transform.translation.y, transform.translation.z),
    );
    matrixTransform = matrixMultiply(matrixTransform, characterModel.transform);

    RL.DrawMesh(equipMeshes[i], equipMaterials[i], matrixTransform);
  }

  RL.DrawGrid(10, 1.0);
  RL.EndMode3D();

  RL.DrawText("Use the T/G to switch animation", 10, 10, 20, RL.Gray);
  RL.DrawText("Use the F/H to rotate character left/right", 10, 35, 20, RL.Gray);
  RL.DrawText("Use the 1,2,3 to toggle shown of hat, sword and shield", 10, 60, 20, RL.Gray);

  RL.EndDrawing();
}

RL.UnloadModelAnimations(animations, count);
RL.UnloadModel(characterModel);
for (const model of equipModels) RL.UnloadModel(model);
RL.CloseWindow();
