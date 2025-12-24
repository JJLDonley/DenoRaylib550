import * as RL from "raylib";

//------------------------------------------------------------------------------------
// Program main entry point
//------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - window flags",
);

const ballPosition = new RL.Vector2(
  RL.GetScreenWidth() / 2,
  RL.GetScreenHeight() / 2,
);
const ballSpeed = new RL.Vector2(5.0, 4.0);
const ballRadius = 20;

let framesCounter = 0;

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//----------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //-----------------------------------------------------
  if (RL.IsKeyPressed(RL.KeyboardKey.F)) RL.ToggleFullscreen(); // modifies window size when scaling!

  if (RL.IsKeyPressed(RL.KeyboardKey.R)) {
    if (RL.IsWindowState(RL.ConfigFlags.WINDOW_RESIZABLE)) {
      RL.ClearWindowState(RL.ConfigFlags.WINDOW_RESIZABLE);
    } else {
      RL.SetWindowState(RL.ConfigFlags.WINDOW_RESIZABLE);
    }
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.D)) {
    if (RL.IsWindowState(RL.ConfigFlags.WINDOW_UNDECORATED)) {
      RL.ClearWindowState(RL.ConfigFlags.WINDOW_UNDECORATED);
    } else {
      RL.SetWindowState(RL.ConfigFlags.WINDOW_UNDECORATED);
    }
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.H)) {
    if (!RL.IsWindowState(RL.ConfigFlags.WINDOW_HIDDEN)) {
      RL.SetWindowState(RL.ConfigFlags.WINDOW_HIDDEN);
    }
    framesCounter = 0;
  }

  if (RL.IsWindowState(RL.ConfigFlags.WINDOW_HIDDEN)) {
    framesCounter++;
    if (framesCounter >= 240) {
      RL.ClearWindowState(RL.ConfigFlags.WINDOW_HIDDEN); // Show window after 4 seconds
    }
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.N)) {
    if (!RL.IsWindowState(RL.ConfigFlags.WINDOW_MINIMIZED)) {
      RL.MinimizedWindow();
    }
    framesCounter = 0;
  }

  if (RL.IsWindowState(RL.ConfigFlags.WINDOW_MINIMIZED)) {
    framesCounter++;
    if (framesCounter >= 240) {
      RL.RestoreWindow(); // Restore window after 4 seconds
      framesCounter = 0;
    }
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.M)) {
    // NOTE: Requires FLAG_WINDOW_RESIZABLE enabled!
    if (RL.IsWindowState(RL.ConfigFlags.WINDOW_MAXIMIZED)) {
      RL.RestoreWindow();
    } else {
      RL.MaximizedWindow();
    }
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.U)) {
    if (RL.IsWindowState(RL.ConfigFlags.WINDOW_UNFOCUSED)) {
      RL.ClearWindowState(RL.ConfigFlags.WINDOW_UNFOCUSED);
    } else {
      RL.SetWindowState(RL.ConfigFlags.WINDOW_UNFOCUSED);
    }
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.T)) {
    if (RL.IsWindowState(RL.ConfigFlags.WINDOW_TOPMOST)) {
      RL.ClearWindowState(RL.ConfigFlags.WINDOW_TOPMOST);
    } else {
      RL.SetWindowState(RL.ConfigFlags.WINDOW_TOPMOST);
    }
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.A)) {
    if (RL.IsWindowState(RL.ConfigFlags.WINDOW_ALWAYS_RUN)) {
      RL.ClearWindowState(RL.ConfigFlags.WINDOW_ALWAYS_RUN);
    } else {
      RL.SetWindowState(RL.ConfigFlags.WINDOW_ALWAYS_RUN);
    }
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.V)) {
    if (RL.IsWindowState(RL.ConfigFlags.VSYNC_HINT)) {
      RL.ClearWindowState(RL.ConfigFlags.VSYNC_HINT);
    } else {
      RL.SetWindowState(RL.ConfigFlags.VSYNC_HINT);
    }
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.B)) RL.ToggleBorderlessWindowed();

  // Bouncing ball logic
  ballPosition.x += ballSpeed.x;
  ballPosition.y += ballSpeed.y;
  if (
    ballPosition.x >= RL.GetScreenWidth() - ballRadius ||
    ballPosition.x <= ballRadius
  ) {
    ballSpeed.x *= -1.0;
  }
  if (
    ballPosition.y >= RL.GetScreenHeight() - ballRadius ||
    ballPosition.y <= ballRadius
  ) {
    ballSpeed.y *= -1.0;
  }
  //-----------------------------------------------------

  // Draw
  //-----------------------------------------------------
  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawCircleV(ballPosition, ballRadius, RL.Maroon);

  RL.DrawRectangleLinesEx(
    new RL.Rectangle(0, 0, RL.GetScreenWidth(), RL.GetScreenHeight()),
    4,
    RL.RayWhite,
  );

  RL.DrawCircleV(RL.GetMousePosition(), 10, RL.DarkGray);

  RL.DrawText(
    "Screen size: [" + RL.GetScreenWidth() + "x" + RL.GetScreenHeight() + "]",
    10,
    40,
    10,
    RL.Green,
  );

  // Draw window flags info
  RL.DrawText("Keyboard buttons to toggle flags:", 10, 60, 10, RL.DarkGray);
  RL.DrawText(
    "[F] Toggle Fullscreen",
    10,
    80,
    10,
    RL.IsWindowState(RL.ConfigFlags.FULLSCREEN_MODE) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    "[R] Toggle Resizable",
    10,
    100,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_RESIZABLE) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    "[D] Toggle Undecorated",
    10,
    120,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_UNDECORATED) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    "[H] Toggle Hidden",
    10,
    140,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_HIDDEN) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    "[N] Minimize Window",
    10,
    160,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_MINIMIZED) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    "[M] Maximize Window",
    10,
    180,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_MAXIMIZED) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    "[U] Toggle Unfocused",
    10,
    200,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_UNFOCUSED) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    "[T] Toggle Topmost",
    10,
    220,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_TOPMOST) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    "[A] Toggle Always Run",
    10,
    240,
    10,
    RL.IsWindowState(RL.ConfigFlags.WINDOW_ALWAYS_RUN) ? RL.Lime : RL.Maroon,
  );
  RL.DrawText(
    "[V] Toggle VSync",
    10,
    260,
    10,
    RL.IsWindowState(RL.ConfigFlags.VSYNC_HINT) ? RL.Lime : RL.Maroon,
  );

  RL.DrawFPS(10, 10);
  RL.EndDrawing();
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
