import * as RL from "raylib";

const STORAGE_DATA_FILE = "storage.data";

enum StoragePosition {
  SCORE = 0,
  HISCORE = 1,
}

/** Save integer value to storage file */
async function _saveStorageValue(
  position: number,
  value: number,
): Promise<boolean> {
  let fileData: Uint8Array;
  try {
    fileData = await Deno.readFile(STORAGE_DATA_FILE);
  } catch {
    fileData = new Uint8Array();
  }

  const requiredSize = (position + 1) * 4;
  let newFileData: Uint8Array;

  if (fileData.length < requiredSize) {
    newFileData = new Uint8Array(requiredSize);
    newFileData.set(fileData);
  } else {
    newFileData = new Uint8Array(fileData);
  }

  const view = new DataView(newFileData.buffer);
  view.setInt32(position * 4, value, true); // true for little-endian

  try {
    await Deno.writeFile(STORAGE_DATA_FILE, newFileData);
    return true;
  } catch {
    return false;
  }
}

/** Load integer value from storage file */
async function _loadStorageValue(position: number): Promise<number> {
  try {
    const fileData = await Deno.readFile(STORAGE_DATA_FILE);
    const requiredSize = (position + 1) * 4;

    if (fileData.length < requiredSize) return 0;

    const view = new DataView(fileData.buffer);
    return view.getInt32(position * 4, true);
  } catch {
    return 0;
  }
}

//------------------------------------------------------------------------------------
// Program main entry point
//------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - storage values",
);

let score = 0;
let hiscore = 0;
let framesCounter = 0;

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  if (RL.IsKeyPressed(RL.KeyboardKey.R)) {
    score = RL.GetRandomValue(1000, 2000);
    hiscore = RL.GetRandomValue(2000, 4000);
  }

  // Handle input: enterprise sync versions for loop

  // RE-IMPLEMENTING SYNC VERSION FOR USE IN LOOP
  if (RL.IsKeyPressed(RL.KeyboardKey.ENTER)) {
    const saveSync = (pos: number, val: number) => {
      let data: Uint8Array;
      try {
        data = Deno.readFileSync(STORAGE_DATA_FILE);
      } catch {
        data = new Uint8Array();
      }
      const req = (pos + 1) * 4;
      const newData = new Uint8Array(Math.max(data.length, req));
      newData.set(data);
      new DataView(newData.buffer).setInt32(pos * 4, val, true);
      Deno.writeFileSync(STORAGE_DATA_FILE, newData);
    };
    saveSync(StoragePosition.SCORE, score);
    saveSync(StoragePosition.HISCORE, hiscore);
  } else if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) {
    const loadSync = (pos: number) => {
      try {
        const data = Deno.readFileSync(STORAGE_DATA_FILE);
        if (data.length < (pos + 1) * 4) return 0;
        return new DataView(data.buffer).getInt32(pos * 4, true);
      } catch {
        return 0;
      }
    };
    score = loadSync(StoragePosition.SCORE);
    hiscore = loadSync(StoragePosition.HISCORE);
  }

  framesCounter++;
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  // Using template literals as requested
  RL.DrawText(`SCORE: ${score}`, 280, 130, 40, RL.Maroon);
  RL.DrawText(`HI-SCORE: ${hiscore}`, 210, 200, 50, RL.Black);

  RL.DrawText(`frames: ${framesCounter}`, 10, 10, 20, RL.Lime);

  RL.DrawText("Press R to generate random numbers", 220, 40, 20, RL.LightGray);
  RL.DrawText("Press ENTER to SAVE values", 250, 310, 20, RL.LightGray);
  RL.DrawText("Press SPACE to LOAD values", 252, 350, 20, RL.LightGray);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
