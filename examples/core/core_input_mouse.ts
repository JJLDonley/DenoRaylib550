import * as RL from "raylib";

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - mouse input");

let ballPosition = new RL.Vector2(-100.0, -100.0);
let ballColor = RL.DarkBlue;

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//---------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  ballPosition = RL.GetMousePosition();

  if (RL.IsMouseButtonPressed(RL.MouseButton.LEFT)) ballColor = RL.Maroon;
  else if (RL.IsMouseButtonPressed(RL.MouseButton.MIDDLE)) ballColor = RL.Lime;
  else if (RL.IsMouseButtonPressed(RL.MouseButton.RIGHT)) {
    ballColor = RL.DarkBlue;
  } else if (RL.IsMouseButtonPressed(RL.MouseButton.SIDE)) {
    ballColor = RL.Purple;
  } else if (RL.IsMouseButtonPressed(RL.MouseButton.EXTRA)) {
    ballColor = RL.Yellow;
  } else if (RL.IsMouseButtonPressed(RL.MouseButton.FORWARD)) {
    ballColor = RL.Orange;
  } else if (RL.IsMouseButtonPressed(RL.MouseButton.BACK)) ballColor = RL.Beige;
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.DrawCircleV(ballPosition, 40, ballColor);

  RL.DrawText(
    "move ball with mouse and click mouse button to change color",
    10,
    10,
    20,
    RL.DarkGray,
  );

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
