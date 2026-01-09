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
   LOG_REQUESTS=false
   MONGO_DEBUG=false
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
 - Optionally log requests via morgan when `LOG_REQUESTS=true`.
 - Optionally log MongoDB queries when `MONGO_DEBUG=true`.

## Admin API

Base path: `/api/admin`

- `POST /api/admin/login` — Body: `{ email, password }`. Returns `{ user, token }`.
- `GET /api/admin/me` — Requires `Authorization: Bearer <token>`.
- `GET /api/admin/stats` — Requires auth. Returns dashboard stats.
- `GET /api/admin/applications` — Requires auth. Returns recent applications list.
- `POST /api/admin/courses` — Requires auth. Body: `{ title, duration }`. Creates a course.
- `POST /api/admin/events` — Requires auth. Body: `{ title, description?, imageUrl?, eventDate? }`. Creates an event.

Include `Authorization: Bearer <token>` in requests. The frontend stores the token in `localStorage` as `iaac_token` and sends it automatically.

## Public API

- `POST /api/applications` — Body: application form fields. Saves an application.
- `GET /api/courses` — Returns list of published courses.
- `GET /api/events` — Returns list of published events.

## Email Notifications

- New applications will trigger notification emails to up to three recipients.
- Configure SMTP and recipients via environment variables:

   ```env
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=notifications@example.com
   SMTP_PASS=replace_with_app_password_or_smtp_password
   FROM_EMAIL=notifications@example.com
   NOTIFY_EMAILS=admin@example.com,registrar@example.com,counselor@example.com
   EMAIL_DEBUG=true
   EMAIL_TEST_MODE=true
   # SMTP_ALLOW_SELF_SIGNED=false
   ```

- Notes:
   - Use an SMTP provider (e.g., Gmail with App Password, Outlook, SendGrid, etc.). For development, set `EMAIL_TEST_MODE=true` to use Ethereal test mail and get preview URLs in API responses.
   - `NOTIFY_EMAILS` is a comma-separated list; only the first three are used.
   - If SMTP is not configured, the application will still be saved but emails will not be sent.
   - Set `EMAIL_DEBUG=true` to log SMTP verification and per-recipient errors to the server console for troubleshooting.
