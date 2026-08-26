# 🖥️ Dev Environment Setup (Windows)

> Chuẩn bị máy lập trình trước khi bắt đầu Phase 1 (Foundation, T001–T010).
> Phiên bản chuẩn theo D4: **Node 20 LTS · pnpm · PostgreSQL 15+ · Redis 7 (BullMQ)**. PostgreSQL 16 dùng được (schema yêu cầu 14+, chạy tốt trên 15/16).

## 1. Công cụ đã có / cần cài

| Công cụ | Trạng thái | Ghi chú |
|---|---|---|
| Node.js 20 LTS | ✅ cần có | Kiểm tra: `node --version` |
| npm | ✅ kèm Node | `npm --version` |
| pnpm | ⬜ cài | `npm install -g pnpm@9` |
| git | ✅ cần có | `git --version` |
| PostgreSQL 15/16 | ✅ cần có | Service `postgresql-x64-16` đang chạy |
| Redis 7 (BullMQ) | ⬜ cài | Windows: **Memurai Developer** (Redis 7-compatible, service native) |
| Chocolatey | ✅ tuỳ chọn | Dùng cho cài Memurai tự động |

## 2. Cách nhanh nhất — script tự động

Chạy **một lần** trong PowerShell (không cần mở trước bằng admin — script tự nâng quyền):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\dev-env-setup.ps1
```

Script sẽ:
1. Set execution policy `RemoteSigned` (CurrentUser) — để `pnpm.ps1` chạy được.
2. Cài **pnpm@9** qua npm (nếu chưa có).
3. Cài **Memurai Developer** qua Chocolatey (`choco install memurai-developer -y`); nếu thất bại fallback `redis-64`; rồi start service.
4. Hỏi mật khẩu superuser PostgreSQL → tạo **role `lms`** + **database `educenter_lms`** (UTF8), nạp `database/lms-schema.sql` + `lms-seed.sql`.
5. Verify: `node` · `pnpm` · `redis-cli ping` · `psql -U lms -c "SELECT 1"`.

> Mật khẩu role dev mặc định `lms_dev` — **đổi trước khi lên production** (xem `06-deployment/installation-guide.md`).

## 3. Cách thủ công (từng bước)

### 3.1 pnpm
```powershell
npm install -g pnpm@9
# Lỗi "Cannot find matching keyid" của corepack => bỏ qua corepack, cài thẳng pnpm như trên.
# PowerShell chặn pnpm.ps1 (ExecutionPolicy) => chạy:
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### 3.2 Redis (Memurai Developer — Redis 7 compatible)
```powershell
choco install memurai-developer -y   # tự đăng ký service 'Memurai', port 6379
# Hoặc cài tay: tải Memurai Developer từ memurai.com, chạy installer.
# Kiểm tra:
redis-cli ping   # hoặc memurai-cli ping  ->  PONG
```
> ⚠️ Nếu dùng bản port cũ `choco install redis-64` (Redis 5.0): BullMQ v5 yêu cầu Redis ≥ 6.2 — dùng tạm cho dev, **nên nâng lên Memurai**.

### 3.3 PostgreSQL: role + database + schema + seed
```powershell
psql -U postgres -h 127.0.0.1
```
```sql
CREATE ROLE lms LOGIN PASSWORD 'lms_dev';
CREATE DATABASE educenter_lms OWNER lms ENCODING 'UTF8' TEMPLATE template0;
\q
```
Nạp schema + seed (dùng user `lms`):
```powershell
$env:PGPASSWORD='lms_dev'
psql -U lms -h 127.0.0.1 -d educenter_lms -v ON_ERROR_STOP=1 -f database\lms-schema.sql
psql -U lms -h 127.0.0.1 -d educenter_lms -v ON_ERROR_STOP=1 -f database\lms-seed.sql
Remove-Item Env:PGPASSWORD
```
> Schema cần extension `uuid-ossp` — đã có trong `lms-schema.sql` (dòng 8), chạy với quyền đủ (owner `lms`).

## 4. Thông số kết nối dev

| Thành phần | Giá trị |
|---|---|
| Database URL | `postgresql://lms:lms_dev@127.0.0.1:5432/educenter_lms` |
| Redis | `127.0.0.1:6379` |
| API dev port | `3000` (NestJS, mặc định) |
| Web dev port | `5173` (Vite) |

Template `.env` cho `apps/api` (sẽ scaffold ở T004):
```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://lms:lms_dev@127.0.0.1:5432/educenter_lms
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_SECRET=dev-only-secret-change-me
```

## 5. Kiểm tra nhanh (sau khi cài)

```powershell
node --version            # v20.x
pnpm --version            # 9.x
redis-cli ping            # PONG
psql -U lms -h 127.0.0.1 -d educenter_lms -c "SELECT count(*) FROM users;"   # chạy được
```

## 6. Troubleshooting

| Triệu chứng | Cách xử lý |
|---|---|
| `pnpm.ps1 cannot be loaded` | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| corepack `Cannot find matching keyid` | Không dùng corepack; cài thẳng `npm install -g pnpm@9` |
| `choco` không có | Cài từ https://chocolatey.org/install (hoặc cài Memurai tay) |
| Quên mật khẩu postgres | Sửa `pg_hba.conf` → `trust` → restart → đổi mật khẩu → khôi phục |
| Memurai không start / port 6379 bận | `Get-Service Memurai` · `netstat -ano | findstr 6379` |
| PostgreSQL 16 vs spec 15 | Không ảnh hưởng — schema yêu cầu ≥ 14 |
| Muốn chạy Redis thật trên Windows | Dùng WSL2 + `apt install redis-server` (chậm hơn Memurai) |

## 7. Liên quan

- [installation-guide.md](./installation-guide.md) — cài đặt production (.deb, Nginx, systemd)
- [deployment-runbook.md](./deployment-runbook.md) — quy trình deploy
- [database/](../../database/00-setup-instructions.sql) — hướng dẫn tạo DB thủ công
