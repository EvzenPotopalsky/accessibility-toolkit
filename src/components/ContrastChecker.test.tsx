import { afterEach, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContrastChecker from "./ContrastChecker";

test("updates the contrast ratio when the text colour changes", async () => {
  const user = userEvent.setup();

  render(
    <ContrastChecker initialForeground="#171717" initialBackground="#ffffff" />,
  );

  const textInput = screen.getByRole("textbox", {
    name: "Text colour",
  });

  await user.clear(textInput);
  await user.type(textInput, "#000000");

  expect(textInput).toHaveValue("#000000");
  expect(screen.getByText("21.00:1")).toBeInTheDocument();
});

test("preserves valid results during invalid input and clears the error when corrected", async () => {
  const user = userEvent.setup();

  render(
    <ContrastChecker initialForeground="#000000" initialBackground="#ffffff" />,
  );

  const textInput = screen.getByRole("textbox", {
    name: "Text colour",
  });
  const copyButton = screen.getByRole("button", {
    name: "Copy results",
  });

  await user.clear(textInput);
  await user.type(textInput, "#xyz");

  expect(textInput).toHaveValue("#xyz");
  expect(textInput).toHaveAttribute("aria-invalid", "true");
  expect(textInput).toHaveAccessibleDescription(
    "Enter three or six hexadecimal characters, such as #abc or #aabbcc.",
  );
  expect(copyButton).toBeDisabled();
  expect(screen.getByText("21.00:1")).toBeInTheDocument();

  await user.clear(textInput);
  await user.type(textInput, "#ffffff");

  expect(textInput).toHaveAttribute("aria-invalid", "false");
  expect(
    screen.queryByText(
      "Enter three or six hexadecimal characters, such as #abc or #aabbcc.",
    ),
  ).not.toBeInTheDocument();
  expect(copyButton).toBeEnabled();
  expect(screen.getByText("1.00:1")).toBeInTheDocument();
});

test("swaps the colours and updates the shareable URL", async () => {
  window.history.replaceState(null, "", "/contrast");

  const user = userEvent.setup();

  render(
    <ContrastChecker initialForeground="#000000" initialBackground="#ffffff" />,
  );

  await user.click(screen.getByRole("button", { name: "Swap colours" }));

  expect(screen.getByRole("textbox", { name: "Text colour" })).toHaveValue(
    "#ffffff",
  );

  expect(
    screen.getByRole("textbox", { name: "Background colour" }),
  ).toHaveValue("#000000");

  expect(screen.getByText("21.00:1")).toBeInTheDocument();

  const params = new URL(window.location.href).searchParams;

  expect(params.get("fg")).toBe("ffffff");
  expect(params.get("bg")).toBe("000000");
});

test("announces the updated contrast result", async () => {
  const user = userEvent.setup();

  render(
    <ContrastChecker initialForeground="#171717" initialBackground="#ffffff" />,
  );

  const textInput = screen.getByRole("textbox", {
    name: "Text colour",
  });

  await user.clear(textInput);
  await user.type(textInput, "#000000");

  const announcement = await screen.findByText(
    "Contrast ratio 21.00 to 1. Passes AA for normal text.",
  );

  expect(announcement).toHaveAttribute("role", "status");
  expect(announcement).toHaveAttribute("aria-atomic", "true");
});


afterEach(() => vi.restoreAllMocks());

test("copies a report calculated from the current valid pair", async () => {
  const user = userEvent.setup();
  const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
  render(<ContrastChecker initialForeground="#000000" initialBackground="#ffffff" />);
  await user.click(screen.getByRole("button", { name: "Copy results" }));
  expect(write).toHaveBeenCalledWith(expect.stringContaining("Contrast ratio: 21.00:1"));
  expect(write).toHaveBeenCalledWith(expect.stringContaining("AAA normal text: Pass"));
  expect(screen.getByText("Result copied to clipboard.")).toBeInTheDocument();
});

test("reports a denied clipboard request without discarding results", async () => {
  const user = userEvent.setup();
  vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("Denied"));
  render(<ContrastChecker initialForeground="#000000" initialBackground="#ffffff" />);
  await user.click(screen.getByRole("button", { name: "Copy results" }));
  expect(screen.getByText(/Could not copy the result/)).toBeInTheDocument();
  expect(screen.getByText("21.00:1")).toBeInTheDocument();
});
