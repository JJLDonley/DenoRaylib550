import * as RL from "raylib";

enum LoadState {
  WAITING,
  LOADING,
  FINISHED,
}

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - loading thread");

let state: LoadState = LoadState.WAITING;
let framesCounter = 0;

let startTime = 0;
let dataLoaded = false;
let dataProgress = 0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  // Update
  switch (state) {
    case LoadState.WAITING: {
      if (RL.IsKeyPressed(RL.KeyboardKey.ENTER)) {
        startTime = performance.now();
        dataLoaded = false;
        dataProgress = 0;
        state = LoadState.LOADING;
      }
      break;
    }
    case LoadState.LOADING: {
      framesCounter++;
      const elapsed = performance.now() - startTime;
      dataProgress = Math.min(500, Math.trunc(elapsed / 10));
      if (elapsed >= 5000) {
        dataLoaded = true;
      }
      if (dataLoaded) {
        framesCounter = 0;
        state = LoadState.FINISHED;
      }
      break;
    }
    case LoadState.FINISHED: {
      if (RL.IsKeyPressed(RL.KeyboardKey.ENTER)) {
        dataLoaded = false;
        dataProgress = 0;
        state = LoadState.WAITING;
      }
      break;
    }
    default:
      break;
  }

  // Draw
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  switch (state) {
    case LoadState.WAITING:
      RL.DrawText("PRESS ENTER to START LOADING DATA", 150, 170, 20, RL.DarkGray);
      break;
    case LoadState.LOADING:
      RL.DrawRectangle(150, 200, dataProgress, 60, RL.SkyBlue);
      if (Math.trunc(framesCounter / 15) % 2 === 1) {
        RL.DrawText("LOADING DATA...", 240, 210, 40, RL.DarkBlue);
      }
      break;
    case LoadState.FINISHED:
      RL.DrawRectangle(150, 200, 500, 60, RL.Lime);
      RL.DrawText("DATA LOADED!", 250, 210, 40, RL.Green);
      break;
    default:
      break;
  }

  RL.DrawRectangleLines(150, 200, 500, 60, RL.DarkGray);

  RL.EndDrawing();
}

RL.CloseWindow();
