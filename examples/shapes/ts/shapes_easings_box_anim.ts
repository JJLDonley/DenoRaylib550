import * as RL from "raylib";
import { EaseElasticOut, EaseBounceOut, EaseQuadOut, EaseCircOut, EaseSineOut } from "./reasings.ts";

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - easings box anim");

let rec = new RL.Rectangle(RL.GetScreenWidth() / 2.0, -100, 100, 100);
let rotation = 0.0;
let alpha = 1.0;

let state = 0;
let framesCounter = 0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  switch (state) {
    case 0: {
      framesCounter++;
      rec.y = EaseElasticOut(framesCounter, -100, RL.GetScreenHeight() / 2.0 + 100, 120);
      if (framesCounter >= 120) {
        framesCounter = 0;
        state = 1;
      }
      break;
    }
    case 1: {
      framesCounter++;
      rec.height = EaseBounceOut(framesCounter, 100, -90, 120);
      rec.width = EaseBounceOut(framesCounter, 100, RL.GetScreenWidth(), 120);
      if (framesCounter >= 120) {
        framesCounter = 0;
        state = 2;
      }
      break;
    }
    case 2: {
      framesCounter++;
      rotation = EaseQuadOut(framesCounter, 0.0, 270.0, 240);
      if (framesCounter >= 240) {
        framesCounter = 0;
        state = 3;
      }
      break;
    }
    case 3: {
      framesCounter++;
      rec.height = EaseCircOut(framesCounter, 10, RL.GetScreenWidth(), 120);
      if (framesCounter >= 120) {
        framesCounter = 0;
        state = 4;
      }
      break;
    }
    case 4: {
      framesCounter++;
      alpha = EaseSineOut(framesCounter, 1.0, -1.0, 160);
      if (framesCounter >= 160) {
        framesCounter = 0;
        state = 5;
      }
      break;
    }
    default:
      break;
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) {
    rec = new RL.Rectangle(RL.GetScreenWidth() / 2.0, -100, 100, 100);
    rotation = 0.0;
    alpha = 1.0;
    state = 0;
    framesCounter = 0;
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawRectanglePro(rec, new RL.Vector2(rec.width / 2, rec.height / 2), rotation, RL.Fade(RL.Black, alpha));

  RL.DrawText("PRESS [SPACE] TO RESET BOX ANIMATION!", 10, RL.GetScreenHeight() - 25, 20, RL.LightGray);

  RL.EndDrawing();
}

RL.CloseWindow();
