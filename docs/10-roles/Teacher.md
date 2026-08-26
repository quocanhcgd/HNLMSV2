---
title: Teacher
role_id: teacher
category: academic
access_level: 2
created: 2026-08-25
tags: [role, academic, mvp, critical]
---

# 👨‍🏫 Teacher

## Overview

**Role ID**: `teacher`  
**Category**: Academic  
**Access Level**: 2 (Moderate - Class-scoped)  
**License Requirement**: Base System (Included)

---

## Description

Teacher là vai trò trực tiếp giảng dạy, quản lý lớp học được phân công, upload tài liệu học tập, chấm bài và theo dõi tiến độ học sinh. Teacher chỉ có quyền truy cập các lớp được phân công và học sinh trong các lớp đó.

**Typical Users**: 
- Giáo viên chính thức
- Giáo viên thỉnh giảng
- Trợ giảng

---

## Key Responsibilities

### 1. Class Management
- Xem lịch giảng dạy của mình
- Quản lý thông tin lớp học được phân công
- Điểm danh học sinh (tự động với online, manual với offline)
- Ghi chú về tiến độ lớp học
- **🆕 Manage online/offline/hybrid delivery modes**
- **🆕 Start/end recording for online sessions**

### 2. Content Delivery
- Upload learning materials (slides, documents, videos)
- Organize content by topics/sessions
- Share resources with students in class
- Update content as course progresses
- **🆕 AI-assisted content creation & improvement**
- **🆕 Upload to Digital Library with auto-processing**
- **🆕 Review AI-generated tags and categorization**

### 3. Student Assessment (🤖 AI-Enhanced)
- **🆕 AI-generate assignments (or create manually)**
- Tạo đa dạng assignment types: MC, Essay, Speaking, Code, Interactive
- **🆕 AI auto-grading với detailed feedback**
- **🆕 Review & adjust AI grades (optional)**
- Viết nhận xét bổ sung cho học sinh
- **🆕 Track student progress với AI insights**
- **🆕 Early intervention alerts cho struggling students**

### 4. Communication
- Thông báo đến học sinh trong lớp
- **🆕 Q&A board với AI topic classification**
- **🆕 AI-suggested replies cho student questions**
- Phản hồi câu hỏi của học sinh nhanh hơn
- Liên hệ phụ huynh (qua hệ thống)
- **🆕 Schedule appointments với students**

### 5. AI Assistant Features (New!)
- **🤖 AI Teaching Assistant**: Generate lesson plans, exercises
- **🤖 AI Grading**: Auto-grade essays, speaking, code (85-95% accuracy)
- **🤖 AI Feedback**: Personalized, detailed feedback tự động
- **🤖 AI Insights**: Student performance patterns, knowledge gaps
- **🤖 AI Content**: Improve existing content quality

---

## Permissions

### Can View
- [x] Own teaching schedule
- [x] Assigned classes (students, enrollments)
- [x] Student progress in assigned classes
- [x] Student contact information (limited)
- [x] Learning materials in assigned classes
- [x] Class attendance records
- [x] Own performance reports

### Can Create
- [x] Learning materials
- [x] Assignments for assigned classes
- [x] Grades/scores for students
- [x] Class session notes
- [x] Announcements to assigned classes

### Can Edit
- [x] Own learning materials
- [x] Grades before grade lock period
- [x] Class session plans
- [x] Own profile

### Can Delete
- [x] Own learning materials (if not yet shared with students)
- [ ] ~~Student data~~
- [ ] ~~Enrollments~~
- [ ] ~~Financial records~~

**Restrictions**:
- ❌ Cannot create or edit class information (capacity, schedule, fees)
- ❌ Cannot enroll or unenroll students
- ❌ Cannot view other teachers' classes
- ❌ Cannot access financial data
- ❌ Cannot access other branches' data

---

## Scope

**Organization Scope**: No (Branch-limited)
**Branch Scope**: Assigned branch(es)
**Class Scope**: Only assigned classes
**Student Scope**: Only students in assigned classes

---

## Typical Workflows

This role participates in:
- [[WF-02 Teaching & Learning Cycle]] - Primary role
- [[WF-07 Content Management]] - Upload and organize materials
- [[WF-08 Assessment & Grading]] - Create and grade assessments
- [[WF-09 Student Progress Tracking]] - Monitor student performance

---

## Related Roles

**Reports To**: [[Academic Manager]], [[Branch Manager]]
**Collaborates With**: 
- [[Student]] - Teaching relationship
- [[Parent (Addon)]] - Student progress communication
- [[Librarian]] - Content resources
- [[IT Support]] - Technical issues

---

## Navigation Access

**Menu Items Visible**:
```yaml
- Dashboard
  - My Schedule
  - Upcoming Classes
  - Recent Activity
- My Classes
  - Class List (assigned classes only)
  - Attendance (if addon)
  - Gradebook
- Learning
  - Content Library
    - My Content
    - Shared Content
  - Assignments
- Students
  - View students in my classes
  - Student progress
- Reports
  - My Teaching Hours
  - Student Performance (my classes)
- Profile
  - My Information
  - Change Password
```

---

## Data Access Rules

```typescript
// Teacher can only access assigned classes
function canAccessClass(user: Teacher, classId: string): boolean {
  // Check if teacher is assigned to this class
  const assignment = await ClassAssignment.findOne({
    class_id: classId,
    teacher_id: user.id,
    effective_from: LessThanOrEqual(now),
    effective_to: MoreThanOrEqual(now)
  });
  
  return assignment !== null;
}

// Teacher can only view students in assigned classes
function canViewStudent(user: Teacher, studentId: string): boolean {
  // Check if student is enrolled in any of teacher's classes
  const enrollment = await Enrollment.findOne({
    student_id: studentId,
    class_id: In(user.assignedClassIds),
    status: 'active'
  });
  
  return enrollment !== null;
}

// Teacher can create content visible to assigned classes
function canShareContent(user: Teacher, content: Content, classId: string): boolean {
  // Must be assigned to the class
  if (!canAccessClass(user, classId)) return false;
  
  // Must own the content or have permission
  return content.creator_id === user.id || content.is_public;
}
```

---

## User Scenarios

### Scenario 1: Preparing for Class
**Goal**: Upload learning materials trước khi lớp học bắt đầu

**Steps**:
1. Navigate to **My Classes**
2. Select class: `English Beginner - Class A`
3. Go to **Content** tab
4. Click **Upload Material**
5. Select files: `Lesson-01-Introduction.pdf`, `Vocabulary-List.pdf`
6. Set metadata:
   - Topic: `Lesson 1: Greetings`
   - Visible to students: `Yes`
   - Available from: `Today`
7. Click **Upload**
8. Materials appear in class content library
9. Students receive notification of new materials

**Expected Outcome**: 
- Students can access materials before class
- Materials organized by lesson/topic
- Ready for class delivery

---

### Scenario 2: Recording Attendance
**Goal**: Điểm danh học sinh sau buổi học

**Steps**:
1. Navigate to **My Classes → Class A**
2. Go to **Attendance** tab
3. Select session date: `2026-08-25`
4. Mark attendance for each student:
   - `Nguyễn Văn A`: Present
   - `Trần Thị B`: Present
   - `Lê Văn C`: Absent (with reason: Sick)
5. Add session notes: `Completed Lesson 3, Quiz next class`
6. Click **Save Attendance**
7. System calculates attendance rate
8. Parents receive notification if student absent

**Expected Outcome**: 
- Attendance recorded for reporting
- Parents notified of absences
- Academic Manager can view attendance trends

---

### Scenario 3: Grading Assignment
**Goal**: Chấm bài tập và ghi nhận xét

**Steps**:
1. Navigate to **My Classes → Class A → Assignments**
2. Select assignment: `Homework - Lesson 5`
3. View submission list (15 students)
4. Click on student: `Nguyễn Văn A`
5. Review submitted work (PDF file)
6. Enter score: `8.5 / 10`
7. Write feedback: `Good vocabulary usage. Work on grammar.`
8. Click **Save Grade**
9. Repeat for all students
10. Click **Publish Grades**
11. Students receive notification with grades and feedback

**Expected Outcome**: 
- All submissions graded
- Students see grades and feedback
- Grades recorded in gradebook

---

## Common Tasks

| Task | Frequency | Average Time | Critical? |
|------|-----------|--------------|-----------|
| Check daily schedule | Daily | 2 min | Yes |
| Upload learning materials | Per lesson | 10 min | Yes |
| Record attendance | Per session | 5 min | Yes |
| Grade assignments | Weekly | 30-60 min | Yes |
| Respond to student questions | Daily | 15 min | No |
| Prepare lesson plan | Per lesson | 30 min | Yes |
| Update gradebook | After each assessment | 10 min | Yes |

---

## Training Requirements

**Required Knowledge**:
- Basic computer literacy (upload files, navigate web interface)
- Understanding of grading system
- Class management basics
- Content organization best practices

**Training Duration**: 
- Initial training: 2 hours
- Hands-on practice: 3 days
- Ongoing support: As needed

**Training Modules**:
1. System Navigation (30 min)
2. Content Upload & Management (45 min)
3. Attendance & Grading (45 min)

---

## Security Considerations

⚠️ **Data Protection** - Teachers handle student personal data

**Best Practices**:
- Do not share student information outside system
- Do not download bulk student data without approval
- Use secure passwords
- Log out from shared computers
- Report suspicious activity immediately

**Audit Trail**:
Teacher actions are logged:
- Content uploads
- Grade entries and modifications
- Attendance records
- Student data access

---

## Performance Metrics

Teachers are evaluated on:
- **Teaching Hours**: Total contact hours per month
- **Content Creation**: Number of materials uploaded
- **Grading Timeliness**: Average time to grade assignments
- **Student Satisfaction**: Student feedback scores
- **Attendance Rate**: Class attendance percentage

**Accessible via**: Dashboard → My Performance

---

## Edge Cases

### Multiple Class Assignments
Q: Teacher assigned to 10+ classes, how to manage?
A: Use filters on **My Classes** page. Sort by day/time. Set favorite classes for quick access.

### Substitute Teacher
Q: How does substitute teacher access regular teacher's class?
A: [[Academic Manager]] temporarily assigns substitute to class. Substitute inherits same permissions. Original teacher retains access (read-only during substitution).

### Grade Disputes
Q: Student disputes grade, what to do?
A: Teacher can add note explaining grading rationale. If unresolved, escalate to [[Academic Manager]]. Grades can be adjusted with approval and audit trail.

---

## Notes

- Teachers should upload materials at least 24 hours before class
- Grade assignments within 7 days of submission deadline
- Maintain professional communication with students and parents
- Contact [[IT Support]] for technical issues
- Refer policy questions to [[Academic Manager]]

---

## Related Documentation

- [[Student]] - Primary users taught by teachers
- [[Academic Manager]] - Supervisor for academic matters
- [[WF-02 Teaching & Learning Cycle]] - Detailed teaching workflow
- [[Content Management Guide]] - Best practices for uploading materials

---

**Last Updated**: 2026-08-25
**Reviewed By**: Academic Manager
**Next Review**: 2026-09-25
