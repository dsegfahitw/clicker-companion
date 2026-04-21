import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameState, SkillId } from "./types";
import {
  loadState,
  saveState,
  initialState,
  clickIncome,
  passiveIncomePerSecond,
  businessCost,
  skillCost,
  applyXp,
} from "./state";
import { ACHIEVEMENTS } from "./data/achievements";
import { EVENTS } from "./data/events";
import { MARKET_ITEMS } from "./data/market";
import { DAILY_TASKS, DAILY_REWARDS } from "./data/dailyTasks";
import { stageFromEarned, STAGES } from "./data/stages";
import { sfx } from "./sound";
import { dayIndex, seededShuffle, clamp } from "./utils";
import type { GameEvent, EventChoice } from "./types";

interface Toast {
  id: number;
  emoji: string;
  title: string;
  description?: string;
  variant?: "default" | "achievement" | "level";
}

let toastId = 0;

export function useGame() {
  const [state, setState] = useState<GameState>(() => initialState());
  const [hydrated, setHydrated] = useState(false);

  // Modals
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<number | null>(null);
  const [offlineEarnings, setOfflineEarnings] = useState<number | null>(null);
  const [dailyRewardOpen, setDailyRewardOpen] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const stateRef = useRef(state);
  stateRef.current = state;

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    const loaded = loadState();
    const now = Date.now();
    const elapsedSec = Math.min(8 * 3600, Math.floor((now - loaded.lastSavedAt) / 1000));
    let withOffline = loaded;
    let offlineEarn = 0;
    if (elapsedSec > 30) {
      const rate = passiveIncomePerSecond(loaded);
      offlineEarn = Math.floor(rate * elapsedSec);
      if (offlineEarn > 0) {
        withOffline = {
          ...loaded,
          money: loaded.money + offlineEarn,
          totalEarned: loaded.totalEarned + offlineEarn,
        };
      }
    }

    // Daily login
    const today = dayIndex(now);
    let s = withOffline;
    if (s.lastLoginDay !== today) {
      const consecutive = s.lastLoginDay === today - 1;
      s = {
        ...s,
        loginStreak: consecutive ? Math.min(7, s.loginStreak + 1) : 1,
        lastLoginDay: today,
        dailyClaimed: false,
        taskProgress: {},
        taskCompleted: {},
        lastDailyReset: now,
      };
      setTimeout(() => setDailyRewardOpen(true), 600);
    }

    setState(s);
    setHydrated(true);
    if (offlineEarn > 0) setOfflineEarnings(offlineEarn);
  }, []);

  // Autosave
  useEffect(() => {
    if (!hydrated) return;
    const id = setInterval(() => saveState(stateRef.current), 30_000);
    const onUnload = () => saveState(stateRef.current);
    const onVis = () => { if (document.hidden) saveState(stateRef.current); };
    window.addEventListener("beforeunload", onUnload);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("visibilitychange", onVis);
      saveState(stateRef.current);
    };
  }, [hydrated]);

  // Passive income tick
  useEffect(() => {
    if (!hydrated) return;
    const id = setInterval(() => {
      setState(prev => {
        const rate = passiveIncomePerSecond(prev);
        if (rate <= 0) return prev;
        const earn = rate;
        return {
          ...prev,
          money: prev.money + earn,
          totalEarned: prev.totalEarned + earn,
        };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [hydrated]);

  // Helpers
  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3500);
  }, []);

  const sound = useCallback((kind: keyof typeof sfx) => {
    if (stateRef.current.soundOn) sfx[kind]();
  }, []);

  // Achievements check
  const checkAchievements = useCallback((s: GameState): GameState => {
    let next = s;
    for (const a of ACHIEVEMENTS) {
      if (!next.achievements.includes(a.id) && a.condition(next)) {
        next = {
          ...next,
          achievements: [...next.achievements, a.id],
          money: next.money + a.rewardMoney,
          totalEarned: next.totalEarned + a.rewardMoney,
        };
        const r = applyXp(next, a.rewardXp);
        next = r.state;
        sound("achievement");
        pushToast({ emoji: a.emoji, title: `Досягнення: ${a.name}`, description: `+₴${a.rewardMoney} • +${a.rewardXp} XP`, variant: "achievement" });
      }
    }
    return next;
  }, [pushToast, sound]);

  // Stage check
  const checkStage = useCallback((s: GameState): GameState => {
    const ns = stageFromEarned(s.totalEarned);
    if (ns > s.stage) {
      pushToast({ emoji: STAGES[ns].emoji, title: `Нова стадія: ${STAGES[ns].name}`, variant: "level" });
      sound("levelUp");
      return { ...s, stage: ns };
    }
    return s;
  }, [pushToast, sound]);

  // Level handling
  const grantXp = useCallback((s: GameState, xp: number): GameState => {
    const r = applyXp(s, xp);
    if (r.leveledUp) {
      sound("levelUp");
      setLevelUpInfo(r.state.level);
    }
    return r.state;
  }, [sound]);

  // ===== Actions =====
  const tap = useCallback(() => {
    sound("click");
    setState(prev => {
      const earn = clickIncome(prev);
      let next: GameState = {
        ...prev,
        money: prev.money + earn,
        totalEarned: prev.totalEarned + earn,
        taps: prev.taps + 1,
      };
      next = grantXp(next, 1);
      next = checkStage(next);
      // Update tasks
      next = updateTasks(next, "taps", 1);
      next = updateTasks(next, "earned", earn);
      next = checkAchievements(next);
      // Random event 8% chance
      if (Math.random() < 0.08) {
        const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        setTimeout(() => setActiveEvent(ev), 50);
      }
      return next;
    });
  }, [sound, grantXp, checkStage, checkAchievements]);

  const buyBusiness = useCallback((id: string) => {
    setState(prev => {
      const cost = businessCost(prev, id);
      if (prev.money < cost) { sound("error"); return prev; }
      sound("buy");
      const wasOwned = (prev.businesses[id] ?? 0) > 0;
      let next: GameState = {
        ...prev,
        money: prev.money - cost,
        businesses: { ...prev.businesses, [id]: (prev.businesses[id] ?? 0) + 1 },
      };
      next = grantXp(next, 20);
      if (!wasOwned) next = updateTasks(next, "businessBought", 1);
      next = checkAchievements(next);
      return next;
    });
  }, [sound, grantXp, checkAchievements]);

  const buySkill = useCallback((id: SkillId) => {
    setState(prev => {
      if (prev.skills[id] >= 5) { sound("error"); return prev; }
      const cost = skillCost(prev, id);
      if (prev.money < cost) { sound("error"); return prev; }
      sound("buy");
      let next: GameState = {
        ...prev,
        money: prev.money - cost,
        skills: { ...prev.skills, [id]: prev.skills[id] + 1 },
      };
      next = grantXp(next, 30);
      next = updateTasks(next, "skillBought", 1);
      next = checkAchievements(next);
      return next;
    });
  }, [sound, grantXp, checkAchievements]);

  const buyMarketItem = useCallback((id: string) => {
    setState(prev => {
      if (prev.marketOwned.includes(id)) { sound("error"); return prev; }
      const it = MARKET_ITEMS.find(m => m.id === id);
      const cost = it?.cost ?? 0;
      if (!it || prev.money < cost) { sound("error"); return prev; }
      sound("buy");
      let next: GameState = {
        ...prev,
        money: prev.money - cost,
        marketOwned: [...prev.marketOwned, id],
      };
      next = grantXp(next, 50);
      next = checkAchievements(next);
      return next;
    });
  }, [sound, grantXp, checkAchievements]);

  const setJob = useCallback((id: string) => {
    setState(prev => ({ ...prev, currentJobId: id }));
  }, []);

  const resolveEvent = useCallback((choice: EventChoice) => {
    setState(prev => {
      let next: GameState = {
        ...prev,
        money: Math.max(0, prev.money + (choice.money ?? 0)),
        health: clamp(prev.health + (choice.health ?? 0), 0, 100),
        reputation: prev.reputation + (choice.reputation ?? 0),
        corruption: prev.corruption + (choice.corruption ?? 0),
      };
      if ((choice.money ?? 0) > 0) next.totalEarned += choice.money!;
      if (choice.xp) next = grantXp(next, choice.xp);
      next = checkAchievements(next);
      return next;
    });
    setActiveEvent(null);
  }, [grantXp, checkAchievements]);

  const claimDaily = useCallback(() => {
    setState(prev => {
      if (prev.dailyClaimed) return prev;
      const dayIdx = Math.min(7, Math.max(1, prev.loginStreak)) - 1;
      const reward = DAILY_REWARDS[dayIdx] ?? 0;
      sound("reward");
      let next: GameState = {
        ...prev,
        dailyClaimed: true,
        money: prev.money + reward,
        totalEarned: prev.totalEarned + reward,
      };
      // Day 7 grants golden boots
      if (dayIdx === 6 && !prev.marketOwned.includes("golden-boots")) {
        next.marketOwned = [...prev.marketOwned, "golden-boots"];
        pushToast({ emoji: "👢", title: "Золоті чоботи!", description: "Назавжди +50% усього", variant: "achievement" });
      }
      if (reward > 0) pushToast({ emoji: "🎁", title: `Щоденна нагорода: ₴${reward}`, variant: "default" });
      next = checkAchievements(next);
      return next;
    });
  }, [sound, pushToast, checkAchievements]);

  const resetSave = useCallback(() => {
    if (!confirm("Скинути увесь прогрес?")) return;
    localStorage.removeItem("ukrainian_clicker_save_v3");
    setState(initialState());
    setActiveEvent(null);
    setLevelUpInfo(null);
    setOfflineEarnings(null);
  }, []);

  const toggleSound = useCallback(() => {
    setState(prev => ({ ...prev, soundOn: !prev.soundOn }));
  }, []);

  // Today's tasks
  const todaysTasks = useMemo(() => {
    const today = dayIndex();
    return seededShuffle(DAILY_TASKS, today).slice(0, 3);
  }, [state.lastLoginDay]);

  function updateTasks(s: GameState, metric: string, amount: number): GameState {
    const today = dayIndex();
    const todays = seededShuffle(DAILY_TASKS, today).slice(0, 3);
    const taskProgress = { ...s.taskProgress };
    const taskCompleted = { ...s.taskCompleted };
    let bonusMoney = 0;
    for (const t of todays) {
      if (t.metric !== metric) continue;
      if (taskCompleted[t.id]) continue;
      const cur = (taskProgress[t.id] ?? 0) + amount;
      taskProgress[t.id] = cur;
      if (cur >= t.goal) {
        taskCompleted[t.id] = true;
        bonusMoney += t.reward;
        pushToast({ emoji: "✅", title: `Завдання: ${t.title}`, description: `+₴${t.reward}` });
        sound("reward");
      }
    }
    return {
      ...s,
      taskProgress,
      taskCompleted,
      money: s.money + bonusMoney,
      totalEarned: s.totalEarned + bonusMoney,
    };
  }

  return {
    state,
    hydrated,
    todaysTasks,
    activeEvent,
    levelUpInfo,
    offlineEarnings,
    dailyRewardOpen,
    toasts,
    actions: {
      tap,
      buyBusiness,
      buySkill,
      buyMarketItem,
      setJob,
      resolveEvent,
      claimDaily,
      resetSave,
      toggleSound,
      closeLevelUp: () => setLevelUpInfo(null),
      closeOffline: () => setOfflineEarnings(null),
      closeDaily: () => setDailyRewardOpen(false),
      closeEvent: () => setActiveEvent(null),
    },
  };
}
