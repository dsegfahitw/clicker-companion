
# Test Suite for Українець: Шлях До Успіху

A comprehensive automated test suite covering pure game logic, state reducers, persistence, and React components.

## Testing stack
- **Vitest** — fast Vite-native test runner, integrates with the existing Vite 7 config.
- **@testing-library/react** + **@testing-library/jest-dom** — component rendering and assertions.
- **@testing-library/user-event** — realistic user interactions (taps, clicks).
- **jsdom** — browser-like environment for `localStorage`, DOM APIs.
- **happy-dom** alternative not needed — jsdom is sufficient and more compatible.

## Configuration
- Add `vitest.config.ts` (separate from `vite.config.ts` to avoid SSR plugin conflicts) with jsdom environment and path alias `@` → `src`.
- Add `src/test/setup.ts` to import `@testing-library/jest-dom`, mock `Web Audio API` (for `sound.ts`), and reset `localStorage` between tests.
- Add scripts to `package.json`: `test`, `test:watch`, `test:coverage`, `test:ui`.

## Test files (organized by concern)

### 1. Pure utilities — `src/game/__tests__/utils.test.ts`
- `formatMoney`: zero, negatives, K/M/B/T thresholds, NaN/Infinity → "₴0", Ukrainian locale separators.
- `xpForLevel`: monotonic growth, level 1/10/50 known values.
- `dayIndex`: stable across same-day timestamps, increments at midnight UTC.
- `seededShuffle`: deterministic for same seed, different for different seeds, preserves length & elements.
- `clamp`, `safeNum`: boundary cases, non-numeric inputs.

### 2. Stage logic — `src/game/__tests__/stages.test.ts`
- `stageFromEarned`: returns 0/1/2/3/4 at correct thresholds (0, 1k, 10k, 100k, 1M) and just below each.

### 3. State derivations — `src/game/__tests__/state.test.ts`
- `initialState`: correct defaults, all businesses at 0, all skills at 0, version = 3.
- `sanitizeState`: rejects null/wrong-version, clamps health 0–100, clamps skills 0–5, floors negative money to 0, filters invalid arrays, preserves valid data.
- `loadState` / `saveState`: round-trip via `localStorage`, returns `initialState` on missing/corrupt JSON, handles quota errors silently.
- `clickIncome`: base job income, farming/driving multipliers stack, market click bonuses apply, minimum 1.
- `passiveIncomePerSecond`: zero with no businesses, exponential 1.5^(level-1) scaling, networking/accounting/marketing skill multipliers, market passive bonuses.
- `businessCost`: 1.8^level scaling, haggling discount caps at 50%.
- `skillCost`: 3^level scaling, returns Infinity for unknown skill.
- `applyXp`: single level-up, multi-level-up in one call, no-level case, leftover XP carries.

### 4. Game data integrity — `src/game/__tests__/data.test.ts`
- All `JOBS`, `BUSINESSES`, `SKILLS`, `MARKET_ITEMS` have unique IDs.
- All `EVENTS` have both `honest` and `corrupt` choices.
- All 26 `ACHIEVEMENTS` have valid `condition` functions (callable, return boolean).
- All `DAILY_TASKS` reference valid metrics.
- Stage thresholds are strictly increasing.

### 5. Game hook — `src/game/__tests__/useGame.test.tsx`
- Render `useGame` via `renderHook` wrapped in `GameProvider`.
- `tap()`: increases money, totalEarned, taps, XP; respects click income; triggers achievements; saves to localStorage.
- `buyBusiness()`: deducts cost, increments level, fails when broke, recalculates passive income.
- `buySkill()`: deducts cost, caps at level 5, applies multipliers immediately.
- `buyMarketItem()`: one-time purchase, prevents duplicate ownership.
- `chooseJob()`: changes `currentJobId`, respects stage unlock.
- `claimDaily()`: grants reward, sets `dailyClaimed`, increments `loginStreak`.
- `resolveEvent()`: applies honest/corrupt effects to all resources.
- Passive tick: vi.useFakeTimers, advance 1s, money increases by passive rate.
- Offline progress: mock `lastSavedAt` 1h ago on load, money jumps by capped offline earnings.
- Auto-save: state changes persisted to localStorage within debounce window.

### 6. Components — `src/components/game/__tests__/`
- **HUD.test.tsx**: renders money, level, XP bar width %, stage emoji, health/rep/corruption pills with correct values.
- **BottomNav.test.tsx**: 6 tabs render, active tab highlighted based on route, icons present.
- **Modals.test.tsx**: event modal shows when event triggered, honest/corrupt buttons call resolver, level-up modal shows on level change, offline modal shows captured earnings, daily reward modal claims correctly.
- **Toasts.test.tsx**: achievement toast appears when achievement unlocked.

### 7. Routes (smoke tests) — `src/routes/__tests__/`
- Each route renders without crashing inside `GameProvider` + memory router.
- `/` shows tap target, `/work` lists jobs, `/business` lists businesses, `/skills` lists skills, `/market` lists items, `/settings` has reset + sound toggle.

### 8. Integration — `src/test/integration/playthrough.test.tsx`
- Full simulated playthrough: render app, tap 100 times, verify money + XP + level progression.
- Buy first business → verify passive income kicks in after timer tick.
- Reach stage 1 threshold → verify stage upgrade reflected in HUD.
- Save → reload → state restored intact.

## Coverage target
- ≥ 90% statements/branches on `src/game/**`.
- ≥ 70% on components.
- Coverage report via `vitest --coverage` (v8 provider).

## Deliverables after approval
1. Install dev deps: `vitest`, `@vitest/ui`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
2. Create `vitest.config.ts`, `src/test/setup.ts`, `src/test/utils.tsx` (custom render with providers).
3. Write all test files listed above (~15 files, ~150 test cases).
4. Add npm scripts.
5. Run `npm test` and confirm green; report final pass/fail and coverage numbers.
