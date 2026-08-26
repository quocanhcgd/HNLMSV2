---
title: Workflows — Implementation Map
version: 1.0
date: 2026-08-26
tags: [workflow, implementation, mvp]
---

# 🧭 Workflow → Implementation Map

> Tài liệu này **nối các workflow nghiệp vụ (`11-workflows/WF-*`) vào hệ thống triển khai** để AI agent / dev thực thi được: entity (03-data-model), API (05-api), vai trò/quyền (02-spec, 10-roles), task (09-planning) và quy tắc coding (14-agent-guidelines).
> **Mỗi workflow nên bắt đầu từ PROMPT_CONTEXT của task liên quan** (`09-planning/task-prompts.md`) + các tài liệu chuẩn bên dưới.

---

## Cách dùng bảng này

| Cột | Nghĩa |
|---|---|
| **Scope** | `MVP` = triển khai ở giai đoạn này · `Roadmap` = post-MVP (P2/P3), chỉ thiết kế chờ |
| **Entities** | Bảng dữ liệu trong `03-data-model.md` / DDL `04-database-schema.md` |
| **API** | Endpoint trong `05-api/api-spec.yaml` |
| **Tasks** | Task MVP trong `09-planning/progress-tracker.html` (ID T0xx) |
| **Rules** | Quy tắc nghiệp vụ/bảo mật phải enforce (xem `coding-rules.md`) |

> ⚠️ **Bất biến (D9)**: license mặc định — không kích hoạt/RSA; `/license/*` FUTURE. Mọi endpoint bắt buộc **branch-scope** ở backend. Xem `coding-rules.md` §1–3.

---

## 1. WF-01 — Enrollment Journey (MVP)

- **Scope**: ✅ MVP · **Mục tiêu**: Lead → tư vấn → test → ghi danh → thanh toán → active student.
- **Entity**: `leads`*, `consultations`*, `students`, `enrollments`, `classes`, `invoices`, `invoices_lines`, `payments`, `payment_transactions`, `receipts` (*= CRM addon P2, giai đoạn này dùng ghi danh trực tiếp hoặc placeholder).
- **API** (MVP): `POST /enrollments` · `GET /students/:id/enrollments` · `POST /payments/record` · `POST /invoices` · `GET /receipts/:id/download`.
- **Vai trò**: Admission (ghi danh), Finance (thanh toán), Academic Manager (chốt class), Receptionist (walk-in).
- **Quy tắc**: check `classes.capacity` trước khi tạo enrollment · ghi danh tự tạo `invoice` (fee từ program) · payment ghi `idempotency_key` (không double-pay) · `receipts` PDF từ invoice · branch-scope filter.
- **DoD**: tạo enrollment bị chặn khi class full (waitlist) · invoice sinh tự động · 3 phương thức thanh toán ghi đúng · receipt tải được.
- **Tính liên quan**: T044–T048 (student/enroll) · T056–T066 (invoice/payment/receipt).

## 2. WF-02 — Teaching & Learning Cycle (MVP)

**Scope**: MVP · **Mục tiêu**: kế hoạch → dạy → đánh giá → phản hồi trong 1 class.
- **Entity**: `departments`, `programs`, `courses`, `classes`, `schedules`, `rooms`, `learning_content`, `content_versions`, `content_progress`, `enrollments`.
- **API**: `/classes` CRUD + schedule · `/schedules` (chống trùng lịch) · `/learning-contents` upload/download (auth, 500MB, virus-scan) · `GET /student/classes/:id`.
- **Vai trò**: Academic Manager (xếp lịch), Teacher (upload nội dung, chấm), Student (xem progress).
- **Quy tắc**: chống trùng lịch teacher/room/time (T039, FR-008) · content authorization = enrolled class hoặc public (T051) · progress append-only.
- **DoD**: xếp lịch không trùng · teacher upload + assign class · student xem đúng nội dung class được enroll.
- **Tính liên quan**: T038–T043 (academic) · T049–T055 (learning).

## 3. WF-03 — Financial Operations (MVP)

- **Scope**: MVP · **Mục tiêu**: invoice → payment → receipt, 3 phương thức (online/cash/bank), báo cáo.
- **Entity**: `invoices`, `invoices_lines`, `payments`, `payment_transactions`, `refunds`, `receipts`, `finance_entries`* (*=P2/P3).
- **API**: `POST /finance/invoices` · `POST /finance/invoices/:id/payments` · `POST /finance/refunds` · `GET /finance/receipts/:id/download` · `POST /integrations/vnpay/payment-webhooks` · `GET /finance/reports`.
- **Vai trò**: Finance Officer (ghi nhận), Accountant (đối soát), Branch Manager (xem báo cáo).
- **Quy tắc**: transaction bọc mọi ghi nhận tài chính (FR-011) · webhook **idempotent** (T-062) · `Idempotency-Key` unique ở DB · không settlement từ browser redirect · soft-delete tài chính (không xóa vật lý).
- **DoD**: ghi nhận cash/bank đúng balance · VNPay flow E2E (T-061) · duplicate webhook trả 200 · report export Excel.
- **Tính liên quan**: T056–T067.

## 4. WF-04 — HR & Payroll (ROADMAP P3 — Addon HRM)

- **Scope**: 🚧 post-MVP (P3) — **không thuộc MVP**. Chuẩn bị triển khai khi mở phase HRM; gate addon qua feature flag (license FUTURE, D9).
- **Entity** (P3 — migration addon riêng): `employees` (EmployeeProfile), `employment_contracts`, `teacher_assignments`, `work_schedules`, `attendance`, `leave_requests`, `performance_reviews`, `payroll_periods`, `payroll_lines`, `payslips`.
- **API** (đề xuất, thêm vào `05-api/api-spec.yaml` khi triển khai): `GET/POST /hrm/employees` · `GET/POST /hrm/attendance` · `POST /hrm/leave-requests` · `POST /hrm/payroll/runs` (calculate → approve → lock) · `GET /hrm/payslips/:id/download`.
- **Vai trò**: HR Manager, Payroll Officer, Branch Manager (xem), Employee (self) — xem `10-roles/`.
- **Quy tắc nghiệp vụ** (từ `03-data-model.md` §7): payroll **lock sau approve**; thay đổi sau lock tạo adjustment record (không sửa kỳ lịch sử); công thức lương **versioned**; nhân sự đa chi nhánh phân bổ rõ; chỉnh attendance sau duyệt có **audit**; payslip là dữ liệu nhạy cảm → audit + re-auth khi xem.
- **DoD (khi triển khai)**: tính lương → approve → lock đúng · payslip PDF tải được · adjust sau lock tạo record riêng · branch-scope.
- **Tasks**: chưa có trong tracker MVP — sẽ thêm khi mở phase HRM.

## 5. WF-05 — Online & Hybrid Learning (ROADMAP P2 — Addon Online Classes)

- **Scope**: 🚠 post-MVP (P2) — **không thuộc MVP**. Chuẩn bị khi mở phase Online; gate addon qua feature flag.
- **Entity**: `online_sessions` (class_id, provider, external_meeting_id, join/host reference, scheduled_at, attendance_sync_state, recording_ref, status), `meeting_events`.
- **API/Adapter**: `integrations/` meeting adapter (Zoom/Meet/Teams) theo pattern `PaymentGatewayPluginAdapter` (`01-architecture.md` §5) — `create/update/cancel meeting`, `fetch_attendance`, `fetch_recording`.
- **Quy tắc** (từ `integration-contracts.md`): provider event unique theo `(provider, event_id)` · signature + timestamp validation · lỗi mapping → review queue · reconcile định kỳ attendance/recording · **recording private, cấp quyền qua LMS** (không public).
- **DoD**: tạo/lập lịch/đổi/hủy session đồng bộ provider · attendance sync chính xác · recording tải qua LMS permission.
- **Điều kiện triển khai**: `Class.modality` (offline|online|hybrid) đã chừa ở MVP (§4) — chỉ cần bật addon + adapter.

## 6. WF-06 — Digital Library & Content Mgmt (ROADMAP P2)

- **Scope**: 🚪 post-MVP (P2) — **không thuộc MVP**. Nâng cấp từ `LibraryResource` MVP.
- **Entity**: `library_resources` (MVP) mở rộng: category, subject, `access_scope`, version, usage_policy, tags; semantic search/AI tag là phase sau (có `pgvector` ở Phase 3).
- **API**: MVP đã có upload/download/auth; P2 thêm semantic search (`POST /library/search`) + AI auto-tag (P3).
- **Quy tắc**: version đã dùng trong ghi danh không xóa · content giới hạn quyền cần permission trước khi cấp URL · `access_scope` (public|class|private) enforce.
- **DoD (P2)**: search theo category/subject · phân trang · semantic search khi có vector.

## 7. WF-07 — AI-Powered Assessment & Grading (ROADMAP P3)

- **Scope**: 🚪 post-MVP (P3). **Không AI trong MVP** (D2/D5). Chuẩn bị khi mở phase AI.
- **Entity**: `assessment_bank_items`, `assessments`, `assessment_attempts`, `assessment_results`, `english_pathways`, `english_skill_records` (P2) + `ai_tasks`, `ai_policy_decisions`, `ai_reviews` (**RESERVED** — bảng tạo nullable ở migration base, không dùng MVP).
- **API**: `/assessments` · `/assessments/:id/attempts` (immutable sau submit) · `/ai/grading` (FUTURE, phase 3).
- **Quy tắc**: unique business key chống duplicate attempt · answer/result immutable sau công bố · **AI governance**: log model/prompt/confidence; high-risk output **luôn vào review**.
- **DoD (P3)**: chấm AI → review workflow · 4 kỹ năng English lưu riêng · speaking/writing chờ chấm thủ công.
- **Tasks**: không có task MVP (ngoài phạm vi); roadmap P3.

## 8. WF-08 — Communication Hub (ROADMAP P2)

- **Scope**: 🚠 post-MVP (P2) — **không thuộc MVP**. Socket.IO real-time + messaging.
- **Entity**: `conversations`, `conversation_members` (vai trò + thời hạn), `messages` (immutable history + moderation/report state), `notifications`.
- **API/stack**: Socket.IO (gateway) + `/conversations` CRUD + `/messages`; AI routing là phase sau.
- **Quy tắc**: member bị thu hồi **không xem dữ liệu mới** ngoài scope · retention theo policy (NFR-011) · notification delivery + read_at · message không chứa secret; audit khi nhạy cảm.
- **DoD (P2)**: realtime gửi/nhận trong class · thu hồi member chặn truy cập mới · notification đánh dấu read.

---

## Checklist chung khi triển khai 1 workflow

- [ ] Đọc narrative workflow (WF-xx) + các tài liệu chuẩn liên quan.
- [ ] Đối chiếu entity ↔ `03-data-model.md` / DDL `04-database-schema.md`.
- [ ] Đối chiếu API ↔ `05-api/api-spec.yaml` (đúng tên endpoint, schema, lỗi).
- [ ] Áp `coding-rules.md`: branch-scope, không secret, soft-delete, audit, transaction, i18n.
- [ ] Gán/vai trò theo `10-roles/` + permission theo `02-spec.md` FR-004/FR-005.
- [ ] Cập nhật trạng thái task trong `09-planning/progress-tracker.html`; báo DoD.

---

**Xem thêm**: `../09-planning/task-prompts.md` (prompt theo task) · `../09-planning/progress-tracker.html` (theo dõi) · `../14-agent-guidelines/coding-rules.md` (quy tắc bắt buộc).
