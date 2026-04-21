import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { HUD } from "../HUD";
import { renderWithGame } from "@/test/utils";
import { initialState, saveState } from "@/game/state";

beforeEach(() => localStorage.clear());

describe("<HUD />", () => {
  it("renders level, money symbol and stage label", async () => {
    saveState({ ...initialState(), money: 1234, level: 3, xp: 25 });
    renderWithGame(<HUD />);
    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument(); // level chip
    });
    expect(screen.getByText(/Рівень 3/)).toBeInTheDocument();
    expect(screen.getByText(/Село/)).toBeInTheDocument();
  });

  it("renders the resource pills (health/rep/corruption values)", async () => {
    saveState({
      ...initialState(),
      health: 77,
      reputation: 12,
      corruption: 4,
    });
    renderWithGame(<HUD />);
    await waitFor(() => {
      expect(screen.getByText("77")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });
});
