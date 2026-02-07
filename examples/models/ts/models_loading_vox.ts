import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const getMesh = (model: RL.Model, index: number): RL.Mesh => {
  const ptr = Deno.UnsafePointer.create(model.meshesPtr);
  if (!ptr) throw new Error("Model meshes pointer is null");
  const view = new Deno.UnsafePointerView(ptr);
  const offset = index * RL.Mesh.SIZE;
  const buf = view.getArrayBuffer(offset + RL.Mesh.SIZE);
  return new RL.Mesh(new Uint8Array(buf, offset, RL.Mesh.SIZE) as Uint8Array<ArrayBuffer>);
};

const getMaterial = (model: RL.Model, index: number): RL.Material => {
  const ptr = Deno.UnsafePointer.create(model.materialsPtr);
  if (!ptr) throw new Error("Model materials pointer is null");
  const view = new Deno.UnsafePointerView(ptr);
  const offset = index * RL.Material.SIZE;
  const buf = view.getArrayBuffer(offset + RL.Material.SIZE);
  return new RL.Material(new Uint8Array(buf, offset, RL.Material.SIZE) as Uint8Array<ArrayBuffer>);
};

const matrixTranslate = (x: number, y: number, z: number): RL.Matrix =>
  new RL.Matrix({
    m0: 1,
    m4: 0,
    m8: 0,
    m12: x,
    m1: 0,
    m5: 1,
    m9: 0,
    m13: y,
    m2: 0,
    m6: 0,
    m10: 1,
    m14: z,
    m3: 0,
    m7: 0,
    m11: 0,
    m15: 1,
  });

const MAX_LIGHTS = 4;
const LIGHT_DIRECTIONAL = 0;
const LIGHT_POINT = 1;

type Light = {
  type: number;
  enabled: boolean;
  position: RL.Vector3;
  target: RL.Vector3;
  color: RL.Color;
  enabledLoc: number;
  typeLoc: number;
  positionLoc: number;
  targetLoc: number;
  colorLoc: number;
};

let lightsCount = 0;

const setShaderValueInt = (shader: RL.Shader, loc: number, value: number) => {
  const data = new Int32Array([value]);
  RL.SetShaderValue(shader, loc, new Uint8Array(data.buffer), RL.ShaderUniformDataType.INT);
};

const setShaderValueVec3 = (shader: RL.Shader, loc: number, v: RL.Vector3) => {
  const data = new Float32Array([v.x, v.y, v.z]);
  RL.SetShaderValue(shader, loc, new Uint8Array(data.buffer), RL.ShaderUniformDataType.VEC3);
};

const setShaderValueVec4 = (shader: RL.Shader, loc: number, r: number, g: number, b: number, a: number) => {
  const data = new Float32Array([r, g, b, a]);
  RL.SetShaderValue(shader, loc, new Uint8Array(data.buffer), RL.ShaderUniformDataType.VEC4);
};

const createLight = (type: number, position: RL.Vector3, target: RL.Vector3, color: RL.Color, shader: RL.Shader): Light => {
  const light: Light = {
    type,
    enabled: true,
    position,
    target,
    color,
    enabledLoc: -1,
    typeLoc: -1,
    positionLoc: -1,
    targetLoc: -1,
    colorLoc: -1,
  };

  if (lightsCount < MAX_LIGHTS) {
    light.enabledLoc = RL.GetShaderLocation(shader, `lights[${lightsCount}].enabled`);
    light.typeLoc = RL.GetShaderLocation(shader, `lights[${lightsCount}].type`);
    light.positionLoc = RL.GetShaderLocation(shader, `lights[${lightsCount}].position`);
    light.targetLoc = RL.GetShaderLocation(shader, `lights[${lightsCount}].target`);
    light.colorLoc = RL.GetShaderLocation(shader, `lights[${lightsCount}].color`);

    updateLightValues(shader, light);
    lightsCount++;
  }

  return light;
};

const updateLightValues = (shader: RL.Shader, light: Light) => {
  setShaderValueInt(shader, light.enabledLoc, light.enabled ? 1 : 0);
  setShaderValueInt(shader, light.typeLoc, light.type);
  setShaderValueVec3(shader, light.positionLoc, light.position);
  setShaderValueVec3(shader, light.targetLoc, light.target);
  setShaderValueVec4(
    shader,
    light.colorLoc,
    light.color.r / 255,
    light.color.g / 255,
    light.color.b / 255,
    light.color.a / 255,
  );
};

const screenWidth = 800;
const screenHeight = 450;

const voxFileNames = [
  "models/vox/chr_knight.vox",
  "models/vox/chr_sword.vox",
  "models/vox/monu9.vox",
  "models/vox/fez.vox",
];

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - magicavoxel loading");

const camera = new RL.Camera3D({
  position: vec3(10.0, 10.0, 10.0),
  target: vec3(0.0, 0.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const models: RL.Model[] = [];

for (const file of voxFileNames) {
  const t0 = RL.GetTime() * 1000.0;
  const model = RL.LoadModel(resource(file));
  const t1 = RL.GetTime() * 1000.0;
  console.log(`[${file}] File loaded in ${(t1 - t0).toFixed(3)} ms`);

  const bb = RL.GetModelBoundingBox(model);
  const centerX = bb.min.x + (bb.max.x - bb.min.x) / 2;
  const centerZ = bb.min.z + (bb.max.z - bb.min.z) / 2;
  model.transform = matrixTranslate(-centerX, 0, -centerZ);
  models.push(model);
}

let currentModel = 0;

const GLSL_VERSION = 330;
const shader = RL.LoadShader(
  resource(`shaders/glsl${GLSL_VERSION}/voxel_lighting.vs`),
  resource(`shaders/glsl${GLSL_VERSION}/voxel_lighting.fs`),
);

const ambientLoc = RL.GetShaderLocation(shader, "ambient");
const viewPosLoc = RL.GetShaderLocation(shader, "viewPos");
setShaderValueVec4(shader, ambientLoc, 0.1, 0.1, 0.1, 1.0);

for (const model of models) {
  for (let i = 0; i < model.materialCount; i++) {
    const material = getMaterial(model, i);
    material.shader = shader;
  }
}

const lights: Light[] = [];
lights.push(createLight(LIGHT_POINT, vec3(-20, 20, -20), vec3(0, 0, 0), RL.Gray, shader));
lights.push(createLight(LIGHT_POINT, vec3(20, -20, 20), vec3(0, 0, 0), RL.Gray, shader));
lights.push(createLight(LIGHT_POINT, vec3(-20, 20, 20), vec3(0, 0, 0), RL.Gray, shader));
lights.push(createLight(LIGHT_POINT, vec3(20, -20, -20), vec3(0, 0, 0), RL.Gray, shader));

RL.SetTargetFPS(60);

const camerarot = vec3(0, 0, 0);

while (!RL.WindowShouldClose()) {
  if (RL.IsMouseButtonDown(RL.MouseButton.MIDDLE)) {
    const mouseDelta = RL.GetMouseDelta();
    camerarot.x = mouseDelta.x * 0.05;
    camerarot.y = mouseDelta.y * 0.05;
  } else {
    camerarot.x = 0;
    camerarot.y = 0;
  }

  const moveForward = (RL.IsKeyDown(RL.KeyboardKey.W) || RL.IsKeyDown(RL.KeyboardKey.UP)) ? 0.1 : 0.0;
  const moveBackward = (RL.IsKeyDown(RL.KeyboardKey.S) || RL.IsKeyDown(RL.KeyboardKey.DOWN)) ? 0.1 : 0.0;
  const moveRight = (RL.IsKeyDown(RL.KeyboardKey.D) || RL.IsKeyDown(RL.KeyboardKey.RIGHT)) ? 0.1 : 0.0;
  const moveLeft = (RL.IsKeyDown(RL.KeyboardKey.A) || RL.IsKeyDown(RL.KeyboardKey.LEFT)) ? 0.1 : 0.0;

  RL.UpdateCameraPro(
    camera,
    vec3(
      moveForward - moveBackward,
      moveRight - moveLeft,
      0.0,
    ),
    camerarot,
    RL.GetMouseWheelMove() * -2.0,
  );

  if (RL.IsMouseButtonPressed(RL.MouseButton.LEFT)) currentModel = (currentModel + 1) % models.length;

  setShaderValueVec3(shader, viewPosLoc, camera.position);

  for (const light of lights) updateLightValues(shader, light);

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  RL.DrawModel(models[currentModel], vec3(0, 0, 0), 1.0, RL.White);

  RL.DrawGrid(10, 1.0);

  for (const light of lights) {
    if (light.enabled) RL.DrawSphereEx(light.position, 0.2, 8, 8, light.color);
    else RL.DrawSphereWires(light.position, 0.2, 8, 8, RL.ColorAlpha(light.color, 0.3));
  }

  RL.EndMode3D();

  RL.DrawRectangle(10, 400, 340, 60, RL.Fade(RL.SkyBlue, 0.5));
  RL.DrawRectangleLines(10, 400, 340, 60, RL.Fade(RL.DarkBlue, 0.5));
  RL.DrawText("MOUSE LEFT BUTTON to CYCLE VOX MODELS", 40, 410, 10, RL.Blue);
  RL.DrawText("MOUSE MIDDLE BUTTON to ZOOM OR ROTATE CAMERA", 40, 420, 10, RL.Blue);
  RL.DrawText("UP-DOWN-LEFT-RIGHT KEYS to MOVE CAMERA", 40, 430, 10, RL.Blue);

  const name = voxFileNames[currentModel].split("/").pop() ?? "";
  RL.DrawText(`File: ${name}`, 10, 10, 20, RL.Gray);

  RL.EndDrawing();
}

for (const model of models) RL.UnloadModel(model);
RL.CloseWindow();
