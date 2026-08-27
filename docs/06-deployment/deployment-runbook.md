# 06. Deployment Runbook — Operations Playbook

**Version**: 1.1 (MỚI — tạo trong đợt hợp nhất)
**Date**: 2026-08-26
**Status**: ✅ Nguồn chuẩn — dành cho DevOps/vận hành, bổ sung cho [`installation-guide.md`](./installation-guide.md)

---

## 1. Tổng quan hệ thống

| Thành phần | Service | Port | Mô tả |
|---|---|---|---|
| Web (SPA) | `lms-web` | 3000 (internal) | Static React build, Nginx phục vụ |
| API | `lms-api` | 4001 (internal) | NestJS REST API |
| Worker | `lms-worker` | — | BullMQ consumer + cron jobs |
| Nginx | `nginx` | 80/443 | Reverse proxy + TLS + static |
| PostgreSQL | `postgresql` | 5432 | `educ_lms` |
| Redis | `redis-server` | 6379 | Cache + queue |

### Đường dẫn chuẩn

| Đường dẫn | Nội dung |
|---|---|
| `/opt/lms/current` | Code (symlink tới release hiện tại) |
| `/opt/lms/config/api.env` | Cấu hình môi trường (bí mật) |
| `/opt/lms/config/license-public-key.pem` | Public key verify license — tùy chọn, để trống ở giai đoạn này (D9) |
| `/var/lms/uploads/` | File upload (học liệu, receipt...) |
| `/var/lms/backups/` | Backup |
| `/etc/systemd/system/lms-*.service` | systemd units |
| `/etc/nginx/sites-available/lms` | Nginx config |

### Cấu hình quan trọng (`api.env`)

```bash
NODE_ENV=production
PORT=4001
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=educ_lms
DATABASE_USER=lms
DATABASE_PASSWORD=<secret>
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=<random-64-char>
JWT_EXPIRES_IN=8h
UPLOAD_DIR=/var/lms/uploads
MAX_FILE_SIZE=524288000
LICENSE_PUBLIC_KEY=            # (D9) để trống — license mặc định; sẽ dùng khi kết nối hệ thống quản lý license
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=<secret>
BACKUP_DIR=/var/lms/backups
```

> **Bảo mật**: `api.env` chỉ `lms` user đọc được (`chmod 600`, `chown lms:lms`). `JWT_SECRET` phải random 64+ ký tự.

---

## 2. Vận hành hàng ngày / tuần / tháng

### Hàng ngày (5 phút)
- Kiểm tra service: `systemctl status lms-web lms-api lms-worker` (hoặc `lms-status`)
- Health check: `curl https://<host>/api/health` → `{"status":"healthy"}`
- Xem lỗi nhanh: `journalctl -u lms-api -p err --since "24 hours ago"`

### Hàng tuần
- Kiểm tra dung lượng: `df -h /var/lms` — upload tăng nhanh ở trung tâm có video
- Test khôi phục 1 file backup (xem §4)
- Kiểm tra dead-letter queue (nếu có alert)

### Hàng tháng
- Review audit: `SELECT count(*) FROM audit_events WHERE occurred_at > now() - interval '1 month';` + kiểm tra sự kiện bất thường
- VACUUM ANALYZE (hoặc bật autovacuum chuẩn)
- Rà soát license: giai đoạn này license mặc định (luôn active, D9) — không cần gia hạn. Khi có hệ thống quản lý license: `lms-addon list` — gia hạn trước 30 ngày [FUTURE]
- Cập nhật bảo mật OS: `sudo apt update && sudo apt upgrade -y` (theo cửa sổ bảo trì)

---

## 3. Service Management

```bash
# Trạng thái
sudo systemctl status lms-api
sudo systemctl list-units 'lms-*'

# Restart (sau khi đổi config/env)
sudo systemctl restart lms-api
sudo systemctl restart lms-worker
# Không cần restart lms-web (static)

# Logs
sudo journalctl -u lms-api -f            # theo dõi
sudo journalctl -u lms-worker -n 200     # 200 dòng gần nhất
sudo journalctl -u lms-api --since "1 hour ago" -p warning

# Reload config không dừng service (Nginx)
sudo nginx -t && sudo systemctl reload nginx
```

**Quy tắc**: thay đổi `api.env` luôn kèm `systemctl daemon-reload` + `restart lms-api lms-worker`. Thay đổi license/addon → restart `lms-api lms-worker` (FUTURE — khi có hệ thống quản lý license).

---

## 4. Backup & Restore

### 4.1 Những gì cần backup

| Thành phần | Cách backup | Tần suất khuyến nghị |
|---|---|---|
| PostgreSQL | `pg_dump` (logic) hoặc `pg_basebackup` (PITR) | Hàng đêm 02:00 |
| Uploads (`/var/lms/uploads`) | `tar` + gzip | Hàng đêm (cùng job) |
| Config (`/opt/lms/config`) | `tar` | Mỗi lần thay đổi config |
| License file | Lưu bản sao ngoài server — chỉ khi có license thật (FUTURE, D9) | Khi cấp mới |

**RPO mục tiêu**: ≤ 24h (backup đêm) · **RTO mục tiêu**: ≤ 4h (khôi phục từ backup)

### 4.2 Script backup chuẩn

`/opt/lms/scripts/backup.sh` (đã có từ installation-guide, bổ sung):

```bash
#!/bin/bash
set -euo pipefail
BACKUP_DIR="/var/lms/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "${BACKUP_DIR}"

# 1. DB (dump logic + nén)
pg_dump -h localhost -U lms -d educ_lms -Fc \
  -f "${BACKUP_DIR}/db_${DATE}.dump"
# -Fc custom format: hỗ trợ pg_restore chọn lọc, nén sẵn

# 2. Uploads
tar -czf "${BACKUP_DIR}/uploads_${DATE}.tar.gz" /var/lms/uploads

# 3. Config
tar -czf "${BACKUP_DIR}/config_${DATE}.tar.gz" /opt/lms/config

# 4. Giữ 30 ngày
find "${BACKUP_DIR}" -name "db_*.dump"    -mtime +30 -delete
find "${BACKUP_DIR}" -name "uploads_*.tar.gz" -mtime +30 -delete
find "${BACKUP_DIR}" -name "config_*.tar.gz"  -mtime +30 -delete

# 5. Kiểm tra file không rỗng
test -s "${BACKUP_DIR}/db_${DATE}.dump" || { echo "BACKUP FAILED: empty dump"; exit 1; }
echo "Backup OK: ${DATE}"
```

Cron: `0 2 * * * /opt/lms/scripts/backup.sh >> /var/log/lms-backup.log 2>&1`

### 4.3 Restore

```bash
# Khôi phục DB (tạo DB trống trước)
sudo -u postgres createdb -O lms educ_lms_restore
pg_restore -h localhost -U lms -d educ_lms_restore \
  --clean --if-exists /var/lms/backups/db_20260901_020000.dump

# Kiểm tra trước khi chuyển đổi
sudo -u postgres psql -d educ_lms_restore -c "SELECT count(*) FROM users;"

# Chuyển đổi (đổi tên DB)
sudo -u postgres psql -c "ALTER DATABASE educ_lms RENAME TO educ_lms_broken;"
sudo -u postgres psql -c "ALTER DATABASE educ_lms_restore RENAME TO educ_lms;"

# Khôi phục uploads
sudo tar -xzf /var/lms/backups/uploads_20260901_020000.tar.gz -C /
sudo chown -R lms:lms /var/lms/uploads

sudo systemctl restart lms-api lms-worker
```

### 4.4 Kiểm thử restore (bắt buộc)

> **Mỗi tháng**: khôi phục backup mới nhất vào một database tạm trên server dự phòng (hoặc container Postgres) và verify dữ liệu. Một backup chưa từng được restore không được coi là backup.

---

## 5. Monitoring & Alerting

### 5.1 Health endpoint

`GET /api/health` trả: `{ status, version, db: up|down, redis: up|down, timestamp }`. Cron mỗi 60s:

```bash
*/1 * * * * curl -sf https://<host>/api/health > /dev/null || echo "LMS DOWN" | mail -s "ALERT: LMS down" ops@lms-vendor.com
```

### 5.2 Chỉ số cần theo dõi

| Chỉ số | Ngưỡng cảnh báo | Cách lấy |
|---|---|---|
| CPU | > 85% trong 10 phút | `top` / Netdata / Prometheus |
| RAM | > 90% | `free -h` |
| Disk `/var/lms` | > 85% | `df -h` |
| DB connections | > 80% max_connections | `SELECT count(*) FROM pg_stat_activity;` |
| Redis memory | > 80% maxmemory | `redis-cli info memory` |
| Error rate API | > 1% trong 15 phút | journalctl + grep |
| Webhook failures | bất kỳ | `SELECT count(*) FROM inbox_events WHERE state='dead_letter';` |
| Backup thành công | không có file hôm nay | cron check |

### 5.3 Cài đặt tối thiểu (không Docker, theo constraint)

- **Netdata** (agent nhẹ) hoặc **Prometheus + node_exporter + Grafana** nếu khách có nhu cầu.
- **fail2ban** cho SSH (xem security-checklist).
- Alert qua email (cron + `mailx`) là đủ cho MVP.

---

## 6. Logging

| Log | Vị trí | Retention |
|---|---|---|
| API/Worker app logs | `journalctl -u lms-api` | systemd journal (journald `MaxRetentionSec`) |
| Audit (nghiệp vụ) | bảng `audit_events` | 7 năm (NFR-011) — partition tháng |
| Backup log | `/var/log/lms-backup.log` | 1 năm |
| Nginx access/error | `/var/log/nginx/` | logrotate mặc định |

- Mọi lỗi app có `correlation_id` (NFR-010) — dùng để nối request → audit.
- Cấu hình logrotate cho file tùy biến: `/etc/logrotate.d/lms`.

---

## 7. Upgrade (Nâng cấp)

### 7.1 Minor (v1.0.0 → v1.0.1)

```bash
# 1. Backup trước (BẮT BUỘC)
sudo lms-backup create

# 2. Cài gói mới
wget https://releases.lms-vendor.com/lms-base-v1.0.1.deb
sudo dpkg -i lms-base-v1.0.1.deb

# 3. Restart + verify
sudo systemctl restart lms-api lms-worker
curl https://<host>/api/health
```

### 7.2 Major (v1.x → v2.0)

1. Đọc upgrade guide của vendor (bắt buộc).
2. Backup đầy đủ + **test restore** trước.
3. Dừng write: thông báo bảo trì (có `maintenance` page) trong cửa sổ bảo trì.
4. Cài gói mới → chạy migration (`lms-migrate up` hoặc tự động qua postinst).
5. Verify schema: `lms-migrate status` + smoke test luồng Enrollment → Payment.
6. Mở lại service; theo dõi error 24h đầu.

> Migration DB **chỉ tiến về trước**; không có rollback tự động cho schema — rollback = restore backup (đây là lý do bước 1-2 bắt buộc).

---

## 8. Vận hành License & Addon (D9 — license mặc định)

> ⚠️ **(D9)** Giai đoạn này **không cần vận hành license**: hệ thống chạy license mặc định (luôn active). Endpoint `/api/license/status` là **điểm kết nối chờ** — sẽ hoạt động khi kết nối hệ thống quản lý license. Các lệnh addon/serial dưới đây là **FUTURE**.

```bash
# Trạng thái (FUTURE — hiện tại trả license mặc định)
sudo lms-addon list

# Kích hoạt addon (FUTURE)
sudo lms-addon activate crm CRM-XXXX-XXXX-XXXX-XXXX
sudo systemctl restart lms-api lms-worker

# Trạng thái license (điểm chờ — trả "Default (dev/evaluation)" hiện tại)
curl -H "Authorization: Bearer <admin-token>" https://<host>/api/license/status
```

| Tình huống | Thao tác |
|---|---|
| License base sắp hết updates_until [FUTURE] | Liên hệ vendor gia hạn hỗ trợ |
| Addon sắp hết hạn (< 30 ngày) [FUTURE] | Gửi serial mới: `lms-addon activate <id> <new-serial>` |
| Addon trong grace (0–30 ngày quá hạn) [FUTURE] | Cảnh báo banner; chức năng read-only từ ngày 31 |
| Addon hết hạn [FUTURE] | Tự động disabled; **dữ liệu không xóa**; kích hoạt lại khi có serial |
| Vượt max_students [FUTURE] | Chặn ghi danh mới; nâng cấp license (file mới) qua `/api/license/activate` |

---

## 9. Incident Runbooks

### 9.1 Service down (lms-api)

```bash
sudo systemctl status lms-api
sudo journalctl -u lms-api -n 100 --no-pager
# Nguyên nhân thường gặp:
#  - DB down → start postgresql
#  - Redis down → start redis-server
#  - Port conflict → lsof -i :4001
#  - api.env sai → kiểm tra DATABASE_* / JWT_SECRET
sudo systemctl restart lms-api
```

### 9.2 Disk đầy (/var/lms ≥ 90%)

```bash
df -h /var/lms
sudo du -sh /var/lms/* | sort -h
# Giải phóng: xóa backup > 30 ngày (đã có trong script), xóa tmp, xóa inbox_events cũ:
#   sudo -u postgres psql -d educ_lms -c "DELETE FROM inbox_events WHERE processed_at < now() - interval '90 days';"
# Cảnh báo khách nâng cấp ổ đĩa nếu upload video nhiều
```

### 9.3 Webhook thanh toán lỗi (khách báo trả tiền nhưng không cập nhật)

```bash
# 1. Kiểm tra inbox
sudo -u postgres psql -d educ_lms -c "SELECT * FROM inbox_events WHERE state='dead_letter' ORDER BY received_at DESC LIMIT 20;"
# 2. Kiểm tra chữ ký / replay window trong log
sudo journalctl -u lms-api --since "2 hours ago" | grep -i webhook
# 3. Reconcile thủ công: query provider qua payment_transactions.provider_reference
# 4. Nếu provider xác nhận thanh toán → ghi payment thủ công (đã audit)
```

### 9.4 Chậm / quá tải

```bash
htop                                  # CPU/RAM
sudo -u postgres psql -d educ_lms -c "SELECT pid, state, now()-query_start AS dur, query FROM pg_stat_activity WHERE state='active' ORDER BY dur DESC LIMIT 10;"
redis-cli info memory
# Khắc phục: VACUUM ANALYZE; bật cache; nếu do báo cáo lớn → chạy qua worker (async)
```

### 9.5 Sự cố bảo mật (nghi ngờ xâm nhập)

1. Cô lập: chặn IP nguồn tại firewall, thu hồi session (`/api/auth/logout` toàn bộ, đổi JWT_SECRET).
2. Thu thập: journalctl, audit_events, access log Nginx.
3. Thông báo khách + vendor; điều tra theo security-checklist §7.
4. Khôi phục từ backup sạch nếu cần (RTO ≤ 4h).

### 9.6 License hết hạn gây khóa hệ thống (base) [FUTURE — D9]

> Giai đoạn này license mặc định không hết hạn. Mục này áp dụng khi triển khai hệ thống quản lý license.

- Base perpetual không hết hạn; nếu là subscription base: sau grace → read-only.
- Xử lý: liên hệ vendor gia hạn → upload license mới → restart. **Không bao giờ** sửa DB trực tiếp để bỏ gate.

---

## 10. Cửa sổ bảo trì

- Mặc định: **Chủ nhật 02:00–04:00** (giờ VN) cho major upgrade/DB migration.
- Minor update/backup: không cần downtime (restart < 30s, worker queue trung gian).
- Thông báo: email cho admin khách ≥ 3 ngày trước major maintenance.

---

## 11. Capacity Planning

| Dấu hiệu | Hành động |
|---|---|
| Upload > 70% ổ đĩa | Mở rộng ổ / thêm S3-compatible (P2) |
| RAM > 90% thường xuyên | Lên 16GB; tách worker sang máy riêng |
| API latency > 500ms list pages | Tune PG (work_mem, shared_buffers), thêm index, cache Redis |
| Học viên > 2.000 | Xem scalability section `01-architecture.md` §8 |

---

## 12. Kiểm tra nhanh sau mọi thay đổi (Smoke Test)

```bash
# 1. Health
curl -s https://<host>/api/health | grep healthy
# 2. Login
TOKEN=$(curl -s -X POST https://<host>/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"admin@...","password":"..."}' | python3 -c "import sys,json;print(json.load(sys.stdin)['accessToken'])")
# 3. Context
curl -s https://<host>/api/me/context -H "Authorization: Bearer $TOKEN" | head -c 200
# 4. Danh sách chi nhánh
curl -s "https://<host>/api/organization/branches?page_size=1" -H "Authorization: Bearer $TOKEN"
```

---

**Xem thêm**: [`installation-guide.md`](./installation-guide.md) (cài đặt ban đầu) · [`license-guide.md`](./license-guide.md) · [`security-checklist.md`](../07-operations/security-checklist.md)
