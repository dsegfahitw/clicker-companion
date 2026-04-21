import { createFileRoute } from "@tanstack/react-router";
import { useGameCtx } from "@/game/GameContext";
import { Volume2, VolumeX, Trash2 } from "lucide-react";
import { ACHIEVEMENTS } from "@/game/data/achievements";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { state, actions } = useGameCtx();
  return (
    <div className="px-4 pt-4 pb-6 space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground px-1">Налаштування</h2>

      <button
        onClick={actions.toggleSound}
        className="w-full rounded-2xl border border-border bg-card p-4 flex items-center gap-3 active:scale-[0.99]"
      >
        {state.soundOn ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
        <div className="flex-1 text-left">
          <div className="font-semibold text-sm">Звуки</div>
          <div className="text-xs text-muted-foreground">{state.soundOn ? "Увімкнено" : "Вимкнено"}</div>
        </div>
        <div className={`w-11 h-6 rounded-full p-0.5 transition-colors ${state.soundOn ? "bg-primary" : "bg-surface-2"}`}>
          <div className={`w-5 h-5 rounded-full bg-foreground transition-transform ${state.soundOn ? "translate-x-5" : ""}`} />
        </div>
      </button>

      <button
        onClick={actions.resetSave}
        className="w-full rounded-2xl border border-destructive/30 bg-destructive/10 p-4 flex items-center gap-3 active:scale-[0.99]"
      >
        <Trash2 className="w-5 h-5 text-destructive" />
        <div className="flex-1 text-left">
          <div className="font-semibold text-sm text-destructive">Скинути прогрес</div>
          <div className="text-xs text-muted-foreground">Всі дані буде стерто.</div>
        </div>
      </button>

      <h2 className="text-xs uppercase tracking-widest text-muted-foreground px-1 pt-3">
        Досягнення ({state.achievements.length}/{ACHIEVEMENTS.length})
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {ACHIEVEMENTS.map(a => {
          const got = state.achievements.includes(a.id);
          return (
            <div
              key={a.id}
              title={`${a.name} — ${a.description}`}
              className={`aspect-square rounded-2xl border flex flex-col items-center justify-center text-center p-1 ${
                got ? "bg-gradient-gold border-gold text-gold-foreground shadow-glow-gold" : "bg-surface border-border opacity-50"
              }`}
            >
              <div className="text-2xl">{got ? a.emoji : "🔒"}</div>
              <div className="text-[9px] mt-0.5 line-clamp-2 leading-tight">{a.name}</div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 text-center text-[10px] text-muted-foreground">
        Українець: Шлях До Успіху • v3.0 • Прогрес зберігається у браузері
      </div>
    </div>
  );
}
