import type { DailyTask } from "../types";

export const DAILY_TASKS: DailyTask[] = [
  { id: "tap-50", title: "Зроби 50 тапів", emoji: "👆", goal: 50, metric: "taps", reward: 200 },
  { id: "tap-200", title: "Зроби 200 тапів", emoji: "👊", goal: 200, metric: "taps", reward: 800 },
  { id: "earn-500", title: "Заробити ₴500", emoji: "💰", goal: 500, metric: "earned", reward: 250 },
  { id: "earn-5k", title: "Заробити ₴5 000", emoji: "💵", goal: 5000, metric: "earned", reward: 1500 },
  { id: "buy-biz", title: "Купи бізнес", emoji: "🏪", goal: 1, metric: "businessBought", reward: 500 },
  { id: "buy-skill", title: "Прокачай навичку", emoji: "🎓", goal: 1, metric: "skillBought", reward: 400 },
  { id: "tap-1000", title: "1 000 тапів", emoji: "🔥", goal: 1000, metric: "taps", reward: 3000 },
  { id: "earn-50k", title: "Заробити ₴50 000", emoji: "💎", goal: 50000, metric: "earned", reward: 8000 },
];

export const DAILY_REWARDS = [50, 150, 400, 1000, 2500, 6000, 0]; // day 7 = golden boots
