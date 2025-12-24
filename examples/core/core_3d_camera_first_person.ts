import * as RL from "raylib";

const MAX_COLUMNS = 20;
const DEG2RAD = Math.PI / 180.0;

function vector3Add(a: RL.Vector3, b: RL.Vector3): RL.Vector3 {
  return new RL.Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
}

function vector3Subtract(a: RL.Vector3, b: RL.Vector3): RL.Vector3 {
  return new RL.Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
}

function vector3Scale(v: RL.Vector3, s: number): RL.Vector3 {
  return new RL.Vector3(v.x * s, v.y * s, v.z * s);
}

function vector3Dot(a: RL.Vector3, b: RL.Vector3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function vector3Cross(a: RL.Vector3, b: RL.Vector3): RL.Vector3 {
  return new RL.Vector3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x,
  );
}

function vector3Length(v: RL.Vector3): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

function vector3Normalize(v: RL.Vector3): RL.Vector3 {
  const length = vector3Length(v);
  if (length === 0) return new RL.Vector3(0, 0, 0);
  return vector3Scale(v, 1.0 / length);
}

function rotateVectorAroundAxis(
  v: RL.Vector3,
  axis: RL.Vector3,
  angle: number,
): RL.Vector3 {
  const k = vector3Normalize(axis);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dot = vector3Dot(k, v);
  const cross = vector3Cross(k, v);

  return new RL.Vector3(
    v.x * cos + cross.x * sin + k.x * dot * (1 - cos),
    v.y * cos + cross.y * sin + k.y * dot * (1 - cos),
    v.z * cos + cross.z * sin + k.z * dot * (1 - cos),
  );
}

function rotatePointAroundAxis(
  point: RL.Vector3,
  origin: RL.Vector3,
  axis: RL.Vector3,
  angle: number,
): RL.Vector3 {
  const translated = vector3Subtract(point, origin);
  const rotated = rotateVectorAroundAxis(translated, axis, angle);
  return vector3Add(origin, rotated);
}

function applyIsometricView(camera: RL.Camera3D): void {
  const yaw = -135 * DEG2RAD;
  const pitch = -45 * DEG2RAD;
  const up = vector3Normalize(camera.up);

  camera.position = rotatePointAroundAxis(
    camera.position,
    camera.target,
    up,
    yaw,
  );

  const forward = vector3Normalize(
    vector3Subtract(camera.target, camera.position),
  );
  const right = vector3Normalize(vector3Cross(forward, up));

  camera.position = rotatePointAroundAxis(
    camera.position,
    camera.target,
    right,
    pitch,
  );
}

//------------------------------------------------------------------------------------
// Program main entry point
//------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - 3d camera first person",
);

// Define the camera to look into our 3d world (position, target, up vector)
const camera = new RL.Camera3D({
  position: new RL.Vector3(0.0, 2.0, 4.0), // Camera position
  target: new RL.Vector3(0.0, 2.0, 0.0), // Camera looking at point
  up: new RL.Vector3(0.0, 1.0, 0.0), // Camera up vector (rotation towards target)
  fovy: 60.0, // Camera field-of-view Y
  projection: RL.CameraProjection.PERSPECTIVE, // Camera projection type
});

let cameraMode = RL.CameraMode.FIRST_PERSON;

// Generates some random columns
const heights: number[] = new Array(MAX_COLUMNS);
const positions: RL.Vector3[] = new Array(MAX_COLUMNS);
const colors: RL.Color[] = new Array(MAX_COLUMNS);

for (let i = 0; i < MAX_COLUMNS; i++) {
  heights[i] = RL.GetRandomValue(1, 12);
  positions[i] = new RL.Vector3(
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

RL.DisableCursor(); // Limit cursor to relative movement inside the window

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  // Switch camera mode
  if (RL.IsKeyPressed(RL.KeyboardKey.ONE)) {
    cameraMode = RL.CameraMode.FREE;
    camera.up = new RL.Vector3(0.0, 1.0, 0.0); // Reset roll
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.TWO)) {
    cameraMode = RL.CameraMode.FIRST_PERSON;
    camera.up = new RL.Vector3(0.0, 1.0, 0.0); // Reset roll
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.THREE)) {
    cameraMode = RL.CameraMode.THIRD_PERSON;
    camera.up = new RL.Vector3(0.0, 1.0, 0.0); // Reset roll
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.FOUR)) {
    cameraMode = RL.CameraMode.ORBITAL;
    camera.up = new RL.Vector3(0.0, 1.0, 0.0); // Reset roll
  }

  // Switch camera projection
  if (RL.IsKeyPressed(RL.KeyboardKey.P)) {
    if (camera.projection === RL.CameraProjection.PERSPECTIVE) {
      // Create isometric view
      cameraMode = RL.CameraMode.THIRD_PERSON;
      // Note: The target distance is related to the render distance in the orthographic projection
      camera.position = new RL.Vector3(0.0, 2.0, -100.0);
      camera.target = new RL.Vector3(0.0, 2.0, 0.0);
      camera.up = new RL.Vector3(0.0, 1.0, 0.0);
      camera.projection = RL.CameraProjection.ORTHOGRAPHIC;
      camera.fovy = 20.0; // near plane width in CAMERA_ORTHOGRAPHIC
      applyIsometricView(camera);
    } else if (camera.projection === RL.CameraProjection.ORTHOGRAPHIC) {
      // Reset to default view
      cameraMode = RL.CameraMode.THIRD_PERSON;
      camera.position = new RL.Vector3(0.0, 2.0, 10.0);
      camera.target = new RL.Vector3(0.0, 2.0, 0.0);
      camera.up = new RL.Vector3(0.0, 1.0, 0.0);
      camera.projection = RL.CameraProjection.PERSPECTIVE;
      camera.fovy = 60.0;
    }
  }

  // Update camera computes movement internally depending on the camera mode
  RL.UpdateCamera(camera, cameraMode); // Update camera
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  RL.DrawPlane(new RL.Vector3(0, 0, 0), new RL.Vector2(32, 32), RL.LightGray); // Draw ground
  RL.DrawCube(new RL.Vector3(-16, 2.5, 0), 1, 5, 32, RL.Blue); // Draw a blue wall
  RL.DrawCube(new RL.Vector3(16, 2.5, 0), 1, 5, 32, RL.Lime); // Draw a green wall
  RL.DrawCube(new RL.Vector3(0, 2.5, 16), 32, 5, 1, RL.Gold); // Draw a yellow wall

  // Draw some cubes around
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
  RL.DrawText(
    "- Move keys: W, A, S, D, Space, Left-Ctrl",
    15,
    30,
    10,
    RL.Black,
  );
  RL.DrawText("- Look around: arrow keys or mouse", 15, 45, 10, RL.Black);
  RL.DrawText("- Camera mode keys: 1, 2, 3, 4", 15, 60, 10, RL.Black);
  RL.DrawText(
    "- Zoom keys: num-plus, num-minus or mouse scroll",
    15,
    75,
    10,
    RL.Black,
  );
  RL.DrawText("- Camera projection key: P", 15, 90, 10, RL.Black);

  RL.DrawRectangle(600, 5, 195, 100, RL.Fade(RL.SkyBlue, 0.5));
  RL.DrawRectangleLines(600, 5, 195, 100, RL.Blue);

  RL.DrawText("Camera status:", 610, 15, 10, RL.Black);
  RL.DrawText(
    `- Mode: ${
      cameraMode === RL.CameraMode.FREE
        ? "FREE"
        : cameraMode === RL.CameraMode.FIRST_PERSON
        ? "FIRST_PERSON"
        : cameraMode === RL.CameraMode.THIRD_PERSON
        ? "THIRD_PERSON"
        : "ORBITAL"
    }`,
    610,
    30,
    10,
    RL.Black,
  );
  RL.DrawText(
    `- Projection: ${
      camera.projection === RL.CameraProjection.PERSPECTIVE
        ? "PERSPECTIVE"
        : "ORTHOGRAPHIC"
    }`,
    610,
    45,
    10,
    RL.Black,
  );
  RL.DrawText(
    `- Position: [${camera.position.x.toFixed(3)}, ${
      camera.position.y.toFixed(3)
    }, ${camera.position.z.toFixed(3)}]`,
    610,
    60,
    10,
    RL.Black,
  );
  RL.DrawText(
    `- Target: [${camera.target.x.toFixed(3)}, ${camera.target.y.toFixed(3)}, ${
      camera.target.z.toFixed(3)
    }]`,
    610,
    75,
    10,
    RL.Black,
  );
  RL.DrawText(
    `- Up: [${camera.up.x.toFixed(3)}, ${camera.up.y.toFixed(3)}, ${
      camera.up.z.toFixed(3)
    }]`,
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
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
