export type SkillId =
  | "farming"
  | "oratory"
  | "bribery"
  | "haggling"
  | "networking"
  | "driving"
  | "accounting"
  | "marketing";

export interface Job {
  id: string;
  name: string;
  emoji: string;
  baseIncome: number;
  unlockStage: number;
  description: string;
}

export interface Business {
  id: string;
  name: string;
  emoji: string;
  baseCost: number;
  baseIncome: number; // per second at level 1
  unlockStage: number;
  description: string;
}

export interface Skill {
  id: SkillId;
  name: string;
  emoji: string;
  description: string;
  baseCost: number;
}

export interface MarketItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  effect: { clickBonus?: number; passiveBonus?: number };
}

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  condition: (s: GameState) => boolean;
  rewardMoney: number;
  rewardXp: number;
}

export type EventChoice = {
  label: string;
  money?: number;
  health?: number;
  reputation?: number;
  corruption?: number;
  xp?: number;
};

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  honest: EventChoice;
  corrupt: EventChoice;
}

export interface DailyTask {
  id: string;
  title: string;
  emoji: string;
  goal: number;
  metric: "taps" | "earned" | "businessBought" | "skillBought";
  reward: number;
}

export interface GameState {
  // Resources
  money: number;
  totalEarned: number;
  health: number;
  reputation: number;
  corruption: number;

  // Progression
  level: number;
  xp: number;
  stage: number;

  // Activity
  taps: number;
  currentJobId: string | null;

  // Owned content
  businesses: Record<string, number>; // id -> level (0 = not owned)
  skills: Record<SkillId, number>; // id -> level 0..5
  marketOwned: string[];
  achievements: string[]; // unlocked ids

  // Daily
  lastDailyReset: number; // ms
  loginStreak: number;
  lastLoginDay: number; // day index
  dailyClaimed: boolean;
  taskProgress: Record<string, number>;
  taskCompleted: Record<string, boolean>;

  // Settings
  soundOn: boolean;

  // Meta
  lastSavedAt: number;
  version: number;
}
