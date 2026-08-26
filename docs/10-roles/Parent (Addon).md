---
title: Parent (Addon)
role_id: parent
category: learner
access_level: 1
created: 2026-08-25
tags: [role, learner, addon]
---

# 👨‍👩‍👧 Parent

## Overview

**Role ID**: `parent`  
**Category**: Learner/Guardian  
**Access Level**: 1 (Limited - Delegated student access)  
**License Requirement**: Student Portal Enhancement Addon

---

## Description

Parent role cho phép phụ huynh xem thông tin học tập của con em, theo dõi tiến độ, giao tiếp với giáo viên, và quản lý các vấn đề tài chính. Requires addon activation.

---

## Key Responsibilities

- Monitor student academic progress
- View attendance và grades
- Communicate với teachers
- Manage financial obligations
- Receive notifications about student

---

## Permissions

### Can View
- [x] Child's class schedule
- [x] Child's attendance
- [x] Child's grades và progress
- [x] Child's learning materials
- [x] Child's invoices và payments
- [x] Teacher feedback

### Can Create
- [x] Messages to teachers
- [x] Meeting requests
- [x] Excuse notes

### Can Edit
- [x] Own profile
- [x] Notification preferences

### Can Delete
- [ ] ~~Cannot delete anything~~

---

## Delegation Setup

**Setup Process**:
1. Student or [[Organization Admin]] grants parent access
2. Parent receives invitation email
3. Parent creates account
4. System links parent to student(s)
5. Parent can view múltiple children if applicable

**Access Control**:
- Parent sees exactly what student sees
- Read-only access (cannot submit assignments for student)
- Can communicate on behalf of student
- Financial access (view và pay invoices)

---

## Typical Workflows

- [[WF-33 Parent Monitoring]]
- [[WF-34 Parent-Teacher Communication]]

---

## Related Roles

**Monitors**: [[Student]] (their children)
**Communicates With**: [[Teacher]], [[Academic Manager]]

---

## User Scenarios

### Scenario 1: Checking Child's Progress

**Steps**:
1. Login to parent portal
2. Dashboard shows overview:
   - Child: Nguyen Van A
   - Class: English Intermediate B
   - Attendance: 18/20 (90%)
   - Latest grade: 8.5/10
3. Click **View Details**
4. See detailed progress:
   - Homework completion: 9/10 assignments
   - Quiz average: 8.2/10
   - Class participation: Good
5. View teacher comments:
   - "Good student, active in class"
   - "Needs improvement in grammar"
6. Check upcoming:
   - Quiz next week on Unit 5
   - Project due in 2 weeks

**Expected Outcome**: Parent informed về học tập của con

---

### Scenario 2: Communicating với Teacher

**Steps**:
1. Navigate to **Messages**
2. Click **New Message to Teacher**
3. Select teacher: Ms. Nguyen
4. Subject: "Request for extra support"
5. Message:
   "Hello Ms. Nguyen,
   
   I noticed my son is struggling with grammar.
   Could we schedule a meeting to discuss how
   to support him at home?
   
   Thank you,
   Mr. Tran"
6. Click **Send**
7. Teacher receives notification
8. Teacher replies with meeting options
9. Parent books meeting time
10. Meeting conducted
11. Parent receives action items

**Expected Outcome**: Productive parent-teacher communication

---

### Scenario 3: Paying Invoice

**Steps**:
1. Receive notification: "Invoice due in 3 days"
2. Login to portal
3. Navigate to **Finance → Invoices**
4. See invoice: 5,000,000 VND due
5. Review charges:
   - Tuition: 4,500,000 VND
   - Materials: 500,000 VND
6. Click **Pay Online**
7. Select VNPay
8. Complete payment
9. Receive confirmation
10. Receipt emailed

**Expected Outcome**: Payment completed conveniently

---

## Common Tasks

| Task | Frequency | Time |
|------|-----------|------|
| Check progress | Weekly | 5 min |
| View grades | After assessments | 2 min |
| Message teachers | As needed | 10 min |
| Pay invoices | Monthly | 5 min |
| Check attendance | Weekly | 2 min |

---

## Notes

- Parent access enhances student accountability
- Improves parent-school communication
- Reduces manual reporting burden on staff
- Parents appreciate transparency

---

**Last Updated**: 2026-08-25
