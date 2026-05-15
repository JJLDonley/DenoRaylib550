# Deno Raylib 6.0

TypeScript bindings for raylib on Deno with a focus on staying as close to the C API as possible.

## Versions

* Deno: `v2.7.14+`
* Raylib: `6.0`

---

## Install

Clone the repository and rename it to what you'd like.

```bash id="x95j2v"
git clone https://github.com/JJLDonley/Deno-Raylib
mv Deno-Raylib <project_name>
```

alternatively:
```bash id="x95j2v"
git clone https://github.com/JJLDonley/Deno-Raylib <project_name>

```


Project layout:

```text id="20jrzh"
raylib/
  blobs/
  hotreload/
  raylib/
  deno.jsonc
```

---

## Native Blobs (Required)

Raylib requires native shared libraries at runtime.

You must have the correct platform library inside `./blobs/`.

Expected layout:

```text id="2wdf5h"
./blobs/
  raylib.dll          (Windows)
  libraylib.so        (Linux)
  libraylib.dylib     (macOS)
```

---

## Download Blobs

### Linux / macOS

```bash id="c5h5d2"
chmod +x tools/blobs.sh
./tools/blobs.sh
```

### Windows

```powershell id="i7ph3n"
powershell -ExecutionPolicy Bypass -File .\tools\blobs.ps1
```

These scripts:

* Detect your platform and architecture
* Download the correct raylib 6.0 release
* Extract the native library
* Copy it into `./blobs/`

Recommended to just extract the libraries yourself.

---

## Configuration

Create `deno.json`:

```json id="cr75u2"
{
  "tasks": {
    "dev": "deno run -Ar main.ts",
    "build:win": "deno compile --target x86_64-pc-windows-msvc --no-terminal -Ar -o game.exe main.ts",
    "build:linux": "deno compile --target x86_64-unknown-linux-gnu -Ar -o game main.ts",
    "build:mac": "deno compile --target x86_64-apple-darwin -Ar -o game main.ts"
  },

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

```ts id="0vd34h"
import * as raylib from "raylib";
```

---

## Example

```ts id="h61o38"
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

Recommended project structure:

```text id="4l7fdd"
main.ts
raylib/
blobs/
```

---

## Runtime Library Mapping

Libraries are loaded from:

```text id="mchv3r"
./blobs/
```

Platform mapping:

* Windows → `raylib.dll`
* Linux → `libraylib.so`
* macOS → `libraylib.dylib`

---

## License

MIT
