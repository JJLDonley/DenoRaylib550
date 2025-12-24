import * as RL from "raylib";

const MAX_GESTURE_STRINGS = 20;

//------------------------------------------------------------------------------------
// Program main entry point
//------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - input gestures",
);

let touchPosition = new RL.Vector2(0, 0);
const touchArea = new RL.Rectangle(
  220,
  10,
  screenWidth - 230.0,
  screenHeight - 20.0,
);

let gesturesCount = 0;
const gestureStrings: string[] = new Array(MAX_GESTURE_STRINGS).fill("");

let currentGesture = RL.Gesture.NONE;
let lastGesture = RL.Gesture.NONE;

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  lastGesture = currentGesture;
  currentGesture = RL.GetGestureDetected();
  touchPosition = RL.GetTouchPosition(0);

  if (
    RL.CheckCollisionPointRec(touchPosition, touchArea) &&
    currentGesture !== RL.Gesture.NONE
  ) {
    if (currentGesture !== lastGesture) {
      // Store gesture string directly (Deno/JS handles strings naturally)
      switch (currentGesture) {
        case RL.Gesture.TAP:
          gestureStrings[gesturesCount] = "GESTURE TAP";
          break;
        case RL.Gesture.DOUBLETAP:
          gestureStrings[gesturesCount] = "GESTURE DOUBLETAP";
          break;
        case RL.Gesture.HOLD:
          gestureStrings[gesturesCount] = "GESTURE HOLD";
          break;
        case RL.Gesture.DRAG:
          gestureStrings[gesturesCount] = "GESTURE DRAG";
          break;
        case RL.Gesture.SWIPE_RIGHT:
          gestureStrings[gesturesCount] = "GESTURE SWIPE RIGHT";
          break;
        case RL.Gesture.SWIPE_LEFT:
          gestureStrings[gesturesCount] = "GESTURE SWIPE LEFT";
          break;
        case RL.Gesture.SWIPE_UP:
          gestureStrings[gesturesCount] = "GESTURE SWIPE UP";
          break;
        case RL.Gesture.SWIPE_DOWN:
          gestureStrings[gesturesCount] = "GESTURE SWIPE DOWN";
          break;
        case RL.Gesture.PINCH_IN:
          gestureStrings[gesturesCount] = "GESTURE PINCH IN";
          break;
        case RL.Gesture.PINCH_OUT:
          gestureStrings[gesturesCount] = "GESTURE PINCH OUT";
          break;
        default:
          break;
      }

      gesturesCount++;

      // Reset gestures strings
      if (gesturesCount >= MAX_GESTURE_STRINGS) {
        for (let i = 0; i < MAX_GESTURE_STRINGS; i++) gestureStrings[i] = "";
        gesturesCount = 0;
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
    if (i % 2 === 0) {
      RL.DrawRectangle(10, 30 + 20 * i, 200, 20, RL.Fade(RL.LightGray, 0.5));
    } else {
      RL.DrawRectangle(10, 30 + 20 * i, 200, 20, RL.Fade(RL.LightGray, 0.3));
    }

    if (i < gesturesCount - 1) {
      RL.DrawText(gestureStrings[i], 35, 36 + 20 * i, 10, RL.DarkGray);
    } else {
      RL.DrawText(gestureStrings[i], 35, 36 + 20 * i, 10, RL.Maroon);
    }
  }

  RL.DrawRectangleLines(10, 29, 200, screenHeight - 50, RL.Gray);
  RL.DrawText("DETECTED GESTURES", 50, 15, 10, RL.Gray);

  if (currentGesture !== RL.Gesture.NONE) {
    RL.DrawCircleV(touchPosition, 30, RL.Maroon);
  }

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
