# Somesha

A small learning-platform prototype (frontend + backend) built during PLP Academy. It includes a Vite + React frontend and an Express + MongoDB backend for managing users (parents / tutors / children / admin), lessons, progress tracking, messages and basic admin flows.

---

## Tech Stack
- Frontend: React (Vite), Tailwind CSS (UI), Axios for API
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JSON Web Tokens (JWT)
- Dev tooling: nodemon (backend), Vite dev server (frontend)

---

## Repository Layout
- `Backend/` — Express API server
  - `controllers/` — route handlers
  - `models/` — Mongoose models
  - `routes/` — Express routers
  - `middleware/` — auth and helper middleware
  - `config/db.js` — MongoDB connection helper
  - `server.js` — main server entry

- `somesha-frontend/` — React + Vite application
  - `src/services/api.js` — Axios API wrapper used across the frontend
  - `src/pages/` and `src/components/` — app UI

---

## Prerequisites
- Node.js (>= 16 recommended)
- npm
- MongoDB running locally or accessible via cloud (Atlas)

---

## Environment Variables
Create `.env` files or set environment variables for each service as shown below.

Backend (`Backend/.env`):
- `MONGO_URI` (or `MONGODB_URI` / `DATABASE_URL`) — MongoDB connection string. Defaults to `mongodb://127.0.0.1:27017/somesha-dev` when unset.
- `JWT_SECRET` — secret for signing JWTs (required for production). A `dev-secret` fallback is used in development.
- `PORT` — optional (defaults to `5000`)
- `NODE_ENV` — set to `development` for request logging.

Frontend (`somesha-frontend/.env` with Vite):
- `VITE_API_URL` — optional base API URL (e.g. `http://localhost:5000/api`). If not set, frontend falls back to `http://localhost:5000/api`.

---

## Quick Start (development)
Open two terminals (one for backend, one for frontend).

Backend (PowerShell):
```powershell
cd 'c:\Users\User\OneDrive\Documents\PLP Academy\Somesha--fp\Backend'
npm install
$env:NODE_ENV='development'; npm start
```

Frontend (PowerShell):
```powershell
cd 'c:\Users\User\OneDrive\Documents\PLP Academy\Somesha--fp\somesha-frontend'
npm install
npm run dev
```

- The frontend dev server (Vite) will show a local URL (usually `http://localhost:5173`).
- The backend server listens on `http://localhost:5000` by default.

---

## API (summary)
All API routes are prefixed with `/api` by default as mounted in `server.js`.

- Users: `/api/users`
  - `POST /register` — register a user (payload depends on `role`)
    - Required: `name`, `email`, `password`, `role`
    - If `role === 'tutor'` backend expects `nationalID` (and optional `tscNumber`).
    - If `role === 'child'` backend expects `grade`.
  - `POST /login` — login with `email` and `password`
  - `GET /profile` — requires JWT auth
  - `PUT /profile` — update profile (requires JWT auth)

- Lessons: `/api/lessons` (create, update, list by grade/tutor)
- Progress: `/api/progress` (create, update, list)
- Messages: `/api/messages` (send/receive messages)
- Admin: `/api/admin` (verify tutors, list users)

Refer to `Backend/routes/` and `Backend/controllers/` for full route details.

---

## Common development notes & gotchas
- Frontend must send JSON bodies with `Content-Type: application/json`. Axios defaults are configured in `src/services/api.js`.
- The backend uses `express.json()` to parse request bodies.
- Username is optional (the backend schema uses a sparse unique index). If you want auto-generated usernames, consider adding slug logic on register.
- Registering a tutor requires `nationalID`. The frontend form uses the `nationalID` field when `role === 'tutor'`.
- Duplicate fields (email or username) return a `400` duplicate-key response with the field name.
- JWT secrets should be set for production; a `dev-secret` is used when `JWT_SECRET` is not provided.

---

## Debugging tips
- Check browser DevTools Network tab for the request payload and response body when requests fail.
- Watch backend console logs for helpful debug messages (server prints request content-type and body for auth endpoints during development).
- Ensure MongoDB is reachable and the `MONGO_URI` is correct.

---

## Contributing
- Create feature branches from `main`.
- Open PRs with a clear summary and tests if applicable.
- Run the project locally (see Quick Start) and include any required env changes in the PR description.

---

## License & Contact
This repository was created as part of PLP Academy exercises and is intended for learning and prototyping.

If you want improvements (examples, API docs, Postman collection, or CI setup), open an issue or ask in the code review.

---


