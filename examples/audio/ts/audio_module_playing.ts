import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};


const MAX_CIRCLES = 64;

type CircleWave = {
  position: RL.Vector2;
  radius: number;
  alpha: number;
  speed: number;
  color: RL.Color;
};

const screenWidth = 800;
const screenHeight = 450;

RL.SetConfigFlags(RL.ConfigFlags.MSAA_4X_HINT);
RL.InitWindow(screenWidth, screenHeight, "raylib [audio] example - module playing (streaming)");
RL.InitAudioDevice();

const colors = [
  RL.Orange,
  RL.Red,
  RL.Gold,
  RL.Lime,
  RL.Blue,
  RL.Violet,
  RL.Brown,
  RL.LightGray,
  RL.Pink,
  RL.Yellow,
  RL.Green,
  RL.SkyBlue,
  RL.Purple,
  RL.Beige,
];

const circles: CircleWave[] = Array.from({ length: MAX_CIRCLES }, () => ({
  position: new RL.Vector2(0, 0),
  radius: 0,
  alpha: 0,
  speed: 0,
  color: RL.White,
}));

for (let i = MAX_CIRCLES - 1; i >= 0; i--) {
  circles[i].alpha = 0.0;
  circles[i].radius = RL.GetRandomValue(10, 40);
  circles[i].position.x = RL.GetRandomValue(circles[i].radius, screenWidth - circles[i].radius);
  circles[i].position.y = RL.GetRandomValue(circles[i].radius, screenHeight - circles[i].radius);
  circles[i].speed = RL.GetRandomValue(1, 100) / 2000.0;
  circles[i].color = colors[RL.GetRandomValue(0, 13)];
}

const music = RL.LoadMusicStream(resource("mini1111.xm"));
music.looping = false;
let pitch = 1.0;

RL.PlayMusicStream(music);

let timePlayed = 0.0;
let pause = false;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.UpdateMusicStream(music);

  if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) {
    RL.StopMusicStream(music);
    RL.PlayMusicStream(music);
    pause = false;
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.P)) {
    pause = !pause;
    if (pause) RL.PauseMusicStream(music);
    else RL.ResumeMusicStream(music);
  }

  if (RL.IsKeyDown(RL.KeyboardKey.DOWN)) pitch -= 0.01;
  else if (RL.IsKeyDown(RL.KeyboardKey.UP)) pitch += 0.01;

  RL.SetMusicPitch(music, pitch);

  timePlayed = (RL.GetMusicTimePlayed(music) / RL.GetMusicTimeLength(music)) * (screenWidth - 40);

  for (let i = MAX_CIRCLES - 1; i >= 0 && !pause; i--) {
    circles[i].alpha += circles[i].speed;
    circles[i].radius += circles[i].speed * 10.0;

    if (circles[i].alpha > 1.0) circles[i].speed *= -1;

    if (circles[i].alpha <= 0.0) {
      circles[i].alpha = 0.0;
      circles[i].radius = RL.GetRandomValue(10, 40);
      circles[i].position.x = RL.GetRandomValue(circles[i].radius, screenWidth - circles[i].radius);
      circles[i].position.y = RL.GetRandomValue(circles[i].radius, screenHeight - circles[i].radius);
      circles[i].color = colors[RL.GetRandomValue(0, 13)];
      circles[i].speed = RL.GetRandomValue(1, 100) / 2000.0;
    }
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  for (let i = MAX_CIRCLES - 1; i >= 0; i--) {
    RL.DrawCircleV(circles[i].position, circles[i].radius, RL.Fade(circles[i].color, circles[i].alpha));
  }

  RL.DrawRectangle(20, screenHeight - 20 - 12, screenWidth - 40, 12, RL.LightGray);
  RL.DrawRectangle(20, screenHeight - 20 - 12, Math.trunc(timePlayed), 12, RL.Maroon);
  RL.DrawRectangleLines(20, screenHeight - 20 - 12, screenWidth - 40, 12, RL.Gray);

  RL.DrawRectangle(20, 20, 425, 145, RL.White);
  RL.DrawRectangleLines(20, 20, 425, 145, RL.Gray);
  RL.DrawText("PRESS SPACE TO RESTART MUSIC", 40, 40, 20, RL.Black);
  RL.DrawText("PRESS P TO PAUSE/RESUME", 40, 70, 20, RL.Black);
  RL.DrawText("PRESS UP/DOWN TO CHANGE SPEED", 40, 100, 20, RL.Black);
  RL.DrawText(`SPEED: ${pitch}`, 40, 130, 20, RL.Maroon);

  RL.EndDrawing();
}

RL.UnloadMusicStream(music);
RL.CloseAudioDevice();
RL.CloseWindow();