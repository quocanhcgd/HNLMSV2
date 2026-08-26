---
title: Project Overview
created: 2026-08-25
updated: 2026-08-25
tags: [overview, summary, ai-powered]
---

# 🎓 AI-Powered LMS - Đa ngành, Đa chi nhánh, Online/Offline

**Version**: 3.0 (AI-Enhanced Architecture)  
**Status**: Enhanced Design Complete, Ready for Implementation  
**Target Launch**: Q3 2026 (Sep-Dec)  
**Key Innovation**: 🤖 AI-First Learning Platform

---

## Executive Summary

**AI-powered, self-hosted Learning Management System** cho trung tâm đào tạo tư nhân tại Vietnam, hỗ trợ **đa ngành**, **đa chi nhánh**, và **online/offline/hybrid learning**. Hệ thống cài đặt trên server riêng của khách hàng, kích hoạt bằng **license key offline**, đảm bảo **data residency** và bảo mật thông tin.

**Key Differentiators**:
- 🤖 **AI-First**: AI teaching assistant, auto-grading, personalized learning paths
- 🎥 **Hybrid Learning**: Online, offline, and blended class support with seamless switching
- 🌐 **Multi-Industry**: Language, IT, Design, Cooking, and 10+ domains with specialized workflows
- 📚 **Digital Library**: Rich content platform with interactive learning materials and progress tracking
- 💬 **Communication Hub**: Integrated messaging for staff, students, teachers, and parents
- 📱 **Mobile-First**: Responsive design, PWA support, native app ready
- ✅ **On-premise**: Customer owns their data, meets Vietnam data residency requirements
- ✅ **Offline License**: No dependency on license server
- ✅ **Multi-branch**: Support multiple locations with centralized management
- ✅ **Modular**: Base system + paid addons for flexibility
- ✅ **Production-ready**: Built for 500-1500 students per installation, scalable to 5000+

---

## Business Model

### Distribution Model
**Self-hosted on-premise** - Customer installs on their own server

### Licensing Model
```
┌─────────────────────────────────────────────────┐
│          BASE SYSTEM (Perpetual)                │
│  • Organization & Branch Management             │
│  • User & Role Management (17 roles)            │
│  • Academic Core (Programs, Classes, Students)  │
│  • Student Learning Portal                      │
│  • Finance & Billing                            │
│  • Digital Library (Basic)                      │
│  • Communication (Basic messaging)              │
│  • Offline/Online Class Support                 │
│  • Responsive Design (Mobile-ready)             │
│  Price: $3,000-8,000 one-time                   │
└─────────────────────────────────────────────────┘
                        +
┌─────────────────────────────────────────────────┐
│          PAID ADDONS (Subscription)             │
│  • AI Teaching Assistant: $1,200/year           │
│  • Advanced Assessment & AI Grading: $800/year  │
│  • Hybrid Learning & Live Streaming: $600/year  │
│  • HRM & Payroll: $800/year                     │
│  • Student Portal Enhancement (Parent): $400/yr │
│  • Multi-Industry Customization: $1,000/year    │
│  • Advanced Analytics & Predictions: $700/year  │
│  • Landing Page CMS & Marketing: $500/year      │
│  • Custom Integrations: $1,000/year             │
└─────────────────────────────────────────────────┘
```

### Target Market
- **Primary**: Private education centers in Vietnam
- **Size**: 1-5 branches, 500-1500 students (scalable to 5000+)
- **Industries**: 
  - Language training (English, Japanese, Korean, Chinese)
  - IT & Programming (Web dev, Mobile dev, Data Science)
  - Vocational training (Design, Accounting, Marketing)
  - Skills training (Cooking, Music, Art, Soft skills)
  - Test prep (IELTS, TOEIC, SAT, University entrance)
- **Pain Points**: 
  - Spreadsheet chaos, manual processes, no centralized system
  - Cannot support online/hybrid learning effectively
  - Manual grading takes too much time
  - No personalized learning paths
  - Poor parent-school communication
  - Limited to single industry/teaching method

---

## Technical Architecture

### Frontend Stack
```yaml
Framework: React 19
UI Library: Ant Design 5.x + Ant Design Pro
Build Tool: Vite 5.x
State Management:
  - TanStack Query (server state)
  - Zustand (client state)
Routing: React Router 6.x
Forms: React Hook Form + Zod
i18n: react-i18next (Vietnamese + English)
```

### Backend Stack
```yaml
Runtime: Node.js 20 LTS
Framework: NestJS 10.x
ORM: TypeORM
Database: PostgreSQL 15+
Cache/Queue: Redis 7+ (BullMQ for jobs)
Validation: class-validator
API Docs: OpenAPI 3.0 (Swagger)
AI/ML:
  - OpenAI API (GPT-4, Whisper for speech)
  - Anthropic Claude (alternative)
  - Custom ML models (TensorFlow.js)
  - Vector DB: pgvector (for semantic search)
Real-time: Socket.IO (chat, notifications)
Media: FFmpeg (video processing)
```

### Deployment
```yaml
Target OS: Debian 12 / Ubuntu 22.04 LTS
Web Server: Nginx (reverse proxy)
Process Manager: systemd
Package Format: .deb (dpkg/apt)
Storage: Local filesystem or S3-compatible
Monitoring: Journalctl logs + optional Prometheus
```

**Why No Docker?**
- Customer requirement for native deployment
- Simpler for small IT teams to manage
- Lower resource overhead
- Better performance for single-server deployments

---

## System Capabilities

### Core Features (Base System)

**Organization Management**
- Multi-branch support with centralized control
- Branch-specific settings and configurations
- Organization-wide reporting and analytics

**User & Access Control**
- Role-based access control (RBAC)
- 17 predefined roles (14 base + 3 addon)
- Branch-level and class-level scope grants
- Audit logging for all sensitive operations

**Academic Management**
- Multi-department and multi-program support
- Course and class management
- Teacher assignment and scheduling
- Student enrollment workflow
- Progress tracking and grading

**Learning Portal**
- Student dashboard with enrolled classes
- Learning content library (documents, videos)
- Assignment submission and grading
- Attendance tracking
- Gradebook and progress reports

**Finance & Billing**
- Automatic invoice generation from enrollment
- Multiple payment methods (online, cash, bank transfer)
- Payment gateway integration (VNPay, Momo)
- Receipt generation (PDF)
- Receivables tracking and reminders
- Financial reports by branch

---

### Addon Features (Post-MVP)

**Admission & CRM**
- Landing page CMS
- Lead capture and management
- Consultant assignment and workflow
- Consultation tracking
- Conversion funnel analytics

**Assessment & Testing**
- Entrance exam management
- Mock tests and practice exams
- Auto-grading for multiple choice
- Manual grading interface for essays
- English pathway tracking (4 skills)

**Online Classes Integration**
- Meeting platform integration (Zoom, Google Meet, MS Teams)
- Session scheduling and links
- Attendance sync from meeting provider
- Recording management with access control

**HRM & Payroll**
- Employee lifecycle management
- Attendance and leave tracking
- Teaching hours calculation
- Salary calculation engine
- Payslip generation
- Payroll approval workflow

**Advanced Reporting**
- Custom report builder
- Data export (Excel, PDF)
- Scheduled report delivery
- Executive dashboards

**Custom Integrations**
- Accounting/ERP sync
- Payment gateway plugins
- SMS/Email provider integration
- Webhook support for external systems

---

## User Roles (17 Roles)

### Management (5 roles)
- [[Organization Admin]] - Full system control
- [[Branch Manager]] - Branch operations
- [[System Admin]] - Technical administration
- [[Academic Manager]] - Curriculum oversight
- [[HR Manager]] - Employee management (addon)

### Academic (3 roles)
- [[Teacher]] - Instruction and assessment
- [[Librarian]] - Content management
- [[Payroll Officer]] - Salary processing (addon)

### Admission & Support (3 roles)
- [[Admission Consultant]] - Lead conversion
- [[Receptionist]] - First contact
- [[Customer Support]] - User assistance

### Finance (2 roles)
- [[Finance Officer]] - Payment processing
- [[Accountant]] - Financial reporting

### Learners (2 roles)
- [[Student]] - Primary users
- [[Parent]] - Family oversight (addon)

### Technical (2 roles)
- [[IT Support]] - Troubleshooting
- [[System Admin]] - Infrastructure

---

## Critical Workflows

### [[WF-01 Enrollment Journey]]
**Lead → Student conversion process (5-7 days)**

```
Lead Capture → Consultation → Assessment → 
Enrollment → Payment → Activation → Active Student
```

**Key Metrics**:
- Conversion rate: 40%
- Average cycle: 5-7 days
- Payment success: 98%
- First class attendance: 95%

---

### [[WF-02 Teaching & Learning Cycle]]
**Ongoing learning process**

```
Class Planning → Content Upload → Class Delivery →
Assignment → Grading → Feedback → Progress Tracking
```

**Key Activities**:
- Teacher prepares materials
- Students access content
- Attendance tracking
- Assessment and grading
- Progress monitoring

---

### [[WF-03 Financial Operations]]
**Invoice → Payment → Receipt flow**

```
Invoice Generation → Payment Collection →
Verification → Receipt Issue → Reconciliation
```

**Payment Methods**:
- Online (VNPay, Momo) - 60%
- Cash at counter - 25%
- Bank transfer - 15%

---

### [[WF-04 HR & Payroll]] (Addon)
**Monthly payroll processing**

```
Attendance → Hours Calculation → Salary Calculation →
Approval → Payslip Generation → Payment
```

**Components**:
- Base salary
- Teaching hours (hourly rate)
- Bonuses and deductions
- Tax calculations

---

## Implementation Timeline

### Phase 1: Foundation (Week 1-3)
- Monorepo setup
- Database schema
- Authentication & authorization
- License activation system

### Phase 2: Core UI (Week 4-7)
- Ant Design Pro setup
- Layout and navigation
- Common components
- i18n setup

### Phase 3: Organization & Users (Week 8-9)
- Organization management
- Branch CRUD
- User management
- Role assignment

### Phase 4: Academic Core (Week 10-12)
- Programs and courses
- Class management
- Student enrollment
- Teacher assignment

### Phase 5: Student Learning (Week 13)
- Student portal
- Content library
- Progress tracking
- Gradebook

### Phase 6: Finance & Billing (Week 14-15)
- Invoice management
- Payment processing
- Payment gateway integration
- Receipts and reports

### Phase 7: Testing & Polish (Week 16)
- Unit and integration tests
- E2E tests for critical flows
- Documentation
- Deployment package

**Total Duration**: 16 weeks (~4 months)  
**Target Launch**: Q3 2026 (Sep-Dec)

---

## Success Criteria

### MVP Launch (Q3 2026)
- ✅ Installed on 2 pilot customer servers
- ✅ 90% enrollment workflow success rate
- ✅ Payment gateway 99% success rate
- ✅ Zero branch data leakage (security)
- ✅ License activation <5 minutes
- ✅ System uptime >99% (pilot period)

### Post-MVP (Q4 2026)
- 🎯 10 paying customers using base system
- 🎯 3 addons released and purchased
- 🎯 <5 support tickets per customer per month
- 🎯 Customer satisfaction score >4/5
- 🎯 Average time to resolve ticket <24 hours

---

## Team Structure

### Current Team (2 people)

**Developer 1** (Backend focus):
- Backend architecture and API development
- Database design and optimization
- License system implementation
- Payment gateway integration
- DevOps and deployment automation

**Developer 2** (Frontend focus):
- UI/UX implementation with Ant Design Pro
- Component library development
- Form handling and validation
- Frontend routing and state management
- User documentation

**Shared Responsibilities**:
- Planning and design reviews
- Code reviews
- Testing (unit, integration, E2E)
- Bug fixes and maintenance
- Customer support (during pilot)

---

## Risk Management

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Team capacity (2 people) | High | Use proven libraries, minimize custom code |
| Timeline (4 months) | High | Strict MVP scope, defer nice-to-haves |
| Payment gateway integration | Medium | Plugin architecture, start with one provider |
| License cracking | Medium | RSA signature + obfuscation, acceptable for B2B |

### Business Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Customer installation issues | High | Detailed guide, automated setup wizard, remote support |
| Low adoption | Medium | 2 pilot customers for validation, iterate based on feedback |
| Competition | Medium | Focus on Vietnam market, on-premise USP, local support |

---

## Key Decisions (Architecture Decision Records)

### ADR-001: On-Premise vs SaaS
**Decision**: On-premise self-hosted  
**Rationale**: Vietnam data residency, customer data ownership, market preference  
**Trade-offs**: Harder to support, more complex deployment

### ADR-002: Offline License Activation
**Decision**: RSA-signed license file, no online validation  
**Rationale**: Works without internet, no dependency on license server  
**Trade-offs**: Easier to crack, but acceptable for B2B market

### ADR-003: Ant Design Pro vs Custom Design System
**Decision**: Ant Design Pro  
**Rationale**: Faster development, proven patterns, good documentation  
**Trade-offs**: Less unique UI, but acceptable for internal-use system

### ADR-004: Database-per-Installation vs Multi-tenant
**Decision**: Single database per installation  
**Rationale**: On-premise model naturally isolates, simpler architecture  
**Trade-offs**: Cannot share infrastructure, but not needed for on-premise

### ADR-005: Native Systemd vs Docker
**Decision**: Native systemd deployment  
**Rationale**: Customer requirement, simpler for small IT teams  
**Trade-offs**: Harder to ensure consistency, but use .deb package to mitigate

---

## Obsidian Vault Contents

### Documentation Structure

```
obsidian-vault/
├── README.md (this file)
├── 01-Roles/ (17 role definitions)
│   ├── Organization Admin.md ✅
│   ├── Branch Manager.md ✅
│   ├── Teacher.md ✅
│   ├── Student.md ✅
│   ├── Finance Officer.md ✅
│   └── ... (12 more)
├── 02-Workflows/ (4+ critical workflows)
│   ├── WF-01 Enrollment Journey.md ✅
│   ├── WF-02 Teaching & Learning Cycle.md
│   ├── WF-03 Financial Operations.md
│   └── WF-04 HR & Payroll.md
├── 03-Diagrams/
│   ├── WF-01-Enrollment-Journey-Interactive.html ✅
│   └── ... (Mermaid + HTML interactive)
├── 04-Decisions/ (ADRs)
├── 05-Tasks/ (Kanban boards)
└── 06-Reference/ (External docs)
```

---

## Next Steps

### Immediate (This Week)
1. ✅ Complete architecture design
2. ✅ Document all roles
3. ✅ Document critical workflows
4. ⏳ Setup development environment
5. ⏳ Initialize project repository

### Short-term (Next 2 Weeks)
1. Complete Phase 1: Foundation
2. Setup CI/CD pipeline
3. Implement license activation
4. Build authentication system

### Medium-term (Month 2-3)
1. Complete core features (Phases 2-6)
2. Develop critical workflows
3. Integration testing
4. Pilot customer onboarding

### Long-term (Month 4+)
1. Beta launch with 2 pilot customers
2. Iterate based on feedback
3. Develop addon features
4. Scale to 10+ customers

---

## Contact & Resources

### Documentation
- **Obsidian Vault**: [obsidian-vault/](obsidian://open?vault=LMS)
- **Specs**: [specs/001-lms-multi-branch/](../specs/001-lms-multi-branch/)
- **Architecture**: [[architecture-proposal.md]]
- **Tasks**: [[tasks-v2.md]]

### External Links
- React: https://react.dev
- Ant Design: https://ant.design
- NestJS: https://nestjs.com
- PostgreSQL: https://postgresql.org

---

**Last Updated**: 2026-08-25  
**Maintained By**: Development Team  
**Review Frequency**: Weekly during development
