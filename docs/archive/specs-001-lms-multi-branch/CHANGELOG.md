# Changelog: Architecture Redesign

**Date**: 2026-08-25  
**Status**: In Progress  
**Reason**: Refine for production-ready SaaS with realistic team size and timeline

---

## Major Changes Summary

### 1. Business Model Changes

**Old**: Complex SaaS multi-tenant với database-per-tenant và tenant migration  
**New**: On-premise self-hosted với offline license activation

**Rationale**:
- ✅ Vietnam data residency requirement (dữ liệu không ra khỏi premises khách hàng)
- ✅ Đơn giản hơn cho team 2 người (không cần quản lý multi-tenant infrastructure)
- ✅ Serial key model phù hợp với thị trường Vietnam
- ✅ Giảm complexity về billing, tenant provisioning, migration

**Impact**:
- ❌ Loại bỏ: Master database, tenant provisioning, subscription billing
- ✅ Thêm: License activation system, offline license validation
- ✅ Giữ: Module/addon architecture, feature flags

---

### 2. Frontend Stack Changes

**Old**: Next.js + shadcn/ui + Tailwind CSS 4 + 3 separate shells  
**New**: React 19 + Ant Design Pro + unified routing

**Rationale**:
- ✅ Ant Design Pro: Complete admin patterns out-of-box
- ✅ Proven in production (Alibaba, Ant Financial)
- ✅ Faster development với 2 người
- ✅ Không cần build UI primitives từ đầu
- ✅ i18n built-in (Vietnamese + English)

**Impact**:
- ❌ Loại bỏ: shadcn/ui setup, Tailwind config, theme preset versioning, 3 shells
- ✅ Thêm: Ant Design theming, ProComponents (ProTable, ProForm)
- ✅ Đơn giản hóa: Single app với role-based routing

---

### 3. Module System Simplification

**Old**: Complex module manifest + dependency graph + backend license gates  
**New**: Simple feature flags + addon serial keys

**Rationale**:
- ✅ Dễ implement với team nhỏ
- ✅ Rõ ràng cho customers (Base + Addons)
- ✅ Không over-engineer cho scale hiện tại

**Module Structure**:
```
Base System (included):
├── Organization & Branch Management
├── User & Role Management
├── Academic Core (Programs, Classes, Enrollments)
├── Student Learning (Portal, Progress)
└── Finance & Billing

Paid Addons (separate serial keys):
├── Admission & CRM
├── Assessment & Testing
├── Online Classes Integration
├── HRM & Payroll
├── Advanced Reporting
├── API Access
└── Custom Integrations (Accounting/ERP)
```

---

### 4. Database Strategy Change

**Old**: Master DB + Database-per-tenant với provisioning automation  
**New**: Single database per installation với organization isolation

**Rationale**:
- ✅ On-premise model: mỗi khách hàng có database riêng tự nhiên
- ✅ Đơn giản hơn nhiều cho deployment và backup
- ✅ Không cần connection pooling phức tạp
- ✅ Organization isolation đủ cho single installation

**Schema Structure**:
```
lms_database (per customer installation)
├── Core Tables
│   ├── organizations (thường chỉ 1 record)
│   ├── branches
│   ├── users
│   ├── roles & permissions
│   └── scope_grants
├── Academic Tables
│   ├── departments, programs, courses
│   ├── classes, schedules
│   └── students, enrollments
├── Finance Tables
│   ├── invoices, payments
│   └── transactions
├── Addon Tables (nullable nếu addon chưa active)
│   ├── leads, consultations (CRM addon)
│   ├── assessments, attempts (Testing addon)
│   ├── online_sessions (Online addon)
│   ├── employees, payroll (HRM addon)
│   └── ...
└── System Tables
    ├── license_activations
    ├── feature_flags
    └── audit_events
```

---

### 5. Deployment Model Change

**Old**: Native systemd deployment với CI/CD complexity  
**New**: Simple install script + systemd services

**Rationale**:
- ✅ Khách hàng tự cài trên server của họ
- ✅ Không cần sophisticated CI/CD (chỉ cần build artifact)
- ✅ Install wizard giúp setup nhanh
- ✅ Update qua file .deb hoặc tarball

**Installation Flow**:
```bash
1. Download LMS package
   - lms-base-v1.0.0.deb (or .tar.gz)
   - lms-addon-crm-v1.0.0.deb
   - lms-addon-hrm-v1.0.0.deb

2. Run installer
   $ sudo dpkg -i lms-base-v1.0.0.deb
   $ sudo lms-setup wizard
   
   Wizard prompts:
   - Database credentials
   - Admin user
   - License key (base system)
   - Organization info

3. Install addons (optional)
   $ sudo dpkg -i lms-addon-crm-v1.0.0.deb
   $ lms-addon activate crm SERIAL-KEY-HERE

4. Start services
   $ sudo systemctl start lms-web
   $ sudo systemctl start lms-api
   $ sudo systemctl start lms-worker
```

---

### 6. License Activation System

**New Component**: Offline license validation

**How it works**:

```typescript
// License file structure (JSON signed with private key)
{
  "license_id": "LIC-001-2024-ACME",
  "organization_name": "ACME Education",
  "license_type": "perpetual", // or "subscription"
  "issued_at": "2024-08-25T00:00:00Z",
  "expires_at": null, // null for perpetual
  "max_students": 1000,
  "max_branches": 2,
  
  "base_modules": [
    "organization", "academic", "learning", "finance"
  ],
  
  "addons": [
    {
      "addon": "crm",
      "serial_key": "CRM-XXXX-XXXX-XXXX",
      "expires_at": null
    },
    {
      "addon": "assessment", 
      "serial_key": "TEST-XXXX-XXXX-XXXX",
      "expires_at": "2025-08-25"
    }
  ],
  
  "signature": "RSA-SHA256-signature-here"
}
```

**Activation process**:
1. Customer receives license file + serial keys
2. Upload license file to system
3. System validates signature (offline)
4. System checks constraints (students, branches)
5. Activate addons with serial keys

**No phone-home**: Hệ thống hoạt động hoàn toàn offline sau khi activate

---

### 7. MVP Scope for Q3 2026

**Timeline**: ~4 months (Sep 2026 - Dec 2026) with 2 full-stack developers

**Phase 1: Foundation (3 weeks)**
- Monorepo setup
- Database schema
- Authentication & authorization
- License activation system

**Phase 2: Core UI (2 weeks)**
- Ant Design Pro setup
- Layout & navigation
- Common components (DataTable, FormBuilder)
- Theme configuration

**Phase 3: Organization & Users (2 weeks)**
- Organization management
- Branch CRUD
- User management
- Role & permission system
- Scope grants (branch-level access)

**Phase 4: Academic Core (3 weeks)**
- Department & Program management
- Course & Class management
- Student management
- Enrollment workflow
- Schedule management

**Phase 5: Student Learning (2 weeks)**
- Student portal
- Learning content library
- Progress tracking
- Student dashboard

**Phase 6: Finance & Billing (3 weeks)**
- Invoice management
- Payment integration (VNPay/Momo plugin architecture)
- Payment recording & reconciliation
- Receipt generation
- Accounting reports

**Phase 7: Testing & Polish (1 week)**
- Integration testing
- Bug fixes
- Documentation
- Deployment package

**Total**: ~16 weeks = 4 months

**Post-MVP Addons** (Q4 2026 onwards):
- Admission & CRM addon
- Assessment & Testing addon
- Online Classes addon
- HRM & Payroll addon

---

### 8. Technical Stack (Finalized)

```yaml
Frontend:
  Framework: React 19
  UI Library: Ant Design 5.x + Ant Design Pro
  Build Tool: Vite 5.x
  State Management: 
    - TanStack Query (server state)
    - Zustand (client state)
  Forms: React Hook Form + Zod
  Routing: React Router 6.x
  i18n: react-i18next

Backend:
  Runtime: Node.js 20 LTS
  Framework: NestJS 10.x
  ORM: TypeORM (hoặc Prisma)
  Validation: class-validator + class-transformer
  Documentation: @nestjs/swagger (OpenAPI 3.0)

Database:
  Primary: PostgreSQL 15+
  Cache/Queue: Redis 7+
  Search: PostgreSQL full-text (hoặc MeiliSearch nếu cần)

Storage:
  Files: Local filesystem (hoặc MinIO for S3-compatible)
  Documents: /var/lms/uploads/
  Backups: /var/lms/backups/

Worker:
  Queue: BullMQ (Redis-based)
  Scheduler: node-cron
  Jobs:
    - Email/SMS notifications
    - Payment reconciliation
    - Report generation
    - Backup automation

Deployment:
  OS: Debian 12 / Ubuntu 22.04 LTS
  Web Server: Nginx (reverse proxy + static files)
  Process Manager: systemd
  Monitoring: PM2 (process monitor) + journalctl (logs)
  Package: .deb package (dpkg/apt compatible)

Testing:
  Unit: Vitest
  Integration: Vitest + testcontainers
  E2E: Playwright
  API Testing: Supertest
```

---

### 9. Removed Features (for MVP)

Features được loại bỏ hoặc đơn giản hóa:

❌ **Removed entirely**:
- Multi-tenant SaaS infrastructure
- Tenant provisioning automation
- Master database & tenant database separation
- Subscription billing system
- Tenant migration tools
- Super-admin control plane
- Online license server
- Theme preset versioning system
- 3 separate application shells

⏸️ **Deferred to Addons**:
- Admission & CRM (addon)
- Assessment & Testing (addon)
- Online Classes Integration (addon)
- HRM & Payroll (addon)
- AI Assistance (addon)
- Advanced Reporting (addon)
- Parent Portal (có thể thêm vào base sau)
- Custom domain support
- SSO/SAML integration
- API webhooks

🔨 **Simplified**:
- Module system → Feature flags
- License verification → Offline signature validation
- Theme system → Simple Ant Design theming
- Navigation → Role-based menu filtering
- Deployment → Simple install script

---

### 10. Documentation Updates Needed

Files cần update:

1. ✅ **architecture-proposal.md** - Created
2. ✅ **CHANGELOG.md** - This file
3. 🔄 **spec.md** - Remove UI specs, add license model
4. 🔄 **plan.md** - Update decisions and structure
5. 🔄 **data-model.md** - Remove multi-tenant, add license tables
6. 🔄 **tasks.md** - Complete rewrite with MVP phases
7. 🔄 **contracts/api-contracts.md** - Add license endpoints
8. 🔄 **contracts/integration-contracts.md** - Payment plugins only
9. 🔄 **quickstart.md** - Update validation scenarios
10. 🔄 **research.md** - Add new decisions
11. ➕ **NEW: installation-guide.md** - Setup instructions
12. ➕ **NEW: license-guide.md** - License activation guide
13. ➕ **NEW: addon-development.md** - How to build addons

---

### 11. Risk Assessment

**Risks with new approach**:

⚠️ **Medium Risk**:
- Team size (2 people) cho timeline 4 tháng - **Mitigation**: MVP scope nhỏ, dùng proven libraries
- License cracking risk - **Mitigation**: RSA signature + obfuscation, acceptable for B2B
- Payment integration complexity - **Mitigation**: Plugin architecture, start with 1 provider

✅ **Low Risk**:
- Stack maturity (React, Ant Design, NestJS) - Proven in production
- Database strategy - Standard PostgreSQL usage
- Deployment model - Traditional VPS deployment

🎯 **Opportunities**:
- Faster development với Ant Design Pro
- Clear monetization với addon model
- Easier support (single installation per customer)
- Vietnam market fit (on-premise preference)

---

### 12. Success Criteria (Updated)

**MVP Launch (Q3 2026)**:
- ✅ 1-2 pilot customers using the system
- ✅ Core workflows functional: Enrollment → Learning → Payment
- ✅ License activation working
- ✅ Basic reporting for operations
- ✅ Stable enough for daily use

**Q4 2026 Goals**:
- 5-10 customers using base system
- 2-3 addons available (CRM, Assessment, Online)
- Customer feedback incorporated
- Performance optimizations
- Documentation complete

**2027 Goals**:
- 50+ customers
- Full addon suite
- Partner ecosystem (payment gateways, meeting platforms)
- SaaS option for small centers (optional pivot)

---

## Next Steps

1. **Review this changelog** - Approve overall direction
2. **Update documentation** - Apply changes to all spec files
3. **Create new artifacts** - Installation guide, license guide
4. **Setup development** - Initialize project structure
5. **Start Phase 1** - Foundation work

---

**Status**: Waiting for approval to proceed with documentation updates.
