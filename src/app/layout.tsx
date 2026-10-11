import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Accessibility Toolkit",
    template: "%s | Accessibility Toolkit",
  },
  description:
    "Check colour contrast, explore colour-blindness simulations, and create accessible colour combinations.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <header className="site-header">
          <nav aria-label="Main navigation">
            <Link href="/">Home</Link>
            <Link href="/contrast">Contrast checker</Link>
            <Link href="/simulator">Colour-blindness simulator</Link>
            <Link href="/palette">Palette generator</Link>
            <Link href="/about">About and accessibility</Link>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
