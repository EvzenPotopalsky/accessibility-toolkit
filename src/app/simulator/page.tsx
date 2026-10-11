import type { Metadata } from "next";
import ColorSimulator from "@/components/ColorSimulator";
import { parsePalette } from "@/lib/urlSettings";

export const metadata: Metadata = {
  title: "Colour-blindness Simulator",
  description:
    "Explore how a palette may appear with different colour vision deficiencies.",
};

export default async function SimulatorPage({
  searchParams,
}: PageProps<"/simulator">) {
  const params = await searchParams;
  const initialColors = parsePalette(params.colors);

  return (
    <main id="main-content" tabIndex={-1}>
      <h1>Colour-blindness Simulator</h1>

      <p>
        Compare a palette under different colour vision simulations. Simulations
        are approximations, not medical assessments or proof of accessibility.
      </p>

      <p>
        The blue-yellow view uses the Machado model’s strongest tritanomaly
        setting as an approximation, rather than an exact model of tritanopia.
      </p>

      <ColorSimulator key={initialColors.join(",")} initialColors={initialColors} />
    </main>
  );
}
