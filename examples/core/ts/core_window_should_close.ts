import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - window should close");

RL.SetExitKey(RL.KeyboardKey.NULL);

let exitWindowRequested = false;
let exitWindow = false;

RL.SetTargetFPS(60);

while (!exitWindow) {
  if (RL.WindowShouldClose() || RL.IsKeyPressed(RL.KeyboardKey.ESCAPE)) exitWindowRequested = true;

  if (exitWindowRequested) {
    if (RL.IsKeyPressed(RL.KeyboardKey.Y)) exitWindow = true;
    else if (RL.IsKeyPressed(RL.KeyboardKey.N)) exitWindowRequested = false;
  }

  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  if (exitWindowRequested) {
    RL.DrawRectangle(0, 100, screenWidth, 200, RL.Black);
    RL.DrawText("Are you sure you want to exit program? [Y/N]", 40, 180, 30, RL.White);
  } else {
    RL.DrawText("Try to close the window to get confirmation message!", 120, 200, 20, RL.LightGray);
  }

  RL.EndDrawing();
}

RL.CloseWindow();
