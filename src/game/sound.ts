// Synthesized sound effects via Web Audio API.
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.08) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export const sfx = {
  click: () => tone(620 + Math.random() * 80, 0.08, "triangle", 0.06),
  buy: () => {
    tone(523, 0.1, "triangle", 0.08);
    setTimeout(() => tone(784, 0.14, "triangle", 0.08), 60);
  },
  levelUp: () => {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.18, "triangle", 0.1), i * 70));
  },
  achievement: () => {
    [784, 988, 1318].forEach((f, i) => setTimeout(() => tone(f, 0.22, "sine", 0.08), i * 80));
  },
  error: () => tone(180, 0.18, "square", 0.05),
  reward: () => {
    [659, 784, 988].forEach((f, i) => setTimeout(() => tone(f, 0.16, "triangle", 0.09), i * 60));
  },
};
