import * as RL from "raylib";

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - 3d picking");

const camera = new RL.Camera3D({
  position: vec3(10.0, 10.0, 10.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const cubePosition = vec3(0.0, 1.0, 0.0);
const cubeSize = vec3(2.0, 2.0, 2.0);

let ray = new RL.Ray({ position: vec3(0, 0, 0), direction: vec3(0, 0, 0) });
let collision = new RL.RayCollision({
  hit: false,
  distance: 0,
  point: vec3(0, 0, 0),
  normal: vec3(0, 0, 0),
});

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  if (RL.IsCursorHidden()) RL.UpdateCamera(camera, RL.CameraMode.FIRST_PERSON);

  if (RL.IsMouseButtonPressed(RL.MouseButton.RIGHT)) {
    if (RL.IsCursorHidden()) RL.EnableCursor();
    else RL.DisableCursor();
  }

  if (RL.IsMouseButtonPressed(RL.MouseButton.LEFT)) {
    if (!collision.hit) {
      ray = RL.GetScreenToWorldRay(RL.GetMousePosition(), camera);

      const bounds = new RL.BoundingBox(
        vec3(
          cubePosition.x - cubeSize.x / 2,
          cubePosition.y - cubeSize.y / 2,
          cubePosition.z - cubeSize.z / 2,
        ),
        vec3(
          cubePosition.x + cubeSize.x / 2,
          cubePosition.y + cubeSize.y / 2,
          cubePosition.z + cubeSize.z / 2,
        ),
      );

      collision = RL.GetRayCollisionBox(ray, bounds);
    } else {
      collision.hit = false;
    }
  }
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  if (collision.hit) {
    RL.DrawCube(cubePosition, cubeSize.x, cubeSize.y, cubeSize.z, RL.Red);
    RL.DrawCubeWires(cubePosition, cubeSize.x, cubeSize.y, cubeSize.z, RL.Maroon);
    RL.DrawCubeWires(
      cubePosition,
      cubeSize.x + 0.2,
      cubeSize.y + 0.2,
      cubeSize.z + 0.2,
      RL.Green,
    );
  } else {
    RL.DrawCube(cubePosition, cubeSize.x, cubeSize.y, cubeSize.z, RL.Gray);
    RL.DrawCubeWires(cubePosition, cubeSize.x, cubeSize.y, cubeSize.z, RL.DarkGray);
  }

  RL.DrawRay(ray, RL.Maroon);
  RL.DrawGrid(10, 1.0);

  RL.EndMode3D();

  RL.DrawText("Try clicking on the box with your mouse!", 240, 10, 20, RL.DarkGray);

  if (collision.hit) {
    const label = "BOX SELECTED";
    RL.DrawText(
      label,
      (screenWidth - RL.MeasureText(label, 30)) / 2,
      Math.trunc(screenHeight * 0.1),
      30,
      RL.Green,
    );
  }

  RL.DrawText("Right click mouse to toggle camera controls", 10, 430, 10, RL.Gray);

  RL.DrawFPS(10, 10);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow();
//--------------------------------------------------------------------------------------
