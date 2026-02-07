import * as RL from "raylib";

const windowWidth = 800;
const windowHeight = 450;

RL.SetConfigFlags(RL.ConfigFlags.WINDOW_RESIZABLE | RL.ConfigFlags.VSYNC_HINT);
RL.InitWindow(windowWidth, windowHeight, "raylib [core] example - window scale letterbox");
RL.SetWindowMinSize(320, 240);

const gameScreenWidth = 640;
const gameScreenHeight = 480;

const target = RL.LoadRenderTexture(gameScreenWidth, gameScreenHeight);
RL.SetTextureFilter(target.texture, RL.TextureFilter.BILINEAR);

const colors: RL.Color[] = Array.from({ length: 10 }, () => new RL.Color(0, 0, 0, 255));
for (let i = 0; i < 10; i++) {
  colors[i] = new RL.Color(
    RL.GetRandomValue(100, 250),
    RL.GetRandomValue(50, 150),
    RL.GetRandomValue(10, 100),
    255,
  );
}

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  const scale = Math.min(
    RL.GetScreenWidth() / gameScreenWidth,
    RL.GetScreenHeight() / gameScreenHeight,
  );

  if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) {
    for (let i = 0; i < 10; i++) {
      colors[i] = new RL.Color(
        RL.GetRandomValue(100, 250),
        RL.GetRandomValue(50, 150),
        RL.GetRandomValue(10, 100),
        255,
      );
    }
  }

  const mouse = RL.GetMousePosition();
  const virtualMouse = new RL.Vector2(
    (mouse.x - (RL.GetScreenWidth() - gameScreenWidth * scale) * 0.5) / scale,
    (mouse.y - (RL.GetScreenHeight() - gameScreenHeight * scale) * 0.5) / scale,
  );

  virtualMouse.x = Math.min(Math.max(virtualMouse.x, 0), gameScreenWidth);
  virtualMouse.y = Math.min(Math.max(virtualMouse.y, 0), gameScreenHeight);

  RL.BeginTextureMode(target);
  RL.ClearBackground(RL.RayWhite);

  for (let i = 0; i < 10; i++) {
    RL.DrawRectangle(0, (gameScreenHeight / 10) * i, gameScreenWidth, gameScreenHeight / 10, colors[i]);
  }

  RL.DrawText(
    "If executed inside a window,\nyou can resize the window,\nand see the screen scaling!",
    10,
    25,
    20,
    RL.White,
  );
  RL.DrawText(
    `Default Mouse: [${Math.trunc(mouse.x)} , ${Math.trunc(mouse.y)}]`,
    350,
    25,
    20,
    RL.Green,
  );
  RL.DrawText(
    `Virtual Mouse: [${Math.trunc(virtualMouse.x)} , ${Math.trunc(virtualMouse.y)}]`,
    350,
    55,
    20,
    RL.Yellow,
  );

  RL.EndTextureMode();

  RL.BeginDrawing();
  RL.ClearBackground(RL.Black);

  RL.DrawTexturePro(
    target.texture,
    new RL.Rectangle(0.0, 0.0, target.texture.width, -target.texture.height),
    new RL.Rectangle(
      (RL.GetScreenWidth() - gameScreenWidth * scale) * 0.5,
      (RL.GetScreenHeight() - gameScreenHeight * scale) * 0.5,
      gameScreenWidth * scale,
      gameScreenHeight * scale,
    ),
    new RL.Vector2(0, 0),
    0.0,
    RL.White,
  );

  RL.EndDrawing();
}

RL.UnloadRenderTexture(target);
RL.CloseWindow();
