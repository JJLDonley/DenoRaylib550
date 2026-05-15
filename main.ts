import * as raylib from "raylib";

function main() {
  const WindowWidth: int = 1280;
  const WindowHeight: int = 720;
  const Title: string = "Deno + Raylib Example";

  raylib.InitWindow(WindowWidth, WindowHeight, Title);
  raylib.SetTargetFPS(60);

  while (!raylib.WindowShouldClose()) {
    raylib.BeginDrawing();

    raylib.ClearBackground(raylib.RayWhite);

    raylib.DrawText(
      "Hello, Deno Raylib!",
      10,
      10,
      20,
      raylib.Black,
    );

    raylib.EndDrawing();
  }

  raylib.CloseWindow();
}

main();
