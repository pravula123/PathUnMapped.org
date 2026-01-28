# unmapped.org Backend

This is a simple Node.js + Express backend for storing mentor registration details in a local SQLite database.

## Features
- REST API endpoint to register mentors (`POST /api/mentors`)
- Stores mentor details in a SQLite database (`mentors.db`)
- CORS enabled for frontend integration

## Setup

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the backend server:
   ```powershell
   npm start
   ```
3. The server will run at http://localhost:3001

## API
- `POST /api/mentors` — Register a new mentor
  - Body: `{ name, email, expertise, bio, username, password }`
  - Response: `{ success, id, username, password }`

---

**Note:** For demo purposes, passwords are stored in plain text. In production, always hash passwords!
