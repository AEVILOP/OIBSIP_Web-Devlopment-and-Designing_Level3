# PizzaApp

A full-stack pizza delivery application built with React, Vite, Tailwind CSS, Express, MongoDB, Razorpay test mode, and Gmail SMTP.

## Features

- Email verification, password reset, short-lived access tokens, and httpOnly refresh cookies
- Six seeded menu pizzas and 26 inventory-backed custom ingredients
- Five-stage visual pizza builder with live SVG preview and server-authoritative pricing
- Razorpay test checkout with signature verification and idempotent order confirmation
- Transactional inventory deduction, low-stock email alerts, and hourly stock monitoring
- User order history with an 8-second live status poller
- Admin statistics, legal order status transitions, filtering, and inline inventory editing
- Responsive premium dark UI with Tailwind and Framer Motion

## Requirements

- Node.js 20 or newer
- A free MongoDB Atlas cluster
- A Gmail account with 2-Step Verification and an App Password
- A Razorpay account with test keys

## Local Setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Create the environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Fill in `.env`. Generate each JWT secret with at least 64 random characters. Set `ADMIN_EMAIL` to the email that should receive stock alerts and own the admin account.

4. Start both applications:

   ```powershell
   npm run dev
   ```

The client runs at `http://localhost:5173`; the API runs at `http://localhost:5000`.

Collections are seeded automatically when empty. The first verified account registered with the exact `ADMIN_EMAIL` value receives the `admin` role. Other accounts receive the `user` role.

## Test Payment

Keep Razorpay in **Test Mode** and place the test Key ID and Secret in `.env`. The checkout displays Razorpay's test interface and does not charge real money. Order creation requires a valid Razorpay payment signature.

## Useful Commands

```powershell
npm run dev
npm run build
npm run start
npm run seed
```

## Deployment

### Backend on Render

1. Create a free Web Service from this repository.
2. Use `npm install` as the build command and `node server/index.js` as the start command.
3. Add all server variables from `.env.example`.
4. Set `NODE_ENV=production` and `CLIENT_URL=https://your-client.vercel.app`.
5. Use `/api/health` as the health check.

MongoDB transactions require a replica set; MongoDB Atlas supplies this automatically.

### Frontend on Vercel

1. Import the repository and set the root directory to `client`.
2. Use `npm run build` and output directory `dist`.
3. Set `VITE_API_URL=https://your-api.onrender.com`.
4. Redeploy after changing `VITE_API_URL`.

`client/vercel.json` keeps React Router routes working on direct navigation. Production cookies use `Secure`, `httpOnly`, and `SameSite=None` because Vercel and Render are separate sites; local cookies use `SameSite=Lax`.

## API Summary

- `/api/auth` registration, verification, login, refresh, logout, and password recovery
- `/api/catalog` menu pizzas and ingredients
- `/api/orders` Razorpay creation, confirmation, user history, detail, and admin status update
- `/api/admin` stats, all orders, and inventory management
- `/api/health` deployment health check

## Production Notes

- Configure only one trusted frontend origin in `CLIENT_URL`, or provide a comma-separated allowlist.
- Gmail failures are logged and never crash request handling.
- Refresh tokens and one-time email tokens are stored as SHA-256 hashes.
- The in-memory six-hour alert throttle resets when the Render instance restarts, which is appropriate for this free-tier deployment.
