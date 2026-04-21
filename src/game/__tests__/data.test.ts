import { describe, it, expect } from "vitest";
import { JOBS } from "../data/jobs";
import { BUSINESSES } from "../data/businesses";
import { SKILLS } from "../data/skills";
import { MARKET_ITEMS } from "../data/market";
import { ACHIEVEMENTS } from "../data/achievements";
import { EVENTS } from "../data/events";
import { DAILY_TASKS, DAILY_REWARDS } from "../data/dailyTasks";
import { initialState } from "../state";

function uniqueIds<T extends { id: string }>(arr: T[]) {
  return new Set(arr.map(x => x.id)).size === arr.length;
}

describe("data integrity", () => {
  it("JOBS have unique IDs", () => expect(uniqueIds(JOBS)).toBe(true));
  it("BUSINESSES have unique IDs", () => expect(uniqueIds(BUSINESSES)).toBe(true));
  it("SKILLS have unique IDs", () => expect(uniqueIds(SKILLS)).toBe(true));
  it("MARKET_ITEMS have unique IDs", () => expect(uniqueIds(MARKET_ITEMS)).toBe(true));
  it("ACHIEVEMENTS have unique IDs", () => expect(uniqueIds(ACHIEVEMENTS)).toBe(true));
  it("EVENTS have unique IDs", () => expect(uniqueIds(EVENTS)).toBe(true));
  it("DAILY_TASKS have unique IDs", () => expect(uniqueIds(DAILY_TASKS)).toBe(true));

  it("EVENTS have honest and corrupt branches with labels", () => {
    for (const e of EVENTS) {
      expect(e.honest.label).toBeTruthy();
      expect(e.corrupt.label).toBeTruthy();
    }
  });

  it("ACHIEVEMENT conditions are callable booleans", () => {
    const s = initialState();
    for (const a of ACHIEVEMENTS) {
      expect(typeof a.condition).toBe("function");
      expect(typeof a.condition(s)).toBe("boolean");
    }
  });

  it("DAILY_TASKS use valid metrics", () => {
    const allowed = new Set(["taps", "earned", "businessBought", "skillBought"]);
    for (const t of DAILY_TASKS) expect(allowed.has(t.metric)).toBe(true);
  });

  it("DAILY_REWARDS has 7 entries", () => {
    expect(DAILY_REWARDS).toHaveLength(7);
  });

  it("MARKET_ITEMS effects use known keys", () => {
    for (const m of MARKET_ITEMS) {
      const keys = Object.keys(m.effect);
      for (const k of keys) expect(["clickBonus", "passiveBonus"]).toContain(k);
    }
  });
});
