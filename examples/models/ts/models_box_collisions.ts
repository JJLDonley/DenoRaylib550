import * as RL from "raylib";

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - box collisions");

const camera = new RL.Camera3D({
  position: vec3(0.0, 10.0, 10.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const playerPosition = vec3(0.0, 1.0, 2.0);
const playerSize = vec3(1.0, 2.0, 1.0);
let playerColor = RL.Green;

const enemyBoxPos = vec3(-4.0, 1.0, 0.0);
const enemyBoxSize = vec3(2.0, 2.0, 2.0);

const enemySpherePos = vec3(4.0, 0.0, 0.0);
const enemySphereSize = 1.5;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyDown(RL.KeyboardKey.RIGHT)) playerPosition.x += 0.2;
  else if (RL.IsKeyDown(RL.KeyboardKey.LEFT)) playerPosition.x -= 0.2;
  else if (RL.IsKeyDown(RL.KeyboardKey.DOWN)) playerPosition.z += 0.2;
  else if (RL.IsKeyDown(RL.KeyboardKey.UP)) playerPosition.z -= 0.2;

  let collision = false;

  const playerBox = new RL.BoundingBox(
    vec3(
      playerPosition.x - playerSize.x / 2,
      playerPosition.y - playerSize.y / 2,
      playerPosition.z - playerSize.z / 2,
    ),
    vec3(
      playerPosition.x + playerSize.x / 2,
      playerPosition.y + playerSize.y / 2,
      playerPosition.z + playerSize.z / 2,
    ),
  );

  const enemyBox = new RL.BoundingBox(
    vec3(
      enemyBoxPos.x - enemyBoxSize.x / 2,
      enemyBoxPos.y - enemyBoxSize.y / 2,
      enemyBoxPos.z - enemyBoxSize.z / 2,
    ),
    vec3(
      enemyBoxPos.x + enemyBoxSize.x / 2,
      enemyBoxPos.y + enemyBoxSize.y / 2,
      enemyBoxPos.z + enemyBoxSize.z / 2,
    ),
  );

  if (RL.CheckCollisionBoxes(playerBox, enemyBox)) collision = true;
  if (RL.CheckCollisionBoxSphere(playerBox, enemySpherePos, enemySphereSize)) collision = true;

  playerColor = collision ? RL.Red : RL.Green;

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  RL.DrawCube(enemyBoxPos, enemyBoxSize.x, enemyBoxSize.y, enemyBoxSize.z, RL.Gray);
  RL.DrawCubeWires(enemyBoxPos, enemyBoxSize.x, enemyBoxSize.y, enemyBoxSize.z, RL.DarkGray);

  RL.DrawSphere(enemySpherePos, enemySphereSize, RL.Gray);
  RL.DrawSphereWires(enemySpherePos, enemySphereSize, 16, 16, RL.DarkGray);

  RL.DrawCubeV(playerPosition, playerSize, playerColor);

  RL.DrawGrid(10, 1.0);

  RL.EndMode3D();

  RL.DrawText("Move player with arrow keys to collide", 220, 40, 20, RL.Gray);
  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.CloseWindow();
