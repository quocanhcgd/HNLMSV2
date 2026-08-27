# Coding Rules — Dành cho AI Agent (Bắt buộc tuân thủ)

**Version**: 1.0 · **Date**: 2026-08-26 · **Áp dụng**: mọi AI agent khi thực hiện task trong repo `HNLMSV2`
**Trạng thái**: ✅ Bắt buộc — vi phạm là task bị từ chối nhận (DoD fail)

> Những quy tắc này **đi kèm mọi PROMPT_CONTEXT** của task (xem `09-planning/progress-tracker.html` + `09-planning/task-prompts.md`). Khi bắt đầu 1 task, agent phải đọc tài liệu chuẩn liên quan rồi mới code, và cuối cùng **tự kiểm tra theo các quy tắc dưới đây** trước khi báo xong.

---

## 1. Nguyên tắc nền (Bất biến)

- **1.1 Đọc trước, viết sau**: đọc tài liệu chuẩn (docs/ 00–13) liên quan + task quy trình trước khi tạo/sửa file.
- **1.2 Chỉ đổi đúng phạm vi task**: không refactor ngoài lề, không thêm tính năng chưa yêu cầu, không "tiện tay sửa".
- **1.3 Không chạm `docs/archive/`** (chỉ tham khảo lịch sử). Không coi nội dung cũ trong archive là hiện hành.
- **1.4 Ưu tiên đơn giản**: chọn giải pháp đơn giản nhất đạt yêu cầu; tránh over-engineering.
- **1.5 Tiếng Việt trong giao tiếp, thuật ngữ kỹ thuật giữ tiếng Anh.** Mã nguồn dùng tiếng Anh (tên biến/hàm/comment).

## 2. Chất lượng code

- **2.1 Tuân stack chuẩn**: React 19 + Ant Design Pro (FE) · NestJS 10 + TypeORM (BE) · PostgreSQL 15 + Redis 7 · Vite SPA + Nginx. **Không Docker.**
- **2.2 Lint/Format**: chạy ESLint + Prettier trước khi commit; không để lỗi mới.
- **2.3 TypeScript strict**: khai báo type đầy đủ, tránh `any` trừ khi bất khả kháng (ghi chú lý do).
- **2.4 Không dead code**: xóa import/component/function không dùng; không để TODO vô chủ (mỗi TODO ghi owner).
- **2.5 Tên rõ nghĩa**: tên biến/hàm/entity phản ánh chức năng; tuân theo chuẩn của codebase.
- **2.6 Migration chỉ tiến về trước** (TypeORM): không sửa migration đã merge; thêm migration mới.

## 3. Bảo mật (bắt buộc)

- **3.1 Branch-scoped dữ liệu**: mọi query/read/write/export phải lọc theo `organization_id`/`branch_id` người dùng được cấp (FR-004). UI ẩn menu KHÔNG thay thế guard backend.
- **3.2 Không nhạy cảm trong log/response**: không log password/token/secret; lỗi trả về không lộ nội dung internal.
- **3.3 SQL injection**: 100% query qua TypeORM parameterized — **cấm nối chuỗi SQL**.
- **3.4 Không nhúng secret**: password/token/key ở env/`.env`, KHÔNG hardcode trong source.
- **3.5 Upload/Webhook**: validate kích thước/loại file, virus-scan; webhook xử lý idempotent (unique `idempotency_key`).
- **3.6 Không thêm endpoint admin/super-admin** (đã loại bỏ ở docs). Giữ RBAC + scope.

## 4. Quản lý dữ liệu

- **4.1 Không xóa vật lý** dữ liệu nhạy cảm (tài chính, điểm, payroll, audit) — dùng soft delete/append-only.
- **4.2 Audit**: ghi `audit_events` cho thay đổi dữ liệu nhạy cảm (append-only, giữ 7 năm).
- **4.3 UUID làm PK**; timestamp ISO 8601; tiền dùng `decimal` chính xác (không float).
- **4.4 Transaction**: giao dịch tài chính/ghi danh bọc transaction.

## 5. Quy ước dự án đang áp dụng

- **5.1 License = mặc định (D9)**: hệ thống quản lý license CHƯA triển khai. LicenseService là **stub** trả license mặc định (mọi module enabled, không enforce constraint). KHÔNG tạo file RSA, KHÔNG yêu cầu kích hoạt. Bảng license tạo nhưng RESERVED.
- **5.2 Không chế endpoint `/license/*`**: giữ contract FUTURE trong OpenAPI, không hiện UI sản xuất.
- **5.3 i18n**: chuỗi UI đưa vào file `vi-VN.json`/`en-US.json`, không hardcode tiếng Việt trong component.
- **5.4 Follow tài liệu chuẩn**: nếu docs mâu thuẫn, `docs/README.md` (Decision Log) là nguồn ưu tiên; báo cáo mâu thuẫn lên thay vì tự quyết.
- **5.5 Mockup-first (FE — bắt buộc)**: trước khi code BẤT KỲ màn hình/component UI nào, PHẢI mở mockup tương ứng trong `docs/13-mockups/` (`01-login-license` → login/license · `02-admin-dashboard` → dashboard · `03-users-roles` → users · `04-reports` → reports) + `design-governance.md`. Layout/màu/radius/font CHỈ lấy từ **Design Tokens** (`apps/web/src/styles/tokens.css`) — cấm hardcode màu/radius mới ngoài token. **Mockup là hợp đồng**: code lệch mockup = sửa code cho khớp (muốn đổi UI → đổi mockup trước + duyệt, theo quy trình §7 design-governance). Khi xong màn hình: tự so sánh từng hạng mục (layout, màu token, dark mode, i18n, responsive 640/1024/1280) với mockup trước khi báo Done.

## 6. Kiểm thử & DoD

- **6.1 Viết test** cho nghiệp vụ: unit (Vitest) cho service quan trọng, integration/E2E (Playwright) cho luồng chính.
- **6.2 Chạy test**: task chỉ "Xong" khi test pass + không gây regress test khác.
- **6.3 DoD đủ**: đối chiếu từng Tiêu chí nhận (DoD) trong task; nếu chưa đủ → nêu rõ còn thiếu gì, không báo xong.
- **6.4 Báo cáo cuối task**: file/dir đã tạo-sửa · xác nhận từng DoD (✓/✗) · lệnh test đã chạy + kết quả · trạng thái trong tracker.

## 7. Commit & ghi chú

- **7.1 Commit nhỏ, theo chủ đề**: 1 commit = 1 thay đổi logic; message rõ (vd `feat(auth): add JWT login`, `fix(finance): ...`).
- **7.2 Không commit file nhạy cảm / thư mục build** (`.env`, `node_modules`, `dist`, log).
- **7.3 Cập nhật docs**: nếu thay đổi hành vi/API/schema, cập nhật tài liệu chuẩn tương ứng (không chỉ sửa code).

---

## Checklist trước khi báo "Xong"

- [ ] Đã đọc tài liệu chuẩn liên quan trước khi code
- [ ] Lint + Prettier pass, không lỗi mới
- [ ] Không `any` thừa, không dead code, không secret trong source/log
- [ ] Branch-scope enforce ở backend
- [ ] Test mới pass + không regress
- [ ] Migration (nếu có) tiến về trước, không sửa migration cũ
- [ ] Không chạm `docs/archive/`
- [ ] Báo cáo file thay đổi + xác nhận từng DoD
