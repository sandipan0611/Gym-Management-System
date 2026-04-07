# 🏋️ Gym-Management-System

A comprehensive, full-stack **Gym Management System** designed for high-performance gym operations. This system handles role-based access control (RBAC), subscription pipelines, workout assignments, and real-time attendance tracking using a **Node.js/Express** backend and a **React/Vite** frontend.

## 🚀 Key Features
- **Role-Based Dashboards**: Customized interfaces for Admins, Trainers, and Members.
- **Member Funnel**: Automated signup/signin flow with dynamic plan integration.
- **Trainer Succession**: Logical "fire/replace" logic that preserves historical data and reassigns members seamlessly.
- **Attendance Tracking**: Secure daily check-ins with "once-per-day" enforcement.
- **Membership Plans**: Dynamic pricing and plan management.
- **Analytics**: Visualization of revenue, population, and visits.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Vanilla CSS (Premium Aesthetics).
- **Backend**: Express.js, JWT Authentication.
- **Database**: PostgreSQL.

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** (running locally)

### 2. Database Setup
1. Create a database named `gym_db`.
2. Run the SQL commands in `db/schema.sql` to initialize the tables.
3. (Optional) Run the seeder to populate dummy data:
   ```bash
   npm run seed
   ```

### 3. Environment Configuration
Create a `.env` file in the root directory (use `.env.example` as a template):
```env
PORT=5000
DB_USER=your_user
DB_HOST=localhost
DB_NAME=gym_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret
```

### 4. Installation & Running
**Backend:**
```bash
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure
- `config/` – Database configuration
- `controllers/` – Business logic (API handlers)
- `routes/` – API route definitions
- `middleware/` – Authentication & request handling
- `db/` – Schema and database dumps
- `scripts/` – Migrations and seed scripts
- `frontend/` – React (Vite) frontend
- `docs/` – ER diagram and documentation

## ER Diagram
![ER Diagram](docs/ER-Diagram.png)

---

## 📜 License
This project is licensed under the Apache License 2.0.
