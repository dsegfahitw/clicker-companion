import { createContext, useContext, ReactNode } from "react";
import { useGame } from "./useGame";

type GameCtx = ReturnType<typeof useGame>;

const Ctx = createContext<GameCtx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const game = useGame();
  return <Ctx.Provider value={game}>{children}</Ctx.Provider>;
}

export function useGameCtx(): GameCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGameCtx must be used inside GameProvider");
  return ctx;
}
