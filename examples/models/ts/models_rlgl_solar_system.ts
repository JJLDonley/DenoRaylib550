import * as RL from "raylib";

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const screenWidth = 800;
const screenHeight = 450;

const sunRadius = 4.0;
const earthRadius = 0.6;
const earthOrbitRadius = 8.0;
const moonRadius = 0.16;
const moonOrbitRadius = 1.5;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - solar system (no rlgl)");

const camera = new RL.Camera3D({
  position: vec3(16.0, 16.0, 16.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const rotationSpeed = 0.2;
let earthOrbitRotation = 0.0;
let moonOrbitRotation = 0.0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.UpdateCamera(camera, RL.CameraMode.ORBITAL);

  earthOrbitRotation += (365 / 360.0) * (5.0 * rotationSpeed) * rotationSpeed;
  moonOrbitRotation += 8.0 * rotationSpeed;

  const earthOrbitRad = (earthOrbitRotation * Math.PI) / 180.0;
  const moonOrbitRad = (moonOrbitRotation * Math.PI) / 180.0;

  const earthPos = vec3(
    Math.cos(earthOrbitRad) * earthOrbitRadius,
    0.0,
    Math.sin(earthOrbitRad) * earthOrbitRadius,
  );

  const moonPos = vec3(
    earthPos.x + Math.cos(moonOrbitRad) * moonOrbitRadius,
    0.0,
    earthPos.z + Math.sin(moonOrbitRad) * moonOrbitRadius,
  );

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  RL.DrawSphere(vec3(0.0, 0.0, 0.0), sunRadius, RL.Gold);
  RL.DrawSphere(earthPos, earthRadius, RL.Blue);
  RL.DrawSphere(moonPos, moonRadius, RL.LightGray);

  RL.DrawCircle3D(vec3(0.0, 0.0, 0.0), earthOrbitRadius, vec3(1, 0, 0), 90.0, RL.Fade(RL.Red, 0.5));
  RL.DrawGrid(20, 1.0);

  RL.EndMode3D();

  RL.DrawText("EARTH ORBITING AROUND THE SUN!", 400, 10, 20, RL.Maroon);
  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.CloseWindow();
