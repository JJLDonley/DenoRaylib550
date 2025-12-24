import * as RL from "raylib";

//------------------------------------------------------------------------------------
// Program main entry point
//------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - random values",
);

let randValue = RL.GetRandomValue(-8, 5); // Get a random integer number between -8 and 5 (both included)

let framesCounter = 0; // Variable used to count frames

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  framesCounter++;

  // Every two seconds (120 frames) a new random value is generated
  if (Math.floor(framesCounter / 120) % 2 === 1) {
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

  // Use JS template literal instead of RL.TextFormat
  RL.DrawText(`${randValue}`, 360, 180, 80, RL.LightGray);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
