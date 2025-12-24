# Raylib 5.5 for Deno

Raylib 5.5 native bindings and a thin wrapper for Deno using `Deno.dlopen()` and FFI.  
The goal of this project is to stay **1:1 with the Raylib C API**, with minimal abstraction.

This project is a **work in progress** while FFI edge cases and correctness issues are being fixed.

---

## Credits / Attribution

Some implementation patterns and lines of code are derived from **Lino Levan’s Raylib Deno port**:

https://github.com/lino-levan/raylib-deno

Lino’s project provided a class-style Raylib 5.0 wrapper and served as a reference for FFI layout and design decisions.

---

## Features

- Raylib 5.5 bindings
- 1:1 API mapping to the C headers
- Uses `Deno.dlopen()` with native blobs
- Thin wrapper layer
- No runtime dependencies
- Explicit FFI handling (buffers vs pointers)

---

## Platform Support

Prebuilt native Raylib blobs are supported for:

- Windows
- Linux
- macOS

---

## Native Blobs

By default, `Deno.dlopen()` loads prebuilt Raylib blobs.

### Option 1: Use Provided Blobs

Copy the `blobs/` folder into your project.

### Option 2: Build Your Own

Run:

    blobs.ps1

This script downloads and prepares Raylib binaries for Windows, Linux, and macOS.

---

## Deno Import Setup

Add an import map entry:
```ts
    {
      "imports": {
        "raylib": "./raylib/raylib.ts"
      }
    }
```
---

## Usage Example
```ts
    import * as RL from "raylib";

    const SCREEN_WIDTH = 800;
    const SCREEN_HEIGHT = 600;

    RL.InitWindow(SCREEN_WIDTH, SCREEN_HEIGHT, "Hello World");

    const text = "Welcome to Deno Raylib 5.5!";
    const textSize = 40;
    const textWidth = RL.MeasureText(text, textSize);

    const textX = (SCREEN_WIDTH - textWidth) / 2;
    const textY = (SCREEN_HEIGHT - textSize) / 2;

    while (!RL.WindowShouldClose()) {
        const mousePosition = RL.GetMousePosition();

        RL.BeginDrawing();
        RL.ClearBackground(RL.DarkBlue);

        RL.DrawCircle(
            mousePosition.x,
            mousePosition.y,
            20,
            RL.Red,
        );

        RL.DrawText(
            text,
            textX,
            textY,
            textSize,
            RL.Black,
        );

        RL.EndDrawing();
    }

    RL.CloseWindow();

```

Simple run: ` deno run -Ar main.ts `
You can change -Ar to any security settings you with, but you must allow ffi
---

## Project Status

- Active development
- API coverage is ongoing
- FFI correctness is the primary focus
- Expect breaking changes until stabilized

---

## License

MIT License

Copyright (c) 2025 Jeremiah Donley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
