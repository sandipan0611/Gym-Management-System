# 🏋️ GYM.OS: Full-Stack Gym Management & Analytics System

[![Node.js](https://img.shields.io/badge/Node.js-v22-339933?logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?logo=prisma)](https://www.prisma.io/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?logo=react)](https://react.dev/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## 📖 Executive Summary
**GYM.OS** is a comprehensive, full-stack enterprise solution designed to modernize gym operations. It leverages a modular **Service-Oriented Architecture (SOA)** to provide high-fidelity business intelligence for administrators and interactive health-tracking agency for members. The system features a premium **Glassmorphism UI** and advanced data visualization to bridge the gap between operational management and member experience.

---

## 🚀 Core Functional Modules

### 📈 Administrative Intelligence
Admins gain real-time visibility into gym performance through a centralized analytics hub:
- **Financial Analytics**: Tracking of Monthly Recurring Revenue (MRR) and plan-specific revenue distribution.
- **Operational Heatmaps**: Visualizing peak gym hours and member check-in trends to optimize staffing.
- **Staffing Optimization**: Automated trainer-to-member load balancing and lifecycle management.
- **Compliance Monitoring**: Automated alerts for expiring subscriptions and membership gaps.

### 🧘 Member Experience & Biometrics
Members are empowered with tools to track their personal fitness journey:
- **Biometric Progress Charts**: Interactive Line and Area charts visualizing Weight, BMI, and Body Fat % trends.
- **Simplified Attendance**: One-click check-ins with localized system constraints.
- **Routine Synchronization**: Direct access to assigned workout routines and trainer assignments.
- **Unified Profile Control**: Self-service updates for personal vitals and authentication credentials.

---

## 🛠️ Technical Implementation

| Layer | Component | Technology |
| :--- | :--- | :--- |
| **Backend** | Runtime Environment | Node.js (v22), Express.js (v5) |
| **Database** | Persistence Layer | PostgreSQL with Prisma ORM |
| **Frontend** | Application Framework | React (v19), Vite |
| **Visualization** | Intelligence Engine | **Recharts** |
| **Security** | Authentication | JWT (Stateless), bcrypt (Hashing) |
| **Design** | Aesthetics | **Glassmorphism System** (Vanilla CSS) |

---

## 📊 Architecture & Design

### Database Architecture
The system's relational structure is designed to handle complex mappings between memberships, staffing, and biometric history.

![System ER Diagram](docs/ER-Diagram.png)

### System Structure
This project follows a strict service-oriented pattern to ensure scalability and ease of maintenance:

#### ⚙️ Backend Logic
- **`services/`**: The system's primary engine. Includes specialized logic like `reportService.js` for analytics and `metricsService.js` for health tracking.
- **`controllers/`**: Handles request-response cycles, performing validation and delegating to the service layer.
- **`middleware/`**: Houses global guards such as `auth.js` for security and `errorHandler.js` for unified exception handling.
- **`prisma/schema.prisma`**: The definitive architectural map of the database schema.

#### 🎨 Frontend Interface
- **`frontend/src/App.jsx`**: The application hub, managing global state, role-based navigation, and data orchestration.
- **`frontend/src/components/`**: 
    - `AdminDashboard.jsx`: The pro-grade portal featuring Recharts analytics widgets.
    - `MemberDashboard.jsx`: The personal progress hub for member biometrics.
    - `AccountSettings.jsx`: The interface for secure profile and vitals management.

---

## ⚙️ Setup & Deployment

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/sandipan0611/Gym-Management-System.git
cd Gym-Management-System

# Install system dependencies
npm install
cd frontend && npm install && cd ..
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_secret_key_here"
FRONTEND_URL="http://localhost:5173"
```

### 3. Activation
Initialize the database and start the production environment:
```bash
npx prisma db push
npm run seed
npm start
```

---

## 📜 License
Licensed under the **Apache License 2.0**.
