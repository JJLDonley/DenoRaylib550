import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - collision area");

const boxA = new RL.Rectangle(10, RL.GetScreenHeight() / 2.0 - 50, 200, 100);
let boxASpeedX = 4;

const boxB = new RL.Rectangle(RL.GetScreenWidth() / 2.0 - 30, RL.GetScreenHeight() / 2.0 - 30, 60, 60);
let boxCollision = new RL.Rectangle(0, 0, 0, 0);

const screenUpperLimit = 40;

let pause = false;
let collision = false;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (!pause) boxA.x += boxASpeedX;

  if ((boxA.x + boxA.width) >= RL.GetScreenWidth() || boxA.x <= 0) boxASpeedX *= -1;

  boxB.x = RL.GetMouseX() - boxB.width / 2;
  boxB.y = RL.GetMouseY() - boxB.height / 2;

  if ((boxB.x + boxB.width) >= RL.GetScreenWidth()) boxB.x = RL.GetScreenWidth() - boxB.width;
  else if (boxB.x <= 0) boxB.x = 0;

  if ((boxB.y + boxB.height) >= RL.GetScreenHeight()) boxB.y = RL.GetScreenHeight() - boxB.height;
  else if (boxB.y <= screenUpperLimit) boxB.y = screenUpperLimit;

  collision = RL.CheckCollisionRecs(boxA, boxB);
  if (collision) boxCollision = RL.GetCollisionRec(boxA, boxB);

  if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) pause = !pause;

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawRectangle(0, 0, screenWidth, screenUpperLimit, collision ? RL.Red : RL.Black);

  RL.DrawRectangleRec(boxA, RL.Gold);
  RL.DrawRectangleRec(boxB, RL.Blue);

  if (collision) {
    RL.DrawRectangleRec(boxCollision, RL.Lime);
    RL.DrawText(
      "COLLISION!",
      Math.trunc(RL.GetScreenWidth() / 2 - RL.MeasureText("COLLISION!", 20) / 2),
      Math.trunc(screenUpperLimit / 2 - 10),
      20,
      RL.Black,
    );
    RL.DrawText(
      `Collision Area: ${Math.trunc(boxCollision.width) * Math.trunc(boxCollision.height)}`,
      Math.trunc(RL.GetScreenWidth() / 2 - 100),
      screenUpperLimit + 10,
      20,
      RL.Black,
    );
  }

  RL.DrawText("Press SPACE to PAUSE/RESUME", 20, screenHeight - 35, 20, RL.LightGray);
  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.CloseWindow();
