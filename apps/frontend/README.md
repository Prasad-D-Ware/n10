# Frontend (React + TypeScript + Vite)

## Setup

Install dependencies:

```bash
bun install
```

Environment variables (optional, defaults to `http://localhost:3000`):

```env
VITE_BACKEND_URL="http://localhost:3000"
```

Start in development:

```bash
bun run dev
```

Runs at `http://localhost:5173`.

## Features

- Credentials UI supports: Telegram, WhatsApp, OpenAI, Resend, Solana
- Uses `VITE_BACKEND_URL` to call backend APIs under `/api/v1`

## Linting

```bash
bun run lint
```
