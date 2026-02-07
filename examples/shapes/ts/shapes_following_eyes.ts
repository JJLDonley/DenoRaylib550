import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - following eyes");

const scleraLeftPosition = new RL.Vector2(RL.GetScreenWidth() / 2.0 - 100.0, RL.GetScreenHeight() / 2.0);
const scleraRightPosition = new RL.Vector2(RL.GetScreenWidth() / 2.0 + 100.0, RL.GetScreenHeight() / 2.0);
const scleraRadius = 80;

const irisLeftPosition = new RL.Vector2(RL.GetScreenWidth() / 2.0 - 100.0, RL.GetScreenHeight() / 2.0);
const irisRightPosition = new RL.Vector2(RL.GetScreenWidth() / 2.0 + 100.0, RL.GetScreenHeight() / 2.0);
const irisRadius = 24;

let angle = 0.0;
let dx = 0.0;
let dy = 0.0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  irisLeftPosition.x = RL.GetMouseX();
  irisLeftPosition.y = RL.GetMouseY();
  irisRightPosition.x = RL.GetMouseX();
  irisRightPosition.y = RL.GetMouseY();

  if (!RL.CheckCollisionPointCircle(irisLeftPosition, scleraLeftPosition, scleraRadius - irisRadius)) {
    dx = irisLeftPosition.x - scleraLeftPosition.x;
    dy = irisLeftPosition.y - scleraLeftPosition.y;
    angle = Math.atan2(dy, dx);
    irisLeftPosition.x = scleraLeftPosition.x + (scleraRadius - irisRadius) * Math.cos(angle);
    irisLeftPosition.y = scleraLeftPosition.y + (scleraRadius - irisRadius) * Math.sin(angle);
  }

  if (!RL.CheckCollisionPointCircle(irisRightPosition, scleraRightPosition, scleraRadius - irisRadius)) {
    dx = irisRightPosition.x - scleraRightPosition.x;
    dy = irisRightPosition.y - scleraRightPosition.y;
    angle = Math.atan2(dy, dx);
    irisRightPosition.x = scleraRightPosition.x + (scleraRadius - irisRadius) * Math.cos(angle);
    irisRightPosition.y = scleraRightPosition.y + (scleraRadius - irisRadius) * Math.sin(angle);
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawCircleV(scleraLeftPosition, scleraRadius, RL.LightGray);
  RL.DrawCircleV(irisLeftPosition, irisRadius, RL.Brown);
  RL.DrawCircleV(irisLeftPosition, 10, RL.Black);

  RL.DrawCircleV(scleraRightPosition, scleraRadius, RL.LightGray);
  RL.DrawCircleV(irisRightPosition, irisRadius, RL.DarkGreen);
  RL.DrawCircleV(irisRightPosition, 10, RL.Black);

  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.CloseWindow();
