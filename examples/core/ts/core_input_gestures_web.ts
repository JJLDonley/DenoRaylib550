import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;
const messagePosition = new RL.Vector2(160, 7);

let lastGesture = RL.Gesture.NONE;
const lastGesturePosition = new RL.Vector2(165, 130);

const GESTURE_LOG_SIZE = 20;
const gestureLog: string[] = Array.from({ length: GESTURE_LOG_SIZE }, () => "");
let gestureLogIndex = GESTURE_LOG_SIZE;
let previousGesture = RL.Gesture.NONE;

const getGestureName = (gesture: RL.Gesture): string => {
  switch (gesture) {
    case RL.Gesture.NONE:
      return "None";
    case RL.Gesture.TAP:
      return "Tap";
    case RL.Gesture.DOUBLETAP:
      return "Double Tap";
    case RL.Gesture.HOLD:
      return "Hold";
    case RL.Gesture.DRAG:
      return "Drag";
    case RL.Gesture.SWIPE_RIGHT:
      return "Swipe Right";
    case RL.Gesture.SWIPE_LEFT:
      return "Swipe Left";
    case RL.Gesture.SWIPE_UP:
      return "Swipe Up";
    case RL.Gesture.SWIPE_DOWN:
      return "Swipe Down";
    case RL.Gesture.PINCH_IN:
      return "Pinch In";
    case RL.Gesture.PINCH_OUT:
      return "Pinch Out";
    default:
      return "Unknown";
  }
};

const getGestureColor = (gesture: RL.Gesture): RL.Color => {
  switch (gesture) {
    case RL.Gesture.NONE:
      return RL.Black;
    case RL.Gesture.TAP:
      return RL.Blue;
    case RL.Gesture.DOUBLETAP:
      return RL.SkyBlue;
    case RL.Gesture.HOLD:
      return RL.Black;
    case RL.Gesture.DRAG:
      return RL.Lime;
    case RL.Gesture.SWIPE_RIGHT:
    case RL.Gesture.SWIPE_LEFT:
    case RL.Gesture.SWIPE_UP:
    case RL.Gesture.SWIPE_DOWN:
      return RL.Red;
    case RL.Gesture.PINCH_IN:
      return RL.Violet;
    case RL.Gesture.PINCH_OUT:
      return RL.Orange;
    default:
      return RL.Black;
  }
};

let logMode = 1;
let gestureColor = new RL.Color(0, 0, 0, 255);
const logButton1 = new RL.Rectangle(53, 7, 48, 26);
const logButton2 = new RL.Rectangle(108, 7, 36, 26);
const gestureLogPosition = new RL.Vector2(10, 10);

let angleLength = 90.0;
let currentAngleDegrees = 0.0;
let finalVector = new RL.Vector2(0.0, 0.0);
const protractorPosition = new RL.Vector2(266.0, 315.0);

const update = () => {
  const currentGesture = RL.GetGestureDetected();
  const currentDragDegrees = RL.GetGestureDragAngle();
  const currentPitchDegrees = RL.GetGesturePinchAngle();
  const touchCount = RL.GetTouchPointCount();

  if (
    currentGesture !== RL.Gesture.NONE &&
    currentGesture !== RL.Gesture.HOLD &&
    currentGesture !== previousGesture
  ) {
    lastGesture = currentGesture;
  }

  if (RL.IsMouseButtonReleased(RL.MouseButton.LEFT)) {
    if (RL.CheckCollisionPointRec(RL.GetMousePosition(), logButton1)) {
      switch (logMode) {
        case 3:
          logMode = 2;
          break;
        case 2:
          logMode = 3;
          break;
        case 1:
          logMode = 0;
          break;
        default:
          logMode = 1;
          break;
      }
    } else if (RL.CheckCollisionPointRec(RL.GetMousePosition(), logButton2)) {
      switch (logMode) {
        case 3:
          logMode = 1;
          break;
        case 2:
          logMode = 0;
          break;
        case 1:
          logMode = 3;
          break;
        default:
          logMode = 2;
          break;
      }
    }
  }

  let fillLog = false;
  if (currentGesture !== RL.Gesture.NONE) {
    if (logMode === 3) {
      if (
        ((currentGesture !== RL.Gesture.HOLD && currentGesture !== previousGesture) ||
          currentGesture < RL.Gesture.DOUBLETAP + 1)
      ) {
        fillLog = true;
      }
    } else if (logMode === 2) {
      if (currentGesture !== RL.Gesture.HOLD) fillLog = true;
    } else if (logMode === 1) {
      if (currentGesture !== previousGesture) fillLog = true;
    } else {
      fillLog = true;
    }
  }

  if (fillLog) {
    previousGesture = currentGesture;
    gestureColor = getGestureColor(currentGesture);
    if (gestureLogIndex <= 0) gestureLogIndex = GESTURE_LOG_SIZE;
    gestureLogIndex--;
    gestureLog[gestureLogIndex] = getGestureName(currentGesture);
  }

  if (currentGesture > RL.Gesture.PINCH_OUT) {
    currentAngleDegrees = currentPitchDegrees;
  } else if (currentGesture > RL.Gesture.SWIPE_DOWN) {
    currentAngleDegrees = currentDragDegrees;
  } else if (currentGesture > RL.Gesture.NONE) {
    currentAngleDegrees = 0.0;
  }

  const currentAngleRadians = ((currentAngleDegrees + 90.0) * Math.PI) / 180.0;
  finalVector = new RL.Vector2(
    angleLength * Math.sin(currentAngleRadians) + protractorPosition.x,
    angleLength * Math.cos(currentAngleRadians) + protractorPosition.y,
  );

  const touchPositions: RL.Vector2[] = [];
  let mousePosition = new RL.Vector2(0, 0);
  if (currentGesture !== RL.Gesture.NONE) {
    if (touchCount !== 0) {
      for (let i = 0; i < touchCount; i++) {
        touchPositions.push(RL.GetTouchPosition(i));
      }
    } else {
      mousePosition = RL.GetMousePosition();
    }
  }

  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.DrawText("*", messagePosition.x + 5, messagePosition.y + 5, 10, RL.Black);
  RL.DrawText(
    "Example optimized for Web/HTML5\non Smartphones with Touch Screen.",
    messagePosition.x + 15,
    messagePosition.y + 5,
    10,
    RL.Black,
  );
  RL.DrawText("*", messagePosition.x + 5, messagePosition.y + 35, 10, RL.Black);
  RL.DrawText(
    "While running on Desktop Web Browsers,\ninspect and turn on Touch Emulation.",
    messagePosition.x + 15,
    messagePosition.y + 35,
    10,
    RL.Black,
  );

  RL.DrawText("Last gesture", lastGesturePosition.x + 33, lastGesturePosition.y - 47, 20, RL.Black);
  RL.DrawText("Swipe         Tap       Pinch  Touch", lastGesturePosition.x + 17, lastGesturePosition.y - 18, 10, RL.Black);
  RL.DrawRectangle(lastGesturePosition.x + 20, lastGesturePosition.y, 20, 20, lastGesture === RL.Gesture.SWIPE_UP ? RL.Red : RL.LightGray);
  RL.DrawRectangle(lastGesturePosition.x, lastGesturePosition.y + 20, 20, 20, lastGesture === RL.Gesture.SWIPE_LEFT ? RL.Red : RL.LightGray);
  RL.DrawRectangle(lastGesturePosition.x + 40, lastGesturePosition.y + 20, 20, 20, lastGesture === RL.Gesture.SWIPE_RIGHT ? RL.Red : RL.LightGray);
  RL.DrawRectangle(lastGesturePosition.x + 20, lastGesturePosition.y + 40, 20, 20, lastGesture === RL.Gesture.SWIPE_DOWN ? RL.Red : RL.LightGray);
  RL.DrawCircle(lastGesturePosition.x + 80, lastGesturePosition.y + 16, 10, lastGesture === RL.Gesture.TAP ? RL.Blue : RL.LightGray);
  RL.DrawRing(new RL.Vector2(lastGesturePosition.x + 103, lastGesturePosition.y + 16), 6.0, 11.0, 0.0, 360.0, 0, lastGesture === RL.Gesture.DRAG ? RL.Lime : RL.LightGray);
  RL.DrawCircle(lastGesturePosition.x + 80, lastGesturePosition.y + 43, 10, lastGesture === RL.Gesture.DOUBLETAP ? RL.SkyBlue : RL.LightGray);
  RL.DrawCircle(lastGesturePosition.x + 103, lastGesturePosition.y + 43, 10, lastGesture === RL.Gesture.DOUBLETAP ? RL.SkyBlue : RL.LightGray);
  RL.DrawTriangle(
    new RL.Vector2(lastGesturePosition.x + 122, lastGesturePosition.y + 16),
    new RL.Vector2(lastGesturePosition.x + 137, lastGesturePosition.y + 26),
    new RL.Vector2(lastGesturePosition.x + 137, lastGesturePosition.y + 6),
    lastGesture === RL.Gesture.PINCH_OUT ? RL.Orange : RL.LightGray,
  );
  RL.DrawTriangle(
    new RL.Vector2(lastGesturePosition.x + 147, lastGesturePosition.y + 6),
    new RL.Vector2(lastGesturePosition.x + 147, lastGesturePosition.y + 26),
    new RL.Vector2(lastGesturePosition.x + 162, lastGesturePosition.y + 16),
    lastGesture === RL.Gesture.PINCH_OUT ? RL.Orange : RL.LightGray,
  );
  RL.DrawTriangle(
    new RL.Vector2(lastGesturePosition.x + 125, lastGesturePosition.y + 33),
    new RL.Vector2(lastGesturePosition.x + 125, lastGesturePosition.y + 53),
    new RL.Vector2(lastGesturePosition.x + 140, lastGesturePosition.y + 43),
    lastGesture === RL.Gesture.PINCH_IN ? RL.Violet : RL.LightGray,
  );
  RL.DrawTriangle(
    new RL.Vector2(lastGesturePosition.x + 144, lastGesturePosition.y + 43),
    new RL.Vector2(lastGesturePosition.x + 159, lastGesturePosition.y + 53),
    new RL.Vector2(lastGesturePosition.x + 159, lastGesturePosition.y + 33),
    lastGesture === RL.Gesture.PINCH_IN ? RL.Violet : RL.LightGray,
  );
  for (let i = 0; i < 4; i++) {
    RL.DrawCircle(
      lastGesturePosition.x + 180,
      lastGesturePosition.y + 7 + i * 15,
      5,
      touchCount <= i ? RL.LightGray : gestureColor,
    );
  }

  RL.DrawText("Log", gestureLogPosition.x, gestureLogPosition.y, 20, RL.Black);
  for (let i = 0, ii = gestureLogIndex; i < GESTURE_LOG_SIZE; i++, ii = (ii + 1) % GESTURE_LOG_SIZE) {
    RL.DrawText(
      gestureLog[ii],
      gestureLogPosition.x,
      gestureLogPosition.y + 410 - i * 20,
      20,
      i === 0 ? gestureColor : RL.LightGray,
    );
  }

  let logButton1Color = RL.Gray;
  let logButton2Color = RL.Gray;
  switch (logMode) {
    case 3:
      logButton1Color = RL.Maroon;
      logButton2Color = RL.Maroon;
      break;
    case 2:
      logButton1Color = RL.Gray;
      logButton2Color = RL.Maroon;
      break;
    case 1:
      logButton1Color = RL.Maroon;
      logButton2Color = RL.Gray;
      break;
    default:
      logButton1Color = RL.Gray;
      logButton2Color = RL.Gray;
      break;
  }

  RL.DrawRectangleRec(logButton1, logButton1Color);
  RL.DrawText("Hide", logButton1.x + 7, logButton1.y + 3, 10, RL.White);
  RL.DrawText("Repeat", logButton1.x + 7, logButton1.y + 13, 10, RL.White);
  RL.DrawRectangleRec(logButton2, logButton2Color);
  RL.DrawText("Hide", logButton1.x + 62, logButton1.y + 3, 10, RL.White);
  RL.DrawText("Hold", logButton1.x + 62, logButton1.y + 13, 10, RL.White);

  RL.DrawText("Angle", protractorPosition.x + 55, protractorPosition.y + 76, 10, RL.Black);
  const angleString = currentAngleDegrees.toFixed(2);
  RL.DrawText(angleString, protractorPosition.x + 55, protractorPosition.y + 92, 20, gestureColor);
  RL.DrawCircleV(protractorPosition, 80.0, RL.White);
  RL.DrawLineEx(new RL.Vector2(protractorPosition.x - 90, protractorPosition.y), new RL.Vector2(protractorPosition.x + 90, protractorPosition.y), 3.0, RL.LightGray);
  RL.DrawLineEx(new RL.Vector2(protractorPosition.x, protractorPosition.y - 90), new RL.Vector2(protractorPosition.x, protractorPosition.y + 90), 3.0, RL.LightGray);
  RL.DrawLineEx(new RL.Vector2(protractorPosition.x - 80, protractorPosition.y - 45), new RL.Vector2(protractorPosition.x + 80, protractorPosition.y + 45), 3.0, RL.Green);
  RL.DrawLineEx(new RL.Vector2(protractorPosition.x - 80, protractorPosition.y + 45), new RL.Vector2(protractorPosition.x + 80, protractorPosition.y - 45), 3.0, RL.Green);
  RL.DrawText("0", protractorPosition.x + 96, protractorPosition.y - 9, 20, RL.Black);
  RL.DrawText("30", protractorPosition.x + 74, protractorPosition.y - 68, 20, RL.Black);
  RL.DrawText("90", protractorPosition.x - 11, protractorPosition.y - 110, 20, RL.Black);
  RL.DrawText("150", protractorPosition.x - 100, protractorPosition.y - 68, 20, RL.Black);
  RL.DrawText("180", protractorPosition.x - 124, protractorPosition.y - 9, 20, RL.Black);
  RL.DrawText("210", protractorPosition.x - 100, protractorPosition.y + 50, 20, RL.Black);
  RL.DrawText("270", protractorPosition.x - 18, protractorPosition.y + 92, 20, RL.Black);
  RL.DrawText("330", protractorPosition.x + 72, protractorPosition.y + 50, 20, RL.Black);
  if (currentAngleDegrees !== 0.0) RL.DrawLineEx(protractorPosition, finalVector, 3.0, gestureColor);

  if (currentGesture !== RL.Gesture.NONE) {
    if (touchCount !== 0) {
      for (let i = 0; i < touchCount; i++) {
        RL.DrawCircleV(touchPositions[i], 50.0, RL.Fade(gestureColor, 0.5));
        RL.DrawCircleV(touchPositions[i], 5.0, gestureColor);
      }

      if (touchCount === 2) {
        RL.DrawLineEx(
          touchPositions[0],
          touchPositions[1],
          currentGesture === RL.Gesture.PINCH_OUT ? 8 : 12,
          gestureColor,
        );
      }
    } else {
      RL.DrawCircleV(mousePosition, 35.0, RL.Fade(gestureColor, 0.5));
      RL.DrawCircleV(mousePosition, 5.0, gestureColor);
    }
  }

  RL.EndDrawing();
};

// Initialization
//--------------------------------------------------------------------------------------
RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - input gestures web");
//--------------------------------------------------------------------------------------

RL.SetTargetFPS(60);
while (!RL.WindowShouldClose()) {
  update();
}

RL.CloseWindow();
