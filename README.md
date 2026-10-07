# mstrymessage

**Mystery Message** — an anonymous messaging app. Create an account, verify your email, share your link, and let people send you anonymous messages.

> 📖 Full documentation lives in the [`docs/`](docs/) folder:
> - [`docs/overview.md`](docs/overview.md) — what the project is, tech stack, current status
> - [`docs/flows.md`](docs/flows.md) — user and system flows with diagrams

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS 4**
- **MongoDB** via **Mongoose 9**
- **Zod 4** for input validation
- **Resend** for transactional email (verification codes)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Purpose |
| -------- | ------- |
| `MONGODB_URI` | MongoDB connection string |
| `RESEND_API_KEY` | Resend API key for sending verification emails |

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```text
mstrymessage/
├── docs/                      # Project documentation
│   ├── overview.md            # Project overview & current status
│   └── flows.md               # User & system flow diagrams
├── emails/
│   └── VerficationEmail.tsx   # Verification email template (WIP)
├── src/
│   ├── app/                   # Next.js App Router (pages, routes)
│   ├── helpers/
│   │   └── sendVerificationEmail.ts  # Email send helper (stub)
│   ├── lib/
│   │   ├── dbConnect.ts       # Cached MongoDB connection
│   │   └── resend.ts          # Resend client
│   ├── model/
│   │   └── User.ts            # Mongoose User + Message schemas
│   └── schemas/               # Zod validation schemas
│       ├── acceptMessageSchema.ts
│       ├── messageSchema.ts
│       ├── signInSchema.ts
│       ├── signUpSchema.ts
│       └── verifySchema.ts
├── .env                       # Secrets (git-ignored)
└── package.json
```

## Project Status

The **data and validation layers are done** (models, DB connection, Zod schemas); **API routes and pages are still to be built**. See [docs/overview.md](docs/overview.md#current-status) for a detailed list of what's implemented vs. planned.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Resend Documentation](https://resend.com/docs)
