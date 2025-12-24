import * as RL from "raylib";

//------------------------------------------------------------------------------------
// Program main entry point
//------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

const virtualScreenWidth = 160;
const virtualScreenHeight = 90;

const virtualRatio = screenWidth / virtualScreenWidth;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - smooth pixelperfect",
);

const worldSpaceCamera = new RL.Camera2D({
  offset: new RL.Vector2(0, 0),
  target: new RL.Vector2(0, 0),
  rotation: 0,
  zoom: 1.0,
}); // Game world camera

const screenSpaceCamera = new RL.Camera2D({
  offset: new RL.Vector2(0, 0),
  target: new RL.Vector2(0, 0),
  rotation: 0,
  zoom: 1.0,
}); // Smoothing camera

// Load render texture to draw all our objects
const target = RL.LoadRenderTexture(virtualScreenWidth, virtualScreenHeight);

const rec01 = new RL.Rectangle(70.0, 35.0, 20.0, 20.0);
const rec02 = new RL.Rectangle(90.0, 55.0, 30.0, 10.0);
const rec03 = new RL.Rectangle(80.0, 65.0, 15.0, 25.0);

// The target's height is flipped (in the source Rectangle), due to OpenGL reasons
const sourceRec = new RL.Rectangle(
  0.0,
  0.0,
  target.texture.width,
  -target.texture.height,
);
const destRec = new RL.Rectangle(
  -virtualRatio,
  -virtualRatio,
  screenWidth + virtualRatio * 2,
  screenHeight + virtualRatio * 2,
);

const origin = new RL.Vector2(0.0, 0.0);

let rotation = 0.0;

let cameraX = 0.0;
let cameraY = 0.0;

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  rotation += 60.0 * RL.GetFrameTime(); // Rotate the rectangles, 60 degrees per second

  // Make the camera move to demonstrate the effect
  cameraX = Math.sin(RL.GetTime()) * 50.0 - 10.0;
  cameraY = Math.cos(RL.GetTime()) * 30.0;

  // Set the camera's target to the values computed above
  screenSpaceCamera.target.x = cameraX;
  screenSpaceCamera.target.y = cameraY;

  // Round worldSpace coordinates, keep decimals into screenSpace coordinates
  worldSpaceCamera.target.x = Math.trunc(screenSpaceCamera.target.x);
  screenSpaceCamera.target.x -= worldSpaceCamera.target.x;
  screenSpaceCamera.target.x *= virtualRatio;

  worldSpaceCamera.target.y = Math.trunc(screenSpaceCamera.target.y);
  screenSpaceCamera.target.y -= worldSpaceCamera.target.y;
  screenSpaceCamera.target.y *= virtualRatio;
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginTextureMode(target);
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode2D(worldSpaceCamera);
  RL.DrawRectanglePro(rec01, origin, rotation, RL.Black);
  RL.DrawRectanglePro(rec02, origin, -rotation, RL.Red);
  RL.DrawRectanglePro(rec03, origin, rotation + 45.0, RL.Blue);
  RL.EndMode2D();
  RL.EndTextureMode();

  RL.BeginDrawing();
  RL.ClearBackground(RL.Red);

  RL.BeginMode2D(screenSpaceCamera);
  RL.DrawTexturePro(target.texture, sourceRec, destRec, origin, 0.0, RL.White);
  RL.EndMode2D();

  RL.DrawText(
    `Screen resolution: ${screenWidth}x${screenHeight}`,
    10,
    10,
    20,
    RL.DarkBlue,
  );
  RL.DrawText(
    `World resolution: ${virtualScreenWidth}x${virtualScreenHeight}`,
    10,
    40,
    20,
    RL.DarkGreen,
  );
  RL.DrawFPS(RL.GetScreenWidth() - 95, 10);
  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.UnloadRenderTexture(target); // Unload render texture

RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
