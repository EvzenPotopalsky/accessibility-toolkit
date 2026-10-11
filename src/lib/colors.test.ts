import { expect, test } from "vitest";
import {
  getRelativeLuminance,
  hexToRgb,
  normalizeHexColor,
  getContrastRatio,
  getContrastResults,
  linearToSrgb,
  srgbToLinear,
} from "./colors";

test("expands a three-digit hex colour", () => {
  expect(normalizeHexColor("#abc")).toBe("#aabbcc");
});

test("normalizes whitespace and uppercase letters", () => {
  expect(normalizeHexColor(" #12AB34 ")).toBe("#12ab34");
});

test("accepts a colour without a hash", () => {
  expect(normalizeHexColor("ABC")).toBe("#aabbcc");
});

test("rejects an incomplete hex colour", () => {
  expect(normalizeHexColor("#12")).toBeNull();
});

test("rejects characters outside the hexadecimal range", () => {
  expect(normalizeHexColor("#gggggg")).toBeNull();
});

test("converts a six-digit hex colour to RGB", () => {
  expect(hexToRgb("#ff8000")).toEqual({
    r: 255,
    g: 128,
    b: 0,
  });
});

test("converts a three-digit hex colour to RGB", () => {
  expect(hexToRgb("#abc")).toEqual({
    r: 170,
    g: 187,
    b: 204,
  });
});

test("returns null when converting an invalid colour", () => {
  expect(hexToRgb("#xyz")).toBeNull();
});

test("black has a relative luminance of zero", () => {
  expect(getRelativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
});

test("white has a relative luminance of one", () => {
  expect(getRelativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1);
});

test("middle grey has the expected relative luminance", () => {
  expect(getRelativeLuminance({ r: 128, g: 128, b: 128 })).toBeCloseTo(
    0.21586,
    5,
  );
});

test("black against white has a contrast ratio of 21", () => {
  expect(getContrastRatio("#000000", "#ffffff")).toBeCloseTo(21);
});

test("identical colours have a contrast ratio of 1", () => {
  expect(getContrastRatio("#abc", "#abc")).toBeCloseTo(1);
});

test("swapping colours gives the same contrast ratio", () => {
  expect(getContrastRatio("#123456", "#abcdef")).toBe(
    getContrastRatio("#abcdef", "#123456"),
  );
});

test("returns null when either contrast colour is invalid", () => {
  expect(getContrastRatio("invalid", "#ffffff")).toBeNull();
  expect(getContrastRatio("#000000", "invalid")).toBeNull();
});

test("a ratio of 3 meets large-text AA and non-text thresholds", () => {
  expect(getContrastResults(3)).toEqual({
    aaNormalText: false,
    aaLargeText: true,
    aaNonText: true,
    aaaNormalText: false,
    aaaLargeText: false,
  });
});

test("a ratio of 4.5 meets normal-text AA and large-text AAA", () => {
  expect(getContrastResults(4.5)).toEqual({
    aaNormalText: true,
    aaLargeText: true,
    aaNonText: true,
    aaaNormalText: false,
    aaaLargeText: true,
  });
});

test("a ratio of 7 meets every contrast threshold", () => {
  expect(getContrastResults(7)).toEqual({
    aaNormalText: true,
    aaLargeText: true,
    aaNonText: true,
    aaaNormalText: true,
    aaaLargeText: true,
  });
});

test("values just below the thresholds fail", () => {
  expect(getContrastResults(2.999).aaLargeText).toBe(false);
  expect(getContrastResults(2.999).aaNonText).toBe(false);
  expect(getContrastResults(4.499).aaNormalText).toBe(false);
  expect(getContrastResults(4.499).aaaLargeText).toBe(false);
  expect(getContrastResults(6.999).aaaNormalText).toBe(false);
});

test("converts linear black and white to display values", () => {
  expect(linearToSrgb(0)).toBe(0);
  expect(linearToSrgb(1)).toBe(255);
});

test("clamps linear values outside the displayable range", () => {
  expect(linearToSrgb(-0.2)).toBe(0);
  expect(linearToSrgb(1.2)).toBe(255);
});

test("converts representative RGB values to linear and back", () => {
  for (const channel of [0, 10, 11, 128, 255]) {
    expect(linearToSrgb(srgbToLinear(channel))).toBe(channel);
  }
});
