import * as RL from "raylib";

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const matrixIdentity = (): RL.Matrix =>
  new RL.Matrix({
    m0: 1,
    m4: 0,
    m8: 0,
    m12: 0,
    m1: 0,
    m5: 1,
    m9: 0,
    m13: 0,
    m2: 0,
    m6: 0,
    m10: 1,
    m14: 0,
    m3: 0,
    m7: 0,
    m11: 0,
    m15: 1,
  });

const ptrValue = (data: ArrayBufferView): bigint =>
  Deno.UnsafePointer.value(Deno.UnsafePointer.of(data));

const genMeshCustom = () => {
  const mesh = new RL.Mesh(new Uint8Array(new ArrayBuffer(RL.Mesh.SIZE)) as Uint8Array<ArrayBuffer>);
  mesh.triangleCount = 1;
  mesh.vertexCount = mesh.triangleCount * 3;

  const vertices = new Float32Array(mesh.vertexCount * 3);
  const texcoords = new Float32Array(mesh.vertexCount * 2);
  const normals = new Float32Array(mesh.vertexCount * 3);

  vertices[0] = 0;
  vertices[1] = 0;
  vertices[2] = 0;
  normals[0] = 0;
  normals[1] = 1;
  normals[2] = 0;
  texcoords[0] = 0;
  texcoords[1] = 0;

  vertices[3] = 1;
  vertices[4] = 0;
  vertices[5] = 2;
  normals[3] = 0;
  normals[4] = 1;
  normals[5] = 0;
  texcoords[2] = 0.5;
  texcoords[3] = 1.0;

  vertices[6] = 2;
  vertices[7] = 0;
  vertices[8] = 0;
  normals[6] = 0;
  normals[7] = 1;
  normals[8] = 0;
  texcoords[4] = 1;
  texcoords[5] = 0;

  mesh.verticesPtr = ptrValue(vertices);
  mesh.texcoordsPtr = ptrValue(texcoords);
  mesh.normalsPtr = ptrValue(normals);

  RL.UploadMesh(mesh, false);

  return { mesh, vertices, texcoords, normals };
};

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - mesh generation");

const checked = RL.GenImageChecked(2, 2, 1, 1, RL.Red, RL.Green);
const texture = RL.LoadTextureFromImage(checked);
RL.UnloadImage(checked);

const meshes: RL.Mesh[] = [];

meshes[0] = RL.GenMeshPlane(2, 2, 4, 3);
meshes[1] = RL.GenMeshCube(2.0, 1.0, 2.0);
meshes[2] = RL.GenMeshSphere(2, 32, 32);
meshes[3] = RL.GenMeshHemiSphere(2, 16, 16);
meshes[4] = RL.GenMeshCylinder(1, 2, 16);
meshes[5] = RL.GenMeshTorus(0.25, 4.0, 16, 32);
meshes[6] = RL.GenMeshKnot(1.0, 2.0, 16, 128);
meshes[7] = RL.GenMeshPoly(5, 2.0);
const custom = genMeshCustom();
meshes[8] = custom.mesh;

const material = RL.LoadMaterialDefault();
RL.SetMaterialTexture(material, RL.MaterialMapIndex.ALBEDO, texture);

const camera = new RL.Camera3D({
  position: vec3(5.0, 5.0, 5.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

let currentModel = 0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.UpdateCamera(camera, RL.CameraMode.ORBITAL);

  if (RL.IsMouseButtonPressed(RL.MouseButton.LEFT)) {
    currentModel = (currentModel + 1) % meshes.length;
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.RIGHT)) {
    currentModel++;
    if (currentModel >= meshes.length) currentModel = 0;
  } else if (RL.IsKeyPressed(RL.KeyboardKey.LEFT)) {
    currentModel--;
    if (currentModel < 0) currentModel = meshes.length - 1;
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);
  RL.DrawMesh(meshes[currentModel], material, matrixIdentity());
  RL.DrawGrid(10, 1.0);
  RL.EndMode3D();

  RL.DrawRectangle(30, 400, 310, 30, RL.Fade(RL.SkyBlue, 0.5));
  RL.DrawRectangleLines(30, 400, 310, 30, RL.Fade(RL.DarkBlue, 0.5));
  RL.DrawText("MOUSE LEFT BUTTON to CYCLE PROCEDURAL MODELS", 40, 410, 10, RL.Blue);

  switch (currentModel) {
    case 0:
      RL.DrawText("PLANE", 680, 10, 20, RL.DarkBlue);
      break;
    case 1:
      RL.DrawText("CUBE", 680, 10, 20, RL.DarkBlue);
      break;
    case 2:
      RL.DrawText("SPHERE", 680, 10, 20, RL.DarkBlue);
      break;
    case 3:
      RL.DrawText("HEMISPHERE", 640, 10, 20, RL.DarkBlue);
      break;
    case 4:
      RL.DrawText("CYLINDER", 680, 10, 20, RL.DarkBlue);
      break;
    case 5:
      RL.DrawText("TORUS", 680, 10, 20, RL.DarkBlue);
      break;
    case 6:
      RL.DrawText("KNOT", 680, 10, 20, RL.DarkBlue);
      break;
    case 7:
      RL.DrawText("POLY", 680, 10, 20, RL.DarkBlue);
      break;
    case 8:
      RL.DrawText("Custom (triangle)", 580, 10, 20, RL.DarkBlue);
      break;
    default:
      break;
  }

  RL.EndDrawing();
}

RL.UnloadTexture(texture);
RL.UnloadMaterial(material);
for (const mesh of meshes) RL.UnloadMesh(mesh);
RL.CloseWindow();
