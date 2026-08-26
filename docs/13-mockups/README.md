# 13. UI Mockups — EduCenter LMS (MVP)

**Version**: 1.3
**Date**: 2026-08-26
**Status**: ✅ Nguồn chuẩn — mockup phong cách **Tailwind CSS** (thống nhất với bộ mockup cũ trong `mockups/` root)

---

## Mục đích

Bộ mockup HTML interactive cho các màn hình **MVP** (trước khi vào coding). Mỗi file **tự mở bằng trình duyệt** (double-click), dùng **Tailwind CSS Play CDN** + font **Inter** — cùng pattern với 4 mockup cũ trong `mockups/` (lms-login, lms-student-dashboard...). Dữ liệu giả nhúng sẵn, không cần server.

> ⚠️ **Cần internet** khi mở file (CDN Tailwind + Google Fonts) — giống mockup cũ.
> Mockup là tài liệu **thiết kế giao diện**; stack triển khai thực tế vẫn theo `01-architecture.md` (xem ghi chú cuối).

## Tính năng demo (mọi màn hình)

| Tính năng | Cách dùng | Ghi chú |
|---|---|---|
| 🌙 **Dark / Light mode** | Nút `🌙/☀️` ở header (và màn hình login) | Lưu localStorage (`ec-theme`) |
| 🌐 **Song ngữ VI / EN** | Nút `🌐` duy nhất ở header (và màn hình login) — hiển thị ngôn ngữ cần chuyển đến, bấm để toggle | Lưu localStorage (`ec-lang`); dịch toàn bộ chuỗi hiển thị (D8) |
| 🏢 **Branch scope** | Dropdown chi nhánh ở header | Dữ liệu demo đổi theo branch |
| 👤 **User chip + popup menu** | Header hiện **họ tên + vai trò**; bấm vào mở menu: Hồ sơ / Cài đặt / Đổi mật khẩu / Đăng xuất | Bấm ra ngoài để đóng |

## Danh sách mockup

| # | File | Màn hình | User story |
|---|---|---|---|
| 01 | [`01-login-license.html`](./01-login-license.html) | Login + Kích hoạt license (wizard 4 bước, constraints, addons) — kích hoạt là **FUTURE (D9)**, hiện tại chỉ hiển thị trạng thái license mặc định | US0 |
| 02 | [`02-admin-dashboard.html`](./02-admin-dashboard.html) | Dashboard Admin: KPI, biểu đồ, branch selector, cảnh báo | US1, US8 |
| 03 | [`03-users-roles.html`](./03-users-roles.html) | Người dùng & Vai trò: CRUD user, phân quyền theo module, scope grants | US2 |
| 04 | [`04-reports.html`](./04-reports.html) | Báo cáo: 4 loại, filter branch/thời gian, async + export | US8 |

## Cách dùng

1. Mở file `.html` bằng Chrome/Edge/Firefox (cần internet cho CDN).
2. Tương tác: bấm nút, mở modal, chuyển tab, đổi branch, đổi ngôn ngữ, đổi theme — đều có hiệu ứng giả lập.
3. F5 để reset trạng thái demo (ngôn ngữ/theme giữ nguyên theo localStorage).

## Thiết kế (theo mockup cũ `mockups/`)

| Token | Giá trị |
|---|---|
| Primary | `#0d9488` (teal) — gradient `#0d9488 → #10b981` |
| Accent | `#f59e0b` (warning), `#8b5cf6` (purple), `#ef4444` (danger) |
| Light | Nền `#f9fafb`; Card `#ffffff`, radius 1rem, border `#e5e7eb` |
| Dark | Nền `#0f172a`; Card `#1e293b`; border `#334155` (qua CSS variables) |
| Sidebar | trắng, border phải; nav-item active = tint teal |
| Font | Inter (Google Fonts) |
| Framework | Tailwind CSS Play CDN (`cdn.tailwindcss.com`) |
| i18n | vi-VN mặc định + en-US; cơ chế `data-i18n` + dictionary |

## Nguyên tắc mockup (theo `02-spec.md`)

- **Menu theo role**: mockup demo ở góc nhìn Organization Admin; menu ẩn theo module (license gate — **FUTURE D9**, giai đoạn này module dùng feature flag).
- **Branch scope**: header có bộ chọn chi nhánh — dữ liệu dưới đổi theo branch (giả lập).
- **Không tin client**: mockup chỉ thể hiện UI; authorization thật nằm ở backend.
- **Module gate**: mục menu của addon (CRM, HRM...) hiển thị trạng thái "Chưa kích hoạt" (qua feature flag; license gate là FUTURE, D9).

> **Lưu ý stack**: mockup dùng Tailwind CSS để thống nhất visual với bộ mockup cũ. Nếu đội triển khai muốn dùng Tailwind thay vì Ant Design Pro cho ứng dụng thật, cần cập nhật quyết định **D4** trong [`docs/README.md`](../README.md) — hiện D4 vẫn ghi React 19 + Ant Design Pro.

---

**Xem thêm**: [`02-spec.md`](../02-spec.md) (user stories) · [`01-architecture.md`](../01-architecture.md) §4 (frontend) · `mockups/` (root — bộ mockup cũ)
