import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};


const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [audio] example - music playing (streaming)");
RL.InitAudioDevice();

const music = RL.LoadMusicStream(resource("country.mp3"));
RL.PlayMusicStream(music);

let timePlayed = 0.0;
let pause = false;

RL.SetTargetFPS(30);

while (!RL.WindowShouldClose()) {
  RL.UpdateMusicStream(music);

  if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) {
    RL.StopMusicStream(music);
    RL.PlayMusicStream(music);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.P)) {
    pause = !pause;
    if (pause) RL.PauseMusicStream(music);
    else RL.ResumeMusicStream(music);
  }

  timePlayed = RL.GetMusicTimePlayed(music) / RL.GetMusicTimeLength(music);
  if (timePlayed > 1.0) timePlayed = 1.0;

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawText("MUSIC SHOULD BE PLAYING!", 255, 150, 20, RL.LightGray);

  RL.DrawRectangle(200, 200, 400, 12, RL.LightGray);
  RL.DrawRectangle(200, 200, Math.trunc(timePlayed * 400.0), 12, RL.Maroon);
  RL.DrawRectangleLines(200, 200, 400, 12, RL.Gray);

  RL.DrawText("PRESS SPACE TO RESTART MUSIC", 215, 250, 20, RL.LightGray);
  RL.DrawText("PRESS P TO PAUSE/RESUME MUSIC", 208, 280, 20, RL.LightGray);

  RL.EndDrawing();
}

RL.UnloadMusicStream(music);
RL.CloseAudioDevice();
RL.CloseWindow();