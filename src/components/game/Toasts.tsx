import { useGameCtx } from "@/game/GameContext";

export function Toasts() {
  const { toasts } = useGameCtx();
  return (
    <div className="fixed top-2 inset-x-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto w-full max-w-sm rounded-2xl px-4 py-3 shadow-elevated animate-slide-up flex items-center gap-3 ${
            t.variant === "achievement"
              ? "bg-card border-2 border-gold shadow-glow-gold"
              : t.variant === "level"
              ? "bg-gradient-primary text-primary-foreground"
              : "bg-card border border-border"
          }`}
        >
          <div className="text-2xl">{t.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{t.title}</div>
            {t.description && <div className="text-xs opacity-80 truncate">{t.description}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
