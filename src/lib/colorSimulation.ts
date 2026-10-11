import { hexToRgb, linearToSrgb, srgbToLinear } from "./colors";
export type SimulationType = "protanopia" | "deuteranopia" | "tritanopia";

type MatrixRow = [number, number, number];
type ColorMatrix = [MatrixRow, MatrixRow, MatrixRow];

export const simulationMatrices: Record<SimulationType, ColorMatrix> = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

export function simulateColor(
  input: string,
  simulation: SimulationType,
): string | null {
  const rgb = hexToRgb(input);

  if (rgb === null) {
    return null;
  }

  const red = srgbToLinear(rgb.r);
  const green = srgbToLinear(rgb.g);
  const blue = srgbToLinear(rgb.b);

  const matrix = simulationMatrices[simulation];

  const channels = matrix.map((row) => {
    const transformed = row[0] * red + row[1] * green + row[2] * blue;

    return linearToSrgb(transformed);
  });

  const hex = channels
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("");

  return `#${hex}`;
}
