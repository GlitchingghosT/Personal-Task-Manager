# TaskDuty - Personal Task Manager

A personal task manager built for the Techstudio Internship Program. The backend provides task CRUD, authentication, and per-user task authorization. Stage 2 is tested through Postman or another API client; the React client has not yet been connected to the authentication flow.

## Tech stack

- Client: React, Vite, TypeScript, Tailwind CSS
- Server: Node.js, Express, TypeScript, MongoDB, Mongoose
- Authentication: bcryptjs password hashing and JWT bearer tokens

## Backend setup

Prerequisites: Node.js 18+ and MongoDB (local or hosted).

1. Open a terminal in `server/` and install dependencies:

   ```bash
   npm install
   ```

2. Create `server/.env`:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/task-manager
   JWT_SECRET=replace-this-with-a-long-random-secret
   PORT=5050
   ```

   `MONGODB_URI` is optional when using the local default shown above. `JWT_SECRET` is required; use a long, random value and do not commit `.env`.

3. Start MongoDB, then start the API:

   ```bash
   npm run dev
   ```

   The API listens at `http://localhost:5050`. Verify it with `GET /api/health`.

4. Check the TypeScript build with `npm run build`.

## API walkthrough (Postman)

Send JSON bodies with `Content-Type: application/json`.

### Register

`POST /api/auth/register`

```json
{
  "email": "alex@example.com",
  "password": "strongpass123"
}
```

Registration returns `201` and a user ID, email, and JWT. Passwords must be at least 8 characters and no more than 72 UTF-8 bytes. Email addresses are normalized to lowercase and must be unique.

### Log in

`POST /api/auth/login`

```json
{
  "email": "alex@example.com",
  "password": "strongpass123"
}
```

Login returns a JWT with a one-hour expiry. For every task request, set:

```http
Authorization: Bearer <token>
```

### Task endpoints

All task endpoints require a valid bearer token. The API determines the owner from the token, not from request body fields or a user-supplied ID.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/tasks` | List the signed-in user's tasks |
| `POST` | `/api/tasks` | Create a task for the signed-in user |
| `GET` | `/api/tasks/:id` | Get one of the signed-in user's tasks |
| `PUT` | `/api/tasks/:id` | Update one of the signed-in user's tasks |
| `DELETE` | `/api/tasks/:id` | Delete one of the signed-in user's tasks |

Example create/update body:

```json
{
  "title": "Prepare weekly report",
  "description": "Summarize this week's work",
  "dueDate": "2026-10-15T12:00:00.000Z",
  "category": "Important",
  "completed": false
}
```

Task records belonging to another account are not accessible: single-task reads, updates, and deletes return `404` when the task is not owned by the authenticated user. Requests without a valid token return `401`.

## Frontend

The React client remains available with `cd client && npm install && npm run dev`, but it still uses the previous unauthenticated API flow. For the Stage 2 deliverable, test the backend with Postman; frontend authentication integration is not included.

## Known issues and notes

- MongoDB must be running and reachable for the backend to start.
- Existing tasks created before authentication used client-generated IDs and are not migrated to accounts.
- JWT tokens expire after one hour; log in again to get a fresh token.
