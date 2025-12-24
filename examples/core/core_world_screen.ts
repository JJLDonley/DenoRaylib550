import * as RL from "raylib";

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - core world screen",
);

// Define the camera to look into our 3d world
let camera = new RL.Camera3D({
  position: new RL.Vector3(10.0, 10.0, 10.0), // Camera position
  target: new RL.Vector3(0.0, 0.0, 0.0), // Camera looking at point
  up: new RL.Vector3(0.0, 1.0, 0.0), // Camera up vector (rotation towards target)
  fovy: 45.0, // Camera field-of-view Y
  projection: RL.CameraProjection.PERSPECTIVE, // Camera projection type
});

let cubePosition = new RL.Vector3(0.0, 0.0, 0.0);
let cubeScreenPosition = new RL.Vector2(0.0, 0.0);

RL.DisableCursor(); // Limit cursor to relative movement inside the window

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  RL.UpdateCamera(camera, RL.CameraMode.THIRD_PERSON);

  // Calculate cube screen space position (with a little offset to be in top)
  cubeScreenPosition = RL.GetWorldToScreen(
    new RL.Vector3(cubePosition.x, cubePosition.y + 2.5, cubePosition.z),
    camera,
  );
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  RL.DrawCube(cubePosition, 2.0, 2.0, 2.0, RL.Red);
  RL.DrawCubeWires(cubePosition, 2.0, 2.0, 2.0, RL.Maroon);

  RL.DrawGrid(10, 1.0);

  RL.EndMode3D();

  const enemyText = "Enemy: 100/100";

  const w = RL.MeasureText(enemyText, 20);
  const x = Math.floor(cubeScreenPosition.x - w / 2);
  const y = Math.floor(cubeScreenPosition.y);

  console.log({ screen: cubeScreenPosition, w, x, y });

  RL.DrawText(
    enemyText,
    x,
    y,
    20,
    RL.Black,
  );

  RL.DrawText(
    `Cube position in screen space coordinates: [${
      Math.floor(cubeScreenPosition.x)
    }, ${Math.floor(cubeScreenPosition.y)}]`,
    10,
    10,
    20,
    RL.Lime,
  );
  RL.DrawText(
    "Text 2d should be always on top of the cube",
    10,
    40,
    20,
    RL.Gray,
  );

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
