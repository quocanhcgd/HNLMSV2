---
title: Academic Manager
role_id: academic_manager
category: academic
access_level: 3
created: 2026-08-25
tags: [role, academic, mvp, critical]
---

# 📚 Academic Manager

## Overview

**Role ID**: `academic_manager`  
**Category**: Academic  
**Access Level**: 3 (High - Academic operations)  
**License Requirement**: Base System (Included)

---

## Description

Academic Manager quản lý curriculum, programs, teacher assignments, và academic quality. Đảm bảo chất lượng giảng dạy đồng nhất, phát triển chương trình, và giám sát hiệu quả học tập của học viên.

**Typical Users**: 
- Trưởng phòng đào tạo
- Curriculum Director
- Academic Coordinator

---

## Key Responsibilities

### 1. Curriculum Management (🤖 AI-Enhanced)
- Develop và update programs
- Design course content structure
- Set learning objectives
- Review và approve syllabus
- **🆕 AI-assisted curriculum design**
- **🆕 Competency-based learning pathways**
- **🆕 AI analysis of curriculum effectiveness**

### 2. Class Operations (🤖 AI-Enhanced)
- Create class schedules (offline/online/hybrid)
- Assign teachers to classes
- Monitor class capacity
- Handle schedule conflicts
- **🆕 AI-optimized scheduling**
- **🆕 Manage multi-mode delivery (offline/online/hybrid/flexible)**
- **🆕 Emergency mode switching support**

### 3. Teacher Management (🤖 AI-Enhanced)
- Recruit và onboard teachers
- Conduct teacher observations
- Provide coaching và development
- Evaluate teaching performance
- **🆕 AI insights on teacher effectiveness**
- **🆕 AI-powered performance analytics**
- **🆕 Automated workload balancing**

### 4. Academic Quality (🤖 AI-Enhanced)
- Monitor student progress và satisfaction
- Review assessment results
- Ensure teaching standards
- Handle academic complaints
- **🆕 AI-powered quality insights**
- **🆕 Early intervention recommendations**
- **🆕 Predictive analytics for student success**

### 5. Assessment Oversight (🤖 AI-Enhanced)
- Design placement tests
- Review grading standards
- Approve grade adjustments
- Manage examination process
- **🆕 Review AI auto-grading accuracy**
- **🆕 Competency-based assessment framework**
- **🆕 AI-generated assessment analytics**

### 6. Content & Library Management (New!)
- **🆕 Oversee Digital Library content quality**
- **🆕 Review AI-tagged content**
- **🆕 Approve teacher-submitted content**
- **🆕 Monitor content usage analytics**

### 7. AI-Powered Insights (New!)
- **🤖 Dashboard Analytics**: Real-time academic metrics
- **🤖 Predictive Models**: Student success predictions
- **🤖 Quality Insights**: AI identifies improvement areas
- **🤖 Benchmark Reports**: Compare across programs/classes
- **🤖 Intervention Alerts**: Struggling students/classes

---

## Permissions

### Can View
- [x] All academic data (branch-scoped)
- [x] Programs, courses, classes
- [x] Teacher information và schedules
- [x] Student academic records
- [x] Assessment results
- [x] Teaching materials

### Can Create
- [x] Programs và courses
- [x] Classes và schedules
- [x] Assessment templates
- [x] Academic policies
- [x] Teacher assignments

### Can Edit
- [x] Program curriculum
- [x] Course content
- [x] Class schedules
- [x] Teacher assignments
- [x] Grades (with approval workflow)

### Can Delete
- [x] Draft programs (not published)
- [x] Empty classes (no enrollments)
- [ ] ~~Cannot delete enrolled classes~~
- [ ] ~~Cannot delete student records~~

**Restrictions**:
- ❌ Cannot process payments
- ❌ Cannot access other branches' academic data
- ❌ Cannot modify organization-level settings
- ❌ Cannot create user accounts (except teacher recommendations)

---

## Scope

**Organization Scope**: No
**Branch Scope**: Assigned branch(es)
**Academic Scope**: Full access within branch

---

## Typical Workflows

- [[WF-01 Enrollment Journey]] - Assessment phase
- [[WF-02 Teaching & Learning Cycle]] - Quality oversight
- [[WF-19 Curriculum Development]]
- [[WF-20 Teacher Performance Review]]

---

## Related Roles

**Reports To**: [[Branch Manager]]
**Manages**: [[Teacher]], [[Librarian]]
**Collaborates With**: 
- [[Admission Consultant]] - Program recommendations
- [[Student]] - Academic support
- [[Organization Admin]] - Curriculum alignment

---

## Navigation Access

```yaml
- Dashboard
  - Academic Overview
  - Class Schedule
  - Teacher Workload
- Programs
  - Program Catalog
  - Create/Edit Program
  - Course Management
- Classes
  - All Classes
  - Create Class
  - Schedule Management
  - Teacher Assignment
- Teachers
  - Teacher Directory
  - Availability
  - Performance
  - Observations
- Students
  - Academic Records
  - Progress Tracking
  - Assessment Results
- Assessments
  - Placement Tests
  - Exam Management
  - Grading Standards
- Reports
  - Class Utilization
  - Student Performance
  - Teacher Effectiveness
  - Program Completion Rates
```

---

## User Scenarios

### Scenario 1: Creating New Program

**Goal**: Develop English Business Communication program

**Steps**:
1. Navigate to **Programs → Create Program**
2. Program details:
   - Name: "Business English Communication"
   - Level: Intermediate-Advanced
   - Duration: 3 months (36 hours)
   - Frequency: 2x per week, 1.5h per session
3. Define learning objectives:
   - Professional email writing
   - Business meetings participation
   - Presentation skills
   - Negotiation language
4. Create course structure:
   - Module 1: Business Vocabulary (6h)
   - Module 2: Email & Reports (6h)
   - Module 3: Meetings & Discussions (12h)
   - Module 4: Presentations (12h)
5. Set assessment criteria:
   - Weekly assignments: 30%
   - Mid-term project: 30%
   - Final presentation: 40%
6. Define prerequisites:
   - Intermediate English level
   - Placement test score > 60%
7. Set pricing: 8,000,000 VND
8. Upload syllabus document
9. Submit for [[Organization Admin]] approval
10. After approval, publish program
11. Train consultants on new offering
12. Create marketing materials

**Expected Outcome**: New program ready for enrollment

---

### Scenario 2: Assigning Teacher to Class

**Goal**: Staff new evening class

**Steps**:
1. New class created: "English Intermediate C"
   - Schedule: Tue/Thu 19:00-20:30
   - Start: Next week
   - Capacity: 15 students
2. Navigate to **Classes → Teacher Assignment**
3. Check teacher availability:
   - Ms. Nguyen: Conflict (teaches until 19:00)
   - Mr. Tran: Available
   - Ms. Le: Available
4. Review teacher profiles:
   - Mr. Tran: 3 years exp, good reviews
   - Ms. Le: 5 years exp, excellent reviews
5. Consider workload:
   - Mr. Tran: 18 hours/week (can add)
   - Ms. Le: 24 hours/week (at capacity)
6. Decision: Assign Mr. Tran
7. Click **Assign Teacher**
8. System checks conflicts: None
9. Confirm assignment
10. System notifies Mr. Tran
11. Send welcome email to enrolled students
12. Add to teacher's schedule
13. Monitor first few classes for quality

**Expected Outcome**: Class properly staffed with suitable teacher

---

### Scenario 3: Handling Teacher Performance Issue

**Goal**: Address declining student satisfaction

**Steps**:
1. Review weekly reports: Ms. Pham's classes show declining satisfaction
   - Week 1: 4.5/5
   - Week 2: 4.2/5
   - Week 3: 3.8/5 ⚠️
2. Check detailed feedback:
   - "Classes boring, too much grammar"
   - "Teacher not engaging"
   - "Need more speaking practice"
3. Schedule observation:
   - Observe next class unannounced
4. During observation, note issues:
   - 70% lecture, 30% practice (should be reverse)
   - Limited student interaction
   - Heavy textbook reliance
5. Post-observation meeting with Ms. Pham:
   - Share observations positively
   - Understand her perspective
   - "What challenges are you facing?"
6. Create improvement plan:
   - Target: More interactive activities
   - Resources: Share activity ideas
   - Timeline: Improve over 2 weeks
   - Support: Pair with mentor teacher
7. Follow-up actions:
   - Observe again in 2 weeks
   - Check student feedback
   - Provide coaching resources
8. Week 5 review:
   - Satisfaction improved to 4.3/5
   - Students notice positive changes
   - Ms. Pham feels supported
9. Continue monitoring monthly
10. Document in performance file

**Expected Outcome**: Teacher improves, students satisfied

---

### Scenario 4: Approving Grade Change

**Goal**: Handle grade dispute fairly

**Steps**:
1. Receive request from [[Teacher]]:
   - Student: Nguyen Van A
   - Current grade: 7.5/10
   - Requested: 8.0/10
   - Reason: "Calculation error in final exam"
2. Review supporting documents:
   - Original exam paper
   - Grading rubric
   - Teacher's recalculation
3. Verify calculation:
   - Section 1: 8/10 ✓
   - Section 2: 7/10 (was marked 6/10) ⚠️
   - Section 3: 9/10 ✓
   - New total: 8.0/10 ✓
4. Confirm legitimate error
5. Check grade change policy:
   - Within 30 days: Allowed
   - Documentation required: ✓
   - Manager approval: Required
6. Approve grade change
7. Add approval note: "Grading calculation error verified"
8. System updates grade
9. System logs change in audit trail
10. Notify student of correction
11. Remind teacher of double-check importance

**Expected Outcome**: Grade corrected fairly, process documented

---

## Common Tasks

| Task | Frequency | Time |
|------|-----------|------|
| Review class schedules | Daily | 15 min |
| Teacher assignments | Weekly | 30 min |
| Program development | Monthly | 4 hours |
| Teacher observations | Weekly | 1 hour/observation |
| Performance reviews | Quarterly | 2 hours/teacher |
| Curriculum updates | Semester | 8 hours |
| Handle academic issues | As needed | 30-60 min |

---

## Training Requirements

**Duration**: 2 weeks
**Topics**:
1. Curriculum design principles (8 hours)
2. Teacher management (6 hours)
3. Assessment methodology (4 hours)
4. Quality assurance (4 hours)
5. System training (4 hours)

---

## Performance Metrics

- **Class Utilization**: Average capacity fill rate (Target: 85%)
- **Student Satisfaction**: Average rating (Target: 4.2/5)
- **Teacher Performance**: Average teacher rating (Target: 4.0/5)
- **Completion Rate**: % students completing programs (Target: 80%)
- **Schedule Efficiency**: Classes per teacher per week (Target: 18-22h)

---

## Edge Cases

### Teacher Resignation Mid-Term
Q: Teacher quits with 2 weeks notice, class ongoing?
A: 1) Find substitute immediately 2) Assign experienced teacher 3) Communicate change to students 4) Offer makeup sessions if needed 5) Monitor transition closely

### Program Not Selling
Q: New program has low enrollment after 2 months?
A: 1) Analyze why (pricing, timing, marketing) 2) Gather feedback from consultants 3) Consider adjustments 4) Pilot discount 5) If still fails, pause and revise

### Grade Inflation Concerns
Q: All students getting high grades, quality concerns?
A: 1) Review assessment rigor 2) Compare with standards 3) Moderate grading across teachers 4) Adjust rubrics if needed 5) Teacher calibration session

---

## Notes

- Balance academic quality with business needs
- Support teachers - they're your front line
- Stay current with teaching methodologies
- Foster collaborative academic culture
- Measure what matters: learning outcomes

---

**Last Updated**: 2026-08-25
