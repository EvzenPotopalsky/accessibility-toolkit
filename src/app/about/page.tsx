import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About and Accessibility",
  description:
    "Learn how the colour tools work, their limitations and the site's accessibility approach.",
};

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <h1>About and Accessibility</h1>

      <p>
        Accessibility Toolkit helps you explore colour contrast and compare
        colour choices. Colour is only one part of accessibility, but these tools cannot
        establish whether an entire website meets WCAG.
      </p>

      <section>
        <h2>Contrast checker</h2>
        <p>
          The checker calculates relative luminance and contrast using the WCAG
          2.2 formula for opaque sRGB colours. It accepts three-digit and
          six-digit hex values.
        </p>
        <p>
          Pass/fail checks use the full calculated ratio. The displayed ratio is
          rounded to two decimal places.
        </p>
        <p>
          Large text means at least 24 CSS pixels or approximately 18.67 CSS
          pixels when bold. The non-text result checks the 3:1 threshold for the
          selected pair and evaluating a component also requires considering its
          relevant adjacent colours and visual information.
        </p>
      </section>

      <section>
        <h2>Colour vision simulator</h2>
        <p>
          The simulator applies transformation matrices from the Machado,
          Oliveira and Fernandes model to linear RGB values.
        </p>
        <p>
          These views are approximations and individual colour perception
          varies. The blue-yellow view uses the strongest tritanomaly setting as
          an approximation rather than an exact model of tritanopia. Simulated
          colours outside the sRGB range are clipped to displayable values.
        </p>
        <p>
          The simulator is not a medical assessment or an accessibility
          compliance test.
        </p>
      </section>

      <section>
        <h2>Palette generator</h2>
        <p>
          The generator mixes a base colour towards black and white to create
          five variations. It checks black and white text against each shade
          using normal-text AA or AAA thresholds.
        </p>
        <p>
          Selecting a target changes the contrast checks, not the generated
          shades. The palette is not guaranteed to pass and the shades are not
          perceptually evenly spaced.
        </p>
      </section>

      <section>
        <h2>Accessibility and testing</h2>
        <p>
          The site includes labelled controls, visible keyboard focus, a skip
          link, text-based results and support for system light and dark
          preferences.
        </p>
        <p>
          Automated tests cover colour calculations, selected interface
          behaviours and axe accessibility checks for the three tool
          components. Colour contrast is checked separately in the browser
          because the test environment does not support that axe rule.
        </p>

        <p>
          Earlier project checks reported scores of 100 in Lighthouse accessibility audits on all five pages in both
          light and dark themes. Manual checks covered keyboard navigation
          across the tools and layouts at 200% browser zoom. VoiceOver on macOS
          was used to verify the contrast checker’s result announcement.
        </p>

        <p>
          These checks cover a limited set of browsers, states, and
          interactions. Passing automated checks does not guarantee full
          accessibility.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">
              WCAG 2.2: Contrast Minimum
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html">
              WCAG 2.2: Contrast Enhanced
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html">
              WCAG 2.2: Non-text Contrast
            </a>
          </li>
          <li>
            <a href="https://doi.org/10.1109/TVCG.2009.113">
              Machado, Oliveira, and Fernandes: A Physiologically-based Model
              for Simulation of Color Vision Deficiency
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
