import { describe, it, expect } from "vitest";
import { STAGES, stageFromEarned } from "../data/stages";

describe("stageFromEarned", () => {
  it("returns 0 at the bottom", () => {
    expect(stageFromEarned(0)).toBe(0);
    expect(stageFromEarned(999)).toBe(0);
  });

  it("returns the right stage at each threshold", () => {
    expect(stageFromEarned(1_000)).toBe(1);
    expect(stageFromEarned(10_000)).toBe(2);
    expect(stageFromEarned(100_000)).toBe(3);
    expect(stageFromEarned(1_000_000)).toBe(4);
  });

  it("returns just-below stage one less", () => {
    expect(stageFromEarned(9_999)).toBe(1);
    expect(stageFromEarned(99_999)).toBe(2);
    expect(stageFromEarned(999_999)).toBe(3);
  });

  it("STAGES thresholds are strictly increasing", () => {
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i].threshold).toBeGreaterThan(STAGES[i - 1].threshold);
    }
  });
});
