import type { Metadata } from "next";
import ContrastChecker from "@/components/ContrastChecker";
import { normalizeHexColor } from "@/lib/colors";

export const metadata: Metadata = {
  title: "Contrast Checker",
  description: "Check the contrast between foreground and background colours.",
};

export default async function ContrastPage({
  searchParams,
}: PageProps<"/contrast">) {
  const params = await searchParams;

  const initialForeground =
    typeof params.fg === "string"
      ? (normalizeHexColor(params.fg) ?? "#171717")
      : "#171717";

  const initialBackground =
    typeof params.bg === "string"
      ? (normalizeHexColor(params.bg) ?? "#ffffff")
      : "#ffffff";

  return (
    <main id="main-content" tabIndex={-1}>
      <h1>Contrast Checker</h1>
      <p>Compare two colours against WCAG contrast thresholds.</p>

      <ContrastChecker
        key={`${initialForeground}:${initialBackground}`}
        initialForeground={initialForeground}
        initialBackground={initialBackground}
      />
    </main>
  );
}
