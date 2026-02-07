import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - input virtual controls");

const dpadX = 90;
const dpadY = 300;
const dpadRad = 25.0;
const dpadColor = RL.Blue;
let dpadKeydown = -1;

const dpadCollider: Array<[number, number]> = [
  [dpadX, dpadY - dpadRad * 1.5],
  [dpadX - dpadRad * 1.5, dpadY],
  [dpadX + dpadRad * 1.5, dpadY],
  [dpadX, dpadY + dpadRad * 1.5],
];
const dpadLabel = "XYBA";

let playerX = 100;
let playerY = 100;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  // Update
  dpadKeydown = -1;
  let inputX = 0;
  let inputY = 0;

  if (RL.GetTouchPointCount() > 0) {
    inputX = RL.GetTouchX();
    inputY = RL.GetTouchY();
  } else {
    inputX = RL.GetMouseX();
    inputY = RL.GetMouseY();
  }

  for (let i = 0; i < 4; i++) {
    if (Math.abs(dpadCollider[i][1] - inputY) + Math.abs(dpadCollider[i][0] - inputX) < dpadRad) {
      dpadKeydown = i;
      break;
    }
  }

  switch (dpadKeydown) {
    case 0:
      playerY -= 50 * RL.GetFrameTime();
      break;
    case 1:
      playerX -= 50 * RL.GetFrameTime();
      break;
    case 2:
      playerX += 50 * RL.GetFrameTime();
      break;
    case 3:
      playerY += 50 * RL.GetFrameTime();
      break;
    default:
      break;
  }

  // Draw
  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  for (let i = 0; i < 4; i++) {
    RL.DrawCircleV(new RL.Vector2(dpadCollider[i][0], dpadCollider[i][1]), dpadRad, dpadColor);
    if (i !== dpadKeydown) {
      RL.DrawText(
        dpadLabel[i],
        Math.trunc(dpadCollider[i][0] - 7),
        Math.trunc(dpadCollider[i][1] - 8),
        20,
        RL.Black,
      );
    }
  }

  RL.DrawRectangleRec(new RL.Rectangle(playerX - 4, playerY - 4, 75, 28), RL.Red);
  RL.DrawText("Player", Math.trunc(playerX), Math.trunc(playerY), 20, RL.White);

  RL.EndDrawing();
}

RL.CloseWindow();
