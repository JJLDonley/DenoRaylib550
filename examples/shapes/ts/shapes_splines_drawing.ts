import * as RL from "raylib";

const MAX_SPLINE_POINTS = 32;

type ControlPoint = { start: RL.Vector2; end: RL.Vector2 };

enum SplineType {
  LINEAR = 0,
  BASIS = 1,
  CATMULLROM = 2,
  BEZIER = 3,
}

const screenWidth = 800;
const screenHeight = 450;

RL.SetConfigFlags(RL.ConfigFlags.MSAA_4X_HINT);
RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - splines drawing");

const points: RL.Vector2[] = [
  new RL.Vector2(50.0, 400.0),
  new RL.Vector2(160.0, 220.0),
  new RL.Vector2(340.0, 380.0),
  new RL.Vector2(520.0, 60.0),
  new RL.Vector2(710.0, 260.0),
];

let pointCount = 5;
let selectedPoint = -1;
let focusedPoint = -1;

const control: ControlPoint[] = Array.from({ length: MAX_SPLINE_POINTS - 1 }, () => ({
  start: new RL.Vector2(0, 0),
  end: new RL.Vector2(0, 0),
}));

for (let i = 0; i < pointCount - 1; i++) {
  control[i].start = new RL.Vector2(points[i].x + 50, points[i].y);
  control[i].end = new RL.Vector2(points[i + 1].x - 50, points[i + 1].y);
}

let splineThickness = 8.0;
let splineTypeActive = SplineType.LINEAR;
let splineHelpersActive = true;

let focusedControl = { index: -1, which: "start" as "start" | "end" };
let selectedControl = { index: -1, which: "start" as "start" | "end" };

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsMouseButtonPressed(RL.MouseButton.RIGHT) && pointCount < MAX_SPLINE_POINTS) {
    points[pointCount] = RL.GetMousePosition();
    const i = pointCount - 1;
    control[i].start = new RL.Vector2(points[i].x + 50, points[i].y);
    control[i].end = new RL.Vector2(points[i + 1].x - 50, points[i + 1].y);
    pointCount++;
  }

  const mouse = RL.GetMousePosition();

  focusedPoint = -1;
  for (let i = 0; i < pointCount; i++) {
    if (RL.CheckCollisionPointCircle(mouse, points[i], 8.0)) {
      focusedPoint = i;
      if (RL.IsMouseButtonDown(RL.MouseButton.LEFT)) selectedPoint = i;
      break;
    }
  }

  if (selectedPoint >= 0) {
    points[selectedPoint] = mouse;
    if (RL.IsMouseButtonReleased(RL.MouseButton.LEFT)) selectedPoint = -1;
  }

  focusedControl.index = -1;
  if (splineTypeActive === SplineType.BEZIER && focusedPoint === -1) {
    for (let i = 0; i < pointCount - 1; i++) {
      if (RL.CheckCollisionPointCircle(mouse, control[i].start, 6.0)) {
        focusedControl = { index: i, which: "start" };
        if (RL.IsMouseButtonDown(RL.MouseButton.LEFT)) selectedControl = { index: i, which: "start" };
        break;
      } else if (RL.CheckCollisionPointCircle(mouse, control[i].end, 6.0)) {
        focusedControl = { index: i, which: "end" };
        if (RL.IsMouseButtonDown(RL.MouseButton.LEFT)) selectedControl = { index: i, which: "end" };
        break;
      }
    }

    if (selectedControl.index >= 0) {
      if (selectedControl.which === "start") control[selectedControl.index].start = mouse;
      else control[selectedControl.index].end = mouse;
      if (RL.IsMouseButtonReleased(RL.MouseButton.LEFT)) selectedControl = { index: -1, which: "start" };
    }
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.ONE)) splineTypeActive = SplineType.LINEAR;
  else if (RL.IsKeyPressed(RL.KeyboardKey.TWO)) splineTypeActive = SplineType.BASIS;
  else if (RL.IsKeyPressed(RL.KeyboardKey.THREE)) splineTypeActive = SplineType.CATMULLROM;
  else if (RL.IsKeyPressed(RL.KeyboardKey.FOUR)) splineTypeActive = SplineType.BEZIER;

  if (RL.IsKeyPressed(RL.KeyboardKey.H)) splineHelpersActive = !splineHelpersActive;
  if (RL.IsKeyDown(RL.KeyboardKey.UP)) splineThickness = Math.min(40.0, splineThickness + 0.5);
  if (RL.IsKeyDown(RL.KeyboardKey.DOWN)) splineThickness = Math.max(1.0, splineThickness - 0.5);

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  if (splineTypeActive === SplineType.LINEAR) {
    RL.DrawSplineLinear(points.slice(0, pointCount), splineThickness, RL.Red);
  } else if (splineTypeActive === SplineType.BASIS) {
    RL.DrawSplineBasis(points.slice(0, pointCount), splineThickness, RL.Red);
  } else if (splineTypeActive === SplineType.CATMULLROM) {
    RL.DrawSplineCatmullRom(points.slice(0, pointCount), splineThickness, RL.Red);
  } else if (splineTypeActive === SplineType.BEZIER) {
    const pointsInterleaved: RL.Vector2[] = [];
    for (let i = 0; i < pointCount - 1; i++) {
      pointsInterleaved.push(points[i]);
      pointsInterleaved.push(control[i].start);
      pointsInterleaved.push(control[i].end);
    }
    pointsInterleaved.push(points[pointCount - 1]);

    RL.DrawSplineBezierCubic(pointsInterleaved, splineThickness, RL.Red);

    for (let i = 0; i < pointCount - 1; i++) {
      RL.DrawCircleV(control[i].start, 6, RL.Gold);
      RL.DrawCircleV(control[i].end, 6, RL.Gold);
      if (focusedControl.index === i && focusedControl.which === "start") RL.DrawCircleV(control[i].start, 8, RL.Green);
      else if (focusedControl.index === i && focusedControl.which === "end") RL.DrawCircleV(control[i].end, 8, RL.Green);

      RL.DrawLineEx(points[i], control[i].start, 1.0, RL.LightGray);
      RL.DrawLineEx(points[i + 1], control[i].end, 1.0, RL.LightGray);
      RL.DrawLineV(points[i], control[i].start, RL.Gray);
      RL.DrawLineV(control[i].end, points[i + 1], RL.Gray);
    }
  }

  if (splineHelpersActive) {
    for (let i = 0; i < pointCount; i++) {
      const focused = focusedPoint === i;
      RL.DrawCircleLinesV(points[i], focused ? 12.0 : 8.0, focused ? RL.Blue : RL.DarkBlue);
      if (splineTypeActive !== SplineType.LINEAR && splineTypeActive !== SplineType.BEZIER && i < pointCount - 1) {
        RL.DrawLineV(points[i], points[i + 1], RL.Gray);
      }
      RL.DrawText(`[${points[i].x.toFixed(0)}, ${points[i].y.toFixed(0)}]`, Math.trunc(points[i].x), Math.trunc(points[i].y + 10), 10, RL.Black);
    }
  }

  RL.DrawText("Spline type: 1-Linear 2-BSpline 3-CatmullRom 4-Bezier", 12, 10, 10, RL.DarkGray);
  RL.DrawText(`Spline thickness: ${Math.trunc(splineThickness)} (Up/Down)`, 12, 26, 10, RL.DarkGray);
  RL.DrawText("Right click: add point | H: helpers", 12, 42, 10, RL.DarkGray);

  RL.EndDrawing();
}

RL.CloseWindow();
