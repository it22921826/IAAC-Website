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

4. Edit `.env` and set your MongoDB connection string:

   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
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
