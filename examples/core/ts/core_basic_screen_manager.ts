import * as RL from "raylib";

enum GameScreen {
  LOGO = 0,
  TITLE,
  GAMEPLAY,
  ENDING,
}

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - basic screen manager",
);

let currentScreen: GameScreen = GameScreen.LOGO;

// TODO: Initialize all required variables and load all required data here!

let framesCounter = 0;

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  switch (currentScreen) {
    case GameScreen.LOGO: {
      // TODO: Update LOGO screen variables here!

      framesCounter++;

      if (framesCounter > 120) {
        currentScreen = GameScreen.TITLE;
      }
      break;
    }
    case GameScreen.TITLE: {
      // TODO: Update TITLE screen variables here!

      if (RL.IsKeyPressed(RL.KeyboardKey.ENTER) || RL.IsGestureDetected(RL.Gesture.TAP)) {
        currentScreen = GameScreen.GAMEPLAY;
      }
      break;
    }
    case GameScreen.GAMEPLAY: {
      // TODO: Update GAMEPLAY screen variables here!

      if (RL.IsKeyPressed(RL.KeyboardKey.ENTER) || RL.IsGestureDetected(RL.Gesture.TAP)) {
        currentScreen = GameScreen.ENDING;
      }
      break;
    }
    case GameScreen.ENDING: {
      // TODO: Update ENDING screen variables here!

      if (RL.IsKeyPressed(RL.KeyboardKey.ENTER) || RL.IsGestureDetected(RL.Gesture.TAP)) {
        currentScreen = GameScreen.TITLE;
      }
      break;
    }
    default:
      break;
  }
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  switch (currentScreen) {
    case GameScreen.LOGO: {
      RL.DrawText("LOGO SCREEN", 20, 20, 40, RL.LightGray);
      RL.DrawText("WAIT for 2 SECONDS...", 290, 220, 20, RL.Gray);
      break;
    }
    case GameScreen.TITLE: {
      RL.DrawRectangle(0, 0, screenWidth, screenHeight, RL.Green);
      RL.DrawText("TITLE SCREEN", 20, 20, 40, RL.DarkGreen);
      RL.DrawText(
        "PRESS ENTER or TAP to JUMP to GAMEPLAY SCREEN",
        120,
        220,
        20,
        RL.DarkGreen,
      );
      break;
    }
    case GameScreen.GAMEPLAY: {
      RL.DrawRectangle(0, 0, screenWidth, screenHeight, RL.Purple);
      RL.DrawText("GAMEPLAY SCREEN", 20, 20, 40, RL.Maroon);
      RL.DrawText(
        "PRESS ENTER or TAP to JUMP to ENDING SCREEN",
        130,
        220,
        20,
        RL.Maroon,
      );
      break;
    }
    case GameScreen.ENDING: {
      RL.DrawRectangle(0, 0, screenWidth, screenHeight, RL.Blue);
      RL.DrawText("ENDING SCREEN", 20, 20, 40, RL.DarkBlue);
      RL.DrawText(
        "PRESS ENTER or TAP to RETURN to TITLE SCREEN",
        120,
        220,
        20,
        RL.DarkBlue,
      );
      break;
    }
    default:
      break;
  }

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------

// TODO: Unload all loaded data (textures, fonts, audio) here!

RL.CloseWindow();
//--------------------------------------------------------------------------------------
