# 02. Feature Specification — EduCenter LMS (Unified)

**Version**: 4.1 (Consolidated)
**Date**: 2026-08-26
**Status**: ✅ Nguồn chuẩn — kế thừa và hợp nhất `spec-v2.md` (MVP) + obsidian v3 (roadmap)

> **Nguyên tắc hợp nhất (D2/D3)**: Phạm vi **MVP = theo spec v2** (không AI, không hybrid). Các user story của v3 (AI, hybrid, digital library nâng cao, communication hub) được liệt kê là **roadmap post-MVP** — có số hiệu riêng (P2/P3) để không nhầm lẫn với phạm vi MVP.

---

## 1. Tóm tắt phạm vi

| Khu vực | MVP (P1) | Roadmap (P2/P3) |
|---|---|---|
| Cài đặt | ✅ US0 | — |
| License (hệ thống quản lý license) | — | ✅ US0-F (FUTURE — D9) |
| Org & Branch | ✅ US1 | — |
| User & Role | ✅ US2 | — |
| Academic | ✅ US3 | — |
| Enrollment | ✅ US4 | — |
| Learning portal | ✅ US5 | — |
| Content management | ✅ US6 | — |
| Finance & Billing | ✅ US7 | — |
| Reporting | ✅ US8 | — |
| Admission & CRM | — | ✅ US9 (P2) |
| Assessment & Testing | — | ✅ US10 (P2) |
| Online Classes | — | ✅ US11 (P2) |
| HRM & Payroll | — | ✅ US12 (P3) |
| Accounting/ERP sync | — | ✅ US13 (P3) |
| AI (auto-grading, assistant, personalization) | — | ✅ US14–US17 (P3) |

---

## 2. MVP User Stories (P1)

### US0 — Installation (license mặc định) (Foundation)

**Actor**: System Administrator
**Goal**: Cài LMS lên server khách hàng, chạy với license mặc định (không cần kích hoạt).

> ⚠️ (D9): hệ thống quản lý license **chưa triển khai** ở giai đoạn này. Không cần license key/file, không cần chữ ký RSA. Màn hình license hiển thị trạng thái "Default (dev/evaluation)". Giữ điểm kết nối chờ để kích hoạt khi có hệ thống quản lý license (US0-FUTURE).

**Scenario**:
1. Tải gói `lms-base-v1.0.0.deb`
2. `sudo dpkg -i lms-base-v1.0.0.deb`
3. `sudo lms-setup wizard` — nhập DB credentials, admin user, organization info
4. Hệ thống tự chạy với license mặc định (mọi module enabled)
5. Admin login được, trạng thái license hiển thị "Default (dev/evaluation)"

**Acceptance Criteria**:
- ✓ Cài đặt không lỗi trên Ubuntu 22.04 sạch
- ✓ Schema DB tự động tạo
- ✓ Admin login được bằng credentials đã cấu hình
- ✓ License status hiển thị "Default (dev/evaluation)" — không cần kích hoạt

**Edge cases**: DB connect fail → hướng dẫn khắc phục.

### US1 — Organization & Branch Management

**Actor**: Organization Administrator
**Goal**: Cấu hình tổ chức và chi nhánh.

**AC**: org settings áp dụng toàn hệ thống · nhiều branch với code duy nhất · branch manager có quyền branch-level · branch inactive không nhận ghi danh mới · báo cáo phân tách theo branch.

**Independent Test**: Tạo branch A và B, gán manager A chỉ cho branch A, verify manager A **không** truy cập được dữ liệu branch B.

### US2 — User & Role Management

**Actor**: Organization Administrator
**Goal**: Quản lý user và phân quyền theo branch scope.

**AC**: user tạo với email/họ tên/role · role có permission predefined (tùy chỉnh) · branch scope enforced · thay đổi role có audit · scope hết hạn tự thu hồi.

**Roles predefined**: Organization Admin (toàn hệ thống) · Branch Manager (branch được gán) · Finance Officer (invoice/payment/report theo branch) · Teacher (class được gán) · Student (lớp của mình) · Academic Manager · System Admin (hạ tầng) · *(addon)* Parent, HR Manager, Payroll Officer, Admission Consultant, Receptionist, Librarian, Customer Support, IT Support, Accountant.

### US3 — Academic Setup

**Actor**: Academic Manager
**Goal**: Tạo department → program → course → class.

**AC**: program theo department · course có learning outcomes/prerequisites · class gắn program + branch + teacher · class capacity enforced · **chống trùng lịch** (teacher/room/time) · class draft không hiện cho student.

### US4 — Student Enrollment

**Actor**: Admission Staff / Branch Manager
**Goal**: Ghi danh học viên vào lớp.

**Flow**: tạo student profile → chọn class + ngày → hệ thống tự tạo invoice theo program fee → enrollment `Pending Payment` → sau khi thanh toán → `Active`.

**AC**: profile cơ bản · enrollment tạo nghĩa vụ tài chính tự động · capacity checked · chống ghi danh trùng (student+class) · status phản ánh trạng thái thanh toán.

**Edge cases**: class full → lỗi + offer waitlist · đã ghi danh → chặn duplicate · chưa thanh toán → enrollment giữ pending.

### US5 — Student Learning Portal

**Actor**: Student
**Goal**: Truy cập lớp, học liệu, theo dõi tiến độ.

**AC**: student chỉ thấy lớp đã ghi danh · học liệu theo permission (một số teacher-only) · progress % · điểm theo publish settings · thư viện search/filter.

**Independent Test**: Ghi danh student vào Class A, verify không truy cập được material Class B.

### US6 — Learning Content Management

**Actor**: Teacher / Content Manager
**Goal**: Upload và tổ chức học liệu.

**AC**: nhiều loại file · versioning · access scope (public/class/private) · lưu local FS hoặc object storage · download URL cấp sau authorization.

### US7 — Finance & Billing

**Actor**: Finance Officer
**Goal**: Quản lý hóa đơn, ghi nhận thanh toán, đối soát.

**AC**: invoice tự tạo khi enrollment với đúng số tiền · nhiều phương thức (cash, bank transfer, gateway) · gateway qua plugin (VNPay, MoMo) · **webhook idempotent** chống trùng thanh toán · receipt PDF · báo cáo chính xác theo branch.

**Payment gateway flow**: Invoice `Pending` → tạo payment link → student trả → gateway webhook → validate → Payment recorded → `Paid` → receipt + email.

**Edge cases**: webhook 2 lần → idempotent · partial payment → `Partially Paid` · gateway timeout → reconcile job.

### US8 — Reporting

**Actor**: Branch Manager / Organization Admin
**Goal**: Xem báo cáo vận hành.

**Report types**: enrollment theo branch/program/month · revenue theo branch/payment method · class utilization · student progress summary.

**AC**: dữ liệu trong scope user · filter đúng · export Excel/PDF · báo cáo lớn chạy async + notification.

---

## 3. Roadmap User Stories (Post-MVP — KHÔNG thuộc MVP)

### US9 — Admission & CRM Addon (P2)
Landing page CMS · lead capture forms · phân công lead cho consultant · consultation workflow · lead→enrollment conversion.

### US10 — Assessment & Testing Addon (P2)
Entrance exam · mock tests · auto-grading MCQ · manual grading essay/speaking · English pathway (4 skills).

### US11 — Online Classes Addon (P2)
Meeting platform integration (Zoom/Google Meet/MS Teams) · online session scheduling · attendance sync · recording management + access control.

### US12 — HRM & Payroll Addon (P3)
Employee management · attendance · leave · payroll (salary + teaching hours) · payslip.

### US13 — Custom Accounting/ERP Integration Addon (P3)
Export giao dịch tài chính ra hệ kế toán ngoài · sync invoice/payment/receipt · idempotent · reconciliation reports.

### US14 — AI Teaching Assistant (P3)
Auto-generate lesson plans · exercises on-demand · 24/7 student chatbot · content quality improvement.

### US15 — AI Auto-Grading (P3)
Essay grading (grammar/structure/content) · speaking assessment (pronunciation/fluency) · code grading (auto-tests) · teacher review workflow · mục tiêu tiết kiệm 50–70% thời gian chấm.

### US16 — AI Personalization (P3)
Learning paths theo mục tiêu · adaptive testing · knowledge gap identification · smart content recommendations · dropout-risk prediction + intervention.

### US17 — AI Governance (P3, bắt buộc đi kèm AI)
AI không tự đổi điểm/lương/quyền lợi/kỷ luật/kết luận gian lận · log đầu vào/đầu ra/model/prompt version · confidence + citations · chế độ đề xuất / tự động có điều kiện / tự động · khiếu nại + đường lui thủ công.

---

## 4. Functional Requirements (Base System — MVP)

| ID | Yêu cầu |
|----|---------|
| FR-001 | Hệ thống MUST hỗ trợ kích hoạt license offline qua file license có chữ ký — **FUTURE (D9)**: khi triển khai hệ thống quản lý license |
| FR-002 | Hệ thống MUST enforce license constraints (max students, branches, storage) — **FUTURE (D9)** |
| FR-003 | Hệ thống MUST hỗ trợ organization với nhiều branch |
| FR-004 | Hệ thống MUST enforce branch-level data scope cho user |
| FR-005 | Hệ thống MUST hỗ trợ RBAC với role tùy chỉnh |
| FR-006 | Hệ thống MUST ghi audit log mọi thay đổi dữ liệu nhạy cảm |
| FR-007 | Hệ thống MUST hỗ trợ cấu trúc học thuật (department, program, course, class) |
| FR-008 | Hệ thống MUST chống trùng lịch (teacher, room, time) |
| FR-009 | Hệ thống MUST tự tạo invoice khi ghi danh |
| FR-010 | Hệ thống MUST hỗ trợ tích hợp payment gateway qua kiến trúc plugin |
| FR-011 | Hệ thống MUST xử lý webhook idempotent (không trùng thanh toán) |
| FR-012 | Hệ thống MUST tạo receipt PDF |
| FR-013 | Hệ thống MUST cung cấp learning content library với access control |
| FR-014 | Hệ thống MUST theo dõi tiến độ và điểm của học viên |
| FR-015 | Hệ thống MUST tạo báo cáo vận hành với branch scope |
| FR-016 | Hệ thống MUST hỗ trợ tiếng Việt và tiếng Anh |
| FR-017 | Hệ thống MUST chạy trên Debian/Ubuntu không cần Docker |
| FR-018 | Hệ thống MUST hỗ trợ lưu file local hoặc S3-compatible |
| FR-019 | Hệ thống MUST cung cấp công cụ backup/restore database |
| FR-020 | Hệ thống MUST đảm bảo data residency (không gửi dữ liệu ra ngoài hạ tầng khách) |

---

## 5. Non-Functional Requirements

| ID | Yêu cầu |
|----|---------|
| NFR-001 | Hỗ trợ tối đa 2.000 học viên mỗi installation |
| NFR-002 | List page tải < 2s với 1.000 records |
| NFR-003 | Detail page tải < 500ms |
| NFR-004 | Xử lý webhook thanh toán < 1 giây |
| NFR-005 | Chịu được 50 concurrent users |
| NFR-006 | Giao dịch tài chính phải dùng transaction |
| NFR-007 | Upload file tối đa 500MB/file |
| NFR-008 | Truy cập bằng bàn phím |
| NFR-009 | WCAG 2.0 AA |
| NFR-010 | Log mọi lỗi với correlation ID |
| NFR-011 | Giữ audit log 7 năm |
| NFR-012 | Mã hóa dữ liệu nhạy cảm at rest |
| NFR-013 | HTTPS cho mọi giao tiếp |
| NFR-014 | Chống SQL injection (parameterized queries) |
| NFR-015 | Rate-limit API 100 req/15 phút/IP |

---

## 6. Security Requirements

| ID | Yêu cầu |
|----|---------|
| SEC-001 | Mật khẩu hash bcrypt cost ≥ 10 |
| SEC-002 | Session hết hạn sau 8 giờ không hoạt động |
| SEC-003 | Login rate-limit 5 lần/15 phút |
| SEC-004 | File upload được virus-scan trước khi lưu |
| SEC-005 | Chữ ký license RSA-2048 tối thiểu — **FUTURE (D9)**, khi có hệ thống quản lý license |
| SEC-006 | API endpoints validate JWT |
| SEC-007 | Giao dịch tài chính ghi audit trail |
| SEC-008 | Webhook thanh toán validate chữ ký |
| SEC-009 | Hành động admin yêu cầu re-authentication |
| SEC-010 | Export dữ liệu phải kiểm tra permission |

---

## 7. Out of Scope (MVP) — chuyển roadmap

- Mobile apps native (P4) · Parent portal (P2 tùy chọn) · AI features (P3) · Video conferencing tích hợp sẵn (dùng integration, P2) · SMS/Email marketing campaign (P2) · Multi-language content translation · Gamification · Social learning · Live chat support · Advanced analytics/BI (P4) · Multi-currency · E-commerce bán khóa học · Certificate ký số · Marketplace (P4)

---

## 8. Assumptions & Constraints

**Assumptions**: khách có nhân sự kỹ thuật hoặc thuê contractor cài đặt · server đạt tối thiểu 4 vCPU/8GB/100GB SSD · PostgreSQL 15+ và Redis 7+ có sẵn · internet chỉ cần lúc cài đặt và cập nhật · tài khoản payment gateway do khách tự đăng ký · nội dung học do khách cung cấp · admin dùng được tiếng Anh.

**Constraints**: team 2 full-stack · 4 tháng MVP (Sep–Dec 2026) · open-source stack, ngân sách hạn chế · **không Docker** · **on-premise only** · UI/docs hỗ trợ tiếng Việt · data residency.

---

## 9. Risks & Mitigations

| Risk | Impact | Prob | Mitigation |
|---|---|---|---|
| Team 2 người / 4 tháng | High | Medium | MVP scope nghiêm ngặt, dùng Ant Design Pro, addons để sau |
| Payment gateway phức tạp | Medium | Low | Plugin architecture, bắt đầu 1 provider (VNPay) |
| License bị crack | Medium | Medium | Giai đoạn này license mặc định, rủi ro thấp; RSA-2048 + obfuscation áp khi triển khai hệ thống quản lý license (D9) |
| Khách cài đặt lỗi | Medium | High | Installation guide chi tiết, wizard tự động, hỗ trợ chat |
| Migration dữ liệu cũ | Low | Medium | Công cụ import CSV, migration service (paid) |
| Hiệu năng ở quy mô lớn | Low | Low | PostgreSQL proven 10x target scale |

---

**Xem tiếp**: [`03-data-model.md`](./03-data-model.md) · [`09-planning/roadmap.md`](./09-planning/roadmap.md)
