import * as RL from "raylib";

// Initialization
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - basic shapes drawing");

let rotation = 0.0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  rotation += 0.2;

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawText("some basic shapes available on raylib", 20, 20, 20, RL.DarkGray);

  // Circle shapes and lines
  RL.DrawCircle(Math.trunc(screenWidth / 5), 120, 35, RL.DarkBlue);
  RL.DrawCircleGradient(Math.trunc(screenWidth / 5), 220, 60, RL.Green, RL.SkyBlue);
  RL.DrawCircleLines(Math.trunc(screenWidth / 5), 340, 80, RL.DarkBlue);

  // Rectangle shapes and lines
  RL.DrawRectangle(Math.trunc(screenWidth / 4 * 2 - 60), 100, 120, 60, RL.Red);
  RL.DrawRectangleGradientH(Math.trunc(screenWidth / 4 * 2 - 90), 170, 180, 130, RL.Maroon, RL.Gold);
  RL.DrawRectangleLines(Math.trunc(screenWidth / 4 * 2 - 40), 320, 80, 60, RL.Orange);

  // Triangle shapes and lines
  RL.DrawTriangle(
    new RL.Vector2(screenWidth / 4.0 * 3.0, 80.0),
    new RL.Vector2(screenWidth / 4.0 * 3.0 - 60.0, 150.0),
    new RL.Vector2(screenWidth / 4.0 * 3.0 + 60.0, 150.0),
    RL.Violet,
  );

  RL.DrawTriangleLines(
    new RL.Vector2(screenWidth / 4.0 * 3.0, 160.0),
    new RL.Vector2(screenWidth / 4.0 * 3.0 - 20.0, 230.0),
    new RL.Vector2(screenWidth / 4.0 * 3.0 + 20.0, 230.0),
    RL.DarkBlue,
  );

  // Polygon shapes and lines
  RL.DrawPoly(new RL.Vector2(screenWidth / 4.0 * 3, 330), 6, 80, rotation, RL.Brown);
  RL.DrawPolyLines(new RL.Vector2(screenWidth / 4.0 * 3, 330), 6, 90, rotation, RL.Brown);
  RL.DrawPolyLinesEx(new RL.Vector2(screenWidth / 4.0 * 3, 330), 6, 85, rotation, 6, RL.Beige);

  RL.DrawLine(18, 42, screenWidth - 18, 42, RL.Black);

  RL.EndDrawing();
}

RL.CloseWindow();
