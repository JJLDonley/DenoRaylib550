import * as RL from "raylib";

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - input mouse wheel");

let boxPositionY = screenHeight / 2 - 40;
const scrollSpeed = 4;

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  boxPositionY -= Math.trunc(RL.GetMouseWheelMove() * scrollSpeed);
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.DrawRectangle(screenWidth / 2 - 40, boxPositionY, 80, 80, RL.Maroon);

  RL.DrawText("Use mouse wheel to move the cube up and down!", 10, 10, 20, RL.Gray);
  RL.DrawText(`Box position Y: ${boxPositionY.toString().padStart(3, "0")}`, 10, 40, 20, RL.LightGray);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow();
//--------------------------------------------------------------------------------------
