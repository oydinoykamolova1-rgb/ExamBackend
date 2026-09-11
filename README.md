# 🎓 ExamSystem Pro — Online Testing & Grading Platform

An end-to-end full-stack **Exam Management & Automatic Grading System** built with **C# / ASP.NET Core Web API**, **Entity Framework Core**, and **React + Vite** frontend interface.

![Exam System Glassmorphic UI](https://img.shields.io/badge/Architecture-Clean%20Layered-indigo?style=for-the-badge)
![NET Version](https://img.shields.io/badge/.NET-10.0-purple?style=for-the-badge&logo=dotnet)
![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)
![SQLite](https://img.shields.io/badge/Database-SQLite-emerald?style=for-the-badge&logo=sqlite)

---

## 📁 Repository Structure

```
ExamBackend/
├── Exam-Backend/                  # C# ASP.NET Core Web API
│   ├── Controllers/               # Auth, Exams, Questions, Results, Users APIs
│   ├── Domain/                    # User, Exam, Question, Answer, Result Entities & Enums
│   ├── Data/                      # AppDbContext & Fluent API Entity Configurations
│   ├── Repositories/              # Generic & Entity Repositories
│   ├── Service/                   # Business Logic, JWT Tokens & Grading Engine
│   ├── DTOs/                      # Request & Response DTOs
│   ├── Migrations/                # EF Core Database Migrations
│   ├── Program.cs                 # App Bootstrap, DI & Seed Data
│   └── appsettings.json           # Connection Strings & JWT Key Settings
│
├── Exam-Frontend/                 # React 18 + Vite Web Application
│   ├── src/
│   │   ├── api/                   # Fetch API wrappers with Bearer Token integration
│   │   ├── components/            # Navbar, Modal, TimerBadge, Glass Cards
│   │   ├── pages/                 # Login, Register, Student, Exam Player, Results, Teacher & Admin
│   │   ├── context/               # AuthContext State & Role handling
│   │   └── styles/                # Glassmorphic CSS Design Tokens
│   ├── package.json               # Dependencies
│   └── vite.config.js             # API Proxy Setup (port 5000)
│
└── Exam.Tests/                    # xUnit Automated Unit Tests
    ├── AuthServiceTests.cs        # User register & password hashing tests
    └── ResultServiceTests.cs      # Automated grading algorithm tests
```

---

## ✨ Features

- 🔐 **JWT Authentication & Authorization**: Role-based access control (`Admin`, `Teacher`, `Student`) with BCrypt password hashing.
- ⚡ **1-Click Quick Demo Login**: Instantly switch between Admin, Teacher, and Student roles on the login page.
- ⏱️ **Live Exam Session Player**: Real-time countdown timer badge with auto-submission on timeout.
- 🎯 **Single & Multiple Choice Questions**: Full support for weighted points per question and flexible options.
- 📊 **Automated Grading Engine**: Instant score calculation, percentage evaluation, and Pass/Fail status determination.
- 🎉 **Celebratory Animations**: Interactive score breakdown with confetti celebrations for passed exams.
- 👨‍🏫 **Teacher Studio**: Create exams, manage question sets, set duration & pass thresholds, and review student submissions.
- 👑 **Admin Portal**: System-wide user management, role modification, and account controls.

---

## 🔑 Fast Demo Login Accounts

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **👑 Admin** | `admin@exam.com` | `Admin123!` | User management & System administration |
| **👨‍🏫 Teacher 1** | `teacher@exam.com` | `Teacher123!` | Exam creation, question management & grading reports |
| **👩‍🏫 Teacher 2** | `sarah.teacher@exam.com` | `Teacher123!` | Exam & question management |
| **🎓 Student 1** | `student@exam.com` | `Student123!` | Exam taking & score history |
| **🎓 Student 2** | `maria.student@exam.com` | `Student123!` | Exam taking & score history |
| **🎓 Student 3** | `david.student@exam.com` | `Student123!` | Exam taking & score history |

---

## 🚀 Getting Started

### Prerequisites
- [.NET 9 / 10 SDK](https://dotnet.microsoft.com/)
- [Node.js v18+](https://nodejs.org/)

### 1. Run Backend API
```bash
cd Exam-Backend
dotnet run
```
The API will start at `http://localhost:5000` with Swagger UI at `http://localhost:5000/swagger`.

### 2. Run Frontend Web App
```bash
cd Exam-Frontend
npm install
npm run dev
```
The web application will open at `http://localhost:5173`.

### 3. Run Automated Tests
```bash
cd Exam.Tests
dotnet test
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Authorization | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/exams` | Public / Auth | List all active exams |
| `GET` | `/api/exams/{id}` | Auth | Get exam details with questions |
| `POST` | `/api/exams` | Teacher / Admin | Create a new exam |
| `PUT` | `/api/exams/{id}` | Teacher / Admin | Update exam settings |
| `DELETE` | `/api/exams/{id}` | Teacher / Admin | Delete an exam |
| `POST` | `/api/questions` | Teacher / Admin | Add question with answer options |
| `POST` | `/api/results/submit` | Auth | Submit exam answers & trigger grading |
| `GET` | `/api/results/my-results` | Auth | Get student's past exam results |
| `GET` | `/api/users` | Admin | List all registered users |

---

## 📄 License
This project is licensed under the MIT License.
