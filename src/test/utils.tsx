import { ReactNode } from "react";
import { render } from "@testing-library/react";
import { GameProvider } from "@/game/GameContext";

export function renderWithGame(ui: ReactNode) {
  return render(<GameProvider>{ui}</GameProvider>);
}
