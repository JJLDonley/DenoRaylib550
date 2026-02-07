import * as RL from "raylib";

type ColorRect = {
  c: RL.Color;
  r: RL.Rectangle;
};

const remap = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);

const generateRandomColor = (): RL.Color =>
  new RL.Color(
    RL.GetRandomValue(0, 255),
    RL.GetRandomValue(0, 255),
    RL.GetRandomValue(0, 255),
    255,
  );

const generateRandomColorRectSequence = (
  rectCount: number,
  rectWidth: number,
  screenWidth: number,
  screenHeight: number,
): ColorRect[] => {
  const seq = RL.LoadRandomSequence(rectCount, 0, rectCount - 1);
  const rectangles: ColorRect[] = [];

  const rectSeqWidth = rectCount * rectWidth;
  const startX = (screenWidth - rectSeqWidth) * 0.5;

  for (let x = 0; x < rectCount; x++) {
    const rectHeight = Math.trunc(remap(seq[x], 0, rectCount - 1, 0, screenHeight));
    rectangles.push({
      c: generateRandomColor(),
      r: new RL.Rectangle(
        startX + x * rectWidth,
        screenHeight - rectHeight,
        rectWidth,
        rectHeight,
      ),
    });
  }

  return rectangles;
};

const shuffleColorRectSequence = (rectangles: ColorRect[], rectCount: number): void => {
  const seq = RL.LoadRandomSequence(rectCount, 0, rectCount - 1);

  for (let i1 = 0; i1 < rectCount; i1++) {
    const r1 = rectangles[i1];
    const r2 = rectangles[seq[i1]];

    const tmp = { c: r1.c, height: r1.r.height, y: r1.r.y };

    r1.c = r2.c;
    r1.r.height = r2.r.height;
    r1.r.y = r2.r.y;

    r2.c = tmp.c;
    r2.r.height = tmp.height;
    r2.r.y = tmp.y;
  }
};

const drawTextCenterKeyHelp = (
  key: string,
  text: string,
  posX: number,
  posY: number,
  fontSize: number,
  color: RL.Color,
): void => {
  const spaceSize = RL.MeasureText(" ", fontSize);
  const pressSize = RL.MeasureText("Press", fontSize);
  const keySize = RL.MeasureText(key, fontSize);
  const textSize = RL.MeasureText(text, fontSize);
  const totalSize = pressSize + 2 * spaceSize + keySize + 2 * spaceSize + textSize;
  let textSizeCurrent = 0;

  RL.DrawText("Press", posX, posY, fontSize, color);
  textSizeCurrent += pressSize + 2 * spaceSize;
  RL.DrawText(key, posX + textSizeCurrent, posY, fontSize, RL.Red);
  RL.DrawRectangle(posX + textSizeCurrent, posY + fontSize, keySize, 3, RL.Red);
  textSizeCurrent += keySize + 2 * spaceSize;
  RL.DrawText(text, posX + textSizeCurrent, posY, fontSize, color);
};

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - Generates a random sequence",
);

let rectCount = 20;
let rectSize = screenWidth / rectCount;
let rectangles = generateRandomColorRectSequence(
  rectCount,
  rectSize,
  screenWidth,
  0.75 * screenHeight,
);

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  if (RL.IsKeyPressed(RL.KeyboardKey.SPACE)) {
    shuffleColorRectSequence(rectangles, rectCount);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.UP)) {
    rectCount++;
    rectSize = screenWidth / rectCount;
    rectangles = generateRandomColorRectSequence(
      rectCount,
      rectSize,
      screenWidth,
      0.75 * screenHeight,
    );
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.DOWN)) {
    if (rectCount >= 4) {
      rectCount--;
      rectSize = screenWidth / rectCount;
      rectangles = generateRandomColorRectSequence(
        rectCount,
        rectSize,
        screenWidth,
        0.75 * screenHeight,
      );
    }
  }
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  const fontSize = 20;
  for (let x = 0; x < rectCount; x++) {
    RL.DrawRectangleRec(rectangles[x].r, rectangles[x].c);
    drawTextCenterKeyHelp(
      "SPACE",
      "to shuffle the sequence.",
      10,
      screenHeight - 96,
      fontSize,
      RL.Black,
    );
    drawTextCenterKeyHelp(
      "UP",
      "to add a rectangle and generate a new sequence.",
      10,
      screenHeight - 64,
      fontSize,
      RL.Black,
    );
    drawTextCenterKeyHelp(
      "DOWN",
      "to remove a rectangle and generate a new sequence.",
      10,
      screenHeight - 32,
      fontSize,
      RL.Black,
    );
  }

  const rectCountText = `${rectCount} rectangles`;
  const rectCountTextSize = RL.MeasureText(rectCountText, fontSize);
  RL.DrawText(rectCountText, screenWidth - rectCountTextSize - 10, 10, fontSize, RL.Black);

  RL.DrawFPS(10, 10);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow();
//--------------------------------------------------------------------------------------
