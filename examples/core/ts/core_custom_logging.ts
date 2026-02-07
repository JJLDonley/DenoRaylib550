import * as RL from "raylib";

// NOTE: The current Deno raylib wrapper does not expose SetTraceLogCallback.
// This example keeps the same drawing logic without custom logging.

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - custom logging");

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

  RL.DrawText(
    "Check out the console output to see the custom logger in action!",
    60,
    200,
    20,
    RL.LightGray,
  );

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow();
//--------------------------------------------------------------------------------------
