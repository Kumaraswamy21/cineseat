# CineSeat

Accessible cinema seat booking: showtimes from Prisma, a keyboard-reachable seat map, NextAuth (Google or demo), and ReelBot with a confirmation gate before any cancel.

## Strategy

1. **Auth before data.** Booking and cancel run only after `auth()`.
2. **Ownership in the data layer.** Cancel checks `userEmail` in `lib/bookings.ts`, not in the chat UI.
3. **Destructive tools have no `execute`.** `cancelBooking` is forwarded to the browser; Confirm hits `POST /api/bookings/cancel`.
4. **Read-only tools run on the server.** `searchShowtimes` queries Prisma directly.
5. **Degrade, don’t crash.** Missing `GROQ_API_KEY` streams an offline reply. Missing Google env uses demo sign-in.
6. **Section G audits are intentional.** `FilmPoster` has no `alt`, ReelBot input has no label, booked-seat contrast is low. Do not “fix” those until that section.

## Setup

```bash
cp .env.example .env.local
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo sign-in is `demo@cineseat.test`. Seeded Interstellar bookings include D4 (Mrs. Fernandes) and E5 (demo user, for ReelBot cancel).
