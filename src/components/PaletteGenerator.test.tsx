import { afterEach, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaletteGenerator from "./PaletteGenerator";

afterEach(() => vi.restoreAllMocks());

test("keeps the last valid palette and share URL while the base input is invalid", async () => {
  window.history.replaceState(null, "", "/palette?source=demo&base=808080&target=AA");
  const user = userEvent.setup();
  render(<PaletteGenerator initialBase="#808080" initialTarget="AA" />);
  const input = screen.getByRole("textbox", { name: "Base colour" });
  await user.clear(input);
  await user.type(input, "#xyz");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("#808080")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Copy palette as CSS" })).toBeDisabled();
  expect(new URL(window.location.href).searchParams.get("base")).toBe("808080");
  expect(new URL(window.location.href).searchParams.get("source")).toBe("demo");
  await user.clear(input);
  await user.type(input, "#abc");
  expect(screen.getByText("#aabbcc")).toBeInTheDocument();
  expect(input).toHaveAttribute("aria-invalid", "false");
});

test("changes target evaluations without changing shades and carries a pairing to contrast", async () => {
  const user = userEvent.setup();
  render(<PaletteGenerator initialBase="#808080" initialTarget="AA" />);
  const firstPairing = screen.getByRole("link", { name: "Check black text on shade 1" });
  expect(firstPairing).toHaveAttribute("href", "/contrast?fg=000000&bg=333333");
  await user.selectOptions(screen.getByRole("combobox", { name: "Normal-text contrast target" }), "AAA");
  expect(screen.getByText("#808080")).toBeInTheDocument();
  expect(screen.getByText(/Black text: 5.32:1 — AAA Fail/)).toBeInTheDocument();
  expect(new URL(window.location.href).searchParams.get("target")).toBe("AAA");
});

test("copies the generated CSS variables", async () => {
  const user = userEvent.setup();
  const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
  render(<PaletteGenerator initialBase="#808080" initialTarget="AA" />);
  await user.click(screen.getByRole("button", { name: "Copy palette as CSS" }));
  expect(write).toHaveBeenCalledWith(":root {\n  --palette-1: #333333;\n  --palette-2: #5a5a5a;\n  --palette-3: #808080;\n  --palette-4: #a6a6a6;\n  --palette-5: #cccccc;\n}");
  expect(screen.getByRole("status")).toHaveTextContent("Palette copied as CSS variables.");
});

test("shows a manual-copy fallback when clipboard access fails", async () => {
  const user = userEvent.setup();
  vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("Denied"));
  render(<PaletteGenerator initialBase="#808080" initialTarget="AA" />);
  await user.click(screen.getByRole("button", { name: "Copy palette as CSS" }));
  expect(screen.getByRole("status")).toHaveTextContent("Could not copy the palette");
});
