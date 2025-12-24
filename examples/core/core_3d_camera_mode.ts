import * as RL from "raylib";

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - 3d camera mode",
);

// Define the camera to look into our 3d world
const camera = new RL.Camera3D({
  position: new RL.Vector3(0.0, 10.0, 10.0), // Camera position
  target: new RL.Vector3(0.0, 0.0, 0.0), // Camera looking at point
  up: new RL.Vector3(0.0, 1.0, 0.0), // Camera up vector (rotation towards target)
  fovy: 45.0, // Camera field-of-view Y
  projection: RL.CameraProjection.PERSPECTIVE, // Camera mode type
});

const cubePosition = new RL.Vector3(0.0, 0.0, 0.0);

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  // TODO: Update your variables here
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  RL.DrawCube(cubePosition, 2.0, 2.0, 2.0, RL.Red);
  RL.DrawCubeWires(cubePosition, 2.0, 2.0, 2.0, RL.Maroon);

  RL.DrawGrid(10, 1.0);

  RL.EndMode3D();

  RL.DrawText("Welcome to the third dimension!", 10, 40, 20, RL.DarkGray);

  RL.DrawFPS(10, 10);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
