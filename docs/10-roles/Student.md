---
title: Student
role_id: student
category: learner
access_level: 1
created: 2026-08-25
tags: [role, learner, mvp, critical]
---

# 🎓 Student

## Overview

**Role ID**: `student`  
**Category**: Learner  
**Access Level**: 1 (Limited - Self-scoped)  
**License Requirement**: Base System (Included)

---

## Description

Student là vai trò học viên chính thức, có thể xem lớp học đã ghi danh, truy cập tài liệu học tập, nộp bài tập, xem điểm số và theo dõi tiến độ học tập của bản thân. Student chỉ có quyền xem dữ liệu liên quan đến chính mình.

**Typical Users**: 
- Học viên đã đăng ký và thanh toán
- Học viên đang học
- Học viên tạm nghỉ (limited access)

---

## Key Responsibilities

### 1. Learning (🤖 AI-Enhanced)
- Tham gia lớp học (offline/online/hybrid modes)
- **🆕 AI-powered personalized learning paths**
- Truy cập Digital Library với AI recommendations
- **🆕 Receive AI-suggested content based on progress**
- Hoàn thành đa dạng assignment types (MC, Essay, Speaking, Code)
- **🆕 Get instant AI feedback on submissions**
- Tham gia activities và discussions
- **🆕 Access interactive content with auto-grading**

### 2. Self-Management (🤖 AI-Enhanced)
- Xem lịch học của mình (online/offline sessions)
- **🆕 AI-powered progress tracking & insights**
- Track tiến độ học tập với visual analytics
- **🆕 Receive early intervention alerts if struggling**
- Xem điểm số với detailed AI feedback
- **🆕 Get personalized study recommendations**
- Cập nhật thông tin cá nhân
- **🆕 View competency-based assessments**

### 3. Communication (🤖 AI-Enhanced)
- **🆕 Ask questions via Q&A board (public/private)**
- Đặt câu hỏi cho giáo viên qua messaging
- **🆕 Schedule appointments with teachers**
- Nhận thông báo real-time (push, email, in-app)
- Xem announcements và updates
- **🆕 Multi-channel communication hub**

### 4. Financial Awareness
- Xem invoices và payment status
- Xem lịch sử thanh toán
- Nhận receipts tự động
- **🆕 View payment reminders & notifications**

### 5. AI Learning Assistant (New!)
- **🤖 Personalized Recommendations**: AI suggests next content
- **🤖 Adaptive Learning**: Difficulty adjusts to your level
- **🤖 Progress Insights**: AI identifies strengths & gaps
- **🤖 Smart Search**: Semantic search in library
- **🤖 Instant Feedback**: AI feedback on assignments

---

## Permissions

### Can View
- [x] Own profile and enrollment information
- [x] Enrolled classes (schedule, teacher, location)
- [x] Learning materials in enrolled classes
- [x] Own assignments and submissions
- [x] Own grades and feedback
- [x] Own progress and attendance
- [x] Own invoices and payments
- [x] Public library resources

### Can Create
- [x] Assignment submissions
- [x] Questions/comments in class discussion
- [x] Profile updates (contact info)

### Can Edit
- [x] Own profile information
- [x] Own assignment submissions (before deadline)
- [x] Own password

### Can Delete
- [x] Own assignment submissions (before teacher grades)
- [ ] ~~Nothing else~~

**Restrictions**:
- ❌ Cannot view other students' data
- ❌ Cannot access classes not enrolled in
- ❌ Cannot modify grades
- ❌ Cannot access teacher-only materials
- ❌ Cannot view financial data of other students
- ❌ Cannot enroll/unenroll self (requires admin)

---

## Scope

**Organization Scope**: No
**Branch Scope**: Enrolled branch only
**Class Scope**: Only enrolled classes
**Student Scope**: Self only

---

## Typical Workflows

This role participates in:
- [[WF-01 Enrollment Journey]] - As the primary subject
- [[WF-02 Teaching & Learning Cycle]] - As learner
- [[WF-03 Financial Operations]] - Viewing invoices and making payments
- [[WF-10 Student Self-Service]] - Managing own data

---

## Related Roles

**Reports To**: [[Teacher]] (academic matters)
**Interacts With**: 
- [[Teacher]] - Receives instruction
- [[Parent (Addon)]] - Family oversight
- [[Finance Officer]] - Payment inquiries
- [[Customer Support]] - General help

---

## Navigation Access

**Menu Items Visible**:
```yaml
- Dashboard
  - My Classes
  - Upcoming Sessions
  - Assignments Due
  - Recent Grades
- My Classes
  - Class Details
  - Schedule
  - Materials
  - Assignments
  - Gradebook (own grades)
- Library
  - Browse Resources
  - My Bookmarks
- My Learning
  - Progress Overview
  - Attendance
  - Certificates (if completed)
- Finance
  - My Invoices
  - Payment History
  - Make Payment (link)
- Profile
  - Personal Information
  - Change Password
  - Notification Settings
```

---

## Data Access Rules

```typescript
// Student can only access own data
function canAccessClass(user: Student, classId: string): boolean {
  // Check if student is enrolled in this class
  const enrollment = await Enrollment.findOne({
    student_id: user.student_id,
    class_id: classId,
    status: In(['active', 'completed'])
  });
  
  return enrollment !== null;
}

// Student can only view own grades
function canViewGrade(user: Student, gradeId: string): boolean {
  const grade = await Grade.findOne({
    id: gradeId,
    student_id: user.student_id
  });
  
  return grade !== null;
}

// Student can only submit assignments for enrolled classes
function canSubmitAssignment(user: Student, assignmentId: string): boolean {
  const assignment = await Assignment.findOne({ id: assignmentId });
  if (!assignment) return false;
  
  // Must be enrolled in the class
  const enrolled = await canAccessClass(user, assignment.class_id);
  if (!enrolled) return false;
  
  // Must be before deadline
  if (assignment.due_date < new Date()) return false;
  
  return true;
}
```

---

## User Scenarios

### Scenario 1: Viewing Class Schedule
**Goal**: Xem lịch học tuần này

**Steps**:
1. Login to student portal
2. Dashboard shows today's classes
3. Click **My Classes** in sidebar
4. View all enrolled classes
5. Click on class: `English Beginner - Class A`
6. See schedule:
   - Monday, Wednesday: 18:00 - 19:30
   - Location: Room 201, HN Central Branch
   - Teacher: Ms. Nguyen
7. Click **Add to Calendar** to sync with personal calendar

**Expected Outcome**: 
- Clear visibility of weekly schedule
- Know when and where to attend class
- Can plan personal schedule accordingly

---

### Scenario 2: Accessing Learning Materials
**Goal**: Download tài liệu học tập trước giờ học

**Steps**:
1. Navigate to **My Classes → English Beginner A**
2. Click **Materials** tab
3. See materials organized by lesson:
   - Lesson 1: Greetings
   - Lesson 2: Introductions
   - Lesson 3: Daily Routines (New!)
4. Click on **Lesson 3** folder
5. See files:
   - `Lesson-03-Slides.pdf` (2.5 MB)
   - `Vocabulary-List.pdf` (500 KB)
   - `Practice-Exercises.pdf` (1 MB)
6. Click download icon for each file
7. Files saved to device
8. Read materials before class

**Expected Outcome**: 
- Materials downloaded successfully
- Student prepared for class
- Better learning outcomes

---

### Scenario 3: Submitting Assignment
**Goal**: Nộp bài tập đúng hạn

**Steps**:
1. Receive notification: "Assignment due in 2 days"
2. Navigate to **My Classes → Assignments**
3. See assignment: `Homework - Lesson 5`
   - Due: Aug 30, 23:59
   - Status: Not Submitted
4. Click **View Details**
5. Read assignment instructions
6. Click **Upload Submission**
7. Select file from device: `Homework-Lesson5-NguyenVanA.pdf`
8. Add optional note: `Completed all exercises`
9. Click **Submit**
10. See confirmation: "Submitted successfully"
11. Status changes to: `Submitted - Awaiting Grade`

**Expected Outcome**: 
- Assignment submitted on time
- Teacher receives submission for grading
- Student can track submission status

---

### Scenario 4: Checking Grades
**Goal**: Xem điểm bài kiểm tra vừa làm

**Steps**:
1. Receive notification: "New grade available"
2. Navigate to **My Classes → English Beginner A → Gradebook**
3. See grades table:
   - Homework 1: 8.5/10 ✓
   - Homework 2: 9.0/10 ✓
   - Quiz 1: 7.5/10 ✓
   - Midterm Exam: 8.0/10 (New!)
4. Click on **Midterm Exam**
5. See detailed feedback:
   - Listening: 8.5/10 - "Good comprehension"
   - Reading: 7.5/10 - "Work on vocabulary"
   - Writing: 8.0/10 - "Nice structure, minor grammar errors"
6. Download graded exam paper with teacher's annotations
7. Note areas for improvement

**Expected Outcome**: 
- Clear understanding of performance
- Specific feedback for improvement
- Motivated to work on weak areas

---

### Scenario 5: Making Payment
**Goal**: Thanh toán học phí online

**Steps**:
1. Navigate to **Finance → My Invoices**
2. See invoice: `INV-2024-001`
   - Amount: 5,000,000 VND
   - Due: Sep 1, 2024
   - Status: Pending
3. Click **Pay Online**
4. Select payment method: VNPay
5. Click **Generate Payment Link**
6. Redirected to VNPay portal
7. Login to banking app, confirm payment
8. Redirected back to LMS
9. See confirmation: "Payment successful"
10. Invoice status changes to: Paid
11. Receive receipt via email

**Expected Outcome**: 
- Payment completed quickly and securely
- Invoice marked as paid
- Receipt for record keeping

---

## Common Tasks

| Task | Frequency | Average Time | Critical? |
|------|-----------|--------------|-----------|
| Check class schedule | Daily | 1 min | Yes |
| Download materials | Before each class | 3 min | Yes |
| Submit assignments | Weekly | 10 min | Yes |
| Check grades | After assessments | 2 min | No |
| View invoices | Monthly | 2 min | Yes |
| Update profile | Rarely | 5 min | No |

---

## Training Requirements

**Required Knowledge**:
- Basic computer/smartphone usage
- How to download files
- How to upload files (for assignments)
- Basic navigation of web interface

**Training Duration**: 
- Initial training: 30 minutes
- Quick start guide provided
- Video tutorials available

**Training Modules**:
1. System Login (5 min)
2. Viewing Classes & Materials (10 min)
3. Submitting Assignments (10 min)
4. Making Payments (5 min)

---

## Security Considerations

⚠️ **Personal Data Protection** - Students' own data

**Best Practices**:
- Use strong password (minimum 8 characters)
- Do not share login credentials
- Log out from shared devices
- Verify payment page is secure (HTTPS) before entering bank info
- Report suspicious emails claiming to be from LMS

**Privacy**:
- Student data is private by default
- Other students cannot see your grades or personal info
- Only assigned teachers and admins can view your data

---

## Performance Metrics

Students can track their own:
- **Attendance Rate**: Percentage of classes attended
- **Assignment Completion**: Percentage of assignments submitted on time
- **Average Grade**: Overall academic performance
- **Progress**: Percentage of course completed

**Accessible via**: Dashboard → My Progress

---

## Edge Cases

### Parent Access
Q: Can parents see my grades?
A: Only if [[Parent (Addon)]] feature is enabled and you/admin grant them access.

### Class Transfer
Q: I want to switch to a different class time, how?
A: Contact [[Branch Manager]] or [[Customer Support]]. They will process transfer if space available.

### Payment Issues
Q: Payment failed but money was deducted, what to do?
A: Contact [[Finance Officer]] with transaction reference. System will reconcile within 24 hours.

### Certificate Not Available
Q: Completed course but no certificate?
A: Certificates issued after final grade is confirmed and all fees paid. Check with [[Academic Manager]].

---

## Notes

- Students should check Dashboard daily for updates
- Enable notifications (email/SMS) to stay informed
- Download important materials as backup
- Contact [[Customer Support]] for any issues
- Read class rules and attendance policy in course syllabus

---

## Related Documentation

- [[Teacher]] - Your instructors
- [[Parent (Addon)]] - Family access (if enabled)
- [[WF-02 Teaching & Learning Cycle]] - How learning works
- [[Student Handbook]] - Complete guide for students

---

**Last Updated**: 2026-08-25
**Reviewed By**: Academic Manager
**Next Review**: 2026-09-25
