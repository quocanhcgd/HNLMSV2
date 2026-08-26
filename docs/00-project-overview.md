# 00. Project Overview — EduCenter LMS (Unified)

**Version**: 4.1 (Consolidated)
**Date**: 2026-08-26
**Status**: ✅ Nguồn chuẩn — hợp nhất từ specs v2 (on-premise) + obsidian v3 (AI vision)

---

## Executive Summary

**EduCenter LMS** là hệ thống quản lý học tập (LMS) **self-hosted, on-premise** cho trung tâm đào tạo tư nhân tại Việt Nam, hỗ trợ **đa ngành** và **đa chi nhánh**. Hệ thống cài đặt trên server riêng của khách hàng, chạy với **license mặc định** (dev/evaluation) ở giai đoạn này (D9), đảm bảo **data residency** — toàn bộ dữ liệu nằm trong hạ tầng của khách hàng.

**Định vị**:
- **Khách hàng mục tiêu**: trung tâm ngoại ngữ, đào tạo nghề, luyện thi (1–5 chi nhánh, 500–1.500 học viên, mở rộng tới 5.000+)
- **Phân phối**: gói cài đặt on-premise (`.deb` cho Debian/Ubuntu), chạy license mặc định (không cần kích hoạt); hệ thống quản lý license sẽ kết nối ở giai đoạn sau (D9)
- **Mô hình thương mại**: Base system (một lần) + addons trả phí (serial key riêng)
- **Tech stack**: React 19 + Ant Design Pro (Frontend) · NestJS 10 + TypeORM (Backend) · PostgreSQL 15 + Redis 7
- **MVP**: 16 tuần, đội 2 full-stack developers (Q3 2026), **không AI** trong phạm vi MVP
- **Tầm nhìn dài hạn**: AI-first (auto-grading, teaching assistant), hybrid learning, digital library, communication hub — các phase sau MVP

---

## 1. Vấn đề (Problem Statement)

### Nỗi đau hiện tại của khách hàng

- Quản lý học viên bằng spreadsheet (Excel/Google Sheets) + Zalo/WhatsApp — dữ liệu phân tán
- Quy trình thủ công: ghi danh, điểm danh, chấm điểm, thu học phí
- Không hỗ trợ lớp online/hybrid khi cần (dịch bệnh, thời tiết, học viên ở xa)
- Chấm bài thủ công tốn nhiều thời gian giáo viên (đặc biệt bài luận, nói, lập trình)
- Giao tiếp trường–giáo viên–phụ huynh rời rạc
- Không có thư viện số, không theo dõi tiến độ học tập

### Vì sao giải pháp hiện tại chưa đủ

- **Cloud SaaS**: lo ngại data residency, chi phí thuê bao liên tục, phụ thuộc internet
- **LMS quốc tế** (Moodle, Canvas): phức tạp quá mức, chưa bản địa hóa, chi phí hosting cao
- **Đối thủ nội địa**: chỉ hỗ trợ 1 chi nhánh, không có lộ trình AI, UX cũ

---

## 2. Giải pháp (Solution Overview)

| Trụ cột | MVP (16 tuần) | Roadmap sau MVP |
|---|---|---|
| **Vận hành** | Org & Branch, RBAC theo branch-scope, audit log | — |
| **Đào tạo** | Department → Program → Course → Class, lịch học, chống trùng lịch | Online/hybrid learning (Zoom/Meet/Teams), recording |
| **Tuyển sinh** | Ghi danh cơ bản + tự động tạo hóa đơn | Admission & CRM addon (lead, tư vấn) |
| **Học tập** | Student portal, thư viện nội dung, theo dõi tiến độ | Digital library nâng cao (semantic search, AI tag) |
| **Đánh giá** | (chưa có) | Assessment & Testing addon + AI auto-grading |
| **Tài chính** | Invoice, thanh toán (VNPay/Momo), phiếu thu, báo cáo | ERP/Accounting sync addon, branch finance nâng cao |
| **Nhân sự** | (chưa có) | HRM & Payroll addon |
| **Truyền thông** | Thông báo cơ bản | Communication hub (messaging, broadcast) |
| **AI** | (ngoài phạm vi) | AI teaching assistant, auto-grading, personalized learning, AI governance |

---

## 3. Mô hình sản phẩm (Product Structure)

### Base System (bắt buộc)

- ✅ Organization & Branch Management
- ✅ User & Role Management (RBAC + branch scope)
- ✅ Academic Core (Departments, Programs, Courses, Classes, Schedules)
- ✅ Student Enrollment & Progress
- ✅ Learning Content Library (cơ bản)
- ✅ Finance & Billing (invoice, payment gateway VNPay/Momo, receipt, report cơ bản)

### Paid Addons (tùy chọn — serial key riêng)

- 💰 Admission & CRM
- 💰 Assessment & Testing
- 💰 Online Classes Integration
- 💰 HRM & Payroll
- 💰 Advanced Reporting
- 💰 Custom Accounting/ERP Integration
- 💰 API Access & Webhooks

### Loại license (FUTURE — hệ thống quản lý license chưa triển khai, D9)

| Loại | Đặc điểm |
|---|---|
| **Perpetual** (base) | Trả một lần, dùng trọn đời, miễn phí cập nhật 1 năm, hỗ trợ mở rộng tùy chọn |
| **Subscription** (addon) | Hàng năm/tháng, tự động tắt khi hết hạn, grace period 30 ngày |

### Ràng buộc license (FUTURE — D9, áp dụng khi kết nối hệ thống quản lý license)

- Số học viên tối đa (`max_students`)
- Số chi nhánh tối đa (`max_branches`)
- Dung lượng lưu trữ tối đa (`max_storage_gb`)
- Danh sách addon được bật
- Ngày hết hạn (nếu subscription)

---

## 4. Thị trường mục tiêu (Target Market)

### Khách hàng chính

- **Loại hình**: trung tâm giáo dục tư nhân tại Việt Nam
- **Quy mô**: 1–5 chi nhánh, 500–1.500 học viên (mở rộng tới 5.000+)
- **Ngành**:
  - Ngoại ngữ (Anh, Nhật, Hàn, Trung)
  - IT & Lập trình
  - Đào tạo nghề (Kế toán, Marketing, Thiết kế)
  - Kỹ năng (Nấu ăn, Âm nhạc, Mỹ thuật)
  - Luyện thi (IELTS, TOEIC, SAT, Đại học)

### Chân dung khách hàng

- Đang dùng spreadsheet + Zalo/WhatsApp, muốn số hóa nhưng cần kiểm soát dữ liệu
- 2–10 nhân viên hành chính, 10–50 giáo viên
- Ngân sách: $2.000–$15.000 ban đầu + $1.000–$5.000/năm

---

## 5. Chỉ số thành công (Success Criteria)

### MVP Launch (Q3 2026)

- ✅ Cài đặt thành công trên 2 server khách hàng pilot
- ✅ 90% luồng ghi danh hoàn thành không lỗi trong pilot
- ✅ Payment gateway đạt 99% tỷ lệ thành công
- ✅ **Zero** rò rỉ dữ liệu giữa các chi nhánh (kiểm toán bảo mật)
- ✅ Khởi động LMS với license mặc định < 5 phút (không cần kích hoạt)
- ✅ Uptime > 99% trong giai đoạn pilot
- ✅ Khách hàng tạo báo cáo tài chính tháng trong < 2 phút

### Post-MVP (Q4 2026 → 2027)

- 🎯 10 khách hàng trả phí dùng base system
- 🎯 3 addons ra mắt, mỗi addon ≥ 2 khách hàng mua
- 🎯 < 5 ticket hỗ trợ/khách hàng/tháng
- 🎯 Điểm hài lòng > 4/5

---

## 6. Lộ trình tóm tắt (xem chi tiết `09-planning/roadmap.md`)

| Giai đoạn | Thời gian | Nội dung | Đội ngũ |
|---|---|---|---|
| **MVP** | 16 tuần (Q3 2026) | Foundation, Auth (license mặc định), Core UI, Org & Users, Academic, Learning, Finance, Testing | 2 dev |
| **Phase 2 — Enhanced** | +8 tuần | Online/hybrid learning, digital library nâng cao, communication hub, landing CMS | 2–4 dev |
| **Phase 3 — AI** | +12 tuần | AI teaching assistant, auto-grading, personalization, adaptive testing | 4–6 dev (có AI specialist) |
| **Phase 4 — Advanced** | Ongoing | Multi-industry customization, analytics, mobile apps, marketplace | 9 người (khuyến nghị) |

---

## 7. Nguyên tắc sản phẩm

1. **Data residency**: không gửi dữ liệu ra ngoài hạ tầng khách hàng (FR-020)
2. **Branch-scoped**: mọi dữ liệu truy cập theo phạm vi chi nhánh được cấp (FR-004)
3. **On-premise trước**: không SaaS ở MVP; có thể pivot SaaS optional cho trung tâm nhỏ sau 2027
4. **Modular**: base + addons, feature flags, license gates (D7) — license gate là FUTURE (D9), hiện dùng feature flag
5. **Việt Nam trước**: UI, docs, hỗ trợ tiếng Việt; i18n EN song song (FR-016)

---

**Xem tiếp**: [`01-architecture.md`](./01-architecture.md) → [`02-spec.md`](./02-spec.md)
