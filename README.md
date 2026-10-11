# Accessibility Toolkit

Three colour tools built with Next.js, React and TypeScript: a contrast checker, colour vision simulator and palette generator.

Built to practise accessible interfaces, testable colour calculations and continuous integration.

## Features

- **Contrast checker:** compare text and background colours against WCAG AA/AAA contrast thresholds.
- **Colour vision simulator:** preview approximate views for protanopia, deuteranopia and tritanopia.
- **Palette generator:** create five shades, evaluate text contrast and export CSS custom properties.
- Share valid colour settings through URLs and transfer colours between tools.
- Keyboard-accessible controls, labelled inputs, screen-reader feedback and light/dark themes.

## Tech stack

Next.js App Router, React, TypeScript, CSS Modules, Vitest, React Testing Library, axe-core and GitHub Actions.

## Run locally

Use Node.js 24 and npm.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. No account, database or API key is required.

## Commands

| Command              | Purpose                      |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start the development server |
| `npm run build`      | Create a production build    |
| `npm start`          | Serve the production build   |
| `npm run lint`       | Run ESLint                   |
| `npm run typecheck`  | Check TypeScript types       |
| `npm test`           | Run tests                    |
| `npm run test:watch` | Run tests while editing      |

## Project structure

- `src/app/` — pages, metadata and shared layout.
- `src/components/` — interactive tools and scoped styles.
- `src/lib/` — colour parsing, contrast, simulation and palette calculations.

Colour calculations are separated from UI components so they can be reused and tested independently.

## Accessibility and tests

The interface includes a skip link, visible keyboard focus, labelled controls and text-based results.

Tests cover colour calculations, selected interactions and automated accessibility checks. GitHub Actions runs lint, type-checking, tests and a production build.

Automated checks do not establish complete WCAG conformance.

## Limitations

- Inputs support opaque sRGB hex colours.
- Passing a contrast check does not make an entire interface accessible.
- Colour vision simulations are approximations.
- Generated shades are not guaranteed to meet contrast requirements.
- AA/AAA selection changes the evaluation, not the generated shades.

## Deployment

Deploy to a Next.js-compatible host. For a Node deployment, run `npm run build` followed by `npm start`.

The project is not configured as a static export.

## References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Machado, Oliveira and Fernandes colour vision model](https://doi.org/10.1109/TVCG.2009.113)

The blue-yellow simulation uses the model's strongest tritanomaly setting as an approximation of tritanopia.
