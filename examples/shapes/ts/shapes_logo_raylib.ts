import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - raylib logo using shapes");

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawRectangle(Math.trunc(screenWidth / 2 - 128), Math.trunc(screenHeight / 2 - 128), 256, 256, RL.Black);
  RL.DrawRectangle(Math.trunc(screenWidth / 2 - 112), Math.trunc(screenHeight / 2 - 112), 224, 224, RL.RayWhite);
  RL.DrawText("raylib", Math.trunc(screenWidth / 2 - 44), Math.trunc(screenHeight / 2 + 48), 50, RL.Black);
  RL.DrawText("this is NOT a texture!", 350, 370, 10, RL.Gray);

  RL.EndDrawing();
}

RL.CloseWindow();
