# EduCenter LMS - Learning Management System

> ⚠️ **TÀI LIỆU CŨ (LEGACY)** — File README này mô tả kiến trúc ban đầu (React 18 + Express, chưa có branch/license).
> **Nguồn chuẩn hiện tại nằm tại [`docs/`](./docs/README.md)** — bộ tài liệu hợp nhất (on-premise, NestJS + React 19 + Ant Design Pro, license offline, đa chi nhánh).
> Bắt đầu từ: [`docs/README.md`](./docs/README.md) → [`docs/00-project-overview.md`](./docs/00-project-overview.md)

> AI-powered Learning Management System với tính năng tự động chấm bài bằng AI

## 🎯 Giới thiệu

EduCenter LMS là hệ thống quản lý học tập (LMS) hiện đại với các tính năng:
- ✅ Quản lý khóa học, bài giảng
- ✅ Tự động chấm bài bằng AI (essay, code)
- ✅ Dashboard cho học sinh, giáo viên, admin
- ✅ Chứng chỉ hoàn thành khóa học
- ✅ Thống kê và báo cáo tiến độ học tập
- ✅ Diễn đàn thảo luận

## 🏗️ Kiến trúc

```
Web (React 19 + Ant Design Pro)  ──►  API (NestJS 10 + TypeORM)  ──►  PostgreSQL 15/16 (educ_lms)
        ↕                                    ↕
  Vite (HMR)                        Redis 7 / Memurai (BullMQ queue + cache)
                                            ↕
                                     Worker (BullMQ consumer + cron)
```

## 📦 Tech Stack (D4)

### Backend (`apps/api`)
- **Language**: TypeScript
- **Framework**: NestJS 10.x
- **Database**: PostgreSQL 15+ (database `educ_lms`)
- **ORM**: TypeORM (migration chỉ tiến về trước; `synchronize=false`)
- **Queue/Cache**: Redis 7+ (BullMQ)
- **Authentication**: JWT + bcrypt (Phase 2, T016–T018)
- **Validation**: class-validator

### Frontend (`apps/web`)
- **Language**: TypeScript
- **Framework**: React 19
- **UI**: Ant Design 5.x + Ant Design Pro / ProComponents
- **Routing**: React Router v6
- **i18n**: vi-VN mặc định + en-US (D8, Phase 3 T025)

> Nguồn chuẩn: `docs/01-architecture.md` · `docs/00-project-overview.md` · `docs/02-spec.md`

## 🚀 Quick Start

### Prerequisites
- Node.js 20 LTS + **pnpm 9** (xem `docs/06-deployment/dev-environment.md` để cài môi trường chuẩn: PostgreSQL 15/16 + Redis 7/Memurai)
- PostgreSQL 15/16 (role `lms`, database `educ_lms` — script `scripts/dev-env-setup.ps1`)
- Redis 7 / Memurai (BullMQ)

### 1. Cài dependencies
```bash
pnpm install
```

### 2. Chạy toàn bộ (web + api + worker)
```bash
pnpm dev
```

| Thành phần | URL | Thư mục |
|---|---|---|
| Web (Vite + React 19 + AntD Pro) | http://localhost:5173 | `apps/web/` |
| API (NestJS 10 + TypeORM + BullMQ) | http://localhost:4001/api | `apps/api/` |
| Worker (BullMQ consumer) | — | `worker/` |

### 3. Chạy từng phần
```bash
pnpm --filter @lms/api dev       # API — health check: http://localhost:4001/api/health
pnpm --filter @lms/web dev       # Web
pnpm --filter @lms/worker dev    # Worker
```

### 4. Cấu hình API
```bash
cp apps/api/.env.example apps/api/.env
# chỉnh DATABASE_URL / REDIS_HOST / REDIS_PORT / JWT_SECRET
```

## 📁 Project Structure

```
educenter-lms/
├── apps/
│   ├── web/          # React SPA (Vite + React 19 + Ant Design Pro)
│   └── api/          # NestJS 10 + TypeORM + BullMQ
├── worker/           # BullMQ worker process
├── packages/
│   └── shared/       # DTO/type/enums dùng chung
├── database/         # SQL schema & seed (educ_lms)
├── docs/             # Bộ tài liệu chuẩn (00–14 + archive)
├── infra/            # (Phase 1 T008+) .deb, systemd, nginx, lms-setup
├── mockups/          # UI mockups
└── scripts/          # dev-env-setup.ps1, generate-workflows-canvas.js
```

> Cây thư mục đầy đủ theo chuẩn: `docs/01-architecture.md` §3 · stack theo D4: React 19 + AntD Pro · NestJS 10 + TypeORM · PostgreSQL 15/16 + Redis 7 (BullMQ) · KHÔNG Docker.

## 🧪 Testing

Tính năng test sẽ được bổ sung theo lộ trình (xem `docs/09-planning/progress-tracker.html` — hiện tại test runner Vitest cho web, Jest/Supertest cho api chưa cài).

## 📖 API Documentation

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Đăng xuất

### Courses
- `GET /api/courses` - Danh sách khóa học
- `GET /api/courses/:id` - Chi tiết khóa học
- `POST /api/courses` - Tạo khóa học (Teacher)
- `PUT /api/courses/:id` - Cập nhật khóa học (Teacher)
- `DELETE /api/courses/:id` - Xóa khóa học (Teacher)
- `POST /api/courses/:id/enroll` - Đăng ký khóa học (Student)

### Assignments
- `GET /api/assignments` - Danh sách bài tập
- `GET /api/assignments/:id` - Chi tiết bài tập
- `POST /api/assignments` - Tạo bài tập (Teacher)
- `POST /api/assignments/:id/submit` - Nộp bài (Student)
- `POST /api/assignments/submissions/:id/grade` - Chấm bài thủ công (Teacher)
- `POST /api/assignments/submissions/:id/ai-grade` - Chấm bài bằng AI (Teacher)

### Users
- `GET /api/users/me` - Thông tin user hiện tại
- `PUT /api/users/me` - Cập nhật profile
- `POST /api/users/me/change-password` - Đổi mật khẩu
- `GET /api/users` - Danh sách users (Admin)

Full API docs: [API Documentation](docs/license-system-api-documentation.md)

## 🎨 UI Mockups

Xem mockups tại thư mục `/mockups`:
- Student Dashboard
- Teacher Dashboard
- Course Detail
- Login Page

## 🔐 Default Login Credentials (Seed Data)

**Admin**:
- Email: `admin@educenter.vn`
- Password: `admin123`

**Teacher**:
- Email: `tranvanb@educenter.vn`
- Password: `teacher123`

**Student**:
- Email: `nguyenvana@student.edu`
- Password: `student123`

## 🛠️ Development

### Feature Flags
Bật/tắt tính năng tại `backend/src/config/features.config.ts`:
```typescript
export const FEATURES = {
  ai_grading: true,        // Tắt nếu không dùng AI
  certificates: true,
  discussions: true,
  // ...
};
```

### Database Migrations
```bash
# Thêm table mới
psql -d educ_lms -f database/migrations/001-add-new-table.sql
```

## 📝 License System (Phase 2)

Hệ thống license sẽ được triển khai ở Phase 2. Hiện tại đang chạy ở **stub mode** (unlimited features).

Tài liệu đầy đủ: 13 documents trong `/docs/license-system-*.md`

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

- Email: support@educenter.vn
- Website: https://educenter.vn

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by EduCenter Team
