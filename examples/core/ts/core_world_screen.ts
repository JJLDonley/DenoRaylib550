import * as RL from "raylib";

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - core world screen");

const camera = new RL.Camera3D({
  position: vec3(10.0, 10.0, 10.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const cubePosition = vec3(0.0, 0.0, 0.0);
let cubeScreenPosition = new RL.Vector2(0.0, 0.0);

RL.DisableCursor();
RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.UpdateCamera(camera, RL.CameraMode.THIRD_PERSON);

  cubeScreenPosition = RL.GetWorldToScreen(
    vec3(cubePosition.x, cubePosition.y + 2.5, cubePosition.z),
    camera,
  );

  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);
  RL.DrawCube(cubePosition, 2.0, 2.0, 2.0, RL.Red);
  RL.DrawCubeWires(cubePosition, 2.0, 2.0, 2.0, RL.Maroon);
  RL.DrawGrid(10, 1.0);
  RL.EndMode3D();

  const label = "Enemy: 100 / 100";
  RL.DrawText(
    label,
    Math.trunc(cubeScreenPosition.x) - Math.trunc(RL.MeasureText("Enemy: 100/100", 20) / 2),
    Math.trunc(cubeScreenPosition.y),
    20,
    RL.Black,
  );

  RL.DrawText(
    `Cube position in screen space coordinates: [${Math.trunc(cubeScreenPosition.x)}, ${Math.trunc(cubeScreenPosition.y)}]`,
    10,
    10,
    20,
    RL.Lime,
  );
  RL.DrawText("Text 2d should be always on top of the cube", 10, 40, 20, RL.Gray);

  RL.EndDrawing();
}

RL.CloseWindow();
