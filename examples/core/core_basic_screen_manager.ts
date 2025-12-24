import * as RL from "raylib";

//------------------------------------------------------------------------------------------
// Types and Structures Definition
//------------------------------------------------------------------------------------------
enum GameScreen {
  LOGO = 0,
  TITLE,
  GAMEPLAY,
  ENDING,
}

//------------------------------------------------------------------------------------
// Program main entry point
//------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - basic screen manager",
);

let currentScreen = GameScreen.LOGO;

// TODO: Initialize all required variables and load all required data here!

let framesCounter = 0; // Useful to count frames

RL.SetTargetFPS(60); // Set desired framerate (frames-per-second)
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  switch (currentScreen) {
    case GameScreen.LOGO:
      {
        // TODO: Update LOGO screen variables here!

        framesCounter++; // Count frames

        // Wait for 2 seconds (120 frames) before jumping to TITLE screen
        if (framesCounter > 120) {
          currentScreen = GameScreen.TITLE;
        }
      }
      break;
    case GameScreen.TITLE:
      {
        // TODO: Update TITLE screen variables here!

        // Press enter to change to GAMEPLAY screen
        if (
          RL.IsKeyPressed(RL.KeyboardKey.ENTER) ||
          RL.IsGestureDetected(RL.Gesture.TAP)
        ) {
          currentScreen = GameScreen.GAMEPLAY;
        }
      }
      break;
    case GameScreen.GAMEPLAY:
      {
        // TODO: Update GAMEPLAY screen variables here!

        // Press enter to change to ENDING screen
        if (
          RL.IsKeyPressed(RL.KeyboardKey.ENTER) ||
          RL.IsGestureDetected(RL.Gesture.TAP)
        ) {
          currentScreen = GameScreen.ENDING;
        }
      }
      break;
    case GameScreen.ENDING:
      {
        // TODO: Update ENDING screen variables here!

        // Press enter to return to TITLE screen
        if (
          RL.IsKeyPressed(RL.KeyboardKey.ENTER) ||
          RL.IsGestureDetected(RL.Gesture.TAP)
        ) {
          currentScreen = GameScreen.TITLE;
        }
      }
      break;
    default:
      break;
  }
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  switch (currentScreen) {
    case GameScreen.LOGO:
      {
        // TODO: Draw LOGO screen here!
        RL.DrawText("LOGO SCREEN", 20, 20, 40, RL.LightGray);
        RL.DrawText("WAIT for 2 SECONDS...", 290, 220, 20, RL.Gray);
      }
      break;
    case GameScreen.TITLE:
      {
        // TODO: Draw TITLE screen here!
        RL.DrawRectangle(0, 0, screenWidth, screenHeight, RL.Green);
        RL.DrawText("TITLE SCREEN", 20, 20, 40, RL.DarkGreen);
        RL.DrawText(
          "PRESS ENTER or TAP to JUMP to GAMEPLAY SCREEN",
          120,
          220,
          20,
          RL.DarkGreen,
        );
      }
      break;
    case GameScreen.GAMEPLAY:
      {
        // TODO: Draw GAMEPLAY screen here!
        RL.DrawRectangle(0, 0, screenWidth, screenHeight, RL.Purple);
        RL.DrawText("GAMEPLAY SCREEN", 20, 20, 40, RL.Maroon);
        RL.DrawText(
          "PRESS ENTER or TAP to JUMP to ENDING SCREEN",
          130,
          220,
          20,
          RL.Maroon,
        );
      }
      break;
    case GameScreen.ENDING:
      {
        // TODO: Draw ENDING screen here!
        RL.DrawRectangle(0, 0, screenWidth, screenHeight, RL.Blue);
        RL.DrawText("ENDING SCREEN", 20, 20, 40, RL.DarkBlue);
        RL.DrawText(
          "PRESS ENTER or TAP to RETURN to TITLE SCREEN",
          120,
          220,
          20,
          RL.DarkBlue,
        );
      }
      break;
    default:
      break;
  }

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
