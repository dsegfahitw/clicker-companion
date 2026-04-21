import type { GameState, SkillId } from "./types";
import { JOBS } from "./data/jobs";
import { BUSINESSES } from "./data/businesses";
import { SKILLS } from "./data/skills";
import { MARKET_ITEMS } from "./data/market";
import { stageFromEarned } from "./data/stages";
import { safeNum, clamp, xpForLevel } from "./utils";

export const SAVE_KEY = "ukrainian_clicker_save_v3";
export const SAVE_VERSION = 3;

export const initialState = (): GameState => ({
  money: 0,
  totalEarned: 0,
  health: 80,
  reputation: 0,
  corruption: 0,

  level: 1,
  xp: 0,
  stage: 0,

  taps: 0,
  currentJobId: JOBS[0].id,

  businesses: Object.fromEntries(BUSINESSES.map(b => [b.id, 0])),
  skills: Object.fromEntries(SKILLS.map(s => [s.id, 0])) as Record<SkillId, number>,
  marketOwned: [],
  achievements: [],

  lastDailyReset: Date.now(),
  loginStreak: 0,
  lastLoginDay: 0,
  dailyClaimed: false,
  taskProgress: {},
  taskCompleted: {},

  soundOn: true,

  lastSavedAt: Date.now(),
  version: SAVE_VERSION,
});

export function sanitizeState(raw: any): GameState {
  const base = initialState();
  if (!raw || typeof raw !== "object" || raw.version !== SAVE_VERSION) return base;
  const skills: Record<SkillId, number> = { ...base.skills };
  for (const k of Object.keys(skills) as SkillId[]) {
    skills[k] = clamp(safeNum(raw.skills?.[k], 0), 0, 5);
  }
  const businesses: Record<string, number> = { ...base.businesses };
  for (const id of Object.keys(businesses)) {
    businesses[id] = Math.max(0, Math.floor(safeNum(raw.businesses?.[id], 0)));
  }
  return {
    money: Math.max(0, safeNum(raw.money, 0)),
    totalEarned: Math.max(0, safeNum(raw.totalEarned, 0)),
    health: clamp(safeNum(raw.health, 80), 0, 100),
    reputation: safeNum(raw.reputation, 0),
    corruption: safeNum(raw.corruption, 0),
    level: Math.max(1, Math.floor(safeNum(raw.level, 1))),
    xp: Math.max(0, safeNum(raw.xp, 0)),
    stage: clamp(Math.floor(safeNum(raw.stage, 0)), 0, 4),
    taps: Math.max(0, Math.floor(safeNum(raw.taps, 0))),
    currentJobId: typeof raw.currentJobId === "string" ? raw.currentJobId : JOBS[0].id,
    businesses,
    skills,
    marketOwned: Array.isArray(raw.marketOwned) ? raw.marketOwned.filter((x: any) => typeof x === "string") : [],
    achievements: Array.isArray(raw.achievements) ? raw.achievements.filter((x: any) => typeof x === "string") : [],
    lastDailyReset: safeNum(raw.lastDailyReset, Date.now()),
    loginStreak: Math.max(0, Math.floor(safeNum(raw.loginStreak, 0))),
    lastLoginDay: Math.max(0, Math.floor(safeNum(raw.lastLoginDay, 0))),
    dailyClaimed: !!raw.dailyClaimed,
    taskProgress: typeof raw.taskProgress === "object" && raw.taskProgress ? raw.taskProgress : {},
    taskCompleted: typeof raw.taskCompleted === "object" && raw.taskCompleted ? raw.taskCompleted : {},
    soundOn: raw.soundOn !== false,
    lastSavedAt: safeNum(raw.lastSavedAt, Date.now()),
    version: SAVE_VERSION,
  };
}

export function loadState(): GameState {
  if (typeof window === "undefined") return initialState();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return initialState();
    return sanitizeState(JSON.parse(raw));
  } catch {
    return initialState();
  }
}

export function saveState(state: GameState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSavedAt: Date.now() }));
  } catch {
    /* quota */
  }
}

// ===== Derived =====
export function clickIncome(state: GameState): number {
  const job = JOBS.find(j => j.id === state.currentJobId) ?? JOBS[0];
  let income = job.baseIncome;
  income *= 1 + state.skills.farming * 0.1;
  income *= 1 + state.skills.driving * 0.15;
  for (const ownedId of state.marketOwned) {
    const item = MARKET_ITEMS.find(m => m.id === ownedId);
    if (item?.effect.clickBonus) income *= 1 + item.effect.clickBonus;
  }
  return Math.max(1, Math.floor(income));
}

export function passiveIncomePerSecond(state: GameState): number {
  let total = 0;
  for (const b of BUSINESSES) {
    const lvl = state.businesses[b.id] ?? 0;
    if (lvl > 0) {
      total += b.baseIncome * Math.pow(1.5, lvl - 1);
    }
  }
  total *= 1 + state.skills.networking * 0.08;
  total *= 1 + state.skills.accounting * 0.1;
  total *= 1 + state.skills.marketing * 0.2;
  for (const ownedId of state.marketOwned) {
    const item = MARKET_ITEMS.find(m => m.id === ownedId);
    if (item?.effect.passiveBonus) total *= 1 + item.effect.passiveBonus;
  }
  return total;
}

export function businessCost(state: GameState, businessId: string): number {
  const b = BUSINESSES.find(x => x.id === businessId);
  if (!b) return Infinity;
  const lvl = state.businesses[businessId] ?? 0;
  const discount = Math.max(0.5, 1 - state.skills.haggling * 0.05);
  return Math.floor(b.baseCost * Math.pow(1.8, lvl) * discount);
}

export function skillCost(state: GameState, skillId: SkillId): number {
  const skill = SKILLS.find(s => s.id === skillId);
  if (!skill) return Infinity;
  const lvl = state.skills[skillId];
  return Math.floor(skill.baseCost * Math.pow(3, lvl));
}

export function applyXp(state: GameState, gained: number): { state: GameState; leveledUp: boolean } {
  let xp = state.xp + gained;
  let level = state.level;
  let leveled = false;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
    leveled = true;
  }
  return { state: { ...state, xp, level }, leveledUp: leveled };
}
