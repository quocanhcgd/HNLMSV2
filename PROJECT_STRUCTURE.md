# EduCenter LMS - Project Structure

> ⚠️ **TÀI LIỆU CŨ (LEGACY)** — cấu trúc mô tả ở đây là kiến trúc ban đầu. Kiến trúc và tài liệu chuẩn hiện tại: [`docs/`](./docs/README.md).

```
educenter-lms/
├── backend/                    # Node.js + TypeScript + Express
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── database.ts
│   │   │   ├── features.config.ts
│   │   │   └── env.ts
│   │   │
│   │   ├── routes/            # API routes/endpoints
│   │   │   ├── index.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── courses.routes.ts
│   │   │   ├── assignments.routes.ts
│   │   │   └── users.routes.ts
│   │   │
│   │   ├── controllers/       # Request/Response handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── courses.controller.ts
│   │   │   ├── assignments.controller.ts
│   │   │   └── users.controller.ts
│   │   │
│   │   ├── services/          # Business logic (CORE)
│   │   │   ├── auth.service.ts
│   │   │   ├── courses.service.ts
│   │   │   ├── assignments.service.ts
│   │   │   ├── ai-grading.service.ts
│   │   │   └── email.service.ts
│   │   │
│   │   ├── models/            # Database access layer
│   │   │   ├── prisma/
│   │   │   │   └── schema.prisma
│   │   │   └── db.ts
│   │   │
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── logger.middleware.ts
│   │   │
│   │   ├── types/             # TypeScript types/interfaces
│   │   │   ├── index.ts
│   │   │   ├── user.types.ts
│   │   │   └── course.types.ts
│   │   │
│   │   ├── utils/             # Helper functions
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   └── validators.ts
│   │   │
│   │   └── app.ts             # Express app setup
│   │
│   ├── tests/                 # Unit & integration tests
│   │   ├── unit/
│   │   └── integration/
│   │
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                   # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── common/        # Button, Input, Card, Modal
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Modal.tsx
│   │   │   │
│   │   │   ├── layout/        # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── DashboardLayout.tsx
│   │   │   │
│   │   │   └── features/      # Feature-specific components
│   │   │       ├── CourseCard.tsx
│   │   │       ├── AssignmentCard.tsx
│   │   │       └── LessonItem.tsx
│   │   │
│   │   ├── pages/             # Page components
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Courses.tsx
│   │   │   │   └── Assignments.tsx
│   │   │   │
│   │   │   ├── teacher/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── MyCourses.tsx
│   │   │   │   └── Grading.tsx
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   └── Dashboard.tsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   │
│   │   │   └── public/
│   │   │       └── Home.tsx
│   │   │
│   │   ├── hooks/             # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useCourses.ts
│   │   │   ├── useAssignments.ts
│   │   │   └── useUser.ts
│   │   │
│   │   ├── services/          # API services
│   │   │   ├── api.ts         # Axios instance
│   │   │   ├── auth.service.ts
│   │   │   ├── courses.service.ts
│   │   │   └── assignments.service.ts
│   │   │
│   │   ├── store/             # State management (Zustand)
│   │   │   ├── authStore.ts
│   │   │   ├── uiStore.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── styles/            # Global styles & theme
│   │   │   ├── globals.css
│   │   │   ├── theme.ts       # Design system
│   │   │   └── tailwind.config.js
│   │   │
│   │   ├── types/             # TypeScript types
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/             # Helper functions
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # Entry point
│   │   └── router.tsx         # Routes configuration
│   │
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
│
├── database/                   # Database scripts
│   ├── lms-schema.sql
│   ├── lms-seed.sql
│   └── migrations/
│
├── docs/                       # Documentation
│   ├── license-system-*.md    # 13 license system docs
│   └── api/
│       └── api-documentation.md
│
├── mockups/                    # UI mockups
│   ├── lms-student-dashboard.html
│   ├── lms-login.html
│   ├── lms-course-detail.html
│   └── lms-teacher-dashboard.html
│
├── .gitignore
├── docker-compose.yml         # Optional: for PostgreSQL
└── README.md                  # Main project README
```

## Key Principles

### 🎯 Separation of Concerns
- **Routes**: Define endpoints only
- **Controllers**: Handle HTTP request/response
- **Services**: Contain business logic (reusable)
- **Models**: Database access only

### 🧩 Component-Based Frontend
- **Common**: Reusable UI primitives
- **Layout**: Page structure components
- **Features**: Business-specific components
- **Pages**: Compose components into screens

### 🔧 Easy to Modify
- **Config files**: Change behavior without code
- **Theme system**: Change colors/fonts globally
- **Feature flags**: Enable/disable features
- **Layered architecture**: Change one layer without affecting others

### 🧪 Testable
- Services have no HTTP dependencies
- Components receive props (easy to test)
- Pure functions in utils
- Mock API in tests

## Next Steps

1. Initialize backend: `cd backend && npm init`
2. Initialize frontend: `cd frontend && npm create vite@latest`
3. Install dependencies (see package.json in each folder)
4. Configure database connection
5. Start development!
