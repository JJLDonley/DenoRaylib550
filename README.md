# Deno Raylib 6.0

Deno TypeScript bindings for raylib 6.0 with a focus on staying as close to 1:1
with the C API as possible.

## Versions

- Deno: v2.7.14+
- Raylib: 6.0

## Install

```bash
git clone https://github.com/JJLDonley/Deno-Raylib
mv Deno-Raylib raylib
```

## Native Blobs (Required)

Raylib requires native shared libraries at runtime.

You **must have the correct platform library in your project root under `./blobs/`**.

Expected layout:

```text
./blobs/
  raylib.dll          (Windows)
  libraylib.so        (Linux)
  libraylib.dylib     (macOS)
```

## Download Blobs

### Linux / macOS

```bash
chmod +x blobs.sh
./blobs.sh
```

### Windows

```powershell
powershell -ExecutionPolicy Bypass -File .\blobs.ps1
```

These scripts:

- Download the correct raylib 6.0 release
- Extract the native library
- Place it directly into `./blobs/`

No manual copying required.

## Configuration

Create `deno.json`:

```json
{
  "tasks": {
    "dev": "deno run --watch -Ar main.ts",
    "build:win": "deno compile --target x86_64-pc-windows-msvc --no-terminal -Ar -o game.exe main.ts",
    "build:linux": "deno compile --target x86_64-unknown-linux-gnu -Ar -o game main.ts",
    "build:mac": "deno compile --target x86_64-apple-darwin -Ar -o mygame main.ts"
  },
  "compilerOptions": {
    "types": ["./raylib/global.d.ts"]
  },
  "imports": {
    "raylib": "./raylib/raylib.ts"
  }
}
```

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
    raylib.ClearBackground(raylib.RAYWHITE);
    raylib.DrawText("Hello, Deno Raylib!", 10, 10, 20, raylib.BLACK);
    raylib.EndDrawing();
  }

  raylib.CloseWindow();
}

main();
```

## Notes

- Loads from:
  ```ts
  ./blobs/${platform}
  ```

- Mapping:
  - windows → raylib.dll
  - linux → libraylib.so
  - darwin → libraylib.dylib

## License

MIT
