import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const getBoneInfoFromModel = (model: RL.Model, index: number): RL.BoneInfo => {
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

const getAnimBoneInfo = (anim: RL.ModelAnimation, index: number): RL.BoneInfo => {
  const ptr = Deno.UnsafePointer.create(anim.bonesPtr);
  if (!ptr) throw new Error("Animation bones pointer is null");
  const view = new Deno.UnsafePointerView(ptr);
  const offset = index * RL.BoneInfo.SIZE;
  const buf = view.getArrayBuffer(offset + RL.BoneInfo.SIZE);
  return new RL.BoneInfo(new Uint8Array(buf, offset, RL.BoneInfo.SIZE) as Uint8Array<ArrayBuffer>);
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

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - M3D model loading");

const camera = new RL.Camera3D({
  position: vec3(1.5, 1.5, 1.5),
  target: vec3(0.0, 0.4, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

let position = vec3(0.0, 0.0, 0.0);

const modelFileName = "models/m3d/cesium_man.m3d";
let drawMesh = true;
let drawSkeleton = true;
let animPlaying = false;

const model = RL.LoadModel(resource(modelFileName));
{
  const bb = RL.GetModelBoundingBox(model);
  const centerX = bb.min.x + (bb.max.x - bb.min.x) / 2;
  const centerY = bb.min.y + (bb.max.y - bb.min.y) / 2;
  const centerZ = bb.min.z + (bb.max.z - bb.min.z) / 2;
  position = vec3(-centerX, -centerY, -centerZ);
}

const { animations: anims, count: animsCount } = RL.LoadModelAnimations(resource(modelFileName));
let animFrameCounter = 0;
let animId = 0;

RL.DisableCursor();
RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.UpdateCamera(camera, RL.CameraMode.FIRST_PERSON);

  if (animsCount > 0) {
    if (RL.IsKeyDown(RL.KeyboardKey.SPACE) || RL.IsKeyPressed(RL.KeyboardKey.N)) {
      animFrameCounter++;
      if (animFrameCounter >= anims[animId].frameCount) animFrameCounter = 0;
      RL.UpdateModelAnimation(model, anims[animId], animFrameCounter);
      animPlaying = true;
    }

    if (RL.IsKeyPressed(RL.KeyboardKey.C)) {
      animFrameCounter = 0;
      animId++;
      if (animId >= animsCount) animId = 0;
      RL.UpdateModelAnimation(model, anims[animId], 0);
      animPlaying = true;
    }
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.B)) drawSkeleton = !drawSkeleton;
  if (RL.IsKeyPressed(RL.KeyboardKey.M)) drawMesh = !drawMesh;

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  if (drawMesh) RL.DrawModel(model, position, 1.0, RL.White);

  if (drawSkeleton) {
    for (let i = 0; i < model.boneCount - 1; i++) {
      if (!animPlaying || animsCount === 0) {
        const bindPose = getBindPose(model, i);
        RL.DrawCube(
          vec3(
            bindPose.translation.x + position.x,
            bindPose.translation.y + position.y,
            bindPose.translation.z + position.z,
          ),
          0.04,
          0.04,
          0.04,
          RL.Red,
        );

        const bone = getBoneInfoFromModel(model, i);
        if (bone.parent >= 0) {
          const parentPose = getBindPose(model, bone.parent);
          RL.DrawLine3D(
            vec3(
              bindPose.translation.x + position.x,
              bindPose.translation.y + position.y,
              bindPose.translation.z + position.z,
            ),
            vec3(
              parentPose.translation.x + position.x,
              parentPose.translation.y + position.y,
              parentPose.translation.z + position.z,
            ),
            RL.Red,
          );
        }
      } else {
        const pose = getFramePose(anims[animId], animFrameCounter, i);
        RL.DrawCube(
          vec3(
            pose.translation.x + position.x,
            pose.translation.y + position.y,
            pose.translation.z + position.z,
          ),
          0.05,
          0.05,
          0.05,
          RL.Red,
        );

        const animBone = getAnimBoneInfo(anims[animId], i);
        if (animBone.parent >= 0) {
          const parentPose = getFramePose(anims[animId], animFrameCounter, animBone.parent);
          RL.DrawLine3D(
            vec3(
              pose.translation.x + position.x,
              pose.translation.y + position.y,
              pose.translation.z + position.z,
            ),
            vec3(
              parentPose.translation.x + position.x,
              parentPose.translation.y + position.y,
              parentPose.translation.z + position.z,
            ),
            RL.Red,
          );
        }
      }
    }
  }

  RL.DrawGrid(10, 1.0);
  RL.EndMode3D();

  RL.DrawText("PRESS SPACE to PLAY MODEL ANIMATION", 10, RL.GetScreenHeight() - 80, 10, RL.Maroon);
  RL.DrawText("PRESS N to STEP ONE ANIMATION FRAME", 10, RL.GetScreenHeight() - 60, 10, RL.DarkGray);
  RL.DrawText("PRESS C to CYCLE THROUGH ANIMATIONS", 10, RL.GetScreenHeight() - 40, 10, RL.DarkGray);
  RL.DrawText("PRESS M to toggle MESH, B to toggle SKELETON DRAWING", 10, RL.GetScreenHeight() - 20, 10, RL.DarkGray);
  RL.DrawText("(c) CesiumMan model by KhronosGroup", RL.GetScreenWidth() - 210, RL.GetScreenHeight() - 20, 10, RL.Gray);

  RL.EndDrawing();
}

RL.UnloadModelAnimations(anims, animsCount);
RL.UnloadModel(model);
RL.CloseWindow();
