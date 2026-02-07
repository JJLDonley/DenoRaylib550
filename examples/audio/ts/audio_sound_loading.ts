import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};


const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [audio] example - sound loading and playing");
RL.InitAudioDevice();

const fxWav = RL.LoadSound(resource("sound.wav"));
const fxOgg = RL.LoadSound(resource("target.ogg"));

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) RL.PlaySound(fxWav);
  if (RL.IsKeyPressed(RL.KeyboardKey.ENTER)) RL.PlaySound(fxOgg);

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawText("Press SPACE to PLAY the WAV sound!", 200, 180, 20, RL.LightGray);
  RL.DrawText("Press ENTER to PLAY the OGG sound!", 200, 220, 20, RL.LightGray);

  RL.EndDrawing();
}

RL.UnloadSound(fxWav);
RL.UnloadSound(fxOgg);
RL.CloseAudioDevice();
RL.CloseWindow();