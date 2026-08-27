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

- [x] **T015** [Frontend] License status UI (license mặc định)
      - Estimate: 1 day
      - Owner: Dev2
      - Deliverable: Trang /license theo docs/13-mockups/01-login-license.html (appScreen): status card (steps + kv box),
        constraints (3 progress bars), addons table, modal Kích hoạt Addon (serial), modal Cập nhật License (upload dropzone)
      - Deviation: route /license (mockup) thay vì /settings/license (task cũ); D9 giữ nguyên — LicenseService stub,
        không gọi /license/* (FUTURE, rule 5.2); nút upload là demo như mockup
      - Verify: design verification audit — License 72/72 computed style khớp (DIFF=0)

### Authentication

- [x] **T016** [Backend] Create User entity and authentication module
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T005
      - Deliverable: Users table, bcrypt password hashing
      - Fields: email, password_hash, full_name, status

- [x] **T017** [Backend] Implement JWT authentication
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T016
      - Deliverable: POST /api/auth/login, JWT tokens
      - Response: { access_token, refresh_token, user }

- [x] **T018** [Backend] Implement authorization guards
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T017
      - Deliverable: @RequireRole(), @RequirePermission() decorators
      - Logic: Check JWT claims against route requirements

- [x] **T019** [Frontend] Login page
      - Estimate: 1 day
      - Owner: Dev2
      - Dependencies: T017
      - Deliverable: /login page with email/password form
      - Features: Remember me, forgot password link

- [x] **T020** [Frontend] Auth state management
      - Estimate: 1 day
      - Owner: Dev2
      - Dependencies: T019
      - Deliverable: Auth state (Context thay Zustand — theo stack D4) + token refresh, useAuth() hook
      - Done kèm: AppShell + Dashboard căn theo docs/13-mockups/02-admin-dashboard.html
        (sidebar w-64, header sticky, branch selector, 🌙/🌐, user chip, KPI/chart/table/alerts, i18n vi/en, toast)
      - Verify: design verification audit — login 88/88 + dashboard 104/104 computed style khớp (DIFF=0)

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

- [x] **T027** [Backend] Create Organization entity
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T005
      - Deliverable: organizations table, CRUD service
      - Fields: name, timezone, academic_year, settings (jsonb)
      - Done: Organization entity + OrganizationService (org mặc định slug 'default', GET/PUT cấu hình); bảng đã có từ migration 1787798321679

- [x] **T028** [Backend] Create Branch entity
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T027
      - Deliverable: branches table, CRUD service
      - Fields: org_id, code, name, address, manager_id, status
      - Done: migration 1787800000001 (branches + FK scope_grants.branch_id → branches); Branch entity + BranchesService (code unique trong org, manager tồn tại, archive = status inactive, soft delete)

- [x] **T029** [Backend] Organization API endpoints
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T027, T028
      - Deliverable: GET/PUT /api/organization, GET/POST/PUT /api/branches
      - Authorization: Admin only
      - Done: OrganizationController (/api/organization GET/PUT, /api/organization/branches GET/POST, /{id} GET/PUT); guard @RequirePermissions (org:read/update, branch:read/create/update — Admin '*' pass, Teacher/Student 403); scope-grant branch ảo → 400 (FK catch)

- [x] **T030** [Frontend] Organization settings page
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T029
      - Deliverable: Form to edit org name, timezone, academic year
      - Route: /settings/organization
      - Done: form (name/timezone/academicPeriod) wire GET/PUT /api/organization, lưu → toast + reload hiển thị (E2E browser 13/13). DEVIATION: mockup 02 không có screen org → dựng theo design system mockup 02/03, nằm trong trang /org (tab "Tổ chức", theo nav mockup nav_org thay vì route /settings/organization)
      - EXTENDED: form đầy đủ 4 nhóm — Thông tin chung (tên viết tắt/MST/ĐKKD/người đại diện/ngày thành lập) + Liên hệ (trụ sở/ĐT/hotline/email/website/fax) + Ngân hàng (tên NH/STK/chủ TK) + Thương hiệu (logo/slogan/màu) — lưu vào contact_settings/brand_settings JSONB key cấu trúc (docs/04 §4.1), KHÔNG đổi contract API/DB (backend đã wire T027); E2E browser 8/8 (save → reload persist JSONB, xác nhận DB)

- [x] **T031** [Frontend] Branch management page
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T029
      - Deliverable: List branches, add/edit/archive branch
      - Route: /settings/branches
      - Features: ProTable with search/filter
      - Done: tab "Chi nhánh" trong /org — bảng (code/name/address/status badge) + search client-side + modal thêm/sửa + đóng cửa (status inactive); wire CRUD /api/organization/branches; E2E browser 13/13 (tạo/sửa/archive + toast)
      - EXTENDED: branch khai báo đầy đủ — migration 1787800000002 thêm phone/email/hotline/tax_code/representative_name/note; modal + bảng hiển thị liên hệ/MST/ngày khai trương (opened_at đã có sẵn); opened_at mặc định = hôm nay khi tạo, closed_at tự ghi khi đóng cửa và xóa khi mở lại; docs 04/05/03 cập nhật; E2E browser 8/8

### User & Role Module

- [x] **T032** [Backend] Create Role and Permission entities
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T016
      - Deliverable: roles, permissions, user_roles tables
      - Relationships: Many-to-many
      - Done: migration 1787800000000 (roles, permissions, role_permissions, user_roles) + seed (org default, 26 permissions, 8 roles, role_permissions, user legacy → user_roles)
      - EXTENDED (B — RBAC thật): AuthzGuard đọc role_permissions thật từ DB qua users.effectiveRbac (dùng chung /me/context → guard và UI luôn khớp); fallback map static legacy nếu user chưa có role trong user_roles; @RequireRoles chấp nhận cả role DB. PHÁT HIỆN + FIX data: role 'student' bị ghi đè 25 quyền (thao tác toggle/save tab Roles trong thử nghiệm E2E T036) → migration 1787800000003 reset student về đúng seed chuẩn ['auth:context','user:read'] + khôi phục name/description 8 role. Verify ma trận 22/22 + UI E2E 4/4 (branch_manager chỉ thấy HN1; student bị chặn role:manage/branch:read/scope:grant; admin toàn quyền)

- [x] **T033** [Backend] Create ScopeGrant entity
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T032
      - Deliverable: scope_grants table
      - Fields: user_id, branch_id, effective_from, effective_to
      - Done: bảng scope_grants (branch/class/student UUID chưa FK — bảng sau); grant/revoke qua API T035

- [x] **T034** [Backend] Implement branch scope filtering
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T033
      - Deliverable: Repository base class with auto branch filter
      - Logic: All queries auto-filtered by user's accessible branches
      - Done: ScopesService.resolveBranchIds (org_admin/system_admin/legacy Admin → toàn quyền; còn lại = branch active từ scope_grants) + ScopeContextService (AsyncLocalStorage) + global ScopeContextInterceptor (next.handle() gọi trong cùng run()); lọc users list (EXISTS scope_grants) + assertUserInScope ở getDetail/update; branches list/detail/update filter/assert (latent — guard branch:read Admin-only, note khi AuthzGuard đọc permission từ DB); verified E2E 9 case
      - EXTENDED (B): guard giờ đọc permission từ DB → filter/assert branch KHÔNG CÒN latent — branch_manager thực sự chỉ thấy branch được cấp (verify ma trận 22/22 + UI 4/4)

- [x] **T035** [Backend] User & Role API endpoints
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T032, T033
      - Deliverable: /api/users, /api/roles CRUD endpoints
      - Features: Assign roles, grant branch scope
      - Done: GET/POST /users (phân trang, lọc q/role/branch_id), GET/PUT /users/{id}, PUT /users/{id}/roles, POST/GET/DELETE /users/{id}/scope-grants; GET /roles, GET /roles/permissions, POST/PATCH/DELETE /roles, PUT /roles/{id}/permissions; /me/context trả roles/permissions/scopes thật; guard @RequirePermissions (Admin '*', Teacher/Student user:read)

- [x] **T036** [Frontend] User management page
      - Estimate: 3 days
      - Owner: Dev2
      - Dependencies: T035
      - Deliverable: Trang /users theo docs/13-mockups/03-users-roles.html (tab Users): filter search/role/branch/status,
        bảng users, modal Tạo người dùng (chips roles), modal Cấp scope (type/object/from/to/reason)
      - Deviation: route /users theo mockup (task cũ /settings/users ProTable)
      - Done: WIRE API HOÀN CHỈNH — bảng GET /users thật (q/role/branch_id/status + phân trang 10/trang),
        search debounce, tạo user POST /users + scope branch qua POST scope-grants, cấp scope thật
        (from/to → effectiveFrom/effectiveTo, reason chỉ visual — DTO forbidNonWhitelisted),
        modal Chi tiết mới: đổi vai trò (PUT /users/{id}/roles) + danh sách scope + thu hồi
        (DELETE scope-grants); backend: thêm filter status vào GET /users
      - Verify: design verification audit — Users 87/87 khớp (DIFF=0, 4 SKIP data-dependent)
      - E2E browser 18/18 PASS (tạo user → scope → roles → revoke)

- [x] **T037** [Frontend] Role management page
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T035
      - Deliverable: Tab Roles trong /users theo mockup 03: role list (8 roles, addon tag), 5 perm groups
        (org/users/acad/fin/lic) toggle, Hoàn tác / Lưu thay đổi
      - Deviation: tab trong /users theo mockup (task cũ /settings/roles + permission tree)
      - Done: WIRE API HOÀN CHỈNH — role list GET /roles thật (8 roles + descriptions), perms real từ
        GET /roles/permissions nhóm theo mockup (grp_org/users/acad/fin/lic + grp_sys cho auth/queue),
        toggle → PUT /roles/{id}/permissions (save thật + audit); Lưu → toast thật
      - Verify: design verification audit — Roles pane khớp (DIFF=0); E2E 18/18 PASS (toggle + save + revert)

---

## Phase 5: Academic Core (Week 10-12) - 🟡 High

### Academic Structure

- [x] **T038** [Backend] Create academic entities
      - Estimate: 3 days
      - Owner: Dev1
      - Dependencies: T005
      - Deliverable: departments, programs, courses, classes tables
      - Relationships: dept -> programs -> courses -> classes
      - DONE: migration 1787800000004 (7 bảng: +rooms, class_teachers, schedules) + 1787800000005 (thay bảng `courses` LEGACY còn sót từ schema cũ — drop CASCADE lessons/assignments/certificates/... chưa dùng, tái tạo FK classes.course_id); seed permission program:read/class:read (migration 0004)

- [x] **T039** [Backend] Create schedule conflict detection
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T038
      - Deliverable: Service to check teacher/room conflicts
      - Logic: Query overlapping time slots
      - DONE: so trùng CHÍNH XÁC teacher/room + weekday + date-range + time-range overlap → 409 kèm message (lớp/giờ trùng). KHÔNG dùng exclusion constraint DB thô (DDL §6) vì false-positive khi 2 buổi khác giờ cùng ngày (ghi D9). Verify: 409 khi chạm giờ (GV & phòng), 201 khi khác ngày/giờ.

- [x] **T040** [Backend] Academic CRUD API endpoints
      - Estimate: 3 days
      - Owner: Dev1
      - Dependencies: T038, T039
      - Deliverable: /api/departments, /programs, /courses, /classes
      - Authorization: Branch-scoped access
      - DONE: + /rooms + GET/PUT /classes/:id + schedules (GET/POST/DELETE /classes/:id/schedules). Scope: classes/rooms lọc theo branch được cấp (T034+B — active); dept/program/course org-wide. Phân quyền: program:read/create/update · class:read/create/update · schedule:manage. DEVIATION: /courses, PUT, /rooms, DELETE schedule thêm ngoài api-spec (theo DDL §6 + thực tế). Verify API 22/22 (CRUD + 409 trùng mã + scope BM: chỉ thấy lớp HN1, 403 HCM1 + student 403).

- [x] **T041** [Frontend] Department & Program management
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T040
      - Deliverable: CRUD pages for departments and programs
      - Routes: /academic/departments, /academic/programs
      - DONE: 1 trang /academic 4 tab (Ngành/Chương trình/Khóa học/Lớp học) — mockup 02 không có screen academic → thiết kế theo design system mockup 02/03 (DEVIATION). i18n vi/en.

- [x] **T042** [Frontend] Course management
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T040
      - Deliverable: Course list and form, link to program
      - Route: /academic/courses
      - DONE: tab Khóa học (link program, order_index, mô tả, status).

- [x] **T043** [Frontend] Class management
      - Estimate: 3 days
      - Owner: Dev2
      - Dependencies: T040
      - Deliverable: Class list, create class form, assign teacher
      - Route: /academic/classes
      - Features: Schedule picker, capacity input, teacher selector
      - DONE: tab Lớp học: list lọc branch, create/edit (branch→program→course cascade select, modality, capacity, teacher multi-select), detail modal: thông tin + giảng viên + lịch học (thêm/xóa buổi, conflict 409 hiện toast message). E2E UI 7/7 (chuỗi tạo dept→program→course→class→schedule→conflict 409).

### Student & Enrollment

> **DECISION (T030/T031 review, 2026-08):** Mô hình 3 lớp theo docs/03-data-model.md §4 — KHÔNG gộp học sinh/phụ huynh vào users:
> - `users` = ACCOUNT đăng nhập (email/pass/2FA/role/scope) — mọi người dùng hệ thống. Màn /users (P4) chỉ quản lý account, đúng US2.
> - `students` = HỒ SƠ học vụ (student_code, dob, gender, phone, guardian_phone, identity_ref, status graduated/dropped, notes) — tách bảng riêng, `user_id` FK users NULL nếu học viên chưa có account. DDL đã có (04-database-schema §students) + scope_grants đã có cột student scope → P5 nối vào tự nhiên.
> - `ParentLink`/`Delegation` = **(P2 addon Parent)** — parent user ↔ student + relationship + hiệu lực từ/đến + người duyệt; quyền phụ huynh là ủy quyền theo từng học viên, có thời hạn, thu hồi được. CHƯA thêm vào DDL; KHÔNG thêm role `Parent` vào seed trước khi có machinery delegation (role rỗng vô dụng).
> - Luồng US4: tạo student profile (registry) → chọn class → invoice → enrollment Pending Payment → active. Phone user (DDL đã có) chưa đưa vào form tạo user — bổ sung khi cần.

- [x] **T044** [Backend] Create Student entity
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T005
      - Deliverable: students table, CRUD service
      - Fields: theo DDL chuẩn — org_id, user_id (nullable), student_code (unique), full_name, dob, gender, phone, guardian_phone, identity_ref, status (active|inactive|graduated|dropped), notes (KHÔNG có email — email thuộc users account)
      - DONE: migration 1787800000006 (students + enrollments + enrollment_progress + trigger sync_class_enrolled_count); CRUD GET/POST/PUT /students (paged + tìm q + lọc branch qua EXISTS enrollment→class); branchId khi tạo chỉ kiểm tra scope (KHÔNG lưu — students không có cột branch); scope-restricted user phải chọn chi nhánh (400 nếu thiếu).

- [x] **T045** [Backend] Create Enrollment entity
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T044, T038
      - Deliverable: enrollments table, enrollment service
      - Logic: Check class capacity, create invoice
      - DONE: entity + service; kiểm tra trùng (UNIQUE → 409 'Đã ghi danh') + capacity (409 'Lớp đã đầy X/Y'); trigger DB tự đồng bộ classes.enrolled_count (insert/đổi status). DEVIATION: invoice=null (bảng invoices thuộc phase Finance — ghi D9). Data-fix migration 1787800000007: cấp thêm enrollment:create cho branch_manager (quầy chi nhánh) — seed gốc chỉ có academic_manager/teacher.

- [x] **T046** [Backend] Enrollment API endpoints
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T045
      - Deliverable: POST /api/enrollments, GET /api/students/:id/enrollments
      - Authorization: Branch-scoped
      - DONE: POST /enrollments (guard enrollment:create + scope theo class.branch), GET /enrollments/:id (kèm progress), GET /students/:id/enrollments, PUT /enrollments/:id (đổi status — DEVIATION thêm ngoài api-spec, trigger sync count). Phân quyền đọc: user:read (student có user:read nên xem được registry — contract B). Verify API 19/19 (CRUD + trùng + đầy + trigger sync + drop giảm count + BM scope 403/201 + student 403 enroll).

- [x] **T047** [Frontend] Student management page
      - Estimate: 3 days
      - Owner: Dev2
      - Dependencies: T044, T046
      - Deliverable: Student list, add/edit student, view enrollments
      - Route: /academic/students
      - Features: ProTable with search by name/email
      - DONE: route /students (nav 'Học viên & Ghi danh'); bảng + tìm q + lọc branch + phân trang + thêm/sửa học viên (branch select khi thêm — bắt buộc, status khi sửa); chi tiết học viên hiển thị thông tin + danh sách ghi danh. i18n vi/en. (Route dùng /students thay /academic/students — theo nav mockup 02 nav_enroll.)

- [x] **T048** [Frontend] Enrollment workflow
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T046
      - Deliverable: Enroll student modal, class selector, confirmation
      - Location: Student detail page → Enrollments tab
      - DONE: modal Ghi danh (chỉ liệt kê lớp còn chỗ, hiện X/Y), 409 (trùng/đầy) hiện toast message backend; sau ghi danh reload danh sách. E2E UI 6/6 (nav → tạo học viên → tìm → chi tiết → ghi danh → bảng có dòng).

---

## Phase 6: Student Learning (Week 13) - 🟡 High

### Learning Portal

- [x] **T049** [Backend] Create LearningContent entity
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T005
      - Deliverable: learning_contents table
      - Fields: title, type, file_path, access_scope, class_id
      - DONE: migration 1787800000008 — learning_content + content_versions + content_class_links (content_progress + library_* chờ T053/T055). Data-fix migration 1787800000009: permissions content:read + content:manage (teacher/academic_manager = manage+read; branch_manager/student = read; admin '*' qua).

- [x] **T050** [Backend] Content upload and storage
      - Estimate: 2 days
      - Owner: Dev1
      - Dependencies: T049
      - Deliverable: POST /api/learning-contents/upload
      - Storage: Local filesystem under /var/lms/uploads/
      - DONE: POST /learning/content (multipart: title + file + access_scope + class_ids[]) → 201; 413 quá 500MB (multer filter). Storage local apps/api/uploads/learning/{id}/v1/ (env LMS_UPLOAD_DIR override; prod /var/lms/uploads). SHA-256 file_hash + content_versions v1 + content_class_links. DEVIATION (D9): chưa có anti-virus scanner — allowlist MIME/extension + SHA-256 hash thay thế; branch_id của học liệu = chi nhánh duy nhất trong scope (nếu bị giới hạn).

- [x] **T051** [Backend] Content authorization
      - Estimate: 1 day
      - Owner: Dev1
      - Dependencies: T050
      - Deliverable: GET /api/learning-contents/:id/download with auth check
      - Logic: Check if user has access (enrolled in class or public)
      - DONE: GET /learning/content/:id/download — public → tất cả (đã đăng nhập); class → chủ sở hữu / teacher lớp (class_teachers) / học viên đang ghi danh (enrollments.status ∈ pending_payment, active) / academic_manager; private → chủ sở hữu + admin. Kèm scope branch (content.branch_id ngoài scope → 403). Verify 17/17 (upload 3 scope + list lọc + download đúng/403 + PUT + student 403 upload + file trên disk).

- [x] **T052** [Frontend] Content management for teachers
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T050
      - Deliverable: Upload content, set access scope, assign to class
      - Route: /learning/contents
      - DONE: tab 'Học liệu' thứ 5 trong /academic (DEVIATION: mockup 02 không có screen học liệu — theo design system; giữ nav mockup) + route /learning/contents. Upload modal (title + scope + multi-select lớp + file ≤500MB), danh sách lọc theo lớp/phạm vi + phân trang, nút Tải về (Bearer token qua blob), sửa scope/lớp. i18n vi/en. E2E UI 4/4 (tab → upload → toast → dòng + nút tải).

- [x] **T053** [Frontend] Student dashboard
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T046, T051
      - Deliverable: Dashboard showing enrolled classes, progress
      - Route: /student/dashboard
      - DONE: portal học viên — tài khoản chỉ có role student → **StudentPortalLayout** riêng (nav Tổng quan / Lớp của tôi / Thư viện) branch theo `useAuth().roles` trong App.tsx (DEVIATION: mockup 02 không có screen portal — theo design system). Dashboard: lời chào + thẻ các lớp đang ghi danh (program/course + tiến độ) + quick link thư viện. Backend `GET /students/me` (hồ sơ + enrollments In[pending_payment,active] kèm class+program+course+progress). i18n vi/en. Verify API 13/13 + E2E UI 8/8.

- [x] **T054** [Frontend] Student class detail page
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T053
      - Deliverable: View class info, schedule, learning materials
      - Route: /student/classes/:id
      - DONE: `GET /students/me/classes/{classId}` (403 nếu chưa ghi danh) — class+program+course, giảng viên (class_teachers→users), lịch (schedule + roomName/teacherName), học liệu (learning_content JOIN content_class_links WHERE class_id + access_scope='class' + published) kèm myProgress. FE: checkbox đánh dấu hoàn thành → `PATCH /learning/content/{id}/progress` (upsert content_progress, is_completed tự true khi ≥100) + nút Tải về. i18n vi/en.

- [x] **T055** [Frontend] Library page
      - Estimate: 1 day
      - Owner: Dev2
      - Dependencies: T051
      - Deliverable: Browse and search learning contents
      - Route: /learning/library
      - Features: Search, filter by category/subject
      - DONE: `GET /learning/library` — public + học liệu lớp đang ghi danh (EXISTS content_class_links→enrollments→students.user_id + status In[pending_payment,active]); lọc q/subject/category (category theo cột text — DEVIATION thay category_id, chưa có bảng library_categories) + phân trang 2 bước. FE: ô tìm q + subject, thẻ học liệu + nút Tải về. i18n vi/en.

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

- [x] **T067** [Frontend] Financial reports
      - Estimate: 2 days
      - Owner: Dev2
      - Dependencies: T064
      - Deliverable: Trang /reports theo docs/13-mockups/04-reports.html: 4 type cards (ghi danh/doanh thu/công suất/tiến độ),
        params (branch, from/to date, format), jobs async (seed 1 job + tạo job 180ms), preview table + export buttons
      - Deviation: route /reports theo mockup (task cũ /finance/reports, chỉ báo cáo tài chính); demo async — wire worker (US8) sau
      - Verify: design verification audit — Reports 53/53 computed style khớp (DIFF=0)
      - Mockup fix: mockup 04 .input-field .7rem → .75rem (đồng bộ mockup 01/03); fix crash t('h0').split(',') (h0 là mảng)

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
