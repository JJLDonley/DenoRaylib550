import * as RL from "raylib";

const MOUSE_SCALE_MARK_SIZE = 12;

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - rectangle scaling mouse");

const rec = new RL.Rectangle(100, 100, 200, 80);
let mousePosition = new RL.Vector2(0, 0);

let mouseScaleReady = false;
let mouseScaleMode = false;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  mousePosition = RL.GetMousePosition();

  const scaleHandle = new RL.Rectangle(
    rec.x + rec.width - MOUSE_SCALE_MARK_SIZE,
    rec.y + rec.height - MOUSE_SCALE_MARK_SIZE,
    MOUSE_SCALE_MARK_SIZE,
    MOUSE_SCALE_MARK_SIZE,
  );

  if (RL.CheckCollisionPointRec(mousePosition, scaleHandle)) {
    mouseScaleReady = true;
    if (RL.IsMouseButtonPressed(RL.MouseButton.LEFT)) mouseScaleMode = true;
  } else {
    mouseScaleReady = false;
  }

  if (mouseScaleMode) {
    mouseScaleReady = true;

    rec.width = mousePosition.x - rec.x;
    rec.height = mousePosition.y - rec.y;

    if (rec.width < MOUSE_SCALE_MARK_SIZE) rec.width = MOUSE_SCALE_MARK_SIZE;
    if (rec.height < MOUSE_SCALE_MARK_SIZE) rec.height = MOUSE_SCALE_MARK_SIZE;

    if (rec.width > (RL.GetScreenWidth() - rec.x)) rec.width = RL.GetScreenWidth() - rec.x;
    if (rec.height > (RL.GetScreenHeight() - rec.y)) rec.height = RL.GetScreenHeight() - rec.y;

    if (RL.IsMouseButtonReleased(RL.MouseButton.LEFT)) mouseScaleMode = false;
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawText("Scale rectangle dragging from bottom-right corner!", 10, 10, 20, RL.Gray);

  RL.DrawRectangleRec(rec, RL.Fade(RL.Green, 0.5));

  if (mouseScaleReady) {
    RL.DrawRectangleLinesEx(rec, 1, RL.Red);
    RL.DrawTriangle(
      new RL.Vector2(rec.x + rec.width - MOUSE_SCALE_MARK_SIZE, rec.y + rec.height),
      new RL.Vector2(rec.x + rec.width, rec.y + rec.height),
      new RL.Vector2(rec.x + rec.width, rec.y + rec.height - MOUSE_SCALE_MARK_SIZE),
      RL.Red,
    );
  }

  RL.EndDrawing();
}

RL.CloseWindow();
