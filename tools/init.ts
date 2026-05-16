import { join } from "path";

const VERSION = "6.0";

async function download(url: string, dest: string) {
  console.log(`Downloading ${url} to ${dest}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.statusText}`);
  }
  const data = await response.arrayBuffer();
  await Deno.writeFile(dest, new Uint8Array(data));
}

async function downloadBlobs() {
  const os = Deno.build.os;
  const arch = Deno.build.arch;

  let pattern: string;
  let libName: string;

  switch (os) {
    case "windows":
      pattern = "win64.*\\.zip";
      libName = "raylib.dll";
      break;
    case "linux":
      pattern = arch === "x86_64"
        ? "linux.*(amd64|x86_64).*\\.tar\\.gz"
        : "linux.*(arm64|aarch64).*\\.tar\\.gz";
      libName = "libraylib.so";
      break;
    case "darwin":
      pattern = "macos.*\\.tar\\.gz";
      libName = "libraylib.dylib";
      break;
    default:
      throw new Error(`Unsupported OS: ${os}`);
  }

  const api =
    `https://api.github.com/repos/raysan5/raylib/releases/tags/${VERSION}`;
  const response = await fetch(api);
  if (!response.ok) {
    throw new Error(`Failed to fetch release info: ${response.statusText}`);
  }
  const release = await response.json();
  const asset = release.assets.find((a: any) =>
    new RegExp(pattern).test(a.name)
  );

  if (!asset) {
    throw new Error(`No matching raylib release asset found for ${os}/${arch}`);
  }

  const url = asset.browser_download_url;
  const tmpDir = await Deno.makeTempDir();
  const archivePath = join(tmpDir, asset.name);

  await download(url, archivePath);

  console.log("Extracting...");
  const command = os === "windows"
    ? new Deno.Command("powershell", {
      args: [
        "-Command",
        `Expand-Archive -Path "${archivePath}" -DestinationPath "${tmpDir}" -Force`,
      ],
    })
    : new Deno.Command("tar", {
      args: ["-xzf", archivePath, "-C", tmpDir],
    });

  const { success, stderr } = await command.output();
  if (!success) {
    throw new Error(`Extraction failed: ${new TextDecoder().decode(stderr)}`);
  }

  // Find the library file in extracted content
  async function findLib(dir: string): Promise<string | undefined> {
    for await (const entry of Deno.readDir(dir)) {
      if (entry.name.startsWith(libName)) {
        return join(dir, entry.name);
      }
      if (entry.isDirectory) {
        const found = await findLib(join(dir, entry.name));
        if (found) return found;
      }
    }
  }

  const foundPath = await findLib(tmpDir);
  if (!foundPath) {
    throw new Error(`Library ${libName} not found in archive`);
  }

  await Deno.mkdir("blobs", { recursive: true });
  await Deno.copyFile(foundPath, join("blobs", libName));
  console.log(`Installed ${libName} to ./blobs/`);

  await Deno.remove(tmpDir, { recursive: true });
}

async function copyRecursive(src: string, dst: string) {
  await Deno.mkdir(dst, { recursive: true });
  for await (const entry of Deno.readDir(src)) {
    const srcPath = join(src, entry.name);
    const dstPath = join(dst, entry.name);
    if (entry.isDirectory) {
      await copyRecursive(srcPath, dstPath);
    } else {
      await Deno.copyFile(srcPath, dstPath);
    }
  }
}

async function setupProject() {
  const tmpDir = await Deno.makeTempDir();
  console.log("Cloning Deno-Raylib repository...");

  const cloneCommand = new Deno.Command("git", {
    args: [
      "clone",
      "--depth",
      "1",
      "https://github.com/JJLDonley/Deno-Raylib",
      tmpDir,
    ],
  });

  const { success: cloneSuccess, stderr: cloneStderr } = await cloneCommand
    .output();
  if (!cloneSuccess) {
    throw new Error(`Clone failed: ${new TextDecoder().decode(cloneStderr)}`);
  }

  console.log("Copying raylib bindings...");

  // Create raylib directory
  await Deno.mkdir("raylib", { recursive: true });

  // Copy files
  const filesToCopy = ["raylib.ts", "global.d.ts"];
  for (const file of filesToCopy) {
    await Deno.copyFile(join(tmpDir, file), join("raylib", file));
  }

  // Copy bindings directory recursively (OS-agnostic)
  await copyRecursive(join(tmpDir, "bindings"), join("raylib", "bindings"));

  // Remove generators from copied bindings
  try {
    await Deno.remove(join("raylib", "bindings", "generators"), {
      recursive: true,
    });
  } catch (_e) {
    // Ignore if it doesn't exist
  }

  await Deno.remove(tmpDir, { recursive: true });

  // Create main.ts
  const mainTs = `import * as raylib from "raylib";

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
`;
  await Deno.writeTextFile("main.ts", mainTs);
  console.log("Created main.ts");

  // Create deno.json
  const denoJson = {
    "tasks": {
      "dev": "deno run -Ar main.ts",
      "build:win":
        "deno compile --target x86_64-pc-windows-msvc --no-terminal -Ar -o game.exe main.ts",
      "build:linux":
        "deno compile --target x86_64-unknown-linux-gnu -Ar -o game main.ts",
      "build:mac":
        "deno compile --target x86_64-apple-darwin -Ar -o game main.ts",
    },
    "compilerOptions": {
      "types": ["./raylib/global.d.ts"],
    },
    "imports": {
      "raylib": "./raylib/raylib.ts",
    },
  };
  await Deno.writeTextFile("deno.json", JSON.stringify(denoJson, null, 2));
  console.log("Created deno.json");
}

async function main() {
  try {
    console.log("Setting up Deno Raylib project...");
    await downloadBlobs();
    await setupProject();
    console.log("Successfully set up project!");
    console.log("Run 'deno task dev' to start.");
  } catch (error) {
    console.error("Error during setup:", error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
