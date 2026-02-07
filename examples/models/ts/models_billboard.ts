import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};


const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);
const vec2 = (x: number, y: number): RL.Vector2 => new RL.Vector2(x, y);
const vec3Distance = (a: RL.Vector3, b: RL.Vector3): number =>
  Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - drawing billboards");

const camera = new RL.Camera3D({
  position: vec3(5.0, 4.0, 5.0),
  target: vec3(0.0, 2.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const bill = RL.LoadTexture(resource("billboard.png"));
const billPositionStatic = vec3(0.0, 2.0, 0.0);
const billPositionRotating = vec3(1.0, 2.0, 1.0);

const source = new RL.Rectangle(0.0, 0.0, bill.width, bill.height);
const billUp = vec3(0.0, 1.0, 0.0);
const size = vec2(source.width / source.height, 1.0);
const origin = vec2(size.x * 0.5, size.y * 0.5);

let rotation = 0.0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.UpdateCamera(camera, RL.CameraMode.ORBITAL);

  rotation += 0.4;
  const distanceStatic = vec3Distance(camera.position, billPositionStatic);
  const distanceRotating = vec3Distance(camera.position, billPositionRotating);

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);
  RL.DrawGrid(10, 1.0);

  if (distanceStatic > distanceRotating) {
    RL.DrawBillboard(camera, bill, billPositionStatic, 2.0, RL.White);
    RL.DrawBillboardPro(camera, bill, source, billPositionRotating, billUp, size, origin, rotation, RL.White);
  } else {
    RL.DrawBillboardPro(camera, bill, source, billPositionRotating, billUp, size, origin, rotation, RL.White);
    RL.DrawBillboard(camera, bill, billPositionStatic, 2.0, RL.White);
  }

  RL.EndMode3D();

  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.UnloadTexture(bill);
RL.CloseWindow();