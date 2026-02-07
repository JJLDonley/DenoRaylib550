import * as RL from "raylib";

const PLAYER_SIZE = 40;

const screenWidth = 800;
const screenHeight = 440;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - 2d camera split screen",
);

const player1 = new RL.Rectangle(200, 200, PLAYER_SIZE, PLAYER_SIZE);
const player2 = new RL.Rectangle(250, 200, PLAYER_SIZE, PLAYER_SIZE);

const camera1 = new RL.Camera2D({
  target: new RL.Vector2(player1.x, player1.y),
  offset: new RL.Vector2(200.0, 200.0),
  rotation: 0.0,
  zoom: 1.0,
});

const camera2 = new RL.Camera2D({
  target: new RL.Vector2(player2.x, player2.y),
  offset: new RL.Vector2(200.0, 200.0),
  rotation: 0.0,
  zoom: 1.0,
});

const screenCamera1 = RL.LoadRenderTexture(screenWidth / 2, screenHeight);
const screenCamera2 = RL.LoadRenderTexture(screenWidth / 2, screenHeight);

const splitScreenRect = new RL.Rectangle(
  0.0,
  0.0,
  screenCamera1.texture.width,
  -screenCamera1.texture.height,
);

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyDown(RL.KeyboardKey.S)) player1.y += 3.0;
  else if (RL.IsKeyDown(RL.KeyboardKey.W)) player1.y -= 3.0;
  if (RL.IsKeyDown(RL.KeyboardKey.D)) player1.x += 3.0;
  else if (RL.IsKeyDown(RL.KeyboardKey.A)) player1.x -= 3.0;

  if (RL.IsKeyDown(RL.KeyboardKey.UP)) player2.y -= 3.0;
  else if (RL.IsKeyDown(RL.KeyboardKey.DOWN)) player2.y += 3.0;
  if (RL.IsKeyDown(RL.KeyboardKey.RIGHT)) player2.x += 3.0;
  else if (RL.IsKeyDown(RL.KeyboardKey.LEFT)) player2.x -= 3.0;

  camera1.target = new RL.Vector2(player1.x, player1.y);
  camera2.target = new RL.Vector2(player2.x, player2.y);

  RL.BeginTextureMode(screenCamera1);
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode2D(camera1);
  for (let i = 0; i < Math.trunc(screenWidth / PLAYER_SIZE) + 1; i++) {
    RL.DrawLineV(
      new RL.Vector2(PLAYER_SIZE * i, 0),
      new RL.Vector2(PLAYER_SIZE * i, screenHeight),
      RL.LightGray,
    );
  }

  for (let i = 0; i < Math.trunc(screenHeight / PLAYER_SIZE) + 1; i++) {
    RL.DrawLineV(
      new RL.Vector2(0, PLAYER_SIZE * i),
      new RL.Vector2(screenWidth, PLAYER_SIZE * i),
      RL.LightGray,
    );
  }

  for (let i = 0; i < Math.trunc(screenWidth / PLAYER_SIZE); i++) {
    for (let j = 0; j < Math.trunc(screenHeight / PLAYER_SIZE); j++) {
      RL.DrawText(
        `[${i},${j}]`,
        10 + PLAYER_SIZE * i,
        15 + PLAYER_SIZE * j,
        10,
        RL.LightGray,
      );
    }
  }

  RL.DrawRectangleRec(player1, RL.Red);
  RL.DrawRectangleRec(player2, RL.Blue);
  RL.EndMode2D();

  RL.DrawRectangle(0, 0, RL.GetScreenWidth() / 2, 30, RL.Fade(RL.RayWhite, 0.6));
  RL.DrawText("PLAYER1: W/S/A/D to move", 10, 10, 10, RL.Maroon);

  RL.EndTextureMode();

  RL.BeginTextureMode(screenCamera2);
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode2D(camera2);
  for (let i = 0; i < Math.trunc(screenWidth / PLAYER_SIZE) + 1; i++) {
    RL.DrawLineV(
      new RL.Vector2(PLAYER_SIZE * i, 0),
      new RL.Vector2(PLAYER_SIZE * i, screenHeight),
      RL.LightGray,
    );
  }

  for (let i = 0; i < Math.trunc(screenHeight / PLAYER_SIZE) + 1; i++) {
    RL.DrawLineV(
      new RL.Vector2(0, PLAYER_SIZE * i),
      new RL.Vector2(screenWidth, PLAYER_SIZE * i),
      RL.LightGray,
    );
  }

  for (let i = 0; i < Math.trunc(screenWidth / PLAYER_SIZE); i++) {
    for (let j = 0; j < Math.trunc(screenHeight / PLAYER_SIZE); j++) {
      RL.DrawText(
        `[${i},${j}]`,
        10 + PLAYER_SIZE * i,
        15 + PLAYER_SIZE * j,
        10,
        RL.LightGray,
      );
    }
  }

  RL.DrawRectangleRec(player1, RL.Red);
  RL.DrawRectangleRec(player2, RL.Blue);
  RL.EndMode2D();

  RL.DrawRectangle(0, 0, RL.GetScreenWidth() / 2, 30, RL.Fade(RL.RayWhite, 0.6));
  RL.DrawText("PLAYER2: UP/DOWN/LEFT/RIGHT to move", 10, 10, 10, RL.DarkBlue);

  RL.EndTextureMode();

  RL.BeginDrawing();
  RL.ClearBackground(RL.Black);

  RL.DrawTextureRec(screenCamera1.texture, splitScreenRect, new RL.Vector2(0, 0), RL.White);
  RL.DrawTextureRec(
    screenCamera2.texture,
    splitScreenRect,
    new RL.Vector2(screenWidth / 2.0, 0),
    RL.White,
  );

  RL.DrawRectangle(RL.GetScreenWidth() / 2 - 2, 0, 4, RL.GetScreenHeight(), RL.LightGray);
  RL.EndDrawing();
}

RL.UnloadRenderTexture(screenCamera1);
RL.UnloadRenderTexture(screenCamera2);
RL.CloseWindow();
