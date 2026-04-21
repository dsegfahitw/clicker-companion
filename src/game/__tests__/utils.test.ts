import { describe, it, expect } from "vitest";
import {
  formatMoney,
  xpForLevel,
  dayIndex,
  seededShuffle,
  clamp,
  safeNum,
} from "../utils";

describe("formatMoney", () => {
  it("formats zero", () => {
    expect(formatMoney(0)).toMatch(/₴0/);
  });

  it("formats small numbers with locale separators", () => {
    const out = formatMoney(1234);
    expect(out).toContain("₴");
    expect(out).toMatch(/1[\s\u00A0]?23/); // "1.23K" actually -> uses K branch
  });

  it("uses K for >= 1k", () => {
    expect(formatMoney(1500)).toBe("₴1.50K");
  });

  it("uses M for >= 1M", () => {
    expect(formatMoney(2_500_000)).toBe("₴2.50M");
  });

  it("uses B for >= 1B", () => {
    expect(formatMoney(3_750_000_000)).toBe("₴3.75B");
  });

  it("uses T for >= 1T", () => {
    expect(formatMoney(1.2e12)).toBe("₴1.20T");
  });

  it("handles negatives with sign", () => {
    expect(formatMoney(-2500)).toBe("-₴2.50K");
  });

  it("returns ₴0 for NaN / Infinity", () => {
    expect(formatMoney(NaN)).toBe("₴0");
    expect(formatMoney(Infinity)).toBe("₴0");
    expect(formatMoney(-Infinity)).toBe("₴0");
  });
});

describe("xpForLevel", () => {
  it("is monotonically increasing", () => {
    let prev = -1;
    for (let lvl = 1; lvl <= 50; lvl++) {
      const v = xpForLevel(lvl);
      expect(v).toBeGreaterThan(prev);
      prev = v;
    }
  });

  it("returns expected values", () => {
    expect(xpForLevel(1)).toBe(100);
    expect(xpForLevel(10)).toBe(Math.floor(100 * Math.pow(10, 1.5)));
  });
});

describe("dayIndex", () => {
  it("is stable across the same day", () => {
    const t = 1_700_000_000_000;
    expect(dayIndex(t)).toBe(dayIndex(t + 1000));
  });

  it("increments after 24h", () => {
    const t = 1_700_000_000_000;
    expect(dayIndex(t + 86_400_000)).toBe(dayIndex(t) + 1);
  });
});

describe("seededShuffle", () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8];

  it("preserves length and members", () => {
    const out = seededShuffle(arr, 42);
    expect(out).toHaveLength(arr.length);
    expect([...out].sort()).toEqual([...arr].sort());
  });

  it("is deterministic for the same seed", () => {
    expect(seededShuffle(arr, 7)).toEqual(seededShuffle(arr, 7));
  });

  it("produces different results for different seeds", () => {
    const a = seededShuffle(arr, 1);
    const b = seededShuffle(arr, 999);
    expect(a).not.toEqual(b);
  });

  it("does not mutate the source", () => {
    const src = [...arr];
    seededShuffle(src, 5);
    expect(src).toEqual(arr);
  });
});

describe("clamp", () => {
  it("clamps to bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});

describe("safeNum", () => {
  it("returns the number when finite", () => {
    expect(safeNum(42)).toBe(42);
    expect(safeNum(0)).toBe(0);
  });

  it("returns fallback for non-numbers and non-finite", () => {
    expect(safeNum("3", 1)).toBe(1);
    expect(safeNum(undefined, 7)).toBe(7);
    expect(safeNum(NaN, 9)).toBe(9);
    expect(safeNum(Infinity, 4)).toBe(4);
  });
});
