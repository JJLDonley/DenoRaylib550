import * as RL from "raylib";

const MAX_FILEPATH_RECORDED = 4096;

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - drop files");

let filePathCounter = 0;
const filePaths: string[] = [];

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  if (RL.isFileDropped()) {
    const droppedFiles = RL.LoadDroppedFiles();

    for (let i = 0; i < droppedFiles.length; i++) {
      if (filePathCounter < MAX_FILEPATH_RECORDED - 1) {
        filePaths.push(droppedFiles[i]);
        filePathCounter++;
      }
    }
  }
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  if (filePathCounter === 0) {
    RL.DrawText("Drop your files to this window!", 100, 40, 20, RL.DarkGray);
  } else {
    RL.DrawText("Dropped files:", 100, 40, 20, RL.DarkGray);

    for (let i = 0; i < filePathCounter; i++) {
      const y = 85 + 40 * i;
      if (i % 2 === 0) {
        RL.DrawRectangle(0, y, screenWidth, 40, RL.Fade(RL.LightGray, 0.5));
      } else {
        RL.DrawRectangle(0, y, screenWidth, 40, RL.Fade(RL.LightGray, 0.3));
      }

      RL.DrawText(filePaths[i], 120, 100 + 40 * i, 10, RL.Gray);
    }

    RL.DrawText(
      "Drop new files...",
      100,
      110 + 40 * filePathCounter,
      20,
      RL.DarkGray,
    );
  }

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow();
//--------------------------------------------------------------------------------------
