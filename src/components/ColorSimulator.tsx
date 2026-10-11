"use client";

import { useRef, useState } from "react";
import { normalizeHexColor } from "@/lib/colors";
import { simulateColor, type SimulationType } from "@/lib/colorSimulation";
import useUrlSettingsSync from "./useUrlSettingsSync";
import { parsePalette, replaceUrlSettings, singleQueryValue } from "@/lib/urlSettings";
import styles from "./ColorSimulator.module.css";

type PaletteColor = {
  id: string;
  input: string;
  hex: string;
};

type ColorSimulatorProps = {
  initialColors: string[];
};

type PaletteView = {
  title: string;
  simulation: SimulationType | null;
};

const views: PaletteView[] = [
  { title: "Original palette", simulation: null },
  { title: "Protanopia simulation", simulation: "protanopia" },
  { title: "Deuteranopia simulation", simulation: "deuteranopia" },
  { title: "Tritanopia approximation", simulation: "tritanopia" },
];

export default function ColorSimulator({ initialColors }: ColorSimulatorProps) {
  const [palette, setPalette] = useState<PaletteColor[]>(() =>
    initialColors.map((hex, index) => ({
      id: `color-${index + 1}`,
      input: hex,
      hex,
    })),
  );

  const nextColorNumber = useRef(initialColors.length + 1);

  useUrlSettingsSync((params) => {
    const colors = parsePalette(singleQueryValue(params, "colors"));
    if (colors.join(",") !== palette.map((color) => color.hex).join(",")) {
      setPalette(colors.map((hex) => ({
        id: `color-${nextColorNumber.current++}`,
        input: hex,
        hex,
      })));
    }
  });

  function persistPalette(colors: PaletteColor[]) {
    replaceUrlSettings({ colors: colors.map((color) => color.hex.slice(1)).join(",") });
  }

  function updateColor(id: string, input: string) {
    const normalized = normalizeHexColor(input);

    const nextPalette = palette.map((color) =>
      color.id === id ? { ...color, input, hex: normalized ?? color.hex } : color,
    );
    setPalette(nextPalette);
    if (normalized !== null) persistPalette(nextPalette);
  }

  function addColor() {
    if (palette.length >= 5) {
      return;
    }

    const number = nextColorNumber.current;
    nextColorNumber.current += 1;

    const newColor: PaletteColor = {
      id: `color-${number}`,
      input: "#808080",
      hex: "#808080",
    };

    const nextPalette = [...palette, newColor];
    setPalette(nextPalette);
    persistPalette(nextPalette);
  }

  function removeColor(id: string) {
    if (palette.length <= 1) {
      return;
    }

    const index = palette.findIndex((color) => color.id === id);

    if (index === -1) {
      return;
    }

    const nextColor = palette[index + 1] ?? palette[index - 1];

    document.getElementById(`${nextColor.id}-input`)?.focus();

    const nextPalette = palette.filter((color) => color.id !== id);
    setPalette(nextPalette);
    persistPalette(nextPalette);
  }

  return (
    <>
      <section aria-labelledby="palette-heading">
        <h2 id="palette-heading">Edit your palette</h2>

        <div className={styles.inputs}>
          {palette.map((color, index) => {
            const name = `Colour ${index + 1}`;
            const invalid = normalizeHexColor(color.input) === null;
            const inputId = `${color.id}-input`;
            const errorId = `${color.id}-error`;

            return (
              <div key={color.id} className={styles.field}>
                <label htmlFor={inputId}>{name}</label>
                <input
                  id={inputId}
                  type="text"
                  value={color.input}
                  onChange={(event) =>
                    updateColor(color.id, event.target.value)
                  }
                  spellCheck={false}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? errorId : undefined}
                />

                <label htmlFor={`${color.id}-picker`}>
                  Pick {name.toLowerCase()}
                </label>
                <input
                  id={`${color.id}-picker`}
                  type="color"
                  value={color.hex}
                  onChange={(event) =>
                    updateColor(color.id, event.target.value)
                  }
                />

                {invalid && (
                  <p id={errorId}>
                    Enter a three-digit or six-digit hex colour. The previews
                    use the last valid value: {color.hex}.
                  </p>
                )}

                <button
                  type="button"
                  className={styles.button}
                  onClick={() => removeColor(color.id)}
                  disabled={palette.length <= 1}
                  aria-label={`Remove ${name.toLowerCase()}`}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.button}
          onClick={addColor}
          disabled={palette.length >= 5}
        >
          Add colour
        </button>

        <p role="status">{palette.length} of 5 colours.</p>
      </section>

      <div className={styles.views}>
        {views.map((view) => (
          <section key={view.title} className={styles.view}>
            <h2>{view.title}</h2>

            <ul className={styles.palette}>
              {palette.map((color, index) => {
                const name = `Colour ${index + 1}`;
                const displayedHex =
                  view.simulation === null
                    ? color.hex
                    : simulateColor(color.hex, view.simulation);

                return (
                  <li key={color.id}>
                    {displayedHex !== null ? (
                      <>
                        <div
                          className={styles.swatch}
                          aria-hidden="true"
                          style={{ backgroundColor: displayedHex }}
                        />
                        <p className={styles.colorLabel}>
                          {name}: {displayedHex}
                        </p>
                      </>
                    ) : (
                      <p>{name}: could not simulate this colour.</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
