import * as RL from "raylib";

//------------------------------------------------------------------------------------
// Program main entry point
//------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

// IMPORTANT: WINDOW_ALWAYS_RUN prevents freezing during resize
RL.SetConfigFlags(
  RL.ConfigFlags.WINDOW_RESIZABLE |
    RL.ConfigFlags.WINDOW_ALWAYS_RUN |
    RL.ConfigFlags.VSYNC_HINT,
);

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - window letterbox",
);

RL.SetWindowMinSize(320, 240);

// Virtual game resolution
const gameScreenWidth = 640;
const gameScreenHeight = 480;

// Render texture (virtual screen)
const target = RL.LoadRenderTexture(gameScreenWidth, gameScreenHeight);
RL.SetTextureFilter(target.texture, RL.TextureFilter.BILINEAR);

// Random bar colors
const colors: RL.Color[] = [];
for (let i = 0; i < 10; i++) {
  colors.push(
    new RL.Color(
      RL.GetRandomValue(100, 250),
      RL.GetRandomValue(50, 150),
      RL.GetRandomValue(10, 100),
      255,
    ),
  );
}

RL.SetTargetFPS(60);

//------------------------------------------------------------------------------------
// Main game loop
//------------------------------------------------------------------------------------
while (!RL.WindowShouldClose()) {
  //----------------------------------------------------------------------------------
  // Update
  //----------------------------------------------------------------------------------

  // Compute required framebuffer scaling
  const scale = Math.min(
    RL.GetScreenWidth() / gameScreenWidth,
    RL.GetScreenHeight() / gameScreenHeight,
  );

  // Regenerate colors
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

  // Mouse handling
  const mouse = RL.GetMousePosition();
  const virtualMouse = new RL.Vector2(0, 0);

  virtualMouse.x =
    (mouse.x -
      (RL.GetScreenWidth() - gameScreenWidth * scale) * 0.5) /
    scale;

  virtualMouse.y =
    (mouse.y -
      (RL.GetScreenHeight() - gameScreenHeight * scale) * 0.5) /
    scale;

  // Clamp virtual mouse
  virtualMouse.x = Math.max(0, Math.min(virtualMouse.x, gameScreenWidth));
  virtualMouse.y = Math.max(0, Math.min(virtualMouse.y, gameScreenHeight));

  //----------------------------------------------------------------------------------
  // Draw to render texture (virtual screen)
  //----------------------------------------------------------------------------------
  RL.BeginTextureMode(target);
  RL.ClearBackground(RL.RayWhite);

  for (let i = 0; i < 10; i++) {
    RL.DrawRectangle(
      0,
      Math.floor((gameScreenHeight / 10) * i),
      gameScreenWidth,
      Math.floor(gameScreenHeight / 10),
      colors[i],
    );
  }

  RL.DrawText(
    "Resize the window.\nRendering stays realtime.",
    10,
    25,
    20,
    RL.White,
  );

  RL.DrawText(
    `Mouse: [${Math.floor(mouse.x)}, ${Math.floor(mouse.y)}]`,
    10,
    70,
    20,
    RL.Green,
  );

  RL.DrawText(
    `Virtual: [${Math.floor(virtualMouse.x)}, ${Math.floor(
      virtualMouse.y,
    )}]`,
    10,
    100,
    20,
    RL.Yellow,
  );

  RL.EndTextureMode();

  //----------------------------------------------------------------------------------
  // Draw to screen
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();
  RL.ClearBackground(RL.Black);

  RL.DrawTexturePro(
    target.texture,
    new RL.Rectangle(
      0,
      0,
      target.texture.width,
      -target.texture.height,
    ),
    new RL.Rectangle(
      (RL.GetScreenWidth() - gameScreenWidth * scale) * 0.5,
      (RL.GetScreenHeight() - gameScreenHeight * scale) * 0.5,
      gameScreenWidth * scale,
      gameScreenHeight * scale,
    ),
    new RL.Vector2(0, 0),
    0,
    RL.White,
  );

  RL.EndDrawing();
}

//------------------------------------------------------------------------------------
// De-Initialization
//------------------------------------------------------------------------------------
RL.UnloadRenderTexture(target);
RL.CloseWindow();
