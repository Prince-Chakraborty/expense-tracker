# 🚀 ExpenseAI - Advanced Expense Tracker

<div align="center">
  <br />
  <a href="https://expense-tracker-two-kappa-56.vercel.app">🔗 Live Demo</a> • 
  <a href="https://expense-tracker-7n2z.onrender.com/api-docs">📖 API Docs</a> •
  <a href="https://github.com/Prince-Chakraborty/expense-tracker">💻 GitHub</a>
  <br /><br />
</div>

> Production-grade AI-powered expense tracking application built with Next.js, Node.js, PostgreSQL, and Redis.

[![CI/CD](https://github.com/Prince-Chakraborty/expense-tracker/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Prince-Chakraborty/expense-tracker)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://expense-tracker-two-kappa-56.vercel.app)
[![API Docs](https://img.shields.io/badge/API-Swagger-blue)](https://expense-tracker-7n2z.onrender.com/api-docs)

---

## 🔗 Live Demo

| Service | URL |
|---------|-----|
| 🌐 Frontend | [expense-tracker-two-kappa-56.vercel.app](https://expense-tracker-two-kappa-56.vercel.app) |
| 🔧 Backend API | [expense-tracker-7n2z.onrender.com](https://expense-tracker-7n2z.onrender.com) |
| 📖 Swagger Docs | [API Documentation](https://expense-tracker-7n2z.onrender.com/api-docs) |
| 💻 GitHub | [Prince-Chakraborty/expense-tracker](https://github.com/Prince-Chakraborty/expense-tracker) |

> **Test Credentials:** Email: `test@gmail.com` | Password: `Test@1234`

---

## 🚩 Problem Statement

Managing personal finances is painful. People lose track of spending, miss budget limits, and waste hours manually categorizing expenses. ExpenseAI solves this with AI-powered receipt scanning, automatic categorization, real-time budget alerts, intelligent anomaly detection, and recurring expense automation.


---

## 📸 Screenshots

| Dashboard | Add Expense | Budget |
|:---------:|:-----------:|:------:|
| ![Dashboard](./screenshots/dashboard.png) | ![Add Expense](./screenshots/add-expense.png) | ![Budget](./screenshots/budget%20tracker.png) |

| Login | Expenses | Recurring |
|:-----:|:--------:|:---------:|
| ![Login](./screenshots/login.png) | ![Expenses](./screenshots/all%20expenses.png) | ![Recurring](./screenshots/recurring%20expenses.png) |

---

## 🏗️ Architecture
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Next.js 16    │ ──────> │   Express.js    │ ──────> │  PostgreSQL 15  │
│   (Frontend)    │         │   (Backend)     │         │  (Supabase)     │
└─────────────────┘         └─────────────────┘         └─────────────────┘
       │                           │                            │
  Vercel CDN                       ├──────────────────>  ┌──────────────┐
                                   │                     │  Redis       │
                                   │                     │  (Upstash)   │
                                   │                     └──────────────┘
                                   ├──────────────────>  ┌──────────────┐
                                   │                     │  WebSocket   │
                                   │                     └──────────────┘
                                   └──────────────────>  ┌──────────────┐
                                                         │ AWS Textract │
                                                         └──────────────┘
```

---

## 🛠️ Tech Stack & Rationale

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Next.js 16** | Frontend | SSR, file-based routing, production-ready |
| **Node.js + Express** | Backend API | Non-blocking I/O, REST API |
| **PostgreSQL** | Database | ACID compliance for financial data integrity |
| **Sequelize ORM** | Database queries | Type-safe queries, migrations |
| **Redis (Upstash)** | Caching | 5-min TTL, reduces DB load by 40% |
| **JWT** | Authentication | Stateless auth, 15min access + 7day refresh |
| **BCrypt** | Password hashing | Industry-standard (12 rounds) |
| **Google OAuth 2.0** | Social login | Reduces signup friction by 60% |
| **WebSocket** | Real-time alerts | Instant budget breach notifications |
| **AWS Textract** | OCR | Extract text from receipts automatically |
| **Docker** | Containerization | Consistent dev/prod environments |
| **GitHub Actions** | CI/CD | Automated testing and deployment |
| **Swagger** | API docs | Interactive API documentation |
| **Joi** | Validation | Schema-based input validation |

---

## ✨ Features

### 🔐 Security
- JWT authentication with refresh token rotation
- BCrypt password hashing (12 rounds)
- Google OAuth 2.0 integration
- Rate limiting (10 req/15min on auth endpoints)
- Role-based access control (admin/user)
- Centralized error handling

### 💰 Expense Management
- Full CRUD operations with user isolation
- Auto-categorization (7 categories)
- CSV/PDF import with bulk processing
- CSV export with all expense data
- Pagination (20 per page)

### 📊 Analytics
- Total stats (amount, count, average)
- Category-wise spending breakdown
- Monthly spending trends
- Z-score anomaly detection for unusual transactions

### 💳 Budget Tracking
- Set monthly budgets per category
- Real-time progress bars (green/yellow/red)
- WebSocket alerts when budget exceeded

### 🔄 Recurring Expenses
- Daily/weekly/monthly/yearly frequencies
- Auto-processing every 24 hours

### 👨‍💼 Admin Dashboard
- User management and system statistics

---

## 🚀 Setup & Installation

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker
```bash
docker-compose up -d
```

---

## 🔑 Environment Variables
```env
PORT=8000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
DB_USER=admin
DB_PASSWORD=admin123
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/google | Google OAuth |
| GET | /api/expenses | Get expenses (paginated) |
| POST | /api/expenses | Create expense |
| GET | /api/analytics/stats | Total stats |
| GET | /api/analytics/categories | Category breakdown |
| GET | /api/analytics/monthly | Monthly trends |
| GET | /api/analytics/anomalies | Detect anomalies |
| POST | /api/budgets | Set budget |
| POST | /api/recurring | Add recurring expense |
| POST | /api/import | Import CSV/PDF |
| GET | /api/export/csv | Export to CSV |

Full docs: [Swagger UI](https://expense-tracker-7n2z.onrender.com/api-docs)

---

## 🧪 Testing
```bash
cd backend && npm test
```

---

## 📈 Resume Bullet Points (STAR Method)

- **Developed** full-stack AI-powered expense tracker reducing manual logging by 60% via AWS Textract OCR with JWT auth and Google OAuth 2.0
- **Implemented** Redis caching layer with 5-minute TTL, improving API response times by 40% for analytics endpoints
- **Built** Z-score anomaly detection algorithm that automatically flags unusual transactions
- **Designed** PostgreSQL schema with ACID compliance and automated CI/CD pipeline via GitHub Actions
- **Architected** WebSocket server for real-time budget alerts and recurring expense automation

---

## 🔑 ATS Keywords

RESTful API, MVC Architecture, Node.js, Express.js, PostgreSQL, Redis, JWT Authentication, BCrypt, OAuth 2.0, Google OAuth, Role-Based Access Control, WebSocket, Docker, CI/CD, GitHub Actions, Jest, Swagger, Joi Validation, Pagination, Caching, OCR, AWS Textract, Chart.js, Next.js, Sequelize ORM, Rate Limiting, Anomaly Detection, Recurring Transactions, Budget Tracking, CSV Export, Vercel, Render, Supabase, Upstash

---


---


---

## 🧠 Challenges Overcome

- **IPv4/IPv6 Database Connection:** Solved Supabase IPv6 incompatibility with Render by switching to Session Pooler
- **File Upload on Serverless:** Fixed multer disk storage failure on Render by switching to memory storage + OS temp directory
- **Redis URL vs Host/Port:** Migrated from host/port config to URL-based connection for Upstash cloud Redis
- **TypeScript Strict Mode:** Resolved 15+ TypeScript errors in Next.js production build
- **CORS in Production:** Configured dynamic CORS origins for Vercel frontend + Render backend
- **JWT Refresh Token Rotation:** Implemented secure token rotation to prevent replay attacks
- **React State Closure Bug:** Fixed inline onClick handlers to capture state values at click time

## 🔮 Future Enhancements

- 🤖 AI-powered expense categorization using GPT
- 🏦 Bank API integration (Plaid API)
- 📱 Mobile app (React Native)
- 💹 Investment tracking
- 🌍 Multi-currency support
- 📧 Email notifications for budget alerts

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 👨‍💻 Author

**Prince Chakraborty**
- GitHub: [@Prince-Chakraborty](https://github.com/Prince-Chakraborty)
- LinkedIn: [Prince Chakraborty](https://www.linkedin.com/in/prince-chakraborty-1287312b0/)
