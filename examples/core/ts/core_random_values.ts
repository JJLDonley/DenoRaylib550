import * as RL from "raylib";

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - generate random values");

// RL.SetRandomSeed(0xaabbccff); // Set a custom random seed if desired

let randValue = RL.GetRandomValue(-8, 5);
let framesCounter = 0;

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  framesCounter++;

  if (Math.trunc(framesCounter / 120) % 2 === 1) {
    randValue = RL.GetRandomValue(-8, 5);
    framesCounter = 0;
  }
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.DrawText(
    "Every 2 seconds a new random value is generated:",
    130,
    100,
    20,
    RL.Maroon,
  );

  RL.DrawText(`${randValue}`, 360, 180, 80, RL.LightGray);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow();
//--------------------------------------------------------------------------------------
