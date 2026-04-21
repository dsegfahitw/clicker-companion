import { createFileRoute } from "@tanstack/react-router";
import { useGameCtx } from "@/game/GameContext";
import { SKILLS } from "@/game/data/skills";
import { skillCost } from "@/game/state";
import { formatMoney } from "@/game/utils";

export const Route = createFileRoute("/skills")({
  component: SkillsPage,
});

function SkillsPage() {
  const { state, actions } = useGameCtx();
  return (
    <div className="px-4 pt-4 pb-6 space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground px-1">Прокачка навичок</h2>
      <div className="space-y-2">
        {SKILLS.map(s => {
          const lvl = state.skills[s.id];
          const maxed = lvl >= 5;
          const cost = skillCost(state, s.id);
          const canAfford = state.money >= cost;
          return (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-3 flex items-center gap-3">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center text-2xl">
                {s.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold truncate">{s.name}</span>
                  <span className="text-xs text-muted-foreground">{lvl}/5</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">{s.description}</div>
                <div className="mt-1.5 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`flex-1 h-1.5 rounded-full ${i < lvl ? "bg-gradient-gold shadow-glow-gold" : "bg-surface-2"}`} />
                  ))}
                </div>
              </div>
              <button
                disabled={maxed || !canAfford}
                onClick={() => actions.buySkill(s.id)}
                className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold ${
                  maxed
                    ? "bg-success/20 text-success"
                    : canAfford
                    ? "bg-gradient-primary text-primary-foreground shadow-glow-primary active:scale-95"
                    : "bg-surface-2 text-muted-foreground"
                }`}
              >
                {maxed ? "MAX" : (
                  <div className="flex flex-col items-center">
                    <span>+1</span>
                    <span className="text-[10px] opacity-90">{formatMoney(cost)}</span>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
