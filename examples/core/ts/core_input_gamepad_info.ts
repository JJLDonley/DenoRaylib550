import * as RL from "raylib";

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.SetConfigFlags(RL.ConfigFlags.MSAA_4X_HINT);

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - gamepad information",
);

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  // TODO: Update your variables here
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  for (let i = 0, y = 5; i < 4; i++) {
    if (RL.IsGamepadAvailable(i)) {
      const name = RL.GetGamepadName(i);
      const safeName = name.includes("\0") ? name.split("\0")[0] : name;

      RL.DrawText(`Gamepad name: ${safeName}`, 10, y, 10, RL.Black);
      y += 11;
      RL.DrawText(`\tAxis count:   ${RL.GetGamepadAxisCount(i)}`, 10, y, 10, RL.Black);
      y += 11;

      const axisCount = RL.GetGamepadAxisCount(i);
      for (let axis = 0; axis < axisCount; axis++) {
        const axisValue = RL.GetGamepadAxisMovement(i, axis as RL.GamepadAxis);
        RL.DrawText(`\tAxis ${axis} = ${axisValue}`, 10, y, 10, RL.Black);
        y += 11;
      }

      for (let button = 0; button < 32; button++) {
        const isDown = RL.IsGamepadButtonDown(i, button as RL.GamepadButton);
        RL.DrawText(`\tButton ${button} = ${isDown ? 1 : 0}`, 10, y, 10, RL.Black);
        y += 11;
      }
    }
  }

  RL.DrawFPS(RL.GetScreenWidth() - 100, 100);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow();
//--------------------------------------------------------------------------------------
