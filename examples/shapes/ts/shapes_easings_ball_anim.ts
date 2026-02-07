import * as RL from "raylib";
import { EaseElasticOut, EaseElasticIn, EaseCubicOut } from "./reasings.ts";

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - easings ball anim");

let ballPositionX = -100;
let ballRadius = 20;
let ballAlpha = 0.0;

let state = 0;
let framesCounter = 0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (state === 0) {
    framesCounter++;
    ballPositionX = Math.trunc(EaseElasticOut(framesCounter, -100, screenWidth / 2.0 + 100, 120));
    if (framesCounter >= 120) {
      framesCounter = 0;
      state = 1;
    }
  } else if (state === 1) {
    framesCounter++;
    ballRadius = Math.trunc(EaseElasticIn(framesCounter, 20, 500, 200));
    if (framesCounter >= 200) {
      framesCounter = 0;
      state = 2;
    }
  } else if (state === 2) {
    framesCounter++;
    ballAlpha = EaseCubicOut(framesCounter, 0.0, 1.0, 200);
    if (framesCounter >= 200) {
      framesCounter = 0;
      state = 3;
    }
  } else if (state === 3) {
    if (RL.IsKeyPressed(RL.KeyboardKey.ENTER)) {
      ballPositionX = -100;
      ballRadius = 20;
      ballAlpha = 0.0;
      state = 0;
    }
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.R)) framesCounter = 0;

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  if (state >= 2) RL.DrawRectangle(0, 0, screenWidth, screenHeight, RL.Green);
  RL.DrawCircle(ballPositionX, 200, ballRadius, RL.Fade(RL.Red, 1.0 - ballAlpha));

  if (state === 3) RL.DrawText("PRESS [ENTER] TO PLAY AGAIN!", 240, 200, 20, RL.Black);

  RL.EndDrawing();
}

RL.CloseWindow();
