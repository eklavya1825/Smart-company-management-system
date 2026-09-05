# SCMS — Smart Company Management System

A full-stack company management portal built with **React (Vite)**, **Node.js/Express**, and **MongoDB**. SCMS lets Admins, HR, Managers, and Employees manage day-to-day company operations — employees, attendance, leave, projects, payroll, performance, and announcements — from a single, modern dashboard.

> Built as a portfolio / internship project. The codebase is intentionally kept clean and readable rather than over-engineered.

---

## ✨ Features

- **Role-based authentication** (Admin, HR, Manager, Employee) with JWT
- **Dashboard** with live stats, charts, recent activity, and upcoming events
- **Employee management** — search, filter, add, edit, delete, detailed profile view
- **Attendance** — check-in/check-out, daily records, status breakdown chart
- **Leave management** — apply, approve/reject, leave balance tracking
- **Project & task management** — team members, progress tracking, task boards
- **Department management** — headcount, department heads, active projects
- **Payroll** — role-scoped visibility (employees see only their own salary)
- **Performance reviews** — ratings, strengths, feedback, goals
- **Company announcements**
- **Reports & analytics** — CSV export, printable reports, multiple charts
- **Settings** — profile, password, notifications, light/dark mode
- **Fully responsive** — desktop, tablet, and mobile
- **Demo mode** — the app works even without MongoDB connected (see below)

---

## 🛠 Tech Stack

**Frontend:** React 18, Vite, React Router, Axios, Recharts, Lucide React icons, plain CSS (no UI framework)

**Backend:** Node.js, Express.js, JWT auth, bcryptjs

**Database:** MongoDB with Mongoose

---

## 📁 Project Structure

```
SCMS/
│
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/               # Route-level pages
│   │   ├── layouts/             # DashboardLayout (sidebar + topbar)
│   │   ├── context/             # AuthContext, ThemeContext
│   │   ├── services/            # Axios API instance
│   │   ├── utils/               # Formatting & CSV helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express backend
│   ├── controllers/             # Route handler logic
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # Express routers
│   ├── middleware/               # auth, error handling, demo mode
│   ├── config/                  # MongoDB connection
│   ├── seed/                    # Seed script + mock data
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── README.md
├── .gitignore
└── package.json                # Convenience scripts for both apps
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd SCMS
```

### 2. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

(Or from the root: `npm run install:all`)

### 3. Configure environment variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/scms
JWT_SECRET=replace_this_with_a_long_random_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 4. MongoDB Setup

You need a running MongoDB instance — either:

- **Local:** install MongoDB Community Server and run `mongod`. Use `MONGO_URI=mongodb://127.0.0.1:27017/scms`.
- **Atlas (cloud):** create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), get your connection string, and set it as `MONGO_URI`.

### 5. Seed the database

```bash
cd server
npm run seed
```

This populates MongoDB with realistic demo data: 15 employees, 6 departments, 5 projects with tasks, attendance records, leave requests, payroll records, performance reviews, announcements, and 4 login accounts.

### 6. Run the backend

```bash
cd server
npm run dev
```

Server runs at `http://localhost:5000`.

### 7. Run the frontend

In a separate terminal:

```bash
cd client
npm run dev
```

App runs at `http://localhost:5173` (Vite proxies `/api` requests to the backend automatically).

---

## 🖥️ Running in VS Code

1. Open the `SCMS` folder in VS Code.
2. Open two integrated terminals (`` Ctrl+` `` / `` Cmd+` ``).
3. In the first terminal: `cd server && npm install && npm run dev`
4. In the second terminal: `cd client && npm install && npm run dev`
5. Open `http://localhost:5173` in your browser.

---

## 🔐 Demo Credentials

| Role     | Email                                     | Password      |
|----------|--------------------------------------------|---------------|
| Admin    | admin@scms.com                            | admin123      |
| HR       | hr@scms.com                               | hr123         |
| Manager  | manager@scms.com                          | manager123    |
| Employee | employee@scms.com                         | employee123   |

---

## 🎭 Demo / Fallback Mode

SCMS is designed to still be demoable even **without MongoDB connected**. On startup, the server attempts to connect to MongoDB. If the connection fails:

- The server logs a warning and starts anyway.
- All API routes automatically serve **read-only mock data** (defined in `server/seed/mockData.js`) instead of querying the database.
- The 4 demo accounts above still work for login.
- Create/update actions return success responses but are not persisted (clearly a demo-mode limitation).

This means you can clone the repo and click around the entire UI even before setting up MongoDB — great for quick demos or interviews where a database might not be available.

---

## 📡 API Overview

All routes are prefixed with `/api` and (except login) require a `Bearer <token>` header.

| Method | Route                          | Description                          |
|--------|----------------------------------|---------------------------------------|
| POST   | `/api/auth/login`                | Log in, returns JWT + user            |
| GET    | `/api/auth/me`                   | Get current user                      |
| GET    | `/api/employees`                 | List employees (search/filter)        |
| GET    | `/api/employees/:id`             | Get employee details                  |
| POST   | `/api/employees`                 | Create employee (Admin/HR)            |
| PUT    | `/api/employees/:id`             | Update employee (Admin/HR)            |
| DELETE | `/api/employees/:id`             | Delete employee (Admin/HR)            |
| GET    | `/api/attendance`                | List attendance (filter by date)      |
| POST   | `/api/attendance`                | Check in / check out / mark status    |
| GET    | `/api/leaves`                    | List leave requests                   |
| POST   | `/api/leaves`                    | Apply for leave                       |
| PUT    | `/api/leaves/:id`                | Approve/reject (Admin/HR/Manager)     |
| GET    | `/api/projects`                  | List projects                         |
| GET    | `/api/projects/:id`              | Project details + tasks               |
| POST   | `/api/projects`                  | Create project (Admin/Manager)        |
| PUT    | `/api/projects/:id`              | Update project (Admin/Manager)        |
| DELETE | `/api/projects/:id`              | Delete project (Admin/Manager)        |
| POST   | `/api/projects/:id/tasks`        | Add a task to a project               |
| GET    | `/api/departments`               | List departments                      |
| GET    | `/api/departments/:id`           | Department details + employees        |
| POST   | `/api/departments`               | Create department (Admin)             |
| GET    | `/api/payroll`                   | List payroll (role-scoped)            |
| GET    | `/api/performance`               | List performance reviews              |
| POST   | `/api/performance`                | Create review (Admin/HR/Manager)      |
| GET    | `/api/announcements`             | List announcements                    |
| POST   | `/api/announcements`             | Post announcement (Admin/HR)          |
| GET    | `/api/dashboard/stats`           | Aggregated dashboard statistics       |

---

## 🧩 Main Modules Explained (Simple Terms)

- **Auth** — Users log in with email/password, the server checks credentials and hands back a signed JWT token. That token is attached to every future request so the server knows who's asking and what they're allowed to do.
- **Employees** — The core directory of everyone in the company: personal info, job info, and quick links to their attendance, leave, and performance history.
- **Attendance** — A simple daily check-in/check-out log per employee, summarized into Present/Absent/Late/Half Day counts.
- **Leave** — Employees request time off; HR/Managers approve or reject. Balances are calculated from approved leave days used so far.
- **Projects & Tasks** — Each project has a manager, a team, and a list of tasks assigned to individual employees, so progress is easy to track.
- **Departments** — Groups employees under a department head and shows department-level stats.
- **Payroll** — A read-only internal record of salary breakdowns per employee (no real payment processing).
- **Performance** — Periodic review scores (1–5) with manager feedback, strengths, and improvement areas.
- **Announcements** — A company-wide notice board that Admin/HR can post to.
- **Reports** — Pulls together data from every module into charts, plus a CSV export button.
- **Demo Mode** — A safety net: if the database isn't reachable, the app quietly switches to serving realistic mock data so nothing breaks during a demo.

---

## 🔮 Future Scope

- Real-time notifications via WebSockets
- File uploads for employee documents and profile photos
- Email notifications for leave approvals and announcements
- Payroll PDF payslip generation
- Advanced analytics with date-range filters
- Multi-language support

---

## 👤 Author

Built as a personal portfolio project to demonstrate full-stack development skills (React, Node.js, Express, MongoDB, REST API design, and responsive UI/UX) for internship applications.
