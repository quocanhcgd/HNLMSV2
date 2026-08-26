# Feature Specification: LMS đa ngành đa chi nhánh (On-Premise)

**Feature Branch**: `001-lms-multi-branch`  
**Version**: 2.0  
**Created**: 2026-08-19  
**Revised**: 2026-08-25  
**Status**: Active

---

## Executive Summary

Self-hosted Learning Management System cho trung tâm đào tạo tư nhân tại Vietnam, hỗ trợ đa ngành và đa chi nhánh. Hệ thống cài đặt trên server riêng của khách hàng, kích hoạt bằng license key offline, đảm bảo data residency và bảo mật thông tin.

**Target Users**: Trung tâm ngoại ngữ, đào tạo nghề, luyện thi (1-2 chi nhánh, 500-1500 học viên)  
**Distribution**: On-premise installation package (.deb for Debian/Ubuntu)  
**License Model**: Base system + paid addons, offline activation  
**Tech Stack**: React + Ant Design Pro (Frontend), NestJS + PostgreSQL (Backend)

---

## Business Model

### Product Structure

```
┌─────────────────────────────────────────────┐
│          BASE SYSTEM (Required)             │
│  ✓ Organization & Branch Management         │
│  ✓ User & Role Management                   │
│  ✓ Academic Core (Programs, Classes)        │
│  ✓ Student Learning Portal                  │
│  ✓ Finance & Billing                        │
└─────────────────────────────────────────────┘
              ↓ Activate with license key

┌─────────────────────────────────────────────┐
│          PAID ADDONS (Optional)             │
│  + Admission & CRM                          │
│  + Assessment & Testing                     │
│  + Online Classes Integration               │
│  + HRM & Payroll                            │
│  + Advanced Reporting                       │
│  + Custom Integrations (Accounting/ERP)     │
└─────────────────────────────────────────────┘
         ↓ Each addon has separate serial key
```

### License Types

**Perpetual License**:
- One-time purchase
- Lifetime usage for base system
- Free updates for 1 year
- Optional extended support after 1 year

**Subscription License** (Addons):
- Annual or monthly payment
- Automatic feature disable on expiry
- Grace period: 30 days

### License Constraints

Each license specifies:
- Max students allowed
- Max branches allowed
- Max storage (GB)
- Enabled addons
- Expiration date (if subscription)

---

## User Scenarios & Testing

### US0 - Installation & License Activation (P0 - Foundation)

**Actor**: System Administrator  
**Goal**: Install LMS on organization's server and activate licenses

**Scenario**:
1. Download LMS base package (`lms-base-v1.0.0.deb`)
2. Install on Debian/Ubuntu server: `sudo dpkg -i lms-base-v1.0.0.deb`
3. Run setup wizard: `sudo lms-setup wizard`
4. Configure database credentials, admin user, organization info
5. Upload license file or enter license key
6. System validates license signature offline
7. Base modules are activated and accessible

**Acceptance Criteria**:
- ✓ Installation completes without errors on clean Ubuntu 22.04
- ✓ Database schema created automatically
- ✓ Admin user can login with configured credentials
- ✓ License status shows activation date and constraints
- ✓ Invalid or expired license shows clear error message

**Edge Cases**:
- License file tampered → Signature validation fails
- Database connection failed → Clear error with troubleshooting hints
- License constraints (max 500 students) → System enforces limit

---

### US1 - Organization & Branch Management (P1 - MVP)

**Actor**: Organization Administrator  
**Goal**: Configure organization structure and branches

**Scenario**:
1. Admin logs in after installation
2. Navigate to Settings → Organization
3. Configure organization name, timezone, academic year
4. Add branches with name, address, manager
5. Set branch status (active/inactive)
6. Assign users to specific branches

**Acceptance Criteria**:
- ✓ Organization settings saved and applied system-wide
- ✓ Multiple branches created with unique codes
- ✓ Branch manager assigned and has branch-level access
- ✓ Inactive branches don't allow new enrollments
- ✓ Branch-scoped data properly isolated in reports

**Independent Test**: Create 2 branches (A and B), assign manager A only to branch A, verify manager A cannot access branch B data.

---

### US2 - User & Role Management (P1 - MVP)

**Actor**: Organization Administrator  
**Goal**: Manage users and assign roles with branch scope

**Scenario**:
1. Navigate to Settings → Users
2. Create user accounts (teacher, finance officer, student)
3. Assign roles (e.g., Teacher, Finance Manager, Student)
4. Grant branch-level scope (e.g., Teacher only sees Branch A classes)
5. Set effective dates for temporary roles

**Acceptance Criteria**:
- ✓ Users created with email, full name, role
- ✓ Roles have predefined permissions (customizable)
- ✓ Branch scope properly enforces data visibility
- ✓ Role changes audit logged
- ✓ Expired scope grants automatically revoked

**Roles (Pre-defined)**:
- **Organization Admin**: Full access to all branches
- **Branch Manager**: Full access to assigned branch(es)
- **Finance Officer**: Invoice, payment, reporting (branch-scoped)
- **Teacher**: Classes, students, grades, content (assigned classes only)
- **Student**: Own classes, progress, grades, library
- **Parent** (addon): Delegated access to specific student(s)

---

### US3 - Academic Setup (P1 - MVP)

**Actor**: Academic Manager  
**Goal**: Create programs, courses, and classes

**Scenario**:
1. Navigate to Academic → Departments
2. Create department (e.g., "English Language")
3. Create program (e.g., "General English - 6 months")
4. Define program objectives, duration, completion rules
5. Add courses to program (e.g., "Beginner", "Intermediate")
6. Create class at branch with capacity, schedule, teacher
7. Publish class for enrollment

**Acceptance Criteria**:
- ✓ Programs organized by department
- ✓ Courses define learning outcomes and prerequisites
- ✓ Classes linked to program, branch, teacher
- ✓ Class capacity enforced during enrollment
- ✓ Schedule conflict detection (same teacher/room/time)
- ✓ Draft classes not visible to students

---

### US4 - Student Enrollment (P1 - MVP)

**Actor**: Admission Staff / Branch Manager  
**Goal**: Enroll students into classes

**Scenario**:
1. Navigate to Academic → Students
2. Create student profile (or select existing)
3. Navigate to student detail → Enrollments
4. Select class and enrollment date
5. System creates invoice based on program fee
6. Enrollment status: Pending Payment
7. After payment confirmed, status: Active

**Acceptance Criteria**:
- ✓ Student profile created with basic info
- ✓ Enrollment creates financial obligation automatically
- ✓ Class capacity checked before enrollment
- ✓ Duplicate enrollment prevented (same student + class)
- ✓ Enrollment status reflects payment status

**Edge Cases**:
- Class full → Show error, offer waitlist
- Student already enrolled → Prevent duplicate
- Financial obligation not paid → Enrollment remains pending

---

### US5 - Student Learning Portal (P1 - MVP)

**Actor**: Student  
**Goal**: Access classes, learning materials, and track progress

**Scenario**:
1. Student logs in with credentials
2. Dashboard shows enrolled classes
3. Click on class to view:
   - Class schedule and sessions
   - Learning materials (documents, videos)
   - Assignments and deadlines
   - Grades and progress
4. Access library to browse additional resources
5. Download or view permitted materials

**Acceptance Criteria**:
- ✓ Student sees only enrolled classes
- ✓ Materials display with proper permissions (some may be teacher-only)
- ✓ Progress tracking shows completion percentage
- ✓ Grades visible according to teacher's publish settings
- ✓ Library search and filter by category/subject

**Independent Test**: Enroll student in Class A, verify they cannot access Class B materials.

---

### US6 - Learning Content Management (P1 - MVP)

**Actor**: Teacher / Content Manager  
**Goal**: Upload and organize learning materials

**Scenario**:
1. Navigate to Learning → Content Library
2. Upload files (PDF, video, PPT) with metadata
3. Organize into categories and subjects
4. Set access scope (public, class-specific, teacher-only)
5. Assign content to specific classes
6. Students in assigned class can view/download

**Acceptance Criteria**:
- ✓ Multiple file types supported
- ✓ Content versioning tracked
- ✓ Access control by scope (public/class/private)
- ✓ File storage on local filesystem or object storage
- ✓ Download URLs authorized before serving

---

### US7 - Finance & Billing (P1 - MVP)

**Actor**: Finance Officer  
**Goal**: Manage invoices, record payments, reconcile accounts

**Scenario**:
1. Navigate to Finance → Invoices
2. View invoices (created from enrollments)
3. Record payment manually (cash/bank transfer) or via payment gateway
4. For payment gateway:
   - Generate payment link
   - Student clicks link and pays online
   - Webhook confirms payment
   - Invoice status updated automatically
5. Generate receipt and send to student/parent
6. View receivables report by branch

**Acceptance Criteria**:
- ✓ Invoice auto-created on enrollment with correct amount
- ✓ Multiple payment methods supported (cash, bank transfer, gateway)
- ✓ Payment gateway integration via plugin (VNPay, Momo)
- ✓ Webhook idempotency prevents duplicate payments
- ✓ Receipt generated as PDF with invoice details
- ✓ Financial reports accurate by branch

**Payment Gateway Flow**:
```
1. Invoice created → Status: Pending
2. Generate payment link → Student receives link
3. Student pays via gateway → Gateway sends webhook
4. Webhook validated → Payment recorded
5. Invoice status → Paid
6. Receipt generated and emailed
```

**Edge Cases**:
- Webhook received twice → Idempotent processing, no duplicate payment
- Partial payment → Invoice status remains partially paid
- Payment gateway timeout → Reconciliation job checks status later

---

### US8 - Reporting (P1 - MVP)

**Actor**: Branch Manager / Organization Admin  
**Goal**: View operational reports

**Scenario**:
1. Navigate to Reports
2. Select report type:
   - Enrollment by branch/program/month
   - Revenue by branch/payment method
   - Class utilization (capacity vs enrolled)
   - Student progress summary
3. Apply filters (date range, branch)
4. Export to Excel/PDF

**Acceptance Criteria**:
- ✓ Reports show data within user's scope (branch-level access)
- ✓ Filters work correctly
- ✓ Export generates file with correct data
- ✓ Large reports run asynchronously with notification

---

## Addon User Stories (Post-MVP)

### US9 - Admission & CRM Addon (P2)

**Features**:
- Landing page CMS
- Lead capture forms
- Lead assignment to consultants
- Consultation workflow
- Lead-to-enrollment conversion

### US10 - Assessment & Testing Addon (P2)

**Features**:
- Entrance exam management
- Mock tests and practice exams
- Auto-grading for multiple choice
- Manual grading for essays/speaking
- English pathway (4 skills tracking)

### US11 - Online Classes Addon (P2)

**Features**:
- Meeting platform integration (Zoom, Google Meet, MS Teams)
- Online session scheduling
- Attendance sync from meeting provider
- Recording management with access control

### US12 - HRM & Payroll Addon (P3)

**Features**:
- Employee management
- Attendance tracking
- Leave management
- Payroll calculation (salary + teaching hours)
- Payslip generation

### US13 - Custom Accounting/ERP Integration Addon (P3)

**Features**:
- Export financial transactions to external accounting system
- Sync invoices, payments, receipts
- Idempotent sync to prevent duplicates
- Reconciliation reports

---

## Requirements

### Functional Requirements (Base System - MVP)

**FR-001**: System MUST support offline license activation via signed license file  
**FR-002**: System MUST enforce license constraints (max students, branches, storage)  
**FR-003**: System MUST support multiple organizations, each with multiple branches  
**FR-004**: System MUST enforce branch-level data scope for users  
**FR-005**: System MUST support role-based access control with custom roles  
**FR-006**: System MUST track all changes to sensitive data in audit log  
**FR-007**: System MUST support academic structure (departments, programs, courses, classes)  
**FR-008**: System MUST prevent schedule conflicts (teacher, room, time)  
**FR-009**: System MUST auto-create invoice on enrollment  
**FR-010**: System MUST support payment gateway integration via plugin architecture  
**FR-011**: System MUST process webhooks idempotently (no duplicate payments)  
**FR-012**: System MUST generate receipts as PDF  
**FR-013**: System MUST provide learning content library with access control  
**FR-014**: System MUST track student progress and grades  
**FR-015**: System MUST generate operational reports with branch scope  
**FR-016**: System MUST support Vietnamese and English languages  
**FR-017**: System MUST run on Debian/Ubuntu without Docker  
**FR-018**: System MUST support local file storage or S3-compatible object storage  
**FR-019**: System MUST provide database backup and restore tools  
**FR-020**: System MUST validate data residency (no data sent outside customer's infrastructure)

### Non-Functional Requirements

**NFR-001**: System MUST support up to 2000 students per installation  
**NFR-002**: List pages MUST load in <2 seconds with 1000 records  
**NFR-003**: Detail pages MUST load in <500ms  
**NFR-004**: Payment webhook processing MUST complete in <1 second  
**NFR-005**: System MUST handle 50 concurrent users  
**NFR-006**: Database MUST support transactions for financial operations  
**NFR-007**: File uploads MUST support up to 500MB per file  
**NFR-008**: System MUST be accessible via keyboard only  
**NFR-009**: System MUST follow WCAG 2.0 AA guidelines  
**NFR-010**: System MUST log all errors with correlation IDs  
**NFR-011**: System MUST retain audit logs for 7 years  
**NFR-012**: System MUST encrypt sensitive data at rest  
**NFR-013**: System MUST use HTTPS for all communication  
**NFR-014**: System MUST prevent SQL injection via parameterized queries  
**NFR-015**: System MUST rate-limit API endpoints (100 req/15min per IP)

### Security Requirements

**SEC-001**: Passwords MUST be hashed with bcrypt (cost factor 10+)  
**SEC-002**: Sessions MUST expire after 8 hours of inactivity  
**SEC-003**: Login MUST be rate-limited (5 attempts per 15 minutes)  
**SEC-004**: File uploads MUST be virus-scanned before storage  
**SEC-005**: License file signatures MUST use RSA-2048 minimum  
**SEC-006**: API endpoints MUST validate JWT tokens  
**SEC-007**: Financial transactions MUST be logged in audit trail  
**SEC-008**: Payment webhooks MUST validate signatures  
**SEC-009**: Admin actions MUST require re-authentication  
**SEC-010**: Data exports MUST check user permissions before generation

---

## Success Criteria

### MVP Launch Success (Q3 2026)

**SC-001**: System installed successfully on 2 pilot customer servers  
**SC-002**: 90% of enrollment workflow completed without errors in pilot  
**SC-003**: Payment gateway integration working with 99% success rate  
**SC-004**: Zero data leakage between branches in security audit  
**SC-005**: License activation process takes <5 minutes  
**SC-006**: Customer can generate monthly financial report in <2 minutes  
**SC-007**: System uptime >99% during pilot period (excluding maintenance)  
**SC-008**: All P1 user stories validated by pilot customers  
**SC-009**: Critical bugs fixed within 24 hours during pilot  
**SC-010**: Documentation complete and validated by non-technical user

### Post-MVP Success (Q4 2026)

**SC-011**: 10 paying customers using base system  
**SC-012**: 3 addons available and purchased by at least 2 customers each  
**SC-013**: Customer support requests <5 per customer per month  
**SC-014**: Average time to resolve support ticket <24 hours  
**SC-015**: Customer satisfaction score >4/5

---

## Assumptions

- Customers have technical staff or hire contractor for installation
- Server meets minimum requirements (4 vCPU, 8GB RAM, 100GB SSD)
- PostgreSQL 15+ and Redis 7+ available (or will be installed)
- Internet connection available for initial installation and updates
- Payment gateway accounts created by customer before integration
- Learning content provided by customer (system manages, not creates)
- English language proficiency of admin users (for technical docs)

---

## Constraints

- Team size: 2 full-stack developers
- Timeline: 4 months for MVP (Sep-Dec 2026)
- Budget: Limited, must use open-source stack
- No Docker: Native systemd deployment only
- No SaaS: On-premise only
- Vietnam market: UI/docs must support Vietnamese
- Data residency: All data stays on customer's server

---

## Out of Scope (MVP)

- Mobile apps (iOS/Android native)
- Parent portal with delegation
- AI-powered features
- Video conferencing built-in (use integrations)
- SMS/Email marketing campaigns
- Multi-language content translation
- Gamification (badges, points)
- Social learning features
- Live chat support
- Advanced analytics/BI
- Multi-currency support
- E-commerce for course sales
- Certificate generation with digital signatures

---

## Dependencies

- PostgreSQL 15+ database
- Redis 7+ for caching and queues
- Node.js 20 LTS runtime
- Nginx web server
- Debian 12 or Ubuntu 22.04 LTS
- Customer provides: server, domain, SSL certificate
- Payment gateway: Customer signs up with VNPay/Momo

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Team capacity (2 people) | High | Medium | Use proven libraries (Ant Design Pro), minimize custom development |
| Timeline (4 months) | High | Medium | MVP scope strictly enforced, addons deferred |
| Payment gateway integration complexity | Medium | Low | Plugin architecture, start with 1 provider, add others incrementally |
| License cracking | Medium | Medium | RSA signature + code obfuscation, acceptable for B2B market |
| Customer installation issues | Medium | High | Detailed installation guide, automated setup wizard, support via chat |
| Data migration from existing systems | Low | Medium | Provide CSV import tools, migration service (optional paid service) |
| Performance at scale | Low | Low | PostgreSQL proven at 10x target scale, can optimize if needed |

---

## Next Steps

1. **Approve this specification** ✓
2. **Review architecture proposal** (architecture-proposal.md)
3. **Update remaining docs** (plan.md, data-model.md, tasks.md)
4. **Create installation guide**
5. **Setup development environment**
6. **Start Phase 1: Foundation** (Week 1)

---

**Document Status**: Ready for implementation planning  
**Last Updated**: 2026-08-25  
**Approved By**: [Pending]
