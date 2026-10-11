import Link from "next/link";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <h1>Accessibility Toolkit</h1>

      <p>
        Explore colour contrast and create more accessible colour combinations.
      </p>

      <h2>Our tools</h2>

      <ul>
        <li>
          <Link href="/contrast">Contrast checker</Link> — check a colour pair
          against WCAG contrast thresholds.
        </li>
        <li>
          <Link href="/simulator">Colour-blindness simulator</Link> — explore
          colour vision simulations.
        </li>
        <li>
          <Link href="/palette">Palette generator</Link> — generate shades and
          check text contrast.
        </li>
      </ul>

      <p>
        Sufficient contrast makes text and important interface elements easier
        to distinguish.
      </p>
    </main>
  );
}
