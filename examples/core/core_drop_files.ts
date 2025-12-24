import * as RL from "raylib";

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - drop files");

let droppedFilePaths: string[] = [];

RL.SetTargetFPS(60); // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) { // Detect window close button or ESC key
  // Update
  //----------------------------------------------------------------------------------
  if (RL.isFileDropped()) {
    const files = RL.LoadDroppedFiles();
    droppedFilePaths.push(...files);
  }
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  if (droppedFilePaths.length === 0) {
    RL.DrawText("Drop your files to this window!", 100, 40, 20, RL.DarkGray);
  } else {
    RL.DrawText("Dropped files:", 100, 40, 20, RL.DarkGray);

    for (let i = 0; i < droppedFilePaths.length; i++) {
      if (i % 2 === 0) {
        RL.DrawRectangle(
          0,
          85 + 40 * i,
          screenWidth,
          40,
          RL.Fade(RL.LightGray, 0.5),
        );
      } else {RL.DrawRectangle(
          0,
          85 + 40 * i,
          screenWidth,
          40,
          RL.Fade(RL.LightGray, 0.3),
        );}

      RL.DrawText(droppedFilePaths[i], 120, 100 + 40 * i, 10, RL.Gray);
    }

    RL.DrawText(
      "Drop new files...",
      100,
      110 + 40 * droppedFilePaths.length,
      20,
      RL.DarkGray,
    );
  }

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
