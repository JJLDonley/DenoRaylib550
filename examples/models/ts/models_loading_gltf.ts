import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};


const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - loading gltf animations");

const camera = new RL.Camera3D({
  position: vec3(6.0, 6.0, 6.0),
  target: vec3(0.0, 2.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const model = RL.LoadModel(resource("models/gltf/robot.glb"));
const position = vec3(0.0, 0.0, 0.0);

const { animations, count } = RL.LoadModelAnimations(resource("models/gltf/robot.glb"));
let animIndex = 0;
let animCurrentFrame = 0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.UpdateCamera(camera, RL.CameraMode.ORBITAL);

  if (RL.IsMouseButtonPressed(RL.MouseButton.RIGHT)) animIndex = (animIndex + 1) % count;
  else if (RL.IsMouseButtonPressed(RL.MouseButton.LEFT)) animIndex = (animIndex + count - 1) % count;

  const anim = animations[animIndex];
  animCurrentFrame = (animCurrentFrame + 1) % anim.frameCount;
  RL.UpdateModelAnimation(model, anim, animCurrentFrame);

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);
  RL.DrawModel(model, position, 1.0, RL.White);
  RL.DrawGrid(10, 1.0);
  RL.EndMode3D();

  RL.DrawText("Use the LEFT/RIGHT mouse buttons to switch animation", 10, 10, 20, RL.Gray);
  RL.DrawText(`Animation: ${anim.name}`, 10, RL.GetScreenHeight() - 20, 10, RL.DarkGray);

  RL.EndDrawing();
}

RL.UnloadModel(model);
RL.UnloadModelAnimations(animations, count);
RL.CloseWindow();