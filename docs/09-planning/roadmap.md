# 09. Roadmap — EduCenter LMS (Unified)

**Version**: 4.1 (Consolidated)
**Date**: 2026-08-26
**Status**: ✅ Nguồn chuẩn — hợp nhất kế hoạch 16 tuần (specs v2) + roadmap mở rộng (obsidian v3)

> **Quyết định D3**: lộ trình chính là **MVP 16 tuần / 2 dev** (Q3 2026). Các phase sau (Enhanced, AI, Advanced) là roadmap mở rộng; đội ngũ khuyến nghị tăng dần theo phase. Không phải là phạm vi cam kết của MVP.

---

## 1. MVP — 16 tuần (Q3 2026, 2 full-stack developers)

Chi tiết 76 task: [`tasks-v2.md`](./tasks-v2.md)
📊 **Theo dõi tiến độ trực quan**: mở [`progress-tracker.html`](./progress-tracker.html) (mở bằng trình duyệt — lưu state local, export/import JSON) · 🎯 **Prompt theo task** để tiếp tục ở hội thoại mới: [`task-prompts.md`](./task-prompts.md)

| Tuần | Phase | Nội dung | Deliverable |
|---|---|---|---|
| 1–3 | **Foundation** (🔴) | Monorepo, NestJS + React setup, PostgreSQL + TypeORM, Redis + BullMQ, worker, `.deb` skeleton, setup wizard, systemd units | Infrastructure hoạt động |
| 4–5 | **Auth** (🔴) | User entity, auth module (JWT, refresh, password), license mặc định + điểm kết nối chờ (D9) | Login hoạt động |
| 6–7 | **Core UI** (🟡) | Ant Design Pro layout, navigation theo role, common components (ProTable, FormBuilder), theme, i18n | Admin UI foundation |
| 8–9 | **Organization & Users** (🟡) | Org settings, branch CRUD, user CRUD, roles & permissions, scope grants | Multi-branch setup hoạt động |
| 10–12 | **Academic Core** (🟡) | Departments, programs, courses, classes, schedules + chống trùng lịch, students, enrollment + auto-invoice | Enrollment workflow hoạt động |
| 13 | **Student Learning** (🟡) | Student portal, content library, progress tracking, dashboard | Student truy cập học liệu |
| 14–15 | **Finance & Billing** (🟡) | Invoices, payments (cash/bank/VNPay), webhook idempotent, receipts PDF, report cơ bản | Payment flow hoạt động |
| 16 | **Testing & Polish** (🔴) | Integration tests, bug fixes, docs, packaging | Beta-ready `.deb` |

**Critical path**: T001 → T004 → T005 (DB) → T016–T017 (auth) → academic → finance.

**Exit criteria (MVP Done)**:
- Cài được trên Ubuntu 22.04 sạch bằng `dpkg -i` + wizard
- Admin login, tạo branch/user/class, ghi danh student, tạo + thanh toán invoice, xem report
- License chạy ở chế độ mặc định (D9); hệ thống quản lý license → phase sau (xem mục Phase sau)
- Zero branch data leakage trong kiểm thử độc lập (US1/US5 tests)
- Playwright E2E luồng Enrollment → Learning → Payment xanh

---

## 2. Phase 2 — Enhanced (Post-MVP, ~8 tuần, 2–4 dev)

| Hạng mục | Nội dung | Nguồn |
|---|---|---|
| **Admission & CRM addon** (US9) | Landing CMS, lead capture, consultation workflow, lead→enrollment | obsidian v3 / specs |
| **Assessment & Testing addon** (US10) | Entrance exam, mock tests, MCQ auto-grading, English pathway | obsidian v3 |
| **Online Classes addon** (US11) | Zoom/Meet/Teams adapter, online sessions, attendance sync, recordings | obsidian v3 |
| **Digital Library nâng cao** | Semantic search, AI auto-tagging (nhẹ), progress analytics | obsidian v3 |
| **Communication Hub** | Socket.IO real-time, conversations, broadcast, notifications | obsidian v3 |
| **Parent portal** | Delegation model, parent-scope access | specs data-model |

## 3. Phase 3 — AI Integration (~12 tuần, 4–6 dev + AI specialist)

| Hạng mục | Nội dung | Nguồn |
|---|---|---|
| **AI Teaching Assistant** (US14) | Lesson plan generation, exercise on-demand, chatbot | obsidian v3 |
| **AI Auto-Grading** (US15) | Essay/speaking/code grading, teacher review workflow | obsidian v3 |
| **AI Personalization** (US16) | Learning paths, adaptive testing, recommendations, dropout prediction | obsidian v3 |
| **AI Governance** (US17) | ai_tasks + policy check + review + appeal, log model/prompt version | specs data-model |
| **HRM & Payroll addon** (US12) | Attendance, leave, payroll, payslip | specs/obsidian |
| **ERP/Accounting sync addon** (US13) | Outbox/inbox pattern, idempotent sync | specs contracts |

## 4. Phase 4 — Advanced (Ongoing)

- Multi-industry customization (10+ ngành), competency frameworks
- Advanced analytics/BI, mobile native apps (React Native), PWA hoàn thiện
- Marketplace addon, SaaS optional pivot cho trung tâm nhỏ (đánh giá lại 2027)

---

## 5. Kết nối hệ thống quản lý license (FUTURE — D9)

> Giai đoạn này **không triển khai** hệ thống quản lý license; LMS chạy license mặc định. Khi quyết định thương mại hóa, triển khai **hệ thống quản lý license** để kết nối với LMS qua điểm chờ đã chuẩn bị:
- Kích hoạt license base/addon bằng file có chữ ký RSA-2048 hoặc serial key (kích hoạt `/license/*` hiện đang FUTURE).
- Enforce constraint (max_students, max_branches, max_storage_gb, expiry).
- Cổng phát hành/quản lý license cho vendor.
- Mục tiêu: không thay đổi kiến trúc LMS, chỉ kích hoạt các phần RESERVED/FUTURE đã giữ sẵn.

---

## 6. Đội ngũ theo giai đoạn (khuyến nghị)

| Giai đoạn | Backend | Frontend | DevOps | QA | AI/ML | PM | Tổng |
|---|---|---|---|---|---|---|---|
| MVP | 1 | 1 | (kiêm) | (kiêm) | — | (kiêm) | **2** |
| Phase 2 | 1 | 1–2 | 0.5 | 0.5 | — | 0.5 | **3–4** |
| Phase 3 | 2 | 2 | 1 | 1 | 1–2 | 1 | **8–9** |
| Phase 4 | 2–3 | 2–3 | 1 | 1 | 2 | 1 | **9–10** |

Ngân sách ước tính (toàn roadmap): $460K–$660K — chỉ mang tính tham chiếu từ obsidian v3; MVP với 2 dev không cần mức này.

---

## 7. Chiến lược phát hành

| Bản | Thời điểm | Nội dung |
|---|---|---|
| **v1.0.0-beta** | Cuối tuần 16 | Gói `.deb` cho 2 khách pilot |
| **v1.0.0** | Sau pilot (Q4 2026) | Sửa bug, hoàn thiện docs, GA |
| **v1.1.x** | Q4 2026–Q1 2027 | Addon CRM + Assessment (theo đơn đặt hàng) |
| **v2.0.0** | Q2 2027 | Online classes + communication hub |
| **v3.0.0** | Q3–Q4 2027 | AI suite (auto-grading, assistant, personalization) |

**Nguyên tắc versioning**: SemVer; migration DB chỉ tiến về trước; mỗi major release có upgrade guide + backup bắt buộc trước khi nâng cấp.

---

## 8. Rủi ro lộ trình & cách ứng phó

| Rủi ro | Ứng phó |
|---|---|
| MVP trễ do 2 dev | Ưu tiên critical path; cắt bớt report/UI polish; giữ scope theo tasks-v2 |
| Khách pilot chưa sẵn sàng | Có 1 khách nội bộ (demo) làm pilot thay thế |
| Payment gateway thay đổi API | Plugin pattern; chỉ cam kết VNPay ở MVP, MoMo sau |
| AI phase trễ | AI tách hẳn phase 3, không ảnh hưởng MVP; dùng provider API thay vì tự train |

---

**Xem tiếp**: [`tasks-v2.md`](./tasks-v2.md) (76 task chi tiết)
