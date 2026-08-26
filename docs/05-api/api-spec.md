# 05. API Reference — EduCenter LMS

**Version**: 1.1 (MỚI — tạo trong đợt hợp nhất)
**Date**: 2026-08-26
**Status**: ✅ Nguồn chuẩn — máy đọc được: [`api-spec.yaml`](./api-spec.yaml) (OpenAPI 3.0)

> Tài liệu này tóm tắt các quy ước và endpoint; định nghĩa schema đầy đủ nằm trong `api-spec.yaml`. Hợp nhất từ `archive/specs-001-lms-multi-branch/contracts/api-contracts.md` + `12-diagrams/API-Specification.md` — **đã loại bỏ** endpoint SaaS multi-tenant/super-admin của bản cũ. **(D9)**: hệ thống quản lý license chưa triển khai — endpoint `/license/*` là FUTURE, giữ làm điểm kết nối chờ.

---

## 1. Quy ước chung

| Mục | Quy ước |
|---|---|
| Base URL | `https://<host>/api` (Nginx reverse proxy) |
| Auth | `Authorization: Bearer <accessToken>` — JWT, access 15 phút |
| Refresh | HTTP-only cookie `refresh_token` (7 ngày), `POST /auth/refresh` |
| Format | JSON; timestamp ISO 8601 UTC |
| Tiền | decimal chính xác (`NUMERIC`), đơn vị theo `organization.currency` (mặc định VND) |
| Pagination | `?page=1&page_size=20` → `meta.total`, `meta.page`, `meta.page_size` |
| Idempotency | Header `Idempotency-Key` cho lệnh ghi tài chính/ghi danh/webhook |
| Rate limit | 100 req/15 phút/IP (NFR-015); login 5 lần/15 phút (SEC-003) |
| Scope | Backend tự tính organization/branch/student scope từ JWT + scope_grants; **không tin** `branch_id`/`role` client gửi |
| Module gate | Business endpoint bị chặn nếu module effective state = disabled (403 `MODULE_DISABLED`) |
| Ngôn ngữ | Header `Accept-Language: vi | en` (mặc định vi) |

## 2. Error Response

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Dữ liệu không hợp lệ",
  "correlation_id": "9f2c...",
  "details": [ { "field": "email", "message": "Email bắt buộc" } ]
}
```

### Mã lỗi phổ biến

| Code | HTTP | Ý nghĩa |
|---|---|---|
| `UNAUTHORIZED` | 401 | Thiếu/sai/hết hạn token |
| `FORBIDDEN` | 403 | Thiếu quyền / ngoài scope |
| `MODULE_DISABLED` | 403 | Module chưa kích hoạt (license) — chỉ khi license gate kích hoạt (FUTURE, D9) |
| `LICENSE_CONSTRAINT_EXCEEDED` | 403 | Vượt giới hạn license (max_students...) — FUTURE (D9) |
| `NOT_FOUND` | 404 | Không tồn tại |
| `CONFLICT` | 409 | Trùng dữ liệu (ghi danh trùng, trùng lịch, idempotency) |
| `VALIDATION_ERROR` | 422 | Dữ liệu không hợp lệ |
| `RATE_LIMITED` | 429 | Vượt rate limit |
| `IDEMPOTENCY_REPLAY` | 200 (cũ) | Trả lại kết quả lần đầu của Idempotency-Key |

## 3. Bảng endpoint — MVP

### Health & Auth

| Method | Path | Mô tả |
|---|---|---|
| GET | `/health` | Kiểm tra sức khỏe (db, redis, version) |
| POST | `/auth/login` | Đăng nhập → access token + refresh cookie |
| POST | `/auth/refresh` | Làm mới access token |
| POST | `/auth/logout` | Đăng xuất |
| POST | `/auth/forgot-password` | Gửi email đặt lại mật khẩu |
| POST | `/auth/reset-password` | Đặt lại mật khẩu bằng token |
| GET | `/me/context` | Roles, scopes, permissions, module states (cho UI) |

### Organization & Users

| Method | Path | Mô tả |
|---|---|---|
| GET/PUT | `/organization` | Cấu hình tổ chức |
| GET/POST | `/organization/branches` | Danh sách / tạo chi nhánh |
| GET/PUT | `/organization/branches/{id}` | Chi tiết / cập nhật chi nhánh |
| GET | `/organization/modules` | Trạng thái module + quota usage |
| PUT | `/organization/modules/{key}` | Bật/tắt theo cấu hình (không cấp entitlement) |
| GET | `/organization/theme` | Theme hiện tại |
| GET/POST | `/users` | Danh sách / tạo người dùng |
| GET/PUT | `/users/{id}` | Chi tiết / cập nhật |
| POST | `/users/{id}/scope-grants` | Cấp phạm vi branch/class/student |
| GET | `/roles` | Danh sách vai trò |

### Academic & Enrollment

| Method | Path | Mô tả |
|---|---|---|
| GET/POST | `/departments` | Ngành đào tạo |
| GET/POST | `/programs` | Chương trình |
| GET/POST | `/classes` | Lớp học |
| POST | `/classes/{id}/schedules` | Tạo lịch học (409 nếu trùng teacher/room/time) |
| GET/POST | `/students` | Học viên (search theo tên/mã) |
| POST | `/enrollments` | Ghi danh → transaction tạo enrollment + invoice |
| GET | `/enrollments/{id}` | Chi tiết ghi danh + tiến độ |

### Learning

| Method | Path | Mô tả |
|---|---|---|
| GET/POST | `/learning/content` | Danh sách / upload học liệu (multipart, ≤ 500MB) |
| GET | `/learning/content/{id}/download` | Tải file — URL chỉ cấp sau authorization |
| GET | `/learning/library` | Tìm kiếm thư viện |

### Finance

| Method | Path | Mô tả |
|---|---|---|
| GET | `/finance/invoices` | Danh sách hóa đơn (filter student/branch/state/date) |
| GET | `/finance/invoices/{id}` | Chi tiết hóa đơn |
| POST | `/finance/invoices/{id}/payment-attempts` | Tạo lần thanh toán (gateway hoặc manual) |
| POST | `/finance/invoices/{id}/payments` | Ghi nhận thanh toán thủ công (cash/bank) |
| POST | `/finance/refunds` | Hoàn tiền (append-only) |
| GET | `/finance/receipts/{id}/download` | Tải phiếu thu PDF |

### Reports & License

> ⚠️ **(D9)** License endpoints là **FUTURE** — chưa triển khai ở giai đoạn này. LMS chạy license mặc định (LicenseService stub). Giữ làm contract cho hệ thống quản lý license sau này.

| Method | Path | Mô tả |
|---|---|---|
| POST | `/reports` | Tạo báo cáo (async, theo scope) |
| GET | `/reports/{id}` | Trạng thái + link tải |
| POST | `/license/activate` | Kích hoạt license base (file/key) — FUTURE |
| GET | `/license/status` | Trạng thái + constraints + usage — FUTURE |
| GET | `/license/addons` | Danh sách addon licenses — FUTURE |
| POST | `/license/addons/{id}/activate` | Kích hoạt addon bằng serial key — FUTURE |

### Public & Integrations

| Method | Path | Mô tả |
|---|---|---|
| GET | `/public/programs` | Chương trình công khai (không lộ dữ liệu nội bộ) |
| POST | `/public/consultations` | Yêu cầu tư vấn → tạo lead (idempotent qua `client_submission_key`) |
| POST | `/integrations/{provider}/payment-webhooks` | Webhook thanh toán (VNPay/MoMo) |

## 4. Endpoint addon / phase sau (P2, P3)

| Phase | Method | Path | Mô tả |
|---|---|---|---|
| P2 | POST | `/assessments/{id}/attempts` | Tạo lần làm bài (unique business key) |
| P2 | POST | `/assessments/{id}/attempts/{aid}/submit` | Nộp bài (idempotent) |
| P2 | POST | `/classes/{id}/online-sessions` | Tạo buổi online (link cấp sau check enrollment) |
| P2 | POST | `/conversations` + `/conversations/{id}/messages` | Communication hub |
| P2 | POST | `/students/{id}/parent-delegations` | Ủy quyền phụ huynh |
| P3 | POST | `/payroll-periods/{id}/calculate` + `/approve` | Tính/khóa lương |
| P3 | POST | `/finance/expense-requests` | Đề nghị chi (multi-level approval) |
| P3 | POST | `/ai/tasks` + `/ai/tasks/{id}/review` | AI tasks + review (bắt buộc cho tác vụ rủi ro cao) |

## 5. Luồng chính (ví dụ)

### 5.1 Login

```http
POST /api/auth/login
Content-Type: application/json

{ "email": "admin@school.edu.vn", "password": "***" }
```

```json
200
{ "user": { "id": "...", "full_name": "Admin", "roles": ["org_admin"] },
  "accessToken": "eyJ...", "expiresIn": 900 }
```

Sau đó mọi request: `Authorization: Bearer eyJ...`. Lấy scope/module: `GET /me/context`.

### 5.2 Ghi danh → Hóa đơn → Thanh toán

```http
POST /api/enrollments
Idempotency-Key: 5e7b1c2d-...        # header bắt buộc
Authorization: Bearer <token>

{ "student_id": "uuid", "class_id": "uuid" }
```

```json
201
{
  "enrollment": { "id": "...", "status": "pending_payment" },
  "invoice":    { "id": "...", "invoice_number": "INV-202609-0001",
                  "total_amount": 3500000, "balance_state": "pending" }
}
```

Thanh toán qua gateway (VNPay):

```http
POST /api/finance/invoices/{id}/payment-attempts
Idempotency-Key: 9a3c...
{ "amount": 3500000, "payment_method": "vnpay" }
```

→ nhận `provider_handoff.payment_url` → student trả → **VNPay webhook** → hệ thống verify chữ ký → update invoice → `balance_state: paid` → sinh receipt PDF + email. **Redirect từ gateway không được chốt paid** (FR/contract invariant).

### 5.3 Webhook thanh toán (idempotent)

```http
POST /api/integrations/vnpay/payment-webhooks
```

Xử lý: verify chữ ký + replay window → persist `inbox_events` (unique `(provider, external_event_id)`) → ack ngay → xử lý async. Webhook gửi lại lần 2 → trả ack cũ, **không** tạo tác động tài chính thứ hai.

## 6. Ràng buộc bất biến (Contract Invariants)

1. Không endpoint nào cho phép client bỏ qua organization/branch/student scope.
2. Không business endpoint nào chạy khi module effective state = disabled.
3. Không tenant/admin tự cấp license/quota ngoài signed entitlement.
4. Không redirect payment nào tự chốt invoice.
5. Không webhook nào được xử lý hai lần.
6. Không private file nào được cấp URL trước khi authorization thành công.
7. Không AI output rủi ro cao nào tự đổi dữ liệu khi chưa review (P3).
8. Không payroll period locked nào bị sửa trực tiếp (P3).

---

**Nguồn máy đọc được**: [`api-spec.yaml`](./api-spec.yaml)
