import type { MarketItem } from "../types";

export const MARKET_ITEMS: MarketItem[] = [
  { id: "work-boots", name: "Робочі чоботи", emoji: "🥾", cost: 500, description: "+25% дохід від тапу.", effect: { clickBonus: 0.25 } },
  { id: "leather-jacket", name: "Шкіряна куртка", emoji: "🧥", cost: 2000, description: "+15% пасивний дохід.", effect: { passiveBonus: 0.15 } },
  { id: "smartphone", name: "Смартфон", emoji: "📱", cost: 5000, description: "+50% дохід від тапу.", effect: { clickBonus: 0.5 } },
  { id: "car", name: "Авто", emoji: "🚗", cost: 25000, description: "+30% пасивний дохід.", effect: { passiveBonus: 0.3 } },
  { id: "watch", name: "Швейцарський годинник", emoji: "⌚", cost: 80000, description: "+1.0x дохід від тапу.", effect: { clickBonus: 1.0 } },
  { id: "villa", name: "Вілла на Конча-Заспі", emoji: "🏡", cost: 500000, description: "+100% пасивний дохід.", effect: { passiveBonus: 1.0 } },
  { id: "yacht", name: "Яхта", emoji: "🛥️", cost: 2500000, description: "+2.0x дохід від тапу.", effect: { clickBonus: 2.0 } },
  { id: "golden-boots", name: "Золоті чоботи", emoji: "👢", cost: 0, description: "Подарунок за 7-денний стрік. +50% усього.", effect: { clickBonus: 0.5, passiveBonus: 0.5 } },
];
