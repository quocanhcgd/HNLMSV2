# 07. Security Checklist — Security Hardening Guide

**Version**: 1.1 (MỚI — tạo trong đợt hợp nhất)
**Date**: 2026-08-26
**Status**: ✅ Nguồn chuẩn — ánh xạ đầy đủ SEC-001..010 + NFR bảo mật từ spec v2, mở rộng cho vận hành thực tế

> **Mục đích**: checklist bảo mật cho cả giai đoạn phát triển (code review) và vận hành (hardening server khách). Áp dụng cho mọi installation on-premise.

---

## 1. Phạm vi & Nguyên tắc

**Nguyên tắc lõi**:
1. **Defense in depth** — bảo mật ở nhiều lớp (network → OS → app → data).
2. **Least privilege** — mọi user/service chỉ có quyền tối thiểu.
3. **Data residency** (FR-020) — dữ liệu không rời hạ tầng khách hàng; nếu cần support từ xa → session có kiểm soát + audit.
4. **Assume breach** — audit đầy đủ, backup có test restore, incident response sẵn sàng.

**Ánh xạ yêu cầu**: bảng cuối tài liệu (§11) map từng mục với SEC/NFR.

---

## 2. Server Hardening (OS)

- [ ] **SSH**: đổi port mặc định (tùy chọn) · tắt root login (`PermitRootLogin no`) · dùng SSH key, tắt password auth nếu khách đồng ý
- [ ] **fail2ban** cho SSH (và Nginx nếu cần): ban sau 5 lần fail/10 phút
- [ ] **Firewall** (ufw): chỉ mở 22, 80, 443; chặn 3000/4000/5432/6379 từ ngoài
  ```bash
  sudo ufw default deny incoming
  sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp
  sudo ufw enable
  ```
- [ ] **Auto security updates**: `unattended-upgrades` bật, reboot tự động có kiểm soát
- [ ] **User tối thiểu**: app chạy bằng user `lms` (không phải root); `/opt/lms`, `/var/lms` thuộc `lms:lms`
- [ ] **SELinux/AppArmor**: AppArmor bật (mặc định Ubuntu) cho postgres/nginx
- [ ] **Kernel hardening cơ bản** (sysctl): `net.ipv4.tcp_syncookies=1`, `net.ipv4.conf.all.rp_filter=1`
- [ ] **Disable service không dùng**: `systemctl list-unit-files --state=enabled` — tắt không cần thiết

## 3. PostgreSQL Hardening

- [ ] Chỉ listen `localhost` (`listen_addresses='127.0.0.1'`) — app và DB cùng máy
- [ ] `pg_hba.conf`: chỉ `scram-sha-256` cho user `lms_user`, không `trust`
- [ ] Mật khẩu DB mạnh (32+ ký tự random), riêng biệt với mọi mật khẩu khác
- [ ] User DB **không phải superuser**: `CREATE USER lms_user WITH PASSWORD '...' NOSUPERUSER NOCREATEDB NOCREATEROLE;`
- [ ] Chỉ grant cần thiết: `GRANT CONNECT, CREATE ON DATABASE`, quyền trên schema `public` có kiểm soát
- [ ] `ssl = on` nếu DB truy cập qua mạng (không nên truy cập từ ngoài)
- [ ] Backup mã hóa: `pg_dump -Fc` + gpg/openssl encrypt nếu backup ra ngoài máy
- [ ] Logging: `log_statement = 'ddl'`, `log_min_duration_statement = 1000` (chậm > 1s)
- [ ] Audit bảng nhạy cảm qua trigger (hoặc `pgaudit` nếu triển khai nâng cao)

## 4. Redis Hardening

- [ ] Chỉ listen `localhost` (`bind 127.0.0.1`, `protected-mode yes`)
- [ ] Đặt `requirepass` (random 32+ ký tự) — dù chỉ localhost
- [ ] Không chạy `--save ""` nếu dùng Redis làm cache quan trọng; cấu hình `maxmemory` + `maxmemory-policy allkeys-lru`
- [ ] Tắt lệnh nguy hiểm nếu không dùng: `rename-command FLUSHALL ""`, `rename-command FLUSHDB ""` (tùy chọn)
- [ ] Không expose Redis qua internet (firewall chặn 6379)

## 5. Nginx & TLS

- [ ] HTTPS bắt buộc: redirect 80 → 443 (NFR-013)
- [ ] TLS 1.2+; tắt TLS 1.0/1.1; ssl_protocols `TLSv1.2 TLSv1.3`
- [ ] Cipher mạnh: `ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:...'`
- [ ] HSTS: `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`
- [ ] Security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, CSP hợp lý cho SPA
- [ ] Giới hạn upload: `client_max_body_size 512m;` (tương ứng MAX_FILE_SIZE 500MB)
- [ ] Rate limit lớp Nginx dự phòng: `limit_req_zone $binary_remote_addr zone=api:10m rate=7r/m;` cho `/api/` (song song rate-limit app)
- [ ] `/api/health` không lộ thông tin nhạy cảm (chỉ status + version)
- [ ] Certbot tự gia hạn hoạt động (`systemctl status certbot.timer`); test renewal

## 6. Application Security (Backend)

### 6.1 Authentication (SEC-001..003, 006, 009)
- [ ] bcrypt cost ≥ 10 (`BCRYPT_ROUNDS=12` khuyến nghị)
- [ ] Access token 15 phút · refresh token 7 ngày HTTP-only + `SameSite=Lax` + `Secure`
- [ ] Session hết hạn 8h không hoạt động (SEC-002)
- [ ] Rate limit login 5 lần/15 phút/IP + lockout tạm thời (SEC-003)
- [ ] Hành động nhạy cảm (đổi role, xóa user, activate license [FUTURE — D9]) → re-authentication (SEC-009)
- [ ] Đăng nhập thất bại → audit event; không tiết lộ "email tồn tại" ở forgot-password

### 6.2 Authorization & Scope (FR-004, FR-005)
- [ ] Guard 4 tầng: JWT → Permission → **Scope (branch/class/student)** → Module effective state
- [ ] Scope check ở **service layer** (không chỉ UI); export/report cũng check (SEC-010)
- [ ] `scope_grants` hết hạn tự thu hồi (query filter `effective_to > now()`)
- [ ] Idempotency-Key validate định dạng + unique ở DB (tránh replay ghi trùng)

### 6.3 Input & Injection (NFR-014)
- [ ] 100% query qua TypeORM query builder/parameterized — **không nối chuỗi SQL**
- [ ] class-validator validate mọi DTO (kích thước, kiểu, enum, độ dài)
- [ ] Zod/React Hook Form validate client + server song song
- [ ] Escape output; không `dangerouslySetInnerHTML` với dữ liệu user
- [ ] SSRF guard: webhook/import không cho user chỉ định URL tùy ý tới internal network

### 6.4 License Crypto (SEC-005) — [FUTURE, D9]
> Giai đoạn này **chưa dùng RSA license** (license mặc định). Mục này áp dụng khi triển khai hệ thống quản lý license.
- [ ] Verify RSA-2048/SHA-256, public key nhúng trong package (không tải từ mạng)
- [ ] Clock tampering: so sánh thời gian hệ thống; cảnh báo nếu chênh lệch lớn
- [ ] Constraint check ở backend (không chỉ UI): max_students/max_branches/max_storage_gb
- [ ] Không lưu private key trên server khách (chỉ public key)
- [ ] Obfuscation code + anti-tamper cơ bản cho license module (B2B acceptable)

### 6.5 Audit (FR-006, NFR-011, SEC-007)
- [ ] Audit append-only, không cho user xóa/sửa; partition theo tháng; giữ 7 năm
- [ ] Ghi: actor, action, entity, before/after snapshot, correlation_id, IP
- [ ] Mọi giao dịch tài chính → audit (SEC-007); mọi thay đổi quyền/role → audit
- [ ] Secret không được ghi vào audit (mask password/token)

## 7. Data Protection

- [ ] **Encryption at rest** (NFR-012): full-disk LUKS (khuyến nghị) hoặc ít nhất encrypt backup; column-level cho 2FA secret, provider webhook secrets
- [ ] **Secrets management**: `api.env` chmod 600; không commit secret vào git; dùng `.env.example` với placeholder
- [ ] **Data residency** (FR-020): không gọi dịch vụ ngoài (AI, analytics) từ data; nếu có support từ xa → session giới hạn + audit + log
- [ ] **Retention & xóa an toàn**: audit 7 năm; dữ liệu học viên xóa theo yêu cầu khách (soft delete + purge có quy trình, trừ bắt buộc giữ tài chính)
- [ ] **Backup mã hóa** nếu chuyển ra ngoài máy (SFTP/scp qua SSH key)

## 8. File Upload (SEC-004, NFR-007)

- [ ] Giới hạn 500MB/file; whitelist MIME + magic bytes (không tin extension)
- [ ] Virus scan trước khi lưu (ClamAV daemon + hook upload)
- [ ] Lưu ngoài webroot (`/var/lms/uploads`), file name random (UUID), không dùng tên user
- [ ] Serve qua endpoint có authorization — không static-serve thư mục upload qua Nginx
- [ ] Mã hóa file nhạy cảm nếu policy yêu cầu (watermark/DRM là P2)

## 9. Webhook & Integrations (SEC-008, FR-011)

- [ ] Verify chữ ký webhook (HMAC/chuẩn provider) + timestamp replay window (≤ 5 phút)
- [ ] Inbox idempotent: unique (provider, external_event_id); ack sau persist
- [ ] Không xử lý redirect/browser callback như thanh toán thành công
- [ ] Secret webhook lưu encrypted, không log
- [ ] Provider adapter theo contract ([`05-api/integration-contracts.md`](../05-api/integration-contracts.md)): retry + dead-letter + reconcile

## 10. Vulnerability & Patch Management

- [ ] `npm audit` / `pnpm audit` trong CI — chặn build nếu critical chưa xử lý
- [ ] `pnpm outdated` hàng tuần; ưu tiên patch security (antd, nestjs, typeorm, express)
- [ ] Theo dõi CVE cho: Node.js 20 LTS, PostgreSQL 15, Redis 7, Nginx, Ubuntu/Debian
- [ ] Unattended-upgrades cho OS security; app updates theo lịch minor hàng tháng
- [ ] Có quy trình **incident response**: phân loại (S1-S3), cô lập, thu thập, khôi phục, postmortem
- [ ] Liên hệ vendor (lms-vendor) khi phát hiện lỗ hổng trong sản phẩm — kênh `security@lms-vendor.com`

## 11. Bảng ánh xạ yêu cầu bảo mật

| Yêu cầu | Nội dung | Mục áp dụng |
|---|---|---|
| SEC-001 | bcrypt cost ≥ 10 | §6.1 |
| SEC-002 | Session 8h | §6.1 |
| SEC-003 | Login rate-limit 5/15p | §6.1 |
| SEC-004 | Virus scan upload | §8 |
| SEC-005 | RSA-2048 license (FUTURE, D9) | §6.4 |
| SEC-006 | JWT validate | §6.1 |
| SEC-007 | Audit tài chính | §6.5 |
| SEC-008 | Webhook verify | §9 |
| SEC-009 | Admin re-auth | §6.1 |
| SEC-010 | Export check permission | §6.2 |
| NFR-012 | Encryption at rest | §7 |
| NFR-013 | HTTPS | §5 |
| NFR-014 | Chống SQLi | §6.3 |
| NFR-015 | Rate-limit 100/15p | §5 + app |
| FR-004 | Branch scope | §6.2 |
| FR-020 | Data residency | §7 |

## 12. Checklist trước khi bàn giao cho khách (Go-Live)

- [ ] Tất cả mục §2–§10 đã pass (hoặc có exception được duyệt)
- [ ] Test độc lập branch isolation: manager A không thấy dữ liệu branch B
- [ ] Pentest cơ bản: login brute-force, SQLi probes, upload file lạ, path traversal
- [ ] Test webhook: gửi trùng event → không trùng payment
- [ ] Backup + restore đã test; tài liệu khôi phục sẵn cho khách
- [ ] Password mặc định của admin đã đổi; demo accounts bị vô hiệu hóa
- [ ] TLS cert hợp lệ + auto-renew hoạt động
- [ ] License status hiển thị đúng (giai đoạn này: "Default (dev/evaluation)"); constraint enforced [FUTURE, D9]
- [ ] SOP incident (runbook §9) đã chuyển cho khách + vendor

---

**Xem thêm**: [`deployment-runbook.md`](../06-deployment/deployment-runbook.md) (vận hành & incident) · [`02-spec.md`](../02-spec.md) §6 (SEC requirements)
