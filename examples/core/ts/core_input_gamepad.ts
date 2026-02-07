import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};


const XBOX_ALIAS_1 = "xbox";
const XBOX_ALIAS_2 = "x-box";
const PS_ALIAS = "playstation";

const nameMatches = (name: string, query: string): boolean =>
  name.toLowerCase().includes(query);

const cleanName = (name: string): string => {
  const zero = name.indexOf("\0");
  return (zero >= 0 ? name.slice(0, zero) : name).trim();
};

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.SetConfigFlags(RL.ConfigFlags.MSAA_4X_HINT);

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - gamepad input");

const texPs3Pad = RL.LoadTexture(resource("ps3.png"));
const texXboxPad = RL.LoadTexture(resource("xbox.png"));

const leftStickDeadzoneX = 0.1;
const leftStickDeadzoneY = 0.1;
const rightStickDeadzoneX = 0.1;
const rightStickDeadzoneY = 0.1;
const leftTriggerDeadzone = -0.9;
const rightTriggerDeadzone = -0.9;

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

let gamepad = 0;

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  // ...
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  if (RL.IsKeyPressed(RL.KeyboardKey.LEFT) && gamepad > 0) gamepad--;
  if (RL.IsKeyPressed(RL.KeyboardKey.RIGHT)) gamepad++;

  if (RL.IsGamepadAvailable(gamepad)) {
    const rawName = RL.GetGamepadName(gamepad);
    const name = cleanName(rawName);

    RL.DrawText(`GP${gamepad}: ${name}`, 10, 10, 10, RL.Black);

    let leftStickX = RL.GetGamepadAxisMovement(gamepad, RL.GamepadAxis.LEFT_X);
    let leftStickY = RL.GetGamepadAxisMovement(gamepad, RL.GamepadAxis.LEFT_Y);
    let rightStickX = RL.GetGamepadAxisMovement(gamepad, RL.GamepadAxis.RIGHT_X);
    let rightStickY = RL.GetGamepadAxisMovement(gamepad, RL.GamepadAxis.RIGHT_Y);
    let leftTrigger = RL.GetGamepadAxisMovement(gamepad, RL.GamepadAxis.LEFT_TRIGGER);
    let rightTrigger = RL.GetGamepadAxisMovement(gamepad, RL.GamepadAxis.RIGHT_TRIGGER);

    if (leftStickX > -leftStickDeadzoneX && leftStickX < leftStickDeadzoneX) leftStickX = 0.0;
    if (leftStickY > -leftStickDeadzoneY && leftStickY < leftStickDeadzoneY) leftStickY = 0.0;
    if (rightStickX > -rightStickDeadzoneX && rightStickX < rightStickDeadzoneX) rightStickX = 0.0;
    if (rightStickY > -rightStickDeadzoneY && rightStickY < rightStickDeadzoneY) rightStickY = 0.0;
    if (leftTrigger < leftTriggerDeadzone) leftTrigger = -1.0;
    if (rightTrigger < rightTriggerDeadzone) rightTrigger = -1.0;

    if (nameMatches(name, XBOX_ALIAS_1) || nameMatches(name, XBOX_ALIAS_2)) {
      RL.DrawTexture(texXboxPad, 0, 0, RL.DarkGray);

      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.MIDDLE)) RL.DrawCircle(394, 89, 19, RL.Red);

      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.MIDDLE_RIGHT)) RL.DrawCircle(436, 150, 9, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.MIDDLE_LEFT)) RL.DrawCircle(352, 150, 9, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_FACE_LEFT)) RL.DrawCircle(501, 151, 15, RL.Blue);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_FACE_DOWN)) RL.DrawCircle(536, 187, 15, RL.Lime);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_FACE_RIGHT)) RL.DrawCircle(572, 151, 15, RL.Maroon);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_FACE_UP)) RL.DrawCircle(536, 115, 15, RL.Gold);

      RL.DrawRectangle(317, 202, 19, 71, RL.Black);
      RL.DrawRectangle(293, 228, 69, 19, RL.Black);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_FACE_UP)) RL.DrawRectangle(317, 202, 19, 26, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_FACE_DOWN)) RL.DrawRectangle(317, 247, 19, 26, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_FACE_LEFT)) RL.DrawRectangle(292, 228, 25, 19, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_FACE_RIGHT)) RL.DrawRectangle(336, 228, 26, 19, RL.Red);

      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_TRIGGER_1)) RL.DrawCircle(259, 61, 20, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_TRIGGER_1)) RL.DrawCircle(536, 61, 20, RL.Red);

      let leftGamepadColor = RL.Black;
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_THUMB)) leftGamepadColor = RL.Red;
      RL.DrawCircle(259, 152, 39, RL.Black);
      RL.DrawCircle(259, 152, 34, RL.LightGray);
      RL.DrawCircle(259 + Math.trunc(leftStickX * 20), 152 + Math.trunc(leftStickY * 20), 25, leftGamepadColor);

      let rightGamepadColor = RL.Black;
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_THUMB)) rightGamepadColor = RL.Red;
      RL.DrawCircle(461, 237, 38, RL.Black);
      RL.DrawCircle(461, 237, 33, RL.LightGray);
      RL.DrawCircle(461 + Math.trunc(rightStickX * 20), 237 + Math.trunc(rightStickY * 20), 25, rightGamepadColor);

      RL.DrawRectangle(170, 30, 15, 70, RL.Gray);
      RL.DrawRectangle(604, 30, 15, 70, RL.Gray);
      RL.DrawRectangle(170, 30, 15, Math.trunc(((1 + leftTrigger) / 2) * 70), RL.Red);
      RL.DrawRectangle(604, 30, 15, Math.trunc(((1 + rightTrigger) / 2) * 70), RL.Red);
    } else if (nameMatches(name, PS_ALIAS)) {
      RL.DrawTexture(texPs3Pad, 0, 0, RL.DarkGray);

      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.MIDDLE)) RL.DrawCircle(396, 222, 13, RL.Red);

      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.MIDDLE_LEFT)) RL.DrawRectangle(328, 170, 32, 13, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.MIDDLE_RIGHT)) {
        RL.DrawTriangle(new RL.Vector2(436, 168), new RL.Vector2(436, 185), new RL.Vector2(464, 177), RL.Red);
      }
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_FACE_UP)) RL.DrawCircle(557, 144, 13, RL.Lime);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_FACE_RIGHT)) RL.DrawCircle(586, 173, 13, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_FACE_DOWN)) RL.DrawCircle(557, 203, 13, RL.Violet);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_FACE_LEFT)) RL.DrawCircle(527, 173, 13, RL.Pink);

      RL.DrawRectangle(225, 132, 24, 84, RL.Black);
      RL.DrawRectangle(195, 161, 84, 25, RL.Black);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_FACE_UP)) RL.DrawRectangle(225, 132, 24, 29, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_FACE_DOWN)) RL.DrawRectangle(225, 186, 24, 30, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_FACE_LEFT)) RL.DrawRectangle(195, 161, 30, 25, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_FACE_RIGHT)) RL.DrawRectangle(249, 161, 30, 25, RL.Red);

      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_TRIGGER_1)) RL.DrawCircle(239, 82, 20, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_TRIGGER_1)) RL.DrawCircle(557, 82, 20, RL.Red);

      let leftGamepadColor = RL.Black;
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_THUMB)) leftGamepadColor = RL.Red;
      RL.DrawCircle(319, 255, 35, RL.Black);
      RL.DrawCircle(319, 255, 31, RL.LightGray);
      RL.DrawCircle(319 + Math.trunc(leftStickX * 20), 255 + Math.trunc(leftStickY * 20), 25, leftGamepadColor);

      let rightGamepadColor = RL.Black;
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_THUMB)) rightGamepadColor = RL.Red;
      RL.DrawCircle(475, 255, 35, RL.Black);
      RL.DrawCircle(475, 255, 31, RL.LightGray);
      RL.DrawCircle(475 + Math.trunc(rightStickX * 20), 255 + Math.trunc(rightStickY * 20), 25, rightGamepadColor);

      RL.DrawRectangle(169, 48, 15, 70, RL.Gray);
      RL.DrawRectangle(611, 48, 15, 70, RL.Gray);
      RL.DrawRectangle(169, 48, 15, Math.trunc(((1 + leftTrigger) / 2) * 70), RL.Red);
      RL.DrawRectangle(611, 48, 15, Math.trunc(((1 + rightTrigger) / 2) * 70), RL.Red);
    } else {
      RL.DrawRectangleRounded(new RL.Rectangle(175, 110, 460, 220), 0.3, 16, RL.DarkGray);

      RL.DrawCircle(365, 170, 12, RL.RayWhite);
      RL.DrawCircle(405, 170, 12, RL.RayWhite);
      RL.DrawCircle(445, 170, 12, RL.RayWhite);
      RL.DrawCircle(516, 191, 17, RL.RayWhite);
      RL.DrawCircle(551, 227, 17, RL.RayWhite);
      RL.DrawCircle(587, 191, 17, RL.RayWhite);
      RL.DrawCircle(551, 155, 17, RL.RayWhite);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.MIDDLE_LEFT)) RL.DrawCircle(365, 170, 10, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.MIDDLE)) RL.DrawCircle(405, 170, 10, RL.Green);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.MIDDLE_RIGHT)) RL.DrawCircle(445, 170, 10, RL.Blue);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_FACE_LEFT)) RL.DrawCircle(516, 191, 15, RL.Gold);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_FACE_DOWN)) RL.DrawCircle(551, 227, 15, RL.Blue);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_FACE_RIGHT)) RL.DrawCircle(587, 191, 15, RL.Green);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_FACE_UP)) RL.DrawCircle(551, 155, 15, RL.Red);

      RL.DrawRectangle(245, 145, 28, 88, RL.RayWhite);
      RL.DrawRectangle(215, 174, 88, 29, RL.RayWhite);
      RL.DrawRectangle(247, 147, 24, 84, RL.Black);
      RL.DrawRectangle(217, 176, 84, 25, RL.Black);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_FACE_UP)) RL.DrawRectangle(247, 147, 24, 29, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_FACE_DOWN)) RL.DrawRectangle(247, 201, 24, 30, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_FACE_LEFT)) RL.DrawRectangle(217, 176, 30, 25, RL.Red);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_FACE_RIGHT)) RL.DrawRectangle(271, 176, 30, 25, RL.Red);

      RL.DrawRectangleRounded(new RL.Rectangle(215, 98, 100, 10), 0.5, 16, RL.DarkGray);
      RL.DrawRectangleRounded(new RL.Rectangle(495, 98, 100, 10), 0.5, 16, RL.DarkGray);
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_TRIGGER_1)) {
        RL.DrawRectangleRounded(new RL.Rectangle(215, 98, 100, 10), 0.5, 16, RL.Red);
      }
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_TRIGGER_1)) {
        RL.DrawRectangleRounded(new RL.Rectangle(495, 98, 100, 10), 0.5, 16, RL.Red);
      }

      let leftGamepadColor = RL.Black;
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.LEFT_THUMB)) leftGamepadColor = RL.Red;
      RL.DrawCircle(345, 260, 40, RL.Black);
      RL.DrawCircle(345, 260, 35, RL.LightGray);
      RL.DrawCircle(345 + Math.trunc(leftStickX * 20), 260 + Math.trunc(leftStickY * 20), 25, leftGamepadColor);

      let rightGamepadColor = RL.Black;
      if (RL.IsGamepadButtonDown(gamepad, RL.GamepadButton.RIGHT_THUMB)) rightGamepadColor = RL.Red;
      RL.DrawCircle(465, 260, 40, RL.Black);
      RL.DrawCircle(465, 260, 35, RL.LightGray);
      RL.DrawCircle(465 + Math.trunc(rightStickX * 20), 260 + Math.trunc(rightStickY * 20), 25, rightGamepadColor);

      RL.DrawRectangle(151, 110, 15, 70, RL.Gray);
      RL.DrawRectangle(644, 110, 15, 70, RL.Gray);
      RL.DrawRectangle(151, 110, 15, Math.trunc(((1 + leftTrigger) / 2) * 70), RL.Red);
      RL.DrawRectangle(644, 110, 15, Math.trunc(((1 + rightTrigger) / 2) * 70), RL.Red);
    }

    RL.DrawText(`DETECTED AXIS [${RL.GetGamepadAxisCount(0)}]:`, 10, 50, 10, RL.Maroon);

    const axisCount = RL.GetGamepadAxisCount(0);
    for (let i = 0; i < axisCount; i++) {
      const axis = RL.GetGamepadAxisMovement(0, i as RL.GamepadAxis);
      RL.DrawText(`AXIS ${i}: ${axis.toFixed(2)}`, 20, 70 + 20 * i, 10, RL.DarkGray);
    }

    const pressed = RL.GetGamepadButtonPressed();
    if (pressed !== RL.GamepadButton.UNKNOWN) {
      RL.DrawText(`DETECTED BUTTON: ${pressed}`, 10, 430, 10, RL.Red);
    } else {
      RL.DrawText("DETECTED BUTTON: NONE", 10, 430, 10, RL.Gray);
    }
  } else {
    RL.DrawText(`GP${gamepad}: NOT DETECTED`, 10, 10, 10, RL.Gray);

    RL.DrawTexture(texXboxPad, 0, 0, RL.LightGray);
  }

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.UnloadTexture(texPs3Pad);
RL.UnloadTexture(texXboxPad);

RL.CloseWindow();
//--------------------------------------------------------------------------------------