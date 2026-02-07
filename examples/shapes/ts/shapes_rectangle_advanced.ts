import * as RL from "raylib";

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function lerpColor(a: RL.Color, b: RL.Color, t: number): RL.Color {
  const tt = clamp(t, 0, 1);
  const r = Math.round(a.r + (b.r - a.r) * tt);
  const g = Math.round(a.g + (b.g - a.g) * tt);
  const bch = Math.round(a.b + (b.b - a.b) * tt);
  const aCh = Math.round(a.a + (b.a - a.a) * tt);
  return new RL.Color(r, g, bch, aCh);
}

function drawRoundedGradientH(rec: RL.Rectangle, roundnessLeft: number, roundnessRight: number, _segments: number, left: RL.Color, right: RL.Color): void {
  if ((roundnessLeft <= 0.0 && roundnessRight <= 0.0) || rec.width < 1 || rec.height < 1) {
    RL.DrawRectangleGradientH(Math.trunc(rec.x), Math.trunc(rec.y), Math.trunc(rec.width), Math.trunc(rec.height), left, right);
    return;
  }

  roundnessLeft = clamp(roundnessLeft, 0.0, 1.0);
  roundnessRight = clamp(roundnessRight, 0.0, 1.0);

  const recSize = rec.width > rec.height ? rec.height : rec.width;
  const radiusLeft = Math.max(0.0, (recSize * roundnessLeft) / 2.0);
  const radiusRight = Math.max(0.0, (recSize * roundnessRight) / 2.0);

  const width = Math.max(1, Math.trunc(rec.width));
  const height = Math.max(1, Math.trunc(rec.height));

  for (let x = 0; x < width; x++) {
    const t = width <= 1 ? 0 : x / (width - 1);
    const color = lerpColor(left, right, t);

    let top = 0;
    let bottom = height;

    if (radiusLeft > 0 && x < radiusLeft) {
      const dx = radiusLeft - x;
      const yOffset = Math.sqrt(Math.max(0, radiusLeft * radiusLeft - dx * dx));
      top = radiusLeft - yOffset;
      bottom = height - (radiusLeft - yOffset);
    } else if (radiusRight > 0 && x > (width - radiusRight)) {
      const dx = x - (width - radiusRight);
      const yOffset = Math.sqrt(Math.max(0, radiusRight * radiusRight - dx * dx));
      top = radiusRight - yOffset;
      bottom = height - (radiusRight - yOffset);
    }

    const drawHeight = Math.max(0, Math.trunc(bottom - top));
    if (drawHeight > 0) {
      RL.DrawRectangle(Math.trunc(rec.x + x), Math.trunc(rec.y + top), 1, drawHeight, color);
    }
  }
}

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - rectangle advanced");
RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  const width = RL.GetScreenWidth() / 2.0;
  const height = RL.GetScreenHeight() / 6.0;
  const rec = new RL.Rectangle(
    RL.GetScreenWidth() / 2.0 - width / 2.0,
    RL.GetScreenHeight() / 2.0 - (5) * (height / 2.0),
    width,
    height,
  );

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  drawRoundedGradientH(rec, 0.8, 0.8, 36, RL.Blue, RL.Red);

  rec.y += rec.height + 1;
  drawRoundedGradientH(rec, 0.5, 1.0, 36, RL.Red, RL.Pink);

  rec.y += rec.height + 1;
  drawRoundedGradientH(rec, 1.0, 0.5, 36, RL.Red, RL.Blue);

  rec.y += rec.height + 1;
  drawRoundedGradientH(rec, 0.0, 1.0, 36, RL.Blue, RL.Black);

  rec.y += rec.height + 1;
  drawRoundedGradientH(rec, 1.0, 0.0, 36, RL.Blue, RL.Pink);

  RL.EndDrawing();
}

RL.CloseWindow();
