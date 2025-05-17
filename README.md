# 🧠 TaskBoard Pro

**TaskBoard Pro** is a collaborative task management platform designed to simplify project workflows. With seamless Google OAuth integration, users can create projects, manage tasks with Kanban-style boards, and automate repetitive actions using custom triggers and actions.

---

## 🚀 Features

- 🔐 Google OAuth Login
- 🗂️ Project creation & management
- ✅ Task creation, updates, drag-and-drop movement across stages
- ⚙️ Automation triggers (e.g., auto-mark as done, send alert on due date)
- 📋 Real-time UI updates
- 💡 Clean, minimal, responsive design

---

## 📦 Tech Stack

- **Frontend:** React, TailwindCSS, Axios, React Router
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** Firebase Google OAuth
- **Database:** MongoDB with Mongoose ODM

---

## 📄 API Documentation

### Auth Routes

| Method | Route           | Description             |
|--------|------------------|-------------------------|
| GET    | `/auth/login`    | Start Google OAuth login |
| POST   | `/auth/logout`   | Logout current user     |

### Project Routes

| Method | Route                    | Description              |
|--------|--------------------------|--------------------------|
| GET    | `/api/projects`          | Get all projects for user |
| POST   | `/api/projects/create`   | Create new project        |
| PATCH  | `/api/projects/:id`      | Update project details    |
| DELETE | `/api/projects/:id`      | Delete project            |

### Task Routes

| Method | Route                        | Description               |
|--------|------------------------------|---------------------------|
| GET    | `/api/tasks/:projectId`      | Get tasks by project ID   |
| POST   | `/api/tasks/create`          | Create new task           |
| PATCH  | `/api/tasks/:id`             | Update task               |
| DELETE | `/api/tasks/:id`             | Delete task               |

### Automation Routes

| Method | Route                           | Description                  |
|--------|----------------------------------|------------------------------|
| GET    | `/api/automations/:projectId`   | Get automations for project |
| POST   | `/api/automations/create`       | Create new automation        |
| PATCH  | `/api/automations/:id`          | Update automation            |
| DELETE | `/api/automations/:id`          | Delete automation            |

---

## 🗃️ Database Schema

### 🧑‍💼 Users

```json
{
  _id: ObjectId,
  name: String,
  email: String,
  photoUrl: String,
  createdAt: Date
}
{
  _id: ObjectId,
  projectId: ObjectId,
  title: String,
  description: String,
  status: String, // "todo", "in-progress", "done"
  dueDate: Date,
  createdAt: Date
}
{
  _id: ObjectId,
  projectId: ObjectId,
  triggerType: String, // e.g., "onDueDate"
  condition: String,   // e.g., "status == 'todo'"
  actionType: String,  // e.g., "moveToDone"
  data: String,
  createdAt: Date
}
```
##Installation
### Backend
-cd server
-npm install
-npm run dev

### Frontend
-cd client
-npm install
-npm run dev
