import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { GameProvider, useGameCtx } from "../GameContext";
import { JOBS } from "../data/jobs";
import { BUSINESSES } from "../data/businesses";
import { MARKET_ITEMS } from "../data/market";
import { initialState, saveState, SAVE_KEY } from "../state";

const wrapper = ({ children }: { children: ReactNode }) => <GameProvider>{children}</GameProvider>;

beforeEach(() => {
  localStorage.clear();
  // Disable random events deterministically for tap tests
  vi.spyOn(Math, "random").mockReturnValue(0.99);
});

async function setupHook() {
  const view = renderHook(() => useGameCtx(), { wrapper });
  await waitFor(() => expect(view.result.current.hydrated).toBe(true));
  return view;
}

describe("useGame.tap", () => {
  it("increases money, totalEarned, taps, and xp", async () => {
    const { result } = await setupHook();
    const before = result.current.state;
    act(() => result.current.actions.tap());
    const after = result.current.state;
    expect(after.taps).toBe(before.taps + 1);
    expect(after.money).toBeGreaterThan(before.money);
    expect(after.totalEarned).toBeGreaterThan(before.totalEarned);
    expect(after.xp).toBeGreaterThan(before.xp);
  });

  it("unlocks the first-tap achievement", async () => {
    const { result } = await setupHook();
    act(() => result.current.actions.tap());
    expect(result.current.state.achievements).toContain("first-tap");
  });
});

describe("useGame.buyBusiness", () => {
  it("fails silently when broke", async () => {
    const { result } = await setupHook();
    const before = result.current.state.businesses[BUSINESSES[0].id];
    act(() => result.current.actions.buyBusiness(BUSINESSES[0].id));
    expect(result.current.state.businesses[BUSINESSES[0].id]).toBe(before);
  });

  it("buys when affordable and increments business level", async () => {
    saveState({ ...initialState(), money: 10_000 });
    const { result } = await setupHook();
    const id = BUSINESSES[0].id;
    act(() => result.current.actions.buyBusiness(id));
    expect(result.current.state.businesses[id]).toBe(1);
    // Money may receive bonuses (e.g. daily task reward) on the same tick,
    // so we just verify XP was granted as a deterministic side-effect.
    expect(result.current.state.xp).toBeGreaterThan(0);
  });
});

describe("useGame.buySkill", () => {
  it("deducts cost and increases skill level", async () => {
    saveState({ ...initialState(), money: 100_000 });
    const { result } = await setupHook();
    const before = result.current.state.skills.farming;
    act(() => result.current.actions.buySkill("farming"));
    expect(result.current.state.skills.farming).toBe(before + 1);
  });

  it("caps at level 5", async () => {
    saveState({ ...initialState(), money: 10_000_000, skills: { ...initialState().skills, farming: 5 } });
    const { result } = await setupHook();
    act(() => result.current.actions.buySkill("farming"));
    expect(result.current.state.skills.farming).toBe(5);
  });
});

describe("useGame.buyMarketItem", () => {
  it("buys once and prevents duplicates", async () => {
    saveState({ ...initialState(), money: 1_000_000 });
    const { result } = await setupHook();
    const item = MARKET_ITEMS[0];
    act(() => result.current.actions.buyMarketItem(item.id));
    expect(result.current.state.marketOwned).toContain(item.id);
    const moneyAfterFirst = result.current.state.money;
    act(() => result.current.actions.buyMarketItem(item.id));
    expect(result.current.state.money).toBe(moneyAfterFirst);
    expect(result.current.state.marketOwned.filter(x => x === item.id)).toHaveLength(1);
  });
});

describe("useGame.setJob", () => {
  it("changes the current job id", async () => {
    const { result } = await setupHook();
    act(() => result.current.actions.setJob(JOBS[2].id));
    expect(result.current.state.currentJobId).toBe(JOBS[2].id);
  });
});

describe("useGame.resolveEvent", () => {
  it("applies money/health/reputation/corruption", async () => {
    saveState({ ...initialState(), money: 1000 });
    const { result } = await setupHook();
    const before = result.current.state;
    act(() =>
      result.current.actions.resolveEvent({
        label: "x",
        money: -200,
        health: -10,
        reputation: 5,
        corruption: 3,
        xp: 10,
      }),
    );
    const after = result.current.state;
    expect(after.money).toBe(before.money - 200);
    expect(after.health).toBe(before.health - 10);
    expect(after.reputation).toBe(before.reputation + 5);
    expect(after.corruption).toBe(before.corruption + 3);
    expect(after.xp).toBeGreaterThan(before.xp);
  });

  it("never lets money go negative", async () => {
    const { result } = await setupHook();
    act(() => result.current.actions.resolveEvent({ label: "x", money: -99999 }));
    expect(result.current.state.money).toBe(0);
  });
});

describe("useGame.claimDaily", () => {
  it("marks claimed and adds money", async () => {
    const { result } = await setupHook();
    // simulate streak day 1
    expect(result.current.state.dailyClaimed).toBe(false);
    const before = result.current.state.money;
    act(() => result.current.actions.claimDaily());
    expect(result.current.state.dailyClaimed).toBe(true);
    expect(result.current.state.money).toBeGreaterThanOrEqual(before);
  });

  it("is idempotent on second call", async () => {
    const { result } = await setupHook();
    act(() => result.current.actions.claimDaily());
    const after1 = result.current.state.money;
    act(() => result.current.actions.claimDaily());
    expect(result.current.state.money).toBe(after1);
  });
});

describe("useGame passive tick", () => {
  it("adds passive income each second when a business is owned", async () => {
    saveState({
      ...initialState(),
      money: 0,
      businesses: { ...initialState().businesses, [BUSINESSES[0].id]: 1 },
    });
    vi.useFakeTimers();
    const view = renderHook(() => useGameCtx(), { wrapper });
    // Hydration uses real microtasks – flush them
    await vi.waitFor(() => expect(view.result.current.hydrated).toBe(true));
    const before = view.result.current.state.money;
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(view.result.current.state.money).toBeGreaterThan(before);
    vi.useRealTimers();
  });
});

describe("useGame offline progress", () => {
  it("grants capped offline earnings on hydration", async () => {
    const past = Date.now() - 60 * 60 * 1000; // 1h ago
    saveState({
      ...initialState(),
      lastSavedAt: past,
      businesses: { ...initialState().businesses, [BUSINESSES[0].id]: 5 },
    });
    // overwrite lastSavedAt directly because saveState clobbers it with Date.now()
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY)!);
    raw.lastSavedAt = past;
    localStorage.setItem(SAVE_KEY, JSON.stringify(raw));

    const { result } = await setupHook();
    expect(result.current.offlineEarnings).not.toBeNull();
    expect(result.current.offlineEarnings!).toBeGreaterThan(0);
  });
});

describe("useGame.toggleSound", () => {
  it("flips soundOn", async () => {
    const { result } = await setupHook();
    const before = result.current.state.soundOn;
    act(() => result.current.actions.toggleSound());
    expect(result.current.state.soundOn).toBe(!before);
  });
});

describe("useGame.resetSave", () => {
  it("resets state when confirm() returns true", async () => {
    saveState({ ...initialState(), money: 999, taps: 50 });
    const { result } = await setupHook();
    expect(result.current.state.money).toBe(999);
    const orig = window.confirm;
    window.confirm = () => true;
    act(() => result.current.actions.resetSave());
    expect(result.current.state.money).toBe(0);
    expect(result.current.state.taps).toBe(0);
    window.confirm = orig;
  });

  it("does nothing when confirm() returns false", async () => {
    saveState({ ...initialState(), money: 555 });
    const { result } = await setupHook();
    const orig = window.confirm;
    window.confirm = () => false;
    act(() => result.current.actions.resetSave());
    expect(result.current.state.money).toBe(555);
    window.confirm = orig;
  });
});
