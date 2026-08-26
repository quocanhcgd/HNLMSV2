---
title: Receptionist
role_id: receptionist
category: support
access_level: 1
created: 2026-08-25
tags: [role, support, mvp]
---

# 📞 Receptionist

## Overview

**Role ID**: `receptionist`  
**Category**: Support  
**Access Level**: 1 (Limited - Front desk operations)  
**License Requirement**: Base System (Included)

---

## Description

Receptionist là điểm tiếp xúc đầu tiên của khách hàng với tổ chức, chịu trách nhiệm welcome visitors, answer calls, capture leads, và hỗ trợ các administrative tasks cơ bản. Vai trò này tạo ấn tượng đầu tiên quan trọng cho brand.

**Typical Users**: 
- Lễ tân
- Front desk staff
- Administrative assistant

---

## Key Responsibilities

### 1. Front Desk Management (🤖 AI-Enhanced)
- Greet và welcome visitors
- Answer incoming calls professionally
- Direct inquiries to appropriate staff
- Maintain tidy reception area
- **🆕 Use AI-powered communication hub**
- **🆕 Access real-time staff availability**

### 2. Lead Capture (🤖 AI-Enhanced)
- Record walk-in inquiries
- Capture phone inquiry details
- Create lead records in system
- Route leads to consultants
- **🆕 AI auto-suggests lead priority**
- **🆕 AI recommends best consultant match**
- **🆕 Automated lead routing based on criteria**

### 3. Administrative Support (🤖 AI-Enhanced)
- Receive và sort mail/packages
- Handle general inquiries
- Schedule appointments
- Assist with basic troubleshooting
- **🆕 AI-powered appointment scheduling**
- **🆕 Check teacher/room availability automatically**
- **🆕 Send automated appointment confirmations**

### 4. Customer Service (🤖 AI-Enhanced)
- Provide basic information about programs
- Direct complex questions to specialists
- Handle complaints with empathy
- Maintain visitor log
- **🆕 Access AI-suggested responses for FAQs**
- **🆕 Use AI sentiment detection for escalation**
- **🆕 Multi-channel communication support**

---

## Permissions

### Can View
- [x] Reception area schedule
- [x] Staff directory (names, extensions)
- [x] Basic program information
- [x] Branch contact information
- [ ] ~~Student records~~ (limited access)
- [ ] ~~Financial data~~

### Can Create
- [x] Lead records (walk-in, phone)
- [x] Visitor log entries
- [x] General inquiry tickets
- [x] Appointment bookings

### Can Edit
- [x] Lead basic information (before assignment)
- [x] Appointment schedules

### Can Delete
- [ ] ~~Cannot delete any records~~

**Restrictions**:
- ❌ Cannot process payments
- ❌ Cannot create enrollments
- ❌ Cannot access financial records
- ❌ Cannot modify student data
- ❌ Cannot approve anything

---

## Scope

**Organization Scope**: No
**Branch Scope**: Single branch (front desk location)
**Access**: Public-facing information only

---

## Typical Workflows

- [[WF-01 Enrollment Journey]] - Initial contact (Phase 1)
- [[WF-17 Visitor Management]] - Check-in process
- [[WF-18 Call Handling]] - Phone inquiries

---

## Related Roles

**Reports To**: [[Branch Manager]]
**Collaborates With**: 
- [[Admission Consultant]] - Lead handoff
- [[Customer Support]] - Escalations
- All staff - General coordination

---

## Navigation Access

```yaml
- Dashboard (limited view)
- Leads
  - Create New Lead
  - Today's Walk-ins
- Schedule
  - Appointment Calendar
  - Staff Availability
- Directory
  - Staff Contact Info
  - Department Directory
```

---

## User Scenarios

### Scenario 1: Greeting Walk-in Visitor

**Steps**:
1. Visitor enters: "Good morning! Welcome to [School Name]. How can I help you?"
2. Visitor: "I want to learn English"
3. Offer seat: "Please have a seat. Let me get some information."
4. Open system: **Leads → Create New Lead**
5. Collect basic info:
   - Name: "May I have your name?"
   - Phone: "Phone number for follow-up?"
   - Interest: Note "English course"
6. "One of our consultants will be with you shortly."
7. Page available consultant
8. While waiting, offer brochure, water
9. Introduce consultant when arrives
10. Update lead: Status = "With Consultant"

**Time**: 3-5 minutes

---

### Scenario 2: Handling Phone Inquiry

**Steps**:
1. Answer within 3 rings: "[School Name], good morning. How may I help you?"
2. Caller: "Do you have Saturday classes?"
3. Check system for Saturday schedule
4. "Yes, we have English classes on Saturday mornings. Would you like to speak with our consultant for details?"
5. If yes: Transfer call or take callback info
6. If no: Offer to send information via email
7. Create lead record with interaction notes
8. Thank caller professionally

**Time**: 2-3 minutes

---

### Scenario 3: Handling Complaint

**Steps**:
1. Student (angry): "I paid but still can't access online!"
2. Stay calm: "I apologize for the inconvenience. Let me help you."
3. Gather information:
   - Student name
   - Payment date
   - Invoice number if available
4. "Let me connect you with our support team who can resolve this immediately."
5. Call [[Customer Support]] or [[IT Support]]
6. Warm handoff (don't just transfer)
7. Log incident for tracking
8. Follow up later to confirm resolution

**Time**: 5-10 minutes

---

## Common Tasks

| Task | Frequency | Time |
|------|-----------|------|
| Answer phones | Continuous | 2 min/call |
| Greet visitors | As they arrive | 2 min/visitor |
| Create lead records | 5-10/day | 3 min/lead |
| Route inquiries | 20-30/day | 1 min/inquiry |
| Maintain reception | Daily | 30 min |

---

## Training Requirements

**Duration**: 2 days
**Topics**:
1. Phone etiquette (2 hours)
2. Lead capture process (1 hour)
3. System basics (2 hours)
4. School overview (1 hour)
5. Customer service (2 hours)

---

## Notes

- First impression matters - always professional, friendly
- Smile even on phone (caller can hear it)
- Never say "I don't know" - say "Let me find out"
- Keep reception area clean and organized
- Report issues immediately to manager

---

**Last Updated**: 2026-08-25
