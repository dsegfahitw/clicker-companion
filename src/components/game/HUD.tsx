import { useGameCtx } from "@/game/GameContext";
import { formatMoney, xpForLevel } from "@/game/utils";
import { passiveIncomePerSecond } from "@/game/state";
import { STAGES } from "@/game/data/stages";
import { useAnimatedNumber } from "@/game/useAnimatedNumber";
import { Heart, Shield, Skull } from "lucide-react";

export function HUD() {
  const { state } = useGameCtx();
  const money = useAnimatedNumber(state.money, 350);
  const xpNeeded = xpForLevel(state.level);
  const passive = passiveIncomePerSecond(state);
  const stage = STAGES[state.stage];
  const nextStage = STAGES[state.stage + 1];
  const stageProgress = nextStage
    ? Math.min(100, ((state.totalEarned - stage.threshold) / (nextStage.threshold - stage.threshold)) * 100)
    : 100;

  return (
    <div className="px-4 pt-3 pb-2 space-y-2 sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      {/* Money + passive */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-gold drop-shadow-[0_2px_8px_oklch(0.84_0.17_88_/_0.5)]">
            {formatMoney(money)}
          </div>
          {passive > 0 && (
            <div className="text-xs text-muted-foreground mt-0.5">+{formatMoney(passive)}/сек</div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="px-2 py-1 rounded-full bg-success/20 text-success flex items-center gap-1">
            <Heart className="w-3 h-3" /> {Math.round(state.health)}
          </span>
          <span className="px-2 py-1 rounded-full bg-primary/20 text-primary flex items-center gap-1">
            <Shield className="w-3 h-3" /> {Math.round(state.reputation)}
          </span>
          <span className="px-2 py-1 rounded-full bg-destructive/20 text-destructive flex items-center gap-1">
            <Skull className="w-3 h-3" /> {Math.round(state.corruption)}
          </span>
        </div>
      </div>

      {/* Level + XP bar */}
      <div className="flex items-center gap-2">
        <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-primary text-primary-foreground font-bold text-sm flex items-center justify-center shadow-glow-primary">
          {state.level}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            <span>Рівень {state.level}</span>
            <span>{Math.floor(state.xp)}/{xpNeeded} XP</span>
          </div>
          <div className="h-2 rounded-full bg-surface-2 overflow-hidden relative">
            <div
              className="h-full bg-gradient-primary transition-all duration-300"
              style={{ width: `${(state.xp / xpNeeded) * 100}%` }}
            />
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Stage progress */}
      <div className="flex items-center gap-2">
        <span className="text-base">{stage.emoji}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            <span>{stage.name}</span>
            {nextStage && <span>{nextStage.emoji} {nextStage.name}</span>}
          </div>
          <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
            <div className="h-full bg-gradient-gold" style={{ width: `${stageProgress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
