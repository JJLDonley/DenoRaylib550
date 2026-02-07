import * as RL from "raylib";

const MAX_COLORS_COUNT = 21;

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - colors palette");

const colors: RL.Color[] = [
  RL.DarkGray,
  RL.Maroon,
  RL.Orange,
  RL.DarkGreen,
  RL.DarkBlue,
  RL.DarkPurple,
  RL.DarkBrown,
  RL.Gray,
  RL.Red,
  RL.Gold,
  RL.Lime,
  RL.Blue,
  RL.Violet,
  RL.Brown,
  RL.LightGray,
  RL.Pink,
  RL.Yellow,
  RL.Green,
  RL.SkyBlue,
  RL.Purple,
  RL.Beige,
];

const colorNames = [
  "DARKGRAY",
  "MAROON",
  "ORANGE",
  "DARKGREEN",
  "DARKBLUE",
  "DARKPURPLE",
  "DARKBROWN",
  "GRAY",
  "RED",
  "GOLD",
  "LIME",
  "BLUE",
  "VIOLET",
  "BROWN",
  "LIGHTGRAY",
  "PINK",
  "YELLOW",
  "GREEN",
  "SKYBLUE",
  "PURPLE",
  "BEIGE",
];

const colorsRecs: RL.Rectangle[] = Array.from({ length: MAX_COLORS_COUNT }, () => new RL.Rectangle(0, 0, 0, 0));
for (let i = 0; i < MAX_COLORS_COUNT; i++) {
  colorsRecs[i].x = 20.0 + 100.0 * (i % 7) + 10.0 * (i % 7);
  colorsRecs[i].y = 80.0 + 100.0 * Math.trunc(i / 7) + 10.0 * Math.trunc(i / 7);
  colorsRecs[i].width = 100.0;
  colorsRecs[i].height = 100.0;
}

const colorState: number[] = Array.from({ length: MAX_COLORS_COUNT }, () => 0);
let mousePoint = new RL.Vector2(0.0, 0.0);

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  mousePoint = RL.GetMousePosition();

  for (let i = 0; i < MAX_COLORS_COUNT; i++) {
    colorState[i] = RL.CheckCollisionPointRec(mousePoint, colorsRecs[i]) ? 1 : 0;
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawText("raylib colors palette", 28, 42, 20, RL.Black);
  RL.DrawText("press SPACE to see all colors", RL.GetScreenWidth() - 180, RL.GetScreenHeight() - 40, 10, RL.Gray);

  for (let i = 0; i < MAX_COLORS_COUNT; i++) {
    RL.DrawRectangleRec(colorsRecs[i], RL.Fade(colors[i], colorState[i] ? 0.6 : 1.0));

    if (RL.IsKeyDown(RL.KeyboardKey.SPACE) || colorState[i]) {
      RL.DrawRectangle(
        Math.trunc(colorsRecs[i].x),
        Math.trunc(colorsRecs[i].y + colorsRecs[i].height - 26),
        Math.trunc(colorsRecs[i].width),
        20,
        RL.Black,
      );
      RL.DrawRectangleLinesEx(colorsRecs[i], 6, RL.Fade(RL.Black, 0.3));
      const name = colorNames[i];
      RL.DrawText(
        name,
        Math.trunc(colorsRecs[i].x + colorsRecs[i].width - RL.MeasureText(name, 10) - 12),
        Math.trunc(colorsRecs[i].y + colorsRecs[i].height - 20),
        10,
        colors[i],
      );
    }
  }

  RL.EndDrawing();
}

RL.CloseWindow();
