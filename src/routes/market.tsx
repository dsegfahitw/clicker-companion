import { createFileRoute } from "@tanstack/react-router";
import { useGameCtx } from "@/game/GameContext";
import { MARKET_ITEMS } from "@/game/data/market";
import { formatMoney } from "@/game/utils";
import { Check } from "lucide-react";

export const Route = createFileRoute("/market")({
  component: MarketPage,
});

function MarketPage() {
  const { state, actions } = useGameCtx();
  return (
    <div className="px-4 pt-4 pb-6 space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground px-1">Магазин предметів</h2>
      <div className="grid grid-cols-2 gap-2">
        {MARKET_ITEMS.map(item => {
          const owned = state.marketOwned.includes(item.id);
          const isReward = item.cost === 0;
          const canAfford = state.money >= item.cost;
          return (
            <div key={item.id} className={`rounded-2xl border p-3 flex flex-col ${owned ? "bg-success/10 border-success/40" : "bg-card border-border"}`}>
              <div className="text-4xl text-center mb-1">{item.emoji}</div>
              <div className="text-sm font-semibold text-center truncate">{item.name}</div>
              <div className="text-[11px] text-muted-foreground text-center mt-1 line-clamp-2 min-h-[28px]">{item.description}</div>
              <div className="mt-2">
                {owned ? (
                  <div className="w-full py-2 rounded-xl bg-success/20 text-success text-xs font-bold flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Куплено
                  </div>
                ) : isReward ? (
                  <div className="w-full py-2 rounded-xl bg-surface-2 text-muted-foreground text-[11px] font-medium text-center">
                    Нагорода за 7 днів
                  </div>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => actions.buyMarketItem(item.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold ${
                      canAfford
                        ? "bg-gradient-gold text-gold-foreground shadow-glow-gold active:scale-95"
                        : "bg-surface-2 text-muted-foreground"
                    }`}
                  >
                    {formatMoney(item.cost)}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
