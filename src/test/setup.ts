import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Reset DOM + storage between tests
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  vi.useRealTimers();
});

beforeEach(() => {
  localStorage.clear();
});

// ---- Web Audio API mock (sound.ts uses AudioContext) ----
class MockOscillator {
  type = "sine";
  frequency = { value: 0 };
  connect(node: any) { return node; }
  start() {}
  stop() {}
}
class MockGain {
  gain = {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  };
  connect(node: any) { return node; }
}
class MockAudioContext {
  currentTime = 0;
  destination = {};
  createOscillator() { return new MockOscillator(); }
  createGain() { return new MockGain(); }
}
(globalThis as any).AudioContext = MockAudioContext;
(globalThis as any).webkitAudioContext = MockAudioContext;

// ---- requestAnimationFrame for useAnimatedNumber ----
if (typeof globalThis.requestAnimationFrame === "undefined") {
  globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 16) as unknown as number);
  globalThis.cancelAnimationFrame = ((id: number) => clearTimeout(id)) as any;
}

// ---- matchMedia (radix / sidebar might query) ----
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// ---- confirm dialog auto-accept for resetSave tests (overridable per-test) ----
if (typeof window.confirm === "undefined") {
  window.confirm = () => true;
}
