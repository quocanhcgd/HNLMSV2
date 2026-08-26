# Archive — Tài liệu lịch sử (KHÔNG phải nguồn chuẩn)

**Mục đích**: lưu giữ tài liệu cũ sau khi chuẩn hóa `docs/` thành một bộ duy nhất. Nội dung trong `archive/` **không được dùng làm cơ sở cho quyết định triển khai** — nguồn chuẩn là các tài liệu `00–12` ở `docs/`.

| Thư mục | Nội dung | Lý do archive |
|---|---|---|
| `specs-001-lms-multi-branch/` | Bộ đặc tả v2 gốc: spec-v2.md, architecture-proposal.md, data-model.md, plan.md, tasks.md, research.md, quickstart.md, contracts/api-contracts.md, CHANGELOG.md | Đã được hợp nhất/thay thế bởi `00–09`; một số nội dung (SaaS multi-tenant, super-admin) đã lỗi thời |
| `obsidian-vault/` | Bộ tài liệu v3: Project-Overview-v3.md, Analysis-13-Issues.md, COMPLETION-SUMMARY.md, FINAL-COMPLETION-SUMMARY.md, Project Overview.md, .obsidian/, _templates/ | Roles/Workflows/Diagrams đã chuyển sang `10-roles/`, `11-workflows/`, `12-diagrams/`; phần còn lại là phân tích/tầm nhìn |

## Quy tắc

1. Không sửa nội dung archive trừ khi cần bảo tồn chính xác lịch sử.
2. Khi một tài liệu chuẩn (`00–12`) lỗi thời: chuyển vào đây + cập nhật bản đồ liên kết ở `docs/README.md`.
3. Muốn tìm lại nguồn gốc của một quyết định → xem archive + `docs/README.md` (Decision Log).

**Xem thêm**: [`docs/README.md`](../README.md)
