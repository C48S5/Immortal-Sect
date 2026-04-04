# How to Run the Integration Build

## Step 1: Start Claude Code in auto-accept mode

```bash
cd "C:\Users\crist\Games i am Making\Immortal Sect"
claude --dangerously-skip-permissions
```

## Step 2: Paste this prompt

---

Read the file `INTEGRATION_PROMPT.md` in the project root. This contains the complete integration specification for wiring our idle game together.

**Use RuFlo multi-agent swarm orchestration to parallelize the work.**

Initialize the swarm:
```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

Spawn the following specialized agents in ONE message via Task tool, all with `run_in_background: true`:

### Agent 1: "integration-lead" (Coordinator)
- Role: Hierarchical coordinator
- Reads INTEGRATION_PROMPT.md and CLAUDE.md
- Assigns tasks to other agents
- Validates integration points between agents' work
- Runs `npm run build` after all agents complete
- Runs verification checklist

### Agent 2: "sect-mountain-wirer"
- Role: Coder
- TASK 1 from INTEGRATION_PROMPT.md
- Wires SectMountain.tsx to hallStore + elderStore
- Removes all PLACEHOLDER data
- Wires handleBuyHall to use hallStore.buyWithMode()
- Tests: clicking Meditate adds SS, buying halls works, progress bars cycle

### Agent 3: "elder-ascension-wirer"
- Role: Coder
- TASK 2 + TASK 3 from INTEGRATION_PROMPT.md
- Wires ElderPanel.tsx to elderStore + hallStore
- Wires AscensionScreen.tsx to prestigeStore (correct HDP formula)
- Tests: hiring elders automates halls, ascension resets correctly

### Agent 4: "shop-panels-wirer"
- Role: Coder
- TASK 4 + TASK 5 from INTEGRATION_PROMPT.md
- Wires HdpShopPanel.tsx to prestigeStore (fix wrong passive formula)
- Wires AlchemyPanel.tsx hall3Level to real hallStore
- Imports canonical data from @data/ configs instead of hardcoded arrays

### Agent 5: "hallcard-revenue-wirer"
- Role: Coder
- TASK 6 + TASK 8 from INTEGRATION_PROMPT.md
- Fixes HallCard.tsx cycle progress bar (0-1 fractional, not seconds)
- Wires revenue tracking to prestigeStore.addRevenue() in hallStore.tickCycles()
- Adds click-to-start for non-automated halls

### Agent 6: "save-settings-wirer"
- Role: Coder
- TASK 7 + TASK 10 from INTEGRATION_PROMPT.md
- Adds save-on-purchase triggers (debounced)
- Wires SettingsPanel to SaveSystem (export/import/delete/manual save)
- Creates a shared `buildSaveState` utility if needed

### Agent 7: "remaining-panels-wirer"
- Role: Coder
- TASK 9 from INTEGRATION_PROMPT.md
- Wires MandatePanel, ChallengePanel, DisciplePanel, DungeonPanel, LegacyShrinePanel
- Imports canonical data configs, connects to gameStore for currencies

### Agent 8: "qa-tester"
- Role: Tester
- Waits for other agents to complete
- Runs `npm run build` and fixes any TypeScript errors
- Runs `npm test` if tests exist
- Creates integration test file: `tests/integration/gameLoop.test.ts`
- Verifies the verification checklist from INTEGRATION_PROMPT.md
- Reports final build status

**RULES:**
- Read every file before editing it
- Use stores as single source of truth — NO local useState for game state
- Import data from `src/data/*` configs — never hardcode game values in components
- All currencies use `break_infinity.js` Decimal type
- Keep files under 500 lines
- Run `npm run build` after making changes to verify TypeScript compiles
- After ALL agents return, run final `npm run build` and report status

---

## Step 3: Wait

The swarm will handle everything. Check back in ~20-30 minutes.

## Step 4: Verify

Once complete, run:
```bash
npm run build
npm run dev
```

Open http://localhost:5173 and verify:
1. Game loads without console errors
2. Meditate button adds SS
3. Buying halls works, progress bars cycle
4. Elders tab unlocks at hall Lv 5
5. Save persists across refresh
