import * as RL from "raylib";

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - keyboard input",
);

let ballPosition = new RL.Vector2(screenWidth / 2, screenHeight / 2);

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  if (RL.IsKeyDown(RL.KeyboardKey.RIGHT)) ballPosition.x += 2.0;
  if (RL.IsKeyDown(RL.KeyboardKey.LEFT)) ballPosition.x -= 2.0;
  if (RL.IsKeyDown(RL.KeyboardKey.UP)) ballPosition.y -= 2.0;
  if (RL.IsKeyDown(RL.KeyboardKey.DOWN)) ballPosition.y += 2.0;
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.DrawText("move the ball with arrow keys", 10, 10, 20, RL.DarkGray);

  RL.DrawCircleV(ballPosition, 50, RL.Maroon);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
