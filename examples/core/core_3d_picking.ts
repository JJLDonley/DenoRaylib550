import * as RL from "raylib";

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - 3d picking");

// Define the camera to look into our 3d world
const camera = new RL.Camera3D({
  position: new RL.Vector3(10.0, 10.0, 10.0), // Camera position
  target: new RL.Vector3(0.0, 0.0, 0.0), // Camera looking at point
  up: new RL.Vector3(0.0, 1.0, 0.0), // Camera up vector (rotation towards target)
  fovy: 45.0, // Camera field-of-view Y
  projection: RL.CameraProjection.PERSPECTIVE, // Camera projection type
});

const cubePosition = new RL.Vector3(0.0, 1.0, 0.0);
const cubeSize = new RL.Vector3(2.0, 2.0, 2.0);

let ray = new RL.Ray(new RL.Vector3(0, 0, 0), new RL.Vector3(0, 0, 0)); // Picking line ray

let collision = new RL.RayCollision({
  hit: false,
  distance: 0,
  point: new RL.Vector3(0, 0, 0),
  normal: new RL.Vector3(0, 0, 0),
}); // Ray collision hit info

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  if (RL.IsCursorHidden()) RL.UpdateCamera(camera, RL.CameraMode.FIRST_PERSON);

  // Toggle camera controls
  if (RL.IsMouseButtonPressed(RL.MouseButton.RIGHT)) {
    if (RL.IsCursorHidden()) RL.EnableCursor();
    else RL.DisableCursor();
  }

  if (RL.IsMouseButtonPressed(RL.MouseButton.LEFT)) {
    if (!collision.hit) {
      ray = RL.GetScreenToWorldRay(RL.GetMousePosition(), camera);

      // Check collision between ray and box
      collision = RL.GetRayCollisionBox(
        ray,
        new RL.BoundingBox(
          new RL.Vector3(
            cubePosition.x - cubeSize.x / 2,
            cubePosition.y - cubeSize.y / 2,
            cubePosition.z - cubeSize.z / 2,
          ),
          new RL.Vector3(
            cubePosition.x + cubeSize.x / 2,
            cubePosition.y + cubeSize.y / 2,
            cubePosition.z + cubeSize.z / 2,
          ),
        ),
      );
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
    RL.DrawCubeWires(
      cubePosition,
      cubeSize.x,
      cubeSize.y,
      cubeSize.z,
      RL.Maroon,
    );

    RL.DrawCubeWires(
      cubePosition,
      cubeSize.x + 0.2,
      cubeSize.y + 0.2,
      cubeSize.z + 0.2,
      RL.Green,
    );
  } else {
    RL.DrawCube(cubePosition, cubeSize.x, cubeSize.y, cubeSize.z, RL.Gray);
    RL.DrawCubeWires(
      cubePosition,
      cubeSize.x,
      cubeSize.y,
      cubeSize.z,
      RL.DarkGray,
    );
  }

  RL.DrawRay(ray, RL.Maroon);
  RL.DrawGrid(10, 1.0);

  RL.EndMode3D();

  RL.DrawText(
    "Try clicking on the box with your mouse!",
    240,
    10,
    20,
    RL.DarkGray,
  );

  if (collision.hit) {
    RL.DrawText(
      "BOX SELECTED",
      (screenWidth - RL.MeasureText("BOX SELECTED", 30)) / 2,
      Math.floor(screenHeight * 0.1),
      30,
      RL.Green,
    );
  }

  RL.DrawText(
    "Right click mouse to toggle camera controls",
    10,
    430,
    10,
    RL.Gray,
  );

  RL.DrawFPS(10, 10);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
