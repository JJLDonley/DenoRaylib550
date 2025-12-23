# raylib 5.5 – cross-platform blobs (Windows, explicit 7-Zip path)

$ErrorActionPreference = "Stop"

$SEVEN_ZIP = "C:\Program Files\7-Zip\7z.exe"
if (-not (Test-Path $SEVEN_ZIP)) {
    throw "7-Zip not found at $SEVEN_ZIP"
}

$VER  = "5.5"
$BASE = "https://github.com/raysan5/raylib/releases/download/$VER"

$ROOT  = Get-Location
$BLOBS = Join-Path $ROOT "blobs"
$TMP   = Join-Path $ROOT "_raylib_tmp"

if (Test-Path $TMP) { Remove-Item $TMP -Recurse -Force }
New-Item -ItemType Directory -Force $TMP, $BLOBS | Out-Null

function Extract-TarGz-RealFile {
    param ($pkg, $regex, $outName, $outDir)

    $pkgPath = Join-Path $TMP $pkg
    Invoke-WebRequest "$BASE/$pkg" -OutFile $pkgPath

    & $SEVEN_ZIP x $pkgPath "-o$TMP" -y | Out-Null
    & $SEVEN_ZIP x ($pkgPath -replace '\.gz$','') "-o$TMP" -y | Out-Null

    $bin = Get-ChildItem $TMP -Recurse | Where-Object { $_.Name -match $regex } | Select-Object -First 1
    if (-not $bin) { throw "$outName not found in $pkg" }

    New-Item -ItemType Directory -Force $outDir | Out-Null
    Copy-Item $bin.FullName (Join-Path $outDir $outName) -Force
}

# ---- WINDOWS ----
Invoke-WebRequest "$BASE/raylib-5.5_win64_msvc16.zip" -OutFile "$TMP/win.zip"
Expand-Archive -Force "$TMP/win.zip" $TMP

$winDll = Get-ChildItem $TMP -Recurse -Filter raylib.dll | Select-Object -First 1
New-Item -ItemType Directory -Force "$BLOBS/windows/x64" | Out-Null
Copy-Item $winDll.FullName "$BLOBS/windows/x64/raylib.dll" -Force

# ---- LINUX ----
Extract-TarGz-RealFile `
    "raylib-5.5_linux_amd64.tar.gz" `
    "^libraylib\.so\.[0-9]+" `
    "libraylib.so" `
    "$BLOBS/linux/x64"

# ---- MACOS ----
Extract-TarGz-RealFile `
    "raylib-5.5_macos.tar.gz" `
    "^libraylib\.dylib" `
    "libraylib.dylib" `
    "$BLOBS/macos/x64"

Remove-Item $TMP -Recurse -Force

Write-Output "raylib 5.5 blobs ready in ./blobs"
