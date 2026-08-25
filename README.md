# Lingo1v1

Real-time linguistics duels — challenge an opponent to head-to-head rounds of anagrams, word chains, definition races, and more. Built with Next.js, Zustand, and Socket.IO.

## Game Modes

| Mode | Description |
|---|---|
| **Forgery** | Spot the fake language before your opponent does. |
| **Historical Evolution Battles** | Race through the history of a word across centuries. |
| **Origin Blitz** | Identify scripts, languages, and surname origins at lightning speed. |
| **Country Finder** | Given a city, pick the country it's in before the clock runs out. |

Each mode supports four difficulty tiers (Easy, Medium, Hard, Expert), with tighter time limits and higher score multipliers at harder tiers. Matches are 1v1, up to 10 rounds, with streak bonuses for consecutive correct answers.

You can also play any mode solo in **Practice** to warm up before queuing for a live match.

## Tech Stack

- **[Next.js 15](https://nextjs.org/)** (App Router, TypeScript, typed routes)
- **[React 19](https://react.dev/)**
- **[Zustand](https://github.com/pmndrs/zustand)** for game/lobby/player state
- **[Socket.IO](https://socket.io/)** client for real-time matchmaking and gameplay
- **[Tailwind CSS](https://tailwindcss.com/)** for styling
- **[Framer Motion](https://www.framer.com/motion/)** for animations

- **NOTE**: Use **npm run dev:all** to start the multiplayer server!

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/       # Sign-in flow
│   └── (game)/
│       ├── lobby/          # Matchmaking / find-a-match
│       ├── match/          # Live 1v1 match screens
│       └── practice/       # Solo practice mode
├── components/
│   ├── game/          # Match UI (board, score, player cards, map pane)
│   ├── lobby/         # Lobby panel & player list
│   ├── practice/      # Per-mode practice game components
│   ├── layout/        # Header and shared layout
│   └── ui/            # Reusable UI primitives (Button, Card, Input, etc.)
├── hooks/             # Game/socket/lobby/practice hooks
├── lib/
│   ├── constants/           # Game modes, difficulty config, scoring rules
│   ├── socket/               # Socket.IO client setup
│   ├── practice/questions/   # Question banks for practice modes
│   └── utils/
├── providers/         # App-level context providers
├── store/             # Zustand stores (game, lobby, player, practice, per-mode)
├── types/             # Shared TypeScript types
└── middleware.ts      # Route guard for /lobby and /match/*
```

## Getting Started (Will deploy soon!)

### Prerequisites 

- Node.js 18+
- A running Socket.IO server for matchmaking/live gameplay (separate from the Next.js app)
- A [Mapbox](https://account.mapbox.com/access-tokens/) access token, for map-based question types

### Installation

```bash
git clone https://github.com/aduddeba/lingo1v1.git
cd lingo1v1
npm install
```

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SOCKET_URL` | URL of the Socket.IO server (defaults to `http://localhost:3001`) |
| `NEXT_PUBLIC_APP_URL` | Public base URL of the Next.js app (defaults to `http://localhost:3000`) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Your Mapbox public access token |

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Lint the codebase |
| `npm run lint:fix` | Lint and auto-fix issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing changes |
| `npm run type-check` | Run the TypeScript compiler without emitting output |

## Authentication

Route protection for `/lobby` and `/match/*` is scaffolded in `src/middleware.ts` but currently a pass-through; session/JWT validation is a planned addition.

## Contributing

Issues and pull requests are welcome. Please run `npm run lint` and `npm run type-check` before submitting a PR.

## License

No license has been specified for this repository yet.
