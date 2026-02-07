import * as RL from "raylib";

const GRAVITY = 400;
const PLAYER_JUMP_SPD = 350.0;
const PLAYER_HOR_SPD = 200.0;
const MAX_ENVIRONMENT_ELEMENTS = 5;

const vec2 = (x: number, y: number): RL.Vector2 => new RL.Vector2(x, y);

type Player = {
  position: RL.Vector2;
  speed: number;
  canJump: boolean;
};

type EnvElement = {
  rect: RL.Rectangle;
  blocking: boolean;
  color: RL.Color;
};

const getAutomationEvent = (
  list: RL.AutomationEventList,
  index: number,
): RL.AutomationEvent | null => {
  if (index < 0 || index >= list.count) return null;
  const ptr = Deno.UnsafePointer.create(list.eventsPtr);
  if (!ptr) return null;
  const view = new Deno.UnsafePointerView(ptr);
  const size = RL.AutomationEvent.SIZE;
  const buf = view.getArrayBuffer((index + 1) * size);
  return new RL.AutomationEvent(new Uint8Array(buf, index * size, size));
};

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - automation events",
);

const player: Player = {
  position: vec2(400, 280),
  speed: 0,
  canJump: false,
};

const envElements: EnvElement[] = [
  { rect: new RL.Rectangle(0, 0, 1000, 400), blocking: false, color: RL.LightGray },
  { rect: new RL.Rectangle(0, 400, 1000, 200), blocking: true, color: RL.Gray },
  { rect: new RL.Rectangle(300, 200, 400, 10), blocking: true, color: RL.Gray },
  { rect: new RL.Rectangle(250, 300, 100, 10), blocking: true, color: RL.Gray },
  { rect: new RL.Rectangle(650, 300, 100, 10), blocking: true, color: RL.Gray },
];

const camera = new RL.Camera2D({
  target: player.position,
  offset: vec2(screenWidth / 2.0, screenHeight / 2.0),
  rotation: 0.0,
  zoom: 1.0,
});

let aelist = RL.LoadAutomationEventList("");
RL.SetAutomationEventList(aelist);
let eventRecording = false;
let eventPlaying = false;

let frameCounter = 0;
let playFrameCounter = 0;
let currentPlayFrame = 0;

RL.SetTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!RL.WindowShouldClose()) {
  // Update
  //----------------------------------------------------------------------------------
  const deltaTime = 0.015;

  if (RL.isFileDropped()) {
    const droppedFiles = RL.LoadDroppedFiles();
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      const lower = file.toLowerCase();
      if (lower.endsWith(".txt") || lower.endsWith(".rae")) {
        RL.UnloadAutomationEventList(aelist);
        aelist = RL.LoadAutomationEventList(file);
        RL.SetAutomationEventList(aelist);

        eventRecording = false;

        eventPlaying = true;
        playFrameCounter = 0;
        currentPlayFrame = 0;

        player.position = vec2(400, 280);
        player.speed = 0;
        player.canJump = false;

        camera.target = player.position;
        camera.offset = vec2(screenWidth / 2.0, screenHeight / 2.0);
        camera.rotation = 0.0;
        camera.zoom = 1.0;
      }
    }
  }

  if (RL.IsKeyDown(RL.KeyboardKey.LEFT)) {
    player.position.x -= PLAYER_HOR_SPD * deltaTime;
  }
  if (RL.IsKeyDown(RL.KeyboardKey.RIGHT)) {
    player.position.x += PLAYER_HOR_SPD * deltaTime;
  }
  if (RL.IsKeyDown(RL.KeyboardKey.SPACE) && player.canJump) {
    player.speed = -PLAYER_JUMP_SPD;
    player.canJump = false;
  }

  let hitObstacle = false;
  for (let i = 0; i < MAX_ENVIRONMENT_ELEMENTS; i++) {
    const element = envElements[i];
    const p = player.position;
    if (
      element.blocking &&
      element.rect.x <= p.x &&
      element.rect.x + element.rect.width >= p.x &&
      element.rect.y >= p.y &&
      element.rect.y <= p.y + player.speed * deltaTime
    ) {
      hitObstacle = true;
      player.speed = 0.0;
      p.y = element.rect.y;
    }
  }

  if (!hitObstacle) {
    player.position.y += player.speed * deltaTime;
    player.speed += GRAVITY * deltaTime;
    player.canJump = false;
  } else {
    player.canJump = true;
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.R)) {
    player.position = vec2(400, 280);
    player.speed = 0;
    player.canJump = false;

    camera.target = player.position;
    camera.offset = vec2(screenWidth / 2.0, screenHeight / 2.0);
    camera.rotation = 0.0;
    camera.zoom = 1.0;
  }

  if (eventPlaying) {
    while (currentPlayFrame < aelist.count) {
      const event = getAutomationEvent(aelist, currentPlayFrame);
      if (!event) {
        eventPlaying = false;
        currentPlayFrame = 0;
        playFrameCounter = 0;
        break;
      }
      if (playFrameCounter === event.frame) {
        RL.PlayAutomationEvent(event);
        currentPlayFrame++;

        if (currentPlayFrame === aelist.count) {
          eventPlaying = false;
          currentPlayFrame = 0;
          playFrameCounter = 0;
          break;
        }
      } else {
        break;
      }
    }

    playFrameCounter++;
  }

  camera.target = player.position;
  camera.offset = vec2(screenWidth / 2.0, screenHeight / 2.0);

  let minX = 1000;
  let minY = 1000;
  let maxX = -1000;
  let maxY = -1000;

  camera.zoom += RL.GetMouseWheelMove() * 0.05;
  if (camera.zoom > 3.0) camera.zoom = 3.0;
  else if (camera.zoom < 0.25) camera.zoom = 0.25;

  for (let i = 0; i < MAX_ENVIRONMENT_ELEMENTS; i++) {
    const element = envElements[i];
    minX = Math.min(element.rect.x, minX);
    maxX = Math.max(element.rect.x + element.rect.width, maxX);
    minY = Math.min(element.rect.y, minY);
    maxY = Math.max(element.rect.y + element.rect.height, maxY);
  }

  const max = RL.GetWorldToScreen2D(vec2(maxX, maxY), camera);
  const min = RL.GetWorldToScreen2D(vec2(minX, minY), camera);

  if (max.x < screenWidth) {
    camera.offset.x = screenWidth - (max.x - screenWidth / 2);
  }
  if (max.y < screenHeight) {
    camera.offset.y = screenHeight - (max.y - screenHeight / 2);
  }
  if (min.x > 0) {
    camera.offset.x = screenWidth / 2 - min.x;
  }
  if (min.y > 0) {
    camera.offset.y = screenHeight / 2 - min.y;
  }

  if (RL.IsKeyPressed(RL.KeyboardKey.S)) {
    if (!eventPlaying) {
      if (eventRecording) {
        RL.StopAutomationEventRecording();
        eventRecording = false;

        RL.ExportAutomationEventList(aelist, "automation.rae");
      } else {
        RL.SetAutomationEventBaseFrame(180);
        RL.StartAutomationEventRecording();
        eventRecording = true;
      }
    }
  } else if (RL.IsKeyPressed(RL.KeyboardKey.A)) {
    if (!eventRecording && aelist.count > 0) {
      eventPlaying = true;
      playFrameCounter = 0;
      currentPlayFrame = 0;

      player.position = vec2(400, 280);
      player.speed = 0;
      player.canJump = false;

      camera.target = player.position;
      camera.offset = vec2(screenWidth / 2.0, screenHeight / 2.0);
      camera.rotation = 0.0;
      camera.zoom = 1.0;
    }
  }

  if (eventRecording || eventPlaying) frameCounter++;
  else frameCounter = 0;
  //----------------------------------------------------------------------------------

  // Draw
  //----------------------------------------------------------------------------------
  RL.BeginDrawing();

  RL.ClearBackground(RL.LightGray);

  RL.BeginMode2D(camera);

  for (let i = 0; i < MAX_ENVIRONMENT_ELEMENTS; i++) {
    RL.DrawRectangleRec(envElements[i].rect, envElements[i].color);
  }

  RL.DrawRectangleRec(
    new RL.Rectangle(player.position.x - 20, player.position.y - 40, 40, 40),
    RL.Red,
  );

  RL.EndMode2D();

  RL.DrawRectangle(10, 10, 290, 145, RL.Fade(RL.SkyBlue, 0.5));
  RL.DrawRectangleLines(10, 10, 290, 145, RL.Fade(RL.Blue, 0.8));

  RL.DrawText("Controls:", 20, 20, 10, RL.Black);
  RL.DrawText("- RIGHT | LEFT: Player movement", 30, 40, 10, RL.DarkGray);
  RL.DrawText("- SPACE: Player jump", 30, 60, 10, RL.DarkGray);
  RL.DrawText("- R: Reset game state", 30, 80, 10, RL.DarkGray);

  RL.DrawText("- S: START/STOP RECORDING INPUT EVENTS", 30, 110, 10, RL.Black);
  RL.DrawText("- A: REPLAY LAST RECORDED INPUT EVENTS", 30, 130, 10, RL.Black);

  if (eventRecording) {
    RL.DrawRectangle(10, 160, 290, 30, RL.Fade(RL.Red, 0.3));
    RL.DrawRectangleLines(10, 160, 290, 30, RL.Fade(RL.Maroon, 0.8));
    RL.DrawCircle(30, 175, 10, RL.Maroon);

    if (Math.trunc(frameCounter / 15) % 2 === 1) {
      RL.DrawText(
        `RECORDING EVENTS... [${aelist.count}]`,
        50,
        170,
        10,
        RL.Maroon,
      );
    }
  } else if (eventPlaying) {
    RL.DrawRectangle(10, 160, 290, 30, RL.Fade(RL.Lime, 0.3));
    RL.DrawRectangleLines(10, 160, 290, 30, RL.Fade(RL.DarkGreen, 0.8));
    RL.DrawTriangle(vec2(20, 165), vec2(20, 185), vec2(40, 175), RL.DarkGreen);

    if (Math.trunc(frameCounter / 15) % 2 === 1) {
      RL.DrawText(
        `PLAYING RECORDED EVENTS... [${currentPlayFrame}]`,
        50,
        170,
        10,
        RL.DarkGreen,
      );
    }
  }

  RL.EndDrawing();
  //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
RL.CloseWindow();
//--------------------------------------------------------------------------------------
