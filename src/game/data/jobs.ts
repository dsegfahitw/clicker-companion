import type { Job } from "../types";

export const JOBS: Job[] = [
  { id: "farmhand", name: "Робітник на полі", emoji: "🌾", baseIncome: 1, unlockStage: 0, description: "Збираєш буряк за копійки." },
  { id: "driver", name: "Водій маршрутки", emoji: "🚐", baseIncome: 4, unlockStage: 1, description: "Возиш людей з району в район." },
  { id: "trader", name: "Торговець на базарі", emoji: "🥬", baseIncome: 12, unlockStage: 1, description: "Продаєш овочі — головне торгуватися." },
  { id: "manager", name: "Менеджер у фірмі", emoji: "💼", baseIncome: 35, unlockStage: 2, description: "Костюм, кава, дедлайни." },
  { id: "engineer", name: "IT-спеціаліст", emoji: "💻", baseIncome: 110, unlockStage: 3, description: "Пишеш код у 3 ночі." },
  { id: "accountant", name: "Головний бухгалтер", emoji: "🧮", baseIncome: 320, unlockStage: 4, description: "Знаєш усі схеми оптимізації." },
];
