# 08. Addon Development Guide

**Version**: 1.1 (MỚI — tạo trong đợt hợp nhất)
**Date**: 2026-08-26
**Status**: ✅ Nguồn chuẩn — hướng dẫn xây dựng addon cho EduCenter LMS

> ⚠️ **(D9)** Giai đoạn này **chưa có hệ thống quản lý license**: addon kích hoạt qua **feature flag / license mặc định** (licensed_enabled = true). Serial key + `/license/*` là **điểm kết nối chờ (FUTURE)** cho hệ thống quản lý license sau này.

---

## 1. Mô hình Addon

EduCenter LMS = **Base System (bắt buộc)** + **Addons (trả phí, serial key riêng — kích hoạt qua license hệ thống, FUTURE D9)**.

| Khía cạnh | Cơ chế |
|---|---|
| Kích hoạt | **Hiện tại (D9):** feature flag / module_states. **FUTURE:** serial key → `lms-addon activate <addon_id> <serial>` hoặc UI `/license/addons/{id}/activate` |
| Entitlement | `addon_licenses` (license_id, addon_id, serial_key, expires_at, status) |
| Trạng thái module | `module_states` — `effective_enabled = installed && configured && licensed && dependency_satisfied` |
| Hết hạn | Grace 30 ngày (read-only) → disabled; **dữ liệu không xóa** |
| Gỡ cài | Không xóa bảng DB; chỉ tắt module (bảo toàn dữ liệu) |
| Feature flags | `feature_flags` cho hành vi cấu hình trong addon |

**Invariants**:
- Addon không được tự cấp entitlement (chỉ license service).
- Business endpoint của addon phải qua guard module state — nếu `effective_enabled=false` → 403 `MODULE_DISABLED`.
- Migration chỉ tiến về trước; tên bảng/khóa ổn định giữa các version.

---

## 2. Cấu trúc gói addon (.deb)

```
lms-addon-<id>-<version>.deb
├── DEBIAN/
│   ├── control              # Package: lms-addon-<id>, Depends: lms-base (>= 1.0.0)
│   ├── postinst             # chạy lms-addon register + migration
│   └── prerm                # chạy lms-addon unregister (tắt module, KHÔNG xóa dữ liệu)
└── opt/lms/addons/<addon_id>/
    ├── manifest.json        # khai báo addon (xem §3)
    ├── dist/                # code NestJS module (build sẵn)
    ├── migrations/          # SQL/TS migrations theo thứ tự
    ├── public/              # assets tĩnh riêng addon (nếu có)
    └── README.md
```

**postinst** (ví dụ):

```bash
#!/bin/bash
set -e
ADDON_ID="assessment"
# Đăng ký module + chạy migration
lms-addon register "$ADDON_ID" /opt/lms/addons/$ADDON_ID
lms-migrate up --addon "$ADDON_ID"
systemctl restart lms-api lms-worker
echo "Addon $ADDON_ID installed. Activate with: lms-addon activate $ADDON_ID <SERIAL>"
```

> Lưu ý: cài addon **không tự kích hoạt** (theo cơ chế license). **Hiện tại (D9)** addon dùng được khi bật feature flag / license mặc định. **FUTURE:** khách nhập serial key (CLI hoặc UI); chưa kích hoạt → module `installed=true, licensed_enabled=false` → vô hiệu.

---

## 3. Manifest (`manifest.json`)

```json
{
  "addon_id": "assessment",
  "name": "Assessment & Testing",
  "version": "1.0.0",
  "min_base_version": "1.0.0",
  "max_base_version": "1.x",
  "core": false,
  "dependencies": [],
  "license_feature_key": "assessment",
  "permissions": [
    { "resource": "assessment", "action": "create" },
    { "resource": "assessment", "action": "grade" },
    { "resource": "assessment_attempt", "action": "read" }
  ],
  "menu_items": [
    { "key": "assessment", "label": "Đánh giá", "icon": "FormOutlined",
      "path": "/assessment", "roles": ["admin", "teacher"] }
  ],
  "routes": [
    { "path": "/assessment/*", "module": "assessment" }
  ],
  "jobs": [
    { "name": "assessment.auto_expire", "schedule": "*/30 * * * *" }
  ],
  "migration_version": "20260901001",
  "quota_keys": ["assessment.attempts_per_student"]
}
```

| Trường | Ý nghĩa |
|---|---|
| `min/max_base_version` | Tương thích với base — validator chặn cài trên base không tương thích |
| `dependencies` | Addon phụ thuộc (ví dụ `online` cần `assessment`?) — kiểm tra vòng lặp |
| `license_feature_key` | Khóa entitlement trong license/addon_licenses |
| `permissions` | Đăng ký quyền mới — seed vào bảng `permissions` khi register |
| `menu_items`/`routes` | UI extension — menu chỉ hiện khi module effective |
| `jobs` | Cron jobs riêng (đăng ký vào worker scheduler) |
| `migration_version` | Version migration hiện tại (chỉ tiến) |
| `quota_keys` | Khóa quota (ví dụ giới hạn attempt/student theo license) |

---

## 4. Database Migration

- Mỗi addon có namespace migration riêng: `migrations/001_init.sql`, `002_*.sql`...
- Tiền tố bảng: không bắt buộc nhưng khuyến nghị theo domain (`assessment_bank_items`, `online_sessions`...).
- Bảng addon tham chiếu bảng base bằng FK bình thường (organization_id, users.id...).
- **Quy tắc**: không bao giờ sửa/xóa cột của bảng base; chỉ thêm bảng/khóa của mình. Nếu cần mở rộng base → phát hành qua base release (minor).
- Rollback: không hỗ trợ tự động — downgrade = gỡ addon (tắt module, giữ dữ liệu) rồi restore nếu cần.

---

## 5. Backend — NestJS Module

```
apps/api/src/modules/addons/<addon_id>/
├── assessment.module.ts
├── assessment.controller.ts      # routes /assessments/...
├── assessment.service.ts
├── entities/                     # TypeORM entities
├── dto/                          # class-validator DTOs
└── guards/                       # (dùng chung ModuleGuard từ base)
```

**Điểm quan trọng**:
1. Controller dùng guard chuẩn: `@UseGuards(JwtAuthGuard, ModuleEnabledGuard('assessment'))` — ModuleEnabledGuard đọc `module_states.effective_enabled`.
2. Scope: mọi query filter theo `organization_id` + `branch_id` từ context (không tin client).
3. Audit: ghi `audit_events` cho hành động nhạy cảm (chấm điểm, publish result).
4. Quota: check qua license service trước khi tạo tài nguyên giới hạn.

Ví dụ guard:

```typescript
// common/guards/module-enabled.guard.ts (base cung cấp)
@Injectable()
export class ModuleEnabledGuard implements CanActivate {
  constructor(private readonly moduleKey: string) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const orgId = ctx.switchToHttp().getRequest().user.organizationId;
    const state = await this.moduleStateService.get(orgId, this.moduleKey);
    if (!state.effective_enabled) throw new ForbiddenException('MODULE_DISABLED');
    return true;
  }
}
```

---

## 6. Frontend — UI Extension

Addon đóng gói cấu hình UI trong manifest; web app đọc động:

1. **Menu**: `menu_items` từ manifest được merge vào menu theo role + module state (web app gọi `GET /me/context` → `modules` để ẩn/hiện).
2. **Routes**: lazy-load trang addon từ bundle riêng:
   ```typescript
   // router.tsx (base) — lazy load theo module
   const AssessmentRoutes = lazy(() => import('addons/assessment/routes'));
   ```
   (Cơ chế cụ thể: web build đóng gói addon pages theo bundle riêng hoặc remote entry — chọn phương án đơn giản cho MVP: addon đóng gói pages vào package, web build đọc khi có addon).
3. **Permissions**: dùng `usePermission('assessment:create')` — dữ liệu từ `/me/context`.
4. **i18n**: addon đóng gói `locales/vi-VN.json`, `en-US.json` — merge tại runtime.

---

## 7. API Extension

- Endpoint addon đặt dưới path riêng, khai báo trong OpenAPI với tag + `x-phase` (xem `api-spec.yaml`).
- Mọi endpoint tuân thủ contract invariant của hệ thống (scope, idempotency, module gate).
- Webhook/integration addon (ví dụ meeting provider) dùng chung `inbox_events` + `outbox_events` primitives từ base.

---

## 8. Quota & Constraint

License service cung cấp:

```typescript
// packages/license-core
const quota = await licenseService.getQuota(orgId, 'assessment.attempts_per_student');
if (quota !== null && used >= quota) throw new LicenseConstraintExceededException();
```

- Quota lấy từ `licenses.constraints` JSONB (base) + `addon_licenses` (addon).
- `GET /organization/modules` trả quota usage cho UI hiển thị.
- Khi vượt: trả 403 `LICENSE_CONSTRAINT_EXCEEDED` + message rõ ràng (không crash).

---

## 9. Lifecycle States

```
Cài (.deb)          → registered (installed=true, licensed=false, effective=false)
Hiện tại (D9):      → license mặc định → licensed=true → effective=true (nếu configured)
Nhập serial [FUTURE]→ activated  (licensed=true)  → effective=true  (nếu configured)
Bật/tắt cấu hình    → configured_enabled toggle   → effective thay đổi
Hết hạn + grace 30d → grace      (read-only)      [FUTURE]
Quá grace           → disabled   (licensed=false, effective=false, dữ liệu giữ) [FUTURE]
Gỡ gói (.deb)       → unregistered (installed=false) — dữ liệu giữ, module tắt
```

**Test bắt buộc**:
- [ ] Kích hoạt addon → menu/routes/endpoint hoạt động
- [ ] Tắt configured → endpoint trả 403 `MODULE_DISABLED`
- [ ] Hết hạn → read-only đúng (không tạo record mới, đọc được)
- [ ] Quá grace → disabled; dữ liệu cũ còn nguyên
- [ ] Kích hoạt lại (serial mới) → dữ liệu cũ truy cập lại bình thường
- [ ] Cài trên base không tương thích → bị chặn bởi `min/max_base_version`

---

## 10. Quy trình phát triển

```
1. Scaffold:  pnpm addon:create <id>        # tạo khung module + manifest + migration
2. Phát triển backend module (NestJS) + tests (Vitest)
3. Phát triển frontend pages + tests (Playwright)
4. Dev mode:  bật module_states thủ công (configured+licensed) — **hiện tại (D9) mọi môi trường đều ở chế độ này** (license mặc định), không cần serial
5. Test lifecycle: activate/expire/grace (dùng license dev key) — **FUTURE** khi có hệ thống quản lý license
6. Build:     pnpm addon:build <id>         # output dist/ + package .deb
7. Package:   dpkg-deb --build → lms-addon-<id>-<version>.deb
8. QA:        cài lên instance sạch theo §9 test list
9. Publish:   đẩy lên release portal + checksum + upgrade notes
```

**Dev mode** (không cần serial thật):

```sql
-- seed dev
INSERT INTO module_states (organization_id, module_key, installed, configured_enabled,
                           licensed_enabled, dependency_satisfied, effective_enabled)
SELECT id, 'assessment', true, true, true, true, true FROM organizations LIMIT 1;
```

---

## 11. Versioning & Compatibility

| Version | Ý nghĩa |
|---|---|
| Addon `1.2.0` | SemVer riêng cho addon |
| `min_base_version` | Base tối thiểu mà addon chạy được |
| `max_base_version` | Base tối đa (thường `1.x`); major base → addon phải release mới |

- Khi base thay đổi API nội bộ: tăng minor base + kiểm tra addon tương thích trong CI (test matrix base × addon).
- Migration addon đánh số tăng dần; không sửa migration đã phát hành.

---

## 12. Publishing Checklist

- [ ] Manifest hợp lệ (validate schema) · version đúng SemVer
- [ ] Migration chỉ tiến; tên bảng ổn định
- [ ] Toàn bộ endpoint có guard module + scope check
- [ ] Quota/constraint check đầy đủ
- [ ] i18n vi-VN + en-US đầy đủ
- [ ] Test lifecycle pass (§9)
- [ ] Docs addon: cài đặt, kích hoạt, cấu hình, FAQ
- [ ] Checksum (`sha256sum`) đăng kèm release
- [ ] Upgrade path từ version trước (nếu có)

---

## 13. Addon có sẵn (định hướng)

| Addon | Phase | Ghi chú |
|---|---|---|
| `crm` — Admission & CRM | P2 | Landing CMS, leads, consultations (schema §9.1 của `04-database-schema.md`) |
| `assessment` — Assessment & Testing | P2 | Bank items, attempts, English pathway |
| `online` — Online Classes | P2 | Meeting provider adapter (Zoom/Meet/Teams) |
| `communication` — Communication Hub | P2 | Conversations, messages, Socket.IO |
| `hrm` — HRM & Payroll | P3 | Employees, attendance, payroll |
| `erp` — Accounting/ERP Sync | P3 | Outbox → provider adapter |
| `ai` — AI Suite | P3 | AITask, policy check, review |

---

**Xem thêm**: [`02-spec.md`](../02-spec.md) (mô hình addon + US9–US17) · [`04-database-schema.md`](../04-database-schema.md) §9 (DDL addon) · [`license-guide.md`](../06-deployment/license-guide.md) (kích hoạt/ gia hạn)
