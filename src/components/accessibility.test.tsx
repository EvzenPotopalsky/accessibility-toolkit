import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import ContrastChecker from "./ContrastChecker";
import ColorSimulator from "./ColorSimulator";
import PaletteGenerator from "./PaletteGenerator";

const tools = [
  {
    name: "Contrast checker",
    component: (
      <ContrastChecker
        initialForeground="#171717"
        initialBackground="#ffffff"
      />
    ),
  },
  {
    name: "Colour simulator",
    component: (
      <ColorSimulator initialColors={["#dc2626", "#16a34a", "#2563eb"]} />
    ),
  },
  {
    name: "Palette generator",
    component: <PaletteGenerator initialBase="#2563eb" initialTarget="AA" />,
  },
];

test.each(tools)(
  "$name has no automatically detected accessibility violations",
  async ({ name, component }) => {
    window.history.replaceState(null, "", "/");

    const { container } = render(
      <main>
        <h1>{name}</h1>
        {component}
      </main>,
    );

    const results = await axe.run(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });

    expect(results.violations).toEqual([]);
  },
);
