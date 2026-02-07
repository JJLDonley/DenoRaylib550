import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - draw rectangle rounded");

let roundness = 0.2;
let width = 200.0;
let height = 100.0;
let segments = 0.0;
let lineThick = 1.0;

let drawRect = false;
let drawRoundedRect = true;
let drawRoundedLines = false;

let selected = 0; // 0-width,1-height,2-roundness,3-thickness,4-segments

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyPressed(RL.KeyboardKey.ONE)) selected = 0;
  if (RL.IsKeyPressed(RL.KeyboardKey.TWO)) selected = 1;
  if (RL.IsKeyPressed(RL.KeyboardKey.THREE)) selected = 2;
  if (RL.IsKeyPressed(RL.KeyboardKey.FOUR)) selected = 3;
  if (RL.IsKeyPressed(RL.KeyboardKey.FIVE)) selected = 4;

  if (RL.IsKeyPressed(RL.KeyboardKey.R)) drawRoundedRect = !drawRoundedRect;
  if (RL.IsKeyPressed(RL.KeyboardKey.L)) drawRoundedLines = !drawRoundedLines;
  if (RL.IsKeyPressed(RL.KeyboardKey.D)) drawRect = !drawRect;

  const wheel = RL.GetMouseWheelMove();
  const deltaKey = (RL.IsKeyDown(RL.KeyboardKey.RIGHT) || RL.IsKeyDown(RL.KeyboardKey.UP)) ? 1 :
    (RL.IsKeyDown(RL.KeyboardKey.LEFT) || RL.IsKeyDown(RL.KeyboardKey.DOWN)) ? -1 : 0;
  const step = RL.IsKeyDown(RL.KeyboardKey.LEFT_SHIFT) || RL.IsKeyDown(RL.KeyboardKey.RIGHT_SHIFT) ? 5 : 1;
  const delta = (deltaKey * step) + wheel * 5;

  if (delta !== 0) {
    if (selected === 0) width = clamp(width + delta, 0, RL.GetScreenWidth() - 300);
    else if (selected === 1) height = clamp(height + delta, 0, RL.GetScreenHeight() - 50);
    else if (selected === 2) roundness = clamp(roundness + delta / 100, 0.0, 1.0);
    else if (selected === 3) lineThick = clamp(lineThick + delta, 0, 20);
    else if (selected === 4) segments = clamp(segments + delta, 0, 60);
  }

  const rec = new RL.Rectangle(
    (RL.GetScreenWidth() - width - 250) / 2,
    (RL.GetScreenHeight() - height) / 2.0,
    width,
    height,
  );

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawLine(560, 0, 560, RL.GetScreenHeight(), RL.Fade(RL.LightGray, 0.6));
  RL.DrawRectangle(560, 0, RL.GetScreenWidth() - 500, RL.GetScreenHeight(), RL.Fade(RL.LightGray, 0.3));

  if (drawRect) RL.DrawRectangleRec(rec, RL.Fade(RL.Gold, 0.6));
  if (drawRoundedRect) RL.DrawRectangleRounded(rec, roundness, Math.trunc(segments), RL.Fade(RL.Maroon, 0.2));
  if (drawRoundedLines) RL.DrawRectangleRoundedLinesEx(rec, roundness, Math.trunc(segments), lineThick, RL.Fade(RL.Maroon, 0.4));

  RL.DrawText("[1] Width", 640, 40, 10, selected === 0 ? RL.Maroon : RL.DarkGray);
  RL.DrawText(`Value: ${width.toFixed(2)}`, 640, 55, 10, RL.DarkGray);

  RL.DrawText("[2] Height", 640, 80, 10, selected === 1 ? RL.Maroon : RL.DarkGray);
  RL.DrawText(`Value: ${height.toFixed(2)}`, 640, 95, 10, RL.DarkGray);

  RL.DrawText("[3] Roundness", 640, 130, 10, selected === 2 ? RL.Maroon : RL.DarkGray);
  RL.DrawText(`Value: ${roundness.toFixed(2)}`, 640, 145, 10, RL.DarkGray);

  RL.DrawText("[4] Thickness", 640, 170, 10, selected === 3 ? RL.Maroon : RL.DarkGray);
  RL.DrawText(`Value: ${lineThick.toFixed(2)}`, 640, 185, 10, RL.DarkGray);

  RL.DrawText("[5] Segments", 640, 220, 10, selected === 4 ? RL.Maroon : RL.DarkGray);
  RL.DrawText(`Value: ${segments.toFixed(2)}`, 640, 235, 10, RL.DarkGray);

  const mode = segments >= 4 ? "MANUAL" : "AUTO";
  RL.DrawText(`MODE: ${mode}`, 640, 260, 10, segments >= 4 ? RL.Maroon : RL.DarkGray);
  RL.DrawText("R rounded, L lines, D rect", 640, 280, 10, RL.Gray);
  RL.DrawText("Arrows/Wheel adjust, Shift=+5", 640, 295, 10, RL.Gray);

  RL.DrawFPS(10, 10);
  RL.EndDrawing();
}

RL.CloseWindow();
