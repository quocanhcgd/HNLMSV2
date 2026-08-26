# LMS đa ngành đa chi nhánh - Documentation

> ⚠️ **TÀI LIỆU LỊCH SỬ (ARCHIVE)** — bộ đặc tả v2 gốc. Đã được hợp nhất vào **`docs/`** (nguồn chuẩn hiện tại).
> Xem: [`docs/README.md`](../../README.md) — Decision Log và bản đồ tài liệu. Một số nội dung ở đây (kiến trúc ghi "SaaS Multi-tenant", endpoint super-admin, plan.md/data-model.md cũ) **đã lỗi thời** so với quyết định on-premise.

**Version**: 2.0 (Revised)  
**Date**: 2026-08-25  
**Status**: Archived — thay thế bởi docs/ (v4.0)

---

## 📋 Documentation Index

### Core Documents

| Document | Purpose | Status | Last Updated |
|----------|---------|--------|--------------|
| [CHANGELOG.md](./CHANGELOG.md) | Architecture redesign summary | ✅ Complete | 2026-08-25 |
| [architecture-proposal.md](./architecture-proposal.md) | Detailed technical architecture | ✅ Complete | 2026-08-25 |
| [spec-v2.md](./spec-v2.md) | MVP feature specification | ✅ Complete | 2026-08-25 |
| [tasks-v2.md](./tasks-v2.md) | Implementation task list (76 tasks, 16 weeks) | ✅ Complete | 2026-08-25 |

### Guides

| Document | Purpose | Status | Last Updated |
|----------|---------|--------|--------------|
| [installation-guide.md](./installation-guide.md) | Server installation & setup | ✅ Complete | 2026-08-25 |
| [license-guide.md](./license-guide.md) | License activation & management | ✅ Complete | 2026-08-25 |

### Legacy Documents (Keep for Reference)

| Document | Purpose | Status | Notes |
|----------|---------|--------|-------|
| [spec.md](./spec.md) | Original specification | 🔄 Partially updated | Being replaced by spec-v2.md |
| [tasks.md](./tasks.md) | Original task list | ⚠️ Outdated | Being replaced by tasks-v2.md |
| [plan.md](./plan.md) | Original implementation plan | ⚠️ Outdated | Architecture changed significantly |
| [data-model.md](./data-model.md) | Original data model | ⚠️ Needs update | Multi-tenant schema no longer needed |

---

## 🎯 Project Overview

### What Changed?

**Business Model**: SaaS Multi-tenant → **On-Premise Self-Hosted**

**Rationale**:
- Vietnam data residency requirement
- Simpler for 2-person team
- Serial key model fits market
- Customer owns their data

### Key Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Frontend** | React 19 + Ant Design Pro | Mature, complete admin patterns, faster development |
| **Backend** | NestJS + PostgreSQL | Proven stack, good TypeScript support |
| **Database** | Single DB per installation | Simpler than multi-tenant |
| **License** | Offline activation | No license server needed |
| **Deployment** | Native systemd (no Docker) | Per customer requirement |
| **Team** | 2 Full-stack developers | Current team size |
| **Timeline** | 16 weeks (4 months) | Q3 2026 target |

---

## 📦 Product Structure

### Base System (Required)

Included with base license:

- ✅ Organization & Branch Management
- ✅ User & Role Management (RBAC)
- ✅ Academic Core (Programs, Courses, Classes)
- ✅ Student Enrollment & Progress
- ✅ Learning Content Library
- ✅ Finance & Billing
- ✅ Payment Gateway Integration (VNPay/Momo plugins)
- ✅ Reporting (Basic)

### Paid Addons (Optional)

Separate serial keys:

- 💰 Admission & CRM
- 💰 Assessment & Testing
- 💰 Online Classes Integration
- 💰 HRM & Payroll
- 💰 Advanced Reporting
- 💰 Custom Accounting/ERP Integration
- 💰 API Access & Webhooks

---

## 🛠️ Technical Stack

```yaml
Frontend:
  Framework: React 19
  UI Library: Ant Design 5.x + Ant Design Pro
  Build Tool: Vite 5.x
  State: TanStack Query + Zustand
  Forms: React Hook Form + Zod

Backend:
  Runtime: Node.js 20 LTS
  Framework: NestJS 10.x
  ORM: TypeORM
  Validation: class-validator

Database:
  Primary: PostgreSQL 15+
  Cache: Redis 7+
  Storage: Local filesystem or S3-compatible

Deployment:
  OS: Debian 12 / Ubuntu 22.04 LTS
  Web Server: Nginx
  Process Manager: systemd
  Package: .deb (dpkg/apt)
```

---

## 📅 Timeline

### Phase Breakdown (16 weeks)

| Week | Phase | Focus | Deliverable |
|------|-------|-------|-------------|
| 1-3 | Foundation | Monorepo, DB, Auth, License | Infrastructure working |
| 4-5 | Auth & License | JWT, License validation | Login + activation working |
| 6-7 | Core UI | Layout, navigation, components | Admin UI foundation |
| 8-9 | Organization & Users | Org, branches, users, roles | Multi-branch setup working |
| 10-12 | Academic Core | Programs, classes, enrollment | Class enrollment working |
| 13 | Student Learning | Portal, content library | Students can access materials |
| 14-15 | Finance & Billing | Invoices, payments, gateway | Payment flow working |
| 16 | Testing & Polish | Tests, docs, packaging | Beta-ready .deb package |

**Target**: Q3 2026 Beta Launch with 1-2 pilot customers

---

## 📊 Success Criteria

### MVP Launch (Q3 2026)

- ✅ Installed on 2 pilot customer servers
- ✅ 90% enrollment workflow success rate
- ✅ Payment gateway 99% success rate
- ✅ Zero branch data leakage
- ✅ License activation <5 minutes
- ✅ System uptime >99%

### Post-MVP (Q4 2026)

- 🎯 10 paying customers
- 🎯 3 addons released
- 🎯 <5 support tickets/customer/month
- 🎯 Customer satisfaction >4/5

---

## 🚀 Getting Started

### For Developers

1. Read [architecture-proposal.md](./architecture-proposal.md) for technical overview
2. Read [spec-v2.md](./spec-v2.md) for requirements
3. Read [tasks-v2.md](./tasks-v2.md) for implementation tasks
4. Start with **T001**: Initialize monorepo

### For Customers

1. Read [installation-guide.md](./installation-guide.md) for server setup
2. Read [license-guide.md](./license-guide.md) for activation
3. Download LMS package from vendor portal
4. Run installation wizard

---

## 📖 Next Steps

### Immediate (This Week)

1. ✅ Review and approve architecture proposal
2. ✅ Finalize technical decisions
3. ⏳ Setup development environment
4. ⏳ Create project repository
5. ⏳ Start Phase 1: Foundation

### Short-term (Next 2 Weeks)

1. Initialize monorepo structure
2. Setup CI/CD pipeline
3. Create database schema
4. Implement license validation
5. Build authentication system

### Medium-term (Month 2-3)

1. Complete core UI foundation
2. Build organization & user management
3. Implement academic core
4. Develop student learning portal

### Long-term (Month 4)

1. Complete finance & billing
2. Integration testing
3. Create installation package
4. Pilot customer deployment

---

## 📝 Document Status

### Completed ✅

- [x] CHANGELOG.md - Architecture redesign summary
- [x] architecture-proposal.md - Technical architecture (1000+ lines)
- [x] spec-v2.md - MVP specification with user stories
- [x] tasks-v2.md - 76 tasks with estimates and dependencies
- [x] installation-guide.md - Complete server setup guide
- [x] license-guide.md - License activation & management guide
- [x] README.md - This file

### Needs Update 🔄

- [ ] plan.md - Update with new architecture decisions
- [ ] data-model.md - Remove multi-tenant schema, add license tables
- [ ] contracts/api-contracts.md - Add license endpoints, remove tenant endpoints
- [ ] contracts/integration-contracts.md - Simplify to payment plugins only
- [ ] quickstart.md - Update validation scenarios for on-premise
- [ ] research.md - Add new decisions (Ant Design Pro, offline license)

### To Create ➕

- [ ] database-schema.md - Detailed PostgreSQL schema
- [ ] api-spec.yaml - OpenAPI 3.0 specification
- [ ] deployment-runbook.md - Operations playbook
- [ ] addon-development-guide.md - How to build addons
- [ ] security-checklist.md - Security hardening guide

---

## 🤝 Team Structure

### Current Team

- **Dev 1**: Full-stack (Backend focus)
  - Backend architecture
  - Database design
  - License system
  - Payment integration
  - DevOps & deployment

- **Dev 2**: Full-stack (Frontend focus)
  - UI/UX implementation
  - Component library
  - Form handling
  - Frontend architecture
  - User documentation

### Responsibilities

- **Both**: Planning, testing, code review, deployment
- **Weekly sync**: Progress review, blockers, next priorities
- **Daily standup**: Quick status update (5-10 min)

---

## 📞 Contact & Support

### Development Team

- **Project Lead**: [TBD]
- **Tech Lead**: [TBD]
- **Repository**: [TBD - GitHub/GitLab]
- **Project Management**: [TBD - Jira/Linear/Notion]

### Customer Support (After Launch)

- **Email**: support@lms-vendor.com
- **Phone**: +84-xxx-xxx-xxx
- **Portal**: https://portal.lms-vendor.com
- **Docs**: https://docs.lms-vendor.com

---

## 🔒 License & Copyright

**Copyright**: © 2026 [Your Company Name]  
**License**: Proprietary - All Rights Reserved  
**Version**: 1.0.0-beta

This software is licensed, not sold. Unauthorized copying, distribution, or modification is prohibited.

---

## 📚 Additional Resources

### External Documentation

- [React Documentation](https://react.dev)
- [Ant Design Documentation](https://ant.design)
- [NestJS Documentation](https://nestjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Best Practices

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [REST API Design](https://restfulapi.net/)
- [Database Design Patterns](https://www.databasedesignbook.com/)

---

## 🎉 Acknowledgments

Special thanks to:
- Architecture review and refinement
- Clarification on business model and requirements
- Timeline and scope adjustments for realistic delivery

---

**Last Updated**: 2026-08-25  
**Document Maintainer**: Development Team  
**Review Schedule**: Weekly during development, monthly post-launch
