import { Outlet } from "@tanstack/react-router";
import { GameProvider } from "@/game/GameContext";
import { HUD } from "./HUD";
import { BottomNav } from "./BottomNav";
import { Modals } from "./Modals";
import { Toasts } from "./Toasts";

export function GameLayout() {
  return (
    <GameProvider>
      <div className="min-h-screen flex flex-col max-w-xl mx-auto">
        <HUD />
        <main className="flex-1 pb-24">
          <Outlet />
        </main>
        <BottomNav />
        <Modals />
        <Toasts />
      </div>
    </GameProvider>
  );
}
