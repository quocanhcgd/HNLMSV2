# Task Prompts — EduCenter LMS (MVP)
**Nguồn**: sinh từ `progress-tracker.html`. Mỗi task có PROMPT_CONTEXT hoàn chỉnh — dán vào hội thoại AI mới để tiếp tục đúng task.
**Version**: 1.1 · **Date**: 2026-08-26 · **Số task**: 75

---

## PROMPT_CONTEXT CHUNG (đi kèm mọi task)
```
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).
```

---

## BẢNG TASK
| ID | Phase | Week | Owner | Title | Est |
|----|-------|------|-------|-------|-----|
| T001 | Foundation | 1-3 | Dev1 | Khởi tạo monorepo | 1 |
| T002 | Foundation | 1-3 | Dev2 | Setup Vite + React 19 (apps/web) | 1 |
| T003 | Foundation | 1-3 | Dev2 | Cài Ant Design 5 + Pro | 1 |
| T004 | Foundation | 1-3 | Dev1 | Setup NestJS (apps/api) | 1 |
| T005 | Foundation | 1-3 | Dev1 | PostgreSQL schema + TypeORM config | 2 |
| T006 | Foundation | 1-3 | Dev1 | Redis + BullMQ | 1 |
| T007 | Foundation | 1-3 | Dev1 | Worker process | 1 |
| T008 | Foundation | 1-3 | Dev1 | Debian package skeleton | 2 |
| T009 | Foundation | 1-3 | Dev1 | Installation wizard (lms-setup) | 2 |
| T010 | Foundation | 1-3 | Dev1 | Systemd service units | 1 |
| T011 | Auth | 4-5 | Dev1 | LicenseService STUB | 0.5 |
| T012 | Auth | 4-5 | Dev1 | Bảng license RESERVED | 1 |
| T013 | Auth | 4-5 | Dev1 | Contract /license/* FUTURE | 0.5 |
| T015 | Auth | 4-5 | Dev2 | License status UI | 1 |
| T016 | Auth | 4-5 | Dev1 | User entity + auth module | 2 |
| T017 | Auth | 4-5 | Dev1 | JWT authentication | 2 |
| T018 | Auth | 4-5 | Dev1 | Authorization guards | 2 |
| T019 | Auth | 4-5 | Dev2 | Login page | 1 |
| T020 | Auth | 4-5 | Dev2 | Auth state management | 1 |
| T021 | Core UI | 6-7 | Dev2 | ProLayout configuration | 2 |
| T022 | Core UI | 6-7 | Dev2 | Menu config | 1 |
| T023 | Core UI | 6-7 | Dev2 | Role-based menu render | 1 |
| T024 | Core UI | 6-7 | Dev2 | Common components | 3 |
| T025 | Core UI | 6-7 | Dev2 | i18n vi/en | 1 |
| T026 | Core UI | 6-7 | Dev2 | Theme configuration | 1 |
| T027 | Org & Users | 8-9 | Dev1 | Organization entity | 1 |
| T028 | Org & Users | 8-9 | Dev1 | Branch entity | 1 |
| T029 | Org & Users | 8-9 | Dev1 | Org & Branch API | 2 |
| T030 | Org & Users | 8-9 | Dev2 | Org settings page | 2 |
| T031 | Org & Users | 8-9 | Dev2 | Branch management page | 2 |
| T032 | Org & Users | 8-9 | Dev1 | Role & Permission entities | 2 |
| T033 | Org & Users | 8-9 | Dev1 | ScopeGrant entity | 1 |
| T034 | Org & Users | 8-9 | Dev1 | Branch scope filtering | 2 |
| T035 | Org & Users | 8-9 | Dev1 | User & Role API | 2 |
| T036 | Org & Users | 8-9 | Dev2 | User management page | 3 |
| T037 | Org & Users | 8-9 | Dev2 | Role management page | 2 |
| T038 | Academic | 10-12 | Dev1 | Academic entities | 3 |
| T039 | Academic | 10-12 | Dev1 | Schedule conflict detection | 2 |
| T040 | Academic | 10-12 | Dev1 | Academic CRUD API | 3 |
| T041 | Academic | 10-12 | Dev2 | Dept & Program mgmt | 2 |
| T042 | Academic | 10-12 | Dev2 | Course management | 2 |
| T043 | Academic | 10-12 | Dev2 | Class management | 3 |
| T044 | Academic | 10-12 | Dev1 | Student entity | 1 |
| T045 | Academic | 10-12 | Dev1 | Enrollment entity | 2 |
| T046 | Academic | 10-12 | Dev1 | Enrollment API | 2 |
| T047 | Academic | 10-12 | Dev2 | Student mgmt page | 3 |
| T048 | Academic | 10-12 | Dev2 | Enrollment workflow | 2 |
| T049 | Learning | 13 | Dev1 | LearningContent entity | 1 |
| T050 | Learning | 13 | Dev1 | Content upload/storage | 2 |
| T051 | Learning | 13 | Dev1 | Content authorization | 1 |
| T052 | Learning | 13 | Dev2 | Content mgmt (teacher) | 2 |
| T053 | Learning | 13 | Dev2 | Student dashboard | 2 |
| T054 | Learning | 13 | Dev2 | Student class detail | 2 |
| T055 | Learning | 13 | Dev2 | Library page | 1 |
| T056 | Finance | 14-15 | Dev1 | Invoice entity | 1 |
| T057 | Finance | 14-15 | Dev1 | Auto-create invoice on enrollment | 1 |
| T058 | Finance | 14-15 | Dev1 | PaymentTransaction entity | 1 |
| T059 | Finance | 14-15 | Dev1 | Manual payment recording | 1 |
| T060 | Finance | 14-15 | Dev1 | Payment gateway plugin arch | 2 |
| T061 | Finance | 14-15 | Dev1 | VNPay integration | 3 |
| T062 | Finance | 14-15 | Dev1 | Webhook idempotency | 1 |
| T063 | Finance | 14-15 | Dev1 | Receipt generation (PDF) | 2 |
| T064 | Finance | 14-15 | Dev2 | Invoice mgmt page | 2 |
| T065 | Finance | 14-15 | Dev2 | Payment recording UI | 2 |
| T066 | Finance | 14-15 | Dev2 | Payment link generation | 1 |
| T067 | Finance | 14-15 | Dev2 | Financial reports | 2 |
| T068 | Test & Polish | 16 | Both | Unit tests | 2 |
| T069 | Test & Polish | 16 | Both | Integration tests | 2 |
| T070 | Test & Polish | 16 | Both | E2E tests | 2 |
| T071 | Test & Polish | 16 | Dev1 | Security audit | 1 |
| T072 | Test & Polish | 16 | Dev1 | Installation guide | 1 |
| T073 | Test & Polish | 16 | Dev2 | User manual | 1 |
| T074 | Test & Polish | 16 | Dev1 | API documentation | 1 |
| T075 | Test & Polish | 16 | Dev1 | Build final .deb | 1 |
| T076 | Test & Polish | 16 | Dev1 | Kiểm tra license mặc định (D9) | 0.5 |

---

## T001 — Khởi tạo monorepo
+ **Phase**: Foundation (Week 1-3) · Critical · Owner Dev1 · ~1 ngày · Deps: —
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T001 — Khởi tạo monorepo (Phase Foundation, Week 1-3, Critical, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
Thiết lập cấu trúc monorepo dùng chung cho web/api/worker/packages/infra.

━━ ĐẦU VÀO (đọc trước) ━━
• 01-architecture.md §3 (cây thư mục)
• pnpm ≥9, Node ≥20

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Tạo pnpm workspace + turbo.json
2. Tạo apps/web, apps/api, worker, packages/shared, packages/license-core, infra/
3. Cấu hình TypeScript 5.x, ESLint, Prettier

━━ ĐẦU RA (Deliverable) ━━
• apps/, packages/, infra/ có package.json
• pnpm install chạy được

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] pnpm install hết lỗi
[ ] pnpm build package rỗng chạy
[ ] Lint+Prettier pass

━━ PHỤ THUỘC ━━
Không có

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T002 — Setup Vite + React 19 (apps/web)
+ **Phase**: Foundation (Week 1-3) · Critical · Owner Dev2 · ~1 ngày · Deps: T001
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T002 — Setup Vite + React 19 (apps/web) (Phase Foundation, Week 1-3, Critical, owner Dev2, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
Dựng apps/web với Vite + React 19 + Router.

━━ ĐẦU VÀO (đọc trước) ━━
• T001
• 01-architecture.md §4

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Tạo Vite 5 + React 19 trong apps/web
2. Thêm React Router 6
3. Cấu hình alias @/, env, HMR

━━ ĐẦU RA (Deliverable) ━━
• Dev server chạy với HMR
• 1 route demo

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] npm run dev + HMR hoạt động
[ ] Router có route demo

━━ PHỤ THUỘC ━━
T001

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T003 — Cài Ant Design 5 + Pro
+ **Phase**: Foundation (Week 1-3) · Critical · Owner Dev2 · ~1 ngày · Deps: T002
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T003 — Cài Ant Design 5 + Pro (Phase Foundation, Week 1-3, Critical, owner Dev2, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
Tích hợp Ant Design 5 + Pro components.

━━ ĐẦU VÀO (đọc trước) ━━
• T002
• 01-architecture.md §4

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Cài antd + @ant-design/pro-components
2. ConfigProvider + ProLayout mẫu
3. Menu mẫu

━━ ĐẦU RA (Deliverable) ━━
• ProLayout render menu mẫu

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Layout sidebar/header/content hiển thị
[ ] Không lỗi console

━━ PHỤ THUỘC ━━
T002

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T004 — Setup NestJS (apps/api)
+ **Phase**: Foundation (Week 1-3) · Critical · Owner Dev1 · ~1 ngày · Deps: T001
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T004 — Setup NestJS (apps/api) (Phase Foundation, Week 1-3, Critical, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T001
• 01-architecture.md §5

━━ CÁC BƯỚC THỰC HIỆN ━━
1. NestJS 10 + TypeORM + class-validator
2. Health check controller
3. Global validation pipe + exception filter

━━ ĐẦU RA (Deliverable) ━━
• GET /health trả 200

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] /health chạy
[ ] Env đọc được

━━ PHỤ THUỘC ━━
T001

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T005 — PostgreSQL schema + TypeORM config
+ **Phase**: Foundation (Week 1-3) · Critical · Owner Dev1 · ~2 ngày · Deps: T004
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T005 — PostgreSQL schema + TypeORM config (Phase Foundation, Week 1-3, Critical, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T004
• 04-database-schema.md (DDL chuẩn)

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Cấu hình DataSource + env DB
2. Migration framework TypeORM
3. Migration 001 tạo base tables

━━ ĐẦU RA (Deliverable) ━━
• DB kết nối + migration chạy

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Migration chạy trên DB sạch
[ ] Table base tồn tại

━━ PHỤ THUỘC ━━
T004

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T006 — Redis + BullMQ
+ **Phase**: Foundation (Week 1-3) · Critical · Owner Dev1 · ~1 ngày · Deps: T004
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T006 — Redis + BullMQ (Phase Foundation, Week 1-3, Critical, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T004
• 01-architecture.md (worker)

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Cấu hình Redis client
2. BullMQ queue + job test

━━ ĐẦU RA (Deliverable) ━━
• Queue chạy job test thành công

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Enqueue → process log ra

━━ PHỤ THUỘC ━━
T004

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T007 — Worker process
+ **Phase**: Foundation (Week 1-3) · Critical · Owner Dev1 · ~1 ngày · Deps: T006
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T007 — Worker process (Phase Foundation, Week 1-3, Critical, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T006

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Tạo worker/ đọc queue
2. Xử lý job, log + error

━━ ĐẦU RA (Deliverable) ━━
• Worker consume job

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Worker nhận job từ api

━━ PHỤ THUỘC ━━
T006

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T008 — Debian package skeleton
+ **Phase**: Foundation (Week 1-3) · Critical · Owner Dev1 · ~2 ngày · Deps: T001
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T008 — Debian package skeleton (Phase Foundation, Week 1-3, Critical, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• 01-architecture.md §3 infra
• 06-deployment/installation-guide

━━ CÁC BƯỚC THỰC HIỆN ━━
1. infra/debian: DEBIAN/control, postinst, prerm
2. Lệnh build dpkg-deb

━━ ĐẦU RA (Deliverable) ━━
• Build tạo .deb cấu trúc đúng

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] dpkg -i cài được gói rỗng

━━ PHỤ THUỘC ━━
T001

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T009 — Installation wizard (lms-setup)
+ **Phase**: Foundation (Week 1-3) · Critical · Owner Dev1 · ~2 ngày · Deps: T008
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T009 — Installation wizard (lms-setup) (Phase Foundation, Week 1-3, Critical, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T008
• 06-deployment/installation-guide.md

━━ CÁC BƯỚC THỰC HIỆN ━━
1. CLI interactive: DB creds, admin, org
2. Ghi api.env
3. Tự tạo DB + migration

━━ ĐẦU RA (Deliverable) ━━
• sudo lms-setup wizard hoàn tất

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Wizard đủ bước
[ ] Cấu hình sinh đúng

━━ PHỤ THUỘC ━━
T008

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T010 — Systemd service units
+ **Phase**: Foundation (Week 1-3) · Critical · Owner Dev1 · ~1 ngày · Deps: T009
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T010 — Systemd service units (Phase Foundation, Week 1-3, Critical, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T009

━━ CÁC BƯỚC THỰC HIỆN ━━
1. lms-web/lms-api/lms-worker.service
2. Enable + start

━━ ĐẦU RA (Deliverable) ━━
• 3 services systemd

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] systemctl status: 3 active

━━ PHỤ THUỘC ━━
T009

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T011 — LicenseService STUB
+ **Phase**: Auth (Week 4-5) · Critical · Owner Dev1 · ~0.5 ngày · Deps: —
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T011 — LicenseService STUB (Phase Auth, Week 4-5, Critical, owner Dev1, ~0.5 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• 02-spec.md US0
• 01-architecture.md §5.2 (D9)

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Tạo packages/license-core stub
2. Trả license mặc định (module enabled)
3. Giữ interface

━━ ĐẦU RA (Deliverable) ━━
• LicenseService stub trả license mặc định

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Không enforce constraint
[ ] Mọi module enabled
[ ] Không cần kích hoạt

━━ PHỤ THUỘC ━━
Không có

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T012 — Bảng license RESERVED
+ **Phase**: Auth (Week 4-5) · Critical · Owner Dev1 · ~1 ngày · Deps: T005
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T012 — Bảng license RESERVED (Phase Auth, Week 4-5, Critical, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• 04-database-schema.md §5

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Migration tạo licenses/addon_licenses/module_states/feature_flags
2. Không seed

━━ ĐẦU RA (Deliverable) ━━
• Bảng tạo nhưng trống

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Bảng tồn tại, không seed
[ ] Schema khớp 04

━━ PHỤ THUỘC ━━
T005

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T013 — Contract /license/* FUTURE
+ **Phase**: Auth (Week 4-5) · Critical · Owner Dev1 · ~0.5 ngày · Deps: T005
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T013 — Contract /license/* FUTURE (Phase Auth, Week 4-5, Critical, owner Dev1, ~0.5 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• 05-api/api-spec.yaml
• 02-spec.md US0

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Đảm bảo OpenAPI giữ /license/* đánh dấu FUTURE
2. Không hiện UI sản xuất

━━ ĐẦU RA (Deliverable) ━━
• Contract license giữ, đánh dấu FUTURE

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] OpenAPI parse OK
[ ] Không route hoạt động ở prod

━━ PHỤ THUỘC ━━
T005

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T015 — License status UI
+ **Phase**: Auth (Week 4-5) · Critical · Owner Dev2 · ~1 ngày · Deps: T013
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T015 — License status UI (Phase Auth, Week 4-5, Critical, owner Dev2, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T013
• 02-spec.md US0

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Trang /settings/license
2. Hiển thị Default (dev/evaluation)
3. Nút kết nối (disabled)

━━ ĐẦU RA (Deliverable) ━━
• Trang license

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Hiển thị đúng status
[ ] Nút FUTURE disabled

━━ PHỤ THUỘC ━━
T013

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T016 — User entity + auth module
+ **Phase**: Auth (Week 4-5) · Critical · Owner Dev1 · ~2 ngày · Deps: T005
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T016 — User entity + auth module (Phase Auth, Week 4-5, Critical, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T005
• 03-data-model.md (User)

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Entity users (email,password_hash,full_name,status)
2. bcrypt hash
3. Service create/find

━━ ĐẦU RA (Deliverable) ━━
• users table + service

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] CRUD user
[ ] Password hash

━━ PHỤ THUỘC ━━
T005

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T017 — JWT authentication
+ **Phase**: Auth (Week 4-5) · Critical · Owner Dev1 · ~2 ngày · Deps: T016
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T017 — JWT authentication (Phase Auth, Week 4-5, Critical, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T016
• 07-operations/security-checklist (JWT)

━━ CÁC BƯỚC THỰC HIỆN ━━
1. POST /api/auth/login
2. Sinh access 15m + refresh 7d (HTTP-only)
3. Refresh logic

━━ ĐẦU RA (Deliverable) ━━
• Login trả {access_token,refresh_token,user}

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Login đúng/sai
[ ] Refresh đổi token

━━ PHỤ THUỘC ━━
T016

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T018 — Authorization guards
+ **Phase**: Auth (Week 4-5) · Critical · Owner Dev1 · ~2 ngày · Deps: T017
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T018 — Authorization guards (Phase Auth, Week 4-5, Critical, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T017
• 02-spec.md FR-005

━━ CÁC BƯỚC THỰC HIỆN ━━
1. @RequireRole, @RequirePermission
2. Guard kiểm JWT claim

━━ ĐẦU RA (Deliverable) ━━
• Guards chạy

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] 403 khi thiếu quyền
[ ] JWT validate

━━ PHỤ THUỘC ━━
T017

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T019 — Login page
+ **Phase**: Auth (Week 4-5) · High · Owner Dev2 · ~1 ngày · Deps: T017
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T019 — Login page (Phase Auth, Week 4-5, High, owner Dev2, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T017
• 13-mockups/01-login-license.html

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Trang /login (email/password)
2. Remember me, forgot link

━━ ĐẦU RA (Deliverable) ━━
• Trang login hoạt động

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Login đúng
[ ] Validate form

━━ PHỤ THUỘC ━━
T017

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T020 — Auth state management
+ **Phase**: Auth (Week 4-5) · High · Owner Dev2 · ~1 ngày · Deps: T019
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T020 — Auth state management (Phase Auth, Week 4-5, High, owner Dev2, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T019

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Zustand store auth + token refresh
2. useAuth() hook

━━ ĐẦU RA (Deliverable) ━━
• Store + hook

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Token lưu, refresh tự động

━━ PHỤ THUỘC ━━
T019

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T021 — ProLayout configuration
+ **Phase**: Core UI (Week 6-7) · High · Owner Dev2 · ~2 ngày · Deps: T003
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T021 — ProLayout configuration (Phase Core UI, Week 6-7, High, owner Dev2, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T003

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Responsive sidebar/header/content
2. Collapse + mobile drawer

━━ ĐẦU RA (Deliverable) ━━
• Layout responsive

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Mobile drawer hoạt động

━━ PHỤ THUỘC ━━
T003

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T022 — Menu config
+ **Phase**: Core UI (Week 6-7) · High · Owner Dev2 · ~1 ngày · Deps: T021
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T022 — Menu config (Phase Core UI, Week 6-7, High, owner Dev2, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T021
• 02-spec.md roles

━━ CÁC BƯỚC THỰC HIỆN ━━
1. src/config/menu.config.ts theo role

━━ ĐẦU RA (Deliverable) ━━
• File config menu

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Menu theo role hiển thị đúng

━━ PHỤ THUỘC ━━
T021

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T023 — Role-based menu render
+ **Phase**: Core UI (Week 6-7) · High · Owner Dev2 · ~1 ngày · Deps: T022
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T023 — Role-based menu render (Phase Core UI, Week 6-7, High, owner Dev2, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T022

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Render menu theo quyền
2. Ẩn menu ngoài quyền

━━ ĐẦU RA (Deliverable) ━━
• Menu lọc theo role

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Ẩn menu không quyền

━━ PHỤ THUỘC ━━
T022

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T024 — Common components
+ **Phase**: Core UI (Week 6-7) · High · Owner Dev2 · ~3 ngày · Deps: T021
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T024 — Common components (Phase Core UI, Week 6-7, High, owner Dev2, ~3 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T021

━━ CÁC BƯỚC THỰC HIỆN ━━
1. PageHeader, DataTable, FormBuilder, ErrorBoundary
2. src/components/common/

━━ ĐẦU RA (Deliverable) ━━
• 4 components dùng chung

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Dùng được trong ≥1 trang

━━ PHỤ THUỘC ━━
T021

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T025 — i18n vi/en
+ **Phase**: Core UI (Week 6-7) · High · Owner Dev2 · ~1 ngày · Deps: T003
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T025 — i18n vi/en (Phase Core UI, Week 6-7, High, owner Dev2, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T003
• D8

━━ CÁC BƯỚC THỰC HIỆN ━━
1. react-i18next + language switcher
2. vi-VN.json, en-US.json

━━ ĐẦU RA (Deliverable) ━━
• Switcher + file dịch

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Đổi ngôn ngữ giữa trang

━━ PHỤ THUỘC ━━
T003

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T026 — Theme configuration
+ **Phase**: Core UI (Week 6-7) · High · Owner Dev2 · ~1 ngày · Deps: T003
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T026 — Theme configuration (Phase Core UI, Week 6-7, High, owner Dev2, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T003

━━ CÁC BƯỚC THỰC HIỆN ━━
1. ConfigProvider theme tokens
2. Primary color, dark mode

━━ ĐẦU RA (Deliverable) ━━
• Theme + dark toggle

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Dark mode lưu localStorage

━━ PHỤ THUỘC ━━
T003

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T027 — Organization entity
+ **Phase**: Org & Users (Week 8-9) · High · Owner Dev1 · ~1 ngày · Deps: T005
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T027 — Organization entity (Phase Org & Users, Week 8-9, High, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T005
• 03-data-model.md Organization

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Entity organizations (name,timezone,settings jsonb)
2. CRUD service

━━ ĐẦU RA (Deliverable) ━━
• organizations table + service

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] CRUD hoạt động

━━ PHỤ THUỘC ━━
T005

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T028 — Branch entity
+ **Phase**: Org & Users (Week 8-9) · High · Owner Dev1 · ~1 ngày · Deps: T027
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T028 — Branch entity (Phase Org & Users, Week 8-9, High, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T027
• 03-data-model.md Branch

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Entity branches (org_id,code,name,address,manager,status)
2. CRUD service

━━ ĐẦU RA (Deliverable) ━━
• branches table + service

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] CRUD, code unique trong org

━━ PHỤ THUỘC ━━
T027

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T029 — Org & Branch API
+ **Phase**: Org & Users (Week 8-9) · High · Owner Dev1 · ~2 ngày · Deps: T027, T028
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T029 — Org & Branch API (Phase Org & Users, Week 8-9, High, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T027
• T028
• 05-api/api-spec.yaml

━━ CÁC BƯỚC THỰC HIỆN ━━
1. GET/PUT /api/organization
2. GET/POST/PUT /api/branches
3. Admin only

━━ ĐẦU RA (Deliverable) ━━
• API org/branches

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Auth admin chặn đúng

━━ PHỤ THUỘC ━━
T027, T028

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T030 — Org settings page
+ **Phase**: Org & Users (Week 8-9) · High · Owner Dev2 · ~2 ngày · Deps: T029
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T030 — Org settings page (Phase Org & Users, Week 8-9, High, owner Dev2, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T029

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Form /settings/organization (name,timezone,academic_year)

━━ ĐẦU RA (Deliverable) ━━
• Trang cấu hình org

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Lưu đổi hiển thị

━━ PHỤ THUỘC ━━
T029

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T031 — Branch management page
+ **Phase**: Org & Users (Week 8-9) · High · Owner Dev2 · ~2 ngày · Deps: T029
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T031 — Branch management page (Phase Org & Users, Week 8-9, High, owner Dev2, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T029
• 13-mockups/02-admin-dashboard

━━ CÁC BƯỚC THỰC HIỆN ━━
1. List/add/edit/archive branch
2. ProTable search

━━ ĐẦU RA (Deliverable) ━━
• Trang /settings/branches

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] CRUD branch từ UI

━━ PHỤ THUỘC ━━
T029

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T032 — Role & Permission entities
+ **Phase**: Org & Users (Week 8-9) · High · Owner Dev1 · ~2 ngày · Deps: T016
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T032 — Role & Permission entities (Phase Org & Users, Week 8-9, High, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T016
• 03-data-model.md Role/Permission

━━ CÁC BƯỚC THỰC HIỆN ━━
1. roles, permissions, role_permissions
2. Many-to-many

━━ ĐẦU RA (Deliverable) ━━
• Bảng + quan hệ

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Seed role mặc định

━━ PHỤ THUỘC ━━
T016

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T033 — ScopeGrant entity
+ **Phase**: Org & Users (Week 8-9) · High · Owner Dev1 · ~1 ngày · Deps: T032
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T033 — ScopeGrant entity (Phase Org & Users, Week 8-9, High, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T032
• 03-data-model.md ScopeGrant

━━ CÁC BƯỚC THỰC HIỆN ━━
1. scope_grants (user,branch,effective_from,effective_to)

━━ ĐẦU RA (Deliverable) ━━
• Bảng scope_grants

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Hết hạn tự thu hồi

━━ PHỤ THUỘC ━━
T032

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T034 — Branch scope filtering
+ **Phase**: Org & Users (Week 8-9) · High · Owner Dev1 · ~2 ngày · Deps: T033
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T034 — Branch scope filtering (Phase Org & Users, Week 8-9, High, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T033
• 02-spec.md FR-004

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Repository base auto filter theo branch
2. Áp mọi query

━━ ĐẦU RA (Deliverable) ━━
• Auto branch filter

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] User chỉ thấy branch được cấp

━━ PHỤ THUỘC ━━
T033

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T035 — User & Role API
+ **Phase**: Org & Users (Week 8-9) · High · Owner Dev1 · ~2 ngày · Deps: T032, T033
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T035 — User & Role API (Phase Org & Users, Week 8-9, High, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T032
• T033

━━ CÁC BƯỚC THỰC HIỆN ━━
1. /api/users, /api/roles CRUD
2. Assign roles, grant scope

━━ ĐẦU RA (Deliverable) ━━
• API users/roles

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Assign + scope hoạt động

━━ PHỤ THUỘC ━━
T032, T033

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T036 — User management page
+ **Phase**: Org & Users (Week 8-9) · High · Owner Dev2 · ~3 ngày · Deps: T035
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T036 — User management page (Phase Org & Users, Week 8-9, High, owner Dev2, ~3 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T035
• 13-mockups/03-users-roles

━━ CÁC BƯỚC THỰC HIỆN ━━
1. List/add/edit user, assign role
2. /settings/users ProTable + modal

━━ ĐẦU RA (Deliverable) ━━
• Trang quản lý user

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] CRUD user + gán role

━━ PHỤ THUỘC ━━
T035

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T037 — Role management page
+ **Phase**: Org & Users (Week 8-9) · High · Owner Dev2 · ~2 ngày · Deps: T035
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T037 — Role management page (Phase Org & Users, Week 8-9, High, owner Dev2, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T035

━━ CÁC BƯỚC THỰC HIỆN ━━
1. /settings/roles list + edit permissions
2. Permission tree

━━ ĐẦU RA (Deliverable) ━━
• Trang quản lý role

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Edit permission tree lưu

━━ PHỤ THUỘC ━━
T035

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T038 — Academic entities
+ **Phase**: Academic (Week 10-12) · High · Owner Dev1 · ~3 ngày · Deps: T005
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T038 — Academic entities (Phase Academic, Week 10-12, High, owner Dev1, ~3 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T005
• 03-data-model.md Academic

━━ CÁC BƯỚC THỰC HIỆN ━━
1. departments, programs, courses, classes
2. Quan hệ dept→program→course→class

━━ ĐẦU RA (Deliverable) ━━
• 4 bảng + quan hệ

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] CRUD cơ bản

━━ PHỤ THUỘC ━━
T005

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T039 — Schedule conflict detection
+ **Phase**: Academic (Week 10-12) · High · Owner Dev1 · ~2 ngày · Deps: T038
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T039 — Schedule conflict detection (Phase Academic, Week 10-12, High, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T038
• 02-spec.md FR-008

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Service kiểm teacher/room trùng
2. Query overlapping time

━━ ĐẦU RA (Deliverable) ━━
• Service chống trùng lịch

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Chặn trùng teacher/room/time

━━ PHỤ THUỘC ━━
T038

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T040 — Academic CRUD API
+ **Phase**: Academic (Week 10-12) · High · Owner Dev1 · ~3 ngày · Deps: T038, T039
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T040 — Academic CRUD API (Phase Academic, Week 10-12, High, owner Dev1, ~3 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T038
• T039
• 05-api/api-spec.yaml

━━ CÁC BƯỚC THỰC HIỆN ━━
1. /api/departments, /programs, /courses, /classes
2. Branch-scoped

━━ ĐẦU RA (Deliverable) ━━
• API academic

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Branch-scope enforce

━━ PHỤ THUỘC ━━
T038, T039

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T041 — Dept & Program mgmt
+ **Phase**: Academic (Week 10-12) · High · Owner Dev2 · ~2 ngày · Deps: T040
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T041 — Dept & Program mgmt (Phase Academic, Week 10-12, High, owner Dev2, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T040

━━ CÁC BƯỚC THỰC HIỆN ━━
1. CRUD /academic/departments, /academic/programs

━━ ĐẦU RA (Deliverable) ━━
• Trang dept + program

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] CRUD từ UI

━━ PHỤ THUỘC ━━
T040

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T042 — Course management
+ **Phase**: Academic (Week 10-12) · High · Owner Dev2 · ~2 ngày · Deps: T040
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T042 — Course management (Phase Academic, Week 10-12, High, owner Dev2, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T040

━━ CÁC BƯỚC THỰC HIỆN ━━
1. List + form course, link program

━━ ĐẦU RA (Deliverable) ━━
• Trang /academic/courses

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] CRUD course

━━ PHỤ THUỘC ━━
T040

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T043 — Class management
+ **Phase**: Academic (Week 10-12) · High · Owner Dev2 · ~3 ngày · Deps: T040
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T043 — Class management (Phase Academic, Week 10-12, High, owner Dev2, ~3 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T040

━━ CÁC BƯỚC THỰC HIỆN ━━
1. List class, create form, assign teacher
2. Schedule picker, capacity, teacher selector

━━ ĐẦU RA (Deliverable) ━━
• Trang /academic/classes

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] CRUD class + assign teacher

━━ PHỤ THUỘC ━━
T040

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T044 — Student entity
+ **Phase**: Academic (Week 10-12) · High · Owner Dev1 · ~1 ngày · Deps: T005
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T044 — Student entity (Phase Academic, Week 10-12, High, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T005
• 03-data-model.md Student

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Entity students (full_name,dob,email,phone,status)
2. CRUD service

━━ ĐẦU RA (Deliverable) ━━
• students table + service

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] CRUD hoạt động

━━ PHỤ THUỘC ━━
T005

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T045 — Enrollment entity
+ **Phase**: Academic (Week 10-12) · High · Owner Dev1 · ~2 ngày · Deps: T044, T038
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T045 — Enrollment entity (Phase Academic, Week 10-12, High, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T044
• T038
• 03-data-model.md Enrollment

━━ CÁC BƯỚC THỰC HIỆN ━━
1. enrollments table
2. Check capacity, tạo invoice

━━ ĐẦU RA (Deliverable) ━━
• enrollments table + service

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Check capacity + tạo invoice

━━ PHỤ THUỘC ━━
T044, T038

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T046 — Enrollment API
+ **Phase**: Academic (Week 10-12) · High · Owner Dev1 · ~2 ngày · Deps: T045
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T046 — Enrollment API (Phase Academic, Week 10-12, High, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T045

━━ CÁC BƯỚC THỰC HIỆN ━━
1. POST /api/enrollments, GET /api/students/:id/enrollments
2. Branch-scoped

━━ ĐẦU RA (Deliverable) ━━
• API enrollments

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Branch-scoped enforce

━━ PHỤ THUỘC ━━
T045

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T047 — Student mgmt page
+ **Phase**: Academic (Week 10-12) · High · Owner Dev2 · ~3 ngày · Deps: T044, T046
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T047 — Student mgmt page (Phase Academic, Week 10-12, High, owner Dev2, ~3 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T044
• T046

━━ CÁC BƯỚC THỰC HIỆN ━━
1. List/add/edit student, xem enrollments
2. /academic/students ProTable search

━━ ĐẦU RA (Deliverable) ━━
• Trang quản lý student

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] CRUD student + xem enrollments

━━ PHỤ THUỘC ━━
T044, T046

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T048 — Enrollment workflow
+ **Phase**: Academic (Week 10-12) · High · Owner Dev2 · ~2 ngày · Deps: T046
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T048 — Enrollment workflow (Phase Academic, Week 10-12, High, owner Dev2, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T046

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Enroll modal, class selector, confirmation
2. Student detail → Enrollments tab

━━ ĐẦU RA (Deliverable) ━━
• Luồng ghi danh

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Enroll thành công + invoice

━━ PHỤ THUỘC ━━
T046

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T049 — LearningContent entity
+ **Phase**: Learning (Week 13) · High · Owner Dev1 · ~1 ngày · Deps: T005
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T049 — LearningContent entity (Phase Learning, Week 13, High, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T005
• 03-data-model.md Learning

━━ CÁC BƯỚC THỰC HIỆN ━━
1. learning_contents (title,type,file_path,access_scope,class_id)

━━ ĐẦU RA (Deliverable) ━━
• learning_contents table

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Bảng tồn tại

━━ PHỤ THUỘC ━━
T005

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T050 — Content upload/storage
+ **Phase**: Learning (Week 13) · High · Owner Dev1 · ~2 ngày · Deps: T049
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T050 — Content upload/storage (Phase Learning, Week 13, High, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T049
• 07-operations (file upload)

━━ CÁC BƯỚC THỰC HIỆN ━━
1. POST /api/learning-contents/upload
2. Lưu local /var/lms/uploads
3. Virus scan, giới hạn 500MB

━━ ĐẦU RA (Deliverable) ━━
• Upload hoạt động

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Upload + scan + limit

━━ PHỤ THUỘC ━━
T049

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T051 — Content authorization
+ **Phase**: Learning (Week 13) · High · Owner Dev1 · ~1 ngày · Deps: T050
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T051 — Content authorization (Phase Learning, Week 13, High, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T050
• 02-spec.md FR-013

━━ CÁC BƯỚC THỰC HIỆN ━━
1. GET download với auth check
2. Access: enrolled class hoặc public

━━ ĐẦU RA (Deliverable) ━━
• Download có auth

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Chặn người không có quyền

━━ PHỤ THUỘC ━━
T050

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T052 — Content mgmt (teacher)
+ **Phase**: Learning (Week 13) · High · Owner Dev2 · ~2 ngày · Deps: T050
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T052 — Content mgmt (teacher) (Phase Learning, Week 13, High, owner Dev2, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T050

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Upload content, set scope, assign class
2. /learning/contents

━━ ĐẦU RA (Deliverable) ━━
• Trang quản lý content

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Upload + assign class

━━ PHỤ THUỘC ━━
T050

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T053 — Student dashboard
+ **Phase**: Learning (Week 13) · High · Owner Dev2 · ~2 ngày · Deps: T046, T051
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T053 — Student dashboard (Phase Learning, Week 13, High, owner Dev2, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T046
• T051

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Dashboard: enrolled classes, progress
2. /student/dashboard

━━ ĐẦU RA (Deliverable) ━━
• Student dashboard

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Hiển thị class + progress

━━ PHỤ THUỘC ━━
T046, T051

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T054 — Student class detail
+ **Phase**: Learning (Week 13) · High · Owner Dev2 · ~2 ngày · Deps: T053
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T054 — Student class detail (Phase Learning, Week 13, High, owner Dev2, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T053

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Xem class info, schedule, materials
2. /student/classes/:id

━━ ĐẦU RA (Deliverable) ━━
• Trang class detail

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Hiển thị đúng

━━ PHỤ THUỘC ━━
T053

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T055 — Library page
+ **Phase**: Learning (Week 13) · High · Owner Dev2 · ~1 ngày · Deps: T051
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T055 — Library page (Phase Learning, Week 13, High, owner Dev2, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T051

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Browse/search contents
2. /learning/library, filter category

━━ ĐẦU RA (Deliverable) ━━
• Trang library

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Search + filter hoạt động

━━ PHỤ THUỘC ━━
T051

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T056 — Invoice entity
+ **Phase**: Finance (Week 14-15) · High · Owner Dev1 · ~1 ngày · Deps: T005
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T056 — Invoice entity (Phase Finance, Week 14-15, High, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T005
• 03-data-model.md Finance

━━ CÁC BƯỚC THỰC HIỆN ━━
1. invoices (student_id,enrollment_id,amount_total,amount_paid,status)

━━ ĐẦU RA (Deliverable) ━━
• invoices table

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Bảng tồn tại

━━ PHỤ THUỘC ━━
T005

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T057 — Auto-create invoice on enrollment
+ **Phase**: Finance (Week 14-15) · High · Owner Dev1 · ~1 ngày · Deps: T056, T045
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T057 — Auto-create invoice on enrollment (Phase Finance, Week 14-15, High, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T056
• T045

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Enrollment tạo invoice tự động
2. Get fee từ program, link enrollment

━━ ĐẦU RA (Deliverable) ━━
• Invoice tự sinh

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Ghi danh → invoice

━━ PHỤ THUỘC ━━
T056, T045

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T058 — PaymentTransaction entity
+ **Phase**: Finance (Week 14-15) · High · Owner Dev1 · ~1 ngày · Deps: T056
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T058 — PaymentTransaction entity (Phase Finance, Week 14-15, High, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T056

━━ CÁC BƯỚC THỰC HIỆN ━━
1. payment_transactions (invoice_id,amount,method,provider,status,idempotency_key)

━━ ĐẦU RA (Deliverable) ━━
• Bảng payment_transactions

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Bảng tồn tại

━━ PHỤ THUỘC ━━
T056

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T059 — Manual payment recording
+ **Phase**: Finance (Week 14-15) · High · Owner Dev1 · ~1 ngày · Deps: T058
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T059 — Manual payment recording (Phase Finance, Week 14-15, High, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T058

━━ CÁC BƯỚC THỰC HIỆN ━━
1. POST /api/payments/record (cash/bank)
2. Cập nhật balance, sinh receipt

━━ ĐẦU RA (Deliverable) ━━
• Ghi nhận thanh toán

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Cập nhật invoice đúng

━━ PHỤ THUỘC ━━
T058

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T060 — Payment gateway plugin arch
+ **Phase**: Finance (Week 14-15) · High · Owner Dev1 · ~2 ngày · Deps: T058
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T060 — Payment gateway plugin arch (Phase Finance, Week 14-15, High, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T058
• 01-architecture.md §5 integrations

━━ CÁC BƯỚC THỰC HIỆN ━━
1. PaymentGatewayInterface, VNPayAdapter skeleton
2. generatePaymentUrl(), validateWebhook()

━━ ĐẦU RA (Deliverable) ━━
• Plugin architecture + skeleton

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Interface ổn định

━━ PHỤ THUỘC ━━
T058

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T061 — VNPay integration
+ **Phase**: Finance (Week 14-15) · High · Owner Dev1 · ~3 ngày · Deps: T060
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T061 — VNPay integration (Phase Finance, Week 14-15, High, owner Dev1, ~3 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T060
• 02-spec.md FR-010

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Generate URL → pay → webhook → update invoice

━━ ĐẦU RA (Deliverable) ━━
• VNPay flow E2E

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Thanh toán VNPay hoàn tất

━━ PHỤ THUỘC ━━
T060

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T062 — Webhook idempotency
+ **Phase**: Finance (Week 14-15) · High · Owner Dev1 · ~1 ngày · Deps: T061
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T062 — Webhook idempotency (Phase Finance, Week 14-15, High, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T061
• 02-spec.md FR-011

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Duplicate webhook không double-pay
2. Check idempotency_key

━━ ĐẦU RA (Deliverable) ━━
• Idempotent xử lý webhook

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Trùng webhook trả 200

━━ PHỤ THUỘC ━━
T061

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T063 — Receipt generation (PDF)
+ **Phase**: Finance (Week 14-15) · High · Owner Dev1 · ~2 ngày · Deps: T059
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T063 — Receipt generation (PDF) (Phase Finance, Week 14-15, High, owner Dev1, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T059

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Tạo PDF receipt từ invoice
2. pdfkit

━━ ĐẦU RA (Deliverable) ━━
• Receipt PDF

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] PDF tải được

━━ PHỤ THUỘC ━━
T059

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T064 — Invoice mgmt page
+ **Phase**: Finance (Week 14-15) · High · Owner Dev2 · ~2 ngày · Deps: T056
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T064 — Invoice mgmt page (Phase Finance, Week 14-15, High, owner Dev2, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T056

━━ CÁC BƯỚC THỰC HIỆN ━━
1. List invoices, filter status/branch
2. /finance/invoices

━━ ĐẦU RA (Deliverable) ━━
• Trang invoice

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Filter hoạt động

━━ PHỤ THUỘC ━━
T056

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T065 — Payment recording UI
+ **Phase**: Finance (Week 14-15) · High · Owner Dev2 · ~2 ngày · Deps: T059
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T065 — Payment recording UI (Phase Finance, Week 14-15, High, owner Dev2, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T059

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Record cash/bank, upload proof
2. Invoice detail

━━ ĐẦU RA (Deliverable) ━━
• UI ghi nhận thanh toán

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Ghi nhận đúng

━━ PHỤ THUỘC ━━
T059

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T066 — Payment link generation
+ **Phase**: Finance (Week 14-15) · High · Owner Dev2 · ~1 ngày · Deps: T061
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T066 — Payment link generation (Phase Finance, Week 14-15, High, owner Dev2, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T061

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Button gen VNPay link, copy
2. Invoice detail

━━ ĐẦU RA (Deliverable) ━━
• Sinh link thanh toán

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Link copy được

━━ PHỤ THUỘC ━━
T061

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T067 — Financial reports
+ **Phase**: Finance (Week 14-15) · High · Owner Dev2 · ~2 ngày · Deps: T064
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T067 — Financial reports (Phase Finance, Week 14-15, High, owner Dev2, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T064

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Revenue by branch/month, receivables
2. Date picker, branch filter, export Excel

━━ ĐẦU RA (Deliverable) ━━
• Trang /finance/reports

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Filter + export Excel

━━ PHỤ THUỘC ━━
T064

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T068 — Unit tests
+ **Phase**: Test & Polish (Week 16) · Critical · Owner Both · ~2 ngày · Deps: T045, T059
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T068 — Unit tests (Phase Test & Polish, Week 16, Critical, owner Both, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T045
• T059

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Unit test LicenseService(stub), EnrollmentService, PaymentService
2. ≥80% coverage business logic

━━ ĐẦU RA (Deliverable) ━━
• Suite unit test

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Test pass, coverage ≥80%

━━ PHỤ THUỘC ━━
T045, T059

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T069 — Integration tests
+ **Phase**: Test & Polish (Week 16) · Critical · Owner Both · ~2 ngày · Deps: T068
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T069 — Integration tests (Phase Test & Polish, Week 16, Critical, owner Both, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T068
• 02-spec.md workflows

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Enrollment flow, payment flow, branch scope isolation
2. Vitest + testcontainers PostgreSQL

━━ ĐẦU RA (Deliverable) ━━
• Integration tests

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Test pass trên DB thật

━━ PHỤ THUỘC ━━
T068

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T070 — E2E tests
+ **Phase**: Test & Polish (Week 16) · Critical · Owner Both · ~2 ngày · Deps: T069
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T070 — E2E tests (Phase Test & Polish, Week 16, Critical, owner Both, ~2 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T069
• Playwright

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Login, create class, enroll, record payment
2. Playwright

━━ ĐẦU RA (Deliverable) ━━
• E2E tests

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] E2E pass

━━ PHỤ THUỘC ━━
T069

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T071 — Security audit
+ **Phase**: Test & Polish (Week 16) · Critical · Owner Dev1 · ~1 ngày · Deps: T005
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T071 — Security audit (Phase Test & Polish, Week 16, Critical, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• 07-operations/security-checklist.md

━━ CÁC BƯỚC THỰC HIỆN ━━
1. SQL injection, XSS, CSRF, auth bypass
2. OWASP ZAP + manual

━━ ĐẦU RA (Deliverable) ━━
• Kết quả audit

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Không lỗi nghiêm trọng

━━ PHỤ THUỘC ━━
T005

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T072 — Installation guide
+ **Phase**: Test & Polish (Week 16) · High · Owner Dev1 · ~1 ngày · Deps: T009
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T072 — Installation guide (Phase Test & Polish, Week 16, High, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T009
• 06-deployment/installation-guide.md

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Cập nhật hướng dẫn cài Ubuntu 22.04
2. Khớp quy trình thực tế

━━ ĐẦU RA (Deliverable) ━━
• 06-deployment/installation-guide.md

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Người mới cài theo được

━━ PHỤ THUỘC ━━
T009

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T073 — User manual
+ **Phase**: Test & Polish (Week 16) · High · Owner Dev2 · ~1 ngày · Deps: T047, T052
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T073 — User manual (Phase Test & Polish, Week 16, High, owner Dev2, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T047
• T052

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Screenshot + hướng dẫn từng module

━━ ĐẦU RA (Deliverable) ━━
• docs/user-manual.md

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Phủ các module MVP

━━ PHỤ THUỘC ━━
T047, T052

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T074 — API documentation
+ **Phase**: Test & Polish (Week 16) · High · Owner Dev1 · ~1 ngày · Deps: T005
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T074 — API documentation (Phase Test & Polish, Week 16, High, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• 05-api/api-spec.yaml
• Swagger

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Export OpenAPI từ Swagger
2. Đảm bảo khớp chuẩn

━━ ĐẦU RA (Deliverable) ━━
• 05-api/api-spec.yaml

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] OpenAPI validate OK

━━ PHỤ THUỘC ━━
T005

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T075 — Build final .deb
+ **Phase**: Test & Polish (Week 16) · Critical · Owner Dev1 · ~1 ngày · Deps: T009, T010, T074
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T075 — Build final .deb (Phase Test & Polish, Week 16, Critical, owner Dev1, ~1 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T009
• T010

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Build lms-base-v1.0.0.deb
2. Test trên Ubuntu sạch

━━ ĐẦU RA (Deliverable) ━━
• lms-base-v1.0.0.deb

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Cài thành công trên Ubuntu sạch

━━ PHỤ THUỘC ━━
T009, T010, T074

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---

## T076 — Kiểm tra license mặc định (D9)
+ **Phase**: Test & Polish (Week 16) · High · Owner Dev1 · ~0.5 ngày · Deps: T075
+ **Trạng thái**: [ ] Chưa · [ ] Đang · [ ] Xong · [ ] Chặn

### PROMPT_CONTEXT

```
BẠN là lập trình viên thực hiện task T076 — Kiểm tra license mặc định (D9) (Phase Test & Polish, Week 16, High, owner Dev1, ~0.5 ngày) của EduCenter LMS.

━━ PROMPT_CONTEXT ━━
DỰ ÁN: EduCenter LMS — Hệ thống quản lý học tập on-premise đa chi nhánh cho trung tâm đào tạo tư nhân tại Việt Nam.
STACK: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7 (BullMQ) · Nginx + systemd + gói .deb. KHÔNG Docker.
MVP: 16 tuần / 2 dev (Dev1=backend/DevOps, Dev2=frontend). Phạm vi: Core + Academic + Learning + Finance. Không AI, không hybrid.
QUYẾT ĐỊNH (D9, 2026-08-26): Hệ thống quản lý license CHƯA triển khai — LMS chạy license MẶC ĐỊNH (dev/evaluation), LicenseService là STUB trả mọi module enabled, không cần kích hoạt/RSA. Bảng licenses/addon_licenses/module_states/feature_flags tạo nhưng RESERVED. Endpoint /license/* là FUTURE (điểm chờ kết nối hệ thống quản lý license sau).
NỀN TÀI LIỆU (docs/): 00-project-overview, 01-architecture (on-premise, license-core=stub), 02-spec (US0=Installation license mặc định), 03-data-model, 04-database-schema (DDL chuẩn), 05-api/api-spec.yaml (OpenAPI chuẩn), 06-deployment/*, 07-operations/security-checklist, 08-addons, 09-planning/tasks-v2.md.
QUY TẮC CODING (BẮT BUỘC): tuân thủ 14-agent-guidelines/coding-rules.md — đọc trước khi code; chỉ đổi đúng phạm vi task; không chạm docs/archive; branch-scope enforce backend; không secret trong source/log; migration chỉ tiến về trước; soft-delete/audit; i18n file json; test + DoD đủ; báo cáo file thay đổi.
QUY ƯỚC: Branch-scoped data (mọi entity gắn organization_id/branch_id). Audit append-only. Không xóa vật lý (soft delete). UUID PK. Migration TypeORM chỉ tiến về trước. i18n vi-VN mặc định + en-US. Khi làm 1 task: đọc tài liệu chuẩn liên quan rồi thực hiện, chạy test, báo DoD.
HOẠT ĐỘNG: trả lời bằng tiếng Việt (thuật ngữ kỹ thuật giữ tiếng Anh). Kết thúc mỗi task: báo file/spec thay đổi, trạng thái, xác nhận Đầu ra vs Tiêu chí nhận (DoD).

━━ MỤC TIÊU ━━
undefined

━━ ĐẦU VÀO (đọc trước) ━━
• T075
• 02-spec.md US0

━━ CÁC BƯỚC THỰC HIỆN ━━
1. Khởi động LMS, xác nhận license mặc định
2. Không cần demo license file

━━ ĐẦU RA (Deliverable) ━━
• LMS chạy với license mặc định

━━ TIÊU CHÍ NHẬN (DoD) ━━
[ ] Không yêu cầu kích hoạt

━━ PHỤ THUỘC ━━
T075

YÊU CẦU: Thực hiện đủ quy trình trong codebase. Khi xong trả về: (1) file/dir đã tạo-sửa, (2) xác nhận từng DoD (✓/✗), (3) lệnh test đã chạy + kết quả, (4) cập nhật trạng thái task. Nếu chặn, nêu blocker + điều cần quyết định.
```

---
