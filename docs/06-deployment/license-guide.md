# License Guide: LMS On-Premise

> 📌 **Vị trí chuẩn**: `docs/06-deployment/` (đã hợp nhất). Bản gốc lịch sử: `archive/specs-001-lms-multi-branch/license-guide.md`.

**Version**: 1.1  
**Last Updated**: 2026-08-26

> ⚠️ **STATUS (D9 — 2026-08-26)**: Hệ thống quản lý license **CHƯA được triển khai** ở giai đoạn này. LMS hiện chạy với **license mặc định** (dev/evaluation) — không cần kích hoạt, không cần RSA. Tài liệu này mô tả thiết kế license đầy đủ cho **GIAI ĐOẠN SAU**, dùng làm tham chiếu khi kết nối hệ thống quản lý license. **Không áp dụng cho bản cài hiện tại.**

---

## Table of Contents

1. [License Model Overview](#license-model-overview)
2. [License Types](#license-types)
3. [License File Structure](#license-file-structure)
4. [Activation Process](#activation-process)
5. [Managing Addons](#managing-addons)
6. [License Constraints](#license-constraints)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## License Model Overview

LMS sử dụng mô hình **Base System + Paid Addons** với offline activation:

```
┌─────────────────────────────────┐
│      BASE SYSTEM LICENSE        │
│  • Perpetual or Subscription    │
│  • Includes core modules        │
│  • Constraints: students,       │
│    branches, storage            │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│     ADDON LICENSES (Optional)   │
│  • Separate serial keys         │
│  • Usually subscription-based   │
│  • Can be activated anytime     │
└─────────────────────────────────┘
```

**Key Features**:
- ✅ **Offline Activation**: No internet required after initial setup
- ✅ **Signed License File**: Cryptographic signature prevents tampering
- ✅ **Flexible Addons**: Add features as your needs grow
- ✅ **Constraint Enforcement**: Automatic limits on students, branches, storage

---

## License Types

### 1. Perpetual License (Base System)

**Characteristics**:
- One-time payment
- Lifetime usage rights
- Free updates for 1 year
- Optional extended support after 1 year

**Pricing Example**:
- Up to 500 students: $2,000 USD
- Up to 1,000 students: $3,500 USD
- Up to 2,000 students: $6,000 USD

**What happens after 1 year?**
- System continues to work indefinitely
- No forced upgrades
- Optional paid updates for new features
- Optional extended support contract

### 2. Subscription License (Addons)

**Characteristics**:
- Annual or monthly payment
- Automatic renewal
- Features disabled if not renewed
- Grace period: 30 days

**Common Addons**:
- Admission & CRM: $500/year
- Assessment & Testing: $600/year
- Online Classes: $400/year
- HRM & Payroll: $800/year
- Custom Integrations: $1,000/year
- API Access: $300/year

**Grace Period Behavior**:
- Days 1-30 after expiry: Full functionality with warning banner
- Day 31+: Addon features become read-only
- Data is preserved, but no new records can be created

---

## License File Structure

### Base License File Format

```json
{
  "license_id": "LIC-2024-001-ACME-EDU",
  "license_version": "1.0",
  "organization_name": "ACME Education Center",
  "issued_at": "2024-08-25T00:00:00Z",
  "issued_by": "LMS Vendor Co., Ltd.",
  
  "license_type": "perpetual",
  "expires_at": null,
  
  "constraints": {
    "max_students": 1000,
    "max_branches": 2,
    "max_storage_gb": 100
  },
  
  "base_modules": [
    "organization",
    "academic",
    "learning",
    "finance"
  ],
  
  "addons": [],
  
  "support_until": "2025-08-25T00:00:00Z",
  "updates_until": "2025-08-25T00:00:00Z",
  
  "signature": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA..."
}
```

### Subscription License Example

```json
{
  "license_id": "LIC-2024-002-ACME-EDU",
  "license_type": "subscription",
  "expires_at": "2025-08-25T00:00:00Z",
  
  "constraints": {
    "max_students": 500,
    "max_branches": 1,
    "max_storage_gb": 50
  },
  
  "signature": "..."
}
```

### License with Addons

```json
{
  "license_id": "LIC-2024-003-ACME-EDU",
  "license_type": "perpetual",
  "expires_at": null,
  
  "constraints": {
    "max_students": 1500,
    "max_branches": 3,
    "max_storage_gb": 200
  },
  
  "base_modules": [
    "organization",
    "academic", 
    "learning",
    "finance"
  ],
  
  "addons": [
    {
      "addon_id": "crm",
      "addon_name": "Admission & CRM",
      "serial_key": "CRM-A1B2-C3D4-E5F6-G7H8",
      "activated_at": "2024-08-25T00:00:00Z",
      "expires_at": "2025-08-25T00:00:00Z"
    },
    {
      "addon_id": "assessment",
      "addon_name": "Assessment & Testing",
      "serial_key": "TEST-X1Y2-Z3A4-B5C6-D7E8",
      "activated_at": "2024-09-01T00:00:00Z",
      "expires_at": null
    }
  ],
  
  "signature": "..."
}
```

---

## Activation Process

### Initial Activation (During Installation)

**Method 1: Upload License File**

1. During installation wizard, select **Upload License File**
2. Choose file: `license-acme-edu.json`
3. System validates signature
4. System saves license to database
5. Constraints are enforced immediately

**Method 2: Paste License Key**

1. During installation wizard, select **Enter License Key**
2. Paste key: `LIC-2024-001-ACME-EDU-BASE64ENCODED...`
3. System decodes and validates
4. License saved to database

### Activating Addons (After Installation)

**Via Command Line**:

```bash
# Activate addon with serial key
sudo lms-addon activate crm CRM-A1B2-C3D4-E5F6-G7H8

# Output:
# ✓ Addon "Admission & CRM" activated successfully
# ✓ Serial key validated
# ✓ Expires: 2025-08-25
# ✓ Restart services to apply changes

# Restart services
sudo systemctl restart lms-api lms-worker
```

**Via Web Interface**:

1. Login as Organization Admin
2. Navigate to **Settings → License**
3. Click **Addons** tab
4. Find addon in available list
5. Click **Activate**
6. Enter serial key
7. Click **Submit**
8. System validates and activates
9. New menu items appear immediately (may need page refresh)

### Updating License (Renewal or Upgrade)

**Scenario 1: Renew Expired Addon**

1. Receive new serial key from vendor
2. Navigate to **Settings → License → Addons**
3. Find expired addon
4. Click **Renew**
5. Enter new serial key
6. Addon reactivated with new expiry date

**Scenario 2: Upgrade Constraints**

1. Purchase license upgrade (e.g., 1000 → 2000 students)
2. Receive new license file
3. Navigate to **Settings → License**
4. Click **Update License**
5. Upload new license file
6. System validates and applies new constraints

**Scenario 3: Add More Branches**

Similar to upgrade, receive new license file with increased `max_branches`.

---

## Managing Addons

### Viewing Active Addons

**Via Web Interface**:
- Navigate to **Settings → License → Addons**
- See list of all addons with status:
  - ✅ **Active**: Working normally
  - ⚠️ **Expiring Soon**: <30 days until expiry
  - ⏸️ **Grace Period**: 0-30 days past expiry, read-only mode
  - ❌ **Expired**: >30 days past expiry, fully disabled

**Via Command Line**:

```bash
sudo lms-addon list

# Output:
# Addon ID        | Status  | Expires At          
# --------------- | ------- | -------------------
# crm             | Active  | 2025-08-25
# assessment      | Active  | Never (Perpetual)
# online-classes  | Expired | 2024-06-01
# hrm             | Grace   | 2024-08-15 (15 days overdue)
```

### Deactivating Addons

**Note**: You cannot manually deactivate a paid addon. It will automatically deactivate after expiry + grace period.

To remove addon features immediately:

```bash
sudo lms-addon deactivate crm --confirm

# Warning: This will hide all CRM features and data.
# Data will NOT be deleted, only hidden.
# Type 'YES' to confirm: YES

# ✓ Addon "Admission & CRM" deactivated
```

### Checking License Status

**Via Web Interface**:
- Dashboard shows license widget with:
  - License type (Perpetual/Subscription)
  - Students: 450 / 1000 (45%)
  - Branches: 2 / 2 (100%)
  - Storage: 35 GB / 100 GB (35%)
  - Expiry date (if applicable)

**Via Command Line**:

```bash
sudo lms-license status

# Output:
# License ID: LIC-2024-001-ACME-EDU
# Organization: ACME Education Center
# Type: Perpetual
# Issued: 2024-08-25
# 
# Constraints:
#   Students: 450 / 1000 (45%)
#   Branches: 2 / 2 (100% - At limit!)
#   Storage: 35.2 GB / 100 GB (35%)
# 
# Base Modules: ✓ 4 active
# Addons: ✓ 2 active, ⚠ 1 expiring soon
# 
# Support Until: 2025-08-25 (365 days remaining)
# Updates Until: 2025-08-25 (365 days remaining)
```

---

## License Constraints

### Student Limit

**What counts as a student?**
- Any record in `students` table with status `active`
- Graduated or withdrawn students (status `inactive`) don't count

**What happens when limit reached?**
- Cannot create new student records
- Error message: "Student limit exceeded. Current: 1000/1000. Please upgrade license."
- Existing students can continue using the system

**Workaround**:
- Archive graduated students: change status to `inactive`
- Or upgrade license to higher tier

### Branch Limit

**What counts as a branch?**
- Any record in `branches` table with status `active`
- Closed branches don't count

**What happens when limit reached?**
- Cannot create new branches
- Error: "Branch limit exceeded. Current: 2/2."

### Storage Limit

**What counts toward storage?**
- All files in `/var/lms/uploads/`
- Learning content, student documents, receipts, etc.

**How is it calculated?**
- Background job runs daily to sum file sizes
- Displayed in GB (1 GB = 1,000,000,000 bytes)

**What happens when limit reached?**
- File uploads blocked
- Error: "Storage quota exceeded. Used: 100.5 GB / 100 GB."
- Admin receives email notification at 90% and 100%

**Solutions**:
- Delete old files (receipts older than 7 years, old content)
- Upgrade license for more storage
- Implement external storage (S3-compatible)

---

## Signature Validation

### How It Works

1. License file contains JSON data + RSA signature
2. System has public key embedded: `/opt/lms/config/license-public-key.pem`
3. On activation, system:
   - Extracts signature from license file
   - Hashes license data with SHA-256
   - Verifies signature using public key
   - If valid, license is accepted

### Security

- **Private key**: Kept secret by vendor, used to sign licenses
- **Public key**: Embedded in LMS, used to verify signatures
- **Algorithm**: RSA-2048 with SHA-256
- **Tampering protection**: Any modification to license data invalidates signature

### What if signature is invalid?

```
Error: License signature validation failed.

This license file may be corrupted or tampered with.
Please download a fresh copy from the vendor portal
or contact support@lms-vendor.com for assistance.
```

**Common causes**:
- File corrupted during download
- File edited manually
- Wrong license file (for different product)

---

## Troubleshooting

### License Activation Failed

**Error: "Invalid signature"**

**Solution**:
1. Verify license file hash matches vendor-provided checksum:
   ```bash
   sha256sum license-acme-edu.json
   ```
2. Re-download license file from vendor portal
3. Ensure file is not opened/edited in text editor
4. Contact vendor if problem persists

**Error: "License already activated"**

**Solution**:
- This is informational, not an error
- License is already active in system
- To update/replace, use "Update License" button

**Error: "Constraint would be exceeded"**

**Solution**:
- New license has lower limits than current usage
- Example: New license allows 500 students, but you have 800
- Options:
  - Archive/remove excess students before activating
  - Purchase higher-tier license
  - Contact vendor for assistance

### Addon Activation Failed

**Error: "Invalid serial key"**

**Solution**:
1. Check for typos in serial key
2. Verify serial key is for correct addon
3. Ensure serial key hasn't been revoked
4. Contact vendor if key is definitely correct

**Error: "Serial key already used"**

**Solution**:
- Each serial key can only be used once
- If reinstalling, use same license file (includes addon activations)
- If moving to new server, contact vendor for key reset

**Error: "Base license required"**

**Solution**:
- Cannot activate addon without base license
- Activate base license first, then addons

### License Expiring Soon

**Notification**: "Your Admission & CRM addon will expire in 15 days"

**What to do**:
1. Contact vendor for renewal quote
2. Receive new serial key after payment
3. Navigate to **Settings → License → Addons**
4. Click **Renew** on expiring addon
5. Enter new serial key

**What happens if you don't renew?**
- Days 1-30: Full functionality with warning banner
- Day 31+: Addon enters read-only mode
  - Can view existing data
  - Cannot create/edit/delete records
  - Reports still work
- Data is NOT deleted

---

## FAQ

### Q: Can I transfer my license to a different server?

**A**: Yes, but requires vendor assistance.

1. Contact support@lms-vendor.com with:
   - Current license ID
   - Reason for transfer
   - New server IP/hostname
2. Vendor will issue a new license file for new server
3. Old license will be deactivated

**Note**: Self-service license transfer may be available in future versions.

### Q: What happens if my server crashes?

**A**: Your license is tied to your license file, not the server.

1. Reinstall LMS on new server (same process)
2. Restore database from backup
3. Use same license file to reactivate
4. Everything continues working

### Q: Can I use one license for multiple organizations?

**A**: No. Each license is for ONE organization.

- If you manage multiple schools, each needs its own license
- Volume discounts available for 3+ licenses
- Contact sales for multi-organization pricing

### Q: Do I need internet to validate license?

**A**: No, after initial activation.

- Activation process is offline (signature validation)
- No "phone home" or license server checks
- System works completely air-gapped if needed

### Q: What data is included in license file signature?

**A**: Everything except the signature itself:
- Organization name
- Constraints
- Expiry dates
- Addon list

This ensures any modification invalidates the signature.

### Q: Can I upgrade from Subscription to Perpetual?

**A**: Yes, contact vendor for upgrade pricing.

- Pay difference between subscription and perpetual
- Receive new perpetual license file
- Subscription license can be deactivated

### Q: What happens to my data if license expires?

**A**: Data is NEVER deleted due to license expiry.

- Base system (perpetual): Never expires
- Addons (subscription): 
  - After grace period, features become read-only
  - Data remains in database
  - Reactivating addon restores full access

### Q: Can I buy addons later, or must I buy everything now?

**A**: You can buy addons anytime.

- Start with base system only
- Add addons as your needs grow
- Each addon has separate serial key
- Can be activated without reinstalling

### Q: Do students/teachers count toward license limit?

**A**: Only students count.

- Teachers, staff, parents don't count toward student limit
- No limit on number of users (within reasonable use)
- Storage limit applies to all uploaded files

### Q: Can I extend support after the 1-year period?

**A**: Yes, extended support contracts available.

- Standard Support: $500/year (email, 48h response)
- Priority Support: $1,200/year (email + phone, 8h response)
- Enterprise Support: $3,000/year (24/7, 2h response, dedicated contact)

### Q: Are updates included forever with perpetual license?

**A**: Updates included for 1 year.

- Security patches: Always free
- Bug fixes: Always free
- New features: Free for 1 year, then optional paid updates

---

## Contact Support

**License Issues**: license@lms-vendor.com  
**Sales/Renewals**: sales@lms-vendor.com  
**Technical Support**: support@lms-vendor.com  
**Phone**: +84-xxx-xxx-xxx (Business hours: Mon-Fri 9AM-6PM GMT+7)

**Vendor Portal**: https://portal.lms-vendor.com  
- Download licenses
- View order history
- Manage renewals
- Submit support tickets

---

**Document Version**: 1.0  
**Last Updated**: 2026-08-25  
**Next Review**: 2027-02-25
