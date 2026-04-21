
# Українець: Шлях До Успіху — Full Port + Mobile Game Polish

A faithful recreation of the Ukrainian idle clicker game with a fresh, polished, mobile-first design. All progress saved locally in the browser.

## What we'll build

### 6 Tabs (bottom navigation)
1. **Life** — main hero screen: big tap target (the character), HUD with money/health/reputation/corruption/XP, stage progress bar, random event modals.
2. **Work** — 6 jobs from farm laborer → accountant. Tap to earn ₴, with 25% chance of triggering a moral choice event.
3. **Business** — 8 businesses (Street Food → Oligarch Holding) generating passive income every second. Buy + upgrade with `cost × 1.8^level` curve.
4. **Skills** — 8 skills (farming, oratory, bribery, haggling, networking, driving, accounting, marketing), each 5 levels. Boost click income, business income, event outcomes.
5. **Market** — buy cosmetic skins and permanent boosts (Work Boots, Golden Boots, etc.).
6. **Settings** — sound toggle, reset save, version info.

### Game systems
- **5 stages** (Village → Town → City → Kyiv → Elite) unlocked by `totalEarned` thresholds (₴1k / 10k / 100k / 1M).
- **Levels & XP** with `floor(100 × level^1.5)` curve and level-up celebration popup.
- **18 random events** with honest vs. corrupt choices that shift money/health/reputation/corruption.
- **26 achievements** with toast notifications and ₴/XP rewards.
- **Daily tasks** — 3 rotating tasks per day (seeded shuffle, resets daily).
- **Daily login rewards** — 7-day streak, day 7 = Golden Boots permanent bonus.
- **Offline progress** — up to 8 hours of passive income calculated on return, shown in a welcome-back modal.
- **Boss challenges** and **day-progression timer** as in the latest commit.
- **Synthesized sound effects** via Web Audio API (click, purchase, level-up, achievement).

### Save system
- `localStorage` key `ukrainian_clicker_save_v3` with schema versioning.
- Autosave every 30s, on tab switch, and on `beforeunload`.
- NaN sanitization on load; old/incompatible saves rejected gracefully.

## Mobile game polish design
- **Palette**: deep navy background with vivid Ukrainian blue + golden yellow accents, soft glass cards, subtle wheat-field gradient on the Life screen.
- **Big chunky tap button** on Life with scale-bounce animation, floating "+₴" numbers on every tap, particle burst on milestones.
- **Animated counters** for money/XP (smooth tween, not snap).
- **Glowing primary buttons**, rounded-2xl cards, soft shadows, thick progress bars with shimmer.
- **Bottom tab bar** with icon + label, active tab gets glow + scale.
- **Modals** slide up from bottom with backdrop blur (events, level-up, offline earnings, daily reward).
- **Toast notifications** for achievements with gold border + chime.
- Fully responsive but optimized for portrait mobile (current 571×853 viewport).

## Tech approach
- All game data in `src/data/` (jobs, businesses, skills, events, market, achievements, dailyTasks, dailyRewards).
- Single `useGameState` hook owns state + actions + save/load.
- `usePassiveIncome` 1-second tick for businesses.
- `useSound` for synthesized audio.
- Each tab is its own TanStack Router route (`/`, `/work`, `/business`, `/skills`, `/market`, `/settings`) with a shared layout for the HUD + bottom nav.

After approval I'll wire it up tab-by-tab, starting with the Life screen + core state + save system, then layering in Work, Business, Skills, Market, events, achievements, and daily systems.
