import { createFileRoute } from "@tanstack/react-router";
import { useGameCtx } from "@/game/GameContext";
import { BUSINESSES } from "@/game/data/businesses";
import { businessCost } from "@/game/state";
import { formatMoney } from "@/game/utils";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/business")({
  component: BusinessPage,
});

function BusinessPage() {
  const { state, actions } = useGameCtx();
  return (
    <div className="px-4 pt-4 pb-6 space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground px-1">Пасивний дохід</h2>
      <div className="space-y-2">
        {BUSINESSES.map(b => {
          const lvl = state.businesses[b.id] ?? 0;
          const locked = state.stage < b.unlockStage;
          const cost = businessCost(state, b.id);
          const canAfford = state.money >= cost;
          const income = lvl > 0 ? b.baseIncome * Math.pow(1.5, lvl - 1) : b.baseIncome;
          return (
            <div key={b.id} className={`rounded-2xl border p-3 flex items-center gap-3 ${locked ? "bg-card border-border opacity-50" : "bg-card border-border"}`}>
              <div className="relative shrink-0 w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center text-3xl">
                {b.emoji}
                {lvl > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-gold text-gold-foreground text-xs font-bold flex items-center justify-center shadow-glow-gold">
                    {lvl}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{b.name}</div>
                <div className="text-xs text-muted-foreground truncate">{locked ? `Стадія ${b.unlockStage + 1}` : b.description}</div>
                {!locked && (
                  <div className="text-xs text-gold mt-0.5">+{formatMoney(income)}/сек</div>
                )}
              </div>
              <button
                disabled={locked || !canAfford}
                onClick={() => actions.buyBusiness(b.id)}
                className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  locked
                    ? "bg-surface-2 text-muted-foreground"
                    : canAfford
                    ? "bg-gradient-primary text-primary-foreground shadow-glow-primary active:scale-95"
                    : "bg-surface-2 text-muted-foreground"
                }`}
              >
                {locked ? <Lock className="w-4 h-4" /> : (
                  <div className="flex flex-col items-center">
                    <span>{lvl === 0 ? "Купити" : "Покращити"}</span>
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
