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

const getMesh = (model: RL.Model, index: number): RL.Mesh => {
  const ptr = Deno.UnsafePointer.create(model.meshesPtr);
  if (!ptr) throw new Error("Model meshes pointer is null");
  const view = new Deno.UnsafePointerView(ptr);
  const offset = index * RL.Mesh.SIZE;
  const buf = view.getArrayBuffer(offset + RL.Mesh.SIZE);
  return new RL.Mesh(new Uint8Array(buf, offset, RL.Mesh.SIZE) as Uint8Array<ArrayBuffer>);
};

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - models loading");

const camera = new RL.Camera3D({
  position: vec3(50.0, 50.0, 50.0),
  target: vec3(0.0, 10.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

let model = RL.LoadModel(resource("models/obj/castle.obj"));
let texture = RL.LoadTexture(resource("models/obj/castle_diffuse.png"));
RL.SetMaterialTexture(getMaterial(model, 0), RL.MaterialMapIndex.ALBEDO, texture);

const position = vec3(0.0, 0.0, 0.0);
let bounds = RL.GetMeshBoundingBox(getMesh(model, 0));

let selected = false;

RL.DisableCursor();
RL.SetTargetFPS(60);

const isModelExtension = (file: string): boolean => {
  const lower = file.toLowerCase();
  return (
    lower.endsWith(".obj") ||
    lower.endsWith(".gltf") ||
    lower.endsWith(".glb") ||
    lower.endsWith(".vox") ||
    lower.endsWith(".iqm") ||
    lower.endsWith(".m3d")
  );
};

while (!RL.WindowShouldClose()) {
  RL.UpdateCamera(camera, RL.CameraMode.FIRST_PERSON);

  if (RL.isFileDropped()) {
    const droppedFiles = RL.LoadDroppedFiles();
    if (droppedFiles.length === 1) {
      const file = droppedFiles[0];
      const lower = file.toLowerCase();

      if (isModelExtension(file)) {
        RL.UnloadModel(model);
        model = RL.LoadModel(file);
        RL.SetMaterialTexture(getMaterial(model, 0), RL.MaterialMapIndex.ALBEDO, texture);
        bounds = RL.GetMeshBoundingBox(getMesh(model, 0));
      } else if (lower.endsWith(".png")) {
        RL.UnloadTexture(texture);
        texture = RL.LoadTexture(file);
        RL.SetMaterialTexture(getMaterial(model, 0), RL.MaterialMapIndex.ALBEDO, texture);
      }
    }
  }

  if (RL.IsMouseButtonPressed(RL.MouseButton.LEFT)) {
    const ray = RL.GetScreenToWorldRay(RL.GetMousePosition(), camera);
    if (RL.GetRayCollisionBox(ray, bounds).hit) selected = !selected;
    else selected = false;
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);
  RL.DrawModel(model, position, 1.0, RL.White);
  RL.DrawGrid(20, 10.0);
  if (selected) RL.DrawBoundingBox(bounds, RL.Green);
  RL.EndMode3D();

  RL.DrawText("Drag & drop model to load mesh/texture.", 10, RL.GetScreenHeight() - 20, 10, RL.DarkGray);
  if (selected) RL.DrawText("MODEL SELECTED", RL.GetScreenWidth() - 110, 10, 10, RL.Green);

  RL.DrawText("(c) Castle 3D model by Alberto Cano", screenWidth - 200, screenHeight - 20, 10, RL.Gray);

  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.UnloadTexture(texture);
RL.UnloadModel(model);
RL.CloseWindow();