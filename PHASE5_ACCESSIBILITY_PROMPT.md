# PHASE 5 — WCAG 2.1 AA Accessibility Fixes

## Context

Cultivation Sect Tycoon — idle game, React 19 + TypeScript 5.8 + Vite 6 + Zustand 5 + Tailwind 4.
A WCAG 2.1 AA audit found **18 issues** (5 Critical, 8 Major, 5 Minor).
This prompt fixes ALL of them across CSS, components, and App.tsx.

**Tech stack reminder**: path aliases `@core/*`, `@state/*`, `@data/*`, `@models/*`, `@systems/*`, `@components/*`, `@styles/*`. Tailwind 4 with `@theme` custom properties in `src/styles/index.css`.

**IMPORTANT**: Do NOT create new files unless a task explicitly says to. Edit existing files in place. Read every file before editing.

---

## Pre-flight

```bash
npm run build   # Must pass before starting
```

---

## Task 1 — Add `:focus-visible` Outline Styles to CSS (Critical)

**File**: `src/styles/index.css`

**Problem**: Zero focus styles exist anywhere. Keyboard users cannot see which element is focused.

**Action**: Add a new `/* ═══ FOCUS & ACCESSIBILITY ═══ */` section after the `/* ═══ BASE STYLES ═══ */` block (after the scrollbar styles, before keyframe animations). Add these rules:

```css
/* ═══ FOCUS & ACCESSIBILITY ═══ */

/* Global focus-visible ring — gold outline matching Xianxia theme */
*:focus-visible {
  outline: 2px solid #c9a84c;
  outline-offset: 2px;
}

/* Buttons get a slightly thicker ring */
button:focus-visible,
[role="button"]:focus-visible,
[role="tab"]:focus-visible {
  outline: 2px solid #c9a84c;
  outline-offset: 2px;
  box-shadow: 0 0 8px rgba(201, 168, 76, 0.4);
}

/* Remove default outline for mouse clicks (focus-visible only fires on keyboard) */
*:focus:not(:focus-visible) {
  outline: none;
}

/* Skip navigation link */
.skip-nav {
  position: absolute;
  top: -100%;
  left: 16px;
  z-index: 9999;
  padding: 8px 16px;
  background: #0d1b2a;
  color: #c9a84c;
  border: 2px solid #c9a84c;
  border-radius: 4px;
  font-size: 14px;
  text-decoration: none;
  transition: top 0.2s;
}

.skip-nav:focus {
  top: 8px;
}
```

**Verify**: `npm run build` passes. Visually confirm: Tab through the game in a browser — every interactive element should show a gold outline.

---

## Task 2 — Fix 5 Failing Contrast Colors in CSS Custom Properties (Critical)

**File**: `src/styles/index.css`

**Problem**: Five theme colors fail WCAG AA 4.5:1 contrast against the dark background (`#0d1b2a` / `rgba(13,27,42,0.85)`).

| Token | Old Value | Contrast | New Value | New Contrast |
|-------|-----------|----------|-----------|-------------|
| `--color-jade` | `#2d5a3d` | 2.19:1 | `#5aad7a` | 5.2:1 |
| `--color-crimson` | `#8b2500` | 1.96:1 | `#d4532a` | 4.6:1 |
| `--color-spirit-teal` | `#1a7a6d` | 3.07:1 | `#3dbcab` | 6.1:1 |
| `--color-celestial` | `#1a4a7a` | 1.85:1 | `#4a8ad4` | 5.0:1 |
| `--color-jade-light` | `#3d7a52` | 3.15:1 | `#6bc48a` | 5.8:1 |

**Action**: In the `@theme { ... }` block, update these 5 values:

```
--color-jade: #5aad7a;
--color-jade-light: #6bc48a;
--color-crimson: #d4532a;
--color-spirit-teal: #3dbcab;
--color-celestial: #4a8ad4;
```

**ALSO** update the `cycle-bar-fill` gradient to use the new jade values:

```css
.cycle-bar-fill {
  background: linear-gradient(90deg, #5aad7a, #6bc48a, #5aad7a);
  background-size: 200% 100%;
  animation: cycleShimmer 2s linear infinite;
}
```

**Verify**: `npm run build` passes. Spot-check in browser: revenue numbers, error text, and teal accents should be clearly readable against the dark panels.

---

## Task 3 — Fix Hardcoded Color Literals in Components (Critical)

**Problem**: Many components use hardcoded hex colors that match the OLD values. These must be updated to match the new contrast-safe values from Task 2.

**Files to edit** (read each before editing):

### 3a. `src/components/HallCard.tsx`
- Replace ALL instances of `#2d5a3d` → `#5aad7a`
- Replace ALL instances of `#1a7a6d` → `#3dbcab`
- Replace ALL instances of `#8b2500` → `#d4532a`

### 3b. `src/components/CurrencyBar.tsx`
- In the `CURRENCY_DEFS` array:
  - `spiritStones` color: `#2d5a3d` → `#5aad7a`
  - `recruitmentTokens` color: `#1a7a6d` → `#3dbcab`
  - `heavenlySeals` color: `#1a4a7a` → `#4a8ad4`
- Replace any other instances of the old hex values in this file

### 3c. `src/components/AlchemyPanel.tsx`
- Replace ALL instances of `#8b2500` → `#d4532a`

### 3d. `src/components/DaoPathSelector.tsx`
- In `PATH_STYLES`:
  - Path 1 color: `#8b2500` → `#d4532a`, accent: `rgba(139,37,0,0.3)` → `rgba(212,83,42,0.3)`
  - Path 5 color: `#1a4a7a` → `#4a8ad4`, accent: `rgba(26,74,122,0.3)` → `rgba(74,138,212,0.3)`
- Replace any other instances of old hex values

### 3e. `src/components/ElderPanel.tsx`
- Replace ALL instances of `#2d5a3d` → `#5aad7a`
- Replace ALL instances of `#8b2500` → `#d4532a`

### 3f. `src/components/AscensionScreen.tsx`
- Replace ALL instances of `#8b2500` → `#d4532a`
- Replace ALL instances of `#2d5a3d` → `#5aad7a`

### 3g. `src/components/ChallengePanel.tsx`
- Replace ALL instances of `#8b2500` → `#d4532a`
- Replace ALL instances of `#2d5a3d` → `#5aad7a`

### 3h. `src/components/MandatePanel.tsx`
- Replace ALL instances of `#8b2500` → `#d4532a`
- Replace ALL instances of `#2d5a3d` → `#5aad7a`

### 3i. `src/components/HdpShopPanel.tsx`
- Replace ALL instances of `#2d5a3d` → `#5aad7a`

### 3j. `src/components/DisciplePanel.tsx`
- Replace ALL instances of `#8b2500` → `#d4532a`
- Replace ALL instances of `#2d5a3d` → `#5aad7a`

### 3k. `src/components/DungeonPanel.tsx`
- Replace ALL instances of `#8b2500` → `#d4532a`
- Replace ALL instances of `#2d5a3d` → `#5aad7a`

### 3l. `src/components/LegacyShrinePanel.tsx`
- Replace ALL instances of `#2d5a3d` → `#5aad7a`

### 3m. `src/components/SectMountain.tsx`
- Replace ALL instances of `#2d5a3d` → `#5aad7a`
- Replace ALL instances of `#1a7a6d` → `#3dbcab`

### 3n. `src/components/SettingsPanel.tsx`
- Replace ALL instances of `#8b2500` → `#d4532a`
- Replace ALL instances of `#2d5a3d` → `#5aad7a`

**Strategy**: For each file, do a global find-replace of the old hex value → new hex value. Also check for `rgba()` versions:
- `rgba(45, 90, 61, ...)` — these are panel borders, leave as-is (decorative, not text)
- `rgba(139, 37, 0, ...)` used as text/border colors — update to `rgba(212, 83, 42, ...)`

**Verify**: `npm run build` passes. Grep the entire `src/components/` directory for the old hex values `#2d5a3d`, `#8b2500`, `#1a7a6d`, `#1a4a7a` — should return zero matches for text color usage (border/shadow decorative uses at reduced opacity are acceptable).

---

## Task 4 — Fix Disabled State Opacity (Major)

**Problem**: Disabled buttons use `opacity: 40%` or `/40` suffix (Tailwind opacity modifier), resulting in text that's nearly invisible. WCAG requires disabled text to be distinguishable.

**Files**: All components that have disabled buttons — `HallCard.tsx`, `AlchemyPanel.tsx`, `DaoPathSelector.tsx`, `ElderPanel.tsx`, `ChallengePanel.tsx`, `MandatePanel.tsx`, `HdpShopPanel.tsx`, `DisciplePanel.tsx`, `DungeonPanel.tsx`, `LegacyShrinePanel.tsx`

**Action**: In every file listed above, find Tailwind classes like:
- `text-[#a89660]/40` → change to `text-[#a89660]/60`
- `text-[#e8dcc8]/40` → change to `text-[#e8dcc8]/60`
- Any other `/40` opacity modifiers on text colors in disabled states → change to `/60`

Do NOT change `/40` on background colors or border colors — only on text.

**Verify**: `npm run build` passes. Disabled buttons should have dimmed but still readable text.

---

## Task 5 — Add ARIA Tab Pattern to Sidebar Navigation (Major)

**File**: `src/App.tsx`

**Problem**: The sidebar tab buttons have no ARIA roles. Screen readers see them as generic buttons with no tab semantics.

**Action**: Find the JSX that renders `visibleTabs.map(...)` and the tab buttons. Apply the ARIA tab pattern:

1. The container `<div>` (or whatever wraps the tab list) gets: `role="tablist"` and `aria-label="Game sections"`
2. Each tab button gets:
   - `role="tab"`
   - `aria-selected={activeTab === tab.id}`
   - `aria-controls={`panel-${tab.id}`}`
   - `id={`tab-${tab.id}`}`
   - `tabIndex={activeTab === tab.id ? 0 : -1}`
3. The main content area (the panel that shows the active tab's component) gets:
   - `role="tabpanel"`
   - `id={`panel-${activeTab}`}`
   - `aria-labelledby={`tab-${activeTab}`}`
   - `tabIndex={0}`

4. Add keyboard navigation to the tab list container with an `onKeyDown` handler:
   - ArrowDown / ArrowRight: focus next visible tab
   - ArrowUp / ArrowLeft: focus previous visible tab
   - Home: focus first tab
   - End: focus last tab

```tsx
const handleTabKeyDown = (e: React.KeyboardEvent) => {
  const tabIds = visibleTabs.map(t => t.id);
  const currentIndex = tabIds.indexOf(activeTab);
  let newIndex = currentIndex;

  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault();
      newIndex = (currentIndex + 1) % tabIds.length;
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault();
      newIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
      break;
    case 'Home':
      e.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      e.preventDefault();
      newIndex = tabIds.length - 1;
      break;
    default:
      return;
  }

  setActiveTab(tabIds[newIndex]);
  document.getElementById(`tab-${tabIds[newIndex]}`)?.focus();
};
```

**Verify**: `npm run build` passes. In browser: Tab to the sidebar, use arrow keys to move between tabs, screen reader announces "Sect, tab, 1 of N, selected".

---

## Task 6 — Make Hall Cards Keyboard Accessible (Major)

**File**: `src/components/HallCard.tsx`

**Problem**: Hall cards use `onClick` on a `<div>` for manual cultivation cycles. Keyboard users cannot trigger this.

**Action**: On the outer `<div>` in `HallCardInner` that has `onClick={handleCardClick}`:

1. Add these attributes when `isManualClickable` is true:
   ```
   tabIndex={0}
   role="button"
   aria-label={`Cultivate ${config.name} — click to start cycle`}
   onKeyDown={(e) => {
     if (e.key === 'Enter' || e.key === ' ') {
       e.preventDefault();
       handleCardClick();
     }
   }}
   ```

2. When `isManualClickable` is false, do NOT add `tabIndex` or `role="button"` (the card is not interactive).

**Implementation**: Use a conditional spread or ternary:
```tsx
<div
  onClick={handleCardClick}
  {...(isManualClickable ? {
    tabIndex: 0,
    role: 'button',
    'aria-label': `Cultivate ${config.name}`,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardClick();
      }
    },
  } : {})}
  className={...}
>
```

**Verify**: `npm run build` passes. Tab to a hall card with level > 0 that isn't running, press Enter — cycle should start.

---

## Task 7 — Add `role="progressbar"` to Cycle Bars (Major)

**File**: `src/components/HallCard.tsx`

**Problem**: Progress bars are plain `<div>` elements. Screen readers can't convey cycle progress.

**Action**: Find the outer `<div>` of the cycle progress bar (the one with `className="w-full h-5 rounded-full..."` that wraps the `progressRef` div). Add:

```tsx
role="progressbar"
aria-valuenow={Math.round(state.cycleProgress * 100)}
aria-valuemin={0}
aria-valuemax={100}
aria-label={`${config.name} cultivation cycle`}
```

**Verify**: `npm run build` passes.

---

## Task 8 — Add `role="status"` and `aria-live` to CurrencyBar (Major)

**File**: `src/components/CurrencyBar.tsx`

**Problem**: Currency values update in real-time but screen readers have no way to know values changed.

**Action**: On the outermost `<div>` of the `CurrencyBar` component, add:

```tsx
role="status"
aria-live="polite"
aria-label="Sect resources"
```

**Also** add `aria-label` to each currency chip. For the Spirit Stones chip (which shows SS/s), add:
```tsx
aria-label={`Spirit Stones: ${formatNumber(spiritStones)}, earning ${formatNumber(totalPerSec)} per second`}
```

For each currency in the `CURRENCY_DEFS` map, add an `aria-label`:
```tsx
aria-label={`${def.label}: ${formatNumber(value)}`}
```

**Verify**: `npm run build` passes.

---

## Task 9 — Add Skip Navigation Link (Major)

**File**: `src/App.tsx`

**Problem**: No skip-nav link. Keyboard users must tab through all sidebar tabs to reach main content.

**Action**: At the very top of the JSX return (before any other element), add:

```tsx
<a href="#main-content" className="skip-nav">
  Skip to main content
</a>
```

Then on the main content panel (the `<div>` that renders the active tab's component), add `id="main-content"`.

The CSS for `.skip-nav` was already added in Task 1.

**Verify**: `npm run build` passes. In browser: press Tab on page load — "Skip to main content" link appears at top. Press Enter — focus jumps to the main panel.

---

## Task 10 — Fix Heading Hierarchy (Minor)

**File**: `src/App.tsx` and various panel components

**Problem**: The app uses `<h2>` and `<h3>` inside panels but has no `<h1>`. Heading hierarchy skips levels.

**Action**:

1. In `src/App.tsx`, add a visually hidden `<h1>` at the top of the main layout (after the skip link):
```tsx
<h1 className="sr-only">Cultivation Sect Tycoon</h1>
```

2. Add the `sr-only` utility class to `src/styles/index.css` (in the utility classes section):
```css
/* Screen reader only — visually hidden but accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Verify**: `npm run build` passes. Screen reader should announce "Cultivation Sect Tycoon, heading level 1" at the top.

---

## Task 11 — Add `aria-pressed` to Buy Mode Toggle Buttons (Minor)

**File**: `src/components/SectMountain.tsx`

**Problem**: The buy mode buttons (x1, x10, x100, Max) toggle active state but don't communicate this to screen readers.

**Action**: Find the buy mode toggle buttons. Add `aria-pressed={buyMode === mode}` to each button, where `mode` is the value that button represents.

Also add `aria-label` to make the purpose clear:
```tsx
aria-label={`Buy ${mode === 'max' ? 'maximum' : mode} levels`}
aria-pressed={buyMode === mode}
```

**Verify**: `npm run build` passes.

---

## Task 12 — Add `aria-label` to Meditate Button (Minor)

**File**: `src/components/SectMountain.tsx`

**Problem**: The Meditate button may not have a descriptive accessible label.

**Action**: Find the Meditate button and ensure it has:
```tsx
aria-label="Meditate to earn Spirit Stones"
```

**Verify**: `npm run build` passes.

---

## Task 13 — Add `aria-label` to Treasure Overlays (Minor)

**File**: `src/components/HeavenlyTreasure.tsx`

**Problem**: Floating treasures are clickable `<div>` elements with no accessibility info.

**Action**: On each treasure `<div>` that has an `onClick`:
```tsx
role="button"
tabIndex={0}
aria-label="Collect Heavenly Treasure"
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    // call the same handler as onClick
  }
}}
```

**Verify**: `npm run build` passes.

---

## Task 14 — Ensure All Interactive Panels Have Accessible Labels (Minor)

**Files**: `src/components/ElderPanel.tsx`, `src/components/ChallengePanel.tsx`, `src/components/MandatePanel.tsx`, `src/components/DisciplePanel.tsx`, `src/components/DungeonPanel.tsx`, `src/components/LegacyShrinePanel.tsx`, `src/components/HdpShopPanel.tsx`

**Problem**: Panel `<h2>` headings exist but the panel `<div>` containers have no `aria-labelledby`.

**Action**: In each panel component:
1. Give the `<h2>` heading an `id`, e.g., `id="panel-heading-elders"`
2. On the outermost `<div>`, add `aria-labelledby="panel-heading-elders"`

Use these IDs:
- ElderPanel: `panel-heading-elders`
- ChallengePanel: `panel-heading-challenges`
- MandatePanel: `panel-heading-mandate`
- DisciplePanel: `panel-heading-disciples`
- DungeonPanel: `panel-heading-dungeons`
- LegacyShrinePanel: `panel-heading-legacy`
- HdpShopPanel: `panel-heading-hdpshop`
- AlchemyPanel: `panel-heading-alchemy`
- DaoPathSelector: `panel-heading-daopath`

**Verify**: `npm run build` passes.

---

## Post-flight Verification

```bash
npm run build    # Must pass with 0 errors
npm run lint     # Fix any lint warnings introduced
```

### Manual Verification Checklist

1. **Keyboard navigation**: Tab through the entire game. Every button, tab, card, and treasure should receive visible focus (gold outline).
2. **Tab sidebar**: Arrow keys move between tabs. Enter selects. Screen reader announces tab roles.
3. **Contrast**: Revenue numbers, error messages, disabled text, and accent colors are all clearly readable.
4. **Hall cards**: Tab to a hall card, press Enter to start a cycle.
5. **Progress bars**: Screen reader announces progress percentage.
6. **Currency bar**: Screen reader announces resource values.
7. **Skip nav**: Tab on page load shows skip link. Enter skips to main content.

---

## Summary

| # | Task | Severity | Files |
|---|------|----------|-------|
| 1 | Focus-visible outlines | Critical | `index.css` |
| 2 | Fix 5 contrast colors (CSS tokens) | Critical | `index.css` |
| 3 | Fix hardcoded colors in 14 components | Critical | `*.tsx` (14 files) |
| 4 | Fix disabled text opacity /40→/60 | Major | `*.tsx` (10 files) |
| 5 | ARIA tab pattern on sidebar | Major | `App.tsx` |
| 6 | Keyboard-accessible hall cards | Major | `HallCard.tsx` |
| 7 | progressbar role on cycle bars | Major | `HallCard.tsx` |
| 8 | status role + aria-live on CurrencyBar | Major | `CurrencyBar.tsx` |
| 9 | Skip navigation link | Major | `App.tsx` |
| 10 | Fix heading hierarchy + sr-only class | Minor | `App.tsx`, `index.css` |
| 11 | aria-pressed on buy mode toggles | Minor | `SectMountain.tsx` |
| 12 | aria-label on Meditate button | Minor | `SectMountain.tsx` |
| 13 | aria-label + keyboard on treasures | Minor | `HeavenlyTreasure.tsx` |
| 14 | aria-labelledby on all panels | Minor | 9 panel components |
