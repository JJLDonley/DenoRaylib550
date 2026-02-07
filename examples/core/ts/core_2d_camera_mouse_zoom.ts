import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - 2d camera mouse zoom",
);

const camera = new RL.Camera2D({
  zoom: 1.0,
});

let zoomMode = 0; // 0-Mouse Wheel, 1-Mouse Move

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const vector2Scale = (v: RL.Vector2, s: number) => new RL.Vector2(v.x * s, v.y * s);
const vector2Add = (a: RL.Vector2, b: RL.Vector2) => new RL.Vector2(a.x + b.x, a.y + b.y);

const drawGrid2D = (slices: number, spacing: number) => {
  const extent = (slices * spacing) / 2;
  for (let i = -extent; i <= extent; i += spacing) {
    RL.DrawLine(-extent, i, extent, i, RL.LightGray);
    RL.DrawLine(i, -extent, i, extent, RL.LightGray);
  }
};

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyPressed(RL.KeyboardKey.ONE)) zoomMode = 0;
  else if (RL.IsKeyPressed(RL.KeyboardKey.TWO)) zoomMode = 1;

  // Translate based on mouse left click
  if (RL.IsMouseButtonDown(RL.MouseButton.LEFT)) {
    let delta = RL.GetMouseDelta();
    delta = vector2Scale(delta, -1.0 / camera.zoom);
    camera.target = vector2Add(camera.target, delta);
  }

  if (zoomMode === 0) {
    // Zoom based on mouse wheel
    const wheel = RL.GetMouseWheelMove();
    if (wheel !== 0) {
      const mouseWorldPos = RL.GetSCreenToWorld2D(
        RL.GetMousePosition(),
        camera,
      );

      camera.offset = RL.GetMousePosition();
      camera.target = mouseWorldPos;

      let scaleFactor = 1.0 + (0.25 * Math.abs(wheel));
      if (wheel < 0) scaleFactor = 1.0 / scaleFactor;
      camera.zoom = clamp(camera.zoom * scaleFactor, 0.125, 64.0);
    }
  } else {
    // Zoom based on mouse right click
    if (RL.IsMouseButtonPressed(RL.MouseButton.RIGHT)) {
      const mouseWorldPos = RL.GetSCreenToWorld2D(
        RL.GetMousePosition(),
        camera,
      );

      camera.offset = RL.GetMousePosition();
      camera.target = mouseWorldPos;
    }
    if (RL.IsMouseButtonDown(RL.MouseButton.RIGHT)) {
      const deltaX = RL.GetMouseDelta().x;
      let scaleFactor = 1.0 + (0.01 * Math.abs(deltaX));
      if (deltaX < 0) scaleFactor = 1.0 / scaleFactor;
      camera.zoom = clamp(camera.zoom * scaleFactor, 0.125, 64.0);
    }
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode2D(camera);

  // Draw a 2D grid centered around 0,0
  drawGrid2D(100, 50);

  // Draw a reference circle
  RL.DrawCircle(
    Math.trunc(RL.GetScreenWidth() / 2),
    Math.trunc(RL.GetScreenHeight() / 2),
    50,
    RL.Maroon,
  );

  RL.EndMode2D();

  // Draw mouse reference
  RL.DrawCircleV(RL.GetMousePosition(), 4, RL.DarkGray);
  RL.DrawText(
    `[${RL.GetMouseX()}, ${RL.GetMouseY()}]`,
    Math.trunc(RL.GetMousePosition().x - 44),
    Math.trunc(RL.GetMousePosition().y - 24),
    20,
    RL.Black,
  );

  RL.DrawText(
    "[1][2] Select mouse zoom mode (Wheel or Move)",
    20,
    20,
    20,
    RL.DarkGray,
  );
  if (zoomMode === 0) {
    RL.DrawText(
      "Mouse left button drag to move, mouse wheel to zoom",
      20,
      50,
      20,
      RL.DarkGray,
    );
  } else {
    RL.DrawText(
      "Mouse left button drag to move, mouse press and move to zoom",
      20,
      50,
      20,
      RL.DarkGray,
    );
  }

  RL.EndDrawing();
}

RL.CloseWindow();
