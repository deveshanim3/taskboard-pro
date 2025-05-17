TaskBoard Pro
A collaborative project management platform with Google OAuth, kanban-style task boards, and powerful workflow automations.

Table of Contents
Project Introduction

Features

Getting Started

API Documentation

Database Schema

Demo Video

Optional: Postman Collection

Tech Stack

License

Project Introduction
TaskBoard Pro is a full-stack MERN (MongoDB, Express, React, Node.js) application enabling teams to manage projects and tasks effectively. Users can:

Authenticate with Google OAuth via Firebase

Create projects and invite teammates

Manage tasks in a dynamic kanban board

Define automation rules (mini workflows) that trigger actions like assigning badges or sending notifications based on task events

This platform aims to improve productivity by combining intuitive UI with backend workflow automations.

Features
User Authentication

Login via Google OAuth using Firebase Authentication

User profile management

Project Management

Create, update, delete projects

Invite team members via email

Role-based access control (Owner, Member)

Task Management

Create, update, delete tasks

Kanban-style drag-and-drop interface for task status management

Assign tasks to users

Support for custom project-specific statuses

Workflow Automation

Create automation rules triggered by task status changes, assignments, or due date passing

Actions include assigning badges, changing task status, and sending notifications

Server-side automation processing

Getting Started
Prerequisites
Node.js (v18+)

MongoDB instance

Firebase project with OAuth enabled

Setup
Clone the repository

bash
Copy
Edit
git clone https://github.com/yourusername/taskboard-pro.git
cd taskboard-pro
Setup backend

bash
Copy
Edit
cd server
npm install
# configure your .env file with MongoDB URI, Firebase service account, etc.
npm start
Setup frontend

bash
Copy
Edit
cd ../client
npm install
npm run dev
Access the app at http://localhost:5173

API Documentation
Auth
Method	Endpoint	Description	Access
GET	/api/auth/user	Get current user profile	Private
PUT	/api/auth/user	Update user profile	Private

Projects
Method	Endpoint	Description	Access
GET	/api/projects	List projects user belongs to	Private
POST	/api/projects	Create new project	Private
GET	/api/projects/:id	Get single project details	Project Member
PUT	/api/projects/:id	Update project	Project Owner
DELETE	/api/projects/:id	Delete project	Project Owner
POST	/api/projects/:id/invite	Invite user to project	Project Owner

Tasks
Method	Endpoint	Description	Access
GET	/api/projects/:projectId/tasks	List tasks of a project	Project Member
POST	/api/projects/:projectId/tasks	Create a new task	Project Member
GET	/api/tasks/:id	Get task details	Project Member
PUT	/api/tasks/:id	Update task	Project Member
DELETE	/api/tasks/:id	Delete task	Project Member

Automations
Method	Endpoint	Description	Access
GET	/api/projects/:projectId/automations	List automations	Project Member
POST	/api/projects/:projectId/automations	Create automation	Project Owner
GET	/api/automations/:id	Get automation details	Project Member
PUT	/api/automations/:id	Update automation	Project Owner
DELETE	/api/automations/:id	Delete automation	Project Owner

Database Schema

Description:

Users: Stores user profiles linked via Firebase UID.

Projects: Contains project metadata, owner reference, and member list with roles.

Tasks: Each task belongs to a project, has status, assignee, due date, etc.

Automations: Rules linked to projects with triggers and actions.

(Optional) Notifications: For sending messages triggered by automations.

Demo Video
Watch the Demo on YouTube
Or view Loom video showcasing:

User Login

Project Creation

Task Creation & Drag-n-Drop

Automation Trigger (e.g., status change triggers badge assignment)

Optional: Postman Collection
You can import the Postman collection from postman_collection.json to test all backend APIs easily.

Tech Stack
Layer	Technology
Frontend	React, Vite, Axios, Firebase Auth
Backend	Node.js, Express, MongoDB, Mongoose, Firebase Admin SDK
Authentication	Firebase Google OAuth
Styling	Tailwind CSS (optional) or custom CSS

License
MIT License © deveshanim3
