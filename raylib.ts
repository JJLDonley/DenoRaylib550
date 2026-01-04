import { lib as DLL } from "./bindings/bindings.ts";

const lib = DLL.symbols;

type ViewFloatVec3 = {
  x: float;
  y: float;
  z: float;
};

type ViewFloatVec2 = {
  x: float;
  y: float;
};

type ViewIntVec4 = {
  x: int;
  y: int;
  z: int;
  w: int;
};

type ViewFloatRect = {
  x: float;
  y: float;
  width: float;
  height: float;
};

type ViewFloatQuat = {
  x: float;
  y: float;
  z: float;
  w: float;
};

export const RAYLIB_VERSION_MAJOR = 5;
export const RAYLIB_VERSION_MINOR = 5;
export const RAYLIB_VERSION_PATCH = 0;
export const RAYLIB_VERSION = "5.5";

/** Whether or not this computer is little or big endian */
export const littleEndian = (() => {
  // Stolen from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256;
})();

export function concatVector2(vectors: Vector2[]): Uint8Array<ArrayBuffer> {
  const buf = new ArrayBuffer(vectors.length * 8); // 2 floats per Vector2
  const view = new DataView(buf);

  for (let i = 0; i < vectors.length; i++) {
    view.setFloat32(i * 8 + 0, vectors[i].x, true);
    view.setFloat32(i * 8 + 4, vectors[i].y, true);
  }

  return new Uint8Array(buf);
}

export function concatVector3(vectors: Vector3[]): Float32Array {
  const vecs = new Float32Array(vectors.length * 3);
  for (let i = 0; i < vectors.length; i++) {
    vecs[i * 3] = vectors[i].x;
    vecs[i * 3 + 1] = vectors[i].y;
    vecs[i * 3 + 2] = vectors[i].z;
  }
  return vecs;
}

export function concatVector4(vectors: Vector4[]): Float32Array {
  const vecs = new Float32Array(vectors.length * 4);
  for (let i = 0; i < vectors.length; i++) {
    vecs[i * 4] = vectors[i].x;
    vecs[i * 4 + 1] = vectors[i].y;
    vecs[i * 4 + 2] = vectors[i].z;
    vecs[i * 4 + 3] = vectors[i].w;
  }
  return vecs;
}

export function concatRectangle(rectangles: Rectangle[]): Float32Array {
  const rects = new Float32Array(rectangles.length * 4);
  for (let i = 0; i < rectangles.length; i++) {
    rects[i * 4] = rectangles[i].x;
    rects[i * 4 + 1] = rectangles[i].y;
    rects[i * 4 + 2] = rectangles[i].width;
    rects[i * 4 + 3] = rectangles[i].height;
  }
  return rects;
}

export function concatColor(colors: Color[]): Uint8Array {
  const cols = new Uint8Array(colors.length * 4);
  for (let i = 0; i < colors.length; i++) {
    cols[i * 4] = colors[i].r;
    cols[i * 4 + 1] = colors[i].g;
    cols[i * 4 + 2] = colors[i].b;
    cols[i * 4 + 3] = colors[i].a;
  }
  return cols;
}

// enums

export enum ConfigFlags {
  VSYNC_HINT = 0x00000040, // Set to try enabling V-Sync on GPU
  FULLSCREEN_MODE = 0x00000002, // Set to run program in fullscreen
  WINDOW_RESIZABLE = 0x00000004, // Set to allow resizable window
  WINDOW_UNDECORATED = 0x00000008, // Set to disable window decoration (frame and buttons)
  WINDOW_HIDDEN = 0x00000080, // Set to hide window
  WINDOW_MINIMIZED = 0x00000200, // Set to minimize window (iconify)
  WINDOW_MAXIMIZED = 0x00000400, // Set to maximize window (expanded to monitor)
  WINDOW_UNFOCUSED = 0x00000800, // Set to window non focused
  WINDOW_TOPMOST = 0x00001000, // Set to window always on top
  WINDOW_ALWAYS_RUN = 0x00000100, // Set to allow windows running while minimized
  WINDOW_TRANSPARENT = 0x00000010, // Set to allow transparent framebuffer
  WINDOW_HIGHDPI = 0x00002000, // Set to support HighDPI
  WINDOW_MOUSE_PASSTHROUGH = 0x00004000, // Set to support mouse passthrough, only supported when WINDOW_UNDECORATED
  BORDERLESS_WINDOWED_MODE = 0x00008000, // Set to run program in borderless windowed mode
  MSAA_4X_HINT = 0x00000020, // Set to try enabling MSAA 4X
  INTERLACED_HINT = 0x00010000, // Set to try enabling interlaced video format (for V3D)
}

export enum TraceLogLevel {
  ALL = 0, // Display all logs
  TRACE, // Trace logging, intended for internal use only
  DEBUG, // Debug logging, used for internal debugging, it should be disabled on release builds
  INFO, // Info logging, used for program execution info
  WARNING, // Warning logging, used on recoverable failures
  ERROR, // Error logging, used on unrecoverable failures
  FATAL, // Fatal logging, used to abort program: exit(EXIT_FAILURE)
  NONE, // Disable logging
}

export enum KeyboardKey {
  NULL = 0, // Key: NULL, used for no key pressed
  // Alphanumeric keys
  APOSTROPHE = 39, // Key: '
  COMMA = 44, // Key: ,
  MINUS = 45, // Key: -
  PERIOD = 46, // Key: .
  SLASH = 47, // Key: /
  ZERO = 48, // Key: 0
  ONE = 49, // Key: 1
  TWO = 50, // Key: 2
  THREE = 51, // Key: 3
  FOUR = 52, // Key: 4
  FIVE = 53, // Key: 5
  SIX = 54, // Key: 6
  SEVEN = 55, // Key: 7
  EIGHT = 56, // Key: 8
  NINE = 57, // Key: 9
  SEMICOLON = 59, // Key: ;
  EQUAL = 61, // Key: =
  A = 65, // Key: A | a
  B = 66, // Key: B | b
  C = 67, // Key: C | c
  D = 68, // Key: D | d
  E = 69, // Key: E | e
  F = 70, // Key: F | f
  G = 71, // Key: G | g
  H = 72, // Key: H | h
  I = 73, // Key: I | i
  J = 74, // Key: J | j
  K = 75, // Key: K | k
  L = 76, // Key: L | l
  M = 77, // Key: M | m
  N = 78, // Key: N | n
  O = 79, // Key: O | o
  P = 80, // Key: P | p
  Q = 81, // Key: Q | q
  R = 82, // Key: R | r
  S = 83, // Key: S | s
  T = 84, // Key: T | t
  U = 85, // Key: U | u
  V = 86, // Key: V | v
  W = 87, // Key: W | w
  X = 88, // Key: X | x
  Y = 89, // Key: Y | y
  Z = 90, // Key: Z | z
  LEFT_BRACKET = 91, // Key: [
  BACKSLASH = 92, // Key: '\'
  RIGHT_BRACKET = 93, // Key: ]
  GRAVE = 96, // Key: `
  // Function keys
  SPACE = 32, // Key: Space
  ESCAPE = 256, // Key: Esc
  ENTER = 257, // Key: Enter
  TAB = 258, // Key: Tab
  BACKSPACE = 259, // Key: Backspace
  INSERT = 260, // Key: Ins
  DELETE = 261, // Key: Del
  RIGHT = 262, // Key: Cursor right
  LEFT = 263, // Key: Cursor left
  DOWN = 264, // Key: Cursor down
  UP = 265, // Key: Cursor up
  PAGE_UP = 266, // Key: Page up
  PAGE_DOWN = 267, // Key: Page down
  HOME = 268, // Key: Home
  END = 269, // Key: End
  CAPS_LOCK = 280, // Key: Caps lock
  SCROLL_LOCK = 281, // Key: Scroll down
  NUM_LOCK = 282, // Key: Num lock
  PRINT_SCREEN = 283, // Key: Print screen
  PAUSE = 284, // Key: Pause
  F1 = 290, // Key: F1
  F2 = 291, // Key: F2
  F3 = 292, // Key: F3
  F4 = 293, // Key: F4
  F5 = 294, // Key: F5
  F6 = 295, // Key: F6
  F7 = 296, // Key: F7
  F8 = 297, // Key: F8
  F9 = 298, // Key: F9
  F10 = 299, // Key: F10
  F11 = 300, // Key: F11
  F12 = 301, // Key: F12
  LEFT_SHIFT = 340, // Key: Shift left
  LEFT_CONTROL = 341, // Key: Control left
  LEFT_ALT = 342, // Key: Alt left
  LEFT_SUPER = 343, // Key: Super left
  RIGHT_SHIFT = 344, // Key: Shift right
  RIGHT_CONTROL = 345, // Key: Control right
  RIGHT_ALT = 346, // Key: Alt right
  RIGHT_SUPER = 347, // Key: Super right
  KB_MENU = 348, // Key: KB menu
  // Keypad keys
  KP_0 = 320, // Key: Keypad 0
  KP_1 = 321, // Key: Keypad 1
  KP_2 = 322, // Key: Keypad 2
  KP_3 = 323, // Key: Keypad 3
  KP_4 = 324, // Key: Keypad 4
  KP_5 = 325, // Key: Keypad 5
  KP_6 = 326, // Key: Keypad 6
  KP_7 = 327, // Key: Keypad 7
  KP_8 = 328, // Key: Keypad 8
  KP_9 = 329, // Key: Keypad 9
  KP_DECIMAL = 330, // Key: Keypad .
  KP_DIVIDE = 331, // Key: Keypad /
  KP_MULTIPLY = 332, // Key: Keypad *
  KP_SUBTRACT = 333, // Key: Keypad -
  KP_ADD = 334, // Key: Keypad +
  KP_ENTER = 335, // Key: Keypad Enter
  KP_EQUAL = 336, // Key: Keypad =
  // Android key buttons
  BACK = 4, // Key: Android back button
  MENU = 5, // Key: Android menu button
  VOLUME_UP = 24, // Key: Android volume up button
  VOLUME_DOWN = 25, // Key: Android volume down button
}

export enum MouseButton {
  LEFT = 0, // Mouse button left
  RIGHT = 1, // Mouse button right
  MIDDLE = 2, // Mouse button middle (pressed wheel)
  SIDE = 3, // Mouse button side (advanced mouse device)
  EXTRA = 4, // Mouse button extra (advanced mouse device)
  FORWARD = 5, // Mouse button forward (advanced mouse device)
  BACK = 6, // Mouse button back (advanced mouse device)
}

export enum MouseCursor {
  DEFAULT = 0, // Default pointer shape
  ARROW = 1, // Arrow shape
  IBEAM = 2, // Text writing cursor shape
  CROSSHAIR = 3, // Cross shape
  POINTING_HAND = 4, // Pointing hand cursor
  RESIZE_EW = 5, // Horizontal resize/move arrow shape
  RESIZE_NS = 6, // Vertical resize/move arrow shape
  RESIZE_NWSE = 7, // Top-left to bottom-right diagonal resize/move arrow shape
  RESIZE_NESW = 8, // The top-right to bottom-left diagonal resize/move arrow shape
  RESIZE_ALL = 9, // The omnidirectional resize/move cursor shape
  NOT_ALLOWED = 10, // The operation-not-allowed shape
}

export enum GamepadButton {
  UNKNOWN = 0, // Unknown button, just for error checking
  LEFT_FACE_UP, // Gamepad left DPAD up button
  LEFT_FACE_RIGHT, // Gamepad left DPAD right button
  LEFT_FACE_DOWN, // Gamepad left DPAD down button
  LEFT_FACE_LEFT, // Gamepad left DPAD left button
  RIGHT_FACE_UP, // Gamepad right button up (i.e. PS3: Triangle, Xbox: Y)
  RIGHT_FACE_RIGHT, // Gamepad right button right (i.e. PS3: Circle, Xbox: B)
  RIGHT_FACE_DOWN, // Gamepad right button down (i.e. PS3: Cross, Xbox: A)
  RIGHT_FACE_LEFT, // Gamepad right button left (i.e. PS3: Square, Xbox: X)
  LEFT_TRIGGER_1, // Gamepad top/back trigger left (first), it could be a trailing button
  LEFT_TRIGGER_2, // Gamepad top/back trigger left (second), it could be a trailing button
  RIGHT_TRIGGER_1, // Gamepad top/back trigger right (first), it could be a trailing button
  RIGHT_TRIGGER_2, // Gamepad top/back trigger right (second), it could be a trailing button
  MIDDLE_LEFT, // Gamepad center buttons, left one (i.e. PS3: Select)
  MIDDLE, // Gamepad center buttons, middle one (i.e. PS3: PS, Xbox: XBOX)
  MIDDLE_RIGHT, // Gamepad center buttons, right one (i.e. PS3: Start)
  LEFT_THUMB, // Gamepad joystick pressed button left
  RIGHT_THUMB, // Gamepad joystick pressed button right
}

export enum GamepadAxis {
  LEFT_X = 0, // Gamepad left stick X axis
  LEFT_Y = 1, // Gamepad left stick Y axis
  RIGHT_X = 2, // Gamepad right stick X axis
  RIGHT_Y = 3, // Gamepad right stick Y axis
  LEFT_TRIGGER = 4, // Gamepad back trigger left, pressure level: [1..-1]
  RIGHT_TRIGGER = 5, // Gamepad back trigger right, pressure level: [1..-1]
}

export enum MaterialMapIndex {
  ALBEDO = 0, // Albedo material (same as:  DIFFUSE)
  METALNESS, // Metalness material (same as:   SPECULAR)
  NORMAL, // Normal material
  ROUGHNESS, // Roughness material
  OCCLUSION, // Ambient occlusion material
  EMISSION, // Emission material
  HEIGHT, // Heightmap material
  CUBEMAP, // Cubemap material (NOTE: Uses GL_TEXTURE_CUBE_MAP)
  IRRADIANCE, // Irradiance material (NOTE: Uses GL_TEXTURE_CUBE_MAP)
  PREFILTER, // Prefilter material (NOTE: Uses GL_TEXTURE_CUBE_MAP)
  BRDF, // Brdf material
}

export enum ShaderLocationIndex {
  VERTEX_POSITION = 0, // Shader location: vertex attribute: position
  VERTEX_TEXCOORD01, // Shader location: vertex attribute: texcoord01
  VERTEX_TEXCOORD02, // Shader location: vertex attribute: texcoord02
  VERTEX_NORMAL, // Shader location: vertex attribute: normal
  VERTEX_TANGENT, // Shader location: vertex attribute: tangent
  VERTEX_COLOR, // Shader location: vertex attribute: color
  MATRIX_MVP, // Shader location: matrix uniform: model-view-projection
  MATRIX_VIEW, // Shader location: matrix uniform: view (camera transform)
  MATRIX_PROJECTION, // Shader location: matrix uniform: projection
  MATRIX_MODEL, // Shader location: matrix uniform: model (transform)
  MATRIX_NORMAL, // Shader location: matrix uniform: normal
  VECTOR_VIEW, // Shader location: vector uniform: view
  COLOR_DIFFUSE, // Shader location: vector uniform: diffuse color
  COLOR_SPECULAR, // Shader location: vector uniform: specular color
  COLOR_AMBIENT, // Shader location: vector uniform: ambient color
  MAP_ALBEDO, // Shader location: sampler2d texture: albedo (same as: MAP_DIFFUSE)
  MAP_METALNESS, // Shader location: sampler2d texture: metalness (same as: MAP_SPECULAR)
  MAP_NORMAL, // Shader location: sampler2d texture: normal
  MAP_ROUGHNESS, // Shader location: sampler2d texture: roughness
  MAP_OCCLUSION, // Shader location: sampler2d texture: occlusion
  MAP_EMISSION, // Shader location: sampler2d texture: emission
  MAP_HEIGHT, // Shader location: sampler2d texture: height
  MAP_CUBEMAP, // Shader location: samplerCube texture: cubemap
  MAP_IRRADIANCE, // Shader location: samplerCube texture: irradiance
  MAP_PREFILTER, // Shader location: samplerCube texture: prefilter
  MAP_BRDF, // Shader location: sampler2d texture: brdf
  VERTEX_BONEIDS, // Shader location: vertex attribute: boneIds
  VERTEX_BONEWEIGHTS, // Shader location: vertex attribute: boneWeights
  BONE_MATRICES, // Shader location: array of matrices uniform: boneMatrices
}

export enum ShaderUniformDataType {
  FLOAT = 0, // Shader uniform type: float
  VEC2, // Shader uniform type: vec2 (2 float)
  VEC3, // Shader uniform type: vec3 (3 float)
  VEC4, // Shader uniform type: vec4 (4 float)
  INT, // Shader uniform type: int
  IVEC2, // Shader uniform type: ivec2 (2 int)
  IVEC3, // Shader uniform type: ivec3 (3 int)
  IVEC4, // Shader uniform type: ivec4 (4 int)
  SAMPLER2D, // Shader uniform type: sampler2d
}

export enum ShaderAttributeDataType {
  FLOAT = 0, // Shader attribute type: float
  VEC2, // Shader attribute type: vec2 (2 float)
  VEC3, // Shader attribute type: vec3 (3 float)
  VEC4, // Shader attribute type: vec4 (4 float)
}

export enum PixelFormat {
  UNCOMPRESSED_GRAYSCALE = 1, // 8 bit per pixel (no alpha)
  UNCOMPRESSED_GRAY_ALPHA, // 8*2 bpp (2 channels)
  UNCOMPRESSED_R5G6B5, // 16 bpp
  UNCOMPRESSED_R8G8B8, // 24 bpp
  UNCOMPRESSED_R5G5B5A1, // 16 bpp (1 bit alpha)
  UNCOMPRESSED_R4G4B4A4, // 16 bpp (4 bit alpha)
  UNCOMPRESSED_R8G8B8A8, // 32 bpp
  UNCOMPRESSED_R32, // 32 bpp (1 channel - float)
  UNCOMPRESSED_R32G32B32, // 32*3 bpp (3 channels - float)
  UNCOMPRESSED_R32G32B32A32, // 32*4 bpp (4 channels - float)
  UNCOMPRESSED_R16, // 16 bpp (1 channel - half float)
  UNCOMPRESSED_R16G16B16, // 16*3 bpp (3 channels - half float)
  UNCOMPRESSED_R16G16B16A16, // 16*4 bpp (4 channels - half float)
  COMPRESSED_DXT1_RGB, // 4 bpp (no alpha)
  COMPRESSED_DXT1_RGBA, // 4 bpp (1 bit alpha)
  COMPRESSED_DXT3_RGBA, // 8 bpp
  COMPRESSED_DXT5_RGBA, // 8 bpp
  COMPRESSED_ETC1_RGB, // 4 bpp
  COMPRESSED_ETC2_RGB, // 4 bpp
  COMPRESSED_ETC2_EAC_RGBA, // 8 bpp
  COMPRESSED_PVRT_RGB, // 4 bpp
  COMPRESSED_PVRT_RGBA, // 4 bpp
  COMPRESSED_ASTC_4x4_RGBA, // 8 bpp
  COMPRESSED_ASTC_8x8_RGBA, // 2 bpp
}

export enum TextureFilter {
  POINT = 0, // No filter, just pixel approximation
  BILINEAR, // Linear filtering
  TRILINEAR, // Trilinear filtering (linear with mipmaps)
  ANISOTROPIC_4X, // Anisotropic filtering 4x
  ANISOTROPIC_8X, // Anisotropic filtering 8x
  ANISOTROPIC_16X, // Anisotropic filtering 16x
}

export enum TextureWrap {
  REPEAT = 0, // Repeats texture in tiled mode
  CLAMP, // Clamps texture to edge pixel in tiled mode
  MIRROR_REPEAT, // Mirrors and repeats the texture in tiled mode
  MIRROR_CLAMP, // Mirrors and clamps to border the texture in tiled mode
}

export enum CubemapLayout {
  AUTO_DETECT = 0, // Automatically detect layout type
  LINE_VERTICAL, // Layout is defined by a vertical line with faces
  LINE_HORIZONTAL, // Layout is defined by a horizontal line with faces
  CROSS_THREE_BY_FOUR, // Layout is defined by a 3x4 cross with cubemap faces
  CROSS_FOUR_BY_THREE, // Layout is defined by a 4x3 cross with cubemap faces
}

export enum FontType {
  DEFAULT = 0, // Default font generation, anti-aliased
  BITMAP, // Bitmap font generation, no anti-aliasing
  SDF, // SDF font generation, requires external shader
}

export enum BlendMode {
  ALPHA = 0, // Blend textures considering alpha (default)
  ADDITIVE, // Blend textures adding colors
  MULTIPLIED, // Blend textures multiplying colors
  ADD_COLORS, // Blend textures adding colors (alternative)
  SUBTRACT_COLORS, // Blend textures subtracting colors (alternative)
  ALPHA_PREMULTIPLY, // Blend premultiplied textures considering alpha
  CUSTOM, // Blend textures using custom src/dst factors (use rlSetBlendFactors())
  CUSTOM_SEPARATE, // Blend textures using custom rgb/alpha separate src/dst factors (use rlSetBlendFactorsSeparate())
}

export enum Gesture {
  NONE = 0, // No gesture
  TAP = 1, // Tap gesture
  DOUBLETAP = 2, // Double tap gesture
  HOLD = 4, // Hold gesture
  DRAG = 8, // Drag gesture
  SWIPE_RIGHT = 16, // Swipe right gesture
  SWIPE_LEFT = 32, // Swipe left gesture
  SWIPE_UP = 64, // Swipe up gesture
  SWIPE_DOWN = 128, // Swipe down gesture
  PINCH_IN = 256, // Pinch in gesture
  PINCH_OUT = 512, // Pinch out gesture
}

export enum CameraMode {
  CUSTOM = 0, // Camera custom, controlled by user (UpdateCamera() does nothing)
  FREE, // Camera free mode
  ORBITAL, // Camera orbital, around target, zoom supported
  FIRST_PERSON, // Camera first person
  THIRD_PERSON, // Camera third person
}

export enum CameraProjection {
  PERSPECTIVE = 0, // Perspective projection
  ORTHOGRAPHIC, // Orthographic projection
}

export enum NPatchLayout {
  NINE_PATCH = 0, // Npatch layout: 3x3 tiles
  THREE_PATCH_VERTICAL, // Npatch layout: 1x3 tiles
  THREE_PATCH_HORIZONTAL, // Npatch layout: 3x1 tiles
}

// struct types

export class Vector2 extends Float32Array {
  constructor(x: number, y: number) {
    super([x, y]);
  }

  get x() {
    return this[0];
  }

  set x(value: number) {
    this[0] = value;
  }

  get y() {
    return this[1];
  }

  set y(value: number) {
    this[1] = value;
  }
}

export class Vector3 extends Float32Array {
  constructor(x: number, y: number, z: number) {
    super([x, y, z]);
  }

  get x() {
    return this[0];
  }

  set x(value: number) {
    this[0] = value;
  }

  get y() {
    return this[1];
  }

  set y(value: number) {
    this[1] = value;
  }

  get z() {
    return this[2];
  }

  set z(value: number) {
    this[2] = value;
  }
}

export class Vector4 extends Float32Array {
  constructor(x: number, y: number, z: number, w: number) {
    super([x, y, z, w]);
  }

  get x() {
    return this[0];
  }

  set x(value: number) {
    this[0] = value;
  }

  get y() {
    return this[1];
  }

  set y(value: number) {
    this[1] = value;
  }

  get z() {
    return this[2];
  }

  set z(value: number) {
    this[2] = value;
  }

  get w() {
    return this[3];
  }

  set w(value: number) {
    this[3] = value;
  }
}

export class Quaternion extends Vector4 {}

export class Matrix extends Float32Array {
  constructor(
    m0 = 1,
    m4 = 0,
    m8 = 0,
    m12 = 0,
    m1 = 0,
    m5 = 1,
    m9 = 0,
    m13 = 0,
    m2 = 0,
    m6 = 0,
    m10 = 1,
    m14 = 0,
    m3 = 0,
    m7 = 0,
    m11 = 0,
    m15 = 1,
  ) {
    super([
      m0,
      m1,
      m2,
      m3,
      m4,
      m5,
      m6,
      m7,
      m8,
      m9,
      m10,
      m11,
      m12,
      m13,
      m14,
      m15,
    ]);
  }

  static fromBuffer(buffer: ArrayBufferLike, byteOffset = 0): Matrix {
    const view = new Float32Array(buffer, byteOffset, 16) as Matrix;
    Object.setPrototypeOf(view, Matrix.prototype);
    return view;
  }

  // first row
  get m0() {
    return this[0];
  }
  set m0(v: number) {
    this[0] = v;
  }
  get m4() {
    return this[4];
  }
  set m4(v: number) {
    this[4] = v;
  }
  get m8() {
    return this[8];
  }
  set m8(v: number) {
    this[8] = v;
  }
  get m12() {
    return this[12];
  }
  set m12(v: number) {
    this[12] = v;
  }

  // second row
  get m1() {
    return this[1];
  }
  set m1(v: number) {
    this[1] = v;
  }
  get m5() {
    return this[5];
  }
  set m5(v: number) {
    this[5] = v;
  }
  get m9() {
    return this[9];
  }
  set m9(v: number) {
    this[9] = v;
  }
  get m13() {
    return this[13];
  }
  set m13(v: number) {
    this[13] = v;
  }

  // third row
  get m2() {
    return this[2];
  }
  set m2(v: number) {
    this[2] = v;
  }
  get m6() {
    return this[6];
  }
  set m6(v: number) {
    this[6] = v;
  }
  get m10() {
    return this[10];
  }
  set m10(v: number) {
    this[10] = v;
  }
  get m14() {
    return this[14];
  }
  set m14(v: number) {
    this[14] = v;
  }

  // fourth row
  get m3() {
    return this[3];
  }
  set m3(v: number) {
    this[3] = v;
  }
  get m7() {
    return this[7];
  }
  set m7(v: number) {
    this[7] = v;
  }
  get m11() {
    return this[11];
  }
  set m11(v: number) {
    this[11] = v;
  }
  get m15() {
    return this[15];
  }
  set m15(v: number) {
    this[15] = v;
  }
}

export class Color extends Uint8Array {
  constructor(r: number, g: number, b: number, a: number) {
    super([r, g, b, a]);
  }

  get r() {
    return this[0];
  }

  set r(value: number) {
    this[0] = value;
  }

  get g() {
    return this[1];
  }

  set g(value: number) {
    this[1] = value;
  }

  get b() {
    return this[2];
  }

  set b(value: number) {
    this[2] = value;
  }

  get a() {
    return this[3];
  }

  set a(value: number) {
    this[3] = value;
  }
}

export class Rectangle extends Float32Array {
  constructor(x: number, y: number, width: number, height: number) {
    super([x, y, width, height]);
  }

  get x() {
    return this[0];
  }

  set x(value: number) {
    this[0] = value;
  }

  get y() {
    return this[1];
  }

  set y(value: number) {
    this[1] = value;
  }

  get width() {
    return this[2];
  }

  set width(value: number) {
    this[2] = value;
  }

  get height() {
    return this[3];
  }

  set height(value: number) {
    this[3] = value;
  }
}

export class Image {
  #buffer: Uint8Array<ArrayBuffer>;

  /** Avoid using if possible */
  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  get width(): number {
    const view = new DataView(this.#buffer.buffer);
    return view.getInt32(8, littleEndian);
  }

  get height(): number {
    const view = new DataView(this.#buffer.buffer);
    return view.getInt32(12, littleEndian);
  }
}

export class Texture {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  get id(): number {
    return this.view.getUint32(0, true);
  }

  get width(): number {
    return this.view.getInt32(4, true);
  }

  get height(): number {
    return this.view.getInt32(8, true);
  }

  get mipmaps(): number {
    return this.view.getInt32(12, true);
  }

  get format(): number {
    return this.view.getInt32(16, true);
  }
}

export class Texture2D extends Texture {}
export class TextureCubemap extends Texture {}

export class RenderTexture {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }
}

export class NPatchInfo {
  constructor(
    /** Texture source rectangle */
    public source: Rectangle,
    /** Left border offset */
    public left: number,
    /** Top border offset */
    public top: number,
    /** Right border offset */
    public right: number,
    /**  Bottom border offset */
    public bottom: number,
    /** Layout of the n-patch: 3x3, 1x3 or 3x1 */
    public layout: NPatchLayout,
  ) {}

  get buffer(): ArrayBuffer {
    const view = new DataView(new ArrayBuffer(36));
    view.setFloat32(0, this.source.x, littleEndian);
    view.setFloat32(4, this.source.y, littleEndian);
    view.setFloat32(8, this.source.width, littleEndian);
    view.setFloat32(12, this.source.height, littleEndian);
    view.setInt32(16, this.left, littleEndian);
    view.setInt32(20, this.top, littleEndian);
    view.setInt32(24, this.right, littleEndian);
    view.setInt32(28, this.bottom, littleEndian);
    view.setInt32(32, this.layout, littleEndian);
    return view.buffer;
  }
}

export class GlyphInfo {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  get value(): number {
    return this.view.getInt32(0, littleEndian);
  }

  get offsetX(): number {
    return this.view.getInt32(4, littleEndian);
  }

  get offsetY(): number {
    return this.view.getInt32(8, littleEndian);
  }

  get advanceX(): number {
    return this.view.getInt32(12, littleEndian);
  }

  // Image starts at offset 16
  get image(): Image {
    return new Image(
      new Uint8Array(
        this.#buffer.buffer,
        this.#buffer.byteOffset + 16,
        24,
      ) as Uint8Array<ArrayBuffer>,
    );
  }
}

export class Font {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): ArrayBuffer {
    return this.#buffer.buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  get baseSize(): number {
    return this.view.getInt32(0, littleEndian);
  }

  get glyphCount(): number {
    return this.view.getInt32(4, littleEndian);
  }

  get glyphPadding(): number {
    return this.view.getInt32(8, littleEndian);
  }

  // Texture2D at offset 12 (20 bytes)
  get texture(): Texture2D {
    return new Texture2D(
      new Uint8Array(
        this.#buffer.buffer,
        this.#buffer.byteOffset + 12,
        20,
      ) as Uint8Array<ArrayBuffer>,
    );
  }

  // Rectangle* recs
  get recsPtr(): bigint {
    return this.view.getBigUint64(32, littleEndian);
  }

  // GlyphInfo* glyphs
  get glyphsPtr(): bigint {
    return this.view.getBigUint64(40, littleEndian);
  }
}

export class Camera3D {
  #buffer: ArrayBuffer;
  #view: DataView;
  #position: ViewFloatVec3;
  #target: ViewFloatVec3;
  #up: ViewFloatVec3;

  constructor(options?: {
    position?: Vector3;
    target?: Vector3;
    up?: Vector3;
    fovy?: number;
    projection?: CameraProjection;
  }) {
    this.#buffer = new ArrayBuffer(44);
    this.#view = new DataView(this.#buffer);

    this.#position = this.VFVector(0);
    this.#target = this.VFVector(12);
    this.#up = this.VFVector(24);

    this.position = options?.position ?? new Vector3(0, 0, 0);
    this.target = options?.target ?? new Vector3(0, 1, 0);
    this.up = options?.up ?? new Vector3(0, 0, 1);
    this.fovy = options?.fovy ?? 90;
    this.projection = options?.projection ?? CameraProjection.PERSPECTIVE;
  }

  get buffer(): ArrayBuffer {
    // this.#buffer = this.#view.buffer as ArrayBuffer;
    return this.#buffer;
  }

  private VFVector(offset: int): ViewFloatVec3 {
    const view = this.#view;
    return {
      get x() {
        return view.getFloat32(offset + 0, littleEndian);
      },
      set x(v: float) {
        view.setFloat32(offset + 0, v, littleEndian);
      },
      get y() {
        return view.getFloat32(offset + 4, littleEndian);
      },
      set y(v: float) {
        view.setFloat32(offset + 4, v, littleEndian);
      },
      get z() {
        return view.getFloat32(offset + 8, littleEndian);
      },
      set z(v: float) {
        view.setFloat32(offset + 8, v, littleEndian);
      },
    };
  }

  get position(): ViewFloatVec3 {
    return this.#position;
  }
  set position(value: { x: float; y: float; z: float }) {
    this.#position.x = value.x;
    this.#position.y = value.y;
    this.#position.z = value.z;
  }

  get target(): ViewFloatVec3 {
    return this.#target;
  }
  set target(value: { x: float; y: float; z: float }) {
    this.#target.x = value.x;
    this.#target.y = value.y;
    this.#target.z = value.z;
  }

  get up(): ViewFloatVec3 {
    return this.#up;
  }
  set up(value: { x: float; y: float; z: float }) {
    this.#up.x = value.x;
    this.#up.y = value.y;
    this.#up.z = value.z;
  }

  get fovy(): float {
    return this.#view.getFloat32(36, littleEndian);
  }
  set fovy(value: float) {
    this.#view.setFloat32(36, value, littleEndian);
  }

  get projection(): CameraProjection {
    return this.#view.getInt32(40, littleEndian);
  }
  set projection(value: CameraProjection) {
    this.#view.setInt32(40, value, littleEndian);
  }
}

export class Camera extends Camera3D {}

export class Camera2D {
  #buffer: ArrayBuffer;
  #view: DataView;
  #offset: ViewFloatVec2;
  #target: ViewFloatVec2;

  constructor(
    options?: {
      /** Camera offset (displacement from target) */
      offset?: Vector2;
      /** Camera target (rotation and zoom origin) */
      target?: Vector2;
      /** Camera rotation in degrees */
      rotation?: number;
      /** Camera zoom (scaling), 1.0f by default */
      zoom?: number;
    },
  ) {
    this.#buffer = new ArrayBuffer(24);
    this.#view = new DataView(this.#buffer);
    this.#offset = this.VFVector2(0);
    this.#target = this.VFVector2(8);

    this.offset = options?.offset ?? new Vector2(0, 0);
    this.target = options?.target ?? new Vector2(0, 0);
    this.rotation = options?.rotation ?? 0;
    this.zoom = options?.zoom ?? 1;
  }

  get buffer(): ArrayBuffer {
    return this.#buffer;
  }

  private VFVector2(offset: int): ViewFloatVec2 {
    const view = this.#view;
    return {
      get x() {
        return view.getFloat32(offset + 0, littleEndian);
      },
      set x(v: float) {
        view.setFloat32(offset + 0, v, littleEndian);
      },
      get y() {
        return view.getFloat32(offset + 4, littleEndian);
      },
      set y(v: float) {
        view.setFloat32(offset + 4, v, littleEndian);
      },
    };
  }

  /** Camera offset (displacement from target) */
  get offset(): ViewFloatVec2 {
    return this.#offset;
  }
  set offset(value: { x: float; y: float }) {
    this.#offset.x = value.x;
    this.#offset.y = value.y;
  }

  /** Camera target (rotation and zoom origin) */
  get target(): ViewFloatVec2 {
    return this.#target;
  }
  set target(value: { x: float; y: float }) {
    this.#target.x = value.x;
    this.#target.y = value.y;
  }

  /** Camera rotation in degrees */
  get rotation(): float {
    return this.#view.getFloat32(16, littleEndian);
  }
  set rotation(value: float) {
    this.#view.setFloat32(16, value, littleEndian);
  }

  /** Camera zoom (scaling), 1.0f by default */
  get zoom(): float {
    return this.#view.getFloat32(20, littleEndian);
  }
  set zoom(value: float) {
    this.#view.setFloat32(20, value, littleEndian);
  }
}

export class Mesh {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // ---- counts ----
  get vertexCount(): number {
    return this.view.getInt32(0, true);
  }
  set vertexCount(v: number) {
    this.view.setInt32(0, v, true);
  }

  get triangleCount(): number {
    return this.view.getInt32(4, true);
  }
  set triangleCount(v: number) {
    this.view.setInt32(4, v, true);
  }

  // ---- pointers ----
  get verticesPtr(): bigint {
    return this.view.getBigUint64(8, true);
  }
  set verticesPtr(p: bigint) {
    this.view.setBigUint64(8, p, true);
  }

  get texcoordsPtr(): bigint {
    return this.view.getBigUint64(16, true);
  }
  set texcoordsPtr(p: bigint) {
    this.view.setBigUint64(16, p, true);
  }

  get texcoords2Ptr(): bigint {
    return this.view.getBigUint64(24, true);
  }
  set texcoords2Ptr(p: bigint) {
    this.view.setBigUint64(24, p, true);
  }

  get normalsPtr(): bigint {
    return this.view.getBigUint64(32, true);
  }
  set normalsPtr(p: bigint) {
    this.view.setBigUint64(32, p, true);
  }

  get tangentsPtr(): bigint {
    return this.view.getBigUint64(40, true);
  }
  set tangentsPtr(p: bigint) {
    this.view.setBigUint64(40, p, true);
  }

  get colorsPtr(): bigint {
    return this.view.getBigUint64(48, true);
  }
  set colorsPtr(p: bigint) {
    this.view.setBigUint64(48, p, true);
  }

  get indicesPtr(): bigint {
    return this.view.getBigUint64(56, true);
  }
  set indicesPtr(p: bigint) {
    this.view.setBigUint64(56, p, true);
  }

  get animVerticesPtr(): bigint {
    return this.view.getBigUint64(64, true);
  }
  set animVerticesPtr(p: bigint) {
    this.view.setBigUint64(64, p, true);
  }

  get animNormalsPtr(): bigint {
    return this.view.getBigUint64(72, true);
  }
  set animNormalsPtr(p: bigint) {
    this.view.setBigUint64(72, p, true);
  }

  get boneIdsPtr(): bigint {
    return this.view.getBigUint64(80, true);
  }
  set boneIdsPtr(p: bigint) {
    this.view.setBigUint64(80, p, true);
  }

  get boneWeightsPtr(): bigint {
    return this.view.getBigUint64(88, true);
  }
  set boneWeightsPtr(p: bigint) {
    this.view.setBigUint64(88, p, true);
  }

  get boneMatricesPtr(): bigint {
    return this.view.getBigUint64(96, true);
  }
  set boneMatricesPtr(p: bigint) {
    this.view.setBigUint64(96, p, true);
  }

  // ---- bones ----
  get boneCount(): number {
    return this.view.getInt32(104, true);
  }
  set boneCount(v: number) {
    this.view.setInt32(104, v, true);
  }

  // ---- OpenGL ----
  get vaoId(): number {
    return this.view.getUint32(112, true);
  }
  set vaoId(v: number) {
    this.view.setUint32(112, v, true);
  }

  get vboIdPtr(): bigint {
    return this.view.getBigUint64(120, true);
  }
  set vboIdPtr(p: bigint) {
    this.view.setBigUint64(120, p, true);
  }
}

export class Shader {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // Shader program id
  get id(): number {
    return this.view.getUint32(0, true);
  }
  set id(v: number) {
    this.view.setUint32(0, v, true);
  }

  // int* locs (RL_MAX_SHADER_LOCATIONS)
  get locsPtr(): bigint {
    return this.view.getBigUint64(8, true);
  }
  set locsPtr(p: bigint) {
    this.view.setBigUint64(8, p, true);
  }
}

export class MaterialMap {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // Texture2D (20 bytes)
  get texture(): Texture2D {
    return new Texture2D(
      new Uint8Array(
        this.#buffer.buffer,
        this.#buffer.byteOffset,
        20,
      ) as Uint8Array<ArrayBuffer>,
    );
  }

  // Color (RGBA, 4 bytes)
  get color(): Color {
    return new Color(
      this.view.getUint8(20),
      this.view.getUint8(21),
      this.view.getUint8(22),
      this.view.getUint8(23),
    );
  }

  set color(c: Color) {
    this.view.setUint8(20, c.r);
    this.view.setUint8(21, c.g);
    this.view.setUint8(22, c.b);
    this.view.setUint8(23, c.a);
  }

  // float value
  get value(): number {
    return this.view.getFloat32(24, true);
  }

  set value(v: number) {
    this.view.setFloat32(24, v, true);
  }
}

export class Material {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // Shader (16 bytes)
  get shader(): Shader {
    return new Shader(
      new Uint8Array(
        this.#buffer.buffer,
        this.#buffer.byteOffset,
        16,
      ) as Uint8Array<ArrayBuffer>,
    );
  }

  // MaterialMap* maps
  get mapsPtr(): bigint {
    return this.view.getBigUint64(16, true);
  }

  set mapsPtr(p: bigint) {
    this.view.setBigUint64(16, p, true);
  }

  // params[4]
  get params(): Float32Array {
    return new Float32Array(
      this.#buffer.buffer,
      this.#buffer.byteOffset + 24,
      4,
    );
  }
}

export class Transform extends Float32Array {
  #translation: ViewFloatVec3;
  #rotation: ViewFloatQuat;
  #scale: ViewFloatVec3;

  constructor(
    translation = new Vector3(0, 0, 0),
    rotation = new Quaternion(0, 0, 0, 1),
    scale = new Vector3(1, 1, 1),
  ) {
    super(10);

    this.#translation = this.VFVector(0);
    this.#rotation = this.VFQuat(3);
    this.#scale = this.VFVector(7);

    this.translation = translation;
    this.rotation = rotation;
    this.scale = scale;
  }

  private VFVector(offset: int): ViewFloatVec3 {
    const view = () => this;
    return {
      get x() {
        return view()[offset + 0];
      },
      set x(v: float) {
        view()[offset + 0] = v;
      },
      get y() {
        return view()[offset + 1];
      },
      set y(v: float) {
        view()[offset + 1] = v;
      },
      get z() {
        return view()[offset + 2];
      },
      set z(v: float) {
        view()[offset + 2] = v;
      },
    };
  }

  private VFQuat(offset: int): ViewFloatQuat {
    const view = () => this;
    return {
      get x() {
        return view()[offset + 0];
      },
      set x(v: float) {
        view()[offset + 0] = v;
      },
      get y() {
        return view()[offset + 1];
      },
      set y(v: float) {
        view()[offset + 1] = v;
      },
      get z() {
        return view()[offset + 2];
      },
      set z(v: float) {
        view()[offset + 2] = v;
      },
      get w() {
        return view()[offset + 3];
      },
      set w(v: float) {
        view()[offset + 3] = v;
      },
    };
  }

  // ---- translation ----
  get translation(): ViewFloatVec3 {
    return this.#translation;
  }

  set translation(v: { x: float; y: float; z: float }) {
    this.#translation.x = v.x;
    this.#translation.y = v.y;
    this.#translation.z = v.z;
  }

  // ---- rotation ----
  get rotation(): ViewFloatQuat {
    return this.#rotation;
  }

  set rotation(q: { x: float; y: float; z: float; w: float }) {
    this.#rotation.x = q.x;
    this.#rotation.y = q.y;
    this.#rotation.z = q.z;
    this.#rotation.w = q.w;
  }

  // ---- scale ----
  get scale(): ViewFloatVec3 {
    return this.#scale;
  }

  set scale(v: { x: float; y: float; z: float }) {
    this.#scale.x = v.x;
    this.#scale.y = v.y;
    this.#scale.z = v.z;
  }
}

export class BoneInfo {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // ---- name[32] ----
  get name(): string {
    const bytes = new Uint8Array(
      this.#buffer.buffer,
      this.#buffer.byteOffset,
      32,
    );

    // C-style null-terminated string
    let end = bytes.indexOf(0);
    if (end === -1) end = 32;

    return new TextDecoder().decode(bytes.subarray(0, end));
  }

  set name(value: string) {
    const bytes = new Uint8Array(
      this.#buffer.buffer,
      this.#buffer.byteOffset,
      32,
    );

    bytes.fill(0);

    const encoded = new TextEncoder().encode(value);
    bytes.set(encoded.subarray(0, 32));
  }

  // ---- parent ----
  get parent(): number {
    return this.view.getInt32(32, true);
  }

  set parent(v: number) {
    this.view.setInt32(32, v, true);
  }
}

export class Model {
  #buffer: Uint8Array<ArrayBuffer>;
  #transform: Matrix;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
    this.#transform = Matrix.fromBuffer(
      this.#buffer.buffer,
      this.#buffer.byteOffset,
    );
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // ---- transform (Matrix, 64 bytes) ----
  get transform(): Matrix {
    return this.#transform;
  }

  set transform(m: Matrix) {
    this.#transform.set(m);
  }

  // ---- counts ----
  get meshCount(): number {
    return this.view.getInt32(64, true);
  }
  set meshCount(v: number) {
    this.view.setInt32(64, v, true);
  }

  get materialCount(): number {
    return this.view.getInt32(68, true);
  }
  set materialCount(v: number) {
    this.view.setInt32(68, v, true);
  }

  // ---- pointers ----
  get meshesPtr(): bigint {
    return this.view.getBigUint64(72, true);
  }
  set meshesPtr(p: bigint) {
    this.view.setBigUint64(72, p, true);
  }

  get materialsPtr(): bigint {
    return this.view.getBigUint64(80, true);
  }
  set materialsPtr(p: bigint) {
    this.view.setBigUint64(80, p, true);
  }

  get meshMaterialPtr(): bigint {
    return this.view.getBigUint64(88, true);
  }
  set meshMaterialPtr(p: bigint) {
    this.view.setBigUint64(88, p, true);
  }

  // ---- bones ----
  get boneCount(): number {
    return this.view.getInt32(96, true);
  }
  set boneCount(v: number) {
    this.view.setInt32(96, v, true);
  }

  get bonesPtr(): bigint {
    return this.view.getBigUint64(104, true);
  }
  set bonesPtr(p: bigint) {
    this.view.setBigUint64(104, p, true);
  }

  get bindPosePtr(): bigint {
    return this.view.getBigUint64(112, true);
  }
  set bindPosePtr(p: bigint) {
    this.view.setBigUint64(112, p, true);
  }
}

export class ModelAnimation {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // ---- counts ----
  get boneCount(): number {
    return this.view.getInt32(0, true);
  }
  set boneCount(v: number) {
    this.view.setInt32(0, v, true);
  }

  get frameCount(): number {
    return this.view.getInt32(4, true);
  }
  set frameCount(v: number) {
    this.view.setInt32(4, v, true);
  }

  // ---- pointers ----
  get bonesPtr(): bigint {
    return this.view.getBigUint64(8, true);
  }
  set bonesPtr(p: bigint) {
    this.view.setBigUint64(8, p, true);
  }

  // Transform** (array of Transform*)
  get framePosesPtr(): bigint {
    return this.view.getBigUint64(16, true);
  }
  set framePosesPtr(p: bigint) {
    this.view.setBigUint64(16, p, true);
  }

  // ---- name[32] ----
  get name(): string {
    const bytes = new Uint8Array(
      this.#buffer.buffer,
      this.#buffer.byteOffset + 24,
      32,
    );

    let end = bytes.indexOf(0);
    if (end === -1) end = 32;

    return new TextDecoder().decode(bytes.subarray(0, end));
  }

  set name(value: string) {
    const bytes = new Uint8Array(
      this.#buffer.buffer,
      this.#buffer.byteOffset + 24,
      32,
    );

    bytes.fill(0);

    const encoded = new TextEncoder().encode(value);
    bytes.set(encoded.subarray(0, 32));
  }
}

export class Ray extends Float32Array {
  #position: ViewFloatVec3;
  #direction: ViewFloatVec3;

  constructor(
    position = new Vector3(0, 0, 0),
    direction = new Vector3(0, 0, 1),
  ) {
    super(6);
    this.#position = this.VFVector(0);
    this.#direction = this.VFVector(3);
    this.position = position;
    this.direction = direction;
  }

  private VFVector(offset: int): ViewFloatVec3 {
    const view = () => this;
    return {
      get x() {
        return view()[offset + 0];
      },
      set x(v: float) {
        view()[offset + 0] = v;
      },
      get y() {
        return view()[offset + 1];
      },
      set y(v: float) {
        view()[offset + 1] = v;
      },
      get z() {
        return view()[offset + 2];
      },
      set z(v: float) {
        view()[offset + 2] = v;
      },
    };
  }

  // ---- position ----
  get position(): ViewFloatVec3 {
    return this.#position;
  }

  set position(v: { x: float; y: float; z: float }) {
    this.#position.x = v.x;
    this.#position.y = v.y;
    this.#position.z = v.z;
  }

  get px(): number {
    return this[0];
  }
  set px(v: number) {
    this[0] = v;
  }

  get py(): number {
    return this[1];
  }
  set py(v: number) {
    this[1] = v;
  }

  get pz(): number {
    return this[2];
  }
  set pz(v: number) {
    this[2] = v;
  }

  // ---- direction ----
  get direction(): ViewFloatVec3 {
    return this.#direction;
  }

  set direction(v: { x: float; y: float; z: float }) {
    this.#direction.x = v.x;
    this.#direction.y = v.y;
    this.#direction.z = v.z;
  }

  get dx(): number {
    return this[3];
  }
  set dx(v: number) {
    this[3] = v;
  }

  get dy(): number {
    return this[4];
  }
  set dy(v: number) {
    this[4] = v;
  }

  get dz(): number {
    return this[5];
  }
  set dz(v: number) {
    this[5] = v;
  }
}

export class RayCollision {
  #buffer: Uint8Array<ArrayBuffer>;
  #view: DataView;
  #point: ViewFloatVec3;
  #normal: ViewFloatVec3;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
    this.#view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
    this.#point = this.VFVector(8);
    this.#normal = this.VFVector(20);
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return this.#view;
  }

  private VFVector(offset: int): ViewFloatVec3 {
    const view = this.#view;
    return {
      get x() {
        return view.getFloat32(offset + 0, true);
      },
      set x(v: float) {
        view.setFloat32(offset + 0, v, true);
      },
      get y() {
        return view.getFloat32(offset + 4, true);
      },
      set y(v: float) {
        view.setFloat32(offset + 4, v, true);
      },
      get z() {
        return view.getFloat32(offset + 8, true);
      },
      set z(v: float) {
        view.setFloat32(offset + 8, v, true);
      },
    };
  }

  // ---- hit ----
  get hit(): boolean {
    return this.view.getUint8(0) !== 0;
  }

  set hit(v: boolean) {
    this.view.setUint8(0, v ? 1 : 0);
  }

  // ---- distance ----
  get distance(): number {
    return this.view.getFloat32(4, true);
  }

  set distance(v: number) {
    this.view.setFloat32(4, v, true);
  }

  // ---- point ----
  get point(): ViewFloatVec3 {
    return this.#point;
  }

  set point(v: { x: float; y: float; z: float }) {
    this.#point.x = v.x;
    this.#point.y = v.y;
    this.#point.z = v.z;
  }

  // ---- normal ----
  get normal(): ViewFloatVec3 {
    return this.#normal;
  }

  set normal(v: { x: float; y: float; z: float }) {
    this.#normal.x = v.x;
    this.#normal.y = v.y;
    this.#normal.z = v.z;
  }
}

export class BoundingBox extends Float32Array {
  #min: ViewFloatVec3;
  #max: ViewFloatVec3;

  constructor(
    min = new Vector3(0, 0, 0),
    max = new Vector3(0, 0, 0),
  ) {
    super(6);
    this.#min = this.VFVector(0);
    this.#max = this.VFVector(3);
    this.min = min;
    this.max = max;
  }

  private VFVector(offset: int): ViewFloatVec3 {
    const view = () => this;
    return {
      get x() {
        return view()[offset + 0];
      },
      set x(v: float) {
        view()[offset + 0] = v;
      },
      get y() {
        return view()[offset + 1];
      },
      set y(v: float) {
        view()[offset + 1] = v;
      },
      get z() {
        return view()[offset + 2];
      },
      set z(v: float) {
        view()[offset + 2] = v;
      },
    };
  }

  // ---- min ----
  get min(): ViewFloatVec3 {
    return this.#min;
  }

  set min(v: { x: float; y: float; z: float }) {
    this.#min.x = v.x;
    this.#min.y = v.y;
    this.#min.z = v.z;
  }

  get minX(): number {
    return this[0];
  }
  set minX(v: number) {
    this[0] = v;
  }

  get minY(): number {
    return this[1];
  }
  set minY(v: number) {
    this[1] = v;
  }

  get minZ(): number {
    return this[2];
  }
  set minZ(v: number) {
    this[2] = v;
  }

  // ---- max ----
  get max(): ViewFloatVec3 {
    return this.#max;
  }

  set max(v: { x: float; y: float; z: float }) {
    this.#max.x = v.x;
    this.#max.y = v.y;
    this.#max.z = v.z;
  }

  get maxX(): number {
    return this[3];
  }
  set maxX(v: number) {
    this[3] = v;
  }

  get maxY(): number {
    return this[4];
  }
  set maxY(v: number) {
    this[4] = v;
  }

  get maxZ(): number {
    return this[5];
  }
  set maxZ(v: number) {
    this[5] = v;
  }
}

export class Wave {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // ---- frameCount ----
  get frameCount(): number {
    return this.view.getUint32(0, true);
  }

  set frameCount(v: number) {
    this.view.setUint32(0, v, true);
  }

  // ---- sampleRate ----
  get sampleRate(): number {
    return this.view.getUint32(4, true);
  }

  set sampleRate(v: number) {
    this.view.setUint32(4, v, true);
  }

  // ---- sampleSize ----
  get sampleSize(): number {
    return this.view.getUint32(8, true);
  }

  set sampleSize(v: number) {
    this.view.setUint32(8, v, true);
  }

  // ---- channels ----
  get channels(): number {
    return this.view.getUint32(12, true);
  }

  set channels(v: number) {
    this.view.setUint32(12, v, true);
  }

  // ---- data pointer ----
  get dataPtr(): bigint {
    return this.view.getBigUint64(16, true);
  }

  set dataPtr(p: bigint) {
    this.view.setBigUint64(16, p, true);
  }
}

export class AudioStream {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // ---- internal pointers ----
  get bufferPtr(): bigint {
    return this.view.getBigUint64(0, true);
  }

  set bufferPtr(p: bigint) {
    this.view.setBigUint64(0, p, true);
  }

  get processorPtr(): bigint {
    return this.view.getBigUint64(8, true);
  }

  set processorPtr(p: bigint) {
    this.view.setBigUint64(8, p, true);
  }

  // ---- audio format ----
  get sampleRate(): number {
    return this.view.getUint32(16, true);
  }

  set sampleRate(v: number) {
    this.view.setUint32(16, v, true);
  }

  get sampleSize(): number {
    return this.view.getUint32(20, true);
  }

  set sampleSize(v: number) {
    this.view.setUint32(20, v, true);
  }

  get channels(): number {
    return this.view.getUint32(24, true);
  }

  set channels(v: number) {
    this.view.setUint32(24, v, true);
  }
}

export class Sound {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // ---- AudioStream (32 bytes) ----
  get stream(): AudioStream {
    return new AudioStream(
      new Uint8Array(
        this.#buffer.buffer,
        this.#buffer.byteOffset,
        32,
      ) as Uint8Array<ArrayBuffer>,
    );
  }

  // ---- frameCount ----
  get frameCount(): number {
    return this.view.getUint32(32, true);
  }

  set frameCount(v: number) {
    this.view.setUint32(32, v, true);
  }
}

export class Music {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // ---- AudioStream (32 bytes) ----
  get stream(): AudioStream {
    return new AudioStream(
      new Uint8Array(
        this.#buffer.buffer,
        this.#buffer.byteOffset,
        32,
      ) as Uint8Array<ArrayBuffer>,
    );
  }

  // ---- frameCount ----
  get frameCount(): number {
    return this.view.getUint32(32, true);
  }

  set frameCount(v: number) {
    this.view.setUint32(32, v, true);
  }

  // ---- looping (bool) ----
  get looping(): boolean {
    return this.view.getUint8(36) !== 0;
  }

  set looping(v: boolean) {
    this.view.setUint8(36, v ? 1 : 0);
  }

  // ---- ctxType ----
  get ctxType(): number {
    return this.view.getInt32(40, true);
  }

  set ctxType(v: number) {
    this.view.setInt32(40, v, true);
  }

  // ---- ctxData pointer ----
  get ctxDataPtr(): bigint {
    return this.view.getBigUint64(48, true);
  }

  set ctxDataPtr(p: bigint) {
    this.view.setBigUint64(48, p, true);
  }
}

export class VrDeviceInfo {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // ---- resolution ----
  get hResolution(): number {
    return this.view.getInt32(0, true);
  }
  set hResolution(v: number) {
    this.view.setInt32(0, v, true);
  }

  get vResolution(): number {
    return this.view.getInt32(4, true);
  }
  set vResolution(v: number) {
    this.view.setInt32(4, v, true);
  }

  // ---- sizes ----
  get hScreenSize(): number {
    return this.view.getFloat32(8, true);
  }
  set hScreenSize(v: number) {
    this.view.setFloat32(8, v, true);
  }

  get vScreenSize(): number {
    return this.view.getFloat32(12, true);
  }
  set vScreenSize(v: number) {
    this.view.setFloat32(12, v, true);
  }

  get eyeToScreenDistance(): number {
    return this.view.getFloat32(16, true);
  }
  set eyeToScreenDistance(v: number) {
    this.view.setFloat32(16, v, true);
  }

  get lensSeparationDistance(): number {
    return this.view.getFloat32(20, true);
  }
  set lensSeparationDistance(v: number) {
    this.view.setFloat32(20, v, true);
  }

  get interpupillaryDistance(): number {
    return this.view.getFloat32(24, true);
  }
  set interpupillaryDistance(v: number) {
    this.view.setFloat32(24, v, true);
  }

  // ---- arrays ----
  get lensDistortionValues(): Float32Array {
    return new Float32Array(
      this.#buffer.buffer,
      this.#buffer.byteOffset + 28,
      4,
    );
  }

  get chromaAbCorrection(): Float32Array {
    return new Float32Array(
      this.#buffer.buffer,
      this.#buffer.byteOffset + 44,
      4,
    );
  }
}

export class VrStereoConfig {
  #buffer: Uint8Array<ArrayBuffer>;
  #projection: [Matrix, Matrix];
  #viewOffset: [Matrix, Matrix];

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
    this.#projection = [
      Matrix.fromBuffer(this.#buffer.buffer, this.#buffer.byteOffset + 0),
      Matrix.fromBuffer(this.#buffer.buffer, this.#buffer.byteOffset + 64),
    ];
    this.#viewOffset = [
      Matrix.fromBuffer(this.#buffer.buffer, this.#buffer.byteOffset + 128),
      Matrix.fromBuffer(this.#buffer.buffer, this.#buffer.byteOffset + 192),
    ];
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // ---- matrices ----
  getProjection(eye: 0 | 1): Matrix {
    return this.#projection[eye];
  }

  setProjection(eye: 0 | 1, m: Matrix): void {
    this.#projection[eye].set(m);
  }

  getViewOffset(eye: 0 | 1): Matrix {
    return this.#viewOffset[eye];
  }

  setViewOffset(eye: 0 | 1, m: Matrix): void {
    this.#viewOffset[eye].set(m);
  }

  // ---- float[2] helpers ----
  private getVec2(offset: number): Float32Array {
    return new Float32Array(
      this.#buffer.buffer,
      this.#buffer.byteOffset + offset,
      2,
    );
  }

  get leftLensCenter(): Float32Array {
    return this.getVec2(256);
  }

  get rightLensCenter(): Float32Array {
    return this.getVec2(264);
  }

  get leftScreenCenter(): Float32Array {
    return this.getVec2(272);
  }

  get rightScreenCenter(): Float32Array {
    return this.getVec2(280);
  }

  get scale(): Float32Array {
    return this.getVec2(288);
  }

  get scaleIn(): Float32Array {
    return this.getVec2(296);
  }
}

export class FilePathList {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // ---- capacity ----
  get capacity(): number {
    return this.view.getUint32(0, true);
  }

  set capacity(v: number) {
    this.view.setUint32(0, v, true);
  }

  // ---- count ----
  get count(): number {
    return this.view.getUint32(4, true);
  }

  set count(v: number) {
    this.view.setUint32(4, v, true);
  }

  // ---- char** paths ----
  get pathsPtr(): bigint {
    return this.view.getBigUint64(8, true);
  }

  set pathsPtr(p: bigint) {
    this.view.setBigUint64(8, p, true);
  }
}

export class AutomationEvent {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // ---- frame ----
  get frame(): number {
    return this.view.getUint32(0, true);
  }

  set frame(v: number) {
    this.view.setUint32(0, v, true);
  }

  // ---- type ----
  get type(): number {
    return this.view.getUint32(4, true);
  }

  set type(v: number) {
    this.view.setUint32(4, v, true);
  }

  // ---- params[4] ----
  get params(): Int32Array {
    return new Int32Array(
      this.#buffer.buffer,
      this.#buffer.byteOffset + 8,
      4,
    );
  }
}

export class AutomationEventList {
  #buffer: Uint8Array<ArrayBuffer>;

  constructor(buffer: Uint8Array<ArrayBuffer>) {
    this.#buffer = buffer;
  }

  get buffer(): Uint8Array<ArrayBuffer> {
    return this.#buffer;
  }

  private get view(): DataView {
    return new DataView(this.#buffer.buffer, this.#buffer.byteOffset);
  }

  // ---- capacity ----
  get capacity(): number {
    return this.view.getUint32(0, true);
  }

  set capacity(v: number) {
    this.view.setUint32(0, v, true);
  }

  // ---- count ----
  get count(): number {
    return this.view.getUint32(4, true);
  }

  set count(v: number) {
    this.view.setUint32(4, v, true);
  }

  // ---- AutomationEvent* events ----
  get eventsPtr(): bigint {
    return this.view.getBigUint64(8, true);
  }

  set eventsPtr(p: bigint) {
    this.view.setBigUint64(8, p, true);
  }
}

// consts

export const LightGray = new Color(200, 200, 200, 255);
export const Gray = new Color(130, 130, 130, 255);
export const DarkGray = new Color(80, 80, 80, 255);

export const Yellow = new Color(253, 249, 0, 255);
export const Gold = new Color(255, 203, 0, 255);
export const Orange = new Color(255, 161, 0, 255);
export const Pink = new Color(255, 109, 194, 255);
export const Red = new Color(230, 41, 55, 255);
export const Maroon = new Color(190, 33, 55, 255);

export const Green = new Color(0, 228, 48, 255);
export const Lime = new Color(0, 158, 47, 255);
export const DarkGreen = new Color(0, 117, 44, 255);

export const SkyBlue = new Color(102, 191, 255, 255);
export const Blue = new Color(0, 121, 241, 255);
export const DarkBlue = new Color(0, 82, 172, 255);

export const Purple = new Color(200, 122, 255, 255);
export const Violet = new Color(135, 60, 190, 255);
export const DarkPurple = new Color(112, 31, 126, 255);

export const Beige = new Color(211, 176, 131, 255);
export const Brown = new Color(127, 106, 79, 255);
export const DarkBrown = new Color(76, 63, 47, 255);

export const White = new Color(255, 255, 255, 255);
export const Black = new Color(0, 0, 0, 255);
export const Blank = new Color(0, 0, 0, 0);
export const Magenta = new Color(255, 0, 255, 255);
export const RayWhite = new Color(245, 245, 245, 255);

// functions

export function InitWindow(width: int, height: int, title: string): void {
  lib.InitWindow(width, height, new TextEncoder().encode(title + "\0"));
}

export function CloseWindow(): void {
  lib.CloseWindow();
}

export function WindowShouldClose(): boolean {
  return !!lib.WindowShouldClose();
}

export function IsWindowReady(): boolean {
  return !!lib.IsWindowReady();
}

export function IsWindowHidden(): boolean {
  return !!lib.IsWindowHidden();
}

export function IsWindowMinimized(): boolean {
  return !!lib.IsWindowMinimized();
}

export function IsWindowMaximized(): boolean {
  return !!lib.IsWindowMaximized();
}

export function IsWindowFocused(): boolean {
  return !!lib.IsWindowFocused();
}

export function IsWindowResized(): boolean {
  return !!lib.IsWindowResized();
}

export function IsWindowState(state: ConfigFlags): boolean {
  return !!lib.IsWindowState(state);
}

export function SetWindowState(state: ConfigFlags): void {
  lib.SetWindowState(state);
}

export function ClearWindowState(state: ConfigFlags): void {
  lib.ClearWindowState(state);
}

export function ToggleFullscreen(): void {
  lib.ToggleFullscreen();
}

export function ToggleBorderlessWindowed(): void {
  lib.ToggleBorderlessWindowed();
}

export function MaximizedWindow(): void {
  lib.MaximizeWindow();
}

export function MinimizedWindow(): void {
  lib.MinimizeWindow();
}

export function RestoreWindow(): void {
  lib.RestoreWindow();
}

export function SetWindowIcon(image: Image): void {
  lib.SetWindowIcon(image.buffer);
}

export function SetWindowIcons(images: Image[]): void {
  const IMAGE_SIZE = 24; // raylib Image struct size (64-bit)
  const count = images.length;

  const buf = new Uint8Array(IMAGE_SIZE * count);

  for (let i = 0; i < count; i++) {
    buf.set(images[i].buffer, i * IMAGE_SIZE);
  }

  lib.SetWindowIcons(
    Deno.UnsafePointer.of(buf),
    count,
  );
}

export function SetWindowTitle(title: string): void {
  lib.SetWindowTitle(new TextEncoder().encode(title + "\0"));
}

export function SetWindowPosition(x: int, y: int): void {
  lib.SetWindowPosition(x, y);
}

export function SetWindowMonitor(monitor: int): void {
  lib.SetWindowMonitor(monitor);
}

export function SetWindowMinSize(width: int, height: int): void {
  lib.SetWindowMinSize(width, height);
}

export function SetWindowMaxSize(width: int, height: int): void {
  lib.SetWindowMaxSize(width, height);
}

export function SetWindowSize(width: int, height: int): void {
  lib.SetWindowSize(width, height);
}

export function SetWindowOpacity(opacity: float): void {
  lib.SetWindowOpacity(opacity);
}

export function SetWindowFocused(): void {
  lib.SetWindowFocused();
}

export function GetWindowHandle(): Deno.PointerValue<unknown> {
  return lib.GetWindowHandle();
}

export function GetScreenWidth(): int {
  return lib.GetScreenWidth();
}

export function GetScreenHeight(): int {
  return lib.GetScreenHeight();
}

export function GetRenderWidth(): int {
  return lib.GetRenderWidth();
}

export function GetRenderHeight(): int {
  return lib.GetRenderHeight();
}

export function GetMonitorCount(): int {
  return lib.GetMonitorCount();
}

export function GetCurrentMonitor(): int {
  return lib.GetCurrentMonitor();
}

export function GetMonitorPosition(monitor: int): Vector2 {
  const buf = lib.GetMonitorPosition(monitor);
  const f = new Float32Array(buf.buffer, buf.byteOffset, 2);
  return new Vector2(f[0], f[1]);
}

export function GetMonitorWidth(monitor: int): int {
  return lib.GetMonitorWidth(monitor);
}

export function GetMonitorHeight(monitor: int): int {
  return lib.GetMonitorHeight(monitor);
}

export function GetMonitorPhysicalWidth(monitor: int): int {
  return lib.GetMonitorPhysicalWidth(monitor);
}

export function GetMonitorPhysicalHeight(monitor: int): int {
  return lib.GetMonitorPhysicalHeight(monitor);
}

export function GetMonitorRefreshRate(monitor: int): int {
  return lib.GetMonitorRefreshRate(monitor);
}

export function GetWindowPosition(): Vector2 {
  const buf = lib.GetWindowPosition();
  const f = new Float32Array(buf.buffer, buf.byteOffset, 2);
  return new Vector2(f[0], f[1]);
}

export function GetWindowScaleDPI(): Vector2 {
  const buf = lib.GetWindowScaleDPI();
  const f = new Float32Array(buf.buffer, buf.byteOffset, 2);
  return new Vector2(f[0], f[1]);
}

export function GetMonitorName(monitor: int): string {
  const ptr = lib.GetMonitorName(monitor);
  if (ptr === null) return "";
  return Deno.UnsafePointerView.getCString(ptr);
}

export function SetClipboardText(text: string): void {
  lib.SetClipboardText(new TextEncoder().encode(text + "\0"));
}

export function GetClipboardText(): string {
  const buf = lib.GetClipboardText();
  if (buf === null) return "";
  return Deno.UnsafePointerView.getCString(buf);
}

export function GetClipboardImage(): Image {
  const buf = lib.GetClipboardImage();
  return new Image(buf);
}

export function EnableEventWaiting(): void {
  lib.EnableEventWaiting();
}

export function DisableEventWaiting(): void {
  lib.DisableEventWaiting();
}

export function ShowCursor(): void {
  lib.ShowCursor();
}

export function HideCursor(): void {
  lib.HideCursor();
}

export function IsCursorHidden(): boolean {
  return !!lib.IsCursorHidden();
}

export function EnableCursor(): void {
  lib.EnableCursor();
}

export function DisableCursor(): void {
  lib.DisableCursor();
}

export function IsCursorOnScreen(): boolean {
  return !!lib.IsCursorOnScreen();
}

export function ClearBackground(color: Color): void {
  lib.ClearBackground(color.buffer);
}

export function BeginDrawing(): void {
  lib.BeginDrawing();
}

export function EndDrawing(): void {
  lib.EndDrawing();
}

export function BeginMode2D(camera: Camera2D): void {
  lib.BeginMode2D(camera.buffer);
}

export function EndMode2D(): void {
  lib.EndMode2D();
}

export function BeginMode3D(camera: Camera3D): void {
  lib.BeginMode3D(camera.buffer);
}

export function EndMode3D(): void {
  lib.EndMode3D();
}

export function BeginTextureMode(texture: Texture2D): void {
  lib.BeginTextureMode(texture.buffer);
}

export function EndTextureMode(): void {
  lib.EndTextureMode();
}

export function BeginShaderMode(shader: Shader): void {
  lib.BeginShaderMode(shader.buffer);
}

export function EndShaderMode(): void {
  lib.EndShaderMode();
}

export function BeginBlendMode(mode: BlendMode): void {
  lib.BeginBlendMode(mode);
}

export function EndBlendMode(): void {
  lib.EndBlendMode();
}

export function BeginScissorMode(
  x: int,
  y: int,
  width: int,
  height: int,
): void {
  lib.BeginScissorMode(x, y, width, height);
}

export function EndScissorMode(): void {
  lib.EndScissorMode();
}

export function BeginVrStereoMode(config: VrStereoConfig): void {
  lib.BeginVrStereoMode(config.buffer);
}

export function EndVrStereoMode(): void {
  lib.EndVrStereoMode();
}

export function LoadVrStereoConfig(device: VrDeviceInfo): VrStereoConfig {
  const buf = lib.LoadVrStereoConfig(device.buffer);
  return new VrStereoConfig(buf);
}

export function UnloadVrStereoConfig(config: VrStereoConfig): void {
  lib.UnloadVrStereoConfig(config.buffer);
}

export function LoadShader(vShader: string, fShader: string): Shader {
  const vShaderBuf = new TextEncoder().encode(vShader + "\0");
  const fShaderBuf = new TextEncoder().encode(fShader + "\0");
  const buf = lib.LoadShader(vShaderBuf, fShaderBuf);
  return new Shader(buf);
}

export function LoadShaderFromMemory(vShader: string, fShader: string): Shader {
  const vShaderBuf = new TextEncoder().encode(vShader + "\0");
  const fShaderBuf = new TextEncoder().encode(fShader + "\0");
  const buf = lib.LoadShaderFromMemory(vShaderBuf, fShaderBuf);
  return new Shader(buf);
}

export function IsShaderValid(shader: Shader): boolean {
  return !!lib.IsShaderValid(shader.buffer);
}

export function GetShaderLocation(shader: Shader, name: string): int {
  const nameBuf = new TextEncoder().encode(name + "\0");
  return lib.GetShaderLocation(shader.buffer, nameBuf);
}

export function GetShaderLocationAttrib(shader: Shader, name: string): int {
  const nameBuf = new TextEncoder().encode(name + "\0");
  return lib.GetShaderLocationAttrib(shader.buffer, nameBuf);
}

export function SetShaderValue(
  shader: Shader,
  locIndex: int,
  value: Uint8Array<ArrayBufferLike>,
  uniformType: ShaderUniformDataType,
): void {
  lib.SetShaderValue(
    shader.buffer,
    locIndex,
    Deno.UnsafePointer.of(value as unknown as Uint8Array<ArrayBuffer>),
    uniformType,
  );
}

export function SetShaderValueV(
  shader: Shader,
  locIndex: int,
  value: Uint8Array<ArrayBufferLike>,
  uniformType: ShaderUniformDataType,
  count: int,
): void {
  lib.SetShaderValueV(
    shader.buffer,
    locIndex,
    Deno.UnsafePointer.of(value as unknown as Uint8Array<ArrayBuffer>),
    uniformType,
    count,
  );
}

export function SetShaderValueMatrix(
  shader: Shader,
  locIndex: int,
  mat: Matrix,
): void {
  lib.SetShaderValueMatrix(
    shader.buffer,
    locIndex,
    mat.buffer,
  );
}

export function SetShaderValueTexture(
  shader: Shader,
  locIndex: int,
  texture: Texture2D,
): void {
  lib.SetShaderValueTexture(
    shader.buffer,
    locIndex,
    texture.buffer,
  );
}

export function UnloadShader(shader: Shader): void {
  lib.UnloadShader(shader.buffer);
}

export function GetScreenToWorldRay(position: Vector2, camera: Camera): Ray {
  const buf = lib.GetScreenToWorldRay(position.buffer, camera.buffer);
  const pos3 = new Vector3(buf[0], buf[4], buf[8]);
  const dir3 = new Vector3(buf[12], buf[16], buf[20]);
  return new Ray(pos3, dir3);
}

export function GetScreenToWorldRayEx(
  position: Vector2,
  camera: Camera,
  width: int,
  height: int,
): Ray {
  const buf = lib.GetScreenToWorldRayEx(
    position.buffer,
    camera.buffer,
    width,
    height,
  );
  const pos3 = new Vector3(buf[0], buf[4], buf[8]);
  const dir3 = new Vector3(buf[12], buf[16], buf[20]);
  return new Ray(pos3, dir3);
}

export function GetWorldToScreen(position: Vector3, camera: Camera): Vector2 {
  const buf = lib.GetWorldToScreen(position.buffer, camera.buffer);
  return new Vector2(buf[0], buf[1]);
}

export function GetWorldToScreenEx(
  position: Vector3,
  camera: Camera,
  width: int,
  height: int,
): Vector2 {
  const buf = lib.GetWorldToScreenEx(
    position.buffer,
    camera.buffer,
    width,
    height,
  );
  return new Vector2(buf[0], buf[1]);
}

export function GetWorldToScreen2D(
  position: Vector2,
  camera: Camera2D,
): Vector2 {
  const buf = lib.GetWorldToScreen2D(position.buffer, camera.buffer);
  return new Vector2(buf[0], buf[1]);
}

export function GetSCreenToWorld2D(
  position: Vector2,
  camera: Camera2D,
): Vector2 {
  const buf = lib.GetScreenToWorld2D(position.buffer, camera.buffer);
  return new Vector2(buf[0], buf[1]);
}

export function GetCameraMatrix(camera: Camera): Matrix {
  const buf = lib.GetCameraMatrix(camera.buffer);
  return new Matrix(
    buf[0],
    buf[4],
    buf[8],
    buf[12],
    buf[16],
    buf[20],
    buf[24],
    buf[28],
    buf[32],
    buf[36],
    buf[40],
    buf[44],
    buf[48],
    buf[52],
    buf[56],
    buf[60],
  );
}

export function GetCameraMatrix2D(camera: Camera2D): Matrix {
  const buf = lib.GetCameraMatrix2D(camera.buffer);
  return new Matrix(
    buf[0],
    buf[4],
    buf[8],
    buf[12],
    buf[16],
    buf[20],
    buf[24],
    buf[28],
    buf[32],
    buf[36],
    buf[40],
    buf[44],
    buf[48],
    buf[52],
    buf[56],
    buf[60],
  );
}

export function SetTargetFPS(fps: int): void {
  lib.SetTargetFPS(fps);
}

export function GetFrameTime(): float {
  return lib.GetFrameTime();
}

export function GetTime(): float {
  return lib.GetTime();
}

export function GetFPS(): int {
  return lib.GetFPS();
}

export function SwapScreenBuffer(): void {
  lib.SwapScreenBuffer();
}

export function PollInputEvents(): void {
  lib.PollInputEvents();
}

export function WaitTime(seconds: float): void {
  lib.WaitTime(seconds);
}

export function SetRandomSeed(seed: int): void {
  lib.SetRandomSeed(seed);
}

export function GetRandomValue(min: int, max: int): int {
  return lib.GetRandomValue(min, max);
}

export function LoadRandomSequence(
  count: int,
  min: int,
  max: int,
): int[] {
  const ptr = lib.LoadRandomSequence(count, min, max);
  if (ptr === null) return [];

  const view = new Deno.UnsafePointerView(ptr);
  const arr: int[] = [];

  for (let i = 0; i < count; i++) {
    arr.push(view.getInt32(i * 4));
  }

  lib.UnloadRandomSequence(ptr);

  return arr;
}

export function TakeScreenshot(fileName: string): void {
  const fileNameBuf = new TextEncoder().encode(fileName + "\0");
  lib.TakeScreenshot(fileNameBuf);
}

export function SetConfigFlags(flags: ConfigFlags): void {
  lib.SetConfigFlags(flags);
}

export function OpenURL(url: string): void {
  const urlBuf = new TextEncoder().encode(url + "\0");
  lib.OpenURL(urlBuf);
}

export function isFileDropped(): boolean {
  return !!lib.IsFileDropped();
}

export function LoadDroppedFiles(): string[] {
  const result = lib.LoadDroppedFiles();

  const view = new DataView(result.buffer);
  const length = view.getUint32(4, littleEndian);
  const pointer = Deno.UnsafePointer.create(
    view.getBigInt64(8, littleEndian),
  );

  const pointerView = new Deno.UnsafePointerView(pointer!);

  const list: string[] = [];
  for (let i = 0; i < length; i++) {
    const stringPointer = pointerView.getPointer(i * 8);
    const stringView = new Deno.UnsafePointerView(stringPointer!);
    list.push(stringView.getCString());
  }

  lib.UnloadDroppedFiles(result);

  return list;
}

export function LoadAutomationEventList(file: string): AutomationEventList {
  return new AutomationEventList(
    lib.LoadAutomationEventList(new TextEncoder().encode(file + "\0")),
  );
}

export function UnloadAutomationEventList(
  eventList: AutomationEventList,
): void {
  lib.UnloadAutomationEventList(eventList.buffer);
}

export function ExportAutomationEventList(
  eventList: AutomationEventList,
  file: string,
): void {
  lib.ExportAutomationEventList(
    eventList.buffer,
    new TextEncoder().encode(file + "\0"),
  );
}

export function SetAutomationEventList(eventList: AutomationEventList): void {
  lib.SetAutomationEventList(Deno.UnsafePointer.of(eventList.buffer));
}

export function SetAutomationEventBaseFrame(frame: int): void {
  lib.SetAutomationEventBaseFrame(frame);
}

export function StartAutomationEventRecording(): void {
  lib.StartAutomationEventRecording();
}

export function StopAutomationEventRecording(): void {
  lib.StopAutomationEventRecording();
}

export function PlayAutomationEvent(event: AutomationEvent): void {
  lib.PlayAutomationEvent(event.buffer);
}

export function IsKeyPressed(key: KeyboardKey): boolean {
  return !!lib.IsKeyPressed(key);
}

export function IsKeyDown(key: KeyboardKey): boolean {
  return !!lib.IsKeyDown(key);
}

export function IsKeyReleased(key: KeyboardKey): boolean {
  return !!lib.IsKeyReleased(key);
}

export function IsKeyUp(key: KeyboardKey): boolean {
  return !!lib.IsKeyUp(key);
}

export function GetKeyPressed(): KeyboardKey {
  return lib.GetKeyPressed();
}

export function GetCharPressed(): string {
  const char = lib.GetCharPressed(); // returns a number
  return String.fromCharCode(char);
}

export function SetExitKey(key: KeyboardKey): void {
  lib.SetExitKey(key);
}

export function IsGamepadAvailable(gamepad: int): boolean {
  return !!lib.IsGamepadAvailable(gamepad);
}

export function GetGamepadName(gamepad: int): string {
  const name = lib.GetGamepadName(gamepad) as unknown as BufferSource;
  return new TextDecoder().decode(name);
}

export function IsGamepadButtonPressed(
  gamepad: int,
  button: GamepadButton,
): boolean {
  return !!lib.IsGamepadButtonPressed(gamepad, button);
}

export function IsGamepadButtonReleased(
  gamepad: int,
  button: GamepadButton,
): boolean {
  return !!lib.IsGamepadButtonReleased(gamepad, button);
}

export function IsGamepadButtonUp(
  gamepad: int,
  button: GamepadButton,
): boolean {
  return !!lib.IsGamepadButtonUp(gamepad, button);
}

export function IsGamepadButtonDown(
  gamepad: int,
  button: GamepadButton,
): boolean {
  return !!lib.IsGamepadButtonDown(gamepad, button);
}

export function GetGamepadButtonPressed(): GamepadButton {
  return lib.GetGamepadButtonPressed();
}

export function GetGamepadAxisCount(gamepad: int): int {
  return lib.GetGamepadAxisCount(gamepad);
}

export function GetGamepadAxisMovement(gamepad: int, axis: GamepadAxis): float {
  return lib.GetGamepadAxisMovement(gamepad, axis);
}

export function SetGamepadMappings(mappings: string): void {
  lib.SetGamepadMappings(new TextEncoder().encode(mappings + "\0"));
}

export function SetGamepadVibration(
  gamepad: int,
  leftVibration: float,
  rightVibration: float,
  duration: int,
): void {
  lib.SetGamepadVibration(gamepad, leftVibration, rightVibration, duration);
}

export function IsMouseButtonPressed(button: MouseButton): boolean {
  return !!lib.IsMouseButtonPressed(button);
}

export function IsMouseButtonDown(button: MouseButton): boolean {
  return !!lib.IsMouseButtonDown(button);
}

export function IsMouseButtonReleased(button: MouseButton): boolean {
  return !!lib.IsMouseButtonReleased(button);
}

export function IsMouseButtonUp(button: MouseButton): boolean {
  return !!lib.IsMouseButtonUp(button);
}

export function GetMouseX(): int {
  return lib.GetMouseX();
}

export function GetMouseY(): int {
  return lib.GetMouseY();
}

export function GetMousePosition(): Vector2 {
  const buffer = lib.GetMousePosition();
  const view = new DataView(buffer.buffer);
  const x = view.getFloat32(0);
  const y = view.getFloat32(4);
  return new Vector2(x, y);
}

export function GetMouseDelta(): Vector2 {
  const buffer = lib.GetMouseDelta();
  const view = new DataView(buffer.buffer);
  const x = view.getFloat32(0);
  const y = view.getFloat32(4);
  return new Vector2(x, y);
}

export function SetMousePosition(x: int, y: int): void {
  lib.SetMousePosition(x, y);
}

export function SetMouseOffset(offsetX: int, offsetY: int): void {
  lib.SetMouseOffset(offsetX, offsetY);
}

export function SetMouseScale(scaleX: float, scaleY: float): void {
  lib.SetMouseScale(scaleX, scaleY);
}

export function GetMouseWheelMove(): float {
  return lib.GetMouseWheelMove();
}

export function GetMouseWheelMoveV(): Vector2 {
  const buffer = lib.GetMouseWheelMoveV();
  const view = new DataView(buffer.buffer);
  const x = view.getFloat32(0);
  const y = view.getFloat32(4);
  return new Vector2(x, y);
}

export function SetMouseCursor(cursor: MouseCursor): void {
  lib.SetMouseCursor(cursor);
}

export function GetTouchX(): int {
  return lib.GetTouchX();
}

export function GetTouchY(): int {
  return lib.GetTouchY();
}

export function GetTouchPosition(index: int): Vector2 {
  const buffer = lib.GetTouchPosition(index);
  const view = new DataView(buffer.buffer);
  const x = view.getFloat32(0);
  const y = view.getFloat32(4);
  return new Vector2(x, y);
}

export function GetTouchPointId(index: int): int {
  return lib.GetTouchPointId(index);
}

export function GetTouchPointCount(): int {
  return lib.GetTouchPointCount();
}

export function SetGesturesEnabled(flags: Gesture): void {
  lib.SetGesturesEnabled(flags);
}

export function IsGestureDetected(gesture: Gesture): boolean {
  return !!lib.IsGestureDetected(gesture);
}

export function GetGestureHoldDuration(): float {
  return lib.GetGestureHoldDuration();
}

export function GetGestureDragVector(): Vector2 {
  const buffer = lib.GetGestureDragVector();
  const view = new DataView(buffer.buffer);
  const x = view.getFloat32(0);
  const y = view.getFloat32(4);
  return new Vector2(x, y);
}

export function GetGestureDragAngle(): float {
  return lib.GetGestureDragAngle();
}

export function GetGesturePinchVector(): Vector2 {
  const buffer = lib.GetGesturePinchVector();
  const view = new DataView(buffer.buffer);
  const x = view.getFloat32(0);
  const y = view.getFloat32(4);
  return new Vector2(x, y);
}

export function GetGesturePinchAngle(): float {
  return lib.GetGesturePinchAngle();
}

export function UpdateCamera(camera: Camera, mode: CameraMode): void {
  lib.UpdateCamera(camera.buffer, mode);
}

export function UpdateCameraPro(
  camera: Camera,
  movement: Vector3,
  rotation: Vector3,
  zoom: float,
): void {
  lib.UpdateCameraPro(
    camera.buffer,
    movement.buffer,
    rotation.buffer,
    zoom,
  );
}

export function SetShapesTexture(texture: Texture2D, source: Rectangle): void {
  lib.SetShapesTexture(texture.buffer, source.buffer);
}

export function GetShapesTexture(): Texture2D {
  const buffer = lib.GetShapesTexture();
  return new Texture2D(buffer);
}

export function GetShapesTextureRectangle(): Rectangle {
  const buffer = lib.GetShapesTextureRectangle();
  const view = new DataView(buffer.buffer);
  const x = view.getFloat32(0);
  const y = view.getFloat32(4);
  const width = view.getFloat32(8);
  const height = view.getFloat32(12);
  return new Rectangle(x, y, width, height);
}

export function DrawPixel(posX: int, posY: int, color: Color): void {
  lib.DrawPixel(posX, posY, color.buffer);
}

export function DrawPixelV(position: Vector2, color: Color): void {
  lib.DrawPixelV(position.buffer, color.buffer);
}

export function DrawLine(
  posX: int,
  posY: int,
  endX: int,
  endY: int,
  color: Color,
): void {
  lib.DrawLine(posX, posY, endX, endY, color.buffer);
}

export function DrawLineV(
  startPos: Vector2,
  endPos: Vector2,
  color: Color,
): void {
  lib.DrawLineV(startPos.buffer, endPos.buffer, color.buffer);
}

export function DrawLineEx(
  startPos: Vector2,
  endPos: Vector2,
  thickness: float,
  color: Color,
): void {
  lib.DrawLineEx(startPos.buffer, endPos.buffer, thickness, color.buffer);
}

export function DrawLineStrip(points: Vector2[], color: Color): void {
  const line_strip_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    line_strip_buffer[i * 2] = points[i].x;
    line_strip_buffer[i * 2 + 1] = points[i].y;
  }
  const line_ptr = Deno.UnsafePointer.of(line_strip_buffer.buffer);
  lib.DrawLineStrip(line_ptr, points.length, color.buffer);
}

export function DrawLineBezier(
  startPos: Vector2,
  endPos: Vector2,
  thickness: float,
  color: Color,
): void {
  lib.DrawLineBezier(startPos.buffer, endPos.buffer, thickness, color.buffer);
}

export function DrawCircle(
  posX: int,
  posY: int,
  radius: int,
  color: Color,
): void {
  lib.DrawCircle(posX, posY, radius, color.buffer);
}

export function DrawCircleSector(
  center: Vector2,
  radius: int,
  startAngle: float,
  endAngle: float,
  segments: int,
  color: Color,
): void {
  lib.DrawCircleSector(
    center.buffer,
    radius,
    startAngle,
    endAngle,
    segments,
    color.buffer,
  );
}

export function DrawCircleSectorLines(
  center: Vector2,
  radius: int,
  startAngle: float,
  endAngle: float,
  segments: int,
  color: Color,
): void {
  lib.DrawCircleSectorLines(
    center.buffer,
    radius,
    startAngle,
    endAngle,
    segments,
    color.buffer,
  );
}

export function DrawCircleGradient(
  centerX: int,
  centerY: int,
  radius: int,
  startColor: Color,
  endColor: Color,
): void {
  lib.DrawCircleGradient(
    centerX,
    centerY,
    radius,
    startColor.buffer,
    endColor.buffer,
  );
}

export function DrawCircleV(center: Vector2, radius: int, color: Color): void {
  lib.DrawCircleV(center.buffer, radius, color.buffer);
}

export function DrawCircleLines(
  centerX: int,
  centerY: int,
  radius: int,
  color: Color,
): void {
  lib.DrawCircleLines(centerX, centerY, radius, color.buffer);
}

export function DrawCircleLinesV(
  center: Vector2,
  radius: int,
  color: Color,
): void {
  lib.DrawCircleLinesV(center.buffer, radius, color.buffer);
}

export function DrawEllipse(
  centerX: int,
  centerY: int,
  radiusX: int,
  radiusY: int,
  color: Color,
): void {
  lib.DrawEllipse(centerX, centerY, radiusX, radiusY, color.buffer);
}

export function DrawEllipseLines(
  centerX: int,
  centerY: int,
  radiusX: int,
  radiusY: int,
  color: Color,
): void {
  lib.DrawEllipseLines(centerX, centerY, radiusX, radiusY, color.buffer);
}

export function DrawRing(
  center: Vector2,
  innerRadius: int,
  outerRadius: int,
  startAngle: float,
  endAngle: float,
  segments: int,
  color: Color,
): void {
  lib.DrawRing(
    center.buffer,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    segments,
    color.buffer,
  );
}

export function DrawRingLines(
  center: Vector2,
  innerRadius: int,
  outerRadius: int,
  startAngle: float,
  endAngle: float,
  segments: int,
  color: Color,
): void {
  lib.DrawRingLines(
    center.buffer,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    segments,
    color.buffer,
  );
}

export function DrawRectangle(
  posX: int,
  posY: int,
  width: int,
  height: int,
  color: Color,
): void {
  lib.DrawRectangle(posX, posY, width, height, color.buffer);
}

export function DrawRectangleV(
  position: Vector2,
  size: Vector2,
  color: Color,
): void {
  lib.DrawRectangleV(position.buffer, size.buffer, color.buffer);
}

export function DrawRectangleRec(
  rec: Rectangle,
  color: Color,
): void {
  lib.DrawRectangleRec(rec.buffer, color.buffer);
}

export function DrawRectanglePro(
  rec: Rectangle,
  origin: Vector2,
  rotation: float,
  color: Color,
): void {
  lib.DrawRectanglePro(rec.buffer, origin.buffer, rotation, color.buffer);
}

export function DrawRectangleGradientV(
  posX: int,
  posY: int,
  width: int,
  height: int,
  color1: Color,
  color2: Color,
): void {
  lib.DrawRectangleGradientV(
    posX,
    posY,
    width,
    height,
    color1.buffer,
    color2.buffer,
  );
}

export function DrawRectangleGradientH(
  posX: int,
  posY: int,
  width: int,
  height: int,
  color1: Color,
  color2: Color,
): void {
  lib.DrawRectangleGradientH(
    posX,
    posY,
    width,
    height,
    color1.buffer,
    color2.buffer,
  );
}

export function DrawRectangleGradientEx(
  rec: Rectangle,
  col1: Color,
  col2: Color,
  col3: Color,
  col4: Color,
): void {
  lib.DrawRectangleGradientEx(
    rec.buffer,
    col1.buffer,
    col2.buffer,
    col3.buffer,
    col4.buffer,
  );
}

export function DrawRectangleLines(
  posX: int,
  posY: int,
  width: int,
  height: int,
  color: Color,
): void {
  lib.DrawRectangleLines(posX, posY, width, height, color.buffer);
}

export function DrawRectangleLinesEx(
  rec: Rectangle,
  lineThick: int,
  color: Color,
): void {
  lib.DrawRectangleLinesEx(rec.buffer, lineThick, color.buffer);
}

export function DrawRectangleRounded(
  rec: Rectangle,
  radius: float,
  segments: int,
  color: Color,
): void {
  lib.DrawRectangleRounded(rec.buffer, radius, segments, color.buffer);
}

export function DrawRectangleRoundedLines(
  rec: Rectangle,
  radius: float,
  segments: int,
  color: Color,
): void {
  lib.DrawRectangleRoundedLines(rec.buffer, radius, segments, color.buffer);
}

export function DrawRectangleRoundedLinesEx(
  rec: Rectangle,
  radius: float,
  segments: int,
  lineThick: int,
  color: Color,
): void {
  lib.DrawRectangleRoundedLinesEx(
    rec.buffer,
    radius,
    segments,
    lineThick,
    color.buffer,
  );
}

export function DrawTriangle(
  v1: Vector2,
  v2: Vector2,
  v3: Vector2,
  color: Color,
): void {
  const cross = (v2.x - v1.x) * (v3.y - v1.y) -
    (v2.y - v1.y) * (v3.x - v1.x);

  // If clockwise, swap v2 and v3
  if (cross < 0) {
    lib.DrawTriangle(v1.buffer, v3.buffer, v2.buffer, color.buffer);
  } else {
    lib.DrawTriangle(v1.buffer, v2.buffer, v3.buffer, color.buffer);
  }
}

export function DrawTriangleLines(
  v1: Vector2,
  v2: Vector2,
  v3: Vector2,
  color: Color,
): void {
  const cross = (v2.x - v1.x) * (v3.y - v1.y) -
    (v2.y - v1.y) * (v3.x - v1.x);

  if (cross < 0) {
    lib.DrawTriangleLines(v1.buffer, v3.buffer, v2.buffer, color.buffer);
  } else {
    lib.DrawTriangleLines(v1.buffer, v2.buffer, v3.buffer, color.buffer);
  }
}

export function DrawTriangleFan(
  points: Vector2[],
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = Deno.UnsafePointer.of(points_buffer.buffer);
  lib.DrawTriangleFan(points_ptr, points.length, color.buffer);
}

export function DrawTriangleStrip(
  points: Vector2[],
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = Deno.UnsafePointer.of(points_buffer.buffer);
  lib.DrawTriangleStrip(points_ptr, points.length, color.buffer);
}

export function DrawPoly(
  center: Vector2,
  sides: int,
  radius: float,
  rotation: float,
  color: Color,
): void {
  lib.DrawPoly(center.buffer, sides, radius, rotation, color.buffer);
}

export function DrawPolyLines(
  center: Vector2,
  sides: int,
  radius: float,
  rotation: float,
  color: Color,
): void {
  lib.DrawPolyLines(center.buffer, sides, radius, rotation, color.buffer);
}

export function DrawPolyLinesEx(
  center: Vector2,
  sides: int,
  radius: float,
  rotation: float,
  lineThick: int,
  color: Color,
): void {
  lib.DrawPolyLinesEx(
    center.buffer,
    sides,
    radius,
    rotation,
    lineThick,
    color.buffer,
  );
}

export function DrawSplineLinear(
  points: Vector2[],
  thickness: int,
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = Deno.UnsafePointer.of(points_buffer.buffer);
  lib.DrawSplineLinear(points_ptr, points.length, thickness, color.buffer);
}

export function DrawSplineBasis(
  points: Vector2[],
  thickness: int,
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = Deno.UnsafePointer.of(points_buffer.buffer);
  lib.DrawSplineBasis(points_ptr, points.length, thickness, color.buffer);
}

export function DrawSplineCatmullRom(
  points: Vector2[],
  thickness: int,
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = Deno.UnsafePointer.of(points_buffer.buffer);
  lib.DrawSplineCatmullRom(points_ptr, points.length, thickness, color.buffer);
}

export function DrawSplineBezierQuadratic(
  points: Vector2[],
  thickness: int,
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = Deno.UnsafePointer.of(points_buffer.buffer);
  lib.DrawSplineBezierQuadratic(
    points_ptr,
    points.length,
    thickness,
    color.buffer,
  );
}

export function DrawSplineBezierCubic(
  points: Vector2[],
  thickness: int,
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = Deno.UnsafePointer.of(points_buffer.buffer);
  lib.DrawSplineBezierCubic(points_ptr, points.length, thickness, color.buffer);
}

export function DrawSplineSegmentLinear(
  pos1: Vector2,
  pos2: Vector2,
  thickness: int,
  color: Color,
): void {
  lib.DrawSplineSegmentLinear(
    pos1.buffer,
    pos2.buffer,
    thickness,
    color.buffer,
  );
}

export function DrawSplineSegmentBasis(
  pos1: Vector2,
  pos2: Vector2,
  pos3: Vector2,
  pos4: Vector2,
  thickness: int,
  color: Color,
): void {
  lib.DrawSplineSegmentBasis(
    pos1.buffer,
    pos2.buffer,
    pos3.buffer,
    pos4.buffer,
    thickness,
    color.buffer,
  );
}

export function DrawSplineSegmentCatmullRom(
  pos1: Vector2,
  pos2: Vector2,
  pos3: Vector2,
  pos4: Vector2,
  thickness: int,
  color: Color,
): void {
  lib.DrawSplineSegmentCatmullRom(
    pos1.buffer,
    pos2.buffer,
    pos3.buffer,
    pos4.buffer,
    thickness,
    color.buffer,
  );
}

export function DrawSplineSegmentBezierQuadratic(
  pos1: Vector2,
  pos2: Vector2,
  pos3: Vector2,
  thickness: int,
  color: Color,
): void {
  lib.DrawSplineSegmentBezierQuadratic(
    pos1.buffer,
    pos2.buffer,
    pos3.buffer,
    thickness,
    color.buffer,
  );
}

export function DrawSplineSegmentBezierCubic(
  pos1: Vector2,
  pos2: Vector2,
  pos3: Vector2,
  pos4: Vector2,
  thickness: int,
  color: Color,
): void {
  lib.DrawSplineSegmentBezierCubic(
    pos1.buffer,
    pos2.buffer,
    pos3.buffer,
    pos4.buffer,
    thickness,
    color.buffer,
  );
}

export function GetSplinePointLinear(
  startPos: Vector2,
  endPos: Vector2,
  t: float,
): Vector2 {
  const buf = lib.GetSplinePointLinear(
    startPos.buffer,
    endPos.buffer,
    t,
  );
  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, littleEndian);
  const y = view.getFloat32(4, littleEndian);
  return new Vector2(x, y);
}

export function GetSplinePointBasis(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  p4: Vector2,
  t: float,
): Vector2 {
  const buf = lib.GetSplinePointBasis(
    p1.buffer,
    p2.buffer,
    p3.buffer,
    p4.buffer,
    t,
  );
  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, littleEndian);
  const y = view.getFloat32(4, littleEndian);
  return new Vector2(x, y);
}

export function GetSplinePointCatmullRom(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  p4: Vector2,
  t: float,
): Vector2 {
  const buf = lib.GetSplinePointCatmullRom(
    p1.buffer,
    p2.buffer,
    p3.buffer,
    p4.buffer,
    t,
  );
  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, littleEndian);
  const y = view.getFloat32(4, littleEndian);
  return new Vector2(x, y);
}

export function GetSplinePointBezierQuad(
  p1: Vector2,
  c2: Vector2,
  p3: Vector2,
  t: float,
): Vector2 {
  const buf = lib.GetSplinePointBezierQuad(
    p1.buffer,
    c2.buffer,
    p3.buffer,
    t,
  );
  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, littleEndian);
  const y = view.getFloat32(4, littleEndian);
  return new Vector2(x, y);
}

export function GetSplinePointBezierCubic(
  p1: Vector2,
  c2: Vector2,
  c3: Vector2,
  p4: Vector2,
  t: float,
): Vector2 {
  const buf = lib.GetSplinePointBezierCubic(
    p1.buffer,
    c2.buffer,
    c3.buffer,
    p4.buffer,
    t,
  );
  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, littleEndian);
  const y = view.getFloat32(4, littleEndian);
  return new Vector2(x, y);
}

export function CheckCollisionRecs(rec1: Rectangle, rec2: Rectangle): boolean {
  return !!lib.CheckCollisionRecs(rec1.buffer, rec2.buffer);
}

export function CheckCollisionCircles(
  center1: Vector2,
  radius1: float,
  center2: Vector2,
  radius2: float,
): boolean {
  return !!lib.CheckCollisionCircles(
    center1.buffer,
    radius1,
    center2.buffer,
    radius2,
  );
}

export function CheckCollisionCircleRec(
  center: Vector2,
  radius: float,
  rec: Rectangle,
): boolean {
  return !!lib.CheckCollisionCircleRec(
    center.buffer,
    radius,
    rec.buffer,
  );
}

export function CheckCollisionCircleLine(
  center: Vector2,
  radius: float,
  p1: Vector2,
  p2: Vector2,
): boolean {
  return !!lib.CheckCollisionCircleLine(
    center.buffer,
    radius,
    p1.buffer,
    p2.buffer,
  );
}

export function CheckCollisionPointRec(
  point: Vector2,
  rec: Rectangle,
): boolean {
  return !!lib.CheckCollisionPointRec(point.buffer, rec.buffer);
}

export function CheckCollisionPointCircle(
  point: Vector2,
  center: Vector2,
  radius: float,
): boolean {
  return !!lib.CheckCollisionPointCircle(
    point.buffer,
    center.buffer,
    radius,
  );
}

export function CheckCollisionPointTriangle(
  point: Vector2,
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
): boolean {
  return !!lib.CheckCollisionPointTriangle(
    point.buffer,
    p1.buffer,
    p2.buffer,
    p3.buffer,
  );
}

export function CheckCollisionPointLine(
  point: Vector2,
  p1: Vector2,
  p2: Vector2,
  threshold: int,
): boolean {
  return !!lib.CheckCollisionPointLine(
    point.buffer,
    p1.buffer,
    p2.buffer,
    threshold,
  );
}

export function CheckCollisionPointPoly(
  point: Vector2,
  points: Vector2[],
): boolean {
  const count = points.length;
  if (count === 0) return false;

  const pts = concatVector2(points);

  return !!lib.CheckCollisionPointPoly(
    point.buffer,
    Deno.UnsafePointer.of(pts.buffer),
    count,
  );
}

export function CheckCollisionLines(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  p4: Vector2,
  collisionPoint: Vector2,
): boolean {
  return !!lib.CheckCollisionLines(
    p1.buffer,
    p2.buffer,
    p3.buffer,
    p4.buffer,
    Deno.UnsafePointer.of(collisionPoint.buffer),
  );
}

export function GetCollisionRec(rec1: Rectangle, rec2: Rectangle): Rectangle {
  const buf = lib.GetCollisionRec(rec1.buffer, rec2.buffer);
  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, littleEndian);
  const y = view.getFloat32(4, littleEndian);
  const width = view.getFloat32(8, littleEndian);
  const height = view.getFloat32(12, littleEndian);
  return new Rectangle(x, y, width, height);
}

export function LoadImage(file: string): Image {
  return new Image(lib.LoadImage(new TextEncoder().encode(file + "\0")));
}

export function LoadImageRaw(
  file: string,
  width: int,
  height: int,
  format: int,
  headerSize: int,
): Image {
  return new Image(
    lib.LoadImageRaw(
      new TextEncoder().encode(file + "\0"),
      width,
      height,
      format,
      headerSize,
    ),
  );
}

export function LoadImageAnim(file: string): { image: Image; frames: number } {
  const framesBuf = new Int32Array(1);

  const image = new Image(
    lib.LoadImageAnim(
      new TextEncoder().encode(file + "\0"),
      Deno.UnsafePointer.of(framesBuf.buffer),
    ),
  );

  return {
    image,
    frames: framesBuf[0],
  };
}

export function LoadImageAnimFromMemory(
  fileType: string,
  fileData: string,
  dataSize: int,
): { image: Image; frames: number } {
  const framesBuf = new Int32Array(1);

  const image = new Image(
    lib.LoadImageAnimFromMemory(
      new TextEncoder().encode(fileType + "\0"),
      new TextEncoder().encode(fileData + "\0"),
      dataSize,
      Deno.UnsafePointer.of(framesBuf.buffer),
    ),
  );

  return {
    image,
    frames: framesBuf[0],
  };
}

export function LoadImageFromMemory(
  fileType: string,
  fileData: string,
  dataSize: int,
): Image {
  return new Image(
    lib.LoadImageFromMemory(
      new TextEncoder().encode(fileType + "\0"),
      new TextEncoder().encode(fileData + "\0"),
      dataSize,
    ),
  );
}

export function LoadImageFromTexture(texture: Texture2D): Image {
  return new Image(lib.LoadImageFromTexture(texture.buffer));
}

export function LoadImageFromScreen(): Image {
  return new Image(lib.LoadImageFromScreen());
}

export function IsImageValid(image: Image): boolean {
  return !!lib.IsImageValid(image.buffer);
}

export function UnloadImage(image: Image): void {
  lib.UnloadImage(image.buffer);
}

export function ExportImageToMemory(
  image: Image,
  fileType: string,
): { data: Uint8Array; dataSize: number } {
  const sizeBuf = new Int32Array(1);

  const ptr = lib.ExportImageToMemory(
    image.buffer,
    new TextEncoder().encode(fileType + "\0"),
    Deno.UnsafePointer.of(sizeBuf.buffer),
  );

  if (ptr === null) {
    throw new Error("ExportImageToMemory failed");
  }

  const size = sizeBuf[0];
  const view = new Deno.UnsafePointerView(ptr);
  const buffer = view.getArrayBuffer(size);
  const data = new Uint8Array(buffer);

  return {
    data,
    dataSize: size,
  };
}

export function ExportImageAsCode(image: Image, file: string): boolean {
  return !!lib.ExportImageAsCode(
    image.buffer,
    new TextEncoder().encode(file + "\0"),
  );
}

export function GenImageColor(
  width: int,
  height: int,
  color: Color,
): Image {
  return new Image(
    lib.GenImageColor(
      width,
      height,
      color.buffer,
    ),
  );
}

export function GenImageGradientLinear(
  width: int,
  height: int,
  direction: int,
  start: Color,
  end: Color,
): Image {
  return new Image(
    lib.GenImageGradientLinear(
      width,
      height,
      direction,
      start.buffer,
      end.buffer,
    ),
  );
}

export function GenImageGradientRadial(
  width: int,
  height: int,
  density: float,
  inner: Color,
  outer: Color,
): Image {
  return new Image(
    lib.GenImageGradientRadial(
      width,
      height,
      density,
      inner.buffer,
      outer.buffer,
    ),
  );
}

export function GenImageGradientSquare(
  width: int,
  height: int,
  density: float,
  inner: Color,
  outer: Color,
): Image {
  return new Image(
    lib.GenImageGradientSquare(
      width,
      height,
      density,
      inner.buffer,
      outer.buffer,
    ),
  );
}

export function GenImageChecked(
  width: int,
  height: int,
  checksX: int,
  checksY: int,
  col1: Color,
  col2: Color,
): Image {
  return new Image(
    lib.GenImageChecked(
      width,
      height,
      checksX,
      checksY,
      col1.buffer,
      col2.buffer,
    ),
  );
}

export function GenImageWhiteNoise(
  width: int,
  height: int,
  factor: float,
): Image {
  return new Image(
    lib.GenImageWhiteNoise(
      width,
      height,
      factor,
    ),
  );
}

export function GenImagePerlinNoise(
  width: int,
  height: int,
  offsetX: int,
  offsetY: int,
  scale: float,
): Image {
  return new Image(
    lib.GenImagePerlinNoise(
      width,
      height,
      offsetX,
      offsetY,
      scale,
    ),
  );
}

export function GenImageCellular(
  width: int,
  height: int,
  tileSize: int,
): Image {
  return new Image(
    lib.GenImageCellular(
      width,
      height,
      tileSize,
    ),
  );
}

export function GenImageText(
  width: int,
  height: int,
  text: string,
): Image {
  return new Image(
    lib.GenImageText(
      width,
      height,
      new TextEncoder().encode(text + "\0").buffer,
    ),
  );
}

export function ImageCopy(
  image: Image,
): Image {
  return new Image(
    lib.ImageCopy(
      image.buffer,
    ),
  );
}

export function ImageFromImage(
  image: Image,
  rec: Rectangle,
): Image {
  return new Image(
    lib.ImageFromImage(
      image.buffer,
      rec.buffer,
    ),
  );
}

export function ImageFromChannel(
  image: Image,
  selectedChannel: int,
): Image {
  return new Image(
    lib.ImageFromChannel(
      image.buffer,
      selectedChannel,
    ),
  );
}

export function ImageText(
  text: string,
  fontSize: int,
  color: Color,
): Image {
  return new Image(
    lib.ImageText(
      new TextEncoder().encode(text + "\0").buffer,
      fontSize,
      color.buffer,
    ),
  );
}

export function ImageTextEx(
  font: Font,
  text: string,
  fontSize: float,
  spacing: float,
  tint: Color,
): Image {
  return new Image(
    lib.ImageTextEx(
      font.buffer,
      new TextEncoder().encode(text + "\0").buffer,
      fontSize,
      spacing,
      tint.buffer,
    ),
  );
}

export function ImageFormat(
  image: Image,
  newFormat: int,
): void {
  lib.ImageFormat(
    Deno.UnsafePointer.of(image.buffer),
    newFormat,
  );
}

export function ImageToPOT(
  image: Image,
  fill: Color,
): void {
  lib.ImageToPOT(
    Deno.UnsafePointer.of(image.buffer),
    fill.buffer,
  );
}

export function ImageCrop(
  image: Image,
  crop: Rectangle,
): void {
  lib.ImageCrop(
    Deno.UnsafePointer.of(image.buffer),
    crop.buffer,
  );
}

export function ImageAlphaCrop(
  image: Image,
  threshold: float,
): void {
  lib.ImageAlphaCrop(
    Deno.UnsafePointer.of(image.buffer),
    threshold,
  );
}

export function ImageAlphaClear(
  image: Image,
  color: Color,
  threshold: float,
): void {
  lib.ImageAlphaClear(
    Deno.UnsafePointer.of(image.buffer),
    color.buffer,
    threshold,
  );
}

export function ImageAlphaMask(
  image: Image,
  alphaMask: Image,
): void {
  lib.ImageAlphaMask(
    Deno.UnsafePointer.of(image.buffer),
    alphaMask.buffer,
  );
}

export function ImageAlphaPremultiply(
  image: Image,
): void {
  lib.ImageAlphaPremultiply(
    Deno.UnsafePointer.of(image.buffer),
  );
}

export function ImageBlurGaussian(
  image: Image,
  blurSize: int,
): void {
  lib.ImageBlurGaussian(
    Deno.UnsafePointer.of(image.buffer),
    blurSize,
  );
}

export function ImageKernelConvolution(
  image: Image,
  kernel: Float32Array,
  kernelSize: int,
): void {
  lib.ImageKernelConvolution(
    Deno.UnsafePointer.of(image.buffer),
    Deno.UnsafePointer.of(kernel.buffer as ArrayBuffer),
    kernelSize,
  );
}

export function ImageResize(
  image: Image,
  newWidth: int,
  newHeight: int,
): void {
  lib.ImageResize(
    Deno.UnsafePointer.of(image.buffer),
    newWidth,
    newHeight,
  );
}

export function ImageResizeNN(
  image: Image,
  newWidth: int,
  newHeight: int,
): void {
  lib.ImageResizeNN(
    Deno.UnsafePointer.of(image.buffer),
    newWidth,
    newHeight,
  );
}

export function ImageResizeCanvas(
  image: Image,
  newWidth: int,
  newHeight: int,
  offsetX: int,
  offsetY: int,
  fill: Color,
): void {
  lib.ImageResizeCanvas(
    Deno.UnsafePointer.of(image.buffer),
    newWidth,
    newHeight,
    offsetX,
    offsetY,
    fill.buffer,
  );
}

export function ImageMipmaps(
  image: Image,
): void {
  lib.ImageMipmaps(
    Deno.UnsafePointer.of(image.buffer),
  );
}

export function ImageDither(
  image: Image,
  rBpp: int,
  gBpp: int,
  bBpp: int,
  aBpp: int,
): void {
  lib.ImageDither(
    Deno.UnsafePointer.of(image.buffer),
    rBpp,
    gBpp,
    bBpp,
    aBpp,
  );
}

export function ImageFlipVertical(
  image: Image,
): void {
  lib.ImageFlipVertical(
    Deno.UnsafePointer.of(image.buffer),
  );
}

export function ImageFlipHorizontal(
  image: Image,
): void {
  lib.ImageFlipHorizontal(
    Deno.UnsafePointer.of(image.buffer),
  );
}

export function ImageRotate(
  image: Image,
  degrees: int,
): void {
  lib.ImageRotate(
    Deno.UnsafePointer.of(image.buffer),
    degrees,
  );
}

export function ImageRotateCW(
  image: Image,
): void {
  lib.ImageRotateCW(
    Deno.UnsafePointer.of(image.buffer),
  );
}

export function ImageRotateCCW(
  image: Image,
): void {
  lib.ImageRotateCCW(
    Deno.UnsafePointer.of(image.buffer),
  );
}

export function ImageColorTint(
  image: Image,
  color: Color,
): void {
  lib.ImageColorTint(
    Deno.UnsafePointer.of(image.buffer),
    color.buffer,
  );
}

export function ImageColorInvert(
  image: Image,
): void {
  lib.ImageColorInvert(
    Deno.UnsafePointer.of(image.buffer),
  );
}

// Image color modification functions (in-place)

export function ImageColorGrayscale(
  image: Image,
): void {
  lib.ImageColorGrayscale(
    Deno.UnsafePointer.of(image.buffer),
  );
}

export function ImageColorContrast(
  image: Image,
  contrast: float,
): void {
  lib.ImageColorContrast(
    Deno.UnsafePointer.of(image.buffer),
    contrast,
  );
}

export function ImageColorBrightness(
  image: Image,
  brightness: int,
): void {
  lib.ImageColorBrightness(
    Deno.UnsafePointer.of(image.buffer),
    brightness,
  );
}

export function ImageColorReplace(
  image: Image,
  color: Color,
  replace: Color,
): void {
  lib.ImageColorReplace(
    Deno.UnsafePointer.of(image.buffer),
    color.buffer,
    replace.buffer,
  );
}

export function LoadImageColors(
  image: Image,
): Uint8Array {
  const ptr = lib.LoadImageColors(image.buffer);
  if (ptr === null) throw new Error("LoadImageColors failed");

  const size = image.width * image.height * 4;
  const view = new Deno.UnsafePointerView(ptr);
  return new Uint8Array(view.getArrayBuffer(size));
}

export function LoadImagePalette(
  image: Image,
  maxPaletteSize: int,
): { colors: Uint8Array; colorCount: int } {
  const countBuf = new Int32Array(1);

  const ptr = lib.LoadImagePalette(
    image.buffer,
    maxPaletteSize,
    Deno.UnsafePointer.of(countBuf.buffer),
  );

  if (ptr === null) throw new Error("LoadImagePalette failed");

  const colorCount = countBuf[0];
  const size = colorCount * 4;
  const view = new Deno.UnsafePointerView(ptr);

  return {
    colors: new Uint8Array(view.getArrayBuffer(size)),
    colorCount,
  };
}

export function UnloadImageColors(
  colorsPtr: Deno.PointerValue,
): void {
  lib.UnloadImageColors(colorsPtr);
}

export function UnloadImagePalette(
  colorsPtr: Deno.PointerValue,
): void {
  lib.UnloadImagePalette(colorsPtr);
}

export function GetImageAlphaBorder(
  image: Image,
  threshold: float,
): Rectangle {
  const buf = lib.GetImageAlphaBorder(
    image.buffer,
    threshold,
  );

  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, true);
  const y = view.getFloat32(4, true);
  const width = view.getFloat32(8, true);
  const height = view.getFloat32(12, true);

  return new Rectangle(x, y, width, height);
}

export function GetImageColor(
  image: Image,
  x: int,
  y: int,
): Color {
  const buf = lib.GetImageColor(
    image.buffer,
    x,
    y,
  );

  const view = new DataView(buf.buffer);
  const r = view.getUint8(0);
  const g = view.getUint8(1);
  const b = view.getUint8(2);
  const a = view.getUint8(3);

  return new Color(r, g, b, a);
}

export function ImageClearBackground(
  dst: Image,
  color: Color,
): void {
  lib.ImageClearBackground(
    Deno.UnsafePointer.of(dst.buffer),
    color.buffer,
  );
}

export function ImageDrawPixel(
  dst: Image,
  posX: int,
  posY: int,
  color: Color,
): void {
  lib.ImageDrawPixel(
    Deno.UnsafePointer.of(dst.buffer),
    posX,
    posY,
    color.buffer,
  );
}

export function ImageDrawPixelV(
  dst: Image,
  position: Vector2,
  color: Color,
): void {
  lib.ImageDrawPixelV(
    Deno.UnsafePointer.of(dst.buffer),
    position.buffer,
    color.buffer,
  );
}

export function ImageDrawLine(
  dst: Image,
  startPosX: int,
  startPosY: int,
  endPosX: int,
  endPosY: int,
  color: Color,
): void {
  lib.ImageDrawLine(
    Deno.UnsafePointer.of(dst.buffer),
    startPosX,
    startPosY,
    endPosX,
    endPosY,
    color.buffer,
  );
}

export function ImageDrawLineV(
  dst: Image,
  start: Vector2,
  end: Vector2,
  color: Color,
): void {
  lib.ImageDrawLineV(
    Deno.UnsafePointer.of(dst.buffer),
    start.buffer,
    end.buffer,
    color.buffer,
  );
}

export function ImageDrawLineEx(
  dst: Image,
  start: Vector2,
  end: Vector2,
  thick: int,
  color: Color,
): void {
  lib.ImageDrawLineEx(
    Deno.UnsafePointer.of(dst.buffer),
    start.buffer,
    end.buffer,
    thick,
    color.buffer,
  );
}

export function ImageDrawCircle(
  dst: Image,
  centerX: int,
  centerY: int,
  radius: int,
  color: Color,
): void {
  lib.ImageDrawCircle(
    Deno.UnsafePointer.of(dst.buffer),
    centerX,
    centerY,
    radius,
    color.buffer,
  );
}

export function ImageDrawCircleV(
  dst: Image,
  center: Vector2,
  radius: int,
  color: Color,
): void {
  lib.ImageDrawCircleV(
    Deno.UnsafePointer.of(dst.buffer),
    center.buffer,
    radius,
    color.buffer,
  );
}

export function ImageDrawCircleLines(
  dst: Image,
  centerX: int,
  centerY: int,
  radius: int,
  color: Color,
): void {
  lib.ImageDrawCircleLines(
    Deno.UnsafePointer.of(dst.buffer),
    centerX,
    centerY,
    radius,
    color.buffer,
  );
}

export function ImageDrawCircleLinesV(
  dst: Image,
  center: Vector2,
  radius: int,
  color: Color,
): void {
  lib.ImageDrawCircleLinesV(
    Deno.UnsafePointer.of(dst.buffer),
    center.buffer,
    radius,
    color.buffer,
  );
}

export function ImageDrawRectangle(
  dst: Image,
  posX: int,
  posY: int,
  width: int,
  height: int,
  color: Color,
): void {
  lib.ImageDrawRectangle(
    Deno.UnsafePointer.of(dst.buffer),
    posX,
    posY,
    width,
    height,
    color.buffer,
  );
}

export function ImageDrawRectangleV(
  dst: Image,
  position: Vector2,
  size: Vector2,
  color: Color,
): void {
  lib.ImageDrawRectangleV(
    Deno.UnsafePointer.of(dst.buffer),
    position.buffer,
    size.buffer,
    color.buffer,
  );
}

export function ImageDrawRectangleRec(
  dst: Image,
  rec: Rectangle,
  color: Color,
): void {
  lib.ImageDrawRectangleRec(
    Deno.UnsafePointer.of(dst.buffer),
    rec.buffer,
    color.buffer,
  );
}

export function ImageDrawRectangleLines(
  dst: Image,
  rec: Rectangle,
  thick: int,
  color: Color,
): void {
  lib.ImageDrawRectangleLines(
    Deno.UnsafePointer.of(dst.buffer),
    rec.buffer,
    thick,
    color.buffer,
  );
}

export function ImageDrawTriangle(
  dst: Image,
  v1: Vector2,
  v2: Vector2,
  v3: Vector2,
  color: Color,
): void {
  lib.ImageDrawTriangle(
    Deno.UnsafePointer.of(dst.buffer),
    v1.buffer,
    v2.buffer,
    v3.buffer,
    color.buffer,
  );
}

export function ImageDrawTriangleEx(
  dst: Image,
  v1: Vector2,
  v2: Vector2,
  v3: Vector2,
  c1: Color,
  c2: Color,
  c3: Color,
): void {
  lib.ImageDrawTriangleEx(
    Deno.UnsafePointer.of(dst.buffer),
    v1.buffer,
    v2.buffer,
    v3.buffer,
    c1.buffer,
    c2.buffer,
    c3.buffer,
  );
}

// Image drawing functions (in-place, Image*)

export function ImageDrawTriangleLines(
  dst: Image,
  v1: Vector2,
  v2: Vector2,
  v3: Vector2,
  color: Color,
): void {
  lib.ImageDrawTriangleLines(
    Deno.UnsafePointer.of(dst.buffer),
    v1.buffer,
    v2.buffer,
    v3.buffer,
    color.buffer,
  );
}

export function ImageDrawTriangleFan(
  dst: Image,
  points: Vector2[],
  pointCount: int,
  color: Color,
): void {
  const ptr = concatVector2(points);

  lib.ImageDrawTriangleFan(
    Deno.UnsafePointer.of(dst.buffer),
    Deno.UnsafePointer.of(ptr),
    pointCount,
    color.buffer,
  );
}

export function ImageDrawTriangleStrip(
  dst: Image,
  points: Vector2[],
  pointCount: int,
  color: Color,
): void {
  const ptr = concatVector2(points);

  lib.ImageDrawTriangleStrip(
    Deno.UnsafePointer.of(dst.buffer),
    Deno.UnsafePointer.of(ptr),
    pointCount,
    color.buffer,
  );
}

export function ImageDraw(
  dst: Image,
  src: Image,
  srcRec: Rectangle,
  dstRec: Rectangle,
  tint: Color,
): void {
  lib.ImageDraw(
    Deno.UnsafePointer.of(dst.buffer),
    src.buffer,
    srcRec.buffer,
    dstRec.buffer,
    tint.buffer,
  );
}

export function ImageDrawText(
  dst: Image,
  text: string,
  posX: int,
  posY: int,
  fontSize: int,
  color: Color,
): void {
  lib.ImageDrawText(
    Deno.UnsafePointer.of(dst.buffer),
    new TextEncoder().encode(text + "\0").buffer,
    posX,
    posY,
    fontSize,
    color.buffer,
  );
}

export function ImageDrawTextEx(
  dst: Image,
  font: Font,
  text: string,
  position: Vector2,
  fontSize: float,
  spacing: float,
  tint: Color,
): void {
  lib.ImageDrawTextEx(
    Deno.UnsafePointer.of(dst.buffer),
    font.buffer,
    new TextEncoder().encode(text + "\0").buffer,
    position.buffer,
    fontSize,
    spacing,
    tint.buffer,
  );
}

export function LoadTexture(file: string): Texture2D {
  return new Texture2D(
    lib.LoadTexture(new TextEncoder().encode(file + "\0").buffer),
  );
}

export function LoadTextureFromImage(image: Image): Texture2D {
  return new Texture2D(lib.LoadTextureFromImage(image.buffer));
}

export function LoadTextureCubemap(image: Image, layout: int): Texture2D {
  return new Texture2D(lib.LoadTextureCubemap(image.buffer, layout));
}

export function LoadRenderTexture(width: int, height: int): RenderTexture {
  return new RenderTexture(lib.LoadRenderTexture(width, height));
}

export function IsTextureValid(texture: Texture2D): boolean {
  return !!lib.IsTextureValid(texture.buffer);
}

export function UnloadTexture(texture: Texture2D): void {
  lib.UnloadTexture(texture.buffer);
}

export function IsRenderTextureValid(texture: RenderTexture): boolean {
  return !!lib.IsRenderTextureValid(texture.buffer);
}

export function UnloadRenderTexture(texture: RenderTexture): void {
  lib.UnloadRenderTexture(texture.buffer);
}

export function UpdateTexture(texture: Texture2D, pixels: Uint8Array): void {
  lib.UpdateTexture(
    texture.buffer,
    Deno.UnsafePointer.of(pixels.buffer as BufferSource),
  );
}

export function UpdateTextureRec(
  texture: Texture2D,
  rec: Rectangle,
  pixels: Uint8Array,
): void {
  lib.UpdateTextureRec(
    texture.buffer,
    rec.buffer,
    Deno.UnsafePointer.of(pixels.buffer as BufferSource),
  );
}

export function GenTextureMipmaps(texture: Texture2D): void {
  lib.GenTextureMipmaps(Deno.UnsafePointer.of(texture.buffer));
}

export function SetTextureFilter(
  texture: Texture2D,
  filter: TextureFilter,
): void {
  lib.SetTextureFilter(texture.buffer, filter);
}

export function SetTextureWrap(texture: Texture2D, wrap: TextureWrap): void {
  lib.SetTextureWrap(texture.buffer, wrap);
}

// Texture drawing functions

export function DrawTexture(
  texture: Texture2D,
  posX: int,
  posY: int,
  tint: Color,
): void {
  lib.DrawTexture(
    texture.buffer,
    posX,
    posY,
    tint.buffer,
  );
}

export function DrawTextureV(
  texture: Texture2D,
  position: Vector2,
  tint: Color,
): void {
  lib.DrawTextureV(
    texture.buffer,
    position.buffer,
    tint.buffer,
  );
}

export function DrawTextureEx(
  texture: Texture2D,
  position: Vector2,
  rotation: float,
  scale: float,
  tint: Color,
): void {
  lib.DrawTextureEx(
    texture.buffer,
    position.buffer,
    rotation,
    scale,
    tint.buffer,
  );
}

export function DrawTextureRec(
  texture: Texture2D,
  source: Rectangle,
  position: Vector2,
  tint: Color,
): void {
  lib.DrawTextureRec(
    texture.buffer,
    source.buffer,
    position.buffer,
    tint.buffer,
  );
}

export function DrawTexturePro(
  texture: Texture2D,
  source: Rectangle,
  dest: Rectangle,
  origin: Vector2,
  rotation: float,
  tint: Color,
): void {
  lib.DrawTexturePro(
    texture.buffer,
    source.buffer,
    dest.buffer,
    origin.buffer,
    rotation,
    tint.buffer,
  );
}

export function DrawTextureNPatch(
  texture: Texture2D,
  nPatchInfo: NPatchInfo,
  dest: Rectangle,
  origin: Vector2,
  rotation: float,
  tint: Color,
): void {
  lib.DrawTextureNPatch(
    texture.buffer,
    nPatchInfo.buffer,
    dest.buffer,
    origin.buffer,
    rotation,
    tint.buffer,
  );
}

export function ColorIsEqual(col1: Color, col2: Color): boolean {
  return !!lib.ColorIsEqual(col1.buffer, col2.buffer);
}

export function Fade(
  color: Color,
  alpha: float,
): Color {
  const buf = lib.Fade(color.buffer, alpha);
  return new Color(buf[0], buf[1], buf[2], buf[3]);
}

export function ColorToInt(color: Color): int {
  return lib.ColorToInt(color.buffer);
}

export function ColorNormalize(color: Color): Vector4 {
  const buf = lib.ColorNormalize(color.buffer);
  return new Vector4(buf[0], buf[1], buf[2], buf[3]);
}

export function ColorFromNormalized(normalized: Vector4): Color {
  const buf = lib.ColorFromNormalized(normalized.buffer);
  return new Color(buf[0], buf[1], buf[2], buf[3]);
}

export function ColorToHSV(color: Color): Vector3 {
  const buf = lib.ColorToHSV(color.buffer);
  return new Vector3(buf[0], buf[1], buf[2]);
}

export function ColorFromHSV(
  hue: float,
  saturation: float,
  value: float,
): Color {
  const buf = lib.ColorFromHSV(hue, saturation, value);
  return new Color(buf[0], buf[1], buf[2], buf[3]);
}

export function ColorTint(color: Color, tint: Color): Color {
  const buf = lib.ColorTint(color.buffer, tint.buffer);
  return new Color(buf[0], buf[1], buf[2], buf[3]);
}

export function ColorBrightness(color: Color, factor: float): Color {
  const buf = lib.ColorBrightness(color.buffer, factor);
  return new Color(buf[0], buf[1], buf[2], buf[3]);
}

export function ColorContrast(color: Color, contrast: float): Color {
  const buf = lib.ColorContrast(color.buffer, contrast);
  return new Color(buf[0], buf[1], buf[2], buf[3]);
}

export function ColorAlpha(color: Color, alpha: float): Color {
  const buf = lib.ColorAlpha(color.buffer, alpha);
  return new Color(buf[0], buf[1], buf[2], buf[3]);
}

export function ColorAlphaBlend(
  dst: Color,
  src: Color,
  tint: Color,
): Color {
  const buf = lib.ColorAlphaBlend(dst.buffer, src.buffer, tint.buffer);
  return new Color(buf[0], buf[1], buf[2], buf[3]);
}

export function ColorLerp(color1: Color, color2: Color, amount: float): Color {
  const buf = lib.ColorLerp(color1.buffer, color2.buffer, amount);
  return new Color(buf[0], buf[1], buf[2], buf[3]);
}

export function GetColor(hex: int): Color {
  const buf = lib.GetColor(hex);
  return new Color(buf[0], buf[1], buf[2], buf[3]);
}

export function GetPixelColor(srcPtr: Uint8Array, format: PixelFormat): Color {
  const buf = lib.GetPixelColor(
    Deno.UnsafePointer.of(srcPtr.buffer as BufferSource),
    format,
  );
  return new Color(buf[0], buf[1], buf[2], buf[3]);
}

export function SetPixelColor(
  dstPtr: Uint8Array,
  color: Color,
  format: PixelFormat,
): void {
  lib.SetPixelColor(
    Deno.UnsafePointer.of(dstPtr.buffer as BufferSource),
    color.buffer,
    format,
  );
}

export function GetPixelDataSize(
  width: int,
  height: int,
  format: PixelFormat,
): int {
  return lib.GetPixelDataSize(width, height, format);
}

export function GetFontDefault(): Font {
  return new Font(lib.GetFontDefault());
}

export function LoadFont(file: string): Font {
  return new Font(
    lib.LoadFont(new TextEncoder().encode(file + "\0")),
  );
}

export function LoadFontEx(
  file: string,
  fontSize: int,
  codepoints: Int32Array | null,
  codepointCount: int,
): Font {
  const cpPtr = codepoints
    ? Deno.UnsafePointer.of(codepoints.buffer as BufferSource)
    : null;

  return new Font(
    lib.LoadFontEx(
      new TextEncoder().encode(file + "\0"),
      fontSize,
      cpPtr,
      codepointCount,
    ),
  );
}

export function LoadFontFromImage(
  image: Image,
  key: Color,
  firstChar: int,
): Font {
  return new Font(
    lib.LoadFontFromImage(image.buffer, key.buffer, firstChar),
  );
}

export function LoadFontFromMemory(
  fileType: string,
  fileData: Uint8Array,
  fontSize: int,
  codepoints: Int32Array | null,
  codepointCount: int,
): Font {
  return new Font(
    lib.LoadFontFromMemory(
      new TextEncoder().encode(fileType + "\0"),
      fileData.buffer as BufferSource,
      fileData.byteLength,
      fontSize,
      (codepoints ?? null) as BufferSource | null,
      codepointCount,
    ),
  );
}

export function IsFontValid(font: Font): boolean {
  return !!lib.IsFontValid(font.buffer);
}

export function LoadFontData(
  fileData: Uint8Array,
  fontSize: number,
  codepoints: Int32Array | null,
  codepointCount: number,
  type: number,
): { glyphs: GlyphInfo[]; ptr: Deno.UnsafePointer } {
  const ptr = lib.LoadFontData(
    fileData.buffer as BufferSource,
    fileData.byteLength,
    fontSize,
    codepoints as BufferSource | null,
    codepointCount,
    type,
  );

  if (ptr === null) {
    throw new Error("LoadFontData returned NULL");
  }

  const GLYPH_SIZE = 40;
  const total = GLYPH_SIZE * codepointCount;

  const backing = new Deno.UnsafePointerView(ptr).getArrayBuffer(total);

  const glyphs = new Array<GlyphInfo>(codepointCount);
  for (let i = 0; i < codepointCount; i++) {
    glyphs[i] = new GlyphInfo(
      new Uint8Array(backing, i * GLYPH_SIZE, GLYPH_SIZE) as Uint8Array<
        ArrayBuffer
      >,
    );
  }

  return { glyphs, ptr };
}

export function GenImageFontAtlas(
  glyphs: GlyphInfo[],
  glyphRecsOut: BigUint64Array,
  glyphCount: int,
  fontSize: int,
  padding: int,
  packMethod: int,
): Image {
  const glyphBuf = new Uint8Array(glyphs.length * 40);

  for (let i = 0; i < glyphs.length; i++) {
    glyphBuf.set(glyphs[i].buffer, i * 40);
  }

  const glyphPtr = Deno.UnsafePointer.of(glyphBuf.buffer as BufferSource);
  const glyphRecsPtr = Deno.UnsafePointer.of(
    glyphRecsOut.buffer as BufferSource,
  );

  return new Image(
    lib.GenImageFontAtlas(
      glyphPtr,
      glyphRecsPtr,
      glyphCount,
      fontSize,
      padding,
      packMethod,
    ),
  );
}

export function UnloadFontData(
  glyphs: GlyphInfo[],
  glyphCount: int,
): void {
  const buff = new Uint8Array(glyphs.length * 40);

  for (let i = 0; i < glyphs.length; i++) {
    buff.set(glyphs[i].buffer, i * 40);
  }

  const glyphPtr = Deno.UnsafePointer.of(buff.buffer as BufferSource);

  lib.UnloadFontData(glyphPtr, glyphCount);
}

export function UnloadFont(font: Font): void {
  lib.UnloadFont(font.buffer);
}

export function ExportFontAsCode(
  font: Font,
  fileName: string,
): boolean {
  return !!lib.ExportFontAsCode(
    font.buffer,
    new TextEncoder().encode(fileName + "\0"),
  );
}

export function DrawFPS(posX: int, posY: int): void {
  lib.DrawFPS(posX, posY);
}

export function DrawText(
  text: string,
  posX: int,
  posY: int,
  fontSize: int,
  color: Color,
): void {
  lib.DrawText(
    new TextEncoder().encode(text + "\0"),
    posX,
    posY,
    fontSize,
    color.buffer,
  );
}

export function DrawTextEx(
  font: Font,
  text: string,
  position: Vector2,
  fontSize: int,
  spacing: int,
  tint: Color,
): void {
  lib.DrawTextEx(
    font.buffer,
    new TextEncoder().encode(text + "\0").buffer,
    position.buffer,
    fontSize,
    spacing,
    tint.buffer,
  );
}

export function DrawTextPro(
  font: Font,
  text: string,
  position: Vector2,
  origin: Vector2,
  rotation: int,
  fontSize: int,
  spacing: int,
  tint: Color,
): void {
  lib.DrawTextPro(
    font.buffer,
    new TextEncoder().encode(text + "\0").buffer,
    position.buffer,
    origin.buffer,
    rotation,
    fontSize,
    spacing,
    tint.buffer,
  );
}

export function DrawTextCodepoint(
  font: Font,
  codepoint: int,
  position: Vector2,
  fontSize: int,
  tint: Color,
): void {
  lib.DrawTextCodepoint(
    font.buffer,
    codepoint,
    position.buffer,
    fontSize,
    tint.buffer,
  );
}

export function DrawTextCodepoints(
  font: Font,
  codepoints: Int32Array,
  codepointCount: int,
  position: Vector2,
  fontSize: int,
  spacing: int,
  tint: Color,
): void {
  lib.DrawTextCodepoints(
    font.buffer,
    Deno.UnsafePointer.of(codepoints.buffer as BufferSource),
    codepointCount,
    position.buffer,
    fontSize,
    spacing,
    tint.buffer,
  );
}

export function SetTextLineSpacing(spacing: int): void {
  lib.SetTextLineSpacing(spacing);
}

export function MeasureText(text: string, fontSize: int): int {
  return lib.MeasureText(
    new TextEncoder().encode(text + "\0").buffer,
    fontSize,
  );
}

export function MeasureTextEx(
  font: Font,
  text: string,
  fontSize: float,
  spacing: float,
): Vector2 {
  const buf = lib.MeasureTextEx(
    font.buffer,
    new TextEncoder().encode(text + "\0").buffer,
    fontSize,
    spacing,
  );
  return new Vector2(buf[0], buf[1]);
}

export function GetGlyphIndex(font: Font, codepoint: int): int {
  return lib.GetGlyphIndex(font.buffer, codepoint);
}

export function GetGlyphInfo(font: Font, codepoint: int): GlyphInfo {
  const buf = lib.GetGlyphInfo(font.buffer, codepoint);
  return new GlyphInfo(buf);
}

export function GetGlyphAtlasRec(font: Font, codepoint: int): Rectangle {
  const buf = lib.GetGlyphAtlasRec(font.buffer, codepoint);
  return new Rectangle(
    buf[0],
    buf[1],
    buf[2],
    buf[3],
  );
}

// implement in javascript
/*
// Text codepoints management functions (unicode characters)
RLAPI char *LoadUTF8(const int *codepoints, int length);                // Load UTF-8 text encoded from codepoints array
RLAPI void UnloadUTF8(char *text);                                      // Unload UTF-8 text encoded from codepoints array
RLAPI int *LoadCodepoints(const char *text, int *count);                // Load all codepoints from a UTF-8 text string, codepoints count returned by parameter
RLAPI void UnloadCodepoints(int *codepoints);                           // Unload codepoints data from memory
RLAPI int GetCodepointCount(const char *text);                          // Get total number of codepoints in a UTF-8 encoded string
RLAPI int GetCodepoint(const char *text, int *codepointSize);           // Get next codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure
RLAPI int GetCodepointNext(const char *text, int *codepointSize);       // Get next codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure
RLAPI int GetCodepointPrevious(const char *text, int *codepointSize);   // Get previous codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure
RLAPI const char *CodepointToUTF8(int codepoint, int *utf8Size);        // Encode one codepoint into UTF-8 byte array (array length returned as parameter)

// Text strings management functions (no UTF-8 strings, only byte chars)
// NOTE: Some strings allocate memory internally for returned strings, just be careful!
RLAPI int TextCopy(char *dst, const char *src);                                             // Copy one string to another, returns bytes copied
RLAPI bool TextIsEqual(const char *text1, const char *text2);                               // Check if two text string are equal
RLAPI unsigned int TextLength(const char *text);                                            // Get text length, checks for '\0' ending
RLAPI const char *TextFormat(const char *text, ...);                                        // Text formatting with variables (sprintf() style)
RLAPI const char *TextSubtext(const char *text, int position, int length);                  // Get a piece of a text string
RLAPI char *TextReplace(const char *text, const char *replace, const char *by);             // Replace text string (WARNING: memory must be freed!)
RLAPI char *TextInsert(const char *text, const char *insert, int position);                 // Insert text in a position (WARNING: memory must be freed!)
RLAPI const char *TextJoin(const char **textList, int count, const char *delimiter);        // Join text strings with delimiter
RLAPI const char **TextSplit(const char *text, char delimiter, int *count);                 // Split text into multiple strings
RLAPI void TextAppend(char *text, const char *append, int *position);                       // Append text at specific position and move cursor!
RLAPI int TextFindIndex(const char *text, const char *find);                                // Find first text occurrence within a string
RLAPI const char *TextToUpper(const char *text);                      // Get upper case version of provided string
RLAPI const char *TextToLower(const char *text);                      // Get lower case version of provided string
RLAPI const char *TextToPascal(const char *text);                     // Get Pascal case notation version of provided string
RLAPI const char *TextToSnake(const char *text);                      // Get Snake case notation version of provided string
RLAPI const char *TextToCamel(const char *text);                      // Get Camel case notation version of provided string

RLAPI int TextToInteger(const char *text);                            // Get integer value from text (negative values not supported)
RLAPI float TextToFloat(const char *text);                            // Get float value from text (negative values not supported)
*/

// 3D Stuff

export function DrawLine3D(
  startPos: Vector3,
  endPos: Vector3,
  color: Color,
): void {
  lib.DrawLine3D(startPos.buffer, endPos.buffer, color.buffer);
}

export function DrawPoint3D(position: Vector3, color: Color): void {
  lib.DrawPoint3D(position.buffer, color.buffer);
}

export function DrawCircle3D(
  center: Vector3,
  radius: float,
  rotationAxis: Vector3,
  rotationAngle: float,
  color: Color,
): void {
  lib.DrawCircle3D(
    center.buffer,
    radius,
    rotationAxis.buffer,
    rotationAngle,
    color.buffer,
  );
}

export function DrawTriangle3D(
  v1: Vector3,
  v2: Vector3,
  v3: Vector3,
  color: Color,
): void {
  const cross = (v2.x - v1.x) * (v3.y - v1.y) -
    (v2.y - v1.y) * (v3.x - v1.x);

  if (cross < 0) {
    lib.DrawTriangle3D(v1.buffer, v3.buffer, v2.buffer, color.buffer);
  } else {
    lib.DrawTriangle3D(v1.buffer, v2.buffer, v3.buffer, color.buffer);
  }
}

export function DrawTriangleStrip3D(
  points: Vector3[],
  color: Color,
): void {
  const points_buffer = concatVector3(points);
  const points_ptr = Deno.UnsafePointer.of(
    points_buffer.buffer as BufferSource,
  );
  lib.DrawTriangleStrip3D(points_ptr, points.length, color.buffer);
}

export function DrawCube(
  position: Vector3,
  width: float,
  height: float,
  length: float,
  color: Color,
): void {
  lib.DrawCube(position.buffer, width, height, length, color.buffer);
}

export function DrawCubeV(
  position: Vector3,
  size: Vector3,
  color: Color,
): void {
  lib.DrawCubeV(position.buffer, size.buffer, color.buffer);
}

export function DrawCubeWires(
  position: Vector3,
  width: float,
  height: float,
  length: float,
  color: Color,
): void {
  lib.DrawCubeWires(position.buffer, width, height, length, color.buffer);
}

export function DrawCubeWiresV(
  position: Vector3,
  size: Vector3,
  color: Color,
): void {
  lib.DrawCubeWiresV(position.buffer, size.buffer, color.buffer);
}

export function DrawSphere(
  center: Vector3,
  radius: float,
  color: Color,
): void {
  lib.DrawSphere(center.buffer, radius, color.buffer);
}

export function DrawSphereEx(
  center: Vector3,
  radius: float,
  rings: int,
  slices: int,
  color: Color,
): void {
  lib.DrawSphereEx(center.buffer, radius, rings, slices, color.buffer);
}

export function DrawSphereWires(
  center: Vector3,
  radius: float,
  rings: int,
  slices: int,
  color: Color,
): void {
  lib.DrawSphereWires(center.buffer, radius, rings, slices, color.buffer);
}

export function DrawCylinder(
  center: Vector3,
  radius_top: float,
  radius_bottom: float,
  height: float,
  slices: int,
  color: Color,
): void {
  lib.DrawCylinder(
    center.buffer,
    radius_top,
    radius_bottom,
    height,
    slices,
    color.buffer,
  );
}

//RLAPI void DrawCylinderEx(Vector3 startPos, Vector3 endPos, float startRadius, float endRadius, int sides, Color color); // Draw a cylinder with base at startPos and top at endPos

export function DrawCylinderEx(
  startPos: Vector3,
  endPos: Vector3,
  radiusTop: float,
  radiusBottom: float,
  slices: int,
  color: Color,
): void {
  lib.DrawCylinderEx(
    startPos.buffer,
    endPos.buffer,
    radiusTop,
    radiusBottom,
    slices,
    color.buffer,
  );
}

export function DrawCylinderWires(
  center: Vector3,
  radius_top: float,
  radius_bottom: float,
  height: float,
  slices: int,
  color: Color,
): void {
  lib.DrawCylinderWires(
    center.buffer,
    radius_top,
    radius_bottom,
    height,
    slices,
    color.buffer,
  );
}

export function DrawCylinderWiresEx(
  startPos: Vector3,
  endPos: Vector3,
  radiusTop: float,
  radiusBottom: float,
  slices: int,
  color: Color,
): void {
  lib.DrawCylinderWiresEx(
    startPos.buffer,
    endPos.buffer,
    radiusTop,
    radiusBottom,
    slices,
    color.buffer,
  );
}

//RLAPI void DrawCapsule(Vector3 startPos, Vector3 endPos, float radius, int slices, int rings, Color color); // Draw a capsule with the center of its sphere caps at startPos and endPos
export function DrawCapsule(
  startPos: Vector3,
  endPos: Vector3,
  radius: float,
  slices: int,
  rings: int,
  color: Color,
): void {
  lib.DrawCapsule(
    startPos.buffer,
    endPos.buffer,
    radius,
    slices,
    rings,
    color.buffer,
  );
}

export function DrawCapsuleWires(
  startPos: Vector3,
  endPos: Vector3,
  radius: float,
  slices: int,
  rings: int,
  color: Color,
): void {
  lib.DrawCapsuleWires(
    startPos.buffer,
    endPos.buffer,
    radius,
    slices,
    rings,
    color.buffer,
  );
}

export function DrawPlane(center: Vector3, size: Vector2, color: Color): void {
  lib.DrawPlane(center.buffer, size.buffer, color.buffer);
}

export function DrawRay(ray: Ray, color: Color): void {
  lib.DrawRay(ray.buffer, color.buffer);
}

export function DrawGrid(slices: int, spacing: float): void {
  lib.DrawGrid(slices, spacing);
}

export function LoadModel(fileName: string): Model {
  return new Model(lib.LoadModel(new TextEncoder().encode(fileName + "\0")));
}

export function LoadModelFromMesh(mesh: Mesh): Model {
  return new Model(lib.LoadModelFromMesh(mesh.buffer));
}

export function IsModelValid(model: Model): boolean {
  return !!lib.IsModelValid(model.buffer);
}

export function UnloadModel(model: Model): void {
  lib.UnloadModel(model.buffer);
}

export function GetModelBoundingBox(model: Model): BoundingBox {
  const buf = lib.GetModelBoundingBox(model.buffer);
  const min = new Vector3(buf[0], buf[1], buf[2]);
  const max = new Vector3(buf[3], buf[4], buf[5]);
  return new BoundingBox(min, max);
}

export function DrawModel(
  model: Model,
  position: Vector3,
  scale: float,
  color: Color,
): void {
  lib.DrawModel(model.buffer, position.buffer, scale, color.buffer);
}

export function DrawModelEx(
  model: Model,
  position: Vector3,
  rotationAxis: Vector3,
  rotationAngle: float,
  scale: Vector3,
  tint: Color,
): void {
  lib.DrawModelEx(
    model.buffer,
    position,
    rotationAxis,
    rotationAngle,
    scale,
    tint,
  );
}

export function DrawModelWires(
  model: Model,
  position: Vector3,
  scale: float,
  tint: Color,
): void {
  lib.DrawModelWires(
    model.buffer,
    position,
    scale,
    tint,
  );
}

export function DrawModelWiresEx(
  model: Model,
  position: Vector3,
  rotationAxis: Vector3,
  rotationAngle: float,
  scale: Vector3,
  tint: Color,
): void {
  lib.DrawModelWiresEx(
    model.buffer,
    position,
    rotationAxis,
    rotationAngle,
    scale,
    tint,
  );
}

export function DrawModelPoints(
  model: Model,
  position: Vector3,
  scale: float,
  tint: Color,
): void {
  lib.DrawModelPoints(
    model.buffer,
    position,
    scale,
    tint,
  );
}

export function DrawModelPointsEx(
  model: Model,
  position: Vector3,
  rotationAxis: Vector3,
  rotationAngle: float,
  scale: Vector3,
  tint: Color,
): void {
  lib.DrawModelPointsEx(
    model.buffer,
    position,
    rotationAxis,
    rotationAngle,
    scale,
    tint,
  );
}

export function DrawBoundingBox(
  box: BoundingBox,
  color: Color,
): void {
  lib.DrawBoundingBox(
    box,
    color,
  );
}

export function DrawBillboard(
  camera: Camera,
  texture: Texture2D,
  position: Vector3,
  scale: float,
  tint: Color,
): void {
  lib.DrawBillboard(
    camera.buffer,
    texture.buffer,
    position,
    scale,
    tint,
  );
}

export function DrawBillboardRec(
  camera: Camera,
  texture: Texture2D,
  source: Rectangle,
  position: Vector3,
  size: Vector2,
  tint: Color,
): void {
  lib.DrawBillboardRec(
    camera.buffer,
    texture.buffer,
    source,
    position,
    size,
    tint,
  );
}

export function DrawBillboardPro(
  camera: Camera,
  texture: Texture2D,
  source: Rectangle,
  position: Vector3,
  up: Vector3,
  size: Vector2,
  origin: Vector2,
  rotation: float,
  tint: Color,
): void {
  lib.DrawBillboardPro(
    camera.buffer,
    texture.buffer,
    source,
    position,
    up,
    size,
    origin,
    rotation,
    tint,
  );
}

export function UploadMesh(
  mesh: Mesh,
  dynamic: boolean,
): void {
  lib.UploadMesh(
    mesh.buffer,
    dynamic ? 1 : 0,
  );
}

export function UpdateMeshBuffer(
  mesh: Mesh,
  index: int,
  data: ArrayBuffer,
  dataSize: int,
  offset: int,
): void {
  lib.UpdateMeshBuffer(
    mesh.buffer,
    index,
    data,
    dataSize,
    offset,
  );
}

export function UnloadMesh(mesh: Mesh): void {
  lib.UnloadMesh(mesh.buffer);
}

export function DrawMesh(
  mesh: Mesh,
  material: Material,
  transform: Matrix,
): void {
  lib.DrawMesh(
    mesh.buffer,
    material.buffer,
    transform,
  );
}

export function DrawMeshInstanced(
  mesh: Mesh,
  material: Material,
  transforms: Float32Array,
  instances: int,
): void {
  lib.DrawMeshInstanced(
    mesh.buffer,
    material.buffer,
    transforms.buffer as ArrayBuffer,
    instances,
  );
}

export function GetMeshBoundingBox(mesh: Mesh): BoundingBox {
  const buf = lib.GetMeshBoundingBox(mesh.buffer);
  const min = new Vector3(buf[0], buf[1], buf[2]);
  const max = new Vector3(buf[3], buf[4], buf[5]);
  return new BoundingBox(min, max);
}

export function GenMeshTangents(mesh: Mesh): void {
  lib.GenMeshTangents(mesh.buffer);
}

export function ExportMesh(
  mesh: Mesh,
  fileName: string,
): boolean {
  return !!lib.ExportMesh(
    mesh.buffer,
    new TextEncoder().encode(fileName + "\0").buffer,
  );
}

export function ExportMeshAsCode(
  mesh: Mesh,
  fileName: string,
): boolean {
  return !!lib.ExportMeshAsCode(
    mesh.buffer,
    new TextEncoder().encode(fileName + "\0").buffer,
  );
}

export function GenMeshPoly(
  sides: int,
  radius: float,
): Mesh {
  return new Mesh(
    lib.GenMeshPoly(
      sides,
      radius,
    ),
  );
}

export function GenMeshPlane(
  width: float,
  length: float,
  resX: int,
  resZ: int,
): Mesh {
  return new Mesh(
    lib.GenMeshPlane(
      width,
      length,
      resX,
      resZ,
    ),
  );
}

export function GenMeshCube(
  width: float,
  height: float,
  length: float,
): Mesh {
  return new Mesh(
    lib.GenMeshCube(
      width,
      height,
      length,
    ),
  );
}

export function GenMeshSphere(
  radius: float,
  rings: int,
  slices: int,
): Mesh {
  return new Mesh(
    lib.GenMeshSphere(
      radius,
      rings,
      slices,
    ),
  );
}

export function GenMeshHemiSphere(
  radius: float,
  rings: int,
  slices: int,
): Mesh {
  return new Mesh(
    lib.GenMeshHemiSphere(
      radius,
      rings,
      slices,
    ),
  );
}

export function GenMeshCylinder(
  radius: float,
  height: float,
  slices: int,
): Mesh {
  return new Mesh(
    lib.GenMeshCylinder(
      radius,
      height,
      slices,
    ),
  );
}

export function GenMeshCone(
  radius: float,
  height: float,
  slices: int,
): Mesh {
  return new Mesh(
    lib.GenMeshCone(
      radius,
      height,
      slices,
    ),
  );
}

export function GenMeshTorus(
  radius: float,
  size: float,
  radSeg: int,
  sides: int,
): Mesh {
  return new Mesh(
    lib.GenMeshTorus(
      radius,
      size,
      radSeg,
      sides,
    ),
  );
}

export function GenMeshKnot(
  radius: float,
  size: float,
  radSeg: int,
  sides: int,
): Mesh {
  return new Mesh(
    lib.GenMeshKnot(
      radius,
      size,
      radSeg,
      sides,
    ),
  );
}

export function GenMeshHeightmap(
  heightmap: Image,
  size: Vector3,
): Mesh {
  return new Mesh(
    lib.GenMeshHeightmap(
      heightmap.buffer,
      size,
    ),
  );
}

export function GenMeshCubicmap(
  cubicmap: Image,
  cubeSize: Vector3,
): Mesh {
  return new Mesh(
    lib.GenMeshCubicmap(
      cubicmap.buffer,
      cubeSize,
    ),
  );
}

export function LoadMaterials(
  fileName: string,
): { materials: Material[]; count: int } {
  const countBuf = new Int32Array(1);

  const ptr = lib.LoadMaterials(
    new TextEncoder().encode(fileName + "\0").buffer,
    countBuf,
  );

  if (!ptr) {
    throw new Error("Failed to load materials");
  }

  const count = countBuf[0];
  const view = new Deno.UnsafePointerView(ptr);
  const buf = view.getArrayBuffer(count * 40);

  const materials: Material[] = [];
  for (let i = 0; i < count; i++) {
    materials.push(
      new Material(
        new Uint8Array(buf, i * 40, 40) as Uint8Array<ArrayBuffer>,
      ),
    );
  }

  return { materials, count };
}

export function LoadMaterialDefault(): Material {
  return new Material(
    lib.LoadMaterialDefault(),
  );
}

export function IsMaterialValid(material: Material): boolean {
  return !!lib.IsMaterialValid(material.buffer);
}

export function UnloadMaterial(material: Material): void {
  lib.UnloadMaterial(material.buffer);
}

export function SetMaterialTexture(
  material: Material,
  mapType: int,
  texture: Texture2D,
): void {
  lib.SetMaterialTexture(
    Deno.UnsafePointer.of(material.buffer),
    mapType,
    texture.buffer,
  );
}

export function SetModelMeshMaterial(
  model: Model,
  meshId: int,
  materialId: int,
): void {
  lib.SetModelMeshMaterial(
    Deno.UnsafePointer.of(model.buffer),
    meshId,
    materialId,
  );
}

export function LoadModelAnimations(
  fileName: string,
): { animations: ModelAnimation[]; count: int } {
  const countBuf = new Int32Array(1);

  const ptr = lib.LoadModelAnimations(
    new TextEncoder().encode(fileName + "\0").buffer,
    Deno.UnsafePointer.of(countBuf.buffer),
  );

  if (!ptr) {
    throw new Error("Failed to load model animations");
  }

  const count = countBuf[0];
  const view = new Deno.UnsafePointerView(ptr);
  const buf = view.getArrayBuffer(count * 72);

  const animations: ModelAnimation[] = [];
  for (let i = 0; i < count; i++) {
    animations.push(
      new ModelAnimation(
        new Uint8Array(buf, i * 72, 72) as Uint8Array<ArrayBuffer>,
      ),
    );
  }

  return { animations, count };
}

export function UpdateModelAnimation(
  model: Model,
  anim: ModelAnimation,
  frame: int,
): void {
  lib.UpdateModelAnimation(
    model.buffer,
    anim.buffer,
    frame,
  );
}

export function UpdateModelAnimationBones(
  model: Model,
  anim: ModelAnimation,
  frame: int,
): void {
  lib.UpdateModelAnimationBones(
    model.buffer,
    anim.buffer,
    frame,
  );
}

export function UnloadModelAnimation(anim: ModelAnimation): void {
  lib.UnloadModelAnimation(anim.buffer);
}

export function UnloadModelAnimations(
  animations: ModelAnimation[],
): void {
  if (animations.length === 0) return;

  lib.UnloadModelAnimations(
    Deno.UnsafePointer.of(animations[0].buffer),
    animations.length,
  );
}

export function IsModelAnimationValid(
  model: Model,
  anim: ModelAnimation,
): boolean {
  return !!lib.IsModelAnimationValid(
    model.buffer,
    anim.buffer,
  );
}

export function CheckCollisionSpheres(
  center1: Vector3,
  radius1: float,
  center2: Vector3,
  radius2: float,
): boolean {
  return !!lib.CheckCollisionSpheres(
    center1.buffer,
    radius1,
    center2.buffer,
    radius2,
  );
}

export function CheckCollisionBoxes(
  box1: BoundingBox,
  box2: BoundingBox,
): boolean {
  return !!lib.CheckCollisionBoxes(
    box1.buffer,
    box2.buffer,
  );
}

export function CheckCollisionBoxSphere(
  box: BoundingBox,
  center: Vector3,
  radius: float,
): boolean {
  return !!lib.CheckCollisionBoxSphere(
    box.buffer,
    center.buffer,
    radius,
  );
}

export function GetRayCollisionSphere(
  ray: Ray,
  center: Vector3,
  radius: float,
): RayCollision {
  return new RayCollision(
    lib.GetRayCollisionSphere(
      ray.buffer,
      center.buffer,
      radius,
    ),
  );
}

export function GetRayCollisionBox(
  ray: Ray,
  box: BoundingBox,
): RayCollision {
  return new RayCollision(
    lib.GetRayCollisionBox(
      ray.buffer,
      box.buffer,
    ),
  );
}

export function GetRayCollisionMesh(
  ray: Ray,
  mesh: Mesh,
  transform: Matrix,
): RayCollision {
  return new RayCollision(
    lib.GetRayCollisionMesh(
      ray.buffer,
      mesh.buffer,
      transform,
    ),
  );
}

export function GetRayCollisionTriangle(
  ray: Ray,
  p1: Vector3,
  p2: Vector3,
  p3: Vector3,
): RayCollision {
  return new RayCollision(
    lib.GetRayCollisionTriangle(
      ray,
      p1.buffer,
      p2.buffer,
      p3.buffer,
    ),
  );
}

export function GetRayCollisionQuad(
  ray: Ray,
  p1: Vector3,
  p2: Vector3,
  p3: Vector3,
  p4: Vector3,
): RayCollision {
  return new RayCollision(
    lib.GetRayCollisionQuad(
      ray,
      p1.buffer,
      p2.buffer,
      p3.buffer,
      p4.buffer,
    ),
  );
}

export function InitAudioDevice(): void {
  lib.InitAudioDevice();
}

export function CloseAudioDevice(): void {
  lib.CloseAudioDevice();
}

export function IsAudioDeviceReady(): boolean {
  return !!lib.IsAudioDeviceReady();
}

export function SetMasterVolume(volume: float): void {
  lib.SetMasterVolume(volume);
}

export function GetMasterVolume(): float {
  return lib.GetMasterVolume();
}

export function LoadWave(fileName: string): Wave {
  const buf = lib.LoadWave(new TextEncoder().encode(fileName + "\0").buffer);
  if (!buf) throw new Error("Failed to load wave");
  return new Wave(buf);
}

export function LoadWaveFromMemory(
  fileType: string,
  fileData: Uint8Array,
): Wave {
  const buf = lib.LoadWaveFromMemory(
    new TextEncoder().encode(fileType + "\0").buffer,
    fileData.buffer as ArrayBuffer,
    fileData.byteLength,
  );
  if (!buf) throw new Error("Failed to load wave from memory");
  return new Wave(buf);
}

export function IsWaveValid(wave: Wave): boolean {
  return !!lib.IsWaveValid(wave.buffer);
}

export function LoadSound(fileName: string): Sound {
  const buf = lib.LoadSound(new TextEncoder().encode(fileName + "\0").buffer);
  if (!buf) throw new Error("Failed to load sound");
  return new Sound(buf);
}

export function LoadSoundFromWave(wave: Wave): Sound {
  const buf = lib.LoadSoundFromWave(wave.buffer);
  if (!buf) throw new Error("Failed to load sound from wave");
  return new Sound(buf);
}

export function LoadSoundAlias(source: Sound): Sound {
  const buf = lib.LoadSoundAlias(source.buffer);
  if (!buf) throw new Error("Failed to load sound alias");
  return new Sound(buf);
}

export function IsSoundValid(sound: Sound): boolean {
  return !!lib.IsSoundValid(sound.buffer);
}

export function UpdateSound(
  sound: Sound,
  data: BufferSource,
  sampleCount: int,
): void {
  lib.UpdateSound(
    sound.buffer,
    data,
    sampleCount,
  );
}

export function UnloadWave(wave: Wave): void {
  lib.UnloadWave(wave.buffer);
}

export function UnloadSound(sound: Sound): void {
  lib.UnloadSound(sound.buffer);
}

export function UnloadSoundAlias(alias: Sound): void {
  lib.UnloadSoundAlias(alias.buffer);
}

export function ExportWave(
  wave: Wave,
  fileName: string,
): boolean {
  return !!lib.ExportWave(
    wave.buffer,
    new TextEncoder().encode(fileName + "\0").buffer,
  );
}

export function ExportWaveAsCode(
  wave: Wave,
  fileName: string,
): boolean {
  return !!lib.ExportWaveAsCode(
    wave.buffer,
    new TextEncoder().encode(fileName + "\0").buffer,
  );
}

export function PlaySound(sound: Sound): void {
  lib.PlaySound(sound.buffer);
}

export function StopSound(sound: Sound): void {
  lib.StopSound(sound.buffer);
}

export function PauseSound(sound: Sound): void {
  lib.PauseSound(sound.buffer);
}

export function ResumeSound(sound: Sound): void {
  lib.ResumeSound(sound.buffer);
}

export function IsSoundPlaying(sound: Sound): boolean {
  return !!lib.IsSoundPlaying(sound.buffer);
}

export function SetSoundVolume(sound: Sound, volume: float): void {
  lib.SetSoundVolume(sound.buffer, volume);
}

export function SetSoundPitch(sound: Sound, pitch: float): void {
  lib.SetSoundPitch(sound.buffer, pitch);
}

export function SetSoundPan(sound: Sound, pan: float): void {
  lib.SetSoundPan(sound.buffer, pan);
}

export function WaveCopy(wave: Wave): Wave {
  return new Wave(
    lib.WaveCopy(wave.buffer),
  );
}

export function WaveCrop(
  wave: Wave,
  initFrame: int,
  finalFrame: int,
): void {
  lib.WaveCrop(
    wave.buffer,
    initFrame,
    finalFrame,
  );
}

export function WaveFormat(
  wave: Wave,
  sampleRate: int,
  sampleSize: int,
  channels: int,
): void {
  lib.WaveFormat(
    wave.buffer,
    sampleRate,
    sampleSize,
    channels,
  );
}

export function LoadWaveSamples(wave: Wave): Float32Array {
  const ptr = lib.LoadWaveSamples(wave.buffer);
  const sampleCount = wave.frameCount * wave.channels;

  if (!ptr) throw new Error("Failed to load wave samples");

  const view = new Deno.UnsafePointerView(ptr);
  const buf = view.getArrayBuffer(sampleCount * 4);
  return new Float32Array(buf);
}

export function UnloadWaveSamples(samples: Float32Array): void {
  lib.UnloadWaveSamples(Deno.UnsafePointer.of(samples.buffer as ArrayBuffer));
}

export function LoadMusicStream(fileName: string): Music {
  return new Music(
    lib.LoadMusicStream(
      new TextEncoder().encode(fileName + "\0").buffer,
    ),
  );
}

export function LoadMusicStreamFromMemory(
  fileType: string,
  data: Uint8Array,
): Music {
  return new Music(
    lib.LoadMusicStreamFromMemory(
      new TextEncoder().encode(fileType + "\0").buffer,
      data.buffer as ArrayBuffer,
      data.byteLength,
    ),
  );
}

export function IsMusicValid(music: Music): boolean {
  return !!lib.IsMusicValid(music.buffer);
}

export function UnloadMusicStream(music: Music): void {
  lib.UnloadMusicStream(music.buffer);
}

export function PlayMusicStream(music: Music): void {
  lib.PlayMusicStream(music.buffer);
}

export function IsMusicStreamPlaying(music: Music): boolean {
  return !!lib.IsMusicStreamPlaying(music.buffer);
}

export function UpdateMusicStream(music: Music): void {
  lib.UpdateMusicStream(music.buffer);
}

export function StopMusicStream(music: Music): void {
  lib.StopMusicStream(music.buffer);
}

export function PauseMusicStream(music: Music): void {
  lib.PauseMusicStream(music.buffer);
}

export function ResumeMusicStream(music: Music): void {
  lib.ResumeMusicStream(music.buffer);
}

export function SeekMusicStream(music: Music, position: float): void {
  lib.SeekMusicStream(music.buffer, position);
}

export function SetMusicVolume(music: Music, volume: float): void {
  lib.SetMusicVolume(music.buffer, volume);
}

export function SetMusicPitch(music: Music, pitch: float): void {
  lib.SetMusicPitch(music.buffer, pitch);
}

export function SetMusicPan(music: Music, pan: float): void {
  lib.SetMusicPan(music.buffer, pan);
}

export function GetMusicTimeLength(music: Music): float {
  return lib.GetMusicTimeLength(music.buffer);
}

export function GetMusicTimePlayed(music: Music): float {
  return lib.GetMusicTimePlayed(music.buffer);
}

export function LoadAudioStream(
  sampleRate: int,
  sampleSize: int,
  channels: int,
): AudioStream {
  return new AudioStream(
    lib.LoadAudioStream(
      sampleRate,
      sampleSize,
      channels,
    ),
  );
}

export function IsAudioStreamValid(stream: AudioStream): boolean {
  return !!lib.IsAudioStreamValid(stream.buffer);
}

export function UnloadAudioStream(stream: AudioStream): void {
  lib.UnloadAudioStream(stream.buffer);
}

export function UpdateAudioStream(
  stream: AudioStream,
  data: BufferSource,
  frameCount: int,
): void {
  lib.UpdateAudioStream(
    stream.buffer,
    Deno.UnsafePointer.of(data),
    frameCount,
  );
}

export function IsAudioStreamProcessed(stream: AudioStream): boolean {
  return !!lib.IsAudioStreamProcessed(stream.buffer);
}

export function PlayAudioStream(stream: AudioStream): void {
  lib.PlayAudioStream(stream.buffer);
}

export function PauseAudioStream(stream: AudioStream): void {
  lib.PauseAudioStream(stream.buffer);
}

export function ResumeAudioStream(stream: AudioStream): void {
  lib.ResumeAudioStream(stream.buffer);
}

export function IsAudioStreamPlaying(stream: AudioStream): boolean {
  return !!lib.IsAudioStreamPlaying(stream.buffer);
}

export function StopAudioStream(stream: AudioStream): void {
  lib.StopAudioStream(stream.buffer);
}

export function SetAudioStreamVolume(
  stream: AudioStream,
  volume: float,
): void {
  lib.SetAudioStreamVolume(stream.buffer, volume);
}

export function SetAudioStreamPitch(
  stream: AudioStream,
  pitch: float,
): void {
  lib.SetAudioStreamPitch(stream.buffer, pitch);
}

export function SetAudioStreamPan(
  stream: AudioStream,
  pan: float,
): void {
  lib.SetAudioStreamPan(stream.buffer, pan);
}

export function SetAudioStreamBufferSizeDefault(size: int): void {
  lib.SetAudioStreamBufferSizeDefault(size);
}

// NOTE: Audio callbacks are unsafe in JS runtimes.
// Expose only if you deliberately support UnsafeCallback.
type AudioStreamCallbackDef = {
  parameters: ["pointer", "u32"];
  result: "void";
};

const audioCallbacks = new WeakMap<
  AudioStream,
  Deno.UnsafeCallback<AudioStreamCallbackDef>
>();

export function SetAudioStreamCallback(
  stream: AudioStream,
  callback: (buffer: Deno.PointerObject<unknown>, frames: int) => void,
): void {
  if (audioCallbacks.has(stream)) throw new Error("Audio callback already set");

  const cb = new Deno.UnsafeCallback<AudioStreamCallbackDef>(
    { parameters: ["pointer", "u32"], result: "void" },
    (buf, frames) => {
      if (buf === null) return;
      callback(buf, frames as int);
    },
  );

  audioCallbacks.set(stream, cb);

  lib.SetAudioStreamCallback(
    stream.buffer,
    cb.pointer as unknown as Deno.PointerObject<unknown>,
  );
}

type AudioCallbackDef = {
  parameters: ["pointer", "u32"];
  result: "void";
};

const audioProcessors = new Set<Deno.UnsafeCallback<AudioCallbackDef>>();

export function AttachAudioStreamProcessor(
  stream: AudioStream,
  processor: (buffer: Deno.PointerObject<unknown>, frames: int) => void,
): void {
  const cb = new Deno.UnsafeCallback<AudioCallbackDef>(
    { parameters: ["pointer", "u32"], result: "void" },
    (buf, frames) => {
      if (buf === null) return;
      processor(buf, frames as int);
    },
  );

  audioProcessors.add(cb);

  lib.AttachAudioStreamProcessor(
    stream.buffer,
    cb.pointer as unknown as Deno.PointerObject<unknown>,
  );
}

export function DetachAudioStreamProcessor(
  stream: AudioStream,
  processor: Deno.UnsafeCallback<AudioCallbackDef>,
): void {
  audioProcessors.delete(processor);

  lib.DetachAudioStreamProcessor(
    stream.buffer,
    processor.pointer as unknown as Deno.PointerObject<unknown>,
  );
}

export function AttachAudioMixedProcessor(
  processor: (buffer: Deno.PointerObject<unknown>, frames: int) => void,
): Deno.UnsafeCallback<AudioCallbackDef> {
  const cb = new Deno.UnsafeCallback<AudioCallbackDef>(
    { parameters: ["pointer", "u32"], result: "void" },
    (buf, frames) => {
      if (buf === null) return;
      processor(buf, frames as int);
    },
  );

  audioProcessors.add(cb);

  lib.AttachAudioMixedProcessor(
    cb.pointer as unknown as Deno.PointerObject<unknown>,
  );

  return cb;
}

export function DetachAudioMixedProcessor(
  processor: Deno.UnsafeCallback<AudioCallbackDef>,
): void {
  audioProcessors.delete(processor);

  lib.DetachAudioMixedProcessor(
    processor.pointer as unknown as Deno.PointerObject<unknown>,
  );
}
