# Project Overview — mstrymessage

**Mystery Message** is an anonymous messaging web app. Users create an account, verify their email, share their unique profile link, and receive anonymous messages from visitors.

## Goals

- Let anyone sign up and get a personal link for receiving messages.
- Keep senders anonymous while protecting recipients from spam (accept-messages toggle, verified emails, message length limits).
- Deliver a 6-digit email verification code during sign-up.

## Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 16 (App Router, `src/app`)            |
| UI         | React 19, Tailwind CSS 4                      |
| Language   | TypeScript 5                                  |
| Database   | MongoDB via Mongoose 9                        |
| Validation | Zod 4 (all input schemas)                     |
| Email      | Resend (`src/lib/resend.ts`)                  |
| Fonts      | `next/font` (Geist)                           |
| Linting    | ESLint 9 (`eslint-config-next`)               |

## Current Status

**Stage: foundation / scaffolding.** The data layer and validation layer exist; the API and UI layers are not built yet.

### Implemented

- **Mongoose models** — `src/model/User.ts`
  - `User` document: `username`, `email`, `password`, `verifyCode`, `verifiyCodeExpire`, `isVerfied` (default `false`), `isAcceptingMessage` (default `true`), and an embedded `messages` array.
  - `Message` sub-document: `content` (required), `createdAt` (defaults to now).
- **Database connection** — `src/lib/dbConnect.ts`
  - Cached connection helper: reuses the existing connection in dev hot-reload, connects using `MONGODB_URI`, and exits the process on failure.
- **Email client** — `src/lib/resend.ts` initializes Resend with `RESEND_API_KEY`.
- **Zod schemas** — `src/schemas/`
  | Schema | Purpose |
  | ------ | ------- |
  | `signUpSchema` | Username 2–100 chars (letters/numbers/underscores), valid email, password ≥ 8 chars |
  | `signInSchema` | `identifier` (username or email) + `password` |
  | `verifySchema` | 6-character verification code |
  | `messageSchema` | Message content 10–300 characters |
  | `acceptMessageSchema` | Boolean toggle for accepting messages |

### Not implemented yet

- API routes (`src/app/**/route.ts`) — none exist.
- Pages beyond the default homepage (`src/app/page.tsx` is still the create-next-app template).
- `emails/VerficationEmail.tsx` — created but currently empty.
- `src/helpers/sendVerificationEmail.ts` — imports the Resend client but has no send logic yet.

## Environment Variables

Defined in `.env` (see `.env.example` for the list of names — never commit real values):

| Variable | Purpose |
| -------- | ------- |
| `MONGODB_URI` | MongoDB connection string used by `dbConnect` |
| `RESEND_API_KEY` | API key for Resend transactional email |

## Known Issues / Notes

Worth fixing as the project grows:

- Typos in `src/model/User.ts`: `verifiyCodeExpire` → `verifyCodeExpire`, `isVerfied` → `isVerified`, plus `requied` → `required` in two places. These become DB field names, so rename before the schema is used in production data.
- `src/schemas/signInSchema.ts` has an unused `import { PassThrough } from "stream"`.
- `src/helpers/sendVerificationEmail.ts` is an empty stub — sign-up emails will not send until it is implemented.
- `dbConnect` calls `process.exit(1)` on failure; in a serverless deployment it is usually better to rethrow so the caller can return a 500.

See [flows.md](./flows.md) for the end-to-end user flows.
