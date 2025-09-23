# Backend (Bun + Express)

## Setup

Install dependencies:

```bash
bun install
```

Create `.env` in this directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/n10"
JWT_SECRET="your-jwt-secret"
```

Run Prisma migrations and generate client:

```bash
bun prisma migrate dev
bun prisma generate
```

Start in development:

```bash
bun --hot src/index.ts
```

Server runs on `http://localhost:3000`.

## API Base Path

All routes are prefixed with `/api/v1`.

- Auth: `/api/v1/auth/*`
- Workflows: `/api/v1/workflows/*`
- Credentials: `/api/v1/credentials/*`
- Execute: `/api/v1/execute` and `/api/v1/execute/stream`
- Webhook trigger: `POST /api/v1/webhook/:workflowId`
- Analytics: `/api/v1/analytics`
- Available triggers: `/api/v1/availableTrigger`

## Notes

- CORS origin is `http://localhost:5173` by default.
- Solana support: credential schema accepts `privateKey` (base58) for Solana actions.

This project was created using `bun init` in bun v1.2.16. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
