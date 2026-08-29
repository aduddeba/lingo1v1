# Lingo1v1

Real-time competitive linguistics duels built with Next.js, React, Zustand, and Socket.IO. Players can practice solo, queue for live 1v1 ranked matches, build an Elo rating, review their competitive dashboard, and compare global leaderboard standings.

## Current Features

- Ranked 1v1 matchmaking over Socket.IO
- Authenticated accounts with persistent user stats
- Guest multiplayer support for casual entry into the lobby
- Server-authoritative answer evaluation, scoring, match completion, and Elo updates
- Adaptive ranked question difficulty based on the players' authoritative Elo ratings
- Specificity-based answer scoring, where broader correct answers earn fewer points than more precise answers
- Hybrid match ending: first to the target score, with a hard maximum round cap
- Persistent ranked match results and rating history
- Authenticated dashboard with current Elo, wins, losses, games played, win rate, rank, percentile, recent results, and Elo graph
- Public Elo leaderboard with deterministic ranking and pagination
- Solo practice modes for warming up outside ranked play

## Game Modes

| Mode | Description |
|---|---|
| **Forgery** | Spot the genuine language sample from a generated-looking fake. |
| **Historical Evolution Battles** | Trace how words changed across languages and centuries. |
| **Origin Blitz** | Identify scripts, languages, and surname origins at speed. |
| **Country Finder** | Given a city, type the country it is in before time runs out. |

Practice modes still let players choose difficulty and question count. Ranked multiplayer does not trust a client-selected difficulty; the server selects question difficulty from Elo-weighted distributions.

## Ranked Multiplayer

Ranked matches start from the lobby once two players are paired and ready. The server creates the match, selects the question difficulty, serves each round, evaluates answers, awards points, updates scores, determines match completion, and finalizes Elo.

The standard match configuration is defined in `src/lib/constants/game.ts`:

| Setting | Value |
|---|---:|
| Target score | 3,000 |
| Maximum rounds | 12 |
| Players per match | 2 |

A match ends when either player reaches or exceeds the target score, or when the maximum number of rounds is completed. If the round cap is reached first, the higher score wins. If scores are tied at the round cap, the match is a draw.

Because both players answer the same round independently, target-score completion is checked after the current round is finalized. That prevents network timing from deciding the winner when both players can cross the target during the same round.

## Scoring

Answer scoring is server-authoritative. Clients submit answers, not scores. The server normalizes the answer, evaluates it against accepted answers, applies specificity metadata, and calculates the awarded points.

Specificity levels currently support:

| Result | Points behavior |
|---|---|
| Incorrect | No points |
| Broad correct | Lower score |
| Specific correct | Higher score |
| Preferred / most specific | Highest score |

These in-game points decide the match winner. Elo is updated only once, based on the final match outcome.

## Competitive System

Authenticated ranked players have persistent competitive stats:

- Elo rating
- Wins
- Losses
- Games played
- Rating history
- Completed match records
- Global rank
- Percentile and Top % standing

Global rank and leaderboard ordering use the same deterministic rules:

1. Elo descending
2. Wins descending
3. Games played ascending
4. Username alphabetically
5. User id as a final stable tie-breaker

Percentile is calculated as the percentage of ranked users whose Elo is below or equal to the user's Elo. Top % is based on rank divided by the total ranked-user count.

## Pages And APIs

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/login` | Login and signup |
| `/lobby` | Multiplayer queue and ready-up flow |
| `/match/[matchId]` | Live match screen |
| `/practice` | Practice mode hub |
| `/practice/forgery` | Forgery practice |
| `/practice/historical-evolution` | Historical evolution practice |
| `/practice/city-country` | City Finder practice |
| `/practice/script-blitz` | Script Blitz practice |
| `/dashboard` | Authenticated competitive dashboard |
| `/leaderboard` | Public Elo leaderboard |
| `/api/auth/*` | Auth session, login, logout, signup, socket token |
| `/api/users/me/dashboard` | Authenticated dashboard data |
| `/api/users/me/rating-history` | Authenticated rating history |
| `/api/leaderboard` | Public paginated leaderboard data |

## Tech Stack

- **[Next.js 16](https://nextjs.org/)** with the App Router
- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Zustand](https://github.com/pmndrs/zustand)** for client state
- **[Socket.IO](https://socket.io/)** for live matchmaking and gameplay
- **[Tailwind CSS](https://tailwindcss.com/)** for styling
- **[Framer Motion](https://www.framer.com/motion/)** for UI animation
- JSON-backed local persistence for users, matches, and rating history

- **NOTE**: Use **npm run dev:all** to start the multiplayer server!

## Project Structure

```text
src/
├── app/
│   ├── (auth)/login/       # Login and signup page
│   ├── (game)/             # Lobby, match, and practice routes
│   ├── api/                # Auth, user, dashboard, history, leaderboard APIs
│   ├── dashboard/          # Authenticated competitive dashboard
│   └── leaderboard/        # Public Elo leaderboard
├── components/
│   ├── auth/               # Auth form components
│   ├── dashboard/          # Elo graph UI
│   ├── game/               # Live match UI
│   ├── layout/             # Shared app shell
│   ├── lobby/              # Lobby and matchmaking UI
│   ├── practice/           # Solo practice components
│   └── ui/                 # Reusable UI primitives
├── hooks/                  # Socket, lobby, game, and practice hooks
├── lib/
│   ├── auth/               # Users, sessions, cookies, passwords
│   ├── constants/          # Shared game configuration
│   ├── practice/           # Practice engines and question banks
│   ├── socket/             # Socket.IO client setup and hooks
│   └── utils/              # Formatting and ids
├── middleware.ts           # API route middleware scaffold
├── providers/              # App-level providers
├── store/                  # Zustand stores
└── types/                  # Shared TypeScript types

server/
├── src/
│   ├── answerEvaluation.ts # Accepted-answer and specificity scoring
│   ├── elo.ts              # Elo calculation utility
│   ├── index.ts            # Socket.IO server entrypoint
│   ├── match.ts            # Live match session lifecycle
│   ├── matchCompletion.ts  # Hybrid target-score / round-limit rules
│   ├── matchmaking.ts      # Queue, lobby, and match startup
│   ├── matchResults.ts     # Ranked match persistence and Elo finalization
│   ├── questions.ts        # Server-side question selection
│   ├── rankedDifficulty.ts # Elo-weighted ranked difficulty selection
│   └── state.ts            # In-memory socket/lobby/match state
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Mapbox public access token for map-based practice questions

### Installation

```bash
git clone https://github.com/aduddeba/lingo1v1.git
cd lingo1v1
npm install
```

Install server dependencies if they are not already present:

```bash
npm --prefix server install
```

### Environment Variables

Copy the example files and fill in local values:

```bash
cp .env.local.example .env.local
cp server/.env.example server/.env
```

Root app variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL, usually `http://localhost:3001` |
| `NEXT_PUBLIC_APP_URL` | Next.js app URL, usually `http://localhost:3000` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public token |
| `AUTH_SECRET` | Secret for signing auth session cookies |
| `LINGO_DATA_DIR` | Optional directory for JSON user/match persistence |

Socket server variables:

| Variable | Description |
|---|---|
| `PORT` | Socket.IO server port, default `3001` |
| `HOST` | Socket.IO bind host, default `0.0.0.0` |
| `CLIENT_ORIGIN` | Allowed Next.js origin for browser WebSocket connections |

### Run Locally

Start both the Next.js app and the Socket.IO server:

```bash
npm run dev:all
```

Open [http://localhost:3000](http://localhost:3000).

You can also run them separately:

```bash
npm run dev
npm run dev:server
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run dev:server` | Start the Socket.IO server |
| `npm run dev:all` | Start Next.js and Socket.IO together |
| `npm run build` | Build the Next.js app for production |
| `npm run start` | Start the production Next.js server |
| `npm run lint` | Lint the codebase |
| `npm run lint:fix` | Lint and auto-fix issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing changes |
| `npm run type-check` | Type-check the Next.js app and shared code |
| `npm run test` | Run the Node test suite |
| `npm --prefix server run type-check` | Type-check the Socket.IO server package |

## Testing And Verification

Useful checks before opening a PR:

```bash
npm run lint
npm run type-check
npm --prefix server run type-check
npm run test
npm run build
```

The test suite covers authentication, ranked difficulty selection, answer specificity scoring, hybrid match completion, Elo finalization, rating history, dashboard data, leaderboard ordering, and Script Blitz question-bank additions.

## Persistence

Local development uses JSON persistence for users, completed matches, and rating history. By default data is written under `./data`, or under the directory configured by `LINGO_DATA_DIR`.

Completed ranked matches store enough information to audit Elo changes, including player ids, final scores, rating before/after values, completion status, ranked flag, rounds played, completion reason, and timestamps.

## Authentication

Authentication is implemented with signed sessions and persistent users. Protected user APIs validate the current session server-side. Multiplayer sockets can authenticate with a short-lived socket auth token or an existing signed session cookie.

Guests can still enter multiplayer flows, but guest matches do not produce persistent Elo updates.

## License

No license has been specified for this repository yet.
