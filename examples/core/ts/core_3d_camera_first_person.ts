import * as RL from "raylib";

const MAX_COLUMNS = 20;
const DEG2RAD = Math.PI / 180.0;

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);
const vec3Add = (a: RL.Vector3, b: RL.Vector3): RL.Vector3 => vec3(a.x + b.x, a.y + b.y, a.z + b.z);
const vec3Sub = (a: RL.Vector3, b: RL.Vector3): RL.Vector3 => vec3(a.x - b.x, a.y - b.y, a.z - b.z);
const vec3Scale = (v: RL.Vector3, s: number): RL.Vector3 => vec3(v.x * s, v.y * s, v.z * s);
const vec3Dot = (a: RL.Vector3, b: RL.Vector3): number => a.x * b.x + a.y * b.y + a.z * b.z;
const vec3Cross = (a: RL.Vector3, b: RL.Vector3): RL.Vector3 =>
  vec3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x,
  );
const vec3Length = (v: RL.Vector3): number => Math.hypot(v.x, v.y, v.z);
const vec3Normalize = (v: RL.Vector3): RL.Vector3 => {
  const len = vec3Length(v);
  return len > 0 ? vec3Scale(v, 1 / len) : vec3(0, 0, 0);
};

const rotateAroundAxis = (v: RL.Vector3, axis: RL.Vector3, angle: number): RL.Vector3 => {
  const a = vec3Normalize(axis);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const term1 = vec3Scale(v, cos);
  const term2 = vec3Scale(vec3Cross(a, v), sin);
  const term3 = vec3Scale(a, vec3Dot(a, v) * (1 - cos));

  return vec3Add(vec3Add(term1, term2), term3);
};

const cameraYaw = (camera: RL.Camera, angle: number): void => {
  const target = camera.target;
  const toPos = vec3Sub(camera.position, target);
  const rotated = rotateAroundAxis(toPos, camera.up, angle);
  camera.position = vec3Add(target, rotated);
};

const cameraPitch = (camera: RL.Camera, angle: number): void => {
  const target = camera.target;
  const toPos = vec3Sub(camera.position, target);
  const forward = vec3Normalize(vec3Sub(target, camera.position));
  const right = vec3Normalize(vec3Cross(forward, camera.up));
  const rotated = rotateAroundAxis(toPos, right, angle);
  camera.position = vec3Add(target, rotated);
  camera.up = vec3Normalize(rotateAroundAxis(camera.up, right, angle));
};

const modeLabel = (mode: RL.CameraMode): string => {
  switch (mode) {
    case RL.CameraMode.FREE:
      return "FREE";
    case RL.CameraMode.FIRST_PERSON:
      return "FIRST_PERSON";
    case RL.CameraMode.THIRD_PERSON:
      return "THIRD_PERSON";
    case RL.CameraMode.ORBITAL:
      return "ORBITAL";
    default:
      return "CUSTOM";
  }
};

const projectionLabel = (projection: RL.CameraProjection): string => {
  switch (projection) {
    case RL.CameraProjection.PERSPECTIVE:
      return "PERSPECTIVE";
    case RL.CameraProjection.ORTHOGRAPHIC:
      return "ORTHOGRAPHIC";
    default:
      return "CUSTOM";
  }
};

const fmt = (value: number): string => value.toFixed(3);

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - 3d camera first person",
);

const camera = new RL.Camera3D({
  position: vec3(0.0, 2.0, 4.0),
  target: vec3(0.0, 2.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 60.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

let cameraMode = RL.CameraMode.FIRST_PERSON;

const heights = new Array<number>(MAX_COLUMNS).fill(0);
const positions: RL.Vector3[] = Array.from(
  { length: MAX_COLUMNS },
  () => vec3(0, 0, 0),
);
const colors: RL.Color[] = Array.from(
  { length: MAX_COLUMNS },
  () => new RL.Color(0, 0, 0, 0),
);

for (let i = 0; i < MAX_COLUMNS; i++) {
  heights[i] = RL.GetRandomValue(1, 12);
  positions[i] = vec3(
    RL.GetRandomValue(-15, 15),
    heights[i] / 2.0,
    RL.GetRandomValue(-15, 15),
  );
  colors[i] = new RL.Color(
    RL.GetRandomValue(20, 255),
    RL.GetRandomValue(10, 55),
    30,
    255,
  );
}

RL.DisableCursor();

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  if (RL.IsKeyPressed(RL.KeyboardKey.ONE)) {
    cameraMode = RL.CameraMode.FREE;
    camera.up = vec3(0.0, 1.0, 0.0);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.TWO)) {
    cameraMode = RL.CameraMode.FIRST_PERSON;
    camera.up = vec3(0.0, 1.0, 0.0);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.THREE)) {
    cameraMode = RL.CameraMode.THIRD_PERSON;
    camera.up = vec3(0.0, 1.0, 0.0);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.FOUR)) {
    cameraMode = RL.CameraMode.ORBITAL;
    camera.up = vec3(0.0, 1.0, 0.0);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.P)) {
    if (camera.projection === RL.CameraProjection.PERSPECTIVE) {
      cameraMode = RL.CameraMode.THIRD_PERSON;
      camera.position = vec3(0.0, 2.0, -100.0);
      camera.target = vec3(0.0, 2.0, 0.0);
      camera.up = vec3(0.0, 1.0, 0.0);
      camera.projection = RL.CameraProjection.ORTHOGRAPHIC;
      camera.fovy = 20.0;
      cameraYaw(camera, -135 * DEG2RAD);
      cameraPitch(camera, -45 * DEG2RAD);
    } else if (camera.projection === RL.CameraProjection.ORTHOGRAPHIC) {
      cameraMode = RL.CameraMode.THIRD_PERSON;
      camera.position = vec3(0.0, 2.0, 10.0);
      camera.target = vec3(0.0, 2.0, 0.0);
      camera.up = vec3(0.0, 1.0, 0.0);
      camera.projection = RL.CameraProjection.PERSPECTIVE;
      camera.fovy = 60.0;
    }
  }

  RL.UpdateCamera(camera, cameraMode);
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  RL.DrawPlane(vec3(0.0, 0.0, 0.0), new RL.Vector2(32.0, 32.0), RL.LightGray);
  RL.DrawCube(vec3(-16.0, 2.5, 0.0), 1.0, 5.0, 32.0, RL.Blue);
  RL.DrawCube(vec3(16.0, 2.5, 0.0), 1.0, 5.0, 32.0, RL.Lime);
  RL.DrawCube(vec3(0.0, 2.5, 16.0), 32.0, 5.0, 1.0, RL.Gold);

  for (let i = 0; i < MAX_COLUMNS; i++) {
    RL.DrawCube(positions[i], 2.0, heights[i], 2.0, colors[i]);
    RL.DrawCubeWires(positions[i], 2.0, heights[i], 2.0, RL.Maroon);
  }

  if (cameraMode === RL.CameraMode.THIRD_PERSON) {
    RL.DrawCube(camera.target, 0.5, 0.5, 0.5, RL.Purple);
    RL.DrawCubeWires(camera.target, 0.5, 0.5, 0.5, RL.DarkPurple);
  }

  RL.EndMode3D();

  RL.DrawRectangle(5, 5, 330, 100, RL.Fade(RL.SkyBlue, 0.5));
  RL.DrawRectangleLines(5, 5, 330, 100, RL.Blue);

  RL.DrawText("Camera controls:", 15, 15, 10, RL.Black);
  RL.DrawText("- Move keys: W, A, S, D, Space, Left-Ctrl", 15, 30, 10, RL.Black);
  RL.DrawText("- Look around: arrow keys or mouse", 15, 45, 10, RL.Black);
  RL.DrawText("- Camera mode keys: 1, 2, 3, 4", 15, 60, 10, RL.Black);
  RL.DrawText("- Zoom keys: num-plus, num-minus or mouse scroll", 15, 75, 10, RL.Black);
  RL.DrawText("- Camera projection key: P", 15, 90, 10, RL.Black);

  RL.DrawRectangle(600, 5, 195, 100, RL.Fade(RL.SkyBlue, 0.5));
  RL.DrawRectangleLines(600, 5, 195, 100, RL.Blue);

  RL.DrawText("Camera status:", 610, 15, 10, RL.Black);
  RL.DrawText(`- Mode: ${modeLabel(cameraMode)}`, 610, 30, 10, RL.Black);
  RL.DrawText(`- Projection: ${projectionLabel(camera.projection)}`, 610, 45, 10, RL.Black);
  RL.DrawText(
    `- Position: (${fmt(camera.position.x)}, ${fmt(camera.position.y)}, ${fmt(camera.position.z)})`,
    610,
    60,
    10,
    RL.Black,
  );
  RL.DrawText(
    `- Target: (${fmt(camera.target.x)}, ${fmt(camera.target.y)}, ${fmt(camera.target.z)})`,
    610,
    75,
    10,
    RL.Black,
  );
  RL.DrawText(
    `- Up: (${fmt(camera.up.x)}, ${fmt(camera.up.y)}, ${fmt(camera.up.z)})`,
    610,
    90,
    10,
    RL.Black,
  );

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow();
//--------------------------------------------------------------------------------------
