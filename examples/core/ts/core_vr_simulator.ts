import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};


const screenWidth = 800;
const screenHeight = 450;

const GLSL_VERSION = 330;

RL.InitWindow(screenWidth, screenHeight, "raylib [core] example - vr simulator");

const device = new RL.VrDeviceInfo(new Uint8Array(new ArrayBuffer(RL.VrDeviceInfo.SIZE)) as Uint8Array<ArrayBuffer>);
device.hResolution = 2160;
device.vResolution = 1200;
device.hScreenSize = 0.133793;
device.vScreenSize = 0.0669;
device.eyeToScreenDistance = 0.041;
device.lensSeparationDistance = 0.07;
device.interpupillaryDistance = 0.07;

device.lensDistortionValues = [1.0, 0.22, 0.24, 0.0];
device.chromaAbCorrection = [0.996, -0.004, 1.014, 0.0];

const config = RL.LoadVrStereoConfig(device);

const distortion = RL.LoadShader("", `../resources/distortion${GLSL_VERSION}.fs`);

const setVec2 = (loc: number, x: number, y: number) => {
  const f = new Float32Array([x, y]);
  RL.SetShaderValue(distortion, loc, new Uint8Array(f.buffer), RL.ShaderUniformDataType.VEC2);
};

const setVec4 = (loc: number, values: Float32Array) => {
  RL.SetShaderValue(distortion, loc, new Uint8Array(values.buffer, values.byteOffset, values.byteLength), RL.ShaderUniformDataType.VEC4);
};

setVec2(RL.GetShaderLocation(distortion, "leftLensCenter"), config.leftLensCenter[0], config.leftLensCenter[1]);
setVec2(RL.GetShaderLocation(distortion, "rightLensCenter"), config.rightLensCenter[0], config.rightLensCenter[1]);
setVec2(RL.GetShaderLocation(distortion, "leftScreenCenter"), config.leftScreenCenter[0], config.leftScreenCenter[1]);
setVec2(RL.GetShaderLocation(distortion, "rightScreenCenter"), config.rightScreenCenter[0], config.rightScreenCenter[1]);
setVec2(RL.GetShaderLocation(distortion, "scale"), config.scale[0], config.scale[1]);
setVec2(RL.GetShaderLocation(distortion, "scaleIn"), config.scaleIn[0], config.scaleIn[1]);

setVec4(RL.GetShaderLocation(distortion, "deviceWarpParam"), device.lensDistortionValues);
setVec4(RL.GetShaderLocation(distortion, "chromaAbParam"), device.chromaAbCorrection);

const target = RL.LoadRenderTexture(device.hResolution, device.vResolution);

const sourceRec = new RL.Rectangle(0.0, 0.0, target.texture.width, -target.texture.height);
const destRec = new RL.Rectangle(0.0, 0.0, RL.GetScreenWidth(), RL.GetScreenHeight());

const camera = new RL.Camera3D({
  position: new RL.Vector3(5.0, 2.0, 5.0),
  target: new RL.Vector3(0.0, 2.0, 0.0),
  up: new RL.Vector3(0.0, 1.0, 0.0),
  fovy: 60.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const cubePosition = new RL.Vector3(0.0, 0.0, 0.0);

RL.DisableCursor();
RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.UpdateCamera(camera, RL.CameraMode.FIRST_PERSON);

  RL.BeginTextureMode(target);
  RL.ClearBackground(RL.RayWhite);
  RL.BeginVrStereoMode(config);
  RL.BeginMode3D(camera);

  RL.DrawCube(cubePosition, 2.0, 2.0, 2.0, RL.Red);
  RL.DrawCubeWires(cubePosition, 2.0, 2.0, 2.0, RL.Maroon);
  RL.DrawGrid(40, 1.0);

  RL.EndMode3D();
  RL.EndVrStereoMode();
  RL.EndTextureMode();

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);
  RL.BeginShaderMode(distortion);
  RL.DrawTexturePro(target.texture, sourceRec, destRec, new RL.Vector2(0.0, 0.0), 0.0, RL.White);
  RL.EndShaderMode();
  RL.DrawFPS(10, 10);
  RL.EndDrawing();
}

RL.UnloadVrStereoConfig(config);
RL.UnloadRenderTexture(target);
RL.UnloadShader(distortion);
RL.CloseWindow();