import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

RL.SetConfigFlags(RL.ConfigFlags.MSAA_4X_HINT);
RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - cubic-bezier lines");

let startPoint = new RL.Vector2(30, 30);
let endPoint = new RL.Vector2(screenWidth - 30, screenHeight - 30);
let moveStartPoint = false;
let moveEndPoint = false;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  const mouse = RL.GetMousePosition();

  if (RL.CheckCollisionPointCircle(mouse, startPoint, 10.0) && RL.IsMouseButtonDown(RL.MouseButton.LEFT)) {
    moveStartPoint = true;
  } else if (RL.CheckCollisionPointCircle(mouse, endPoint, 10.0) && RL.IsMouseButtonDown(RL.MouseButton.LEFT)) {
    moveEndPoint = true;
  }

  if (moveStartPoint) {
    startPoint = mouse;
    if (RL.IsMouseButtonReleased(RL.MouseButton.LEFT)) moveStartPoint = false;
  }

  if (moveEndPoint) {
    endPoint = mouse;
    if (RL.IsMouseButtonReleased(RL.MouseButton.LEFT)) moveEndPoint = false;
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawText("MOVE START-END POINTS WITH MOUSE", 15, 20, 20, RL.Gray);

  RL.DrawLineBezier(startPoint, endPoint, 4.0, RL.Blue);

  RL.DrawCircleV(startPoint, RL.CheckCollisionPointCircle(mouse, startPoint, 10.0) ? 14.0 : 8.0, moveStartPoint ? RL.Red : RL.Blue);
  RL.DrawCircleV(endPoint, RL.CheckCollisionPointCircle(mouse, endPoint, 10.0) ? 14.0 : 8.0, moveEndPoint ? RL.Red : RL.Blue);

  RL.EndDrawing();
}

RL.CloseWindow();
