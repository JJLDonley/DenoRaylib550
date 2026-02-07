import * as RL from "raylib";
import { EaseCircOut, EaseLinearIn } from "./reasings.ts";

const RECS_WIDTH = 50;
const RECS_HEIGHT = 50;

const MAX_RECS_X = Math.trunc(800 / RECS_WIDTH);
const MAX_RECS_Y = Math.trunc(450 / RECS_HEIGHT);

const PLAY_TIME_IN_FRAMES = 240;

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - easings rectangle array");

const recs: RL.Rectangle[] = Array.from({ length: MAX_RECS_X * MAX_RECS_Y }, () => new RL.Rectangle(0, 0, 0, 0));

for (let y = 0; y < MAX_RECS_Y; y++) {
  for (let x = 0; x < MAX_RECS_X; x++) {
    const idx = y * MAX_RECS_X + x;
    recs[idx].x = RECS_WIDTH / 2.0 + RECS_WIDTH * x;
    recs[idx].y = RECS_HEIGHT / 2.0 + RECS_HEIGHT * y;
    recs[idx].width = RECS_WIDTH;
    recs[idx].height = RECS_HEIGHT;
  }
}

let rotation = 0.0;
let framesCounter = 0;
let state = 0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (state === 0) {
    framesCounter++;

    for (let i = 0; i < MAX_RECS_X * MAX_RECS_Y; i++) {
      recs[i].height = EaseCircOut(framesCounter, RECS_HEIGHT, -RECS_HEIGHT, PLAY_TIME_IN_FRAMES);
      recs[i].width = EaseCircOut(framesCounter, RECS_WIDTH, -RECS_WIDTH, PLAY_TIME_IN_FRAMES);

      if (recs[i].height < 0) recs[i].height = 0;
      if (recs[i].width < 0) recs[i].width = 0;

      if (recs[i].height === 0 && recs[i].width === 0) state = 1;

      rotation = EaseLinearIn(framesCounter, 0.0, 360.0, PLAY_TIME_IN_FRAMES);
    }
  } else if (state === 1 && RL.IsKeyPressed(RL.KeyboardKey.SPACE)) {
    framesCounter = 0;
    for (let i = 0; i < MAX_RECS_X * MAX_RECS_Y; i++) {
      recs[i].height = RECS_HEIGHT;
      recs[i].width = RECS_WIDTH;
    }
    state = 0;
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  if (state === 0) {
    for (let i = 0; i < MAX_RECS_X * MAX_RECS_Y; i++) {
      RL.DrawRectanglePro(recs[i], new RL.Vector2(recs[i].width / 2, recs[i].height / 2), rotation, RL.Red);
    }
  } else if (state === 1) {
    RL.DrawText("PRESS [SPACE] TO PLAY AGAIN!", 240, 200, 20, RL.Gray);
  }

  RL.EndDrawing();
}

RL.CloseWindow();
