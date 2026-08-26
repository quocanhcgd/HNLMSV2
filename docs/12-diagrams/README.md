# 📊 Diagrams - Index

> 📌 **Phần của bộ tài liệu chuẩn `docs/`** (chuyển từ obsidian vault v3).

## Tài liệu kỹ thuật (tham khảo)

| File | Nội dung | Ghi chú |
|---|---|---|
| [Technical-Architecture.md](./Technical-Architecture.md) | Kiến trúc tổng thể (mermaid) | Chuẩn kiến trúc hiện hành: `../01-architecture.md` |
| [Database-Schema-ERD.md](./Database-Schema-ERD.md) | ERD + SQL bảng | Chuẩn schema hiện hành: `../04-database-schema.md` |
| [API-Specification.md](./API-Specification.md) | API endpoints (v3) | Chuẩn API hiện hành: `../05-api/api-spec.yaml` |
| [User-Flow-Diagrams.md](./User-Flow-Diagrams.md) | User flows | Tham chiếu nghiệp vụ |
| [Role-Hierarchy-Canvas.canvas](./Role-Hierarchy-Canvas.canvas) | Sơ đồ phân cấp role (Obsidian canvas) | Mở trong Obsidian |
| [System-Architecture-Canvas.canvas](./System-Architecture-Canvas.canvas) | Sơ đồ kiến trúc (Obsidian canvas) | Mở trong Obsidian |

## Interactive Workflow Diagrams (HTML)

Mở trong browser — click từng bước để xem chi tiết (tiếng Việt):

> 🧭 **Tổng hợp toàn hệ thống (Canvas)**: [**Workflows-Canvas.html**](./Workflows-Canvas.html) — trình bày **đầy đủ 8 workflow** trên một trang Canvas duy nhất: tự động layout, kéo/zoom, màu theo vai trò, badge MVP/Roadmap. **Click node → drill-down nội dung giai đoạn** (mục tiêu, các bước thực hiện, vai trò tham gia, tiêu chí đạt) trích từ `../11-workflows/WF-*.md` + kết nối vào/ra của node. Dữ liệu tự tái tạo bằng `scripts/generate-workflows-canvas.js`.

| # | File | Workflow |
|---|---|---|
| WF-01 | [WF-01-Enrollment-Journey-Interactive.html](./WF-01-Enrollment-Journey-Interactive.html) | Hành trình ghi danh (MVP) |
| WF-02 | [WF-02-Teaching-Learning-Interactive.html](./WF-02-Teaching-Learning-Interactive.html) | Chu kỳ giảng dạy (MVP) |
| WF-03 | [WF-03-Financial-Operations-Interactive.html](./WF-03-Financial-Operations-Interactive.html) | Tài chính (MVP) |
| WF-04 | [WF-04-HR-Payroll-Interactive.html](./WF-04-HR-Payroll-Interactive.html) | HR & Payroll (P3) |
| WF-05 | [WF-05-Online-Hybrid-Learning-Interactive.html](./WF-05-Online-Hybrid-Learning-Interactive.html) | Online/Hybrid (P2) |
| WF-06 | [WF-06-Digital-Library-Interactive.html](./WF-06-Digital-Library-Interactive.html) | Thư viện số (P2) |
| WF-07 | [WF-07-AI-Assessment-Interactive.html](./WF-07-AI-Assessment-Interactive.html) | AI Assessment (P3) |
| WF-08 | [WF-08-Communication-Hub-Interactive.html](./WF-08-Communication-Hub-Interactive.html) | Communication Hub (P2) |
| — | [System-Operation-Visualization.html](./System-Operation-Visualization.html) | Tổng quan vận hành hệ thống |

> Sơ đồ WF-01/02/03 phản ánh luồng **MVP**; WF-04→WF-08 phản ánh **roadmap** (xem `../11-workflows/README.md`).

---

**Xem thêm**: [`11-workflows/`](../11-workflows/README.md) · [`README.md`](../README.md)
