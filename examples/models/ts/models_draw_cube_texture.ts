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

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - draw cube texture");

const camera = new RL.Camera3D({
  position: vec3(0.0, 10.0, 10.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const texture = RL.LoadTexture(resource("cubicmap_atlas.png"));

const meshA = RL.GenMeshCube(2.0, 4.0, 2.0);
const modelA = RL.LoadModelFromMesh(meshA);
RL.SetMaterialTexture(getMaterial(modelA, 0), RL.MaterialMapIndex.ALBEDO, texture);

const meshB = RL.GenMeshCube(2.0, 2.0, 2.0);
{
  const texPtr = Deno.UnsafePointer.create(meshB.texcoordsPtr);
  if (!texPtr) throw new Error("Mesh texcoords pointer is null");
  const texView = new Deno.UnsafePointerView(texPtr);
  const texBuf = texView.getArrayBuffer(meshB.vertexCount * 2 * 4);
  const tex = new Float32Array(texBuf);

  const uScale = 0.5;
  const vScale = 0.5;
  const uOffset = 0.0;
  const vOffset = 0.5;

  for (let i = 0; i < tex.length; i += 2) {
    tex[i] = tex[i] * uScale + uOffset;
    tex[i + 1] = tex[i + 1] * vScale + vOffset;
  }

  RL.UpdateMeshBuffer(meshB, 1, tex.buffer, tex.byteLength, 0);
}
const modelB = RL.LoadModelFromMesh(meshB);
RL.SetMaterialTexture(getMaterial(modelB, 0), RL.MaterialMapIndex.ALBEDO, texture);

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  RL.DrawModel(modelA, vec3(-2.0, 2.0, 0.0), 1.0, RL.White);
  RL.DrawModel(modelB, vec3(2.0, 1.0, 0.0), 1.0, RL.White);

  RL.DrawGrid(10, 1.0);

  RL.EndMode3D();

  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.UnloadTexture(texture);
RL.UnloadModel(modelA);
RL.UnloadModel(modelB);
RL.CloseWindow();
