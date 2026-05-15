param(
    [string]$Version = "6.0",
    [string]$OutDir = "blobs"
)

$ErrorActionPreference = "Stop"

$Root  = Get-Location
$Tmp   = Join-Path $Root "_raylib_tmp"
$Blobs = Join-Path $Root $OutDir

if (Test-Path $Tmp) {
    Remove-Item $Tmp -Recurse -Force
}

New-Item -ItemType Directory -Force $Tmp, $Blobs | Out-Null

$Api = "https://api.github.com/repos/raysan5/raylib/releases/tags/$Version"

Write-Output "Fetching raylib $Version release metadata..."

$Release = Invoke-RestMethod `
    -Uri $Api `
    -Headers @{ "User-Agent" = "raylib-windows-blob-downloader" }

$Asset = $Release.assets |
    Where-Object { $_.name -match "raylib-$Version.*win64.*\.zip$" } |
    Select-Object -First 1

if (-not $Asset) {
    Write-Output "Available assets:"
    $Release.assets | ForEach-Object { Write-Output "  $($_.name)" }
    throw "No Windows x64 asset found for raylib $Version"
}

$Zip = Join-Path $Tmp $Asset.name

Write-Output "Downloading $($Asset.name)..."

Invoke-WebRequest `
    -Uri $Asset.browser_download_url `
    -OutFile $Zip `
    -Headers @{ "User-Agent" = "raylib-windows-blob-downloader" }

Write-Output "Extracting..."

Expand-Archive -Force $Zip $Tmp

$Dll = Get-ChildItem $Tmp -Recurse -Filter "raylib.dll" |
    Select-Object -First 1

if (-not $Dll) {
    throw "raylib.dll not found in downloaded archive"
}

$Out = Join-Path $Blobs "raylib.dll"

if (Test-Path $Out) {
    Remove-Item $Out -Force
}

Copy-Item $Dll.FullName $Out -Force

Remove-Item $Tmp -Recurse -Force

Write-Output "Done:"
Write-Output "  $Out"
