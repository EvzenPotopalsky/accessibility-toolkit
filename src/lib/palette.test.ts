import { expect, test } from "vitest";
import { generatePalette } from "./palette";

test("generates five darker-to-lighter variations", () => {
  expect(generatePalette("#808080")).toEqual([
    "#333333",
    "#5a5a5a",
    "#808080",
    "#a6a6a6",
    "#cccccc",
  ]);
});

test("preserves and normalizes the base colour in the middle", () => {
  expect(generatePalette("ABC")?.[2]).toBe("#aabbcc");
});

test("returns null for an invalid base colour", () => {
  expect(generatePalette("#xyz")).toBeNull();
});
