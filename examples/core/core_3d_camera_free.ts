import * as RL from "raylib";

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - 3d camera free",
);

// Define the camera to look into our 3d world
let camera = new RL.Camera3D({
  position: new RL.Vector3(10.0, 10.0, 10.0), // Camera position
  target: new RL.Vector3(0.0, 0.0, 0.0), // Camera looking at point
  up: new RL.Vector3(0.0, 1.0, 0.0), // Camera up vector (rotation towards target)
  fovy: 45.0, // Camera field-of-view Y
  projection: RL.CameraProjection.PERSPECTIVE, // Camera projection type
});

let cubePosition = new RL.Vector3(0.0, 0.0, 0.0);

RL.DisableCursor(); // Limit cursor to relative movement inside the window

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  RL.UpdateCamera(camera, RL.CameraMode.FREE);
  // camera.syncFromBuffer();

  if (RL.IsKeyPressed(RL.KeyboardKey.Z)) {
    console.log(camera.target);
    camera.target = new RL.Vector3(0.0, 0.0, 0.0);
    console.log(camera.target);
  }

  if (RL.IsMouseButtonPressed(RL.MouseButton.RIGHT)) {
    console.log("Right mouse button pressed");
    camera.target = new RL.Vector3(0.0, 1.0, 0.0);
  }
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

  RL.DrawRectangle(10, 10, 320, 93, RL.Fade(RL.SkyBlue, 0.5));
  RL.DrawRectangleLines(10, 10, 320, 93, RL.Blue);

  RL.DrawText("Free camera default controls:", 20, 20, 10, RL.Black);
  RL.DrawText("- Mouse Wheel to Zoom in-out", 40, 40, 10, RL.DarkGray);
  RL.DrawText("- Mouse Wheel Pressed to Pan", 40, 60, 10, RL.DarkGray);
  RL.DrawText("- Z to zoom to (0, 0, 0)", 40, 80, 10, RL.DarkGray);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
