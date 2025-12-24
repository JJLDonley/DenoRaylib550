import * as RL from "raylib";

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - input mouse wheel",
);

let boxPositionY = screenHeight / 2 - 40;
let scrollSpeed = 4; // Scrolling speed in pixels

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  boxPositionY -= Math.floor(RL.GetMouseWheelMove() * scrollSpeed);
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.DrawRectangle(screenWidth / 2 - 40, boxPositionY, 80, 80, RL.Maroon);

  RL.DrawText(
    "Use mouse wheel to move the cube up and down!",
    10,
    10,
    20,
    RL.Gray,
  );
  RL.DrawText(
    `Box position Y: ${boxPositionY.toString().padStart(3, "0")}`,
    10,
    40,
    20,
    RL.LightGray,
  );

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
