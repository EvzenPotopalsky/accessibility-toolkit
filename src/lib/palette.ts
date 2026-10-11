import { hexToRgb } from "./colors";

export function generatePalette(input: string): string[] | null {
  const rgb = hexToRgb(input);

  if (rgb === null) {
    return null;
  }

  const adjustments = [-0.6, -0.3, 0, 0.3, 0.6];

  return adjustments.map((adjustment) => {
    const channels = [rgb.r, rgb.g, rgb.b].map((channel) => {
      const mixed =
        adjustment < 0
          ? channel * (1 + adjustment)
          : channel + (255 - channel) * adjustment;

      return Math.round(mixed);
    });

    const hex = channels
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("");

    return `#${hex}`;
  });
}
