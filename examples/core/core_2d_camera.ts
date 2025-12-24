import * as RL from "raylib";

const MAX_BUILDINGS = 100;

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - 2d camera");

let player = new RL.Rectangle(400, 280, 40, 40);
let buildings: RL.Rectangle[] = [];
let buildColors: RL.Color[] = [];

let spacing = 0;

for (let i = 0; i < MAX_BUILDINGS; i++) {
  const width = RL.GetRandomValue(50, 200);
  const height = RL.GetRandomValue(100, 800);
  const y = screenHeight - 130.0 - height;
  const x = -6000.0 + spacing;

  buildings.push(new RL.Rectangle(x, y, width, height));

  spacing += width;

  buildColors.push(
    new RL.Color(
      RL.GetRandomValue(200, 240),
      RL.GetRandomValue(200, 240),
      RL.GetRandomValue(200, 250),
      255,
    ),
  );
}

let camera = new RL.Camera2D({
  target: new RL.Vector2(player.x + 20.0, player.y + 20.0),
  offset: new RL.Vector2(screenWidth / 2.0, screenHeight / 2.0),
  rotation: 0.0,
  zoom: 1.0,
});

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  // Player movement
  if (RL.IsKeyDown(RL.KeyboardKey.RIGHT)) player.x += 2;
  else if (RL.IsKeyDown(RL.KeyboardKey.LEFT)) player.x -= 2;

  // Camera target follows player
  camera.target = new RL.Vector2(player.x + 20, player.y + 20);

  // Camera rotation controls
  if (RL.IsKeyDown(RL.KeyboardKey.A)) camera.rotation--;
  else if (RL.IsKeyDown(RL.KeyboardKey.S)) camera.rotation++;

  // Limit camera rotation to 80 degrees (-40 to 40)
  if (camera.rotation > 40) camera.rotation = 40;
  else if (camera.rotation < -40) camera.rotation = -40;

  // Camera zoom controls
  camera.zoom += RL.GetMouseWheelMove() * 0.05;

  if (camera.zoom > 3.0) camera.zoom = 3.0;
  else if (camera.zoom < 0.1) camera.zoom = 0.1;

  // Camera reset (zoom and rotation)
  if (RL.IsKeyPressed(RL.KeyboardKey.R)) {
    camera.zoom = 1.0;
    camera.rotation = 0.0;
  }
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode2D(camera);

  RL.DrawRectangle(-6000, 320, 13000, 8000, RL.DarkGray);

  for (let i = 0; i < MAX_BUILDINGS; i++) {
    RL.DrawRectangleRec(buildings[i], buildColors[i]);
  }

  RL.DrawRectangleRec(player, RL.Red);

  RL.DrawLine(
    Math.floor(camera.target.x),
    -screenHeight * 10,
    Math.floor(camera.target.x),
    screenHeight * 10,
    RL.Green,
  );
  RL.DrawLine(
    -screenWidth * 10,
    Math.floor(camera.target.y),
    screenWidth * 10,
    Math.floor(camera.target.y),
    RL.Green,
  );

  RL.EndMode2D();

  RL.DrawText("SCREEN AREA", 640, 10, 20, RL.Red);

  RL.DrawRectangle(0, 0, screenWidth, 5, RL.Red);
  RL.DrawRectangle(0, 5, 5, screenHeight - 10, RL.Red);
  RL.DrawRectangle(screenWidth - 5, 5, 5, screenHeight - 10, RL.Red);
  RL.DrawRectangle(0, screenHeight - 5, screenWidth, 5, RL.Red);

  RL.DrawRectangle(10, 10, 250, 113, RL.Fade(RL.SkyBlue, 0.5));
  RL.DrawRectangleLines(10, 10, 250, 113, RL.Blue);

  RL.DrawText("Free 2d camera controls:", 20, 20, 10, RL.Black);
  RL.DrawText("- Right/Left to move Offset", 40, 40, 10, RL.DarkGray);
  RL.DrawText("- Mouse Wheel to Zoom in-out", 40, 60, 10, RL.DarkGray);
  RL.DrawText("- A / S to Rotate", 40, 80, 10, RL.DarkGray);
  RL.DrawText("- R to reset Zoom and Rotation", 40, 100, 10, RL.DarkGray);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
