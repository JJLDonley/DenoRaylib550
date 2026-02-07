import * as RL from "raylib";

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - 3d camera mode");

const camera = new RL.Camera3D({
  position: vec3(0.0, 10.0, 10.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const cubePosition = vec3(0.0, 0.0, 0.0);

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
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
RL.CloseWindow();
//--------------------------------------------------------------------------------------
