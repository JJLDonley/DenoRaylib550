import * as RL from "raylib";

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - waving cubes");

const camera = new RL.Camera3D({
  position: vec3(30.0, 20.0, 30.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 70.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const numBlocks = 15;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  const time = RL.GetTime();
  const scale = (2.0 + Math.sin(time)) * 0.7;

  const cameraTime = time * 0.3;
  camera.position.x = Math.cos(cameraTime) * 40.0;
  camera.position.z = Math.sin(cameraTime) * 40.0;

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  RL.DrawGrid(10, 5.0);

  for (let x = 0; x < numBlocks; x++) {
    for (let y = 0; y < numBlocks; y++) {
      for (let z = 0; z < numBlocks; z++) {
        const blockScale = (x + y + z) / 30.0;
        const scatter = Math.sin(blockScale * 20.0 + time * 4.0);

        const cubePos = vec3(
          (x - numBlocks / 2) * (scale * 3.0) + scatter,
          (y - numBlocks / 2) * (scale * 2.0) + scatter,
          (z - numBlocks / 2) * (scale * 3.0) + scatter,
        );

        const cubeColor = RL.ColorFromHSV(((x + y + z) * 18) % 360, 0.75, 0.9);
        const cubeSize = (2.4 - scale) * blockScale;

        RL.DrawCube(cubePos, cubeSize, cubeSize, cubeSize, cubeColor);
      }
    }
  }

  RL.EndMode3D();
  RL.DrawFPS(10, 10);
  RL.EndDrawing();
}

RL.CloseWindow();
