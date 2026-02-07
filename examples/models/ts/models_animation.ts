import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};


const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const getMaterial = (model: RL.Model, index: number): RL.Material => {
  const ptr = Deno.UnsafePointer.create(model.materialsPtr);
  if (!ptr) throw new Error("Model materials pointer is null");
  const view = new Deno.UnsafePointerView(ptr);
  const offset = index * RL.Material.SIZE;
  const buf = view.getArrayBuffer(offset + RL.Material.SIZE);
  return new RL.Material(new Uint8Array(buf, offset, RL.Material.SIZE) as Uint8Array<ArrayBuffer>);
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

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - model animation");

const camera = new RL.Camera3D({
  position: vec3(10.0, 10.0, 10.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const model = RL.LoadModel(resource("models/iqm/guy.iqm"));
const texture = RL.LoadTexture(resource("models/iqm/guytex.png"));
const material0 = getMaterial(model, 0);
RL.SetMaterialTexture(material0, RL.MaterialMapIndex.ALBEDO, texture);

const position = vec3(0.0, 0.0, 0.0);

const { animations, count } = RL.LoadModelAnimations(resource("models/iqm/guyanim.iqm"));
let animFrameCounter = 0;

RL.DisableCursor();
RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.UpdateCamera(camera, RL.CameraMode.FIRST_PERSON);

  if (RL.IsKeyDown(RL.KeyboardKey.SPACE)) {
    animFrameCounter++;
    RL.UpdateModelAnimation(model, animations[0], animFrameCounter);
    if (animFrameCounter >= animations[0].frameCount) animFrameCounter = 0;
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  RL.DrawModelEx(
    model,
    position,
    vec3(1.0, 0.0, 0.0),
    -90.0,
    vec3(1.0, 1.0, 1.0),
    RL.White,
  );

  for (let i = 0; i < model.boneCount; i++) {
    const transform = getFramePose(animations[0], animFrameCounter, i);
    RL.DrawCube(transform.translation, 0.2, 0.2, 0.2, RL.Red);
  }

  RL.DrawGrid(10, 1.0);

  RL.EndMode3D();

  RL.DrawText("PRESS SPACE to PLAY MODEL ANIMATION", 10, 10, 20, RL.Maroon);
  RL.DrawText("(c) Guy IQM 3D model by @culacant", screenWidth - 200, screenHeight - 20, 10, RL.Gray);

  RL.EndDrawing();
}

RL.UnloadTexture(texture);
RL.UnloadModelAnimations(animations, count);
RL.UnloadModel(model);
RL.CloseWindow();
