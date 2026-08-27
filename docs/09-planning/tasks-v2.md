---
description: "MVP Task List for LMS On-Premise"
version: "2.1"
timeline: "16 weeks (Sep - Dec 2026)"
team: "2 Full-stack Developers"
---

# Tasks: LMS đa ngành đa chi nhánh (MVP)

**Target**: Q3 2026 Beta Launch  
**Team**: 2 Full-stack Developers  
**Duration**: 16 weeks (~4 months)  
**Scope**: Base System Only (Core + Academic + Learning + Finance)

> 📊 **Theo dõi tiến độ trực quan (theo task, từ xa)**: mở [`progress-tracker.html`](./progress-tracker.html) (standalone, Tailwind CDN — lưu state localStorage, Export/Import JSON để đồng bộ). 🎯 Mỗi task có **quy trình đầy đủ** (mục tiêu/đầu vào/bước/đầu ra/DoD) + **PROMPT_CONTEXT** để chuyển hội thoại mới tiếp tục được — xem trong tracker hoặc [`task-prompts.md`](./task-prompts.md).

---

## Task Format

```
- [ ] T### [Component] Description
      Estimate: X days
      Owner: Dev1/Dev2/Both
      Dependencies: T###, T###
      Deliverable: Specific output
```

**Priority Codes**:
- 🔴 **Critical**: Blocks other work
- 🟡 **High**: Important for MVP
- 🟢 **Normal**: Can be parallelized

---

## Phase 1: Foundation (Week 1-3) - 🔴 Critical

### Setup & Infrastructure

> ⏸️ **T008–T010 (deploy/infra) tạm hoãn** — ưu tiên coding feature chạy local (quyết định 2026-08: "deploy để sau"). Quay lại khi chuẩn bị đóng gói lên máy chủ.

- [x] **T001** [DevOps] Initialize monorepo structure
      - Estimate: 1 day
      - Owner: Dev1
      - Deliverable: `apps/`, `packages/`, `infra/` folders with package.json
      - Notes: pnpm workspace, TypeScript 5.x, ESLint, Prettier

- [x] **T002** [Frontend] Setup Vite + React 19 project in `apps/web`
      - Estimate: 1 day
      - Owner: Dev2
      - Dependencies: T001
      - Deliverable: Working dev server with HMR
      - Stack: Vite 5.x, React 19, React Router 6.x

- [x] **T003** [Frontend] Install Ant Design 5.x + Ant Design Pro
      - Estimate: 1 day
      - Owner: Dev2
      - Dependencies: T002
      - Deliverable: ProLayout working with sample menu
      - Components: antd, @ant-design/pro-components

- [x] **T004** [Backend] Setup NestJS project in `apps/api`
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T001
      - Deliverable: API server responding to /health
      - Stack: NestJS 10.x, TypeORM, class-validator

- [x] **T005** [Backend] Setup PostgreSQL schema and TypeORM config
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T004
      - Deliverable: Database connection working, migrations runnable
      - Notes: Create `educ_lms` schema, migration scripts

- [x] **T006** [Backend] Setup Redis for caching and queues
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T004
      - Deliverable: BullMQ queue working with test job

- [x] **T007** [Backend] Create worker process in `worker/`
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T006
      - Deliverable: Worker consumes jobs from queue

- [ ] **T008** [DevOps] Create Debian package skeleton ⏸️ (để sau)
      - Estimate: 2 days
      - Owner: Dev1
      - Deliverable: `.deb` package structure in `infra/debian/`
      - Contents: DEBIAN/control, postinst, prerm scripts

- [ ] **T009** [DevOps] Create installation wizard script ⏸️ (để sau)
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T008
      - Deliverable: `lms-setup wizard` interactive CLI
      - Prompts: DB credentials, admin user, org name

- [ ] **T010** [DevOps] Create systemd service units ⏸️ (để sau)
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T009
      - Deliverable: lms-web.service, lms-api.service, lms-worker.service

---

## Phase 2: Authentication (Week 4-5) - 🔴 Critical

### License — license mặc định & điểm kết nối chờ (D9)

> ⚠️ **(D9)** Hệ thống quản lý license **không triển khai** ở giai đoạn này. Thay cho các task RSA/activation cũ, làm stub + giữ schema/contract làm điểm chờ. Các task kích hoạt license đầy đủ chuyển sang **FUTURE** (khi có hệ thống quản lý license).

- [x] **T011'** [Backend] Triển khai LicenseService **STUB** trả license mặc định (dev/evaluation)
      - Estimate: 0.5 day
      - Owner: Dev1
      - Deliverable: Mọi module `effective_enabled=true`, không enforce constraint
      - Notes: Giữ interface LicenseService để sau này thay bằng hệ thống quản lý license

- [x] **T012'** [Backend] Tạo bảng license RESERVED (licenses, addon_licenses, module_states, feature_flags)
      - Estimate: 1 day
      - Owner: Dev1
      - Deliverable: Migration tạo bảng (không seed); bảng giữ schema cho điểm kết nối chờ

- [x] **T013'** [Backend] Giữ contract API `/license/*` (FUTURE)
      - Estimate: 0.5 day
      - Owner: Dev1
      - Deliverable: Endpoint license đánh dấu FUTURE trong OpenAPI; không hiện ở UI sản xuất

- [ ] **T014** [Backend] Implement license constraint checks — **FUTURE (D9)**
      - Estimate: 1 day (khi có hệ thống quản lý license)
      - Owner: Dev1
      - Deliverable: Guards for max_students, max_branches
      - Throws: LicenseConstraintExceededException

- [ ] **T015** [Frontend] License status UI (license mặc định)
      - Estimate: 1 day
      - Owner: Dev2
      - Deliverable: Trang /settings/license hiển thị "Default (dev/evaluation)"; nút kết nối hệ thống quản lý license (disabled/FUTURE)

### Authentication

- [x] **T016** [Backend] Create User entity and authentication module
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T005
      - Deliverable: Users table, bcrypt password hashing
      - Fields: email, password_hash, full_name, status

- [ ] **T017** [Backend] Implement JWT authentication
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T016
      - Deliverable: POST /api/auth/login, JWT tokens
      - Response: { access_token, refresh_token, user }

- [ ] **T018** [Backend] Implement authorization guards
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T017
      - Deliverable: @RequireRole(), @RequirePermission() decorators
      - Logic: Check JWT claims against route requirements

- [ ] **T019** [Frontend] Login page
      - Estimate: 1 day
      - Owner: Dev2
      - Dependencies: T017
      - Deliverable: /login page with email/password form
      - Features: Remember me, forgot password link

- [ ] **T020** [Frontend] Auth state management
      - Estimate: 1 day
      - Owner: Dev2
      - Dependencies: T019
      - Deliverable: Zustand store for auth, token refresh logic
      - Exports: useAuth() hook

---

## Phase 3: Core UI (Week 6-7) - 🟡 High

### Layout & Navigation

- [ ] **T021** [Frontend] Create ProLayout configuration
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T003
      - Deliverable: Responsive sidebar, header, content area
      - Features: Collapse sidebar, mobile drawer

- [ ] **T022** [Frontend] Create navigation menu configuration
      - Estimate: 1 day
      - Owner: Dev2
      - Dependencies: T021
      - Deliverable: Menu config with roles and permissions
      - File: `src/config/menu.config.ts`

- [ ] **T023** [Frontend] Implement role-based menu rendering
      - Estimate: 1 day
      - Owner: Dev2
      - Dependencies: T022
      - Deliverable: Menu items hidden based on user roles

- [ ] **T024** [Frontend] Create common components
      - Estimate: 3 days
      - Owner: Dev2
      - Dependencies: T021
      - Deliverable: PageHeader, DataTable, FormBuilder, ErrorBoundary
      - Location: `src/components/common/`

- [ ] **T025** [Frontend] Setup i18n with react-i18next
      - Estimate: 1 day
      - Owner: Dev2
      - Dependencies: T003
      - Deliverable: Language switcher (VI/EN), translation files
      - Files: `src/locales/vi-VN.json`, `en-US.json`

- [ ] **T026** [Frontend] Setup theme configuration
      - Estimate: 1 day
      - Owner: Dev2
      - Dependencies: T003
      - Deliverable: ConfigProvider with custom theme tokens
      - Features: Primary color, dark mode toggle

---

## Phase 4: Organization & Users (Week 8-9) - 🟡 High

### Organization Module

- [ ] **T027** [Backend] Create Organization entity
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T005
      - Deliverable: organizations table, CRUD service
      - Fields: name, timezone, academic_year, settings (jsonb)

- [ ] **T028** [Backend] Create Branch entity
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T027
      - Deliverable: branches table, CRUD service
      - Fields: org_id, code, name, address, manager_id, status

- [ ] **T029** [Backend] Organization API endpoints
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T027, T028
      - Deliverable: GET/PUT /api/organization, GET/POST/PUT /api/branches
      - Authorization: Admin only

- [ ] **T030** [Frontend] Organization settings page
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T029
      - Deliverable: Form to edit org name, timezone, academic year
      - Route: /settings/organization

- [ ] **T031** [Frontend] Branch management page
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T029
      - Deliverable: List branches, add/edit/archive branch
      - Route: /settings/branches
      - Features: ProTable with search/filter

### User & Role Module

- [ ] **T032** [Backend] Create Role and Permission entities
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T016
      - Deliverable: roles, permissions, user_roles tables
      - Relationships: Many-to-many

- [ ] **T033** [Backend] Create ScopeGrant entity
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T032
      - Deliverable: scope_grants table
      - Fields: user_id, branch_id, effective_from, effective_to

- [ ] **T034** [Backend] Implement branch scope filtering
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T033
      - Deliverable: Repository base class with auto branch filter
      - Logic: All queries auto-filtered by user's accessible branches

- [ ] **T035** [Backend] User & Role API endpoints
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T032, T033
      - Deliverable: /api/users, /api/roles CRUD endpoints
      - Features: Assign roles, grant branch scope

- [ ] **T036** [Frontend] User management page
      - Estimate: 3 days
      - Owner: Dev2
      - Dependencies: T035
      - Deliverable: List users, add/edit user, assign roles
      - Route: /settings/users
      - Features: ProTable, modal form, role selector

- [ ] **T037** [Frontend] Role management page
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T035
      - Deliverable: List roles, edit permissions
      - Route: /settings/roles
      - Features: Permission tree selector

---

## Phase 5: Academic Core (Week 10-12) - 🟡 High

### Academic Structure

- [ ] **T038** [Backend] Create academic entities
      - Estimate: 3 days
      - Owner: Dev1
      - Dependencies: T005
      - Deliverable: departments, programs, courses, classes tables
      - Relationships: dept -> programs -> courses -> classes

- [ ] **T039** [Backend] Create schedule conflict detection
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T038
      - Deliverable: Service to check teacher/room conflicts
      - Logic: Query overlapping time slots

- [ ] **T040** [Backend] Academic CRUD API endpoints
      - Estimate: 3 days
      - Owner: Dev1
      - Dependencies: T038, T039
      - Deliverable: /api/departments, /programs, /courses, /classes
      - Authorization: Branch-scoped access

- [ ] **T041** [Frontend] Department & Program management
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T040
      - Deliverable: CRUD pages for departments and programs
      - Routes: /academic/departments, /academic/programs

- [ ] **T042** [Frontend] Course management
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T040
      - Deliverable: Course list and form, link to program
      - Route: /academic/courses

- [ ] **T043** [Frontend] Class management
      - Estimate: 3 days
      - Owner: Dev2
      - Dependencies: T040
      - Deliverable: Class list, create class form, assign teacher
      - Route: /academic/classes
      - Features: Schedule picker, capacity input, teacher selector

### Student & Enrollment

- [ ] **T044** [Backend] Create Student entity
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T005
      - Deliverable: students table, CRUD service
      - Fields: org_id, full_name, dob, email, phone, status

- [ ] **T045** [Backend] Create Enrollment entity
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T044, T038
      - Deliverable: enrollments table, enrollment service
      - Logic: Check class capacity, create invoice

- [ ] **T046** [Backend] Enrollment API endpoints
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T045
      - Deliverable: POST /api/enrollments, GET /api/students/:id/enrollments
      - Authorization: Branch-scoped

- [ ] **T047** [Frontend] Student management page
      - Estimate: 3 days
      - Owner: Dev2
      - Dependencies: T044, T046
      - Deliverable: Student list, add/edit student, view enrollments
      - Route: /academic/students
      - Features: ProTable with search by name/email

- [ ] **T048** [Frontend] Enrollment workflow
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T046
      - Deliverable: Enroll student modal, class selector, confirmation
      - Location: Student detail page → Enrollments tab

---

## Phase 6: Student Learning (Week 13) - 🟡 High

### Learning Portal

- [ ] **T049** [Backend] Create LearningContent entity
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T005
      - Deliverable: learning_contents table
      - Fields: title, type, file_path, access_scope, class_id

- [ ] **T050** [Backend] Content upload and storage
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T049
      - Deliverable: POST /api/learning-contents/upload
      - Storage: Local filesystem under /var/lms/uploads/

- [ ] **T051** [Backend] Content authorization
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T050
      - Deliverable: GET /api/learning-contents/:id/download with auth check
      - Logic: Check if user has access (enrolled in class or public)

- [ ] **T052** [Frontend] Content management for teachers
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T050
      - Deliverable: Upload content, set access scope, assign to class
      - Route: /learning/contents

- [ ] **T053** [Frontend] Student dashboard
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T046, T051
      - Deliverable: Dashboard showing enrolled classes, progress
      - Route: /student/dashboard

- [ ] **T054** [Frontend] Student class detail page
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T053
      - Deliverable: View class info, schedule, learning materials
      - Route: /student/classes/:id

- [ ] **T055** [Frontend] Library page
      - Estimate: 1 day
      - Owner: Dev2
      - Dependencies: T051
      - Deliverable: Browse and search learning contents
      - Route: /learning/library
      - Features: Search, filter by category/subject

---

## Phase 7: Finance & Billing (Week 14-15) - 🟡 High

### Finance Module

- [ ] **T056** [Backend] Create Invoice entity
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T005
      - Deliverable: invoices table
      - Fields: student_id, enrollment_id, amount_total, amount_paid, status

- [ ] **T057** [Backend] Auto-create invoice on enrollment
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T056, T045
      - Deliverable: Enrollment service creates invoice automatically
      - Logic: Get fee from program, create invoice, link to enrollment

- [ ] **T058** [Backend] Create PaymentTransaction entity
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T056
      - Deliverable: payment_transactions table
      - Fields: invoice_id, amount, payment_method, provider, status, idempotency_key

- [ ] **T059** [Backend] Manual payment recording
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T058
      - Deliverable: POST /api/payments/record (cash/bank transfer)
      - Logic: Update invoice balance, generate receipt

- [ ] **T060** [Backend] Payment gateway plugin architecture
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T058
      - Deliverable: PaymentGatewayInterface, VNPayAdapter skeleton
      - Methods: generatePaymentUrl(), validateWebhook()

- [ ] **T061** [Backend] Implement VNPay integration
      - Estimate: 3 days
      - Owner: Dev1
      - Dependencies: T060
      - Deliverable: VNPay payment flow working end-to-end
      - Flow: Generate URL → Customer pays → Webhook → Update invoice

- [ ] **T062** [Backend] Webhook idempotency handling
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T061
      - Deliverable: Duplicate webhook requests don't double-pay
      - Logic: Check idempotency_key, return 200 if already processed

- [ ] **T063** [Backend] Receipt generation (PDF)
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T059
      - Deliverable: Generate PDF receipt with invoice details
      - Library: Use pdfkit or similar

- [ ] **T064** [Frontend] Invoice management page
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T056
      - Deliverable: List invoices, filter by status/branch
      - Route: /finance/invoices

- [ ] **T065** [Frontend] Payment recording UI
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T059
      - Deliverable: Record cash/bank payment, upload proof
      - Location: Invoice detail page

- [ ] **T066** [Frontend] Payment link generation
      - Estimate: 1 day
      - Owner: Dev2
      - Dependencies: T061
      - Deliverable: Button to generate VNPay link, copy link
      - Location: Invoice detail page

- [ ] **T067** [Frontend] Financial reports
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T064
      - Deliverable: Revenue by branch/month, receivables report
      - Route: /finance/reports
      - Features: Date picker, branch filter, export Excel

---

## Phase 8: Testing & Polish (Week 16) - 🔴 Critical

### Testing

- [ ] **T068** [Testing] Write unit tests for critical services
      - Estimate: 2 days
      - Owner: Both
      - Coverage: LicenseService (stub, D9), EnrollmentService, PaymentService
      - Target: 80% coverage for business logic

- [ ] **T069** [Testing] Write integration tests
      - Estimate: 2 days
      - Owner: Both
      - Scenarios: Enrollment flow, payment flow, branch scope isolation
      - Tools: Vitest + testcontainers for PostgreSQL

- [ ] **T070** [Testing] Write E2E tests for critical flows
      - Estimate: 2 days
      - Owner: Both
      - Flows: Login, create class, enroll student, record payment
      - Tool: Playwright

- [ ] **T071** [Testing] Security audit
      - Estimate: 1 day
      - Owner: Dev1
      - Checks: SQL injection, XSS, CSRF, auth bypass attempts
      - Tools: Manual testing + OWASP ZAP

### Documentation & Deployment

- [ ] **T072** [Docs] Write installation guide
      - Estimate: 1 day
      - Owner: Dev1
      - Deliverable: step-by-step installation on Ubuntu 22.04
      - File: `docs/installation-guide.md`

- [ ] **T073** [Docs] Write user manual
      - Estimate: 1 day
      - Owner: Dev2
      - Deliverable: Screenshots and instructions for each module
      - File: `docs/user-manual.md`

- [ ] **T074** [Docs] Write API documentation
      - Estimate: 1 day
      - Owner: Dev1
      - Deliverable: OpenAPI spec exported from Swagger
      - File: `docs/api-spec.yaml`

- [ ] **T075** [DevOps] Build final .deb package
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: All above
      - Deliverable: lms-base-v1.0.0.deb tested on clean Ubuntu

- [ ] **T076** [DevOps] Kiểm tra license mặc định hoạt động (D9)
      - Estimate: 0.5 day
      - Owner: Dev1
      - Deliverable: LMS khởi động với license mặc định (không cần demo license file)
      - Purpose: Xác nhận không cần kích hoạt ở giai đoạn này

---

## Summary

**Total Tasks**: 76  
**Estimated Duration**: 16 weeks  
**Team**: 2 Full-stack Developers  
**Parallelization**: ~50% of tasks can run in parallel  

### Week-by-Week Breakdown

| Week | Phase | Dev1 Tasks | Dev2 Tasks |
|------|-------|------------|------------|
| 1-3 | Foundation | T001, T004-T010 | T002, T003 |
| 4-5 | Auth | T011'-T013', T015, T016-T018 | T014 (FUTURE), T019, T020 |
| 6-7 | Core UI | - | T021-T026 |
| 8-9 | Organization & Users | T027-T035 | T030, T031, T036, T037 |
| 10-12 | Academic Core | T038-T040, T044-T046 | T041-T043, T047, T048 |
| 13 | Student Learning | T049-T051 | T052-T055 |
| 14-15 | Finance & Billing | T056-T063 | T064-T067 |
| 16 | Testing & Polish | T068-T071, T074-T076 | T072, T073 |

### Critical Path

```
T001 → T004 → T005 → T016 → T017 → T027 → T038 → T045 → T056 → T075
```

**Longest dependency chain**: ~10 weeks of sequential work  
**Buffer time**: 6 weeks for parallelization and contingency

---

## Post-MVP Addons (Q4 2026)

After base system launch, develop paid addons:

1. **Admission & CRM Addon** (~3 weeks)
   - Landing page CMS
   - Lead management
   - Consultation workflow

2. **Assessment & Testing Addon** (~4 weeks)
   - Exam builder
   - Auto-grading
   - English pathway (4 skills)

3. **Online Classes Addon** (~3 weeks)
   - Zoom/Meet integration
   - Attendance sync
   - Recording management

4. **HRM & Payroll Addon** (~5 weeks)
   - Employee management
   - Attendance tracking
   - Payroll calculation

---

## Risk Mitigation

**If timeline slips**:
1. Defer non-critical features (e.g., advanced reports, receipt PDF)
2. Launch with manual workarounds (e.g., Excel exports instead of UI reports)
3. Focus on happy path, defer edge cases to v1.1

**If team capacity issues**:
1. Prioritize backend over frontend polish
2. Use Ant Design Pro defaults instead of heavy customization
3. Hire contractor for specific tasks (e.g., payment integration)

---

**Status**: Ready for implementation  
**Next Step**: T001 - Initialize monorepo structure  
**Start Date**: [TBD - Sep 2026]
