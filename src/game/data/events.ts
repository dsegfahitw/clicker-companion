import type { GameEvent } from "../types";

export const EVENTS: GameEvent[] = [
  {
    id: "traffic-cop", emoji: "🚓", title: "ДАІшник зупинив",
    description: "Інспектор натякає, що можна 'вирішити на місці'.",
    honest: { label: "Заплатити штраф офіційно", money: -200, reputation: 5, xp: 10 },
    corrupt: { label: "Дати хабар", money: -80, corruption: 5, xp: 5 },
  },
  {
    id: "tax-audit", emoji: "📋", title: "Податкова перевірка",
    description: "Інспектор знайшов 'помилки' у звітності.",
    honest: { label: "Сплатити все чесно", money: -1500, reputation: 10, xp: 25 },
    corrupt: { label: "Домовитися", money: -400, corruption: 10, xp: 10 },
  },
  {
    id: "found-wallet", emoji: "👛", title: "Знайшов гаманець",
    description: "На лавці — повний грошей.",
    honest: { label: "Здати в поліцію", reputation: 15, xp: 20 },
    corrupt: { label: "Забрати собі", money: 600, corruption: 8 },
  },
  {
    id: "babusya-help", emoji: "👵", title: "Бабуся на переході",
    description: "Літня жінка не може перейти дорогу.",
    honest: { label: "Допомогти", reputation: 10, health: 5, xp: 15 },
    corrupt: { label: "Пройти повз", corruption: 3 },
  },
  {
    id: "mafia-offer", emoji: "🕴️", title: "Пропозиція 'дахування'",
    description: "Хлопці у спортивних костюмах пропонують 'захист'.",
    honest: { label: "Відмовитися", reputation: 8, health: -10, xp: 20 },
    corrupt: { label: "Погодитися", money: 1200, corruption: 15 },
  },
  {
    id: "deputy-call", emoji: "📞", title: "Дзвінок депутата",
    description: "Просить 'допомогти' з тендером.",
    honest: { label: "Відмовити", reputation: 12, xp: 25 },
    corrupt: { label: "Допомогти", money: 8000, corruption: 20 },
  },
  {
    id: "blood-donate", emoji: "🩸", title: "Збір крові",
    description: "Біля метро стоїть мобільний пункт.",
    honest: { label: "Здати кров", health: -10, reputation: 12, xp: 15 },
    corrupt: { label: "Пройти повз" },
  },
  {
    id: "lost-dog", emoji: "🐕", title: "Загублений песик",
    description: "Маленький песик біля під'їзду.",
    honest: { label: "Знайти господаря", reputation: 10, xp: 20 },
    corrupt: { label: "Залишити собі", health: 5 },
  },
  {
    id: "scam-call", emoji: "☎️", title: "Дзвонять з 'банку'",
    description: "Просять CVV-код карти.",
    honest: { label: "Кинути слухавку", xp: 10, reputation: 3 },
    corrupt: { label: "Послати матюками", health: 5, xp: 5 },
  },
  {
    id: "elections", emoji: "🗳️", title: "Вибори",
    description: "Знайомий пропонує 100 грн за голос.",
    honest: { label: "Голосувати чесно", reputation: 15, xp: 30 },
    corrupt: { label: "Продати голос", money: 100, corruption: 12 },
  },
  {
    id: "construction-bribe", emoji: "🏗️", title: "Дозвіл на будівництво",
    description: "Чиновник 'прискорить' за конверт.",
    honest: { label: "Чекати в черзі", money: -200, reputation: 8, xp: 15 },
    corrupt: { label: "Дати конверт", money: -2000, corruption: 12 },
  },
  {
    id: "neighbor-loud", emoji: "🔊", title: "Шумні сусіди",
    description: "Третій день поспіль святкують.",
    honest: { label: "Поговорити ввічливо", reputation: 5, xp: 10 },
    corrupt: { label: "Виклик поліції анонімно", corruption: 2 },
  },
  {
    id: "subway-musician", emoji: "🎻", title: "Музикант у переході",
    description: "Грає Океан Ельзи на скрипці.",
    honest: { label: "Кинути 50 грн", money: -50, reputation: 5, xp: 10 },
    corrupt: { label: "Пройти повз" },
  },
  {
    id: "fake-medical", emoji: "🏥", title: "Лівий лікарняний",
    description: "Знайомий 'лікар' пропонує довідку.",
    honest: { label: "Відмовитися", reputation: 10, xp: 15 },
    corrupt: { label: "Купити", money: -500, corruption: 8 },
  },
  {
    id: "donation-army", emoji: "🇺🇦", title: "Збір на ЗСУ",
    description: "Волонтери збирають на дрони.",
    honest: { label: "Пожертвувати", money: -500, reputation: 25, xp: 40 },
    corrupt: { label: "Сказати 'наступного разу'", corruption: 5 },
  },
  {
    id: "tender-win", emoji: "📑", title: "Державний тендер",
    description: "Можна виграти, якщо 'правильно' оформити.",
    honest: { label: "Подати чесну заявку", money: 2000, reputation: 15, xp: 30 },
    corrupt: { label: "Купити перемогу", money: 12000, corruption: 25 },
  },
  {
    id: "kid-help", emoji: "🧒", title: "Дитина загубилась",
    description: "У ТЦ плаче маленька дівчинка.",
    honest: { label: "Відвести в адміністрацію", reputation: 12, xp: 20 },
    corrupt: { label: "Не моя справа", corruption: 5 },
  },
  {
    id: "promo-job", emoji: "🎯", title: "Підвищення",
    description: "Шеф пропонує посаду — але треба 'підставити' колегу.",
    honest: { label: "Відмовитися", reputation: 18, xp: 35 },
    corrupt: { label: "Підставити", money: 3000, corruption: 18 },
  },
];
