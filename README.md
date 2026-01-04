# Deno Raylib 5.5

Deno TypeScript bindings for raylib 5.5 with a focus on staying as close to
1:1 with the C API as possible.

## Versions

- Deno: v2.6.3
- Raylib: 5.5

## Install

```bash
git clone https://github.com/JJLDonley/DenoRaylib550
mv DenoRaylib550 raylib
```

IMPORTANT: Copy `blobs` to your project root.
The blobs are the platform DLLs shipped in the `raylib/blobs` folder.
Raylib will not run without them.

Options:
- Run `./blobs.ps1` in your project root (requires 7zip).
- Download blobs from the raylib 5.5 release page.

Create `deno.json` with:

```json
{
  "tasks": {
    "dev": "deno run --watch main.ts",
    "W_Build": "deno compile --target x86_64-pc-windows-msvc --no-terminal --output mygame.exe -Ar main.ts",
    "L_Build": "deno compile --target x86_64-unknown-linux-gnu --output mygame.exe -Ar main.ts",
    "M_Build": "deno compile --target x86_64-apple-darwin --output mygame.exe -Ar main.ts"
  },
  "compilerOptions": {
    "types": ["./raylib/global.d.ts"]
  },
  "imports": {
    "raylib": "./raylib/raylib.ts"
  }
}
```
## Using Raylib

Import `raylib` with:

```typescript
import * as raylib from "raylib";
```

Here is a simple raylib example:

```typescript
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

## Examples

You can run examples with:

```bash
deno run ./raylib/examples/core/<file_name>.ts
```

## License

MIT
