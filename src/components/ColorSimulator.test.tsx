import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorSimulator from "./ColorSimulator";

test("keeps consecutive labels and moves focus after removing a colour", async () => {
  window.history.replaceState(null, "", "/simulator");

  const user = userEvent.setup();

  render(<ColorSimulator initialColors={["#dc2626", "#16a34a", "#2563eb"]} />);

  await user.click(screen.getByRole("button", { name: "Remove colour 2" }));

  const remainingBlueInput = screen.getByRole("textbox", {
    name: "Colour 2",
  });

  expect(remainingBlueInput).toHaveValue("#2563eb");
  expect(remainingBlueInput).toHaveFocus();
  expect(screen.getAllByRole("textbox")).toHaveLength(2);

  await user.click(screen.getByRole("button", { name: "Add colour" }));

  expect(screen.getByRole("textbox", { name: "Colour 3" })).toHaveValue(
    "#808080",
  );

  expect(remainingBlueInput).toHaveValue("#2563eb");
  expect(screen.getAllByRole("textbox")).toHaveLength(3);
});


test("keeps last-valid URL values and enforces the one-to-five colour limits", async () => {
  window.history.replaceState(null, "", "/simulator?colors=dc2626");
  const user = userEvent.setup();
  render(<ColorSimulator initialColors={["#dc2626"]} />);
  expect(screen.getByRole("button", { name: "Remove colour 1" })).toBeDisabled();
  const first = screen.getByRole("textbox", { name: "Colour 1" });
  await user.clear(first);
  await user.type(first, "#zz");
  expect(first).toHaveAttribute("aria-invalid", "true");
  expect(new URL(window.location.href).searchParams.get("colors")).toBe("dc2626");
  for (let i = 0; i < 4; i++) await user.click(screen.getByRole("button", { name: "Add colour" }));
  expect(screen.getAllByRole("textbox")).toHaveLength(5);
  expect(screen.getByRole("button", { name: "Add colour" })).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Remove colour 5" }));
  expect(screen.getByRole("textbox", { name: "Colour 4" })).toHaveFocus();
  expect(screen.getByRole("button", { name: "Add colour" })).toBeEnabled();
});
