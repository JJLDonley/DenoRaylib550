import * as RL from "raylib";

//------------------------------------------------------------------------------------
// Program main entry point
//------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

// Enable config flags for resizable window and vertical synchro
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

const gameScreenWidth = 640;
const gameScreenHeight = 480;

// Render texture initialization, used to hold the rendering result so we can easily resize it
const target = RL.LoadRenderTexture(gameScreenWidth, gameScreenHeight);
RL.SetTextureFilter(target.texture, RL.TextureFilter.BILINEAR); // Texture scale filter to use

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

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  // Compute required framebuffer scaling
  const scale = Math.min(
    RL.GetScreenWidth() / gameScreenWidth,
    RL.GetScreenHeight() / gameScreenHeight,
  );

  if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) {
    // Recalculate random colors for the bars
    for (let i = 0; i < 10; i++) {
      colors[i] = new RL.Color(
        RL.GetRandomValue(100, 250),
        RL.GetRandomValue(50, 150),
        RL.GetRandomValue(10, 100),
        255,
      );
    }
  }

  // Update virtual mouse (clamped mouse value behind game screen)
  const mouse = RL.GetMousePosition();
  const virtualMouse = new RL.Vector2(0, 0);
  virtualMouse.x =
    (mouse.x - (RL.GetScreenWidth() - (gameScreenWidth * scale)) * 0.5) / scale;
  virtualMouse.y =
    (mouse.y - (RL.GetScreenHeight() - (gameScreenHeight * scale)) * 0.5) /
    scale;

  // Clamp virtual mouse
  virtualMouse.x = Math.max(0, Math.min(virtualMouse.x, gameScreenWidth));
  virtualMouse.y = Math.max(0, Math.min(virtualMouse.y, gameScreenHeight));

  // Apply the same transformation as the virtual mouse to the real mouse (i.e. to work with raygui)
  //SetMouseOffset(-(GetScreenWidth() - (gameScreenWidth*scale))*0.5f, -(GetScreenHeight() - (gameScreenHeight*scale))*0.5f);
  //SetMouseScale(1/scale, 1/scale);
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  // Draw everything in the render texture, note this will not be rendered on screen, yet
  RL.BeginTextureMode(target);
  RL.ClearBackground(RL.RayWhite); // Clear render texture background color

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
    "If executed inside a window,\nyou can resize the window,\nand see the screen scaling!",
    10,
    25,
    20,
    RL.White,
  );

  // Using JS Template Literals instead of RL.TextFormat
  RL.DrawText(
    `Default Mouse: [${Math.floor(mouse.x)} , ${Math.floor(mouse.y)}]`,
    350,
    25,
    20,
    RL.Green,
  );
  RL.DrawText(
    `Virtual Mouse: [${Math.floor(virtualMouse.x)} , ${
      Math.floor(virtualMouse.y)
    }]`,
    350,
    55,
    20,
    RL.Yellow,
  );
  RL.EndTextureMode();

  RL.BeginDrawing();
  RL.ClearBackground(RL.Black); // Clear screen background

  // Draw render texture to screen, properly scaled
  RL.DrawTexturePro(
    target.texture,
    new RL.Rectangle(0, 0, target.texture.width, -target.texture.height),
    new RL.Rectangle(
      (RL.GetScreenWidth() - (gameScreenWidth * scale)) * 0.5,
      (RL.GetScreenHeight() - (gameScreenHeight * scale)) * 0.5,
      gameScreenWidth * scale,
      gameScreenHeight * scale,
    ),
    new RL.Vector2(0, 0),
    0,
    RL.White,
  );
  RL.EndDrawing();
  //--------------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.UnloadRenderTexture(target); // Unload render texture
RL.CloseWindow(); // Close window and OpenGL context
