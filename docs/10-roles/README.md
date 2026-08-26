---
title: Roles Index
created: 2026-08-25
tags: [index, roles]
---

# 👥 User Roles - Complete Index

> 📌 **Phần của bộ tài liệu chuẩn `docs/`** (chuyển từ obsidian vault v3).
> **Lưu ý**: tài liệu này mô tả đầy đủ vai trò theo tầm nhìn v3 (bao gồm vai trò addon và hỗ trợ AI). Với phạm vi **MVP** (xem `../02-spec.md`), các vai trò addon (HR Manager, Payroll Officer, Parent, Admission Consultant, Librarian, Receptionist, Customer Support, IT Support, Accountant) chỉ có hiệu lực khi addon tương ứng được kích hoạt. Liên kết `[[wikilink]]` cũ có thể không còn hoạt động sau khi chuyển vào cây chuẩn.

> Comprehensive role definitions for LMS system with permissions, workflows, and responsibilities

---

## Role Categories

### 🏢 Management Roles
- [[Organization Admin]] - Highest authority, full system access
- [[Branch Manager]] - Branch-level operations and oversight
- [[System Admin]] - Technical administration and maintenance

### 📚 Academic Roles
- [[Academic Manager]] - Curriculum and program management
- [[Teacher]] - Instruction and student assessment
- [[Librarian]] - Learning content and resource management

### 🎓 Learner Roles
- [[Student]] - Primary learners
- [[Parent (Addon)]] - Family oversight and monitoring

### 💼 Admission & Sales Roles
- [[Admission Consultant]] - Lead conversion and enrollment
- [[Receptionist]] - First contact and administrative support

### 💰 Finance Roles
- [[Finance Officer]] - Payment processing and reconciliation
- [[Accountant]] - Financial reporting and compliance

### 👔 HR Roles (Addon)
- [[HR Manager]] - Employee lifecycle management
- [[Payroll Officer]] - Salary calculation and distribution

### 🛠️ Support Roles
- [[IT Support]] - Technical troubleshooting
- [[Customer Support]] - General user assistance

---

## Role Hierarchy

```
Organization Admin (Level 5)
    ├── Branch Manager (Level 4)
    │   ├── Academic Manager (Level 3)
    │   │   ├── Teacher (Level 2)
    │   │   └── Librarian (Level 2)
    │   ├── Finance Officer (Level 3)
    │   │   └── Accountant (Level 3)
    │   ├── HR Manager (Level 3) [Addon]
    │   │   └── Payroll Officer (Level 2) [Addon]
    │   ├── Admission Consultant (Level 2)
    │   │   └── Receptionist (Level 1)
    │   └── Customer Support (Level 1)
    ├── System Admin (Level 5)
    └── IT Support (Level 2)

Student (Level 1)
    └── Parent (Level 1) [Addon]
```

---

## Access Level Definitions

| Level | Description | Scope | Examples |
|-------|-------------|-------|----------|
| **5** | Full Administrative | Organization-wide | Organization Admin, System Admin |
| **4** | Branch Management | Branch-level | Branch Manager |
| **3** | Department Management | Department/Module | Academic Manager, Finance Officer, HR Manager |
| **2** | Operational | Class/Task-scoped | Teacher, Admission Consultant |
| **1** | Limited/Self | Self-scoped only | Student, Parent, Receptionist |

---

## Role by License Requirement

### Base System (MVP)
All roles below included in base license:
- ✅ Organization Admin
- ✅ Branch Manager
- ✅ System Admin
- ✅ Academic Manager
- ✅ Teacher
- ✅ Student
- ✅ Admission Consultant
- ✅ Receptionist
- ✅ Finance Officer
- ✅ Accountant
- ✅ Librarian
- ✅ IT Support
- ✅ Customer Support

### Paid Addons
Additional roles unlocked with addons:
- 💰 Parent (Addon: Student Portal Enhancement)
- 💰 HR Manager (Addon: HRM & Payroll)
- 💰 Payroll Officer (Addon: HRM & Payroll)

---

## Role Selection Guide

### For Small Organizations (< 50 students)

**Minimum Roles**:
- 1 Organization Admin (owner)
- 1-2 Teachers (double as Academic Manager)
- 1 Finance Officer (double as Receptionist)
- Students

**Optional**:
- Add Branch Manager when opening 2nd location
- Add dedicated Admission Consultant when enrollment grows

---

### For Medium Organizations (50-500 students)

**Recommended Roles**:
- 1 Organization Admin
- 1 Branch Manager per branch
- 1 Academic Manager
- 5-10 Teachers
- 1-2 Admission Consultants
- 1 Finance Officer
- 1 Receptionist
- Students

**Consider Adding**:
- Librarian (if large content library)
- Customer Support (if high inquiry volume)
- IT Support (part-time or contractor)

---

### For Large Organizations (500+ students)

**Full Role Structure**:
- 1-2 Organization Admins
- 1 Branch Manager per branch (2-5 branches)
- 1 Academic Manager per branch
- 10-30 Teachers
- 2-4 Admission Consultants per branch
- 1-2 Finance Officers per branch
- 1 Accountant (organization level)
- 1 Receptionist per branch
- 1 HR Manager (with HRM addon)
- 1 Payroll Officer (with HRM addon)
- 1 Librarian
- 1 IT Support (full-time)
- 1 Customer Support
- Students + Parents (with addon)

---

## Role Assignment Best Practices

### 1. Principle of Least Privilege
- Assign lowest access level needed for job function
- Grant additional permissions only when justified
- Review and revoke unused permissions regularly

### 2. Separation of Duties
- Finance Officer should not be same person as Branch Manager
- Payroll Officer should not process own salary
- Different people for invoice creation vs payment approval

### 3. Scope Limitation
- Limit branch scope to only assigned branches
- Teachers only see assigned classes
- Students only see own data

### 4. Temporary Elevation
- Use time-limited scope grants for temporary assignments
- Substitute teachers get temporary class access
- Consultants get temporary lead access

### 5. Audit & Review
- Review all admin-level accounts quarterly
- Disable accounts for departed staff immediately
- Monitor unusual access patterns

---

## Common Role Combinations

### Small School Efficiency

**One Person, Multiple Roles**:
- Owner: Organization Admin + Branch Manager + Academic Manager
- Teacher: Teacher + Admission Consultant + Receptionist
- Admin Staff: Finance Officer + Customer Support + IT Support

⚠️ **Caution**: Combining Finance Officer with approval roles creates audit risks

---

### Part-Time & Contract Roles

**Suitable for Part-Time**:
- Teacher (specific class hours)
- Admission Consultant (peak enrollment seasons)
- IT Support (on-call or contracted)
- Librarian (content curation)

**Must Be Full-Time**:
- Organization Admin (business continuity)
- Branch Manager (daily operations)
- Finance Officer (daily cash handling)

---

## Role Migration Paths

### Career Progression

**Teacher Path**:
1. Teacher → Senior Teacher (more classes)
2. Senior Teacher → Academic Manager
3. Academic Manager → Branch Manager
4. Branch Manager → Organization Admin

**Consultant Path**:
1. Receptionist → Admission Consultant
2. Admission Consultant → Senior Consultant
3. Senior Consultant → Branch Manager

**Finance Path**:
1. Receptionist → Finance Officer
2. Finance Officer → Accountant
3. Accountant → Branch Manager / CFO

---

## Technical Notes

### Role Data Model

```typescript
interface Role {
  id: string;
  name: string;
  description: string;
  access_level: 1 | 2 | 3 | 4 | 5;
  permissions: Permission[];
  is_system_role: boolean; // Cannot be deleted
  is_addon_role: boolean; // Requires addon license
  required_addon?: string;
  created_at: Date;
}

interface UserRole {
  user_id: string;
  role_id: string;
  granted_at: Date;
  granted_by: string;
  expires_at?: Date;
}

interface ScopeGrant {
  user_id: string;
  branch_id?: string;
  class_id?: string;
  student_id?: string;
  effective_from: Date;
  effective_to?: Date;
}
```

---

## Quick Reference Matrix

| Role | Can Create Users | Can Modify Finances | Can Access All Branches | Can Delete Data | License Required |
|------|-----------------|---------------------|------------------------|----------------|------------------|
| Organization Admin | ✅ | ✅ | ✅ | ⚠️ Archive only | Base |
| Branch Manager | ✅ Branch users | ⚠️ Approve only | ❌ Own branch | ⚠️ Archive only | Base |
| Academic Manager | ❌ | ❌ | ❌ | ⚠️ Academic only | Base |
| Teacher | ❌ | ❌ | ❌ | ❌ | Base |
| Finance Officer | ❌ | ✅ | ❌ | ❌ | Base |
| Admission Consultant | ❌ | ❌ | ❌ | ❌ | Base |
| Student | ❌ | ❌ | ❌ | ❌ | Base |
| HR Manager | ⚠️ HR only | ⚠️ Payroll only | ❌ | ❌ | HRM Addon |

---

## Related Documentation

### Workflow Participation
- [[WF-01 Enrollment Journey]] - Role involvement in enrollment
- [[WF-02 Teaching & Learning Cycle]] - Teaching and learning roles
- [[WF-03 Financial Operations]] - Finance role workflows
- [[WF-04 HR & Payroll]] - HR addon workflows

### Technical Guides
- [[Authorization System]] - How permissions are enforced
- [[Scope Grant System]] - Branch and class scoping
- [[Audit Logging]] - What actions are logged per role

### Administration
- [[User Onboarding Guide]] - Creating and setting up users
- [[Role Customization Guide]] - Creating custom roles
- [[Permission Reference]] - Complete permission list

---

**Last Updated**: 2026-08-25  
**Total Roles Documented**: 17 (14 base + 3 addon)  
**Next Review**: 2026-09-25
