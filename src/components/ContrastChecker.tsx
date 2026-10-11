"use client";

import { useEffect, useState } from "react";
import {
  getContrastRatio,
  getContrastResults,
  normalizeHexColor,
} from "@/lib/colors";
import styles from "./ContrastChecker.module.css";
import Link from "next/link";
import useUrlSettingsSync from "./useUrlSettingsSync";
import { replaceUrlSettings, singleQueryValue } from "@/lib/urlSettings";

type ContrastCheckerProps = {
  initialForeground: string;
  initialBackground: string;
};

export default function ContrastChecker({
  initialForeground,
  initialBackground,
}: ContrastCheckerProps) {
  const [foreground, setForeground] = useState(initialForeground);
  const [background, setBackground] = useState(initialBackground);
  const [copyMessage, setCopyMessage] = useState("");

  const [validColors, setValidColors] = useState({
    foreground: initialForeground,
    background: initialBackground,
  });

  const [announcement, setAnnouncement] = useState("");

  useUrlSettingsSync((params) => {
    const foreground = normalizeHexColor(singleQueryValue(params, "fg") ?? "") ?? "#171717";
    const background = normalizeHexColor(singleQueryValue(params, "bg") ?? "") ?? "#ffffff";
    if (foreground !== validColors.foreground || background !== validColors.background) {
      setForeground(foreground);
      setBackground(background);
      setValidColors({ foreground, background });
      setCopyMessage("");
    }
  });

  const foregroundInvalid = normalizeHexColor(foreground) === null;
  const backgroundInvalid = normalizeHexColor(background) === null;

  const ratio = getContrastRatio(
    validColors.foreground,
    validColors.background,
  );

  const results = ratio === null ? null : getContrastResults(ratio);

  const aaNormalTextPasses = results?.aaNormalText;

  useEffect(() => {
    if (
      ratio === null ||
      foregroundInvalid ||
      backgroundInvalid ||
      aaNormalTextPasses === undefined
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAnnouncement(
        `Contrast ratio ${ratio.toFixed(2)} to 1. ${
          aaNormalTextPasses
            ? "Passes AA for normal text."
            : "Fails AA for normal text."
        }`,
      );
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [ratio, foregroundInvalid, backgroundInvalid, aaNormalTextPasses]);

  function updateForeground(value: string) {
    setCopyMessage("");
    setForeground(value);

    const normalized = normalizeHexColor(value);

    if (normalized !== null) {
      setValidColors((previous) => ({ ...previous, foreground: normalized }));
      replaceUrlSettings({ fg: normalized.slice(1), bg: validColors.background.slice(1) });
    }
  }

  function updateBackground(value: string) {
    setCopyMessage("");
    setBackground(value);

    const normalized = normalizeHexColor(value);

    if (normalized !== null) {
      setValidColors((previous) => ({ ...previous, background: normalized }));
      replaceUrlSettings({ fg: validColors.foreground.slice(1), bg: normalized.slice(1) });
    }
  }

  function swapColors() {
    replaceUrlSettings({ fg: validColors.background.slice(1), bg: validColors.foreground.slice(1) });
    setCopyMessage("");
    setForeground(validColors.background);
    setBackground(validColors.foreground);

    setValidColors((previous) => ({
      foreground: previous.background,
      background: previous.foreground,
    }));
  }

  async function copyResult() {
    if (
      ratio === null ||
      results === null ||
      foregroundInvalid ||
      backgroundInvalid
    ) {
      return;
    }

    const summary = [
      `Text colour: ${validColors.foreground}`,
      `Background colour: ${validColors.background}`,
      `Contrast ratio: ${ratio.toFixed(2)}:1`,
      `AA normal text: ${results.aaNormalText ? "Pass" : "Fail"}`,
      `AA large text: ${results.aaLargeText ? "Pass" : "Fail"}`,
      `Non-text contrast threshold: ${results.aaNonText ? "Pass" : "Fail"}`,
      `AAA normal text: ${results.aaaNormalText ? "Pass" : "Fail"}`,
      `AAA large text: ${results.aaaLargeText ? "Pass" : "Fail"}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setCopyMessage("Result copied to clipboard.");
    } catch {
      setCopyMessage(
        "Could not copy the result. You can select and copy the results manually.",
      );
    }
  }

  return (
    <section className={styles.checker} aria-labelledby="checker-heading">
      <h2 id="checker-heading">Choose your colours</h2>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="foreground">Text colour</label>
          <input
            id="foreground"
            type="text"
            value={foreground}
            onChange={(event) => updateForeground(event.target.value)}
            spellCheck={false}
            aria-invalid={foregroundInvalid}
            aria-describedby={
              foregroundInvalid ? "foreground-error" : undefined
            }
          />

          <label htmlFor="foreground-picker">Pick text colour</label>
          <input
            id="foreground-picker"
            type="color"
            value={validColors.foreground}
            onChange={(event) => updateForeground(event.target.value)}
          />

          {foregroundInvalid && (
            <p id="foreground-error">
              Enter three or six hexadecimal characters, such as #abc or
              #aabbcc.
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="background">Background colour</label>
          <input
            id="background"
            type="text"
            value={background}
            onChange={(event) => updateBackground(event.target.value)}
            spellCheck={false}
            aria-invalid={backgroundInvalid}
            aria-describedby={
              backgroundInvalid ? "background-error" : undefined
            }
          />

          <label htmlFor="background-picker">Pick background colour</label>
          <input
            id="background-picker"
            type="color"
            value={validColors.background}
            onChange={(event) => updateBackground(event.target.value)}
          />
          {backgroundInvalid && (
            <p id="background-error">
              Enter three or six hexadecimal characters, such as #abc or #aabbcc.
            </p>
          )}
        </div>
      </div>

      <button type="button" onClick={swapColors} className={styles.button}>
        Swap colours
      </button>

      <section aria-labelledby="preview-heading">
        <h2 id="preview-heading">Preview</h2>

        <div
          className={styles.preview}
          style={{
            color: validColors.foreground,
            backgroundColor: validColors.background,
          }}
        >
          <p className={styles.normalText}>
            This is a sample of normal-sized text.
          </p>

          <p className={styles.largeText}>This is a sample of large text.</p>
        </div>
      </section>

      {(foregroundInvalid || backgroundInvalid) && (
        <p>
          Results use the last valid colour from each field: text colour{" "}
          {validColors.foreground} and background colour{" "}
          {validColors.background}.
        </p>
      )}

      {ratio !== null && results !== null ? (
        <>
          <h2>Contrast ratio</h2>
          <p>{ratio.toFixed(2)}:1</p>

          <h2>Results</h2>
          <ul>
            <li>AA normal text: {results.aaNormalText ? "Pass" : "Fail"}</li>
            <li>AA large text: {results.aaLargeText ? "Pass" : "Fail"}</li>
            <li>
              Non-text contrast threshold: {results.aaNonText ? "Pass" : "Fail"}
            </li>
            <li>AAA normal text: {results.aaaNormalText ? "Pass" : "Fail"}</li>
            <li>AAA large text: {results.aaaLargeText ? "Pass" : "Fail"}</li>
          </ul>
        </>
      ) : (
        <p>Enter valid three-digit or six-digit hex colours to see results.</p>
      )}

      <button
        type="button"
        onClick={copyResult}
        className={styles.button}
        disabled={foregroundInvalid || backgroundInvalid || ratio === null}
      >
        Copy results
      </button>

      {!foregroundInvalid && !backgroundInvalid && (
        <Link
          href={`/simulator?colors=${validColors.foreground.slice(1)},${validColors.background.slice(1)}`}
        >
          View these colours in the simulator
        </Link>
      )}

      <p role="status">{copyMessage}</p>

      <p className="sr-only" role="status" aria-atomic="true">
        {announcement}
      </p>
    </section>
  );
}
