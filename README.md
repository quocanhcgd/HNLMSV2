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
Frontend (React + TypeScript + Tailwind CSS)
              ↕ REST API
Backend (Node.js + Express + TypeScript)
              ↕
Database (PostgreSQL)
```

## 📦 Tech Stack

### Backend
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 14
- **ORM**: Raw SQL / Prisma (optional)
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **AI**: OpenAI API

### Frontend
- **Language**: TypeScript
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **State**: Zustand + React Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm hoặc yarn

### 1. Clone repository
```bash
git clone https://github.com/your-username/educenter-lms.git
cd educenter-lms
```

### 2. Setup Database
```bash
# Tạo database
createdb educenter_lms

# Chạy schema
psql -d educenter_lms -f database/lms-schema.sql

# Chạy seed data (optional)
psql -d educenter_lms -f database/lms-seed.sql
```

### 3. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env với thông tin database của bạn
# DATABASE_URL=postgresql://postgres:your-password@localhost:5432/educenter_lms

# Run development server
npm run dev
```

Backend sẽ chạy tại: http://localhost:3000

### 4. Setup Frontend (Coming soon)
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## 📁 Project Structure

```
educenter-lms/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── config/    # Configuration files
│   │   ├── routes/    # API routes
│   │   ├── controllers/
│   │   ├── services/  # Business logic
│   │   ├── middleware/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
│
├── frontend/          # React app (Coming soon)
│
├── database/          # SQL schemas & seed data
│   ├── lms-schema.sql
│   └── lms-seed.sql
│
├── docs/              # Documentation
│   └── license-system-*.md (13 docs)
│
└── mockups/           # UI mockups
```

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

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
psql -d educenter_lms -f database/migrations/001-add-new-table.sql
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
