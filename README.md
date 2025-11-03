# Mahjong Solitaire

A modern Mahjong Solitaire game built with React 19, Vite, and Tailwind CSS.

## Features

- Multiple board layouts that rotate with each level
- Sound effects using Tone.js
- Confetti animations for matches and victories
- Auto-solve feature to ensure solvable boards
- Hint system
- Undo functionality
- Level progression with localStorage persistence
- Responsive design optimized for mobile devices

## Tech Stack

- **React 19** with React Compiler
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Tone.js** for sound effects
- **Canvas Confetti** for celebrations
- **Playwright** for E2E testing

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open your browser at `http://localhost:3000`

### Building for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
pnpm preview
```

## Testing

Run E2E tests with Playwright:

```bash
pnpm test:e2e
```

Run tests with UI:

```bash
pnpm test:e2e:ui
```

## Project Structure

```
mahjong/
├── src/
│   ├── components/      # React components
│   │   ├── App.jsx      # Main app component
│   │   ├── Tile.jsx     # Individual tile component
│   │   ├── GameBoard.jsx
│   │   ├── GameControls.jsx
│   │   ├── GameOverlay.jsx
│   │   └── MotivationalWord.jsx
│   ├── constants/       # Game constants and configurations
│   │   ├── gameConstants.js
│   │   ├── boardLayouts.js
│   │   └── uiConstants.js
│   ├── hooks/          # Custom React hooks
│   │   ├── useGameState.js
│   │   ├── useSoundEffects.js
│   │   └── useConfetti.js
│   ├── utils/          # Utility functions
│   │   ├── gameUtils.js
│   │   └── tileUtils.js
│   ├── styles/         # CSS styles
│   │   └── index.css
│   └── main.jsx        # Entry point
├── e2e/                # Playwright E2E tests
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
├── playwright.config.ts # Playwright configuration
└── package.json
```

## Code Architecture

The codebase follows SOLID principles:

- **Single Responsibility**: Each component and utility function has a single, well-defined purpose
- **Separation of Concerns**: UI components are separated from business logic
- **Reusability**: Components and hooks are designed to be reusable
- **Testability**: Logic is separated from presentation, making it easier to test

### Key Design Decisions

1. **Hooks for State Management**: Game state is managed through custom hooks (`useGameState`)
2. **Utility Functions**: Pure functions handle game logic (matching, board operations)
3. **Component Composition**: Small, focused components compose into larger features
4. **Constants Extraction**: All game constants are centralized for easy modification

## Game Rules

- Match tiles with the same face or tiles from the same special group (flowers/seasons)
- Only tiles that are free on the left or right can be selected
- Complete all pairs to advance to the next level
- Use hints if you get stuck
- Undo moves if you make a mistake

## License

MIT
