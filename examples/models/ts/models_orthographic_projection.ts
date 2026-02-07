import * as RL from "raylib";

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const FOVY_PERSPECTIVE = 45.0;
const WIDTH_ORTHOGRAPHIC = 10.0;

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - geometric shapes");

const camera = new RL.Camera3D({
  position: vec3(0.0, 10.0, 10.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: FOVY_PERSPECTIVE,
  projection: RL.CameraProjection.PERSPECTIVE,
});

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) {
    if (camera.projection === RL.CameraProjection.PERSPECTIVE) {
      camera.fovy = WIDTH_ORTHOGRAPHIC;
      camera.projection = RL.CameraProjection.ORTHOGRAPHIC;
    } else {
      camera.fovy = FOVY_PERSPECTIVE;
      camera.projection = RL.CameraProjection.PERSPECTIVE;
    }
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  RL.DrawCube(vec3(-4.0, 0.0, 2.0), 2.0, 5.0, 2.0, RL.Red);
  RL.DrawCubeWires(vec3(-4.0, 0.0, 2.0), 2.0, 5.0, 2.0, RL.Gold);
  RL.DrawCubeWires(vec3(-4.0, 0.0, -2.0), 3.0, 6.0, 2.0, RL.Maroon);

  RL.DrawSphere(vec3(-1.0, 0.0, -2.0), 1.0, RL.Green);
  RL.DrawSphereWires(vec3(1.0, 0.0, 2.0), 2.0, 16, 16, RL.Lime);

  RL.DrawCylinder(vec3(4.0, 0.0, -2.0), 1.0, 2.0, 3.0, 4, RL.SkyBlue);
  RL.DrawCylinderWires(vec3(4.0, 0.0, -2.0), 1.0, 2.0, 3.0, 4, RL.DarkBlue);
  RL.DrawCylinderWires(vec3(4.5, -1.0, 2.0), 1.0, 1.0, 2.0, 6, RL.Brown);

  RL.DrawCylinder(vec3(1.0, 0.0, -4.0), 0.0, 1.5, 3.0, 8, RL.Gold);
  RL.DrawCylinderWires(vec3(1.0, 0.0, -4.0), 0.0, 1.5, 3.0, 8, RL.Pink);

  RL.DrawGrid(10, 1.0);

  RL.EndMode3D();

  RL.DrawText("Press Spacebar to switch camera type", 10, RL.GetScreenHeight() - 30, 20, RL.DarkGray);
  if (camera.projection === RL.CameraProjection.ORTHOGRAPHIC) RL.DrawText("ORTHOGRAPHIC", 10, 40, 20, RL.Black);
  else RL.DrawText("PERSPECTIVE", 10, 40, 20, RL.Black);

  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.CloseWindow();
