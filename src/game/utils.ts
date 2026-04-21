export function formatMoney(n: number): string {
  if (!Number.isFinite(n)) return "₴0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}₴${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}₴${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}₴${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}₴${(abs / 1e3).toFixed(2)}K`;
  return `${sign}₴${Math.floor(abs).toLocaleString("uk-UA")}`;
}

export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function dayIndex(ms = Date.now()): number {
  return Math.floor(ms / 86_400_000);
}

export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function safeNum(n: unknown, fallback = 0): number {
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}
