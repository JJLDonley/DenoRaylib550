import * as RL from "raylib";

const vec2 = (x: number, y: number): RL.Vector2 => new RL.Vector2(x, y);
const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - 3d camera split screen",
);

const cameraPlayer1 = new RL.Camera3D({
  fovy: 45.0,
  up: vec3(0.0, 1.0, 0.0),
  target: vec3(0.0, 1.0, 0.0),
  position: vec3(0.0, 1.0, -3.0),
  projection: RL.CameraProjection.PERSPECTIVE,
});

const screenPlayer1 = RL.LoadRenderTexture(screenWidth / 2, screenHeight);

const cameraPlayer2 = new RL.Camera3D({
  fovy: 45.0,
  up: vec3(0.0, 1.0, 0.0),
  target: vec3(0.0, 3.0, 0.0),
  position: vec3(-3.0, 3.0, 0.0),
  projection: RL.CameraProjection.PERSPECTIVE,
});

const screenPlayer2 = RL.LoadRenderTexture(screenWidth / 2, screenHeight);

const splitScreenRect = new RL.Rectangle(
  0.0,
  0.0,
  screenPlayer1.texture.width,
  -screenPlayer1.texture.height,
);

const count = 5;
const spacing = 4;

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  const offsetThisFrame = 10.0 * RL.GetFrameTime();

  if (RL.IsKeyDown(RL.KeyboardKey.W)) {
    cameraPlayer1.position.z += offsetThisFrame;
    cameraPlayer1.target.z += offsetThisFrame;
  } else if (RL.IsKeyDown(RL.KeyboardKey.S)) {
    cameraPlayer1.position.z -= offsetThisFrame;
    cameraPlayer1.target.z -= offsetThisFrame;
  }

  if (RL.IsKeyDown(RL.KeyboardKey.UP)) {
    cameraPlayer2.position.x += offsetThisFrame;
    cameraPlayer2.target.x += offsetThisFrame;
  } else if (RL.IsKeyDown(RL.KeyboardKey.DOWN)) {
    cameraPlayer2.position.x -= offsetThisFrame;
    cameraPlayer2.target.x -= offsetThisFrame;
  }
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginTextureMode(screenPlayer1);
  RL.ClearBackground(RL.SkyBlue);

  RL.BeginMode3D(cameraPlayer1);

  RL.DrawPlane(vec3(0, 0, 0), vec2(50, 50), RL.Beige);

  for (let x = -count * spacing; x <= count * spacing; x += spacing) {
    for (let z = -count * spacing; z <= count * spacing; z += spacing) {
      RL.DrawCube(vec3(x, 1.5, z), 1, 1, 1, RL.Lime);
      RL.DrawCube(vec3(x, 0.5, z), 0.25, 1, 0.25, RL.Brown);
    }
  }

  RL.DrawCube(cameraPlayer1.position, 1, 1, 1, RL.Red);
  RL.DrawCube(cameraPlayer2.position, 1, 1, 1, RL.Blue);

  RL.EndMode3D();

  RL.DrawRectangle(0, 0, RL.GetScreenWidth() / 2, 40, RL.Fade(RL.RayWhite, 0.8));
  RL.DrawText("PLAYER1: W/S to move", 10, 10, 20, RL.Maroon);

  RL.EndTextureMode();

  RL.BeginTextureMode(screenPlayer2);
  RL.ClearBackground(RL.SkyBlue);

  RL.BeginMode3D(cameraPlayer2);

  RL.DrawPlane(vec3(0, 0, 0), vec2(50, 50), RL.Beige);

  for (let x = -count * spacing; x <= count * spacing; x += spacing) {
    for (let z = -count * spacing; z <= count * spacing; z += spacing) {
      RL.DrawCube(vec3(x, 1.5, z), 1, 1, 1, RL.Lime);
      RL.DrawCube(vec3(x, 0.5, z), 0.25, 1, 0.25, RL.Brown);
    }
  }

  RL.DrawCube(cameraPlayer1.position, 1, 1, 1, RL.Red);
  RL.DrawCube(cameraPlayer2.position, 1, 1, 1, RL.Blue);

  RL.EndMode3D();

  RL.DrawRectangle(0, 0, RL.GetScreenWidth() / 2, 40, RL.Fade(RL.RayWhite, 0.8));
  RL.DrawText("PLAYER2: UP/DOWN to move", 10, 10, 20, RL.DarkBlue);

  RL.EndTextureMode();

  RL.BeginDrawing();
  RL.ClearBackground(RL.Black);

  RL.DrawTextureRec(screenPlayer1.texture, splitScreenRect, vec2(0, 0), RL.White);
  RL.DrawTextureRec(
    screenPlayer2.texture,
    splitScreenRect,
    vec2(screenWidth / 2.0, 0),
    RL.White,
  );

  RL.DrawRectangle(RL.GetScreenWidth() / 2 - 2, 0, 4, RL.GetScreenHeight(), RL.LightGray);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.UnloadRenderTexture(screenPlayer1);
RL.UnloadRenderTexture(screenPlayer2);

RL.CloseWindow();
//--------------------------------------------------------------------------------------
