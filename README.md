# 🏋️ Gym-Management-System

A comprehensive, full-stack **Gym Management System** built as a DBMS project. It handles role-based access control (RBAC), member subscriptions, trainer assignments, workout tracking, and daily attendance using a **Node.js/Express** backend and a **React/Vite** frontend.

## 🚀 Key Features

- **Role-Based Dashboards**: Admins, Trainers, and Members each have a dedicated interface
- **Trainer Succession**: Fire/replace logic that preserves member history and reassigns orphaned members
- **Member Subscription Pipeline**: Auto-cancels old plan and activates new one instantly
- **Daily Attendance**: Enforced once-per-day check-in via server-side constraint
- **Password Management**: All roles can change their password securely
- **Input Validation**: Server-side validation on all critical endpoints

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js v22 |
| Web Framework | Express.js v5 |
| Database | PostgreSQL (via `pg` pool) |
| Auth | JWT + bcrypt |
| Validation | express-validator |
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (dark theme) |

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js v18+
- PostgreSQL (running locally)

### 2. Clone & Install
```bash
git clone https://github.com/sandipan0611/Gym-Management-System.git
cd Gym-Management-System
npm install
cd frontend && npm install && cd ..
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

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

### 4. Database Setup
Create the database and run the schema:
```bash
psql -U postgres -c "CREATE DATABASE gym_db;"
psql -U postgres -d gym_db -f db/schema.sql
```

Optionally seed with demo data (5 admins, 10 trainers, 30 members):
```bash
npm run seed
```

**Default seed credentials:**
| Role | Email | Password |
|------|-------|----------|
| Admin | `sandipan@gym.com` | `admin5` |
| Trainer | `trainer1@gym.com` | `password123` |
| Member | `member1@gym.com` | `password123` |

### 5. Run the Application
```bash
# Terminal 1 — Backend (port 5000)
npm start

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

---

## 📁 Project Structure

```
├── index.js                  ← Express server entry point
├── config/db.js              ← PostgreSQL pool
├── middleware/
│   ├── auth.js               ← JWT verification
│   ├── authorize.js          ← Role-based access control factory
│   ├── errorHandler.js       ← Centralized error handler
│   └── validate.js           ← express-validator runner
├── validators/
│   ├── authValidator.js      ← Register, login, password rules
│   └── adminValidator.js     ← Hire trainer, assign member rules
├── services/                 ← Business logic & DB queries
│   ├── authService.js
│   ├── adminService.js
│   ├── subscriptionService.js
│   ├── attendanceService.js
│   ├── dashboardService.js
│   ├── planService.js
│   ├── workoutService.js
│   └── userService.js
├── controllers/              ← HTTP request/response handlers
├── routes/                   ← Express routers
├── db/
│   ├── schema.sql            ← Canonical schema (run on fresh DB)
│   └── schema_dump.sql       ← pg_dump of live DB
├── docs/
│   └── ER-Diagram.png        ← Entity-Relationship Diagram
├── scripts/migrations/
│   └── seed.js               ← Database seeder
└── frontend/src/
    ├── App.jsx               ← State controller + routing
    ├── services/api.js       ← Centralized API service layer
    └── components/           ← UI modules per role
```

---

## 🗄️ Database Schema

See [`db/schema.sql`](db/schema.sql) for the full schema. See [`docs/ER-Diagram.png`](docs/ER-Diagram.png) for the entity-relationship diagram.

**Key Tables:**

| Table | Purpose |
|-------|---------|
| `users` | All users: admin, trainer, member. Has `status` (active/removed/replaced) |
| `trainers` | Trainer profile linked to users |
| `plans` | Membership plan catalog |
| `subscriptions` | Member → plan relationship, status (active/expired/cancelled) |
| `member_workouts` | Member → trainer → workout mapping, with `previous_trainer_id` for succession |
| `attendance` | Daily check-in records |

---

## 🔌 API Endpoints

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Register new member |
| POST | `/api/auth/login` | Public | Login, returns JWT |

### Plans
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/plans` | Public | Get all membership plans |
| POST | `/api/plans` | Admin | Create new plan |
| PUT | `/api/plans/:id` | Admin | Update plan price |

### Subscriptions
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/subscriptions` | Member, Admin | Get subscriptions |
| POST | `/api/subscriptions` | Member, Admin | Subscribe to plan (auto-cancels existing) |

### Attendance
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/attendance` | Member, Admin | Check in (once per day) |
| GET | `/api/attendance` | Member, Admin | Get own attendance |
| GET | `/api/attendance/:id` | Admin | Get a member's attendance |

### Dashboard
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/dashboard/admin` | Admin | Stats: revenue, counts, assignments |
| GET | `/api/dashboard/trainer` | Trainer | Assigned members and workouts |

### Admin
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/admin/trainers` | Admin | List all trainers |
| POST | `/api/admin/trainers` | Admin | Hire trainer |
| PUT | `/api/admin/trainers/:id/fire` | Admin | Fire trainer |
| POST | `/api/admin/trainers/:id/replace` | Admin | Replace trainer + reassign members |
| GET | `/api/admin/members` | Admin | List all members |
| POST | `/api/admin/assignments` | Admin | Assign member → trainer + workout |

### Users
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/users/members` | Admin | Full member list |
| GET | `/api/users/trainers` | Admin | Full trainer list |
| PUT | `/api/users/password` | Any | Change own password |

---

## 📜 License

MIT License — see [LICENSE](LICENSE)
