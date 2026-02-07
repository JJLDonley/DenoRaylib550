import * as RL from "raylib";

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const ptrValue = (data: ArrayBuffer): bigint =>
  Deno.UnsafePointer.value(Deno.UnsafePointer.of(data));

const MAX_POINTS = 10000000;
const MIN_POINTS = 1000;

const genMeshPoints = (numPoints: number) => {
  const mesh = new RL.Mesh(new Uint8Array(new ArrayBuffer(RL.Mesh.SIZE)) as Uint8Array<ArrayBuffer>);
  mesh.triangleCount = 1;
  mesh.vertexCount = numPoints;

  const vertices = new Float32Array(numPoints * 3);
  const colors = new Uint8Array(numPoints * 4);

  // Random point cloud inside a sphere volume (matches the C example)
  for (let i = 0; i < numPoints; i++) {
    const theta = Math.PI * Math.random();
    const phi = 2.0 * Math.PI * Math.random();
    const r = 10.0 * Math.random();

    vertices[i * 3 + 0] = r * Math.sin(theta) * Math.cos(phi);
    vertices[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    vertices[i * 3 + 2] = r * Math.cos(theta);

    const color = RL.ColorFromHSV(r * 360.0, 1.0, 1.0);
    colors[i * 4 + 0] = color.r;
    colors[i * 4 + 1] = color.g;
    colors[i * 4 + 2] = color.b;
    colors[i * 4 + 3] = color.a;
  }

  mesh.verticesPtr = ptrValue(vertices.buffer);
  mesh.colorsPtr = ptrValue(colors.buffer);

  RL.UploadMesh(mesh, false);

  return { mesh, vertices, colors };
};

const getMeshFromModel = (model: RL.Model, index: number): RL.Mesh => {
  const ptr = Deno.UnsafePointer.create(model.meshesPtr);
  if (!ptr) throw new Error("Model meshes pointer is null");
  const view = new Deno.UnsafePointerView(ptr);
  const offset = index * RL.Mesh.SIZE;
  const buf = view.getArrayBuffer(offset + RL.Mesh.SIZE);
  return new RL.Mesh(new Uint8Array(buf, offset, RL.Mesh.SIZE) as Uint8Array<ArrayBuffer>);
};

const nullModelMeshPointers = (model: RL.Model) => {
  for (let i = 0; i < model.meshCount; i++) {
    const mesh = getMeshFromModel(model, i);
    mesh.verticesPtr = 0n;
    mesh.texcoordsPtr = 0n;
    mesh.texcoords2Ptr = 0n;
    mesh.normalsPtr = 0n;
    mesh.tangentsPtr = 0n;
    mesh.colorsPtr = 0n;
    mesh.indicesPtr = 0n;
    mesh.animVerticesPtr = 0n;
    mesh.animNormalsPtr = 0n;
    mesh.boneIdsPtr = 0n;
    mesh.boneWeightsPtr = 0n;
    mesh.boneMatricesPtr = 0n;
    mesh.vboIdPtr = 0n;
  }
};

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - point rendering");

const camera = new RL.Camera3D({
  position: vec3(3.0, 3.0, 3.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const position = vec3(0.0, 0.0, 0.0);
let useDrawModelPoints = true;
let numPointsChanged = false;
let numPoints = 1000;

let meshData = genMeshPoints(numPoints);
let model = RL.LoadModelFromMesh(meshData.mesh);

const drawPointCloud = () => {
  for (let i = 0; i < numPoints; i++) {
    const pos = vec3(
      meshData.vertices[i * 3 + 0],
      meshData.vertices[i * 3 + 1],
      meshData.vertices[i * 3 + 2],
    );
    const color = new RL.Color(
      meshData.colors[i * 4 + 0],
      meshData.colors[i * 4 + 1],
      meshData.colors[i * 4 + 2],
      meshData.colors[i * 4 + 3],
    );
    RL.DrawPoint3D(pos, color);
  }
};

while (!RL.WindowShouldClose()) {
  // Slower orbital movement to reduce point flicker
  const t = RL.GetTime() * 0.25;
  camera.position.x = Math.cos(t) * 3.0;
  camera.position.z = Math.sin(t) * 3.0;
  camera.position.y = 3.0;

  if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) useDrawModelPoints = !useDrawModelPoints;
  if (RL.IsKeyPressed(RL.KeyboardKey.UP)) {
    numPoints = Math.min(MAX_POINTS, numPoints * 10);
    numPointsChanged = true;
  }
  if (RL.IsKeyPressed(RL.KeyboardKey.DOWN)) {
    numPoints = Math.max(MIN_POINTS, Math.floor(numPoints / 10));
    numPointsChanged = true;
  }

  if (numPointsChanged) {
    // Prevent raylib from freeing JS-owned buffers
    nullModelMeshPointers(model);
    RL.UnloadModel(model);
    meshData = genMeshPoints(numPoints);
    model = RL.LoadModelFromMesh(meshData.mesh);
    numPointsChanged = false;
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.Black);

  RL.BeginMode3D(camera);

  if (useDrawModelPoints) {
    RL.DrawModelPoints(model, position, 1.0, RL.White);
  } else {
    drawPointCloud();
  }

  RL.DrawSphereWires(position, 1.0, 10, 10, RL.Yellow);

  RL.EndMode3D();

  RL.DrawText(`Point Count: ${numPoints}`, 20, screenHeight - 50, 40, RL.White);
  RL.DrawText("Up - increase points", 20, 70, 20, RL.White);
  RL.DrawText("Down - decrease points", 20, 100, 20, RL.White);
  RL.DrawText("Space - drawing function", 20, 130, 20, RL.White);
  RL.DrawText(
    useDrawModelPoints ? "Using: DrawModelPoints()" : "Using: DrawPoint3D()",
    20,
    160,
    20,
    useDrawModelPoints ? RL.Green : RL.Red,
  );

  RL.DrawFPS(10, 10);
  RL.EndDrawing();
}

nullModelMeshPointers(model);
RL.UnloadModel(model);
RL.CloseWindow();
