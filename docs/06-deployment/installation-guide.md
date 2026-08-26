# Installation Guide: LMS On-Premise

> 📌 **Vị trí chuẩn**: `docs/06-deployment/` (đã hợp nhất). Bản gốc lịch sử: `archive/specs-001-lms-multi-branch/installation-guide.md`.

**Version**: 1.1  
**Target OS**: Debian 12 / Ubuntu 22.04 LTS  
**Last Updated**: 2026-08-26

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Pre-installation Checklist](#pre-installation-checklist)
3. [Installation Methods](#installation-methods)
4. [Post-installation Setup](#post-installation-setup)
5. [Troubleshooting](#troubleshooting)
6. [Uninstallation](#uninstallation)

---

## System Requirements

### Minimum Requirements (Up to 500 students)

- **CPU**: 2 vCPU (2.0 GHz+)
- **RAM**: 4 GB
- **Storage**: 50 GB SSD
- **OS**: Debian 12 or Ubuntu 22.04 LTS
- **Network**: 10 Mbps internet connection

### Recommended Requirements (500-1500 students)

- **CPU**: 4 vCPU (2.5 GHz+)
- **RAM**: 8 GB
- **Storage**: 100 GB SSD
- **OS**: Debian 12 or Ubuntu 22.04 LTS (fresh installation)
- **Network**: 50 Mbps internet connection

### Software Requirements

Will be installed automatically if missing:

- PostgreSQL 15+
- Redis 7+
- Node.js 20 LTS
- Nginx
- Certbot (for SSL)

---

## Pre-installation Checklist

### 1. Server Access

- [ ] SSH access to server with sudo privileges
- [ ] Root or sudo password available
- [ ] Firewall configured to allow ports: 80, 443, 22

### 2. Domain & DNS

- [ ] Domain name registered (e.g., `lms.your-school.edu.vn`)
- [ ] DNS A record pointing to server IP
- [ ] SSL certificate (or use Let's Encrypt during installation)

### 3. Database

- [ ] If using external PostgreSQL: connection string ready
- [ ] If installing locally: ensure port 5432 not in use

### 4. License (D9 — license mặc định)

> ⚠️ **(D9)** Giai đoạn này **không cần** license key/file. LMS chạy với **license mặc định** (dev/evaluation), không cần khóa RSA, không cần kích hoạt. Khi triển khai hệ thống quản lý license (giai đoạn sau), bước này sẽ nhận key/file từ hệ thống đó (điểm kết nối chờ).

- [ ] Không cần license key — xác nhận LMS tự chạy với license mặc định

### 5. Email Configuration (Optional but recommended)

- [ ] SMTP server credentials (Gmail, SendGrid, etc.)
- [ ] From address and display name

---

## Installation Methods

### Method 1: Automatic Installation (Recommended)

**Step 1: Download LMS Package**

```bash
# Download from vendor portal or received via email
wget https://releases.lms-vendor.com/lms-base-v1.0.0.deb

# Verify checksum
sha256sum lms-base-v1.0.0.deb
# Compare with provided checksum
```

**Step 2: Install Package**

```bash
# Install .deb package
sudo dpkg -i lms-base-v1.0.0.deb

# If missing dependencies, run:
sudo apt-get install -f
```

**Step 3: Run Setup Wizard**

```bash
sudo lms-setup wizard
```

The wizard will prompt for:

1. **Database Configuration**
   - Use local PostgreSQL? (Y/n): `Y`
   - Or enter external PostgreSQL connection string
   
2. **Admin User**
   - Email: `admin@your-school.edu.vn`
   - Full Name: `Administrator`
   - Password: (enter secure password)
   
3. **Organization Info**
   - Organization Name: `Your School Name`
   - Timezone: `Asia/Ho_Chi_Minh`
   - Academic Year Start Month: `9` (September)
   
4. **Domain & SSL**
   - Domain: `lms.your-school.edu.vn`
   - Setup SSL with Let's Encrypt? (Y/n): `Y`
   - Email for SSL certificate: `admin@your-school.edu.vn`

5. **License Status (D9 — license mặc định)**
   - Không cần upload file/paste key. Hệ thống tự chạy với license mặc định (dev/evaluation).
   - Xác nhận trạng thái hiển thị "Default (dev/evaluation)" — không cần kích hoạt.
   - (Khi triển khai hệ thống quản lý license, bước này sẽ kích hoạt bằng key/file từ hệ thống đó — điểm chờ.)

**Step 4: Start Services**

```bash
# Services should start automatically
# Verify status:
sudo systemctl status lms-web
sudo systemctl status lms-api
sudo systemctl status lms-worker

# If not running, start manually:
sudo systemctl start lms-web lms-api lms-worker
```

**Step 5: Access System**

Open browser and navigate to: `https://lms.your-school.edu.vn`

Login with admin credentials created in Step 3.

---

### Method 2: Manual Installation

For advanced users who want more control.

**Step 1: Install Dependencies**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL 15
sudo apt install -y postgresql-15 postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

**Step 2: Create Database**

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE lms_database;
CREATE USER lms_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE lms_database TO lms_user;
\q
```

**Step 3: Extract LMS Package**

```bash
# Create installation directory
sudo mkdir -p /opt/lms
cd /opt/lms

# Extract package
sudo dpkg-deb -x lms-base-v1.0.0.deb .

# Create system user
sudo useradd -r -s /bin/false lms

# Set permissions
sudo chown -R lms:lms /opt/lms
```

**Step 4: Configure Environment**

```bash
# Create config directory
sudo mkdir -p /opt/lms/config

# Create environment file
sudo nano /opt/lms/config/api.env
```

Add the following:

```bash
NODE_ENV=production
PORT=4000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=lms_database
DATABASE_USER=lms_user
DATABASE_PASSWORD=secure_password_here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=generate_random_secret_here
JWT_EXPIRES_IN=8h

# File Upload
UPLOAD_DIR=/var/lms/uploads
MAX_FILE_SIZE=524288000

# License (D9 — để trống, license mặc định; sẽ dùng khi kết nối hệ thống quản lý license)
LICENSE_PUBLIC_KEY=
```

**Step 5: Run Database Migration**

```bash
cd /opt/lms/current
sudo -u lms node dist/api/migration.js up
```

**Step 6: Create Systemd Services**

Create `/etc/systemd/system/lms-api.service`:

```ini
[Unit]
Description=LMS API Server
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=lms
Group=lms
WorkingDirectory=/opt/lms/current
Environment="NODE_ENV=production"
EnvironmentFile=/opt/lms/config/api.env
ExecStart=/usr/bin/node dist/api/main.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Create similar files for `lms-web.service` and `lms-worker.service`.

**Step 7: Configure Nginx**

Create `/etc/nginx/sites-available/lms`:

```nginx
server {
    listen 80;
    server_name lms.your-school.edu.vn;
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name lms.your-school.edu.vn;
    
    ssl_certificate /etc/letsencrypt/live/lms.your-school.edu.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lms.your-school.edu.vn/privkey.pem;
    
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/lms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Step 8: Setup SSL**

```bash
sudo certbot --nginx -d lms.your-school.edu.vn
```

**Step 9: Start Services**

```bash
sudo systemctl daemon-reload
sudo systemctl enable lms-web lms-api lms-worker
sudo systemctl start lms-web lms-api lms-worker
```

---

## Post-installation Setup

### 1. Verify Installation

```bash
# Check service status
sudo systemctl status lms-web lms-api lms-worker

# Check logs
sudo journalctl -u lms-api -n 50

# Test API health
curl https://lms.your-school.edu.vn/api/health
# Should return: {"status":"healthy"}
```

### 2. License Status (D9 — license mặc định)

> ⚠️ **(D9)** Giai đoạn này **không cần kích hoạt**. Hệ thống quản lý license chưa triển khai; LMS chạy license mặc định.

1. Login as admin
2. Navigate to **Settings → License**
3. Trạng thái hiển thị **"Default (dev/evaluation)"** — hoạt động bình thường, không cần Activate.
4. (Khi có hệ thống quản lý license, mục này sẽ kích hoạt bằng key/file — điểm chờ.)

### 3. Configure Email (Recommended)

1. Navigate to **Settings → Email**
2. Configure SMTP settings:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: `your-email@gmail.com`
   - Password: (use app password for Gmail)
   - From Name: `Your School LMS`
3. Send test email to verify

### 4. Setup Backup

```bash
# Create backup script
sudo nano /opt/lms/scripts/backup.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/var/lms/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
pg_dump -h localhost -U lms_user -d lms_database > ${BACKUP_DIR}/db_${DATE}.sql
gzip ${BACKUP_DIR}/db_${DATE}.sql

# Backup uploads
tar -czf ${BACKUP_DIR}/uploads_${DATE}.tar.gz /var/lms/uploads

# Cleanup old backups (keep 30 days)
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +30 -delete
find ${BACKUP_DIR} -name "*.tar.gz" -mtime +30 -delete
```

Schedule with cron:

```bash
sudo crontab -e

# Add line:
0 2 * * * /opt/lms/scripts/backup.sh
```

### 5. Setup Firewall

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## Installing Addons

### Step 1: Download Addon Package

```bash
wget https://releases.lms-vendor.com/lms-addon-crm-v1.0.0.deb
```

### Step 2: Install Addon

```bash
sudo dpkg -i lms-addon-crm-v1.0.0.deb
```

### Step 3: Activate Addon

```bash
sudo lms-addon activate crm CRM-XXXX-XXXX-XXXX-XXXX
```

Or via UI:
1. Login as admin
2. Navigate to **Settings → Addons**
3. Find "Admission & CRM" addon
4. Click **Activate**
5. Enter serial key
6. Restart services: `sudo systemctl restart lms-api lms-worker`

### Step 4: Verify Addon

Check that new menu items appear for addon features.

---

## Troubleshooting

### Service Won't Start

**Check logs:**

```bash
sudo journalctl -u lms-api -n 100
```

**Common issues:**

1. **Database connection failed**
   - Verify PostgreSQL is running: `sudo systemctl status postgresql`
   - Check credentials in `/opt/lms/config/api.env`
   - Test connection: `psql -h localhost -U lms_user -d lms_database`

2. **Port already in use**
   - Check what's using port: `sudo lsof -i :4000`
   - Change port in config file

3. **Permission denied**
   - Check file ownership: `ls -la /opt/lms/current`
   - Fix permissions: `sudo chown -R lms:lms /opt/lms`

### Cannot Access Website

1. **Check Nginx status**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t  # Test configuration
   ```

2. **Check DNS**
   ```bash
   nslookup lms.your-school.edu.vn
   ```

3. **Check firewall**
   ```bash
   sudo ufw status
   ```

4. **Check SSL certificate**
   ```bash
   sudo certbot certificates
   ```

### License Status Issues (D9 — license mặc định)

> Giai đoạn này license mặc định nên không có lỗi kích hoạt. Các mục dưới đây là **FUTURE** — chỉ áp dụng khi triển khai hệ thống quản lý license.

1. **"Invalid signature" error** [FUTURE]
   - Ensure license file is not corrupted
   - Download fresh copy from vendor (hệ thống quản lý license)
   - Verify file hash matches provided checksum

2. **"License expired" error** [FUTURE]
   - Contact vendor for license renewal
   - Check system clock: `date`

3. **"Constraint exceeded" error** [FUTURE]
   - License has limits (e.g., max 500 students)
   - Upgrade license or remove excess data

### Slow Performance

1. **Check resource usage**
   ```bash
   htop
   ```

2. **Check database performance**
   ```bash
   sudo -u postgres psql -d lms_database -c "SELECT * FROM pg_stat_activity;"
   ```

3. **Optimize database**
   ```bash
   sudo -u postgres psql -d lms_database -c "VACUUM ANALYZE;"
   ```

4. **Check Redis**
   ```bash
   redis-cli ping
   redis-cli info memory
   ```

---

## Uninstallation

### Complete Removal

**Warning**: This will delete all data permanently.

```bash
# Stop services
sudo systemctl stop lms-web lms-api lms-worker
sudo systemctl disable lms-web lms-api lms-worker

# Remove package
sudo dpkg -r lms-base

# Remove data (CAUTION: PERMANENT)
sudo rm -rf /opt/lms
sudo rm -rf /var/lms
sudo rm -rf /etc/systemd/system/lms-*

# Drop database
sudo -u postgres psql -c "DROP DATABASE lms_database;"
sudo -u postgres psql -c "DROP USER lms_user;"

# Remove Nginx config
sudo rm /etc/nginx/sites-enabled/lms
sudo systemctl reload nginx

# Remove system user
sudo userdel lms
```

### Keep Data for Migration

```bash
# Stop services only
sudo systemctl stop lms-web lms-api lms-worker

# Backup data
sudo tar -czf /tmp/lms-backup.tar.gz /var/lms /opt/lms/config

# Database dump
pg_dump -h localhost -U lms_user -d lms_database > /tmp/lms-database.sql
```

---

## Update / Upgrade

### Minor Updates (e.g., v1.0.0 → v1.0.1)

```bash
# Download new package
wget https://releases.lms-vendor.com/lms-base-v1.0.1.deb

# Backup current installation
sudo lms-backup create

# Install update
sudo dpkg -i lms-base-v1.0.1.deb

# Restart services
sudo systemctl restart lms-web lms-api lms-worker

# Verify
curl https://lms.your-school.edu.vn/api/health
```

### Major Upgrades (e.g., v1.0.0 → v2.0.0)

Follow vendor-provided upgrade guide. May require:
- Database schema migration
- Configuration file updates
- Data migration scripts

---

## Support

**Documentation**: https://docs.lms-vendor.com  
**Community Forum**: https://forum.lms-vendor.com  
**Email Support**: support@lms-vendor.com  
**Emergency Hotline**: +84-xxx-xxx-xxx

---

## Appendix: Server Hardening Checklist

- [ ] Change default SSH port
- [ ] Disable root SSH login
- [ ] Setup SSH key authentication
- [ ] Configure fail2ban for SSH
- [ ] Enable automatic security updates
- [ ] Setup log rotation
- [ ] Configure disk usage alerts
- [ ] Setup monitoring (e.g., Netdata, Prometheus)
- [ ] Regular backup testing
- [ ] Document recovery procedures

---

**Version**: 1.0  
**Last Updated**: 2026-08-25  
**Maintained By**: LMS Vendor Technical Team
