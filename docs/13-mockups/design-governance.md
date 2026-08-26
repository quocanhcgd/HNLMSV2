# 13a. Design Governance — Đảm bảo UI luôn tuân thủ mockup

**Version**: 1.0
**Date**: 2026-08-26
**Status**: ✅ Nguồn chuẩn — **bắt buộc tuân thủ** khi triển khai frontend (T001 trở đi)

> Nguồn thiết kế được chốt: 4 mockup trong [`13-mockups/`](./README.md). Tài liệu này định nghĩa **cơ chế** giữ cho hệ thống luôn khớp với thiết kế đó.

---

## 1. Nguyên tắc cốt lõi

1. **Token là luật** — Mọi màu sắc / bo góc / font / bóng chỉ được lấy từ **Design Tokens** (mục 2). Nghiêm cấm hardcode giá trị màu trong code (hex, rgb, tên màu).
2. **Component, không tự chế** — Mọi giao diện ghép từ **Component Inventory** (mục 3). Cấm viết lại markup lẻ tẻ khi đã có component.
3. **Mockup là hợp đồng** — Màn hình triển khai phải khớp mockup tương ứng. Muốn đổi UI → **đổi mockup trước** (mục 7), không đổi code trước.
4. **Cổng kiểm tra tự động** — PR không qua được checklist + kiểm tra tự động (mục 5–6) thì không merge.

## 2. Design Tokens (nguồn duy nhất)

Giá trị chốt từ mockups. Khi scaffold `apps/web` (T001), chuyển nguyên bản vào `packages/ui/tokens.css` + `tailwind.config`:

| Nhóm | Token | Light | Dark |
|---|---|---|---|
| Brand | `--primary` | `#0d9488` | giữ nguyên |
| Brand | `--primary-light` | `#5eead4` | giữ nguyên |
| Brand | `--secondary` | `#10b981` | giữ nguyên |
| Brand gradient | `.gradient-teal` | `linear-gradient(135deg, #0d9488, #10b981)` | giữ nguyên |
| Accent | `--accent` | `#f59e0b` | giữ nguyên |
| Accent | `--purple` | `#8b5cf6` | giữ nguyên |
| Accent | `--pink` | `#ec4899` | giữ nguyên |
| Danger | `--danger-text` | `#dc2626` | giữ nguyên |
| Surface | `--bg-1` (card/sidebar) | `#ffffff` | `#1e293b` |
| Surface | `--bg-2` (nền trang) | `#f9fafb` | `#0f172a` |
| Surface | `--bg-3` (track/hover) | `#f3f4f6` | `#334155` |
| Text | `--text-1` | `#111827` | `#f1f5f9` |
| Text | `--text-2` (secondary) | `#6b7280` | `#94a3b8` |
| Text | `--text-3` (faint) | `#9ca3af` | `#64748b` |
| Border | `--border` | `#e5e7eb` | `#334155` |
| Radius | card / modal | `1rem` | — |
| Radius | button / input / chip | `.75rem` / `.6rem` | — |
| Radius | badge | `9999px` | — |
| Font | family | `Inter` (300–800) | — |
| Shadow | `.btn-primary:hover` | `0 8px 20px rgba(13,148,136,.3)` | — |

**Badge tints** (nền trong suốt + chữ màu): success `rgba(16,185,129,.15)`, warning `rgba(245,158,11,.15)`, primary `rgba(13,148,136,.15)`, purple `rgba(139,92,246,.15)`, blue `rgba(59,130,246,.12)`, danger `rgba(239,68,68,.12)`, gray `var(--bg-3)`.

```json
{
  "colors": {
    "primary": "#0d9488", "primaryLight": "#5eead4", "secondary": "#10b981",
    "accent": "#f59e0b", "purple": "#8b5cf6", "pink": "#ec4899", "danger": "#dc2626",
    "light":  { "bg1": "#ffffff", "bg2": "#f9fafb", "bg3": "#f3f4f6", "text1": "#111827", "text2": "#6b7280", "text3": "#9ca3af", "border": "#e5e7eb" },
    "dark":   { "bg1": "#1e293b", "bg2": "#0f172a", "bg3": "#334155", "text1": "#f1f5f9", "text2": "#94a3b8", "text3": "#64748b", "border": "#334155" }
  },
  "radius": { "card": "1rem", "control": ".75rem", "chip": ".6rem", "badge": "9999px" },
  "fontFamily": "Inter",
  "gradientTeal": "linear-gradient(135deg, #0d9488 0%, #10b981 100%)",
  "shadowPrimaryHover": "0 8px 20px rgba(13,148,136,.3)"
}
```

## 3. Component Inventory

Mỗi thành phần có **1 component duy nhất** trong code (Storybook để phát triển độc lập):

| Component | Mô tả | Nguồn mockup |
|---|---|---|
| `AppShell` | Sidebar (w-64) + Header sticky + Content `p-8` | tất cả |
| `Sidebar` / `NavItem` / `NavGroup` | Menu; item active = tint teal; group uppercase faint | tất cả |
| `NavLocked` (addon) | Menu addon + badge "Chưa kích hoạt" (module gate) | tất cả |
| `Header` | Breadcrumb, branch select, 🌙, 🌐 (1 nút), UserMenu | tất cả |
| `UserMenu` | Chip họ tên + vai trò → popup Hồ sơ/Cài đặt/Đổi MK/Đăng xuất | tất cả |
| `BranchSelector` | Dropdown phạm vi; dữ liệu đổi theo branch | tất cả |
| `StatCard` | Label + số lớn + icon + trend | 02 |
| `Card` | Nền `--bg-1`, border, radius 1rem | tất cả |
| `ButtonPrimary` / `ButtonOutline` | Gradient teal / viền `--border` | tất cả |
| `InputField` / `Select` | Border 2px, focus ring teal | 01, 03, 04 |
| `Chip` (multi-select) | Chọn vai trò/scope | 03 |
| `Badge` | success/warning/danger/primary/purple/blue/gray | tất cả |
| `Table` | Header `--text-2` + border `--border`, hover `--bg-2` | 02, 03, 04 |
| `ProgressBar` | Track `--bg-3` + fill gradient teal | 01, 04 |
| `Toast` | Card + border-left primary, top-right | tất cả |
| `Modal` | Overlay rgba(0,0,0,.45), card 1rem | 01, 03 |
| `Dropdown` | Absolute card + shadow, đóng khi bấm ngoài | tất cả |
| `AlertBox` | red/amber/blue (có variant dark) | 02 |
| `DonutChart` / `BarChart` | CSS thuần (conic-gradient / flex bars) | 02 |
| `LangToggle` | **1 nút** 🌐 hiển thị ngôn ngữ đích | tất cả |
| `ThemeToggle` | 1 nút 🌙/☀️ | tất cả |

## 4. Quy tắc triển khai frontend (bắt buộc)

1. **Không hardcode** màu/radius/font — dùng token hoặc component. (Kiểm tra tự động, mục 6)
2. **i18n**: mọi chuỗi hiển thị qua dictionary; **1 nút 🌐 toggle** (không dùng 2 nút VI|EN); chuỗi động render lại khi đổi ngôn ngữ.
3. **Dark mode**: mọi surface qua token; trước khi merge phải test cả 2 theme.
4. **Responsive**: sidebar thu gọn, tên user ẩn trên mobile (chỉ avatar), grid KPI 1→2→4 cột.
5. **Module gate**: mục menu addon chưa kích hoạt hiển thị mờ + badge (theo `08-addons/`).
6. **Branch scope**: `BranchSelector` ở header; dữ liệu truy vấn phải theo scope backend (FR-004) — UI không tự lọc client.
7. **UserMenu** luôn hiện họ tên + vai trò, không chỉ avatar.
8. Tương tác giả lập trong mockup (modal, toast, job queue) phải có bản thật tương ứng — không bỏ trống.

## 5. Definition of Done — PR giao diện

Checklist bắt buộc trước khi merge:

- [ ] Layout khớp mockup tương ứng (so sánh trực quan / screenshot diff — mục 6)
- [ ] Không có giá trị màu hardcode (pass lint)
- [ ] Dark mode + Light mode đều đúng
- [ ] EN + VI đều đúng, không chuỗi cứng ngoài dictionary
- [ ] Dùng component trong inventory, không tự chế
- [ ] Responsive ≥ breakpoints: 640 / 1024 / 1280
- [ ] Scope chi nhánh được truyền từ backend, không lọc client
- [ ] Addon menu theo module gate

## 6. Công cụ đề xuất (cài khi bắt đầu coding — T001)

| Công cụ | Mục đích | Cách chặn vi phạm |
|---|---|---|
| **Tailwind config** | Map tokens vào `theme.extend` | Mọi class màu lấy từ token |
| **Stylelint** (`color-no-hex`) | Chặn hex trong CSS | Lint fail = không merge |
| **ESLint** (`no-restricted-syntax` trên style attr / hex) | Chặn màu cứng trong JSX | Lint fail = không merge |
| **Playwright visual diff** | Screenshot mockup vs app page (cùng viewport + theme + lang) | Pixel diff > ngưỡng = fail CI |
| **Storybook** | Phát triển component độc lập, đối chiếu mockup | Component phải có story |
| **CI (GitHub Actions)** | Chạy lint + test + visual diff mỗi PR | Gate trước merge |

> Cấu hình cụ thể được tạo tại giai đoạn Foundation theo [`09-planning/tasks-v2.md`](../09-planning/tasks-v2.md) (T001 scaffold monorepo). Tài liệu này là yêu cầu đầu vào cho việc scaffold đó.

## 7. Quy trình thay đổi thiết kế (mockup-first)

```
1. Có nhu cầu đổi UI (tính năng mới / chỉnh sửa)
   → 2. Sửa mockup trong docs/13-mockups/ TRƯỚC (kèm token mới nếu có)
   → 3. Duyệt mockup (PM/UX + người yêu cầu)
   → 4. Cập nhật token/component nếu cần (docs này + Storybook)
   → 5. Triển khai theo mockup đã duyệt
   → 6. Visual diff + checklist DoD
   → 7. Merge
```

**Cấm**: sửa UI trong code trước khi mockup được duyệt. Mockup lệch code = mockup là chuẩn, code phải sửa (trừ khi có quyết định chốt đổi thiết kế ở bước 3).

## 8. Trách nhiệm

- **Developer**: tuân thủ tokens/components/DoD; báo sớm nếu mockup không khả thi về kỹ thuật.
- **Reviewer**: kiểm checklist mục 5, không du diệt vi phạm token.
- **PM/UX (người duyệt mockup)**: là người duy nhất được đổi thiết kế chuẩn (bước 3).

---

**Xem thêm**: [`13-mockups/README.md`](./README.md) (4 mockup đã chốt) · [`02-spec.md`](../02-spec.md) (UX, FR-004 scope) · [`01-architecture.md`](../01-architecture.md) §4 (frontend) · [`09-planning/tasks-v2.md`](../09-planning/tasks-v2.md)
