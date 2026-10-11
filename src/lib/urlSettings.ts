import { normalizeHexColor } from "./colors";

export const defaultSimulatorColors = ["#dc2626", "#16a34a", "#2563eb"];

export function parsePalette(value: string | string[] | undefined): string[] {
  if (typeof value !== "string") return defaultSimulatorColors;
  const entries = value.split(",");
  if (entries.length < 1 || entries.length > 5) return defaultSimulatorColors;
  const colors: string[] = [];
  for (const entry of entries) {
    const normalized = normalizeHexColor(entry);
    if (normalized === null) return defaultSimulatorColors;
    colors.push(normalized);
  }
  return colors;
}

export function singleQueryValue(params: URLSearchParams, name: string) {
  const values = params.getAll(name);
  return values.length === 1 ? values[0] : undefined;
}

export function replaceUrlSettings(settings: Record<string, string>) {
  const url = new URL(window.location.href);
  for (const [name, value] of Object.entries(settings)) {
    url.searchParams.set(name, value);
  }
  window.history.replaceState(null, "", url);
}
