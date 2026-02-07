import * as RL from "raylib";

const resource = (p: string) => {
  const url = new URL(`../resources/${p}`, import.meta.url);
  return decodeURIComponent(url.pathname);
};

const vec3 = (x: number, y: number, z: number): RL.Vector3 => new RL.Vector3(x, y, z);

const identityMatrix = (): RL.Matrix =>
  new RL.Matrix({ m0: 1, m5: 1, m10: 1, m15: 1 });

const screenWidth = 800;
const screenHeight = 450;

const GLSL_VERSION = 330;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - skybox loading and drawing");

const camera = new RL.Camera3D({
  position: vec3(1.0, 1.0, 1.0),
  target: vec3(4.0, 1.0, 4.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const cube = RL.GenMeshCube(1.0, 1.0, 1.0);
const useHDR = false;

const skyboxShader = RL.LoadShader(
  resource(`shaders/glsl${GLSL_VERSION}/skybox.vs`),
  resource(`shaders/glsl${GLSL_VERSION}/skybox.fs`),
);

const skyboxMat = RL.LoadMaterialDefault();
skyboxMat.shader = skyboxShader;

const envLoc = RL.GetShaderLocation(skyboxShader, "environmentMap");
const doGammaLoc = RL.GetShaderLocation(skyboxShader, "doGamma");
const vflippedLoc = RL.GetShaderLocation(skyboxShader, "vflipped");

// Bind sampler to texture slot 0
RL.SetShaderValue(
  skyboxShader,
  envLoc,
  new Uint8Array(new Int32Array([RL.MaterialMapIndex.CUBEMAP]).buffer),
  RL.ShaderUniformDataType.INT,
);
RL.SetShaderValue(
  skyboxShader,
  doGammaLoc,
  new Uint8Array(new Int32Array([useHDR ? 1 : 0]).buffer),
  RL.ShaderUniformDataType.INT,
);
RL.SetShaderValue(
  skyboxShader,
  vflippedLoc,
  new Uint8Array(new Int32Array([useHDR ? 1 : 0]).buffer),
  RL.ShaderUniformDataType.INT,
);

let skyboxFileName = "resources/skybox.png";
let cubemap: RL.Texture | null = null;

if (useHDR) {
  // HDR is not supported in this TS version without rlgl cubemap generation.
} else {
  const img = RL.LoadImage(resource("skybox.png"));
  cubemap = RL.LoadTextureCubemap(img, RL.CubemapLayout.AUTO_DETECT);
  RL.UnloadImage(img);
  RL.SetMaterialTexture(skyboxMat, RL.MaterialMapIndex.CUBEMAP, cubemap);
}

RL.DisableCursor();
RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.UpdateCamera(camera, RL.CameraMode.FIRST_PERSON);

  if (RL.isFileDropped()) {
    const droppedFiles = RL.LoadDroppedFiles();
    if (droppedFiles.length === 1) {
      const path = droppedFiles[0];
      if (/(\.png|\.jpg|\.hdr|\.bmp|\.tga)$/i.test(path)) {
        if (cubemap) RL.UnloadTexture(cubemap);

        if (useHDR) {
          // HDR path disabled
        } else {
          const img = RL.LoadImage(path);
          cubemap = RL.LoadTextureCubemap(img, RL.CubemapLayout.AUTO_DETECT);
          RL.UnloadImage(img);
          RL.SetMaterialTexture(skyboxMat, RL.MaterialMapIndex.CUBEMAP, cubemap);
        }

        skyboxFileName = path;
      }
    }
  }

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);

  // Draw cubemap on an inside-out cube
  if (cubemap) {
    RL.DisableBackfaceCulling();
    RL.DisableDepthMask();
    RL.DrawMesh(cube, skyboxMat, identityMatrix());
    RL.EnableBackfaceCulling();
    RL.EnableDepthMask();
  }
  RL.DrawGrid(10, 1.0);

  RL.EndMode3D();

  const fileBase = skyboxFileName.split(/[\\/]/).pop() ?? skyboxFileName;
  RL.DrawText(`Skybox: ${fileBase}`, 10, RL.GetScreenHeight() - 20, 10, RL.Black);
  RL.DrawFPS(10, 10);

  RL.EndDrawing();
}

RL.UnloadShader(skyboxShader);
if (cubemap) RL.UnloadTexture(cubemap);
RL.UnloadMesh(cube);
RL.CloseWindow();
