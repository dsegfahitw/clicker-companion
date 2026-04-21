import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGameCtx } from "@/game/GameContext";
import { JOBS } from "@/game/data/jobs";
import { clickIncome } from "@/game/state";
import { formatMoney } from "@/game/utils";

export const Route = createFileRoute("/")({
  component: LifePage,
});

interface FloatingNum { id: number; x: number; value: number; }
let nid = 0;

function LifePage() {
  const { state, actions, todaysTasks } = useGameCtx();
  const [floats, setFloats] = useState<FloatingNum[]>([]);
  const job = JOBS.find(j => j.id === state.currentJobId) ?? JOBS[0];
  const earn = clickIncome(state);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let clientX = 0;
    if ("touches" in e && e.touches[0]) clientX = e.touches[0].clientX;
    else if ("clientX" in e) clientX = (e as React.MouseEvent).clientX;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const id = ++nid;
    setFloats(f => [...f, { id, x: clamp(x, 15, 85), value: earn }]);
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1000);
    actions.tap();
  };

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      {/* Hero tap */}
      <div className="relative rounded-3xl bg-gradient-wheat border border-border p-6 shadow-card overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-flag" />
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Робота</div>
          <div className="text-base font-semibold mt-1">{job.emoji} {job.name}</div>
        </div>
        <div className="relative mt-4 flex items-center justify-center select-none">
          <button
            onPointerDown={handleTap}
            className="tap-target relative w-44 h-44 rounded-full bg-gradient-primary shadow-glow-primary text-primary-foreground active:animate-tap-bounce flex items-center justify-center animate-pulse-glow"
          >
            <span className="text-7xl drop-shadow-lg">{job.emoji}</span>
          </button>
          {floats.map(f => (
            <div
              key={f.id}
              className="absolute bottom-1/2 text-gold font-extrabold text-2xl pointer-events-none animate-float-up drop-shadow-[0_2px_6px_oklch(0_0_0_/_0.6)]"
              style={{ left: `${f.x}%` }}
            >
              +{formatMoney(f.value)}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Натискай, щоб заробити <span className="text-gold font-semibold">+{formatMoney(earn)}</span> за тап
        </div>
      </div>

      {/* Daily tasks */}
      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground px-1">Щоденні завдання</h2>
        <div className="space-y-2">
          {todaysTasks.map(t => {
            const progress = Math.min(t.goal, state.taskProgress[t.id] ?? 0);
            const done = !!state.taskCompleted[t.id];
            return (
              <div key={t.id} className={`rounded-2xl border p-3 flex items-center gap-3 ${done ? "bg-success/10 border-success/40" : "bg-card border-border"}`}>
                <div className="text-2xl">{t.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate">{t.title}</span>
                    <span className="text-xs text-muted-foreground">{progress}/{t.goal}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                    <div className={`h-full ${done ? "bg-success" : "bg-gradient-primary"}`} style={{ width: `${(progress / t.goal) * 100}%` }} />
                  </div>
                </div>
                <div className={`text-xs font-bold ${done ? "text-success" : "text-gold"}`}>+₴{t.reward}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-3 gap-2">
        <Stat label="Тапів" value={state.taps.toLocaleString("uk-UA")} />
        <Stat label="Усього зароблено" value={formatMoney(state.totalEarned)} />
        <Stat label="Досягнень" value={`${state.achievements.length}/26`} />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-3 text-center shadow-card">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-bold mt-1 truncate">{value}</div>
    </div>
  );
}

function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)); }
