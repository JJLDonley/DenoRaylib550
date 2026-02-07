import * as RL from "raylib";

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - 3d camera free");

const camera = new RL.Camera3D({
  position: vec3(10.0, 10.0, 10.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const cubePosition = vec3(0.0, 0.0, 0.0);

RL.DisableCursor();

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  RL.UpdateCamera(camera, RL.CameraMode.FREE);

  if (RL.IsKeyPressed(RL.KeyboardKey.Z)) {
    camera.target = vec3(0.0, 0.0, 0.0);
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
RL.CloseWindow();
//--------------------------------------------------------------------------------------
