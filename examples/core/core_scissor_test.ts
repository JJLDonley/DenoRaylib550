import * as RL from "raylib";

//------------------------------------------------------------------------------------
// Program main entry point
//------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - scissor test",
);

const scissorArea = new RL.Rectangle(0, 0, 300, 300);
let scissorMode = true;

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  if (RL.IsKeyPressed(RL.KeyboardKey.S)) scissorMode = !scissorMode;

  // Centre the scissor area around the mouse position
  scissorArea.x = RL.GetMouseX() - scissorArea.width / 2;
  scissorArea.y = RL.GetMouseY() - scissorArea.height / 2;
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  if (scissorMode) {
    RL.BeginScissorMode(
      Math.floor(scissorArea.x),
      Math.floor(scissorArea.y),
      Math.floor(scissorArea.width),
      Math.floor(scissorArea.height),
    );
  }

  // Draw full screen rectangle and some text
  // NOTE: Only part defined by scissor area will be rendered
  RL.DrawRectangle(0, 0, RL.GetScreenWidth(), RL.GetScreenHeight(), RL.Red);
  RL.DrawText(
    "Move the mouse around to reveal this text!",
    190,
    200,
    20,
    RL.LightGray,
  );

  if (scissorMode) RL.EndScissorMode();

  RL.DrawRectangleLinesEx(scissorArea, 1, RL.Black);
  RL.DrawText("Press S to toggle scissor test", 10, 10, 20, RL.Black);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
