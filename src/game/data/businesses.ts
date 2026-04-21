import type { Business } from "../types";

export const BUSINESSES: Business[] = [
  { id: "shaurma", name: "Шаурма-кіоск", emoji: "🌯", baseCost: 50, baseIncome: 1, unlockStage: 0, description: "Класика жанру біля метро." },
  { id: "mini-market", name: "Міні-маркет", emoji: "🏪", baseCost: 400, baseIncome: 6, unlockStage: 1, description: "Цілодобово, з пивом і хлібом." },
  { id: "cafe", name: "Кав'ярня", emoji: "☕", baseCost: 2500, baseIncome: 30, unlockStage: 1, description: "Біла плитка, рослини, бариста." },
  { id: "gas-station", name: "АЗС", emoji: "⛽", baseCost: 12000, baseIncome: 140, unlockStage: 2, description: "95-й нікому не зайвий." },
  { id: "construction", name: "Будівельна фірма", emoji: "🏗️", baseCost: 60000, baseIncome: 700, unlockStage: 2, description: "ЖК \"Нова Мрія\" — третя черга." },
  { id: "factory", name: "Завод", emoji: "🏭", baseCost: 320000, baseIncome: 3500, unlockStage: 3, description: "Виробляємо все, що можна продати." },
  { id: "bank", name: "Банк", emoji: "🏦", baseCost: 1800000, baseIncome: 18000, unlockStage: 4, description: "Кредити під 0.01%/день." },
  { id: "oligarch", name: "Олігархічний холдинг", emoji: "🏛️", baseCost: 12000000, baseIncome: 100000, unlockStage: 4, description: "Метал, газ, медіа — все твоє." },
];
