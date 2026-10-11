"use client";

import { useState } from "react";
import Link from "next/link";
import { generatePalette } from "@/lib/palette";
import {
  getContrastRatio,
  getContrastResults,
  normalizeHexColor,
} from "@/lib/colors";
import styles from "./PaletteGenerator.module.css";
import useUrlSettingsSync from "./useUrlSettingsSync";
import { replaceUrlSettings, singleQueryValue } from "@/lib/urlSettings";

type ContrastTarget = "AA" | "AAA";

type PaletteGeneratorProps = {
  initialBase: string;
  initialTarget: ContrastTarget;
};

export default function PaletteGenerator({
  initialBase,
  initialTarget,
}: PaletteGeneratorProps) {
  const [baseInput, setBaseInput] = useState(initialBase);
  const [validBase, setValidBase] = useState(initialBase);
  const [target, setTarget] = useState<ContrastTarget>(initialTarget);
  const [copyMessage, setCopyMessage] = useState("");

  useUrlSettingsSync((params) => {
    const base = normalizeHexColor(singleQueryValue(params, "base") ?? "") ?? "#2563eb";
    const nextTarget = singleQueryValue(params, "target") === "AAA" ? "AAA" : "AA";
    if (base !== validBase || nextTarget !== target) {
      setBaseInput(base);
      setValidBase(base);
      setTarget(nextTarget);
      setCopyMessage("");
    }
  });

  const invalid = normalizeHexColor(baseInput) === null;
  const palette = generatePalette(validBase);

  function updateBase(value: string) {
    setCopyMessage("");
    setBaseInput(value);

    const normalized = normalizeHexColor(value);

    if (normalized !== null) {
      setValidBase(normalized);
      replaceUrlSettings({ base: normalized.slice(1), target });
    }
  }

  async function copyPalette() {
    if (palette === null || invalid) {
      return;
    }

    const declarations = palette.map(
      (hex, index) => `  --palette-${index + 1}: ${hex};`,
    );

    const css = [":root {", ...declarations, "}"].join("\n");

    try {
      await navigator.clipboard.writeText(css);
      setCopyMessage("Palette copied as CSS variables.");
    } catch {
      setCopyMessage(
        "Could not copy the palette. Try again or copy the displayed hex values manually.",
      );
    }
  }

  return (
    <section className={styles.generator} aria-labelledby="generator-heading">
      <h2 id="generator-heading">Choose your base colour</h2>

      <div className={styles.field}>
        <label htmlFor="base-color">Base colour</label>
        <input
          id="base-color"
          type="text"
          value={baseInput}
          onChange={(event) => updateBase(event.target.value)}
          spellCheck={false}
          aria-invalid={invalid}
          aria-describedby={invalid ? "base-color-error" : undefined}
        />

        <label htmlFor="base-picker">Pick base colour</label>
        <input
          id="base-picker"
          type="color"
          value={validBase}
          onChange={(event) => updateBase(event.target.value)}
        />

        {invalid && (
          <p id="base-color-error">
            Enter a three-digit or six-digit hex colour. The palette uses the
            last valid value: {validBase}.
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="contrast-target">Normal-text contrast target</label>
        <select
          id="contrast-target"
          value={target}
          onChange={(event) => {
            const nextTarget = event.target.value === "AAA" ? "AAA" : "AA";
            setTarget(nextTarget);
            replaceUrlSettings({ base: validBase.slice(1), target: nextTarget });
          }}
        >
          <option value="AA">AA — at least 4.5:1</option>
          <option value="AAA">AAA — at least 7:1</option>
        </select>
      </div>

      <p>
        Shades are generated from your base colour. The target changes the
        pass/fail checks, not the generated shades.
      </p>

      <button
        type="button"
        className={styles.button}
        onClick={copyPalette}
        disabled={invalid || palette === null}
      >
        Copy palette as CSS
      </button>

      <p role="status">{copyMessage}</p>

      {palette !== null && !invalid && (
        <Link
          href={`/simulator?colors=${palette
            .map((hex) => hex.slice(1))
            .join(",")}`}
        >
          View this palette in the simulator
        </Link>
      )}

      {palette !== null ? (
        <ul className={styles.palette}>
          {palette.map((hex, index) => (
            <li key={index} className={styles.shade}>
              <h3>Shade {index + 1}</h3>

              <div
                className={styles.swatch}
                aria-hidden="true"
                style={{ backgroundColor: hex }}
              />

              <p>{hex}</p>

              <ul className={styles.pairings}>
                {["#000000", "#ffffff"].map((textColor) => {
                  const ratio = getContrastRatio(textColor, hex);

                  if (ratio === null) {
                    return (
                      <li key={textColor}>Could not calculate contrast.</li>
                    );
                  }

                  const results = getContrastResults(ratio);
                  const passes =
                    target === "AA"
                      ? results.aaNormalText
                      : results.aaaNormalText;

                  const textName = textColor === "#000000" ? "Black" : "White";

                  return (
                    <li key={textColor}>
                      {textName} text: {ratio.toFixed(2)}:1 — {target}{" "}
                      {passes ? "Pass" : "Fail"}.
                      <Link
                        href={`/contrast?fg=${textColor.slice(1)}&bg=${hex.slice(1)}`}
                      >
                        Check {textName.toLowerCase()} text on shade {index + 1}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>The palette could not be generated.</p>
      )}
    </section>
  );
}
