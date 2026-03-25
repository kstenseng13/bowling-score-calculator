# Bowling Score Calculator - Architecture

## Project Structure

```
app/
├── page.js                      # Main page – state, context provider, reset
├── layout.js                    # Root layout with background styling
├── globals.css                  # Global styles and Tailwind config
├── _utils/
│   └── displayUtils.js          # Display formatting, input styling, roll visibility
├── components/
│   ├── ScoreCard.js             # Table wrapper (header, inputs, scores rows)
│   ├── InputColumn.js           # Frame input cell with RollInputElement(s)
│   └── ScoreColumn.js           # Frame score display cell
├── context/
│   └── ScoringContext.js        # React Context for shared scoring state
├── hooks/
│   ├── useScoring.js            # Scoring calculation logic
│   └── useScoringContext.js     # Context consumer hook with error handling
└── lib/
    └── constants.js             # Utility for cell key creation
```

## Data Flow

```
page.js (state: rolls, activeCell)
  │
  ├── useScoring(rolls) → calculateScore, calculateTotal
  │
  └── ScoringContext.Provider (rolls, activeCell, handlers, validation, scoring)
        │
        └── ScoreCard
              ├── InputColumn (×10)
              │     └── RollInputElement (×2-3 per frame, consumes context)
              └── ScoreColumn (×10, consumes context)
```

All shared state flows through `ScoringContext`. Components consume only what they need via `useScoringContext()`. No prop drilling for state or handlers — only `frameIndex` is passed as a prop to identify which frame a component renders.

---

## Component Details

### `page.js` (Home)
**Purpose**: State owner and context provider

**State**:
- `rolls` – Array of 10 frames, each containing 2-3 roll values (null = empty)
- `activeCell` – String key identifying the focused input, or null

**Context Provides**: `rolls`, `activeCell`, `onRollChange`, `onRollClick`, `isRollInvalid`, `calculateScore`, `total`

**Performance**: Handlers wrapped in `useCallback`, context value wrapped in `useMemo`

---

### `ScoreCard.js`
**Purpose**: Table layout with three rows (header, inputs, scores)

**Context Used**: `total`

**Renders**:
- Header row: Frame numbers 1-10 + Total label
- Input row: 10 `InputColumn` components + total display
- Score row: 10 `ScoreColumn` components

---

### `InputColumn.js`
**Purpose**: Single frame's input cell containing 1-3 `RollInputElement` components

**Props**: `frameIndex`
**Context Used**: `rolls` (for visibility logic only)

**Contains**:
- `RollInputElement` – Internal component that consumes context directly for rolls, activeCell, handlers, and validation. Filters input to only allow `0-9`, `X`, `/`.

**Visibility Logic** (from `displayUtils`):
- Second roll hidden for strikes in frames 1-9
- Third roll shown only in frame 10 after strike or spare

---

### `ScoreColumn.js`
**Purpose**: Single frame's calculated score display

**Props**: `frameIndex`
**Context Used**: `rolls`, `calculateScore`

**Display Logic** (from `displayUtils`):
- Shows calculated score when available
- Shows X/slash/dash as preview when score can't be calculated yet

---

## Utilities

### `_utils/displayUtils.js`
All display and presentation logic, centralized to avoid duplication:

| Function | Purpose |
|---|---|
| `getRollDisplay()` | Converts roll value to display string (X, /, or number) |
| `getScoreDisplay()` | Score column display with preliminary indicators |
| `getInputClassName()` | Input styling based on validation/focus state |
| `shouldShowSecondRoll()` | Whether to render second roll input |
| `shouldShowThirdRoll()` | Whether to render third roll input (10th frame) |

**Private Helpers**: `isStrike(roll)`, `isSpare(roll1, roll2)`

### `lib/constants.js`
- `createCellKey(frameIndex, rollIndex)` – Creates consistent cell identifier strings

### `context/ScoringContext.js`
- React Context initialized with `null` default

### `hooks/useScoringContext.js`
- Custom hook wrapping `useContext` with error handling if used outside provider

### `hooks/useScoring.js`
- Pure scoring logic for all frame types
- `calculateStrikeScore()` – 10 + next 2 rolls (handles consecutive strikes)
- `calculateSpareScore()` – 10 + next 1 roll
- `calculateRegularFrameScore()` – Routes to strike/spare/open logic
- `calculateTenthFrameScore()` – Strike or spare = 3 rolls, open = 2 rolls
- Returns `calculateScore(frameIndex)` and `calculateTotal()`

---

## Bowling Scoring Rules

- **Strike (X)**: 10 + next 2 rolls
- **Spare (/)**: 10 + next 1 roll
- **Open Frame**: Sum of 2 rolls
- **Frame 10**: Bonus rolls for strike/spare (up to 3 total)
- **Total**: Running sum of all completed frames
