import * as RL from "raylib";

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - custom frame control");

let previousTime = RL.GetTime();
let currentTime = 0.0;
let updateDrawTime = 0.0;
let waitTime = 0.0;
let deltaTime = 0.0;

let timeCounter = 0.0;
let position = 0.0;
let pause = false;

let targetFPS = 60;
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  RL.PollInputEvents();

  if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) pause = !pause;

  if (RL.IsKeyPressed(RL.KeyboardKey.UP)) targetFPS += 20;
  else if (RL.IsKeyPressed(RL.KeyboardKey.DOWN)) targetFPS -= 20;

  if (targetFPS < 0) targetFPS = 0;

  if (!pause) {
    position += 200 * deltaTime;
    if (position >= RL.GetScreenWidth()) position = 0;
    timeCounter += deltaTime;
  }
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  for (let i = 0; i < RL.GetScreenWidth() / 200; i++) {
    RL.DrawRectangle(200 * i, 0, 1, RL.GetScreenHeight(), RL.SkyBlue);
  }

  RL.DrawCircle(Math.trunc(position), RL.GetScreenHeight() / 2 - 25, 50, RL.Red);

  RL.DrawText(
    `${(timeCounter * 1000).toFixed(0)} ms`,
    Math.trunc(position) - 40,
    RL.GetScreenHeight() / 2 - 100,
    20,
    RL.Maroon,
  );
  RL.DrawText(
    `PosX: ${position.toFixed(0)}`,
    Math.trunc(position) - 50,
    RL.GetScreenHeight() / 2 + 40,
    20,
    RL.Black,
  );

  RL.DrawText(
    "Circle is moving at a constant 200 pixels/sec,\nindependently of the frame rate.",
    10,
    10,
    20,
    RL.DarkGray,
  );
  RL.DrawText(
    "PRESS SPACE to PAUSE MOVEMENT",
    10,
    RL.GetScreenHeight() - 60,
    20,
    RL.Gray,
  );
  RL.DrawText(
    "PRESS UP | DOWN to CHANGE TARGET FPS",
    10,
    RL.GetScreenHeight() - 30,
    20,
    RL.Gray,
  );
  RL.DrawText(
    `TARGET FPS: ${targetFPS}`,
    RL.GetScreenWidth() - 220,
    10,
    20,
    RL.Lime,
  );
  RL.DrawText(
    `CURRENT FPS: ${deltaTime > 0 ? Math.trunc(1 / deltaTime) : 0}`,
    RL.GetScreenWidth() - 220,
    40,
    20,
    RL.Green,
  );

  RL.EndDrawing();

  RL.SwapScreenBuffer();

  currentTime = RL.GetTime();
  updateDrawTime = currentTime - previousTime;

  if (targetFPS > 0) {
    waitTime = 1.0 / targetFPS - updateDrawTime;
    if (waitTime > 0.0) {
      RL.WaitTime(waitTime);
      currentTime = RL.GetTime();
      deltaTime = currentTime - previousTime;
    }
  } else {
    deltaTime = updateDrawTime;
  }

  previousTime = currentTime;
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow();
//--------------------------------------------------------------------------------------
