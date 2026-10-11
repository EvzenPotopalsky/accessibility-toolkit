import { expect, test } from "vitest";
import { simulateColor, type SimulationType } from "./colorSimulation";

const simulationTypes: SimulationType[] = [
  "protanopia",
  "deuteranopia",
  "tritanopia",
];

test("preserves black, white, and neutral grey in every simulation", () => {
  for (const simulation of simulationTypes) {
    expect(simulateColor("#000000", simulation)).toBe("#000000");
    expect(simulateColor("#ffffff", simulation)).toBe("#ffffff");
    expect(simulateColor("#808080", simulation)).toBe("#808080");
  }
});

test("returns null for an invalid colour", () => {
  for (const simulation of simulationTypes) {
    expect(simulateColor("#xyz", simulation)).toBeNull();
  }
});

test("transforms pure red under protanopia", () => {
  expect(simulateColor("#ff0000", "protanopia")).toBe("#6d5f00");
});
