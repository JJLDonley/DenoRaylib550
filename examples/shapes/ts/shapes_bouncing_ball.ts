import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

RL.SetConfigFlags(RL.ConfigFlags.MSAA_4X_HINT);
RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - bouncing ball");

const ballPosition = new RL.Vector2(RL.GetScreenWidth() / 2.0, RL.GetScreenHeight() / 2.0);
const ballSpeed = new RL.Vector2(5.0, 4.0);
const ballRadius = 20;

let pause = false;
let framesCounter = 0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) pause = !pause;

  if (!pause) {
    ballPosition.x += ballSpeed.x;
    ballPosition.y += ballSpeed.y;

    if (ballPosition.x >= (RL.GetScreenWidth() - ballRadius) || ballPosition.x <= ballRadius) {
      ballSpeed.x *= -1.0;
    }
    if (ballPosition.y >= (RL.GetScreenHeight() - ballRadius) || ballPosition.y <= ballRadius) {
      ballSpeed.y *= -1.0;
    }
  } else {
    framesCounter++;
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawCircleV(ballPosition, ballRadius, RL.Maroon);
  RL.DrawText("PRESS SPACE to PAUSE BALL MOVEMENT", 10, RL.GetScreenHeight() - 25, 20, RL.LightGray);

  if (pause && ((Math.trunc(framesCounter / 30) % 2) !== 0)) {
    RL.DrawText("PAUSED", 350, 200, 30, RL.Gray);
  }

  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.CloseWindow();
