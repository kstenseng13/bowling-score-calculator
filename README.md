# Bowling Score Calculator 🎳

A bowling score calculator built with Next.js and React that scores a full game of bowling based on user input.

## Features

- Score all 10 frames including 10th frame bonus rolls
- Strike (X), spare (/), and open frame detection
- Real-time score calculation with running totalr
- Input validation with visual feedback (red highlight for invalid rolls)
- Accepts keyboard input: digits (0–9), X for strikes, / for spares
- Responsive horizontal scorecard layout

## Scoring Rules

| Type | Rule |
|------|------|
| **Strike** | 10 + next 2 rolls |
| **Spare** | 10 + next 1 roll |
| **Open Frame** | Sum of 2 rolls |
| **10th Frame** | Bonus rolls for strike or spare (up to 3 total) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the calculator.

## Tech Stack

- [Next.js](https://nextjs.org) (React framework)
- [React](https://react.dev) (Context API, hooks)
- [Tailwind CSS](https://tailwindcss.com) (styling)

## Project Structure

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed component architecture and data flow.
