export const STAGES = [
  { name: "Село", emoji: "🌾", threshold: 0 },
  { name: "Місто", emoji: "🏘️", threshold: 1000 },
  { name: "Великий Київ", emoji: "🏙️", threshold: 10000 },
  { name: "Столиця", emoji: "🌆", threshold: 100000 },
  { name: "Еліта", emoji: "👑", threshold: 1000000 },
];

export function stageFromEarned(totalEarned: number): number {
  let stage = 0;
  for (let i = 0; i < STAGES.length; i++) {
    if (totalEarned >= STAGES[i].threshold) stage = i;
  }
  return stage;
}
