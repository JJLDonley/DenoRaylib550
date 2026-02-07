import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - draw circle sector");

const center = new RL.Vector2((RL.GetScreenWidth() - 300) / 2.0, RL.GetScreenHeight() / 2.0);

let outerRadius = 180.0;
let startAngle = 0.0;
let endAngle = 180.0;
let segments = 10.0;

let selected = 0; // 0-startAngle,1-endAngle,2-radius,3-segments

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyPressed(RL.KeyboardKey.ONE)) selected = 0;
  if (RL.IsKeyPressed(RL.KeyboardKey.TWO)) selected = 1;
  if (RL.IsKeyPressed(RL.KeyboardKey.THREE)) selected = 2;
  if (RL.IsKeyPressed(RL.KeyboardKey.FOUR)) selected = 3;

  const wheel = RL.GetMouseWheelMove();
  const deltaKey = (RL.IsKeyDown(RL.KeyboardKey.RIGHT) || RL.IsKeyDown(RL.KeyboardKey.UP)) ? 1 :
    (RL.IsKeyDown(RL.KeyboardKey.LEFT) || RL.IsKeyDown(RL.KeyboardKey.DOWN)) ? -1 : 0;
  const step = RL.IsKeyDown(RL.KeyboardKey.LEFT_SHIFT) || RL.IsKeyDown(RL.KeyboardKey.RIGHT_SHIFT) ? 5 : 1;
  const delta = (deltaKey * step) + wheel * 5;

  if (delta !== 0) {
    if (selected === 0) startAngle = clamp(startAngle + delta, 0, 720);
    else if (selected === 1) endAngle = clamp(endAngle + delta, 0, 720);
    else if (selected === 2) outerRadius = clamp(outerRadius + delta, 0, 200);
    else if (selected === 3) segments = clamp(segments + delta, 0, 100);
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawLine(500, 0, 500, RL.GetScreenHeight(), RL.Fade(RL.LightGray, 0.6));
  RL.DrawRectangle(500, 0, RL.GetScreenWidth() - 500, RL.GetScreenHeight(), RL.Fade(RL.LightGray, 0.3));

  RL.DrawCircleSector(center, outerRadius, startAngle, endAngle, Math.trunc(segments), RL.Fade(RL.Maroon, 0.3));
  RL.DrawCircleSectorLines(center, outerRadius, startAngle, endAngle, Math.trunc(segments), RL.Fade(RL.Maroon, 0.6));

  const minSegments = Math.trunc(Math.ceil((endAngle - startAngle) / 90));
  const mode = segments >= minSegments ? "MANUAL" : "AUTO";

  RL.DrawText("[1] StartAngle", 600, 40, 10, selected === 0 ? RL.Maroon : RL.DarkGray);
  RL.DrawText(`Value: ${startAngle.toFixed(2)}`, 600, 55, 10, RL.DarkGray);

  RL.DrawText("[2] EndAngle", 600, 80, 10, selected === 1 ? RL.Maroon : RL.DarkGray);
  RL.DrawText(`Value: ${endAngle.toFixed(2)}`, 600, 95, 10, RL.DarkGray);

  RL.DrawText("[3] Radius", 600, 130, 10, selected === 2 ? RL.Maroon : RL.DarkGray);
  RL.DrawText(`Value: ${outerRadius.toFixed(2)}`, 600, 145, 10, RL.DarkGray);

  RL.DrawText("[4] Segments", 600, 170, 10, selected === 3 ? RL.Maroon : RL.DarkGray);
  RL.DrawText(`Value: ${segments.toFixed(2)}`, 600, 185, 10, RL.DarkGray);

  RL.DrawText(`MODE: ${mode}`, 600, 210, 10, segments >= minSegments ? RL.Maroon : RL.DarkGray);
  RL.DrawText("Arrows/Wheel adjust, Shift=+5", 600, 230, 10, RL.Gray);

  RL.DrawFPS(10, 10);
  RL.EndDrawing();
}

RL.CloseWindow();
