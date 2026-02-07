import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");

RL.SetTargetFPS(60);

const updateDrawFrame = () => {
  // Update
  //----------------------------------------------------------------------------------
  // TODO: Update your variables here
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.DrawText(
    "Congrats! You created your first window!",
    190,
    200,
    20,
    RL.LightGray,
  );

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
};

while (!RL.WindowShouldClose()) {
  updateDrawFrame();
}

RL.CloseWindow();
