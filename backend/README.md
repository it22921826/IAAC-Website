# IAAC Backend

This is the Node.js/Express backend for the IAAC project. It connects to MongoDB using Mongoose.

## Setup

1. Open a terminal in the `backend` folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` folder based on `.env.example`:

   ```bash
   copy .env.example .env   # On Windows PowerShell/CMD
   ```

4. Edit `.env` and set your environment variables:

   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=change_me_to_a_long_random_string
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

## Running the server

- Development (with auto-restart using nodemon):

  ```bash
  npm run dev
  ```

- Production / simple start:

  ```bash
  npm start
  ```

The server will:

- Listen on `http://localhost:5000` (or the `PORT` you set).
- Connect to MongoDB using `MONGO_URI`.
- Expose a health check endpoint at `GET /api/health`.

## Admin API

Base path: `/api/admin`

- `POST /api/admin/login` — Body: `{ email, password }`. Returns `{ user, token }`.
- `GET /api/admin/me` — Requires `Authorization: Bearer <token>`.
- `GET /api/admin/stats` — Requires auth. Returns dashboard stats.
- `GET /api/admin/applications` — Requires auth. Returns recent applications list.

Include `Authorization: Bearer <token>` in requests. The frontend stores the token in `localStorage` as `iaac_token` and sends it automatically.
