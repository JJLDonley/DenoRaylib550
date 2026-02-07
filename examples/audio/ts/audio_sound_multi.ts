import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};


const MAX_SOUNDS = 10;

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [audio] example - playing sound multiple times");
RL.InitAudioDevice();

const soundArray: RL.Sound[] = new Array(MAX_SOUNDS);

soundArray[0] = RL.LoadSound(resource("sound.wav"));
for (let i = 1; i < MAX_SOUNDS; i++) {
  soundArray[i] = RL.LoadSoundAlias(soundArray[0]);
}
let currentSound = 0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) {
    RL.PlaySound(soundArray[currentSound]);
    currentSound++;
    if (currentSound >= MAX_SOUNDS) currentSound = 0;
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawText("Press SPACE to PLAY a WAV sound!", 200, 180, 20, RL.LightGray);

  RL.EndDrawing();
}

for (let i = 1; i < MAX_SOUNDS; i++) RL.UnloadSoundAlias(soundArray[i]);
RL.UnloadSound(soundArray[0]);
RL.CloseAudioDevice();
RL.CloseWindow();