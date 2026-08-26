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

- **Scope**: post-MVP (P3) — **không thuộc MVP**. Chỉ thiết kế chờ.
- **Entity**: (addon HRM, migration riêng) — thiết kế chờ trong `08-addons/`.
- **Lưu ý**: không seed/implementation ở giai đoạn này; khi triển khai theo `addon-development-guide.md`, addon gate qua feature flag (license gate FUTURE, D9).

## 5. WF-05 — Online & Hybrid Learning (ROADMAP P2)

- **Scope**: post-MVP (P2). Thiết kế chờ: 4 delivery modes, emergency switch, recordings.
- **Entity/API**: addon Online (P2); adapter meeting provider (Zoom/Meet/Teams) qua `integrations/`. Không thuộc MVP.

## 6. WF-06 — Digital Library & Content Mgmt (ROADMAP P2)

- **Scope**: post-MVP (P2). Không thuộc MVP. Nâng cấp từ `learning_content` MVP; semantic search/AI tag là phase sau.

## 7. WF-07 — AI-Powered Assessment & Grading (ROADMAP P3)

- **Scope**: post-MVP (P3). **Không AI trong MVP** (D2/D5). Bảng `ai_tasks`/`ai_policy_decision`/`ai_review` nullable (RESERVED, phase 3).

## 8. WF-08 — Communication Hub (ROADMAP P2)

- **Scope**: post-MVP (P2). Socket.IO real-time, conversations. Không thuộc MVP.

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
