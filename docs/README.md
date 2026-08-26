# EduCenter LMS — Unified Documentation (docs/)

**Version**: 4.3 (Standardized — single set)
**Date**: 2026-08-26
**Status**: ✅ Nguồn chuẩn (Source of Truth) — **một bộ tài liệu duy nhất**

---

## 🎯 Tài liệu này là gì?

`docs/` là **một bộ tài liệu chuẩn hóa duy nhất** cho EduCenter LMS, hợp nhất từ hai bộ tài liệu cũ:

| Bộ tài liệu cũ | Kết quả sau chuẩn hóa |
|---|---|
| `specs/001-lms-multi-branch` (v2 — on-premise) | Nội dung chuẩn → các tài liệu `00–09` · tài liệu lỗi thời → `archive/specs-001-lms-multi-branch/` |
| `obsidian-vault` (v3 — AI-enhanced) | Roles/Workflows/Diagrams → `10-roles/`, `11-workflows/`, `12-diagrams/` · phân tích/summary → `archive/obsidian-vault/` |
| `README.md` gốc + `database/` + `mockups/` (EduCenter cũ) | Legacy, chỉ giữ tham chiếu ở root |

> Mọi nội dung **chuẩn** nằm trực tiếp trong `docs/` (số thứ tự `00–14`). Nội dung không còn hiệu lực được chuyển vào `docs/archive/` (chỉ để tham khảo lịch sử, không phải nguồn chuẩn).

---

## 📋 Decision Log (Quyết định hợp nhất — 2026-08-26)

| # | Chủ đề | Quyết định | Lý do |
|---|--------|-----------|-------|
| D1 | **Mô hình kinh doanh** | On-premise self-hosted + license offline (không SaaS multi-tenant) | Data residency VN, team 2 người, phù hợp thị trường |
| D2 | **Phạm vi MVP** | Theo spec v2: Org/Branch, RBAC, Academic Core, Enrollment, Learning Portal, Finance & Billing, Reporting cơ bản — **không AI, không hybrid** | 16 tuần, 2 dev, deliverable khả thi |
| D3 | **Lộ trình & đội ngũ** | MVP 16 tuần / 2 dev là chính; roadmap mở rộng (AI, hybrid, library nâng cao, communication hub) là các phase sau | Giữ khả thi, có đường nâng cấp |
| D4 | **Stack** | React 19 + Ant Design Pro / NestJS 10 + TypeORM / PostgreSQL 15 + Redis 7 / Nginx + systemd + `.deb`, **không Docker** | Chốt theo CHANGELOG v2 |
| D5 | **AI** | Không nằm trong MVP; schema/API chừa chỗ sẵn cho phase sau; tuân thủ AI governance | Tránh over-scope, sẵn sàng mở rộng |
| D6 | **Kiến trúc dữ liệu** | Một database duy nhất mỗi installation; organization isolation; license tables; addon tables qua migration | Đơn giản deployment/backup |
| D7 | **Addons** | Base + addons trả phí, serial key riêng, feature flags + license gates | Mô hình thương mại rõ ràng |
| D8 | **i18n** | Tiếng Việt + tiếng Anh; UI/docs hỗ trợ cả hai | Thị trường VN |
| D9 | **Hệ thống quản lý license** | Hoãn triển khai — giai đoạn này chỉ triển khai LMS với license mặc định (dev/evaluation); giữ tables + contract API + LicenseService interface làm điểm kết nối chờ (integration seam) cho hệ thống quản lý license sau này | License management system không phải MVP; LMS vẫn chạy được ngay với stub |

---

## 📂 Cấu trúc docs/ (một bộ chuẩn duy nhất)

```
docs/
├── README.md                        ← File này (index + decision log)
│
├── 00-project-overview.md           ← Tổng quan dự án
├── 01-architecture.md               ← Kiến trúc kỹ thuật (on-premise)
├── 02-spec.md                       ← Đặc tả tính năng (MVP + roadmap)
├── 03-data-model.md                 ← Mô hình dữ liệu
├── 04-database-schema.md            ← PostgreSQL schema chi tiết (DDL)
│
├── 05-api/                          ← API
│   ├── api-spec.yaml                ←   OpenAPI 3.0 (máy đọc được)
│   ├── api-spec.md                  ←   Tham chiếu API (con người đọc)
│   └── integration-contracts.md     ←   Contract tích hợp (payment/meeting/ERP/AI)
│
├── 06-deployment/                   ← Triển khai & vận hành
│   ├── installation-guide.md        ←   Cài đặt ban đầu
│   ├── license-guide.md             ←   License & addon — THAM CHIẾU giai đoạn sau (D9)
│   └── deployment-runbook.md        ←   Operations playbook
│
├── 07-operations/
│   └── security-checklist.md        ← Security hardening guide
│
├── 08-addons/
│   └── addon-development-guide.md   ← Hướng dẫn phát triển addon
│
├── 09-planning/                          ← Kế hoạch & theo dõi tiến độ
│   ├── roadmap.md                   ←   Lộ trình hợp nhất
│   ├── tasks-v2.md                  ←   76 task MVP (16 tuần)
│   ├── progress-tracker.html        ←   📊 Tracker HTML theo dõi tiến độ theo task (mở bằng trình duyệt, lưu localStorage, export/import JSON)
│   └── task-prompts.md              ←   🎯 PROMPT_CONTEXT theo từng task (chuyển hội thoại mới)
│
├── 10-roles/                        ← 17 vai trò (từ obsidian vault)
│   └── README.md                    ←   Index roles
│
├── 11-workflows/                    ← 8 quy trình nghiệp vụ (từ obsidian vault)
│   ├── README.md                    ←   Index workflows
│   └── IMPLEMENTATION-MAP.md        ←   🧭 Nối workflow ↔ entity/API/task/quy tắc (để triển khai)
│
├── 12-diagrams/                     ← Sơ đồ & interactive HTML (từ obsidian vault)
│   ├── Technical-Architecture.md
│   ├── Database-Schema-ERD.md
│   ├── API-Specification.md         ← (tham khảo; chuẩn API là 05-api/)
│   ├── Workflows-Canvas.html         ←   🧭 Tổng hợp 8 workflow, render Canvas tương tác
│   └── WF-*-Interactive.html         ←   Interactive workflow diagrams
│
├── 13-mockups/                      ← UI mockups (HTML interactive, Tailwind CSS)
│   ├── 01-login-license.html        ←   Login + trạng thái license mặc định (FUTURE: kích hoạt)
│   ├── 02-admin-dashboard.html      ←   Dashboard Admin (US1, US8)
│   ├── 03-users-roles.html          ←   Người dùng & Vai trò (US2)
│   └── 04-reports.html              ←   Báo cáo async (US8)
│
├── 14-agent-guidelines/              ← Quy tắc cho AI agent
│   └── coding-rules.md         ←   ⚠️ BẮT BUỘC khi agent coding (tham chiếu trong mọi PROMPT_CONTEXT)
│
└── archive/                         ← ⚠️ KHÔNG phải nguồn chuẩn — chỉ tham khảo lịch sử
    ├── README.md                    ←   Chỉ dẫn archive
    ├── obsidian-vault/              ←   Analysis-13-Issues, Project-Overview-v3, summaries...
    └── specs-001-lms-multi-branch/  ←   spec-v2, architecture-proposal, contracts cũ...
```

---

## 🚀 Bắt đầu từ đâu?

| Vai trò của bạn | Đọc tài liệu nào |
|---|---|
| **Product/Business** | `00-project-overview.md`, `02-spec.md`, `09-planning/roadmap.md` |
| **Kiến trúc sư / Dev lead** | `01-architecture.md`, `03-data-model.md`, `04-database-schema.md`, `05-api/api-spec.yaml` |
| **Backend dev** | `04-database-schema.md`, `05-api/api-spec.yaml`, `03-data-model.md`, `09-planning/tasks-v2.md` |
| **Frontend dev** | `01-architecture.md` (phần Frontend), `05-api/api-spec.md`, `10-roles/`, `09-planning/tasks-v2.md` |
| **DevOps** | `06-deployment/installation-guide.md`, `06-deployment/deployment-runbook.md`, `07-operations/security-checklist.md` |
| **Triển khai cho khách hàng** | `06-deployment/installation-guide.md` (license mặc định, không cần kích hoạt) |
| **Muốn xây addon / module** | `08-addons/addon-development-guide.md`, `02-spec.md` (mô hình addon) |
| **Hiểu nghiệp vụ / vai trò** | `11-workflows/`, `10-roles/`, `12-diagrams/` |
| **Thiết kế UI / review UX** | `13-mockups/` (mở HTML bằng trình duyệt) |
| **AI agent nhận task coding** | `14-agent-guidelines/coding-rules.md` (BẮT BUỘC) + `09-planning/task-prompts.md` (prompt theo task) + `09-planning/progress-tracker.html` (cập nhật tiến độ) |

---

## 🔗 Bản đồ liên kết (tài liệu chuẩn ← nguồn cũ)

| Tài liệu chuẩn | Kế thừa từ | Ghi chú |
|---|---|---|
| `00-project-overview.md` | specs README + `Project-Overview-v3.md` | Hợp nhất |
| `01-architecture.md` | `architecture-proposal.md` + `Technical-Architecture.md` | Sửa title "SaaS Multi-tenant" → on-premise |
| `02-spec.md` | `spec-v2.md` + workflows v3 | MVP theo v2, roadmap theo v3 |
| `03-data-model.md` | `data-model.md` | Bỏ multi-tenant |
| `04-database-schema.md` | `Database-Schema-ERD.md` + data-model + lms-schema.sql | DDL chuẩn mới |
| `05-api/*` | `contracts/api-contracts.md` + `API-Specification.md` | Loại endpoint super-admin/tenant |
| `06-deployment/*` | `installation-guide.md`, `license-guide.md` (THAM CHIẾU) | + runbook mới · D9: license mặc định |
| `07-operations/security-checklist.md` | spec-v2 SEC/NFR | Mới |
| `08-addons/addon-development-guide.md` | CHANGELOG module system + license-guide | Mới · D9: addon dùng feature flag, license gate future |
| `09-planning/roadmap.md` | tasks-v2 + CHANGELOG + roadmap v3 | Mới |
| `10-roles/`, `11-workflows/`, `12-diagrams/` | obsidian vault | Giữ nguyên nội dung (tham chiếu) |

---

## ⚠️ Những điều cần nhớ khi làm việc với docs/

1. **Chỉ tài liệu `00–14` là chuẩn**; `archive/` không được dùng làm cơ sở quyết định.
2. **MVP không bao gồm AI** (D2, D5): mọi tính năng AI/hybrid/communication hub trong `11-workflows/`, `12-diagrams/` là roadmap post-MVP.
3. **`architecture-proposal.md` cũ ghi "SaaS Multi-tenant"** — chỉ trong `archive/`; quyết định hiện hành là on-premise (`01-architecture.md`).
4. **`api-contracts.md` cũ có endpoint super-admin/tenant** — đã loại; hệ thống quản lý license chưa triển khai ở giai đoạn này (D9), LMS chạy license mặc định, giữ điểm kết nối chờ.
5. **`database/lms-schema.sql` ở root là schema EduCenter cũ** — không phải schema chuẩn; schema chuẩn là `04-database-schema.md`.
6. **Roles/workflows chuyển từ Obsidian vault**: liên kết `[[wikilink]]` nội bộ cũ có thể không còn hoạt động sau khi chuyển vào cây chuẩn — nội dung văn bản vẫn đầy đủ.

---

## 📝 Quy ước tài liệu

- Ngôn ngữ: **Tiếng Việt** làm chính (thuật ngữ kỹ thuật giữ tiếng Anh).
- Mọi tài liệu chuẩn có header: `Version`, `Date`, `Status`.
- Đánh số thư mục theo thứ tự đọc: `00`–`12`; `archive/` ngoài thứ tự.
- Khi thay đổi quyết định: cập nhật **Decision Log** ở file này trước, rồi lan tỏa vào các tài liệu liên quan.
- Không đưa tài liệu mới vào `archive/` trừ khi thật sự lỗi thời; tài liệu chuẩn khi lỗi thời → chuyển archive + cập nhật bản đồ liên kết.

---

**Last Updated**: 2026-08-26
**Maintainer**: Development Team
