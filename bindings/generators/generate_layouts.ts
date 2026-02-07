// deno-lint-ignore-file no-explicit-any
// Generate layouts.ts from raylib_api.json (struct byte layouts)

const apiPath = new URL("./raylib_api.json", import.meta.url);
const api = JSON.parse(Deno.readTextFileSync(apiPath));

const aliasMap = new Map<string, string>(
  api.aliases.map((alias: { name: string; type: string }) => [
    alias.name,
    alias.type,
  ]),
);

const structMap = new Map<string, any>(
  api.structs.map((struct: any) => [struct.name, struct]),
);

const callbackSet = new Set<string>(api.callbacks.map((cb: any) => cb.name));

// Deno build arch mapping:
// - x86_64 or aarch64: 8-byte pointers
// - ia32 or arm (unsupported by Deno): 4-byte pointers
if (Deno.build.arch !== "x86_64" && Deno.build.arch !== "aarch64") {
  throw new Error(
    `Unsupported arch for layouts: ${Deno.build.arch}. Expected "x86_64" or "aarch64".`,
  );
}

const pointerSize = 8;

const longSize = (() => {
  // Windows LLP64: long is 4 even on 64-bit. Unix LP64: long is 8 on 64-bit.
  if (Deno.build.os === "windows") return 4;
  return pointerSize === 8 ? 8 : 4;
})();

const primitiveSize: Record<string, number> = {
  "void": 0,
  "bool": 1,
  "char": 1,
  "signed char": 1,
  "unsigned char": 1,
  "short": 2,
  "unsigned short": 2,
  "int": 4,
  "unsigned int": 4,
  "long": longSize,
  "unsigned long": longSize,
  "long long": 8,
  "unsigned long long": 8,
  "float": 4,
  "double": 8,
};

const primitiveAlign: Record<string, number> = {
  "void": 1,
  "bool": 1,
  "char": 1,
  "signed char": 1,
  "unsigned char": 1,
  "short": 2,
  "unsigned short": 2,
  "int": 4,
  "unsigned int": 4,
  "long": longSize,
  "unsigned long": longSize,
  "long long": 8,
  "unsigned long long": 8,
  "float": 4,
  "double": 8,
};

type TypeInfo = {
  kind: "primitive" | "pointer" | "struct" | "array" | "callback";
  type: string;
  size: number;
  align: number;
  count?: number;
  baseType?: string;
};

type FieldLayout = {
  name: string;
  type: string;
  offset: number;
  size: number;
  align: number;
  count?: number;
};

type StructLayout = {
  name: string;
  size: number;
  align: number;
  fields: FieldLayout[];
};

const structLayoutCache = new Map<string, StructLayout>();
const structLayoutInProgress = new Set<string>();

function alignTo(value: number, alignment: number): number {
  if (alignment <= 1) return value;
  const rem = value % alignment;
  return rem === 0 ? value : value + (alignment - rem);
}

function resolveAlias(type: string): string {
  let current = type;
  const seen = new Set<string>();
  while (aliasMap.has(current) && !seen.has(current)) {
    seen.add(current);
    current = aliasMap.get(current)!;
  }
  return current;
}

function stripConst(type: string): string {
  return type.replace(/^const\s+/, "").trim();
}

function parseArray(type: string): { base: string; count: number } | null {
  const match = type.match(/^(.*)\[(\d+)\]$/);
  if (!match) return null;
  return { base: match[1].trim(), count: Number(match[2]) };
}

function isPointer(type: string): boolean {
  return type.includes("*");
}

function typeInfo(type: string): TypeInfo {
  let t = stripConst(type);

  const arrayInfo = parseArray(t);
  if (arrayInfo) {
    const baseInfo = typeInfo(arrayInfo.base);
    return {
      kind: "array",
      type: `${baseInfo.type}[${arrayInfo.count}]`,
      size: baseInfo.size * arrayInfo.count,
      align: baseInfo.align,
      count: arrayInfo.count,
      baseType: baseInfo.type,
    };
  }

  if (isPointer(t)) {
    return {
      kind: "pointer",
      type: "pointer",
      size: pointerSize,
      align: pointerSize,
    };
  }

  t = resolveAlias(t);

  if (callbackSet.has(t)) {
    return {
      kind: "callback",
      type: "pointer",
      size: pointerSize,
      align: pointerSize,
    };
  }

  if (primitiveSize[t] !== undefined) {
    return {
      kind: "primitive",
      type: t,
      size: primitiveSize[t],
      align: primitiveAlign[t],
    };
  }

  if (structMap.has(t)) {
    const layout = computeStructLayout(t);
    return {
      kind: "struct",
      type: t,
      size: layout.size,
      align: layout.align,
    };
  }

  return {
    kind: "pointer",
    type: "pointer",
    size: pointerSize,
    align: pointerSize,
  };
}

function computeStructLayout(name: string): StructLayout {
  if (structLayoutCache.has(name)) return structLayoutCache.get(name)!;
  if (structLayoutInProgress.has(name)) {
    // Recursive structs should be pointer-based. Fall back to pointer sizing.
    return {
      name,
      size: pointerSize,
      align: pointerSize,
      fields: [],
    };
  }

  structLayoutInProgress.add(name);
  const struct = structMap.get(name);
  if (!struct) {
    const fallback = {
      name,
      size: pointerSize,
      align: pointerSize,
      fields: [],
    };
    structLayoutCache.set(name, fallback);
    structLayoutInProgress.delete(name);
    return fallback;
  }

  const fields: FieldLayout[] = [];
  let offset = 0;
  let maxAlign = 1;

  for (const field of struct.fields) {
    const info = typeInfo(field.type);
    const align = info.align;
    offset = alignTo(offset, align);
    fields.push({
      name: field.name,
      type: info.type,
      offset,
      size: info.size,
      align,
      count: info.count,
    });
    offset += info.size;
    if (align > maxAlign) maxAlign = align;
  }

  const size = alignTo(offset, maxAlign);
  const layout: StructLayout = {
    name,
    size,
    align: maxAlign,
    fields,
  };

  structLayoutCache.set(name, layout);
  structLayoutInProgress.delete(name);
  return layout;
}

const layouts = api.structs.map((s: any) => computeStructLayout(s.name));

let out = "// This file is generated by generate_layouts.ts\n\n";
out += `export const ABI = {\n`;
out += `  arch: ${JSON.stringify(Deno.build.arch)},\n`;
out += `  os: ${JSON.stringify(Deno.build.os)},\n`;
out += `  pointerSize: ${pointerSize},\n`;
out += `  longSize: ${longSize},\n`;
out += `} as const;\n\n`;

out += "export const STRUCT_LAYOUTS = {\n";
for (const layout of layouts) {
  out += `  ${layout.name}: {\n`;
  out += `    size: ${layout.size},\n`;
  out += `    align: ${layout.align},\n`;
  out += `    fields: [\n`;
  for (const field of layout.fields) {
    out +=
      `      { name: ${JSON.stringify(field.name)}, type: ${JSON.stringify(field.type)}, offset: ${field.offset}, size: ${field.size}, align: ${field.align}` +
      (field.count ? `, count: ${field.count}` : "") +
      " },\n";
  }
  out += "    ],\n";
  out += "  },\n";
}
out += "} as const;\n";

const outputPath = new URL("./layouts.ts", import.meta.url);
Deno.writeTextFileSync(outputPath, out);
