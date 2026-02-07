import * as RL from "raylib";

const MAX_TOUCH_POINTS = 10;

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - input multitouch");

const touchPositions: RL.Vector2[] = Array.from(
  { length: MAX_TOUCH_POINTS },
  () => new RL.Vector2(0, 0),
);

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  let tCount = RL.GetTouchPointCount();
  if (tCount > MAX_TOUCH_POINTS) tCount = MAX_TOUCH_POINTS;

  for (let i = 0; i < tCount; i++) {
    touchPositions[i] = RL.GetTouchPosition(i);
  }
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  for (let i = 0; i < tCount; i++) {
    if (touchPositions[i].x > 0 && touchPositions[i].y > 0) {
      RL.DrawCircleV(touchPositions[i], 34, RL.Orange);
      RL.DrawText(
        `${i}`,
        Math.trunc(touchPositions[i].x - 10),
        Math.trunc(touchPositions[i].y - 70),
        40,
        RL.Black,
      );
    }
  }

  RL.DrawText(
    "touch the screen at multiple locations to get multiple balls",
    10,
    10,
    20,
    RL.DarkGray,
  );

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow();
//--------------------------------------------------------------------------------------
