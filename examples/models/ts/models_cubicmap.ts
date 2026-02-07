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

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - cubesmap loading and drawing");

const camera = new RL.Camera3D({
  position: vec3(16.0, 14.0, 16.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const image = RL.LoadImage(resource("cubicmap.png"));
const cubicmap = RL.LoadTextureFromImage(image);

const mesh = RL.GenMeshCubicmap(image, vec3(1.0, 1.0, 1.0));
const model = RL.LoadModelFromMesh(mesh);

const texture = RL.LoadTexture(resource("cubicmap_atlas.png"));
const material0 = getMaterial(model, 0);
RL.SetMaterialTexture(material0, RL.MaterialMapIndex.ALBEDO, texture);

const mapPosition = vec3(-16.0, 0.0, -8.0);

RL.UnloadImage(image);

let pause = false;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyPressed(RL.KeyboardKey.P)) pause = !pause;

  if (!pause) RL.UpdateCamera(camera, RL.CameraMode.ORBITAL);

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);
  RL.DrawModel(model, mapPosition, 1.0, RL.White);
  RL.EndMode3D();

  RL.DrawTextureEx(
    cubicmap,
    new RL.Vector2(screenWidth - cubicmap.width * 4.0 - 20, 20.0),
    0.0,
    4.0,
    RL.White,
  );
  RL.DrawRectangleLines(
    screenWidth - cubicmap.width * 4 - 20,
    20,
    cubicmap.width * 4,
    cubicmap.height * 4,
    RL.Green,
  );

  RL.DrawText("cubicmap image used to", 658, 90, 10, RL.Gray);
  RL.DrawText("generate map 3d model", 658, 104, 10, RL.Gray);

  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.UnloadTexture(cubicmap);
RL.UnloadTexture(texture);
RL.UnloadModel(model);
RL.CloseWindow();