# 🏋️ Gym Management System

[![Node.js](https://img.shields.io/badge/Node.js-v22-339933?logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?logo=prisma)](https://www.prisma.io/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?logo=react)](https://react.dev/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A comprehensive, full-stack **Gym Management System** designed to streamline gym operations. This project features a robust **service-oriented architecture**, role-based access control (RBAC), and a synchronized database schema managed via **Prisma**.

---

## 🚀 Key Features

### 🔐 Secure Foundation
- **Role-Based Access Control (RBAC)**: Secure dashboards for **Admins**, **Trainers**, and **Members**.
- **Centralized Error Handling**: Robust middleware to ensure system stability and clean API responses.
- **Input Validation**: Strict server-side validation using `express-validator`.

### ⚡ Gym Operations
- **Trainer Succession Logic**: Advanced logic to fire or replace trainers while preserving member history and reassigning duties automatically.
- **Subscription Pipeline**: Automated membership management — activate new plans while gracefully transitioning from old ones.
- **Daily Attendance**: Enforced once-per-day check-in system with server-side constraints.
- **Workout Assignment**: Precision mapping of members to trainers and specific workout routines.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Node.js (v22), Express.js (v5) |
| **Database** | PostgreSQL |
| **ORM / Migration** | Prisma (Schema Management & Client) |
| **Frontend** | React (v19), Vite, Vanilla CSS |
| **Authentication** | JWT (JSON Web Tokens), bcrypt |
| **Validation** | express-validator |

---

## 📁 Project Structure

```bash
├── config/              # Configuration (DB connection pools)
├── controllers/         # Request handlers (HTTP layer)
├── db/                  # SQL schemas and migration dumps
├── docs/                # Project documentation and ER diagrams
├── frontend/            # React + Vite application
├── middleware/          # Auth, authorization, and error handling
├── prisma/              # Prisma schema and configuration
├── routes/              # Express API route definitions
├── services/            # Core business logic (Service Layer)
├── validators/          # Modular validation rules
└── index.js             # Application entry point
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (Active instance)

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/sandipan0611/Gym-Management-System.git
cd Gym-Management-System

# Install Backend dependencies
npm install

# Install Frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=gym_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=10h
FRONTEND_URL=http://localhost:5173
```

### 4. Database Initialization
Use Prisma to push the schema to your database:
```bash
npx prisma db push
```
*(Alternatively, run the raw SQL from `db/schema.sql`)*

### 5. Seeding Data
Populate the database with initial users and plans:
```bash
npm run seed
```

---

## 🔌 API Summary

| Feature | Endpoint | Method | Auth |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/login` | `POST` | Public |
| **Admin** | `/api/admin/trainers` | `POST` | Admin |
| **Members** | `/api/subscriptions` | `POST` | Member |
| **Attendance**| `/api/attendance` | `POST` | Member |
| **Dashboard** | `/api/dashboard/trainer` | `GET` | Trainer |

> [!TIP]
> Use the [ER Diagram](docs/ER-Diagram.png) in the `docs` folder to understand the relationship between Entities.

---

## 📜 License
This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.
