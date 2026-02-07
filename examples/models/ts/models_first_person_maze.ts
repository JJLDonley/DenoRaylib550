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

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - first person maze");

const camera = new RL.Camera3D({
  position: vec3(0.2, 0.4, 0.2),
  target: vec3(0.185, 0.4, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const imMap = RL.LoadImage(resource("cubicmap.png"));
const cubicmap = RL.LoadTextureFromImage(imMap);
const mesh = RL.GenMeshCubicmap(imMap, vec3(1.0, 1.0, 1.0));
const model = RL.LoadModelFromMesh(mesh);

const texture = RL.LoadTexture(resource("cubicmap_atlas.png"));
RL.SetMaterialTexture(getMaterial(model, 0), RL.MaterialMapIndex.ALBEDO, texture);

const mapPixels = RL.LoadImageColors(imMap);
RL.UnloadImage(imMap);

const mapPosition = vec3(-16.0, 0.0, -8.0);

RL.DisableCursor();
RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  const oldCamPos = vec3(camera.position.x, camera.position.y, camera.position.z);

  RL.UpdateCamera(camera, RL.CameraMode.FIRST_PERSON);

  const playerPos = new RL.Vector2(camera.position.x, camera.position.z);
  const playerRadius = 0.1;

  let playerCellX = Math.trunc(playerPos.x - mapPosition.x + 0.5);
  let playerCellY = Math.trunc(playerPos.y - mapPosition.z + 0.5);

  if (playerCellX < 0) playerCellX = 0;
  else if (playerCellX >= cubicmap.width) playerCellX = cubicmap.width - 1;

  if (playerCellY < 0) playerCellY = 0;
  else if (playerCellY >= cubicmap.height) playerCellY = cubicmap.height - 1;

  for (let y = 0; y < cubicmap.height; y++) {
    for (let x = 0; x < cubicmap.width; x++) {
      const idx = (y * cubicmap.width + x) * 4;
      if (mapPixels[idx] === 255) {
        const rect = new RL.Rectangle(
          mapPosition.x - 0.5 + x * 1.0,
          mapPosition.z - 0.5 + y * 1.0,
          1.0,
          1.0,
        );
        if (RL.CheckCollisionCircleRec(playerPos, playerRadius, rect)) {
          camera.position = oldCamPos;
        }
      }
    }
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);
  RL.DrawModel(model, mapPosition, 1.0, RL.White);
  RL.EndMode3D();

  RL.DrawTextureEx(
    cubicmap,
    new RL.Vector2(RL.GetScreenWidth() - cubicmap.width * 4.0 - 20, 20.0),
    0.0,
    4.0,
    RL.White,
  );
  RL.DrawRectangleLines(
    RL.GetScreenWidth() - cubicmap.width * 4 - 20,
    20,
    cubicmap.width * 4,
    cubicmap.height * 4,
    RL.Green,
  );

  RL.DrawRectangle(
    RL.GetScreenWidth() - cubicmap.width * 4 - 20 + playerCellX * 4,
    20 + playerCellY * 4,
    4,
    4,
    RL.Red,
  );

  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.UnloadTexture(cubicmap);
RL.UnloadTexture(texture);
RL.UnloadModel(model);
RL.CloseWindow();