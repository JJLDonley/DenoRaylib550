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

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - heightmap loading and drawing");

const camera = new RL.Camera3D({
  position: vec3(18.0, 21.0, 18.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const image = RL.LoadImage(resource("heightmap.png"));
const texture = RL.LoadTextureFromImage(image);

const mesh = RL.GenMeshHeightmap(image, vec3(16, 8, 16));
const model = RL.LoadModelFromMesh(mesh);
RL.SetMaterialTexture(getMaterial(model, 0), RL.MaterialMapIndex.ALBEDO, texture);

const mapPosition = vec3(-8.0, 0.0, -8.0);

RL.UnloadImage(image);

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.UpdateCamera(camera, RL.CameraMode.ORBITAL);

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);
  RL.DrawModel(model, mapPosition, 1.0, RL.Red);
  RL.DrawGrid(20, 1.0);
  RL.EndMode3D();

  RL.DrawTexture(texture, screenWidth - texture.width - 20, 20, RL.White);
  RL.DrawRectangleLines(screenWidth - texture.width - 20, 20, texture.width, texture.height, RL.Green);

  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.UnloadTexture(texture);
RL.UnloadModel(model);
RL.CloseWindow();