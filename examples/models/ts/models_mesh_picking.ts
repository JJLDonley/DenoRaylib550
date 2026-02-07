import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const getMesh = (model: RL.Model, index: number): RL.Mesh => {
  const ptr = Deno.UnsafePointer.create(model.meshesPtr);
  if (!ptr) throw new Error("Model meshes pointer is null");
  const view = new Deno.UnsafePointerView(ptr);
  const offset = index * RL.Mesh.SIZE;
  const buf = view.getArrayBuffer(offset + RL.Mesh.SIZE);
  return new RL.Mesh(new Uint8Array(buf, offset, RL.Mesh.SIZE) as Uint8Array<ArrayBuffer>);
};

const getMaterial = (model: RL.Model, index: number): RL.Material => {
  const ptr = Deno.UnsafePointer.create(model.materialsPtr);
  if (!ptr) throw new Error("Model materials pointer is null");
  const view = new Deno.UnsafePointerView(ptr);
  const offset = index * RL.Material.SIZE;
  const buf = view.getArrayBuffer(offset + RL.Material.SIZE);
  return new RL.Material(new Uint8Array(buf, offset, RL.Material.SIZE) as Uint8Array<ArrayBuffer>);
};

const vector3Barycenter = (p: RL.Vector3, a: RL.Vector3, b: RL.Vector3, c: RL.Vector3): RL.Vector3 => {
  const v0x = b.x - a.x;
  const v0y = b.y - a.y;
  const v0z = b.z - a.z;
  const v1x = c.x - a.x;
  const v1y = c.y - a.y;
  const v1z = c.z - a.z;
  const v2x = p.x - a.x;
  const v2y = p.y - a.y;
  const v2z = p.z - a.z;

  const d00 = v0x * v0x + v0y * v0y + v0z * v0z;
  const d01 = v0x * v1x + v0y * v1y + v0z * v1z;
  const d11 = v1x * v1x + v1y * v1y + v1z * v1z;
  const d20 = v2x * v0x + v2y * v0y + v2z * v0z;
  const d21 = v2x * v1x + v2y * v1y + v2z * v1z;

  const denom = d00 * d11 - d01 * d01;
  const v = (d11 * d20 - d01 * d21) / denom;
  const w = (d00 * d21 - d01 * d20) / denom;
  const u = 1.0 - v - w;

  return vec3(u, v, w);
};

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - mesh picking");

const camera = new RL.Camera3D({
  position: vec3(20.0, 20.0, 20.0),
  target: vec3(0.0, 8.0, 0.0),
  up: vec3(0.0, 1.6, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const tower = RL.LoadModel(resource("models/obj/turret.obj"));
const texture = RL.LoadTexture(resource("models/obj/turret_diffuse.png"));
RL.SetMaterialTexture(getMaterial(tower, 0), RL.MaterialMapIndex.ALBEDO, texture);

const towerPos = vec3(0.0, 0.0, 0.0);
const towerBBox = RL.GetMeshBoundingBox(getMesh(tower, 0));

const g0 = vec3(-50.0, 0.0, -50.0);
const g1 = vec3(-50.0, 0.0, 50.0);
const g2 = vec3(50.0, 0.0, 50.0);
const g3 = vec3(50.0, 0.0, -50.0);

const ta = vec3(-25.0, 0.5, 0.0);
const tb = vec3(-4.0, 2.5, 1.0);
const tc = vec3(-8.0, 6.5, 0.0);

const sp = vec3(-30.0, 5.0, 5.0);
const sr = 4.0;

let bary = vec3(0.0, 0.0, 0.0);

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsCursorHidden()) RL.UpdateCamera(camera, RL.CameraMode.FIRST_PERSON);

  if (RL.IsMouseButtonPressed(RL.MouseButton.RIGHT)) {
    if (RL.IsCursorHidden()) RL.EnableCursor();
    else RL.DisableCursor();
  }

  let collision = new RL.RayCollision({
    hit: false,
    distance: Number.POSITIVE_INFINITY,
    point: vec3(0, 0, 0),
    normal: vec3(0, 1, 0),
  });
  let hitObjectName = "None";
  let cursorColor = RL.White;

  const ray = RL.GetScreenToWorldRay(RL.GetMousePosition(), camera);

  const groundHitInfo = RL.GetRayCollisionQuad(ray, g0, g1, g2, g3);
  if (groundHitInfo.hit && groundHitInfo.distance < collision.distance) {
    collision = groundHitInfo;
    cursorColor = RL.Green;
    hitObjectName = "Ground";
  }

  const triHitInfo = RL.GetRayCollisionTriangle(ray, ta, tb, tc);
  if (triHitInfo.hit && triHitInfo.distance < collision.distance) {
    collision = triHitInfo;
    cursorColor = RL.Purple;
    hitObjectName = "Triangle";
    bary = vector3Barycenter(collision.point, ta, tb, tc);
  }

  const sphereHitInfo = RL.GetRayCollisionSphere(ray, sp, sr);
  if (sphereHitInfo.hit && sphereHitInfo.distance < collision.distance) {
    collision = sphereHitInfo;
    cursorColor = RL.Orange;
    hitObjectName = "Sphere";
  }

  const boxHitInfo = RL.GetRayCollisionBox(ray, towerBBox);
  if (boxHitInfo.hit && boxHitInfo.distance < collision.distance) {
    collision = boxHitInfo;
    cursorColor = RL.Orange;
    hitObjectName = "Box";

    let meshHitInfo = new RL.RayCollision({
      hit: false,
      distance: Number.POSITIVE_INFINITY,
      point: vec3(0, 0, 0),
      normal: vec3(0, 1, 0),
    });

    for (let m = 0; m < tower.meshCount; m++) {
      const mesh = getMesh(tower, m);
      meshHitInfo = RL.GetRayCollisionMesh(ray, mesh, tower.transform);
      if (meshHitInfo.hit) {
        if (!collision.hit || collision.distance > meshHitInfo.distance) collision = meshHitInfo;
        break;
      }
    }

    if (meshHitInfo.hit) {
      collision = meshHitInfo;
      cursorColor = RL.Orange;
      hitObjectName = "Mesh";
    }
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  RL.DrawModel(tower, towerPos, 1.0, RL.White);

  RL.DrawLine3D(ta, tb, RL.Purple);
  RL.DrawLine3D(tb, tc, RL.Purple);
  RL.DrawLine3D(tc, ta, RL.Purple);

  RL.DrawSphereWires(sp, sr, 8, 8, RL.Purple);

  if (boxHitInfo.hit) RL.DrawBoundingBox(towerBBox, RL.Lime);

  if (collision.hit) {
    RL.DrawCube(collision.point, 0.3, 0.3, 0.3, cursorColor);
    RL.DrawCubeWires(collision.point, 0.3, 0.3, 0.3, RL.Red);

    const normalEnd = vec3(
      collision.point.x + collision.normal.x,
      collision.point.y + collision.normal.y,
      collision.point.z + collision.normal.z,
    );

    RL.DrawLine3D(collision.point, normalEnd, RL.Red);
  }

  RL.DrawRay(ray, RL.Maroon);
  RL.DrawGrid(10, 10.0);

  RL.EndMode3D();

  RL.DrawText(`Hit Object: ${hitObjectName}`, 10, 50, 10, RL.Black);

  if (collision.hit) {
    let ypos = 70;
    RL.DrawText(`Distance: ${collision.distance.toFixed(2)}`, 10, ypos, 10, RL.Black);
    RL.DrawText(
      `Hit Pos: ${collision.point.x.toFixed(2)} ${collision.point.y.toFixed(2)} ${collision.point.z.toFixed(2)}`,
      10,
      ypos + 15,
      10,
      RL.Black,
    );
    RL.DrawText(
      `Hit Norm: ${collision.normal.x.toFixed(2)} ${collision.normal.y.toFixed(2)} ${collision.normal.z.toFixed(2)}`,
      10,
      ypos + 30,
      10,
      RL.Black,
    );

    if (triHitInfo.hit && hitObjectName === "Triangle") {
      RL.DrawText(
        `Barycenter: ${bary.x.toFixed(2)} ${bary.y.toFixed(2)} ${bary.z.toFixed(2)}`,
        10,
        ypos + 45,
        10,
        RL.Black,
      );
    }
  }

  RL.DrawText("Right click mouse to toggle camera controls", 10, 430, 10, RL.Gray);
  RL.DrawText("(c) Turret 3D model by Alberto Cano", screenWidth - 200, screenHeight - 20, 10, RL.Gray);
  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.UnloadModel(tower);
RL.UnloadTexture(texture);
RL.CloseWindow();
