import * as RL from "raylib";

const MAX_SAMPLES = 512;
const MAX_SAMPLES_PER_UPDATE = 4096;

let frequency = 440.0;
let audioFrequency = 440.0;
let oldFrequency = 1.0;
let sineIdx = 0.0;

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [audio] example - raw audio streaming");
RL.InitAudioDevice();

RL.SetAudioStreamBufferSizeDefault(MAX_SAMPLES_PER_UPDATE);

const stream = RL.LoadAudioStream(44100, 16, 1);

RL.SetAudioStreamCallback(stream, (buffer, frames) => {
  audioFrequency = frequency + (audioFrequency - frequency) * 0.95;

  const incr = audioFrequency / 44100.0;
  const view = new Deno.UnsafePointerView(buffer);
  const ab = view.getArrayBuffer(frames * 2);
  const data = new Int16Array(ab);

  for (let i = 0; i < frames; i++) {
    data[i] = Math.trunc(32000.0 * Math.sin(2 * Math.PI * sineIdx));
    sineIdx += incr;
    if (sineIdx > 1.0) sineIdx -= 1.0;
  }
});

const data = new Int16Array(MAX_SAMPLES);

RL.PlayAudioStream(stream);

let mousePosition = new RL.Vector2(-100, -100);
let waveLength = 1;
let position = new RL.Vector2(0, 0);

RL.SetTargetFPS(30);

while (!RL.WindowShouldClose()) {
  mousePosition = RL.GetMousePosition();

  if (RL.IsMouseButtonDown(RL.MouseButton.LEFT)) {
    const fp = mousePosition.y;
    frequency = 40.0 + fp;

    const pan = mousePosition.x / screenWidth;
    RL.SetAudioStreamPan(stream, pan);
  }

  if (frequency !== oldFrequency) {
    waveLength = Math.trunc(22050 / frequency);
    if (waveLength > MAX_SAMPLES / 2) waveLength = MAX_SAMPLES / 2;
    if (waveLength < 1) waveLength = 1;

    for (let i = 0; i < waveLength * 2; i++) {
      data[i] = Math.trunc(Math.sin((2 * Math.PI * i) / waveLength) * 32000);
    }
    for (let j = waveLength * 2; j < MAX_SAMPLES; j++) {
      data[j] = 0;
    }

    oldFrequency = frequency;
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.DrawText(`sine frequency: ${Math.trunc(frequency)}`, RL.GetScreenWidth() - 220, 10, 20, RL.Red);
  RL.DrawText("click mouse button to change frequency or pan", 10, 10, 20, RL.DarkGray);

  for (let i = 0; i < screenWidth; i++) {
    position.x = i;
    position.y = 250 + (50 * data[Math.trunc((i * MAX_SAMPLES) / screenWidth)]) / 32000.0;
    RL.DrawPixelV(position, RL.Red);
  }

  RL.EndDrawing();
}

RL.UnloadAudioStream(stream);
RL.CloseAudioDevice();
RL.CloseWindow();
