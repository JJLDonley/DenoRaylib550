import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

// RL.SetConfigFlags(RL.ConfigFlags.VSYNC_HINT | RL.ConfigFlags.MSAA_4X_HINT | RL.ConfigFlags.WINDOW_HIGHDPI);
RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - window flags");

const ballPosition = new RL.Vector2(RL.GetScreenWidth() / 2.0, RL.GetScreenHeight() / 2.0);
const ballSpeed = new RL.Vector2(5.0, 4.0);
const ballRadius = 20;

let framesCounter = 0;

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyPressed(RL.KeyboardKey.F)) RL.ToggleFullscreen();

  if (RL.IsKeyPressed(RL.KeyboardKey.R)) {
    if (RL.IsWindowState(RL.ConfigFlags.WINDOW_RESIZABLE)) RL.ClearWindowState(RL.ConfigFlags.WINDOW_RESIZABLE);
    else RL.SetWindowState(RL.ConfigFlags.WINDOW_RESIZABLE);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.D)) {
    if (RL.IsWindowState(RL.ConfigFlags.WINDOW_UNDECORATED)) RL.ClearWindowState(RL.ConfigFlags.WINDOW_UNDECORATED);
    else RL.SetWindowState(RL.ConfigFlags.WINDOW_UNDECORATED);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.H)) {
    if (!RL.IsWindowState(RL.ConfigFlags.WINDOW_HIDDEN)) RL.SetWindowState(RL.ConfigFlags.WINDOW_HIDDEN);
    framesCounter = 0;
  }

  if (RL.IsWindowState(RL.ConfigFlags.WINDOW_HIDDEN)) {
    framesCounter++;
    if (framesCounter >= 240) RL.ClearWindowState(RL.ConfigFlags.WINDOW_HIDDEN);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.N)) {
    if (!RL.IsWindowState(RL.ConfigFlags.WINDOW_MINIMIZED)) RL.MinimizeWindow();
    framesCounter = 0;
  }

  if (RL.IsWindowState(RL.ConfigFlags.WINDOW_MINIMIZED)) {
    framesCounter++;
    if (framesCounter >= 240) RL.RestoreWindow();
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.M)) {
    if (RL.IsWindowState(RL.ConfigFlags.WINDOW_MAXIMIZED)) RL.RestoreWindow();
    else RL.MaximizeWindow();
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.U)) {
    if (RL.IsWindowState(RL.ConfigFlags.WINDOW_UNFOCUSED)) RL.ClearWindowState(RL.ConfigFlags.WINDOW_UNFOCUSED);
    else RL.SetWindowState(RL.ConfigFlags.WINDOW_UNFOCUSED);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.T)) {
    if (RL.IsWindowState(RL.ConfigFlags.WINDOW_TOPMOST)) RL.ClearWindowState(RL.ConfigFlags.WINDOW_TOPMOST);
    else RL.SetWindowState(RL.ConfigFlags.WINDOW_TOPMOST);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.A)) {
    if (RL.IsWindowState(RL.ConfigFlags.WINDOW_ALWAYS_RUN)) RL.ClearWindowState(RL.ConfigFlags.WINDOW_ALWAYS_RUN);
    else RL.SetWindowState(RL.ConfigFlags.WINDOW_ALWAYS_RUN);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.V)) {
    if (RL.IsWindowState(RL.ConfigFlags.VSYNC_HINT)) RL.ClearWindowState(RL.ConfigFlags.VSYNC_HINT);
    else RL.SetWindowState(RL.ConfigFlags.VSYNC_HINT);
  }

  ballPosition.x += ballSpeed.x;
  ballPosition.y += ballSpeed.y;
  if (ballPosition.x >= RL.GetScreenWidth() - ballRadius || ballPosition.x <= ballRadius) ballSpeed.x *= -1.0;
  if (ballPosition.y >= RL.GetScreenHeight() - ballRadius || ballPosition.y <= ballRadius) ballSpeed.y *= -1.0;

  RL.BeginDrawing();

  if (RL.IsWindowState(RL.ConfigFlags.WINDOW_TRANSPARENT)) RL.ClearBackground(RL.Blank);
  else RL.ClearBackground(RL.RayWhite);

  RL.DrawCircleV(ballPosition, ballRadius, RL.Maroon);
  RL.DrawRectangleLinesEx(new RL.Rectangle(0, 0, RL.GetScreenWidth(), RL.GetScreenHeight()), 4, RL.RayWhite);

  RL.DrawCircleV(RL.GetMousePosition(), 10, RL.DarkBlue);

  RL.DrawFPS(10, 10);

  RL.DrawText(`Screen Size: [${RL.GetScreenWidth()}, ${RL.GetScreenHeight()}]`, 10, 40, 10, RL.Green);

  RL.DrawText("Following flags can be set after window creation:", 10, 60, 10, RL.Gray);
  RL.DrawText(
    `[F] FLAG_FULLSCREEN_MODE: ${RL.IsWindowState(RL.ConfigFlags.FULLSCREEN_MODE) ? "on" : "off"}`,
    10,
    80,
    10,
    RL.IsWindowState(RL.ConfigFlags.FULLSCREEN_MODE) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    `[R] FLAG_WINDOW_RESIZABLE: ${RL.IsWindowState(RL.ConfigFlags.WINDOW_RESIZABLE) ? "on" : "off"}`,
    10,
    100,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_RESIZABLE) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    `[D] FLAG_WINDOW_UNDECORATED: ${RL.IsWindowState(RL.ConfigFlags.WINDOW_UNDECORATED) ? "on" : "off"}`,
    10,
    120,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_UNDECORATED) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    `[H] FLAG_WINDOW_HIDDEN: ${RL.IsWindowState(RL.ConfigFlags.WINDOW_HIDDEN) ? "on" : "off"}`,
    10,
    140,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_HIDDEN) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    `[N] FLAG_WINDOW_MINIMIZED: ${RL.IsWindowState(RL.ConfigFlags.WINDOW_MINIMIZED) ? "on" : "off"}`,
    10,
    160,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_MINIMIZED) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    `[M] FLAG_WINDOW_MAXIMIZED: ${RL.IsWindowState(RL.ConfigFlags.WINDOW_MAXIMIZED) ? "on" : "off"}`,
    10,
    180,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_MAXIMIZED) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    `[U] FLAG_WINDOW_UNFOCUSED: ${RL.IsWindowState(RL.ConfigFlags.WINDOW_UNFOCUSED) ? "on" : "off"}`,
    10,
    200,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_UNFOCUSED) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    `[T] FLAG_WINDOW_TOPMOST: ${RL.IsWindowState(RL.ConfigFlags.WINDOW_TOPMOST) ? "on" : "off"}`,
    10,
    220,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_TOPMOST) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    `[A] FLAG_WINDOW_ALWAYS_RUN: ${RL.IsWindowState(RL.ConfigFlags.WINDOW_ALWAYS_RUN) ? "on" : "off"}`,
    10,
    240,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_ALWAYS_RUN) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    `[V] FLAG_VSYNC_HINT: ${RL.IsWindowState(RL.ConfigFlags.VSYNC_HINT) ? "on" : "off"}`,
    10,
    260,
    10,
    RL.IsWindowState(RL.ConfigFlags.VSYNC_HINT) ? RL.Lime : RL.Maroon,
  );

  RL.DrawText("Following flags can only be set before window creation:", 10, 300, 10, RL.Gray);
  RL.DrawText(
    `FLAG_WINDOW_HIGHDPI: ${RL.IsWindowState(RL.ConfigFlags.WINDOW_HIGHDPI) ? "on" : "off"}`,
    10,
    320,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_HIGHDPI) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    `FLAG_WINDOW_TRANSPARENT: ${RL.IsWindowState(RL.ConfigFlags.WINDOW_TRANSPARENT) ? "on" : "off"}`,
    10,
    340,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_TRANSPARENT) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    `FLAG_MSAA_4X_HINT: ${RL.IsWindowState(RL.ConfigFlags.MSAA_4X_HINT) ? "on" : "off"}`,
    10,
    360,
    10,
    RL.IsWindowState(RL.ConfigFlags.MSAA_4X_HINT) ? RL.Lime : RL.Maroon,
  );

  RL.EndDrawing();
}

RL.CloseWindow();
