# Українець: Шлях До Успіху 🇺🇦

A mobile-first idle clicker game where you guide a Ukrainian hero from village worker to oligarch through tapping, business empires, skill upgrades, and moral choices. Fully playable in the browser, with all progress saved locally.

> Faithful port of [`dsegfahitw/ukrainian-clicker`](https://github.com/dsegfahitw/ukrainian-clicker) with a fresh, polished mobile-game UI.

## ✨ Features

- **6 Tabs** — Life (tap), Work, Business, Skills, Market, Settings
- **5 Stages** — Village → City → Entrepreneur → Tycoon → Oligarch
- **Idle income** — Businesses earn while you're away (up to 8h offline catch-up)
- **Skill tree** — 8 skills with level caps and stacking multipliers
- **Random events** — Moral choices that affect reputation & corruption
- **Daily rewards** — 7-day login streak with golden boots on day 7
- **Daily tasks** — Rotating goals seeded per day
- **26 achievements** — With money + XP rewards
- **Synthesized SFX** — Web Audio API, no asset downloads
- **LocalStorage persistence** — Auto-save every 30s + on unload
- **Ukrainian-themed design** — Blue & gold palette, glassmorphism, animated counters

## 🛠 Tech Stack

- **TanStack Start v1** (React 19 + Vite 7) — file-based routing
- **Tailwind CSS v4** — design tokens in `src/styles.css`
- **shadcn/ui** — accessible component primitives
- **Vitest** + **Testing Library** — 87 passing tests
- **TypeScript** strict mode

## 🚀 Getting Started

```bash
bun install
bun dev          # start dev server
bun test         # run tests
bun run build    # production build
```

Open [http://localhost:5173](http://localhost:5173) and start tapping.

## 📁 Project Structure

```
src/
├── game/             # Pure game logic (state, data, hooks)
│   ├── data/         # Jobs, businesses, skills, events, market, achievements
│   ├── state.ts      # Reducers, persistence, income formulas
│   ├── useGame.ts    # Main game hook (actions + side effects)
│   └── __tests__/    # Logic test suite
├── components/game/  # HUD, BottomNav, Modals, Toasts
├── routes/           # 6 tab routes + root layout
└── styles.css        # Design tokens + animations
```

## 🎮 Core Formulas

| System          | Formula                          |
| --------------- | -------------------------------- |
| XP per level    | `floor(100 * level^1.5)`         |
| Business cost   | `baseCost * 1.8^level`           |
| Business income | `baseIncome * 1.5^(level-1)`     |
| Skill cost      | `baseCost * 3^level` (cap lvl 5) |
| Offline cap     | 8 hours                          |
| Event chance    | 8% per tap                       |

## 🧪 Testing

```bash
bun test              # one-shot
bun test:watch        # watch mode
bun test:coverage     # v8 coverage report
```

Coverage targets: ≥90% on `src/game/**`, ≥70% on components.

## 💾 Save Data

Stored under the key `ukrainian_clicker_save_v3` in `localStorage`. Use **Settings → Reset** to wipe progress.

## 📜 License

MIT — free to remix and republish.
