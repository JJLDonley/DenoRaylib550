#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-6.0}"
OUT_DIR="${2:-blobs}"

ROOT="$(pwd)"
TMP="$ROOT/_raylib_tmp"
BLOBS="$ROOT/$OUT_DIR"

mkdir -p "$TMP" "$BLOBS"

# --- detect OS ---
UNAME="$(uname -s)"
ARCH="$(uname -m)"

case "$UNAME" in
  Linux*)   OS="linux" ;;
  Darwin*)  OS="darwin" ;;
  MINGW*|MSYS*|CYGWIN*) OS="windows" ;;
  *) echo "Unsupported OS: $UNAME"; exit 1 ;;
esac

case "$ARCH" in
  x86_64|amd64) ARCH="x64" ;;
  arm64|aarch64) ARCH="arm64" ;;
  *) echo "Unsupported arch: $ARCH"; exit 1 ;;
esac

echo "Detected: $OS/$ARCH"

API="https://api.github.com/repos/raysan5/raylib/releases/tags/$VERSION"
ASSETS="$(curl -sL "$API")"

# --- asset selection ---
if [ "$OS" = "windows" ]; then
  PATTERN="win64.*\\.zip"
elif [ "$OS" = "linux" ]; then
  if [ "$ARCH" = "x64" ]; then
    PATTERN="linux.*(amd64|x86_64).*\\.tar\\.gz"
  else
    PATTERN="linux.*(arm64|aarch64).*\\.tar\\.gz"
  fi
elif [ "$OS" = "darwin" ]; then
  PATTERN="macos.*\\.tar\\.gz"
fi

URL="$(echo "$ASSETS" | grep browser_download_url | grep -E "$PATTERN" | cut -d '"' -f 4 | head -n 1)"

if [ -z "$URL" ]; then
  echo "No matching asset found"
  exit 1
fi

FILE="$TMP/$(basename "$URL")"

echo "Downloading: $URL"
curl -L "$URL" -o "$FILE"

echo "Extracting..."
if [[ "$FILE" == *.zip ]]; then
  unzip -q "$FILE" -d "$TMP"
else
  tar -xzf "$FILE" -C "$TMP"
fi

# --- output naming (matches your Deno code) ---
case "$OS" in
  windows) LIB_NAME="raylib.dll" ;;
  linux)   LIB_NAME="libraylib.so" ;;
  darwin)  LIB_NAME="libraylib.dylib" ;;
esac

FOUND="$(find "$TMP" -type f -name "$LIB_NAME*" | head -n 1)"

if [ -z "$FOUND" ]; then
  echo "Library not found"
  exit 1
fi

OUT="$BLOBS/$LIB_NAME"
cp "$FOUND" "$OUT"

rm -rf "$TMP"

echo "Done:"
echo "  $OUT"
