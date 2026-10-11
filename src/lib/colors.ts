export function normalizeHexColor(input: string): string | null {
  const hex = input.trim().replace(/^#/, "");

  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
    return null;
  }

  const fullHex =
    hex.length === 3
      ? hex
          .split("")
          .map((character) => character + character)
          .join("")
      : hex;

  return `#${fullHex.toLowerCase()}`;
}

export type RGBColor = {
  r: number;
  g: number;
  b: number;
};

export function hexToRgb(input: string): RGBColor | null {
  const hex = normalizeHexColor(input);

  if (hex === null) {
    return null;
  }

  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export function srgbToLinear(channel: number): number {
  const normalized = channel / 255;

  if (normalized <= 0.04045) {
    return normalized / 12.92;
  }

  return ((normalized + 0.055) / 1.055) ** 2.4;
}

export function linearToSrgb(channel: number): number {
  const clamped = Math.min(1, Math.max(0, channel));

  const encoded =
    clamped <= 0.0031308
      ? clamped * 12.92
      : 1.055 * clamped ** (1 / 2.4) - 0.055;

  return Math.round(encoded * 255);
}

export function getRelativeLuminance(color: RGBColor): number {
  const red = srgbToLinear(color.r);
  const green = srgbToLinear(color.g);
  const blue = srgbToLinear(color.b);

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function getContrastRatio(
  foreground: string,
  background: string,
): number | null {
  const foregroundRgb = hexToRgb(foreground);
  const backgroundRgb = hexToRgb(background);

  if (foregroundRgb === null || backgroundRgb === null) {
    return null;
  }

  const foregroundLuminance = getRelativeLuminance(foregroundRgb);
  const backgroundLuminance = getRelativeLuminance(backgroundRgb);

  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastResults(ratio: number) {
  return {
    aaNormalText: ratio >= 4.5,
    aaLargeText: ratio >= 3,
    aaNonText: ratio >= 3,
    aaaNormalText: ratio >= 7,
    aaaLargeText: ratio >= 4.5,
  };
}
