---
title: Organization Admin
role_id: org_admin
category: management
access_level: 5
created: 2026-08-25
tags: [role, management, mvp, critical]
---

# 👔 Organization Admin

## Overview

**Role ID**: `org_admin`  
**Category**: Management  
**Access Level**: 5 (Full Administrative)  
**License Requirement**: Base System (Included)

---

## Description

Organization Admin là vai trò có quyền cao nhất trong hệ thống, quản lý toàn bộ tổ chức (organization) bao gồm tất cả các chi nhánh. Có thể xem và chỉnh sửa mọi dữ liệu trong hệ thống, quản lý người dùng, phân quyền, và cấu hình hệ thống.

**Typical Users**: 
- Hiệu trưởng / Giám đốc trung tâm
- Quản lý cấp cao
- IT Manager (với vai trò kỹ thuật)

---

## Key Responsibilities

### 1. Organization Management (🤖 AI-Enhanced)
- Cấu hình thông tin tổ chức (tên, timezone, năm học)
- Quản lý cài đặt hệ thống toàn cục
- Quản lý license và addons
- Giám sát hoạt động toàn hệ thống
- **🆕 Configure AI features and settings**
- **🆕 Monitor AI API usage and costs**
- **🆕 System-wide analytics dashboard**

### 2. Branch Management (🤖 AI-Enhanced)
- Tạo, chỉnh sửa, đóng chi nhánh
- Phân công Branch Manager cho từng chi nhánh
- Theo dõi hiệu suất từng chi nhánh
- **🆕 AI-powered branch performance comparison**
- **🆕 Predictive analytics for branch growth**
- **🆕 Automated benchmarking reports**

### 3. User & Permission Management (🤖 AI-Enhanced)
- Tạo và quản lý tất cả user accounts
- Phân quyền roles cho users
- Cấp phát branch scope cho users
- Quản lý roles và permissions
- **🆕 AI insights on user activity patterns**
- **🆕 Automated role recommendations**

### 4. Strategic Oversight (🤖 AI-Enhanced)
- Xem báo cáo tổng hợp tất cả chi nhánh
- Phân tích xu hướng enrollment và revenue
- Đánh giá hiệu suất giảng viên và nhân viên
- **🆕 AI-powered predictive analytics**
- **🆕 Market trends and opportunities**
- **🆕 Automated executive reports**

### 5. Content & Library Oversight (New!)
- **🆕 Review Digital Library content across all branches**
- **🆕 Approve shared content for organization**
- **🆕 Monitor content usage and effectiveness**
- **🆕 AI content quality insights**

### 6. AI System Management (New!)
- **🆕 Configure AI grading models and thresholds**
- **🆕 Monitor AI accuracy and performance**
- **🆕 Review AI-generated insights**
- **🆕 Manage AI API keys and budgets**
- **🆕 Enable/disable AI features per branch**

### 7. Executive Dashboard (New!)
- **🤖 Real-time KPIs**: All key metrics organization-wide
- **🤖 Predictive Models**: Revenue, enrollment, churn forecasts
- **🤖 Competitive Intelligence**: Market positioning
- **🤖 Risk Alerts**: Issues requiring executive attention
- **🤖 ROI Analysis**: Track system ROI and effectiveness

---

## Permissions

### Can View
- [x] All organization data across all branches
- [x] All users, roles, permissions
- [x] All programs, courses, classes
- [x] All students and enrollments
- [x] All financial data (invoices, payments, reports)
- [x] All employee and payroll data (if HRM addon)
- [x] System logs and audit trails
- [x] License and addon status

### Can Create
- [x] New branches
- [x] New users (any role)
- [x] New roles with custom permissions
- [x] New programs and courses
- [x] System-wide announcements
- [x] Report templates

### Can Edit
- [x] Organization settings
- [x] Branch information
- [x] User accounts and roles
- [x] Academic structures
- [x] Financial records (with audit trail)
- [x] System configurations

### Can Delete
- [x] Branches (archive only, not hard delete)
- [x] User accounts (deactivate, not hard delete)
- [x] Programs and courses (if no dependencies)
- [x] Classes (if no enrollments)

**Restrictions**:
- ❌ Cannot delete financial records
- ❌ Cannot delete audit logs
- ❌ Cannot bypass license constraints

---

## Scope

**Organization Scope**: Yes (Full access to all data)
**Branch Scope**: All branches
**Student Scope**: All students

---

## Typical Workflows

This role participates in:
- [[WF-01 Enrollment Journey]] - Final approval for special cases
- [[WF-02 Teaching & Learning Cycle]] - Monitoring and oversight
- [[WF-03 Financial Operations]] - Approval for large transactions
- [[WF-04 HR & Payroll]] - Final payroll approval
- [[WF-05 System Setup]] - Initial configuration
- [[WF-06 User Onboarding]] - Creating user accounts

---

## Related Roles

**Reports To**: None (Highest authority)
**Manages**: 
- [[Branch Manager]]
- [[Academic Manager]]
- [[Finance Officer]]
- [[HR Manager]]
- [[System Admin]]

**Collaborates With**: All roles

---

## Navigation Access

**Menu Items Visible**:
```yaml
- Dashboard (Organization-wide view)
- Settings
  - Organization
  - Branches
  - Users
  - Roles & Permissions
  - License
  - System Configuration
- Academic
  - Departments
  - Programs
  - Courses
  - Classes (all branches)
  - Students (all branches)
- Finance
  - Invoices (all branches)
  - Payments (all branches)
  - Reports (consolidated)
- Reports
  - Enrollment by Branch
  - Revenue by Branch
  - Teacher Performance
  - System Usage
- HRM (if addon active)
  - Employees (all branches)
  - Payroll (all branches)
  - Reports
```

---

## Data Access Rules

```typescript
// Organization Admin has full access to all data
function canAccess(user: OrgAdmin, resource: Resource): boolean {
  // Check if resource exists and license allows
  if (!resource.exists()) return false;
  if (!license.allowsFeature(resource.module)) return false;
  
  // Org Admin can access everything within license constraints
  return true;
}

// Branch filtering is optional for Org Admin
function filterByBranch(user: OrgAdmin, query: Query): Query {
  // If user explicitly selects a branch filter
  if (user.selectedBranchFilter) {
    return query.where('branch_id', user.selectedBranchFilter);
  }
  
  // Otherwise, return all branches
  return query;
}
```

---

## User Scenarios

### Scenario 1: Creating a New Branch
**Goal**: Mở chi nhánh mới và set up cấu trúc ban đầu

**Steps**:
1. Navigate to **Settings → Branches**
2. Click **Add New Branch**
3. Fill in branch information:
   - Branch Code: `HN-02`
   - Name: `Chi nhánh Cầu Giấy`
   - Address: `123 Cầu Giấy, Hà Nội`
   - Manager: Select [[Branch Manager]] user
4. Set status: **Active**
5. Click **Save**
6. Navigate to **Settings → Users**
7. Assign teachers and staff to new branch via scope grants

**Expected Outcome**: 
- New branch appears in branch list
- Branch Manager can access branch data
- Ready for class creation and enrollment

---

### Scenario 2: Monthly Performance Review
**Goal**: Xem báo cáo tổng hợp hiệu suất tất cả chi nhánh

**Steps**:
1. Navigate to **Reports → Management Dashboard**
2. Select date range: Last month
3. View KPIs:
   - Total enrollments by branch
   - Revenue by branch
   - Class utilization rates
   - Teacher workload distribution
4. Identify underperforming branches
5. Download detailed report for review meeting
6. Schedule follow-up with [[Branch Manager]]s

**Expected Outcome**: 
- Clear visibility into organization performance
- Data-driven decisions for resource allocation
- Action items for branch improvements

---

### Scenario 3: User Account Management
**Goal**: Tạo account mới cho giáo viên vừa tuyển

**Steps**:
1. Navigate to **Settings → Users**
2. Click **Add User**
3. Fill in user information:
   - Full Name: `Nguyễn Văn A`
   - Email: `nguyenvana@school.edu.vn`
   - Role: [[Teacher]]
4. Grant branch scope: `HN-01` (Hà Nội Central)
5. Set effective dates: Now - Unlimited
6. System sends welcome email with password reset link
7. Teacher logs in and completes profile

**Expected Outcome**: 
- Teacher can access system
- Teacher sees only assigned branch data
- Teacher can view and manage assigned classes

---

## Common Tasks

| Task | Frequency | Average Time | Critical? |
|------|-----------|--------------|-----------|
| Review daily enrollment reports | Daily | 10 min | No |
| Approve new user accounts | As needed | 3 min/user | Yes |
| Monthly financial review | Monthly | 1 hour | Yes |
| License renewal check | Quarterly | 5 min | Yes |
| System backup verification | Weekly | 5 min | Yes |
| Teacher performance review | Quarterly | 2 hours | No |

---

## Training Requirements

**Required Knowledge**:
- Understanding of organization structure (branches, departments)
- User management and role-based access control concepts
- Basic financial concepts (invoices, payments, reconciliation)
- Academic structure (programs, courses, classes)
- System license and addon model

**Training Duration**: 
- Initial training: 4 hours
- Hands-on practice: 1 week
- Ongoing support: As needed

**Training Modules**:
1. System Overview (30 min)
2. Organization & Branch Setup (1 hour)
3. User & Role Management (1.5 hours)
4. Reports & Analytics (1 hour)

---

## Security Considerations

⚠️ **High Security Role** - Organization Admin has extensive privileges

**Best Practices**:
- Use strong passwords (minimum 12 characters)
- Enable 2FA (when available)
- Limit number of Org Admin accounts (recommend 2-3 max)
- Regularly review audit logs for Org Admin actions
- Re-authenticate for sensitive operations (user deletion, financial adjustments)

**Audit Trail**:
All Organization Admin actions are logged:
- User/role modifications
- Financial adjustments
- System configuration changes
- Branch creation/closure

---

## Delegation Patterns

When Organization Admin is unavailable:

**Delegated to [[Branch Manager]]**:
- Daily operations for their branch
- Staff management within branch
- Branch-level approvals

**Delegated to [[Finance Officer]]**:
- Financial operations and reporting
- Payment processing and reconciliation

**NOT Delegated** (requires Org Admin):
- Creating new branches
- Modifying roles and permissions
- System configuration changes
- License management

---

## Edge Cases

### Multi-Organization Scenario
Q: Can one Organization Admin manage multiple organizations?
A: No. Each organization is separate with its own database. Need separate accounts.

### Temporary Elevation
Q: Can Branch Manager be temporarily elevated to Org Admin?
A: Yes. Grant `org_admin` role with time-limited scope grant. Auto-revokes after effective_to date.

### Data Export
Q: Can Org Admin export all data?
A: Yes, via **Reports → Export** but subject to license constraints. Personal data exports should comply with data protection policies.

---

## Notes

- This role should be assigned sparingly (principle of least privilege)
- Consider creating specialized admin roles for large organizations (e.g., Academic Admin, Finance Admin)
- Org Admin actions trigger email notifications to other admins for accountability
- In case of compromised Org Admin account, contact [[System Admin]] for immediate suspension

---

## Related Documentation

- [[System Admin]] - Technical system administration role
- [[Branch Manager]] - Branch-level management role
- [[WF-06 User Onboarding]] - How to create and onboard users
- [[Security Best Practices]] - Security guidelines for admin roles

---

**Last Updated**: 2026-08-25
**Reviewed By**: Technical Lead
**Next Review**: 2026-09-25
