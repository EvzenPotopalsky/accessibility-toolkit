import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// Component tests isolate calculations/interactions from the Next router.
// Navigation is exercised separately against the production application.
vi.mock("next/navigation", () => ({ useSearchParams: vi.fn(() => null) }));
