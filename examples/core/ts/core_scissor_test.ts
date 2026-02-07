import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - scissor test");

const scissorArea = new RL.Rectangle(0, 0, 300, 300);
let scissorMode = true;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyPressed(RL.KeyboardKey.S)) scissorMode = !scissorMode;

  scissorArea.x = RL.GetMouseX() - scissorArea.width / 2;
  scissorArea.y = RL.GetMouseY() - scissorArea.height / 2;

  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  if (scissorMode) {
    RL.BeginScissorMode(
      Math.trunc(scissorArea.x),
      Math.trunc(scissorArea.y),
      Math.trunc(scissorArea.width),
      Math.trunc(scissorArea.height),
    );
  }

  RL.DrawRectangle(0, 0, RL.GetScreenWidth(), RL.GetScreenHeight(), RL.Red);
  RL.DrawText("Move the mouse around to reveal this text!", 190, 200, 20, RL.LightGray);

  if (scissorMode) RL.EndScissorMode();

  RL.DrawRectangleLinesEx(scissorArea, 1, RL.Black);
  RL.DrawText("Press S to toggle scissor test", 10, 10, 20, RL.Black);

  RL.EndDrawing();
}

RL.CloseWindow();
