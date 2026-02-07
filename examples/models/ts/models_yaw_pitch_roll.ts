import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const matrixRotateXYZ = (angle: RL.Vector3): RL.Matrix => {
  const cosz = Math.cos(-angle.z);
  const sinz = Math.sin(-angle.z);
  const cosy = Math.cos(-angle.y);
  const siny = Math.sin(-angle.y);
  const cosx = Math.cos(-angle.x);
  const sinx = Math.sin(-angle.x);

  return new RL.Matrix({
    m0: cosz * cosy,
    m4: sinz * cosy,
    m8: -siny,
    m12: 0,
    m1: cosz * siny * sinx - sinz * cosx,
    m5: sinz * siny * sinx + cosz * cosx,
    m9: cosy * sinx,
    m13: 0,
    m2: cosz * siny * cosx + sinz * sinx,
    m6: sinz * siny * cosx - cosz * sinx,
    m10: cosy * cosx,
    m14: 0,
    m3: 0,
    m7: 0,
    m11: 0,
    m15: 1,
  });
};

const DEG2RAD = Math.PI / 180.0;

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - plane rotations (yaw, pitch, roll)");

const camera = new RL.Camera3D({
  position: vec3(0.0, 50.0, -120.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 30.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const model = RL.LoadModel(resource("models/obj/plane.obj"));
const texture = RL.LoadTexture(resource("models/obj/plane_diffuse.png"));

const materialPtr = Deno.UnsafePointer.create(model.materialsPtr);
if (!materialPtr) throw new Error("Model materials pointer is null");
const materialView = new Deno.UnsafePointerView(materialPtr);
const materialBuf = materialView.getArrayBuffer(RL.Material.SIZE);
const material = new RL.Material(new Uint8Array(materialBuf, 0, RL.Material.SIZE) as Uint8Array<ArrayBuffer>);
RL.SetMaterialTexture(material, RL.MaterialMapIndex.ALBEDO, texture);

let pitch = 0.0;
let roll = 0.0;
let yaw = 0.0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyDown(RL.KeyboardKey.DOWN)) pitch += 0.6;
  else if (RL.IsKeyDown(RL.KeyboardKey.UP)) pitch -= 0.6;
  else {
    if (pitch > 0.3) pitch -= 0.3;
    else if (pitch < -0.3) pitch += 0.3;
  }

  if (RL.IsKeyDown(RL.KeyboardKey.S)) yaw -= 1.0;
  else if (RL.IsKeyDown(RL.KeyboardKey.A)) yaw += 1.0;
  else {
    if (yaw > 0.0) yaw -= 0.5;
    else if (yaw < 0.0) yaw += 0.5;
  }

  if (RL.IsKeyDown(RL.KeyboardKey.LEFT)) roll -= 1.0;
  else if (RL.IsKeyDown(RL.KeyboardKey.RIGHT)) roll += 1.0;
  else {
    if (roll > 0.0) roll -= 0.5;
    else if (roll < 0.0) roll += 0.5;
  }

  model.transform = matrixRotateXYZ(vec3(DEG2RAD * pitch, DEG2RAD * yaw, DEG2RAD * roll));

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);
  RL.DrawModel(model, vec3(0.0, -8.0, 0.0), 1.0, RL.White);
  RL.DrawGrid(10, 10.0);
  RL.EndMode3D();

  RL.DrawRectangle(30, 370, 260, 70, RL.Fade(RL.Green, 0.5));
  RL.DrawRectangleLines(30, 370, 260, 70, RL.Fade(RL.DarkGreen, 0.5));
  RL.DrawText("Pitch controlled with: KEY_UP / KEY_DOWN", 40, 380, 10, RL.DarkGray);
  RL.DrawText("Roll controlled with: KEY_LEFT / KEY_RIGHT", 40, 400, 10, RL.DarkGray);
  RL.DrawText("Yaw controlled with: KEY_A / KEY_S", 40, 420, 10, RL.DarkGray);

  RL.DrawText("(c) WWI Plane Model created by GiaHanLam", screenWidth - 240, screenHeight - 20, 10, RL.DarkGray);

  RL.EndDrawing();
}

RL.UnloadModel(model);
RL.UnloadTexture(texture);
RL.CloseWindow();
