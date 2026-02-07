import * as RL from "raylib";

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - raylib logo animation");

const logoPositionX = Math.trunc(screenWidth / 2 - 128);
const logoPositionY = Math.trunc(screenHeight / 2 - 128);

let framesCounter = 0;
let lettersCount = 0;

let topSideRecWidth = 16;
let leftSideRecHeight = 16;

let bottomSideRecWidth = 16;
let rightSideRecHeight = 16;

let state = 0;
let alpha = 1.0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (state === 0) {
    framesCounter++;
    if (framesCounter === 120) {
      state = 1;
      framesCounter = 0;
    }
  } else if (state === 1) {
    topSideRecWidth += 4;
    leftSideRecHeight += 4;
    if (topSideRecWidth === 256) state = 2;
  } else if (state === 2) {
    bottomSideRecWidth += 4;
    rightSideRecHeight += 4;
    if (bottomSideRecWidth === 256) state = 3;
  } else if (state === 3) {
    framesCounter++;
    if (Math.trunc(framesCounter / 12)) {
      lettersCount++;
      framesCounter = 0;
    }
    if (lettersCount >= 10) {
      alpha -= 0.02;
      if (alpha <= 0.0) {
        alpha = 0.0;
        state = 4;
      }
    }
  } else if (state === 4) {
    if (RL.IsKeyPressed(RL.KeyboardKey.R)) {
      framesCounter = 0;
      lettersCount = 0;

      topSideRecWidth = 16;
      leftSideRecHeight = 16;
      bottomSideRecWidth = 16;
      rightSideRecHeight = 16;

      alpha = 1.0;
      state = 0;
    }
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  if (state === 0) {
    if ((Math.trunc(framesCounter / 15) % 2) !== 0) RL.DrawRectangle(logoPositionX, logoPositionY, 16, 16, RL.Black);
  } else if (state === 1) {
    RL.DrawRectangle(logoPositionX, logoPositionY, topSideRecWidth, 16, RL.Black);
    RL.DrawRectangle(logoPositionX, logoPositionY, 16, leftSideRecHeight, RL.Black);
  } else if (state === 2) {
    RL.DrawRectangle(logoPositionX, logoPositionY, topSideRecWidth, 16, RL.Black);
    RL.DrawRectangle(logoPositionX, logoPositionY, 16, leftSideRecHeight, RL.Black);

    RL.DrawRectangle(logoPositionX + 240, logoPositionY, 16, rightSideRecHeight, RL.Black);
    RL.DrawRectangle(logoPositionX, logoPositionY + 240, bottomSideRecWidth, 16, RL.Black);
  } else if (state === 3) {
    RL.DrawRectangle(logoPositionX, logoPositionY, topSideRecWidth, 16, RL.Fade(RL.Black, alpha));
    RL.DrawRectangle(logoPositionX, logoPositionY + 16, 16, leftSideRecHeight - 32, RL.Fade(RL.Black, alpha));

    RL.DrawRectangle(logoPositionX + 240, logoPositionY + 16, 16, rightSideRecHeight - 32, RL.Fade(RL.Black, alpha));
    RL.DrawRectangle(logoPositionX, logoPositionY + 240, bottomSideRecWidth, 16, RL.Fade(RL.Black, alpha));

    RL.DrawRectangle(Math.trunc(RL.GetScreenWidth() / 2 - 112), Math.trunc(RL.GetScreenHeight() / 2 - 112), 224, 224, RL.Fade(RL.RayWhite, alpha));

    RL.DrawText("raylib".substring(0, lettersCount), Math.trunc(RL.GetScreenWidth() / 2 - 44), Math.trunc(RL.GetScreenHeight() / 2 + 48), 50, RL.Fade(RL.Black, alpha));
  } else if (state === 4) {
    RL.DrawText("[R] REPLAY", 340, 200, 20, RL.Gray);
  }

  RL.EndDrawing();
}

RL.CloseWindow();
