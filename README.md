# Deno Raylib 6.0

TypeScript bindings for raylib on Deno with a focus on staying as close to the C API as possible.

[![JSR](https://jsr.io/badges/@jjldonley/DenoRaylib)](https://jsr.io/@jjldonley/DenoRaylib)

## Quick Start

Initialize your project and download the required native libraries:

```bash
deno run -Ar jsr:@jjldonley/DenoRaylib/init
```

This script will:
* Detect your platform and architecture.
* Download the correct raylib 6.0 release.
* Extract the native library into `./blobs/`.
* Copy the raylib bindings into `./raylib/`.
* Create a `main.ts` example and a `deno.json` configuration.

---

## Versions

* Deno: `v2.7.14+`
* Raylib: `6.0`

---

## Manual Installation (Optional)

If you prefer to set up manually, clone the repository:

```bash
git clone https://github.com/JJLDonley/Deno-Raylib raylib
```

### Native Blobs (Required)

Raylib requires native shared libraries at runtime. You must have the correct platform library inside `./blobs/`.

Expected layout:

```text
./blobs/
  raylib.dll          (Windows)
  libraylib.so        (Linux)
  libraylib.dylib     (macOS)
```

#### Download Blobs

**Linux / macOS**
```bash
chmod +x tools/blobs.sh
./tools/blobs.sh
```

**Windows**
```powershell
powershell -ExecutionPolicy Bypass -File .\tools\blobs.ps1
```

---

## Configuration

If you didn't use the `init` script, ensure your `deno.json` is configured:

```json
{
  "compilerOptions": {
    "types": ["./raylib/global.d.ts"]
  },
  "imports": {
    "raylib": "./raylib/raylib.ts"
  }
}
```

---

## Usage

Import raylib:

```ts
import * as raylib from "raylib";
```

### Example

```ts
import * as raylib from "raylib";

function main() {
  raylib.InitWindow(800, 600, "Deno Raylib Example");
  raylib.SetTargetFPS(60);

  while (!raylib.WindowShouldClose()) {
    raylib.BeginDrawing();

    raylib.ClearBackground(raylib.RayWhite);

    raylib.DrawText(
      "Hello, Deno Raylib!",
      10,
      10,
      20,
      raylib.Black,
    );

    raylib.EndDrawing();
  }

  raylib.CloseWindow();
}

main();
```

---

## Runtime Library Mapping

Libraries are loaded from `./blobs/`.

* Windows → `raylib.dll`
* Linux → `libraylib.so`
* macOS → `libraylib.dylib`

---

## License

MIT
