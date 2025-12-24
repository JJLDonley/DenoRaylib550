import * as RL from "raylib";

//------------------------------------------------------------------------------------
// Program main entry point
//------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - window should close",
);

RL.SetExitKey(RL.KeyboardKey.NULL); // Disable ESCAPE to close window, X-button still works

let exitWindowRequested = false; // Flag to request window to exit
let exitWindow = false; // Flag to set window to exit

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!exitWindow) {
  // Update
  //----------------------------------------------------------------------------------
  // Detect if X-button or ESCAPE have been pressed to close window
  if (RL.WindowShouldClose() || RL.IsKeyPressed(RL.KeyboardKey.ESCAPE)) {
    exitWindowRequested = true;
  }

  if (exitWindowRequested) {
    // A request for close window has been issued, we can save data before closing
    // or just show a message asking for confirmation

    if (RL.IsKeyPressed(RL.KeyboardKey.Y)) exitWindow = true;
    else if (RL.IsKeyPressed(RL.KeyboardKey.N)) exitWindowRequested = false;
  }
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  if (exitWindowRequested) {
    RL.DrawRectangle(0, 100, screenWidth, 200, RL.Black);
    RL.DrawText(
      "Are you sure you want to exit program? [Y/N]",
      40,
      180,
      30,
      RL.White,
    );
  } else {
    RL.DrawText(
      "Try to close the window to get confirmation message!",
      120,
      200,
      20,
      RL.LightGray,
    );
  }

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
