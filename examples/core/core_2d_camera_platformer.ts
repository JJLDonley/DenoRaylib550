import * as RL from "raylib";

//----------------------------------------------------------------------------------
// Types and Structures Definition
//----------------------------------------------------------------------------------
class Player {
  position: RL.Vector2;
  speed: number;
  canJump: boolean;

  constructor(position: RL.Vector2, speed: number, canJump: boolean) {
    this.position = position;
    this.speed = speed;
    this.canJump = canJump;
  }
}

class EnvItem {
  rect: RL.Rectangle;
  blocking: number;
  color: RL.Color;

  constructor(rect: RL.Rectangle, blocking: number, color: RL.Color) {
    this.rect = rect;
    this.blocking = blocking;
    this.color = color;
  }
}

const PLAYER_HOR_SPD = 200.0;
const PLAYER_JUMP_SPD = 350.0;
const G = 400;

//------------------------------------------------------------------------------------
// Program main entry point
//------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - 2d camera platformer",
);

const player = new Player(new RL.Vector2(400, 280), 0, false);
const envItems: EnvItem[] = [
  new EnvItem(new RL.Rectangle(0, 0, 1000, 400), 0, RL.LightGray),
  new EnvItem(new RL.Rectangle(0, 400, 1000, 200), 1, RL.Gray),
  new EnvItem(new RL.Rectangle(300, 200, 400, 10), 1, RL.Gray),
  new EnvItem(new RL.Rectangle(250, 300, 100, 10), 1, RL.Gray),
  new EnvItem(new RL.Rectangle(650, 300, 100, 10), 1, RL.Gray),
];

const camera = new RL.Camera2D({
  target: new RL.Vector2(player.position.x, player.position.y),
  offset: new RL.Vector2(screenWidth / 2.0, screenHeight / 2.0),
  rotation: 0.0,
  zoom: 1.0,
});

const cameraUpdaters = [
  updateCameraCenter,
  updateCameraCenterInsideMap,
  updateCameraCenterSmoothFollow,
  updateCameraEvenOutOnLanding,
  updateCameraPlayerBoundsPush,
];

let cameraOption = 0;

const cameraDescriptions = [
  "Follow player center",
  "Follow player center, but clamp to map edges",
  "Follow player center; smoothed",
  "Follow player center horizontally; update player center vertically after landing",
  "Player push camera on getting too close to screen edge",
];

let eveningOut = false;
let evenOutTarget = 0;

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  const deltaTime = RL.GetFrameTime();

  updatePlayer(player, envItems, deltaTime);

  const wheel = RL.GetMouseWheelMove();
  camera.zoom += wheel * 0.05;

  if (camera.zoom > 3.0) camera.zoom = 3.0;
  else if (camera.zoom < 0.25) camera.zoom = 0.25;

  if (RL.IsKeyPressed(RL.KeyboardKey.R)) {
    camera.zoom = 1.0;
    player.position = new RL.Vector2(400, 280);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.C)) {
    cameraOption = (cameraOption + 1) % cameraUpdaters.length;
  }

  // Call update camera function
  cameraUpdaters[cameraOption](
    camera,
    player,
    envItems,
    deltaTime,
    screenWidth,
    screenHeight,
  );
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode2D(camera);

  for (let i = 0; i < envItems.length; i++) {
    RL.DrawRectangleRec(envItems[i].rect, envItems[i].color);
  }

  const playerRect = new RL.Rectangle(
    player.position.x - 20,
    player.position.y - 40,
    40,
    40,
  );
  RL.DrawRectangleRec(playerRect, RL.Red);

  RL.EndMode2D();

  RL.DrawText("Controls:", 20, 20, 10, RL.Black);
  RL.DrawText("- Right/Left to move", 40, 40, 10, RL.DarkGray);
  RL.DrawText("- Space to jump", 40, 60, 10, RL.DarkGray);
  RL.DrawText(
    "- Mouse Wheel to Zoom in-out, [R] to reset",
    40,
    80,
    10,
    RL.DarkGray,
  );
  RL.DrawText("- [C] to change camera mode", 40, 100, 10, RL.DarkGray);

  RL.DrawText("Current camera mode:", 20, 120, 10, RL.Black);
  RL.DrawText(cameraDescriptions[cameraOption], 40, 140, 10, RL.DarkGray);

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

function updatePlayer(
  player: Player,
  envItems: EnvItem[],
  delta: number,
): void {
  if (RL.IsKeyDown(RL.KeyboardKey.LEFT)) {
    player.position.x -= PLAYER_HOR_SPD * delta;
  }
  if (RL.IsKeyDown(RL.KeyboardKey.RIGHT)) {
    player.position.x += PLAYER_HOR_SPD * delta;
  }
  if (RL.IsKeyDown(RL.KeyboardKey.SPACE) && player.canJump) {
    player.speed = -PLAYER_JUMP_SPD;
    player.canJump = false;
  }

  let hitObstacle = false;
  for (let i = 0; i < envItems.length; i++) {
    const ei = envItems[i];
    if (
      ei.blocking &&
      ei.rect.x <= player.position.x &&
      ei.rect.x + ei.rect.width >= player.position.x &&
      ei.rect.y >= player.position.y &&
      ei.rect.y < player.position.y + player.speed * delta
    ) {
      hitObstacle = true;
      player.speed = 0.0;
      player.position.y = ei.rect.y;
    }
  }

  if (!hitObstacle) {
    player.position.y += player.speed * delta;
    player.speed += G * delta;
    player.canJump = false;
  } else player.canJump = true;
}

function updateCameraCenter(
  camera: RL.Camera2D,
  player: Player,
  _envItems: EnvItem[],
  _delta: number,
  width: number,
  height: number,
): void {
  camera.offset = new RL.Vector2(width / 2.0, height / 2.0);
  camera.target.x = player.position.x;
  camera.target.y = player.position.y;
}

function updateCameraCenterInsideMap(
  camera: RL.Camera2D,
  player: Player,
  _envItems: EnvItem[],
  _delta: number,
  width: number,
  height: number,
): void {
  camera.target.x = player.position.x;
  camera.target.y = player.position.y;
  camera.offset = new RL.Vector2(width / 2.0, height / 2.0);
  let minX = 1000, minY = 1000, maxX = -1000, maxY = -1000;

  for (let i = 0; i < envItems.length; i++) {
    const ei = envItems[i];
    minX = Math.min(minX, ei.rect.x);
    maxX = Math.max(maxX, ei.rect.x + ei.rect.width);
    minY = Math.min(minY, ei.rect.y);
    maxY = Math.max(maxY, ei.rect.y + ei.rect.height);
  }

  const max = RL.GetWorldToScreen2D(new RL.Vector2(maxX, maxY), camera);
  const min = RL.GetWorldToScreen2D(new RL.Vector2(minX, minY), camera);

  if (max.x < width) camera.offset.x = width - (max.x - width / 2);
  if (max.y < height) camera.offset.y = height - (max.y - height / 2);
  if (min.x > 0) camera.offset.x = width / 2 - min.x;
  if (min.y > 0) camera.offset.y = height / 2 - min.y;
}

function updateCameraCenterSmoothFollow(
  camera: RL.Camera2D,
  player: Player,
  _envItems: EnvItem[],
  delta: number,
  width: number,
  height: number,
): void {
  const minSpeed = 30;
  const minEffectLength = 10;
  const fractionSpeed = 0.8;

  camera.offset = new RL.Vector2(width / 2.0, height / 2.0);
  const diff = new RL.Vector2(
    player.position.x - camera.target.x,
    player.position.y - camera.target.y,
  );
  const length = Math.sqrt(diff.x * diff.x + diff.y * diff.y);

  if (length > minEffectLength) {
    const speed = Math.max(fractionSpeed * length, minSpeed);
    camera.target.x += diff.x * (speed * delta / length);
    camera.target.y += diff.y * (speed * delta / length);
  }
}

function updateCameraEvenOutOnLanding(
  camera: RL.Camera2D,
  player: Player,
  _envItems: EnvItem[],
  delta: number,
  width: number,
  height: number,
): void {
  camera.offset = new RL.Vector2(width / 2.0, height / 2.0);
  camera.target.x = player.position.x;

  if (eveningOut) {
    if (evenOutTarget > camera.target.y) {
      camera.target.y += 700 * delta;
      if (camera.target.y > evenOutTarget) {
        camera.target.y = evenOutTarget;
        eveningOut = false;
      }
    } else {
      camera.target.y -= 700 * delta;
      if (camera.target.y < evenOutTarget) {
        camera.target.y = evenOutTarget;
        eveningOut = false;
      }
    }
  } else {
    if (
      player.canJump && (player.speed === 0) &&
      (player.position.y !== camera.target.y)
    ) {
      eveningOut = true;
      evenOutTarget = player.position.y;
    }
  }
}

function updateCameraPlayerBoundsPush(
  camera: RL.Camera2D,
  player: Player,
  _envItems: EnvItem[],
  _delta: number,
  width: number,
  height: number,
): void {
  const bbox = new RL.Vector2(0.2, 0.2);

  const bboxWorldMin = RL.GetScreenToWorld2D(
    new RL.Vector2((1 - bbox.x) * 0.5 * width, (1 - bbox.y) * 0.5 * height),
    camera,
  );
  const bboxWorldMax = RL.GetScreenToWorld2D(
    new RL.Vector2((1 + bbox.x) * 0.5 * width, (1 + bbox.y) * 0.5 * height),
    camera,
  );
  camera.offset = new RL.Vector2(
    (1 - bbox.x) * 0.5 * width,
    (1 - bbox.y) * 0.5 * height,
  );

  if (player.position.x < bboxWorldMin.x) camera.target.x = player.position.x;
  if (player.position.y < bboxWorldMin.y) camera.target.y = player.position.y;
  if (player.position.x > bboxWorldMax.x) {
    camera.target.x = bboxWorldMin.x + (player.position.x - bboxWorldMax.x);
  }
  if (player.position.y > bboxWorldMax.y) {
    camera.target.y = bboxWorldMin.y + (player.position.y - bboxWorldMax.y);
  }
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow(); // Close window and OpenGL context
//--------------------------------------------------------------------------------------
