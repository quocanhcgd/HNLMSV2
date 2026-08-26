---
title: Branch Manager
role_id: branch_manager
category: management
access_level: 4
created: 2026-08-25
tags: [role, management, mvp, critical]
---

# 🏢 Branch Manager

## Overview

**Role ID**: `branch_manager`  
**Category**: Management  
**Access Level**: 4 (High - Branch-level)  
**License Requirement**: Base System (Included)

---

## Description

Branch Manager quản lý toàn bộ hoạt động của một chi nhánh, bao gồm academic operations, staff management, financial oversight và customer satisfaction. Có quyền truy cập đầy đủ dữ liệu trong chi nhánh được phân công.

**Typical Users**: 
- Chi nhánh trưởng
- Branch Director
- Site Manager

---

## Key Responsibilities

### 1. Operational Management (🤖 AI-Enhanced)
- Oversee daily branch operations
- Ensure service quality standards
- Manage branch schedule and resources (rooms, equipment)
- Handle escalated customer issues
- **🆕 Monitor online/offline/hybrid delivery modes**
- **🆕 AI-powered operational insights**
- **🆕 Automated reporting and alerts**

### 2. Staff Management (🤖 AI-Enhanced)
- Supervise branch staff (teachers, consultants, admin)
- Conduct performance reviews
- Approve leave requests
- Manage workload distribution
- **🆕 AI insights on staff performance**
- **🆕 Automated workload balancing recommendations**
- **🆕 Predictive staffing needs**

### 3. Academic Oversight (🤖 AI-Enhanced)
- Approve class schedules and openings
- Monitor teaching quality
- Handle student/parent complaints (AI-routed)
- Review academic performance
- **🆕 AI-powered quality metrics**
- **🆕 Early intervention for struggling students**
- **🆕 Automated parent communication**

### 4. Financial Management (🤖 AI-Enhanced)
- Monitor branch revenue and costs
- Approve refunds and special discounts
- Review financial reports
- Ensure payment collection targets met
- **🆕 AI-powered financial analytics**
- **🆕 Revenue forecasting**
- **🆕 Automated payment reminders**

### 5. Strategic Planning (🤖 AI-Enhanced)
- Branch growth planning
- Marketing and enrollment strategies
- Staff hiring and training needs
- Facility improvements
- **🆕 AI-powered market insights**
- **🆕 Predictive enrollment trends**
- **🆕 Data-driven decision making**

### 6. Communication Hub Management (New!)
- **🆕 Oversee parent-school communications**
- **🆕 Review AI sentiment analysis reports**
- **🆕 Monitor response times and satisfaction**
- **🆕 Handle escalated complaints**

### 7. AI-Powered Dashboard (New!)
- **🤖 Real-time Metrics**: Branch performance overview
- **🤖 Predictive Analytics**: Enrollment, revenue, churn
- **🤖 Quality Insights**: Teaching, satisfaction, outcomes
- **🤖 Alerts**: Issues requiring immediate attention
- **🤖 Benchmarking**: Compare with other branches

---

## Permissions

### Can View
- [x] All data in assigned branch
- [x] Staff information and schedules
- [x] All classes and enrollments
- [x] All financial data (branch-scoped)
- [x] Student records
- [x] Performance reports and analytics

### Can Create
- [x] Classes and schedules
- [x] User accounts (branch staff only)
- [x] Special promotions/discounts
- [x] Branch announcements
- [x] Performance reports

### Can Edit
- [x] Branch information
- [x] Class schedules
- [x] Staff assignments
- [x] Discount approvals
- [x] Student enrollment status (with reason)

### Can Delete
- [x] Draft classes (before enrollment)
- [ ] ~~Cannot delete enrolled classes~~
- [ ] ~~Cannot delete financial records~~
- [ ] ~~Cannot delete user accounts (only deactivate)~~

**Restrictions**:
- ❌ Cannot access other branches' data
- ❌ Cannot modify organization-level settings
- ❌ Cannot create/modify roles and permissions
- ❌ Cannot override license constraints
- ❌ Cannot approve own leave or expenses

---

## Scope

**Organization Scope**: No
**Branch Scope**: Assigned branch(es) - typically 1, sometimes 2-3
**Full Data Access**: Within branch scope

---

## Typical Workflows

This role participates in:
- [[WF-01 Enrollment Journey]] - Approval for special cases
- [[WF-02 Teaching & Learning Cycle]] - Quality oversight
- [[WF-03 Financial Operations]] - Refund approvals
- [[WF-04 HR & Payroll]] - Staff leave approvals
- [[WF-13 Branch Operations]] - Primary owner
- [[WF-14 Performance Review]] - Staff evaluations

---

## Related Roles

**Reports To**: [[Organization Admin]]
**Manages**: 
- [[Academic Manager]]
- [[Finance Officer]]
- [[Admission Consultant]]
- [[Teacher]]
- [[Receptionist]]
- [[Customer Support]]

**Collaborates With**: Other Branch Managers (peer level)

---

## Navigation Access

**Menu Items Visible**:
```yaml
- Dashboard
  - Branch Overview
  - Today's Classes
  - Pending Approvals
  - Key Metrics
- Academic
  - Classes (branch only)
  - Teachers (branch only)
  - Students (branch only)
  - Schedules
- Admission
  - Leads (branch only)
  - Consultations
  - Conversion Funnel
- Finance
  - Revenue Dashboard
  - Invoices (branch only)
  - Collections
  - Branch P&L
- Staff
  - Branch Staff List
  - Attendance
  - Leave Requests
  - Performance Reviews
- Reports
  - Branch Performance
  - Teacher Utilization
  - Student Satisfaction
  - Financial Reports
- Settings
  - Branch Information
  - Branch Staff (add/edit)
  - Announcements
```

---

## Data Access Rules

```typescript
// Branch Manager has full access to branch data
function canAccessBranchData(user: BranchManager, resource: Resource): boolean {
  // Check if resource belongs to manager's branch(es)
  return user.branchIds.includes(resource.branch_id);
}

// Can approve certain actions
function canApprove(user: BranchManager, action: Action): boolean {
  // Refunds under certain amount
  if (action.type === 'refund' && action.amount <= 10000000) {
    return canAccessBranchData(user, action.resource);
  }
  
  // Enrollment cancellations
  if (action.type === 'enrollment_cancel') {
    return canAccessBranchData(user, action.resource);
  }
  
  // Staff leave requests
  if (action.type === 'leave_request') {
    return action.requester.branch_id === user.branch_id;
  }
  
  return false;
}
```

---

## User Scenarios

### Scenario 1: Opening New Class
**Goal**: Mở lớp mới để đáp ứng nhu cầu enrollment

**Steps**:
1. Review enrollment demand from [[Admission Consultant]]
2. Navigate to **Academic → Classes**
3. Click **Create New Class**
4. Fill in details:
   - Program: English Intermediate
   - Schedule: Mon/Wed 18:00-19:30
   - Capacity: 15 students
   - Teacher: Assign [[Teacher]]
   - Room: Room 302
   - Start Date: Next Monday
5. Check teacher availability (no conflicts)
6. Check room availability
7. Set enrollment open date: Today
8. Click **Save & Publish**
9. System notifies admission team
10. Monitor enrollment progress

**Expected Outcome**: 
- New class created and available for enrollment
- Teacher assigned and notified
- Admission team can start enrolling students

---

### Scenario 2: Handling Student Complaint
**Goal**: Giải quyết khiếu nại về chất lượng giảng dạy

**Steps**:
1. Receive complaint from [[Customer Support]]
2. Review complaint details:
   - Student: Nguyen Van A
   - Class: English Intermediate B
   - Teacher: Ms. Tran
   - Issue: Teacher frequently late, unprepared
3. Check attendance records: 3 late arrivals in 2 weeks
4. Review student feedback scores: Declining trend
5. Schedule meeting with teacher
6. During meeting:
   - Discuss issues
   - Understand root causes
   - Set clear expectations
   - Document action plan
7. Follow-up actions:
   - Monitor next 2 weeks closely
   - Check student satisfaction
   - Provide coaching support
8. Update student on actions taken
9. Schedule follow-up with student after 2 weeks

**Expected Outcome**: 
- Issue addressed professionally
- Teacher performance improves
- Student satisfied with resolution
- Documentation for HR records

---

### Scenario 3: Monthly Performance Review
**Goal**: Review branch performance với [[Organization Admin]]

**Steps**:
1. Navigate to **Reports → Branch Performance**
2. Generate monthly report:
   - Enrollment: 45 new students (target: 40) ✅
   - Revenue: 225M VND (target: 200M) ✅
   - Collection rate: 92% (target: 95%) ⚠️
   - Student satisfaction: 4.2/5 (target: 4.0) ✅
   - Teacher utilization: 78% (target: 75%) ✅
3. Analyze underperformance areas:
   - Collection rate below target
   - Identify 12 overdue invoices
   - Total overdue: 18M VND
4. Action plan:
   - Assign [[Finance Officer]] to follow up
   - Implement payment reminders
   - Offer installment plans
5. Identify growth opportunities:
   - High demand for weekend classes
   - Propose opening Saturday class
6. Prepare presentation for org admin
7. Schedule review meeting
8. Present findings and action plans
9. Get approval for new initiatives

**Expected Outcome**: 
- Clear understanding of branch performance
- Action plans for improvement
- Approval for growth initiatives
- Alignment with organization goals

---

### Scenario 4: Approving Refund Request
**Goal**: Xử lý yêu cầu hoàn tiền hợp lý

**Steps**:
1. Receive refund request from [[Finance Officer]]
2. Navigate to **Finance → Pending Approvals**
3. Review request:
   - Student: Le Thi C
   - Amount: 4,500,000 VND
   - Reason: Family emergency, moving to another city
   - Classes attended: 3/24
4. Verify enrollment and payment records
5. Calculate prorated refund:
   - Total paid: 6,000,000 VND
   - Registration fee (non-refundable): 500,000 VND
   - Used portion: 3/24 × 5,500,000 = 687,500 VND
   - Refundable: 5,500,000 - 687,500 = 4,812,500 VND
6. Review refund policy: ✓ Within policy
7. Check student history: Good standing, no issues
8. Decision: Approve full calculated amount
9. Add approval notes: "Family emergency verified, good student record"
10. Click **Approve**
11. System notifies [[Finance Officer]]
12. Finance processes refund
13. Follow-up email to student wishing them well

**Expected Outcome**: 
- Fair refund processed
- Policy followed consistently
- Student leaves with positive impression
- Documentation complete

---

## Common Tasks

| Task | Frequency | Average Time | Critical? |
|------|-----------|--------------|-----------|
| Review daily operations | Daily | 30 min | Yes |
| Approve leave requests | Weekly | 10 min | Yes |
| Monitor enrollment numbers | Daily | 10 min | Yes |
| Review financial reports | Weekly | 30 min | Yes |
| Handle escalated issues | As needed | 30-60 min | Yes |
| Staff performance reviews | Quarterly | 2 hours/staff | Yes |
| Strategic planning | Monthly | 2-3 hours | Yes |
| Attend management meetings | Weekly | 1 hour | Yes |

---

## Training Requirements

**Required Knowledge**:
- Branch operations management
- Staff management and leadership
- Financial management basics
- Academic program knowledge
- Customer service excellence
- Conflict resolution
- LMS system proficiency

**Training Duration**: 
- Initial training: 1 week
- Hands-on shadowing: 2 weeks
- Ongoing development: Monthly management training

**Training Modules**:
1. Branch Operations Overview (4 hours)
2. Staff Management & HR Policies (3 hours)
3. Financial Management & Reporting (3 hours)
4. Academic Quality Oversight (2 hours)
5. Customer Service & Issue Resolution (2 hours)
6. LMS System Advanced Features (2 hours)

---

## Performance Metrics

Branch Managers are evaluated on:
- **Enrollment Growth**: Monthly new student count vs target
- **Revenue Achievement**: Branch revenue vs budget
- **Collection Rate**: % of invoices paid on time
- **Student Retention**: % of students completing programs
- **Student Satisfaction**: Average rating and NPS
- **Teacher Performance**: Average teacher ratings
- **Operational Efficiency**: Class utilization rate
- **Staff Turnover**: Staff retention rate

**Accessible via**: Dashboard → Branch KPIs

---

## Edge Cases

### Multi-Branch Manager
Q: Can one person manage multiple branches?
A: Yes. Grant scope to multiple branches. Common for small organizations or temporary coverage.

### Branch Manager Leave
Q: Who covers when Branch Manager is on leave?
A: Assign temporary elevation to senior staff (Academic Manager or Finance Officer) or another Branch Manager covers remotely.

### Conflict with Organization Admin
Q: Branch Manager disagrees with org-level policy?
A: Escalate through proper channels. Can provide feedback but must implement org decisions. Document concerns for review.

### Teacher Termination
Q: Can Branch Manager fire a teacher?
A: Can recommend termination to [[Organization Admin]] or [[HR Manager]]. Final decision requires org-level approval due to legal implications.

---

## Notes

- Branch Manager is critical single point of contact for branch operations
- Should have backup/deputy identified for continuity
- Regular communication with Organization Admin required
- Balances autonomy with organizational alignment
- Acts as advocate for branch needs while executing org strategy

---

## Related Documentation

- [[Organization Admin]] - Reports to
- [[Academic Manager]] - Direct report
- [[Finance Officer]] - Direct report
- [[WF-13 Branch Operations]] - Daily operations workflow
- [[Branch Performance Metrics]] - KPI definitions

---

**Last Updated**: 2026-08-25
**Reviewed By**: Organization Admin
**Next Review**: 2026-09-25
