import * as RL from "raylib";

const STORAGE_DATA_FILE = "storage.data";

enum StorageData {
  SCORE = 0,
  HISCORE = 1,
}

const saveStorageValue = (position: number, value: number): boolean => {
  const index = position * 4;
  let data = new Uint8Array(0);

  try {
    data = Deno.readFileSync(STORAGE_DATA_FILE);
  } catch {
    data = new Uint8Array(0);
  }

  if (data.length < index + 4) {
    const resized = new Uint8Array(index + 4);
    resized.set(data);
    data = resized;
  }

  const view = new DataView(data.buffer);
  view.setInt32(index, value, true);

  try {
    Deno.writeFileSync(STORAGE_DATA_FILE, data);
    return true;
  } catch {
    return false;
  }
};

const loadStorageValue = (position: number): number => {
  const index = position * 4;
  try {
    const data = Deno.readFileSync(STORAGE_DATA_FILE);
    if (data.length < index + 4) return 0;
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    return view.getInt32(index, true);
  } catch {
    return 0;
  }
};

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - storage save/load values",
);

let score = 0;
let hiscore = 0;
let framesCounter = 0;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsKeyPressed(RL.KeyboardKey.R)) {
    score = RL.GetRandomValue(1000, 2000);
    hiscore = RL.GetRandomValue(2000, 4000);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.ENTER)) {
    saveStorageValue(StorageData.SCORE, score);
    saveStorageValue(StorageData.HISCORE, hiscore);
  } else if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) {
    score = loadStorageValue(StorageData.SCORE);
    hiscore = loadStorageValue(StorageData.HISCORE);
  }

  framesCounter++;

  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.DrawText(`SCORE: ${score}`, 280, 130, 40, RL.Maroon);
  RL.DrawText(`HI-SCORE: ${hiscore}`, 210, 200, 50, RL.Black);

  RL.DrawText(`frames: ${framesCounter}`, 10, 10, 20, RL.Lime);

  RL.DrawText("Press R to generate random numbers", 220, 40, 20, RL.LightGray);
  RL.DrawText("Press ENTER to SAVE values", 250, 310, 20, RL.LightGray);
  RL.DrawText("Press SPACE to LOAD values", 252, 350, 20, RL.LightGray);

  RL.EndDrawing();
}

RL.CloseWindow();
