import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  initialState,
  sanitizeState,
  loadState,
  saveState,
  clickIncome,
  passiveIncomePerSecond,
  businessCost,
  skillCost,
  applyXp,
  SAVE_KEY,
  SAVE_VERSION,
} from "../state";
import { JOBS } from "../data/jobs";
import { BUSINESSES } from "../data/businesses";
import { SKILLS } from "../data/skills";
import type { GameState } from "../types";

beforeEach(() => localStorage.clear());

describe("initialState", () => {
  it("has correct defaults", () => {
    const s = initialState();
    expect(s.money).toBe(0);
    expect(s.totalEarned).toBe(0);
    expect(s.health).toBe(80);
    expect(s.level).toBe(1);
    expect(s.xp).toBe(0);
    expect(s.stage).toBe(0);
    expect(s.taps).toBe(0);
    expect(s.currentJobId).toBe(JOBS[0].id);
    expect(s.version).toBe(SAVE_VERSION);
    expect(s.soundOn).toBe(true);
  });

  it("seeds all businesses at 0", () => {
    const s = initialState();
    for (const b of BUSINESSES) expect(s.businesses[b.id]).toBe(0);
  });

  it("seeds all skills at 0", () => {
    const s = initialState();
    for (const sk of SKILLS) expect(s.skills[sk.id]).toBe(0);
  });
});

describe("sanitizeState", () => {
  it("rejects null / non-object", () => {
    expect(sanitizeState(null)).toEqual(initialState());
    expect(sanitizeState(undefined)).toEqual(initialState());
    expect(sanitizeState(42)).toEqual(initialState());
  });

  it("rejects wrong version", () => {
    expect(sanitizeState({ version: 1, money: 999 }).money).toBe(0);
  });

  it("clamps health 0..100", () => {
    expect(sanitizeState({ version: SAVE_VERSION, health: -50 }).health).toBe(0);
    expect(sanitizeState({ version: SAVE_VERSION, health: 9999 }).health).toBe(100);
  });

  it("clamps skills 0..5", () => {
    const out = sanitizeState({
      version: SAVE_VERSION,
      skills: { farming: 99, driving: -3 },
    });
    expect(out.skills.farming).toBe(5);
    expect(out.skills.driving).toBe(0);
  });

  it("floors negative money to 0", () => {
    expect(sanitizeState({ version: SAVE_VERSION, money: -100 }).money).toBe(0);
  });

  it("filters non-string arrays", () => {
    const out = sanitizeState({
      version: SAVE_VERSION,
      marketOwned: ["a", 1, null, "b"],
      achievements: [true, "first-tap"],
    });
    expect(out.marketOwned).toEqual(["a", "b"]);
    expect(out.achievements).toEqual(["first-tap"]);
  });

  it("preserves valid data", () => {
    const out = sanitizeState({
      version: SAVE_VERSION,
      money: 500,
      totalEarned: 1000,
      level: 3,
      xp: 50,
      taps: 42,
    });
    expect(out.money).toBe(500);
    expect(out.totalEarned).toBe(1000);
    expect(out.level).toBe(3);
    expect(out.xp).toBe(50);
    expect(out.taps).toBe(42);
  });
});

describe("loadState / saveState", () => {
  it("returns initialState when nothing saved", () => {
    expect(loadState()).toEqual(initialState());
  });

  it("returns initialState on corrupt JSON", () => {
    localStorage.setItem(SAVE_KEY, "{not json");
    expect(loadState()).toEqual(initialState());
  });

  it("round-trips through localStorage", () => {
    const s = { ...initialState(), money: 1234, taps: 7 };
    saveState(s);
    const loaded = loadState();
    expect(loaded.money).toBe(1234);
    expect(loaded.taps).toBe(7);
  });

  it("swallows quota errors", () => {
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error("QuotaExceeded");
    });
    expect(() => saveState(initialState())).not.toThrow();
    Storage.prototype.setItem = orig;
  });
});

describe("clickIncome", () => {
  it("returns base job income with no skills", () => {
    const s = initialState();
    expect(clickIncome(s)).toBe(JOBS[0].baseIncome);
  });

  it("returns at least 1", () => {
    const s = { ...initialState(), currentJobId: "nonexistent" };
    expect(clickIncome(s)).toBeGreaterThanOrEqual(1);
  });

  it("stacks farming + driving multipliers", () => {
    const s: GameState = {
      ...initialState(),
      currentJobId: JOBS[0].id, // baseIncome 1
      skills: { ...initialState().skills, farming: 5, driving: 5 },
    };
    // 1 * (1 + 0.5) * (1 + 0.75) = 2.625 -> floor = 2
    expect(clickIncome(s)).toBe(2);
  });

  it("applies market click bonuses", () => {
    const s: GameState = {
      ...initialState(),
      currentJobId: "engineer", // baseIncome 110
      marketOwned: ["work-boots"], // +25%
    };
    expect(clickIncome(s)).toBe(Math.floor(110 * 1.25));
  });
});

describe("passiveIncomePerSecond", () => {
  it("is zero with no businesses", () => {
    expect(passiveIncomePerSecond(initialState())).toBe(0);
  });

  it("scales 1.5^(level-1)", () => {
    const s: GameState = {
      ...initialState(),
      businesses: { ...initialState().businesses, [BUSINESSES[0].id]: 3 },
    };
    expect(passiveIncomePerSecond(s)).toBeCloseTo(BUSINESSES[0].baseIncome * Math.pow(1.5, 2));
  });

  it("applies marketing skill multiplier", () => {
    const base: GameState = {
      ...initialState(),
      businesses: { ...initialState().businesses, [BUSINESSES[0].id]: 1 },
    };
    const boosted: GameState = { ...base, skills: { ...base.skills, marketing: 1 } };
    expect(passiveIncomePerSecond(boosted)).toBeCloseTo(passiveIncomePerSecond(base) * 1.2);
  });
});

describe("businessCost", () => {
  it("scales 1.8^level", () => {
    const s = initialState();
    const id = BUSINESSES[0].id;
    const c0 = businessCost(s, id);
    const c2 = businessCost({ ...s, businesses: { ...s.businesses, [id]: 2 } }, id);
    expect(c0).toBe(BUSINESSES[0].baseCost);
    expect(c2).toBe(Math.floor(BUSINESSES[0].baseCost * Math.pow(1.8, 2)));
  });

  it("haggling reduces cost (capped at 50%)", () => {
    const base = businessCost(initialState(), BUSINESSES[0].id);
    const s: GameState = {
      ...initialState(),
      skills: { ...initialState().skills, haggling: 5 },
    };
    // 1 - 5*0.05 = 0.75 multiplier (cap of 0.5 not reached at max skill 5)
    expect(businessCost(s, BUSINESSES[0].id)).toBe(Math.floor(BUSINESSES[0].baseCost * 0.75));
    expect(businessCost(s, BUSINESSES[0].id)).toBeLessThan(base);
  });

  it("never goes below 50% of base via the discount cap", () => {
    // Manually craft an out-of-range skills value to verify the clamp itself
    const s: GameState = {
      ...initialState(),
      skills: { ...initialState().skills, haggling: 100 as number },
    };
    expect(businessCost(s, BUSINESSES[0].id)).toBe(Math.floor(BUSINESSES[0].baseCost * 0.5));
  });

  it("returns Infinity for unknown business", () => {
    expect(businessCost(initialState(), "nope")).toBe(Infinity);
  });
});

describe("skillCost", () => {
  it("scales 3^level", () => {
    const s = initialState();
    const c0 = skillCost(s, "farming");
    const c2 = skillCost({ ...s, skills: { ...s.skills, farming: 2 } }, "farming");
    expect(c0).toBe(100);
    expect(c2).toBe(900);
  });

  it("returns Infinity for unknown skill", () => {
    expect(skillCost(initialState(), "nope" as any)).toBe(Infinity);
  });
});

describe("applyXp", () => {
  it("adds xp without leveling", () => {
    const r = applyXp(initialState(), 10);
    expect(r.leveledUp).toBe(false);
    expect(r.state.level).toBe(1);
    expect(r.state.xp).toBe(10);
  });

  it("levels up once", () => {
    const r = applyXp(initialState(), 100);
    expect(r.leveledUp).toBe(true);
    expect(r.state.level).toBe(2);
    expect(r.state.xp).toBe(0);
  });

  it("levels up multiple times in one call", () => {
    const r = applyXp(initialState(), 10000);
    expect(r.leveledUp).toBe(true);
    expect(r.state.level).toBeGreaterThan(2);
  });

  it("carries leftover xp", () => {
    const r = applyXp(initialState(), 150);
    expect(r.state.level).toBe(2);
    expect(r.state.xp).toBe(50);
  });
});
