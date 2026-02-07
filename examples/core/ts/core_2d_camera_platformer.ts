import * as RL from "raylib";

const G = 400;
const PLAYER_JUMP_SPD = 350.0;
const PLAYER_HOR_SPD = 200.0;

type Player = {
  position: RL.Vector2;
  speed: number;
  canJump: boolean;
};

type EnvItem = {
  rect: RL.Rectangle;
  blocking: boolean;
  color: RL.Color;
};

const vector2Add = (a: RL.Vector2, b: RL.Vector2) =>
  new RL.Vector2(a.x + b.x, a.y + b.y);
const vector2Subtract = (a: RL.Vector2, b: RL.Vector2) =>
  new RL.Vector2(a.x - b.x, a.y - b.y);
const vector2Scale = (v: RL.Vector2, s: number) =>
  new RL.Vector2(v.x * s, v.y * s);
const vector2Length = (v: RL.Vector2) => Math.hypot(v.x, v.y);

function updatePlayer(
  player: Player,
  envItems: EnvItem[],
  delta: number,
) {
  if (RL.IsKeyDown(RL.KeyboardKey.LEFT)) player.position.x -= PLAYER_HOR_SPD * delta;
  if (RL.IsKeyDown(RL.KeyboardKey.RIGHT)) player.position.x += PLAYER_HOR_SPD * delta;
  if (RL.IsKeyDown(RL.KeyboardKey.SPACE) && player.canJump) {
    player.speed = -PLAYER_JUMP_SPD;
    player.canJump = false;
  }

  let hitObstacle = false;
  for (let i = 0; i < envItems.length; i++) {
    const ei = envItems[i];
    const p = player.position;
    if (
      ei.blocking &&
      ei.rect.x <= p.x &&
      ei.rect.x + ei.rect.width >= p.x &&
      ei.rect.y >= p.y &&
      ei.rect.y <= p.y + player.speed * delta
    ) {
      hitObstacle = true;
      player.speed = 0.0;
      p.y = ei.rect.y;
      break;
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
  width: number,
  height: number,
) {
  camera.offset = new RL.Vector2(width / 2.0, height / 2.0);
  camera.target = new RL.Vector2(player.position.x, player.position.y);
}

function updateCameraCenterInsideMap(
  camera: RL.Camera2D,
  player: Player,
  envItems: EnvItem[],
  width: number,
  height: number,
) {
  camera.target = new RL.Vector2(player.position.x, player.position.y);
  camera.offset = new RL.Vector2(width / 2.0, height / 2.0);
  let minX = 1000;
  let minY = 1000;
  let maxX = -1000;
  let maxY = -1000;

  for (const ei of envItems) {
    minX = Math.min(ei.rect.x, minX);
    maxX = Math.max(ei.rect.x + ei.rect.width, maxX);
    minY = Math.min(ei.rect.y, minY);
    maxY = Math.max(ei.rect.y + ei.rect.height, maxY);
  }

  const max = RL.GetWorldToScreen2D(new RL.Vector2(maxX, maxY), camera);
  const min = RL.GetWorldToScreen2D(new RL.Vector2(minX, minY), camera);

  if (max.x < width) camera.offset.x = width - (max.x - width / 2);
  if (max.y < height) camera.offset.y = height - (max.y - height / 2);
  if (min.x > 0) camera.offset.x = width / 2 - min.x;
  if (min.y > 0) camera.offset.y = height / 2 - min.y;
}

let minSpeed = 30;
let minEffectLength = 10;
let fractionSpeed = 0.8;

function updateCameraCenterSmoothFollow(
  camera: RL.Camera2D,
  player: Player,
  delta: number,
  width: number,
  height: number,
) {
  camera.offset = new RL.Vector2(width / 2.0, height / 2.0);
  const diff = vector2Subtract(player.position, camera.target);
  const length = vector2Length(diff);

  if (length > minEffectLength) {
    const speed = Math.max(fractionSpeed * length, minSpeed);
    camera.target = vector2Add(
      camera.target,
      vector2Scale(diff, (speed * delta) / length),
    );
  }
}

let evenOutSpeed = 700;
let eveningOut = false;
let evenOutTarget = 0;

function updateCameraEvenOutOnLanding(
  camera: RL.Camera2D,
  player: Player,
  delta: number,
  width: number,
  height: number,
) {
  camera.offset = new RL.Vector2(width / 2.0, height / 2.0);
  camera.target.x = player.position.x;

  if (eveningOut) {
    if (evenOutTarget > camera.target.y) {
      camera.target.y += evenOutSpeed * delta;
      if (camera.target.y > evenOutTarget) {
        camera.target.y = evenOutTarget;
        eveningOut = false;
      }
    } else {
      camera.target.y -= evenOutSpeed * delta;
      if (camera.target.y < evenOutTarget) {
        camera.target.y = evenOutTarget;
        eveningOut = false;
      }
    }
  } else {
    if (player.canJump && player.speed === 0 && player.position.y !== camera.target.y) {
      eveningOut = true;
      evenOutTarget = player.position.y;
    }
  }
}

const bbox = new RL.Vector2(0.2, 0.2);

function updateCameraPlayerBoundsPush(
  camera: RL.Camera2D,
  player: Player,
  width: number,
  height: number,
) {
  const bboxWorldMin = RL.GetSCreenToWorld2D(
    new RL.Vector2((1 - bbox.x) * 0.5 * width, (1 - bbox.y) * 0.5 * height),
    camera,
  );
  const bboxWorldMax = RL.GetSCreenToWorld2D(
    new RL.Vector2((1 + bbox.x) * 0.5 * width, (1 + bbox.y) * 0.5 * height),
    camera,
  );
  camera.offset = new RL.Vector2((1 - bbox.x) * 0.5 * width, (1 - bbox.y) * 0.5 * height);

  if (player.position.x < bboxWorldMin.x) camera.target.x = player.position.x;
  if (player.position.y < bboxWorldMin.y) camera.target.y = player.position.y;
  if (player.position.x > bboxWorldMax.x) {
    camera.target.x = bboxWorldMin.x + (player.position.x - bboxWorldMax.x);
  }
  if (player.position.y > bboxWorldMax.y) {
    camera.target.y = bboxWorldMin.y + (player.position.y - bboxWorldMax.y);
  }
}

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - 2d camera");

const player: Player = {
  position: new RL.Vector2(400, 280),
  speed: 0,
  canJump: false,
};

const envItems: EnvItem[] = [
  { rect: new RL.Rectangle(0, 0, 1000, 400), blocking: false, color: RL.LightGray },
  { rect: new RL.Rectangle(0, 400, 1000, 200), blocking: true, color: RL.Gray },
  { rect: new RL.Rectangle(300, 200, 400, 10), blocking: true, color: RL.Gray },
  { rect: new RL.Rectangle(250, 300, 100, 10), blocking: true, color: RL.Gray },
  { rect: new RL.Rectangle(650, 300, 100, 10), blocking: true, color: RL.Gray },
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
] as const;

let cameraOption = 0;

const cameraDescriptions = [
  "Follow player center",
  "Follow player center, but clamp to map edges",
  "Follow player center; smoothed",
  "Follow player center horizontally; update player center vertically after landing",
  "Player push camera on getting too close to screen edge",
];

RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  const deltaTime = RL.GetFrameTime();

  updatePlayer(player, envItems, deltaTime);

  camera.zoom += RL.GetMouseWheelMove() * 0.05;

  if (camera.zoom > 3.0) camera.zoom = 3.0;
  else if (camera.zoom < 0.25) camera.zoom = 0.25;

  if (RL.IsKeyPressed(RL.KeyboardKey.R)) {
    camera.zoom = 1.0;
    player.position = new RL.Vector2(400, 280);
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.C)) {
    cameraOption = (cameraOption + 1) % cameraUpdaters.length;
  }

  const updater = cameraUpdaters[cameraOption];
  switch (updater) {
    case updateCameraCenter:
      updater(camera, player, screenWidth, screenHeight);
      break;
    case updateCameraCenterInsideMap:
      updater(camera, player, envItems, screenWidth, screenHeight);
      break;
    case updateCameraCenterSmoothFollow:
      updater(camera, player, deltaTime, screenWidth, screenHeight);
      break;
    case updateCameraEvenOutOnLanding:
      updater(camera, player, deltaTime, screenWidth, screenHeight);
      break;
    case updateCameraPlayerBoundsPush:
      updater(camera, player, screenWidth, screenHeight);
      break;
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.LightGray);

  RL.BeginMode2D(camera);
  for (const env of envItems) {
    RL.DrawRectangleRec(env.rect, env.color);
  }

  const playerRect = new RL.Rectangle(
    player.position.x - 20,
    player.position.y - 40,
    40.0,
    40.0,
  );
  RL.DrawRectangleRec(playerRect, RL.Red);
  RL.DrawCircleV(player.position, 5.0, RL.Gold);

  RL.EndMode2D();

  RL.DrawText("Controls:", 20, 20, 10, RL.Black);
  RL.DrawText("- Right/Left to move", 40, 40, 10, RL.DarkGray);
  RL.DrawText("- Space to jump", 40, 60, 10, RL.DarkGray);
  RL.DrawText("- Mouse Wheel to Zoom in-out, R to reset zoom", 40, 80, 10, RL.DarkGray);
  RL.DrawText("- C to change camera mode", 40, 100, 10, RL.DarkGray);
  RL.DrawText("Current camera mode:", 20, 120, 10, RL.Black);
  RL.DrawText(cameraDescriptions[cameraOption], 40, 140, 10, RL.DarkGray);

  RL.EndDrawing();
}

RL.CloseWindow();
