import type { Skill } from "../types";

export const SKILLS: Skill[] = [
  { id: "farming", name: "Сільське господарство", emoji: "🌱", description: "+10% дохід від тапу за рівень.", baseCost: 100 },
  { id: "oratory", name: "Ораторство", emoji: "🎤", description: "+5% репутація з подій.", baseCost: 250 },
  { id: "bribery", name: "Хабарництво", emoji: "💰", description: "Кращі результати у корупційних виборах.", baseCost: 500 },
  { id: "haggling", name: "Торгівля", emoji: "🤝", description: "-5% ціна бізнесів за рівень.", baseCost: 800 },
  { id: "networking", name: "Знайомства", emoji: "📞", description: "+8% пасивний дохід за рівень.", baseCost: 1500 },
  { id: "driving", name: "Водіння", emoji: "🚗", description: "+15% дохід від тапу за рівень.", baseCost: 3000 },
  { id: "accounting", name: "Бухгалтерія", emoji: "📊", description: "+10% пасивний дохід за рівень.", baseCost: 8000 },
  { id: "marketing", name: "Маркетинг", emoji: "📣", description: "+20% пасивний дохід за рівень.", baseCost: 25000 },
];
