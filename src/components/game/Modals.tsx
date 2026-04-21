import { useGameCtx } from "@/game/GameContext";
import { formatMoney } from "@/game/utils";
import { DAILY_REWARDS } from "@/game/data/dailyTasks";
import { Button } from "@/components/ui/button";

export function Modals() {
  const { activeEvent, levelUpInfo, offlineEarnings, dailyRewardOpen, state, actions } = useGameCtx();

  return (
    <>
      {/* Event modal */}
      {activeEvent && (
        <Backdrop>
          <div className="w-full max-w-md mx-auto bg-card border border-border rounded-3xl p-6 shadow-elevated animate-slide-up">
            <div className="text-5xl text-center mb-2">{activeEvent.emoji}</div>
            <h3 className="text-xl font-bold text-center">{activeEvent.title}</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">{activeEvent.description}</p>
            <div className="mt-5 space-y-2">
              <Button
                onClick={() => actions.resolveEvent(activeEvent.honest)}
                className="w-full h-auto py-3 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow-primary rounded-2xl"
              >
                <div className="flex flex-col items-center w-full">
                  <span className="font-semibold">{activeEvent.honest.label}</span>
                  <ChoiceMeta c={activeEvent.honest} />
                </div>
              </Button>
              <Button
                onClick={() => actions.resolveEvent(activeEvent.corrupt)}
                variant="outline"
                className="w-full h-auto py-3 border-destructive/40 text-foreground hover:bg-destructive/10 rounded-2xl"
              >
                <div className="flex flex-col items-center w-full">
                  <span className="font-semibold">{activeEvent.corrupt.label}</span>
                  <ChoiceMeta c={activeEvent.corrupt} />
                </div>
              </Button>
            </div>
          </div>
        </Backdrop>
      )}

      {/* Level up */}
      {levelUpInfo !== null && (
        <Backdrop onClick={actions.closeLevelUp}>
          <div className="w-full max-w-sm mx-auto bg-card border border-gold/30 rounded-3xl p-6 shadow-glow-gold animate-pop-in text-center">
            <div className="text-6xl mb-2">⭐</div>
            <div className="text-sm uppercase tracking-widest text-gold">Новий рівень</div>
            <div className="text-5xl font-extrabold text-gold mt-2 drop-shadow-[0_4px_12px_oklch(0.84_0.17_88_/_0.6)]">
              {levelUpInfo}
            </div>
            <p className="text-sm text-muted-foreground mt-3">Так тримати! Продовжуй у тому ж дусі.</p>
            <Button onClick={actions.closeLevelUp} className="mt-5 w-full bg-gradient-gold text-gold-foreground hover:opacity-90 rounded-2xl">
              Круто!
            </Button>
          </div>
        </Backdrop>
      )}

      {/* Offline earnings */}
      {offlineEarnings !== null && offlineEarnings > 0 && (
        <Backdrop onClick={actions.closeOffline}>
          <div className="w-full max-w-sm mx-auto bg-card border border-border rounded-3xl p-6 shadow-elevated animate-slide-up text-center">
            <div className="text-5xl mb-2">💼</div>
            <h3 className="text-xl font-bold">З поверненням!</h3>
            <p className="text-sm text-muted-foreground mt-1">Поки тебе не було, бізнес працював.</p>
            <div className="mt-4 text-3xl font-extrabold text-gold">+{formatMoney(offlineEarnings)}</div>
            <Button onClick={actions.closeOffline} className="mt-5 w-full bg-gradient-primary text-primary-foreground rounded-2xl shadow-glow-primary">
              Дякую!
            </Button>
          </div>
        </Backdrop>
      )}

      {/* Daily reward */}
      {dailyRewardOpen && (
        <Backdrop onClick={actions.closeDaily}>
          <div className="w-full max-w-sm mx-auto bg-card border border-border rounded-3xl p-6 shadow-elevated animate-slide-up">
            <div className="text-center">
              <div className="text-5xl mb-2">🎁</div>
              <h3 className="text-xl font-bold">Щоденна нагорода</h3>
              <p className="text-sm text-muted-foreground">День {state.loginStreak} з 7</p>
            </div>
            <div className="grid grid-cols-7 gap-1.5 mt-4">
              {DAILY_REWARDS.map((r, i) => {
                const day = i + 1;
                const claimed = day < state.loginStreak;
                const today = day === state.loginStreak;
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[10px] font-medium border ${
                      today
                        ? "bg-gradient-gold border-gold text-gold-foreground shadow-glow-gold"
                        : claimed
                        ? "bg-success/20 border-success/40 text-success"
                        : "bg-surface border-border text-muted-foreground"
                    }`}
                  >
                    <div className="text-base">{day === 7 ? "👢" : "💰"}</div>
                    <div>Д{day}</div>
                  </div>
                );
              })}
            </div>
            <Button
              onClick={() => { actions.claimDaily(); actions.closeDaily(); }}
              disabled={state.dailyClaimed}
              className="mt-5 w-full bg-gradient-primary text-primary-foreground rounded-2xl shadow-glow-primary disabled:opacity-50"
            >
              {state.dailyClaimed ? "Вже отримано" : "Забрати"}
            </Button>
          </div>
        </Backdrop>
      )}
    </>
  );
}

function ChoiceMeta({ c }: { c: { money?: number; health?: number; reputation?: number; corruption?: number; xp?: number } }) {
  const parts: string[] = [];
  if (c.money) parts.push(`${c.money > 0 ? "+" : ""}${formatMoney(c.money)}`);
  if (c.health) parts.push(`${c.health > 0 ? "+" : ""}${c.health}❤️`);
  if (c.reputation) parts.push(`${c.reputation > 0 ? "+" : ""}${c.reputation}🛡️`);
  if (c.corruption) parts.push(`+${c.corruption}💀`);
  if (c.xp) parts.push(`+${c.xp}XP`);
  if (!parts.length) return null;
  return <span className="text-[11px] opacity-80 mt-0.5">{parts.join(" · ")}</span>;
}

function Backdrop({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClick}
    >
      <div onClick={e => e.stopPropagation()} className="w-full">{children}</div>
    </div>
  );
}
