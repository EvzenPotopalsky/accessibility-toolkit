import type { Metadata } from "next";
import PaletteGenerator from "@/components/PaletteGenerator";
import { normalizeHexColor } from "@/lib/colors";

export const metadata: Metadata = {
  title: "Palette Generator",
  description:
    "Generate colour variations and check their contrast with black and white text.",
};

export default async function PalettePage({
  searchParams,
}: PageProps<"/palette">) {
  const params = await searchParams;

  const initialBase =
    typeof params.base === "string"
      ? (normalizeHexColor(params.base) ?? "#2563eb")
      : "#2563eb";

  const initialTarget = params.target === "AAA" ? "AAA" : "AA";

  return (
    <main id="main-content" tabIndex={-1}>
      <h1>Palette Generator</h1>

      <p>
        Generate five colour variations and compare black and white text against
        WCAG normal-text contrast thresholds.
      </p>

      <PaletteGenerator
        key={`${initialBase}:${initialTarget}`}
        initialBase={initialBase}
        initialTarget={initialTarget}
      />
    </main>
  );
}
