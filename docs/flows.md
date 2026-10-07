# User & System Flows — mstrymessage

These flows describe the intended behavior of the app based on the schemas and models currently in the codebase. Items marked **(planned)** depend on API routes and pages that are not built yet.

## 1. Sign-up Flow **(planned)**

```text
Visitor                    /api/sign-up                MongoDB
   |                           |                           |
   |-- username, email,        |                           |
   |   password -------------->|                           |
   |                           |-- validate with signUpSchema
   |                           |-- check username/email    |
   |                           |   uniqueness ------------>|
   |                           |-- create user (isVerfied=false,
   |                           |   isAcceptingMessage=true)|
   |                           |                           |
   |                           |-- generate 6-digit code   |
   |                           |   + expiry timestamp ---->|
   |                           |-- send email via Resend   |
   |<-- "check your email" ----|                           |
```

Validation rules (from `src/schemas/signUpSchema.ts`):

- Username: 2–100 characters, only `a–z A–Z 0–9 _`
- Email: valid email address
- Password: at least 8 characters

## 2. Email Verification Flow **(planned)**

```text
User                      /api/verify-code              MongoDB / Resend
   |                           |                               |
   |-- 6-digit code ---------->|                               |
   |                           |-- find user by username/email |
   |                           |<------------------------------|
   |                           |-- check code matches          |
   |                           |-- check expiry                |
   |                           |-- set isVerfied = true ------>|
   |<-- account verified ------|                               |
```

- Code format: exactly 6 characters (`verifySchema`)
- Expiry checked against `verifiyCodeExpire`
- Failed attempts (wrong/expired code) return validation errors — **(planned)**

## 3. Sign-in Flow **(planned)**

```text
User                      /api/sign-in                   MongoDB
   |                           |                             |
   |-- identifier, password -->|                             |
   |                           |-- validate signInSchema     |
   |                           |-- find user by username     |
   |                           |   or email ---------------->|
   |                           |-- verify password           |
   |                           |-- reject if not isVerfied   |
   |<-- session / JWT ---------|                             |
```

- `identifier` is a single field that accepts either username or email (from `signInSchema`)
- Unverified accounts are rejected before a session is issued — **(planned)**

## 4. Sending an Anonymous Message **(planned)**

```text
Anonymous visitor      /api/send-message                 MongoDB
   |                           |                             |
   |-- target username,        |                             |
   |   message content ------->|                             |
   |                           |-- validate messageSchema    |
   |                           |   (10–300 chars)            |
   |                           |-- find target user -------->|
   |                           |-- reject if                 |
   |                           |   !isAcceptingMessage       |
   |                           |-- push into messages[] ---->|
   |<-- message sent -----------|                             |
```

- Message content: 10–300 characters (`messageSchema`)
- The sender is never identified — messages are stored only on the target user's `messages` array with `createdAt` set automatically.

## 5. Toggling Accept Messages **(planned)**

```text
Authenticated user   /api/accept-messages                MongoDB
   |                           |                             |
   |-- acceptMessages: true/   |                             |
   |   false ----------------->|                             |
   |                           |-- validate AcceptMessageSchema
   |                           |-- update user.isAcceptingMessage
   |<-- updated state ---------|                             |
```

- Default for new users: `isAcceptingMessage = true`
- When `false`, flow #4 rejects incoming messages.

## 6. Viewing Messages **(planned)**

Authenticated user requests their dashboard → server reads `user.messages` (sorted by `createdAt` desc) → renders the list. Messages contain only `content` and `createdAt`; no sender data exists by design.

## 7. Database Connection Flow (implemented)

```text
API route / page handler
   |
   v
dbConnect()  (src/lib/dbConnect.ts)
   |-- connection already cached? -- yes --> return immediately
   |-- no --> mongoose.connect(MONGODB_URI)
   |            |-- success --> store readyState in cache, log
   |            |-- failure --> log + process.exit(1)
```

- The module-level `connection` object survives dev hot-reload, so the DB is only connected once per process.

## 8. Verification Email Sending (stub)

```text
sign-up handler
   |
   v
sendVerificationEmail()  (src/helpers/sendVerificationEmail.ts)
   |-- currently: imports resend client only — no logic
   |-- planned: build email with <VerificationEmail/> template
   |            (emails/VerficationEmail.tsx — also empty)
   `-- planned: resend.emails.send({ to, subject, html })
```

## Implementation Order (suggested)

1. Fill in `emails/VerficationEmail.tsx` and `sendVerificationEmail.ts`
2. `/api/sign-up` + `/api/verify-code`
3. Auth (sign-in session) — fix the model typos first
4. `/api/send-message` + `/api/accept-messages`
5. Dashboard page for viewing messages
6. Landing page replacing the default `src/app/page.tsx`
