import { createFileRoute } from "@tanstack/react-router";
import { useGameCtx } from "@/game/GameContext";
import { JOBS } from "@/game/data/jobs";
import { Lock, Check } from "lucide-react";
import { formatMoney } from "@/game/utils";

export const Route = createFileRoute("/work")({
  component: WorkPage,
});

function WorkPage() {
  const { state, actions } = useGameCtx();
  return (
    <div className="px-4 pt-4 pb-6 space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground px-1">Обери професію</h2>
      <div className="space-y-2">
        {JOBS.map(job => {
          const locked = state.stage < job.unlockStage;
          const active = state.currentJobId === job.id;
          return (
            <button
              key={job.id}
              disabled={locked}
              onClick={() => actions.setJob(job.id)}
              className={`w-full text-left rounded-2xl border p-4 flex items-center gap-3 transition-all ${
                active
                  ? "bg-gradient-primary text-primary-foreground border-primary shadow-glow-primary"
                  : locked
                  ? "bg-card border-border opacity-50"
                  : "bg-card border-border hover:border-primary/50 active:scale-[0.98]"
              }`}
            >
              <div className="text-3xl">{job.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{job.name}</span>
                  {active && <Check className="w-4 h-4" />}
                </div>
                <div className={`text-xs mt-0.5 ${active ? "opacity-90" : "text-muted-foreground"}`}>
                  {locked ? `Розблоковується на стадії ${job.unlockStage + 1}` : job.description}
                </div>
                <div className={`text-xs mt-1 font-medium ${active ? "" : "text-gold"}`}>
                  {locked ? <Lock className="w-3 h-3 inline" /> : `+${formatMoney(job.baseIncome)} / тап`}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
