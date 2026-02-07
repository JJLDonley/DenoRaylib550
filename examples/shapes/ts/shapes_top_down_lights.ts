import * as RL from "raylib";

const MAX_BOXES = 20;
const MAX_SHADOWS = MAX_BOXES * 3;
const MAX_LIGHTS = 16;

type ShadowGeometry = { vertices: [RL.Vector2, RL.Vector2, RL.Vector2, RL.Vector2] };

type LightInfo = {
  active: boolean;
  dirty: boolean;
  valid: boolean;
  position: RL.Vector2;
  outerRadius: number;
  bounds: RL.Rectangle;
  shadows: ShadowGeometry[];
  shadowCount: number;
};

const lights: LightInfo[] = Array.from({ length: MAX_LIGHTS }, () => ({
  active: false,
  dirty: false,
  valid: false,
  position: new RL.Vector2(0, 0),
  outerRadius: 0,
  bounds: new RL.Rectangle(0, 0, 0, 0),
  shadows: Array.from({ length: MAX_SHADOWS }, () => ({
    vertices: [new RL.Vector2(0, 0), new RL.Vector2(0, 0), new RL.Vector2(0, 0), new RL.Vector2(0, 0)],
  })),
  shadowCount: 0,
}));

const vecSub = (a: RL.Vector2, b: RL.Vector2) => new RL.Vector2(a.x - b.x, a.y - b.y);
const vecAdd = (a: RL.Vector2, b: RL.Vector2) => new RL.Vector2(a.x + b.x, a.y + b.y);
const vecScale = (v: RL.Vector2, s: number) => new RL.Vector2(v.x * s, v.y * s);
const vecLen = (v: RL.Vector2) => Math.sqrt(v.x * v.x + v.y * v.y);
const vecNormalize = (v: RL.Vector2) => {
  const len = vecLen(v);
  return len === 0 ? new RL.Vector2(0, 0) : new RL.Vector2(v.x / len, v.y / len);
};

function moveLight(slot: number, x: number, y: number) {
  lights[slot].dirty = true;
  lights[slot].position = new RL.Vector2(x, y);
  lights[slot].bounds.x = x - lights[slot].outerRadius;
  lights[slot].bounds.y = y - lights[slot].outerRadius;
}

function computeShadowVolumeForEdge(slot: number, sp: RL.Vector2, ep: RL.Vector2) {
  const light = lights[slot];
  if (light.shadowCount >= MAX_SHADOWS) return;

  const extension = light.outerRadius * 2;
  const spVector = vecNormalize(vecSub(sp, light.position));
  const spProjection = vecAdd(sp, vecScale(spVector, extension));
  const epVector = vecNormalize(vecSub(ep, light.position));
  const epProjection = vecAdd(ep, vecScale(epVector, extension));

  light.shadows[light.shadowCount].vertices = [sp, ep, epProjection, spProjection];
  light.shadowCount++;
}

function setupLight(slot: number, x: number, y: number, radius: number) {
  lights[slot].active = true;
  lights[slot].valid = false;
  lights[slot].outerRadius = radius;
  lights[slot].bounds.width = radius * 2;
  lights[slot].bounds.height = radius * 2;
  moveLight(slot, x, y);
}

function updateLight(slot: number, boxes: RL.Rectangle[], count: number): boolean {
  const light = lights[slot];
  if (!light.active || !light.dirty) return false;

  light.dirty = false;
  light.shadowCount = 0;
  light.valid = false;

  for (let i = 0; i < count; i++) {
    if (RL.CheckCollisionPointRec(light.position, boxes[i])) return false;
    if (!RL.CheckCollisionRecs(light.bounds, boxes[i])) continue;

    let sp = new RL.Vector2(boxes[i].x, boxes[i].y);
    let ep = new RL.Vector2(boxes[i].x + boxes[i].width, boxes[i].y);
    if (light.position.y > ep.y) computeShadowVolumeForEdge(slot, sp, ep);

    sp = ep;
    ep = new RL.Vector2(ep.x, ep.y + boxes[i].height);
    if (light.position.x < ep.x) computeShadowVolumeForEdge(slot, sp, ep);

    sp = ep;
    ep = new RL.Vector2(ep.x - boxes[i].width, ep.y);
    if (light.position.y < ep.y) computeShadowVolumeForEdge(slot, sp, ep);

    sp = ep;
    ep = new RL.Vector2(ep.x, ep.y - boxes[i].height);
    if (light.position.x > ep.x) computeShadowVolumeForEdge(slot, sp, ep);

    light.shadows[light.shadowCount].vertices = [
      new RL.Vector2(boxes[i].x, boxes[i].y),
      new RL.Vector2(boxes[i].x, boxes[i].y + boxes[i].height),
      new RL.Vector2(boxes[i].x + boxes[i].width, boxes[i].y + boxes[i].height),
      new RL.Vector2(boxes[i].x + boxes[i].width, boxes[i].y),
    ];
    light.shadowCount++;
  }

  light.valid = true;
  return true;
}

function setupBoxes(): RL.Rectangle[] {
  const boxes: RL.Rectangle[] = Array.from({ length: MAX_BOXES }, () => new RL.Rectangle(0, 0, 0, 0));
  boxes[0] = new RL.Rectangle(150, 80, 40, 40);
  boxes[1] = new RL.Rectangle(1200, 700, 40, 40);
  boxes[2] = new RL.Rectangle(200, 600, 40, 40);
  boxes[3] = new RL.Rectangle(1000, 50, 40, 40);
  boxes[4] = new RL.Rectangle(500, 350, 40, 40);

  for (let i = 5; i < MAX_BOXES; i++) {
    boxes[i] = new RL.Rectangle(
      RL.GetRandomValue(0, RL.GetScreenWidth()),
      RL.GetRandomValue(0, RL.GetScreenHeight()),
      RL.GetRandomValue(10, 100),
      RL.GetRandomValue(10, 100),
    );
  }

  return boxes;
}

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [shapes] example - top down lights");

const boxes = setupBoxes();
const boxCount = boxes.length;

const img = RL.GenImageChecked(64, 64, 32, 32, RL.DarkBrown, RL.DarkGray);
const backgroundTexture = RL.LoadTextureFromImage(img);
RL.UnloadImage(img);

setupLight(0, 600, 400, 300);
let nextLight = 1;

let showLines = false;

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  if (RL.IsMouseButtonDown(RL.MouseButton.LEFT)) {
    const m = RL.GetMousePosition();
    moveLight(0, m.x, m.y);
  }

  if (RL.IsMouseButtonPressed(RL.MouseButton.RIGHT) && nextLight < MAX_LIGHTS) {
    const m = RL.GetMousePosition();
    setupLight(nextLight, m.x, m.y, 200);
    nextLight++;
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.F1)) showLines = !showLines;

  for (let i = 0; i < MAX_LIGHTS; i++) updateLight(i, boxes, boxCount);

  RL.BeginDrawing();
  RL.ClearBackground(RL.Black);

  RL.DrawTextureRec(backgroundTexture, new RL.Rectangle(0, 0, RL.GetScreenWidth(), RL.GetScreenHeight()), new RL.Vector2(0, 0), RL.White);

  // Draw lights (approximate, without custom blend factors)
  RL.BeginBlendMode(RL.BlendMode.ADDITIVE);
  for (let i = 0; i < MAX_LIGHTS; i++) {
    const light = lights[i];
    if (light.active && light.valid) {
      RL.DrawCircleGradient(Math.trunc(light.position.x), Math.trunc(light.position.y), light.outerRadius, RL.ColorAlpha(RL.White, 0.0), RL.White);
    }
  }
  RL.EndBlendMode();

  // Draw shadows as dark shapes (approximation)
  RL.BeginBlendMode(RL.BlendMode.MULTIPLIED);
  for (let i = 0; i < MAX_LIGHTS; i++) {
    const light = lights[i];
    if (!light.active) continue;
    for (let s = 0; s < light.shadowCount; s++) {
      RL.DrawTriangleFan(light.shadows[s].vertices, 4, RL.ColorAlpha(RL.Black, 0.8));
    }
  }
  RL.EndBlendMode();

  // Draw light markers
  for (let i = 0; i < MAX_LIGHTS; i++) {
    const light = lights[i];
    if (light.active) RL.DrawCircle(Math.trunc(light.position.x), Math.trunc(light.position.y), 10, i === 0 ? RL.Yellow : RL.White);
  }

  if (showLines) {
    for (let s = 0; s < lights[0].shadowCount; s++) {
      RL.DrawTriangleFan(lights[0].shadows[s].vertices, 4, RL.DarkPurple);
    }

    for (let b = 0; b < boxCount; b++) {
      if (RL.CheckCollisionRecs(boxes[b], lights[0].bounds)) RL.DrawRectangleRec(boxes[b], RL.Purple);
      RL.DrawRectangleLines(Math.trunc(boxes[b].x), Math.trunc(boxes[b].y), Math.trunc(boxes[b].width), Math.trunc(boxes[b].height), RL.DarkBlue);
    }

    RL.DrawText("(F1) Hide Shadow Volumes", 10, 50, 10, RL.Green);
  } else {
    RL.DrawText("(F1) Show Shadow Volumes", 10, 50, 10, RL.Green);
  }

  RL.DrawFPS(screenWidth - 80, 10);
  RL.DrawText("Drag to move light #1", 10, 10, 10, RL.DarkGreen);
  RL.DrawText("Right click to add new light", 10, 30, 10, RL.DarkGreen);

  RL.EndDrawing();
}

RL.UnloadTexture(backgroundTexture);
RL.CloseWindow();
