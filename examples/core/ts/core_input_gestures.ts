import * as RL from "raylib";

const MAX_GESTURE_STRINGS = 20;

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - input gestures");

let touchPosition = new RL.Vector2(0, 0);
const touchArea = new RL.Rectangle(220, 10, screenWidth - 230.0, screenHeight - 20.0);

let gesturesCount = 0;
const gestureStrings: string[] = Array.from({ length: MAX_GESTURE_STRINGS }, () => "");

let currentGesture = RL.Gesture.NONE;
let lastGesture = RL.Gesture.NONE;

//RL.SetGesturesEnabled(0b0000000000001001);

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  lastGesture = currentGesture;
  currentGesture = RL.GetGestureDetected();
  touchPosition = RL.GetTouchPosition(0);

  if (RL.CheckCollisionPointRec(touchPosition, touchArea) && currentGesture !== RL.Gesture.NONE) {
    if (currentGesture !== lastGesture) {
      let label = "";
      switch (currentGesture) {
        case RL.Gesture.TAP:
          label = "GESTURE TAP";
          break;
        case RL.Gesture.DOUBLETAP:
          label = "GESTURE DOUBLETAP";
          break;
        case RL.Gesture.HOLD:
          label = "GESTURE HOLD";
          break;
        case RL.Gesture.DRAG:
          label = "GESTURE DRAG";
          break;
        case RL.Gesture.SWIPE_RIGHT:
          label = "GESTURE SWIPE RIGHT";
          break;
        case RL.Gesture.SWIPE_LEFT:
          label = "GESTURE SWIPE LEFT";
          break;
        case RL.Gesture.SWIPE_UP:
          label = "GESTURE SWIPE UP";
          break;
        case RL.Gesture.SWIPE_DOWN:
          label = "GESTURE SWIPE DOWN";
          break;
        case RL.Gesture.PINCH_IN:
          label = "GESTURE PINCH IN";
          break;
        case RL.Gesture.PINCH_OUT:
          label = "GESTURE PINCH OUT";
          break;
        default:
          break;
      }

      if (label) {
        gestureStrings[gesturesCount] = label;
        gesturesCount++;

        if (gesturesCount >= MAX_GESTURE_STRINGS) {
          for (let i = 0; i < MAX_GESTURE_STRINGS; i++) gestureStrings[i] = "";
          gesturesCount = 0;
        }
      }
    }
  }
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.DrawRectangleRec(touchArea, RL.Gray);
  RL.DrawRectangle(225, 15, screenWidth - 240, screenHeight - 30, RL.RayWhite);

  RL.DrawText(
    "GESTURES TEST AREA",
    screenWidth - 270,
    screenHeight - 40,
    20,
    RL.Fade(RL.Gray, 0.5),
  );

  for (let i = 0; i < gesturesCount; i++) {
    const y = 30 + 20 * i;
    if (i % 2 === 0) RL.DrawRectangle(10, y, 200, 20, RL.Fade(RL.LightGray, 0.5));
    else RL.DrawRectangle(10, y, 200, 20, RL.Fade(RL.LightGray, 0.3));

    const color = i < gesturesCount - 1 ? RL.DarkGray : RL.Maroon;
    RL.DrawText(gestureStrings[i], 35, 36 + 20 * i, 10, color);
  }

  RL.DrawRectangleLines(10, 29, 200, screenHeight - 50, RL.Gray);
  RL.DrawText("DETECTED GESTURES", 50, 15, 10, RL.Gray);

  if (currentGesture !== RL.Gesture.NONE) RL.DrawCircleV(touchPosition, 30, RL.Maroon);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow();
//--------------------------------------------------------------------------------------
