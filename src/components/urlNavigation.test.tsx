import { afterEach, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import ContrastChecker from "./ContrastChecker";
import PaletteGenerator from "./PaletteGenerator";
import ColorSimulator from "./ColorSimulator";

function query(value: string) {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams(value) as ReturnType<typeof useSearchParams>,
  );
}

afterEach(() => vi.mocked(useSearchParams).mockReset());

test("restores a changed contrast query even when cached initial props are old", () => {
  query("fg=000000&bg=ffffff");
  const view = render(<ContrastChecker initialForeground="#000000" initialBackground="#ffffff" />);
  query("fg=123456&bg=abcdef");
  view.rerender(<ContrastChecker initialForeground="#000000" initialBackground="#ffffff" />);
  expect(screen.getByRole("textbox", { name: "Text colour" })).toHaveValue("#123456");
  expect(screen.getByRole("textbox", { name: "Background colour" })).toHaveValue("#abcdef");
});

test("restores AAA from the current query rather than cached AA props", () => {
  query("base=808080&target=AA");
  const view = render(<PaletteGenerator initialBase="#808080" initialTarget="AA" />);
  query("base=808080&target=AAA");
  view.rerender(<PaletteGenerator initialBase="#808080" initialTarget="AA" />);
  expect(screen.getByRole("combobox")).toHaveValue("AAA");
  expect(screen.getByText(/Black text: 5.32:1 — AAA Fail/)).toBeInTheDocument();
});

test("restores a simulator palette from current query settings", () => {
  query("colors=ffffff");
  const view = render(<ColorSimulator initialColors={["#ffffff"]} />);
  query("colors=000000,123456");
  view.rerender(<ColorSimulator initialColors={["#ffffff"]} />);
  expect(screen.getAllByRole("textbox")).toHaveLength(2);
  expect(screen.getByRole("textbox", { name: "Colour 2" })).toHaveValue("#123456");
});

test("own URL changes retain the raw draft and the focused input", async () => {
  query("base=808080&target=AA");
  const user = userEvent.setup();
  const view = render(<PaletteGenerator initialBase="#808080" initialTarget="AA" />);
  const input = screen.getByRole("textbox", { name: "Base colour" });
  await user.clear(input);
  await user.type(input, "ABC");
  query("base=aabbcc&target=AA");
  view.rerender(<PaletteGenerator initialBase="#808080" initialTarget="AA" />);
  expect(input).toHaveValue("ABC");
  expect(input).toHaveFocus();
});
