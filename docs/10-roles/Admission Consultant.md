---
title: Admission Consultant
role_id: admission_consultant
category: admission
access_level: 2
created: 2026-08-25
tags: [role, admission, mvp, critical]
---

# 💼 Admission Consultant

## Overview

**Role ID**: `admission_consultant`  
**Category**: Admission & Sales  
**Access Level**: 2 (Moderate - Lead & Student scoped)  
**License Requirement**: Base System (Included)

---

## Description

Admission Consultant là vai trò chịu trách nhiệm chuyển đổi leads thành students, thông qua tư vấn, hỗ trợ assessment, và hướng dẫn enrollment process. Đây là vai trò then chốt trong revenue generation.

**Typical Users**: 
- Tư vấn viên tuyển sinh
- Sales consultant
- Enrollment advisor

---

## Key Responsibilities

### 1. Lead Management (🤖 AI-Enhanced)
- Receive và follow-up leads (auto-routed)
- Qualify leads based on needs and fit
- Maintain lead pipeline và conversion funnel
- Track lead sources và effectiveness
- **🆕 AI auto-scoring and prioritization**
- **🆕 AI-suggested follow-up actions**
- **🆕 Automated lead assignment based on workload**
- **🆕 Predictive conversion probability**

### 2. Consultation & Advisory (🤖 AI-Enhanced)
- Conduct consultation meetings (in-person/online/video)
- Understand student goals và background
- Recommend appropriate programs
- Explain pricing, schedule, và policies
- Address questions và concerns
- **🆕 AI-recommended programs based on student profile**
- **🆕 AI-suggested talking points and objection handling**
- **🆕 Access student success predictions**
- **🆕 Virtual meeting room integration**

### 3. Enrollment Coordination (🤖 AI-Enhanced)
- Guide students through enrollment process
- Schedule placement tests với teachers
- Coordinate class selection
- Create enrollment records
- Follow up until payment completed
- **🆕 AI-powered class recommendations**
- **🆕 Automated scheduling with availability check**
- **🆕 AI assessment for placement**
- **🆕 Automated payment reminders**

### 4. Relationship Building (🤖 AI-Enhanced)
- Build trust với potential students
- Maintain relationships with prospects
- Generate referrals from satisfied students
- Represent school professionally
- **🆕 AI-powered communication hub**
- **🆕 Automated follow-up sequences**
- **🆕 Sentiment analysis on communications**
- **🆕 Smart email/SMS campaigns**

### 5. AI Sales Assistant (New!)
- **🤖 Lead Scoring**: AI prioritizes hot leads
- **🤖 Next Best Action**: AI suggests next steps
- **🤖 Churn Prediction**: Identify at-risk prospects
- **🤖 Performance Analytics**: Track conversion metrics
- **🤖 Smart Responses**: AI-suggested replies to inquiries

---

## Permissions

### Can View
- [x] Assigned leads (own leads only)
- [x] Lead history và notes
- [x] Available programs và classes
- [x] Class schedules và capacity
- [x] Student profiles (enrolled by self)
- [x] Enrollment status
- [x] Own performance metrics

### Can Create
- [x] Lead records
- [x] Consultation notes
- [x] Follow-up tasks
- [x] Enrollment records
- [x] Student profiles (during enrollment)

### Can Edit
- [x] Lead information
- [x] Lead status
- [x] Consultation notes
- [x] Enrollment details (before payment)

### Can Delete
- [x] Draft enrollments (not yet paid)
- [ ] ~~Cannot delete leads~~
- [ ] ~~Cannot delete paid enrollments~~

**Restrictions**:
- ❌ Cannot access other consultants' leads
- ❌ Cannot modify invoice amounts
- ❌ Cannot process payments (Finance Officer only)
- ❌ Cannot create or modify classes
- ❌ Cannot approve refunds

---

## Scope

**Organization Scope**: No
**Branch Scope**: Assigned branch(es)
**Lead Scope**: Own assigned leads only
**Student Scope**: Students enrolled by self (for tracking)

---

## Typical Workflows

This role participates in:
- [[WF-01 Enrollment Journey]] - Primary driver (Phase 2-4)
- [[WF-15 Lead Management]] - Lead nurturing
- [[WF-16 Consultation Process]] - Meeting workflow

---

## Related Roles

**Reports To**: [[Branch Manager]]
**Collaborates With**: 
- [[Receptionist]] - Lead handoff
- [[Teacher]] - Assessment coordination
- [[Finance Officer]] - Payment confirmation
- [[Academic Manager]] - Program recommendations
- [[Student]] - Ongoing relationship

---

## Navigation Access

**Menu Items Visible**:
```yaml
- Dashboard
  - My Leads
  - Today's Consultations
  - Pending Enrollments
  - Conversion Funnel
- Leads
  - My Leads
    - New
    - Contacted
    - Qualified
    - Lost
  - Add New Lead
  - Lead Sources Report
- Consultations
  - Schedule Consultation
  - Today's Meetings
  - Follow-ups Due
- Enrollments
  - My Enrollments
  - Pending Payment
  - Active Students
  - Create Enrollment
- Programs
  - Program Catalog (view only)
  - Class Availability
  - Pricing Information
- Reports
  - My Performance
  - Conversion Rate
  - Lead Sources
```

---

## Data Access Rules

```typescript
// Consultant can only access own leads
function canAccessLead(user: AdmissionConsultant, leadId: string): boolean {
  const lead = await Lead.findOne({ id: leadId });
  if (!lead) return false;
  
  // Must be assigned to this consultant
  return lead.assigned_consultant_id === user.id;
}

// Can create enrollment for qualified leads
function canCreateEnrollment(user: AdmissionConsultant, leadId: string): boolean {
  if (!canAccessLead(user, leadId)) return false;
  
  const lead = await Lead.findOne({ id: leadId });
  
  // Lead must be qualified
  return lead.status === 'qualified';
}

// Can view students enrolled by self (for follow-up)
function canViewStudent(user: AdmissionConsultant, studentId: string): boolean {
  const enrollment = await Enrollment.findOne({
    student_id: studentId,
    created_by: user.id
  });
  
  return enrollment !== null;
}
```

---

## User Scenarios

### Scenario 1: Following Up New Lead
**Goal**: Contact lead trong 24 hours và schedule consultation

**Steps**:
1. Login và check **Dashboard → My Leads → New**
2. See new lead: Nguyen Thi Mai
   - Source: Website form
   - Interested: English course
   - Phone: 0912-345-678
   - Submitted: Yesterday 3:00 PM
3. Review lead details và notes
4. Call lead:
   - Introduce self và school
   - Confirm interest in English
   - Ask about goals và current level
   - Suggest consultation meeting
5. Lead agrees to meet tomorrow 6:00 PM
6. Update lead:
   - Status: Contacted
   - Add note: "Called, friendly, interested in evening classes"
   - Schedule consultation in system
7. System sends confirmation email/SMS to lead
8. Add reminder for self 1 hour before meeting

**Expected Outcome**: 
- Lead contacted within 24 hours ✅
- Consultation scheduled
- Lead feels valued và engaged

---

### Scenario 2: Conducting Consultation
**Goal**: Understand needs và recommend program

**Steps**:
1. Prepare for consultation:
   - Review lead background
   - Check available classes
   - Print program brochures
2. Welcome lead at reception
3. Consultation meeting (45 min):
   
   **Rapport Building** (5 min):
   - Small talk, make comfortable
   - Offer water/coffee
   
   **Needs Assessment** (15 min):
   - Why learning English?
   - Current level (self-assessment)
   - Learning goals (work, travel, exam)
   - Schedule constraints
   - Budget considerations
   
   **Program Presentation** (15 min):
   - Explain course structure
   - Show curriculum
   - Discuss teaching methodology
   - Highlight success stories
   - Address specific needs
   
   **Logistics** (10 min):
   - Show facilities (if walk-in)
   - Discuss schedule options
   - Explain pricing và payment
   - Review policies
   
   **Next Steps** (5 min):
   - Recommend placement test
   - Explain enrollment process
   - Answer questions
   - Give timeline

4. After meeting:
   - Update lead status: Qualified
   - Add detailed notes
   - Schedule assessment if needed
   - Send follow-up email with materials
5. Set follow-up task for 2 days

**Expected Outcome**: 
- Lead understands program clearly
- Consultant identified fit
- Next steps defined
- Lead feels confident

---

### Scenario 3: Handling Objection
**Goal**: Address concern về price

**Steps**:
1. Lead says: "Too expensive, cheaper schools exist"
2. Acknowledge concern:
   - "I understand budget is important"
   - "Let me explain our value"
3. Present value proposition:
   
   **Quality Teaching**:
   - Small class size (max 15)
   - Experienced native/near-native teachers
   - Modern methodology
   
   **Comprehensive Support**:
   - Learning materials included
   - Online platform access
   - Extra practice resources
   
   **Proven Results**:
   - 85% student satisfaction
   - Average 2-level improvement in 6 months
   - Success stories
   
   **Flexible Options**:
   - Multiple payment methods
   - Installment plans (if available)
   - Money-back guarantee (if policy exists)

4. Compare cost per hour vs competitors
5. Reframe: Investment in future, not expense
6. Offer trial class or discount (if authorized)
7. Let lead decide without pressure
8. If still concerned:
   - Respect decision
   - Leave door open
   - Ask for referrals
   - Follow up in 1 month

**Expected Outcome**: 
- Objection addressed professionally
- Lead sees value clearly
- Decision made (yes/no/think)
- Relationship maintained

---

### Scenario 4: Creating Enrollment
**Goal**: Complete enrollment after successful consultation

**Steps**:
1. Lead decides to enroll
2. Navigate to **Enrollments → Create Enrollment**
3. Select/Create student profile:
   - Full name: Nguyen Thi Mai
   - Date of birth: 1995-03-15
   - Email: mai.nguyen@email.com
   - Phone: 0912-345-678
   - Address: (fill in)
4. Select program: English Intermediate
5. View available classes:
   - Class A: Mon/Wed 18:00-19:30 (8/15 seats)
   - Class B: Tue/Thu 19:00-20:30 (12/15 seats)
6. Discuss with lead, select Class A
7. System shows fee breakdown:
   - Tuition: 5,000,000 VND
   - Registration: 500,000 VND
   - Materials: 300,000 VND
   - **Total: 5,800,000 VND**
8. Confirm with lead
9. Click **Create Enrollment**
10. System generates invoice: INV-2024-0234
11. Print invoice for lead
12. Guide to payment:
    - Options: Cash, bank transfer, online
    - Show payment instructions
    - Explain what happens after payment
13. Update lead status: Enrolled (Pending Payment)
14. Thank lead và congratulate
15. Set follow-up for payment confirmation

**Expected Outcome**: 
- Enrollment created successfully
- Invoice generated
- Lead knows next steps
- Consultant tracks to completion

---

## Common Tasks

| Task | Frequency | Average Time | Critical? |
|------|-----------|--------------|-----------|
| Follow up new leads | Daily | 10 min/lead | Yes |
| Conduct consultations | Daily | 45-60 min/meeting | Yes |
| Create enrollments | Daily | 15 min/enrollment | Yes |
| Update lead status | Daily | 5 min | Yes |
| Send follow-up emails | Daily | 30 min total | Yes |
| Review performance metrics | Weekly | 15 min | No |
| Team meetings | Weekly | 1 hour | Yes |

---

## Training Requirements

**Required Knowledge**:
- Sales và consultation techniques
- School programs và curriculum
- Pricing và payment policies
- Enrollment procedures
- Customer service excellence
- CRM system usage
- Objection handling

**Training Duration**: 
- Initial training: 3 days
- Product knowledge: 1 week
- Shadowing: 1 week
- Mentored practice: 2 weeks

**Training Modules**:
1. School Overview & Programs (4 hours)
2. Consultation Skills (4 hours)
3. Sales Techniques (3 hours)
4. System Training (2 hours)
5. Role-playing (4 hours)

---

## Performance Metrics

Consultants are evaluated on:
- **Conversion Rate**: % of leads → enrollments (Target: 30-40%)
- **Response Time**: Hours to first contact (Target: <24h)
- **Consultation Volume**: Number per week (Target: 15-20)
- **Enrollment Volume**: Number per month (Target: 10-15)
- **Lead Quality Score**: % qualified after consultation
- **Customer Satisfaction**: Post-consultation rating

**Accessible via**: Dashboard → My Performance

---

## Commission Structure (If Applicable)

**Base Salary**: Fixed monthly

**Commission Tiers**:
- 1-5 enrollments: 200K VND per enrollment
- 6-10 enrollments: 250K VND per enrollment
- 11+ enrollments: 300K VND per enrollment

**Bonuses**:
- Referral bonus: 500K VND per referred student
- Monthly target achievement: 2M VND
- Quality bonus: Based on student retention

---

## Edge Cases

### Lead Already Enrolled
Q: Lead contacts but already enrolled by colleague?
A: Check system first. If enrolled, redirect to customer support. If lead insists on different program, coordinate with original consultant.

### Lead Lost to Competitor
Q: How to handle when lead chooses competitor?
A: Thank for consideration, ask feedback, update status to "Lost - Competitor". Don't burn bridges, follow up in 3 months.

### Cannot Reach Lead
Q: Lead not answering calls/emails?
A: Try 3 times over 1 week (call, email, SMS). If no response, mark "Lost - No Response". Keep in database for future campaigns.

### Lead Wants Discount
Q: Lead asks for discount, what authority?
A: Cannot give discount without approval. Escalate to [[Branch Manager]]. Can offer standard promotions if available.

---

## Tips for Success

### Building Rapport
- Remember và use lead's name
- Listen more than talk (60/40 rule)
- Find common ground
- Show genuine interest
- Be enthusiastic about helping

### Effective Consultation
- Ask open-ended questions
- Understand motivations, not just facts
- Tailor presentation to their needs
- Use stories và examples
- Address concerns proactively

### Closing Techniques
- Assumptive close: "When would you like to start?"
- Alternative close: "Class A or Class B?"
- Urgency: "Only 3 seats left this month"
- Trial close: "How does this sound so far?"

### Follow-up Best Practices
- Follow up same day after consultation
- Use multiple channels (email + phone)
- Provide additional value (articles, testimonials)
- Set clear next steps
- Be persistent but not pushy

---

## Notes

- Quality over quantity - better to enroll engaged students
- Always be honest about program fit
- Don't oversell or make false promises
- Build long-term relationships for referrals
- Celebrate wins với team
- Learn from lost leads

---

## Related Documentation

- [[Branch Manager]] - Reports to, escalations
- [[Receptionist]] - Lead handoff coordination
- [[Teacher]] - Assessment scheduling
- [[WF-01 Enrollment Journey]] - Complete process
- [[Sales Playbook]] - Scripts and techniques
- [[Objection Handling Guide]] - Common objections

---

**Last Updated**: 2026-08-25
**Reviewed By**: Branch Manager
**Next Review**: 2026-09-25
