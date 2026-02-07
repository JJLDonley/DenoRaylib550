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

const GLSL_VERSION = 330;

const screenWidth = 800;
const screenHeight = 450;

RL.InitWindow(screenWidth, screenHeight, "raylib [models] example - GPU skinning");

const camera = new RL.Camera3D({
  position: vec3(5.0, 5.0, 5.0),
  target: vec3(0.0, 2.0, 0.0),
  up: vec3(0.0, 1.0, 0.0),
  fovy: 45.0,
  projection: RL.CameraProjection.PERSPECTIVE,
});

const characterModel = RL.LoadModel(resource("models/gltf/greenman.glb"));

const skinningShader = RL.LoadShader(
  resource(`shaders/glsl${GLSL_VERSION}/skinning.vs`),
  resource(`shaders/glsl${GLSL_VERSION}/skinning.fs`),
);

const characterMesh = getMesh(characterModel, 0);
const characterMaterial = getMaterial(characterModel, 1);
characterMaterial.shader = skinningShader;

const { animations, count } = RL.LoadModelAnimations(resource("models/gltf/greenman.glb"));
let animIndex = 0;
let animCurrentFrame = 0;

const position = vec3(0.0, 0.0, 0.0);

RL.DisableCursor();
RL.SetTargetFPS(60);

while (!RL.WindowShouldClose()) {
  RL.UpdateCamera(camera, RL.CameraMode.THIRD_PERSON);

  if (RL.IsKeyPressed(RL.KeyboardKey.T)) animIndex = (animIndex + 1) % count;
  else if (RL.IsKeyPressed(RL.KeyboardKey.G)) animIndex = (animIndex + count - 1) % count;

  const anim = animations[animIndex];
  animCurrentFrame = (animCurrentFrame + 1) % anim.frameCount;
  characterModel.transform = matrixTranslate(position.x, position.y, position.z);
  RL.UpdateModelAnimationBones(characterModel, anim, animCurrentFrame);

  RL.BeginDrawing();
  RL.ClearBackground(RL.RayWhite);

  RL.BeginMode3D(camera);
  RL.DrawMesh(characterMesh, characterMaterial, characterModel.transform);
  RL.DrawGrid(10, 1.0);
  RL.EndMode3D();

  RL.DrawText("Use the T/G to switch animation", 10, 10, 20, RL.Gray);

  RL.EndDrawing();
}

RL.UnloadModelAnimations(animations, count);
RL.UnloadModel(characterModel);
RL.UnloadShader(skinningShader);
RL.CloseWindow();
