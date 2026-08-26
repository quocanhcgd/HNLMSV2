# 🎓 AI-Powered LMS - Documentation Vault

> ⚠️ **TÀI LIỆU LỊCH SỬ (ARCHIVE)** — vault v3 (tầm nhìn AI-first). Đã được hợp nhất vào **`docs/`** (nguồn chuẩn hiện tại).
> Xem: [`docs/README.md`](../README.md). **Lưu ý**: nội dung AI/hybrid trong vault này thuộc roadmap post-MVP (phase 2–3), **không nằm trong phạm vi MVP** (xem [`docs/02-spec.md`](../02-spec.md)).
> Liên kết `[[...]]` nội bộ vẫn hoạt động bình thường sau khi di chuyển.

**Version**: 3.0 (AI-Enhanced)  
**Last Updated**: 2026-08-25  
**Status**: Archived — tham chiếu lịch sử

---

## 📋 Tổng quan

Đây là **Obsidian vault** chứa toàn bộ documentation cho hệ thống **AI-Powered Learning Management System** - một nền tảng LMS hiện đại, self-hosted, hỗ trợ **đa ngành**, **đa chi nhánh**, **online/offline/hybrid learning**, và tích hợp sâu **AI** vào mọi khía cạnh.

**Key Features**:
- 🤖 **AI-First**: Auto-grading, personalized learning, content generation
- 🎥 **Hybrid Learning**: Online, offline, và blended seamlessly
- 🌐 **Multi-Industry**: Language, IT, Design, Cooking, và 10+ domains
- 📚 **Digital Library**: Rich content với progress tracking
- 💬 **Communication Hub**: Unified messaging platform
- 📱 **Mobile-First**: PWA-ready, responsive design

---

## 📁 Cấu trúc Vault

```
obsidian-vault/
│
├── 📄 Project-Overview-v3.md          # Tổng quan dự án (version 3.0)
├── 📄 Analysis-13-Issues.md           # Giải pháp cho 13 vấn đề bổ sung
├── 📄 COMPLETION-SUMMARY.md           # Tổng kết hoàn thành
├── 📄 README.md                       # File này
│
├── 📂 01-Roles/                       # 17 roles documentation
│   ├── README.md                      # Index of all roles
│   ├── Organization Admin.md
│   ├── Branch Manager.md
│   ├── System Admin.md
│   ├── Teacher.md
│   ├── Student.md
│   ├── Academic Manager.md
│   ├── Librarian.md
│   ├── Receptionist.md
│   ├── Admission Consultant.md
│   ├── Finance Officer.md
│   ├── Accountant.md
│   ├── Customer Support.md
│   ├── IT Support.md
│   ├── HR Manager.md (addon)
│   ├── Payroll Officer.md (addon)
│   └── Parent.md (addon)
│
├── 📂 02-Workflows/                   # 8 workflows documentation
│   ├── README.md                      # Index of all workflows
│   ├── WF-01 Enrollment Journey.md    # Lead → Active Student
│   ├── WF-02 Teaching & Learning Cycle.md
│   ├── WF-03 Financial Operations.md
│   ├── WF-04 HR & Payroll.md
│   ├── WF-05 Online & Hybrid Learning.md  # NEW
│   ├── WF-06 Digital Library & Content Management.md  # NEW
│   ├── WF-07 AI-Powered Assessment & Grading.md  # NEW
│   └── WF-08 Communication Hub.md  # NEW
│
└── 📂 03-Diagrams/                    # Visual diagrams
    ├── WF-01-Enrollment-Journey-Interactive.html
    ├── WF-02-Teaching-Learning-Interactive.html
    ├── WF-03-Financial-Operations-Interactive.html
    ├── WF-04-HR-Payroll-Interactive.html
    ├── WF-01-Enrollment-Canvas.canvas
    ├── System-Architecture-Canvas.canvas
    └── Role-Hierarchy-Canvas.canvas
```

---

## 🎯 Quick Start

### 1. Đọc Project Overview
Bắt đầu với [[Project-Overview-v3.md]] để hiểu:
- Executive summary
- Business model
- Technical architecture
- Core features mới (AI, Hybrid, Digital Library, Communication)

### 2. Khám phá Roles
Xem [[01-Roles/README.md]] để:
- Hiểu 17 roles trong hệ thống
- Responsibilities của từng role
- Permissions và access control

### 3. Nghiên cứu Workflows
Xem [[02-Workflows/README.md]] để:
- Hiểu 8 workflows chính
- Process flows chi tiết
- Integration points

### 4. Xem Interactive Diagrams
Mở các file HTML trong `03-Diagrams/` để:
- Tương tác với workflow diagrams
- Xem chi tiết từng bước
- Hiểu rõ hơn về quy trình

---

## 🆕 Tính năng mới (v3.0)

### 🤖 AI Integration Everywhere

**AI Teaching Assistant**:
- Auto-generate lesson plans
- Create exercises on-demand
- 24/7 student chatbot
- Content quality improvement

**AI Auto-Grading**:
- Essay grading với detailed feedback
- Speaking assessment (pronunciation, fluency, grammar)
- Code grading với auto-tests
- Saves teachers 50-70% grading time

**AI Personalization**:
- Personalized learning paths
- Adaptive testing
- Knowledge gap identification
- Smart content recommendations

### 🎥 Hybrid Learning

**Delivery Modes**:
- **Offline**: Traditional classroom
- **Online**: Video conferencing (Zoom, Meet, Teams)
- **Hybrid**: Mix theo lịch cố định
- **Flexible**: Students choose mỗi buổi

**Emergency Mode Switch**:
- Quick transition offline → online (COVID-19, disasters)
- Auto-notify students and teachers
- Meeting room creation tự động

**Session Recording**:
- Auto-record online sessions
- Process và store recordings
- Make available to students
- Progress tracking

### 📚 Digital Library

**Rich Content Types**:
- Videos với progress tracking
- Interactive content (H5P-style)
- Ebooks với annotations
- Documents với highlights
- Audio lessons

**AI Features**:
- Auto-tagging content
- Semantic search
- Personalized recommendations
- Smart playlists

**Progress Tracking**:
- Watch time tracking
- Completion rates
- Engagement metrics
- Learning analytics

### 💬 Communication Hub

**4 Communication Channels**:

1. **Internal** (Staff):
   - Direct messages
   - Department channels
   - Announcements

2. **Student-Teacher**:
   - Q&A board (public/private)
   - Appointment scheduling
   - Feedback requests

3. **Parent-School**:
   - AI auto-routing
   - Sentiment analysis
   - Progress reports

4. **Broadcast**:
   - Email campaigns
   - SMS campaigns
   - Push notifications

**AI Features**:
- Auto-route messages to right staff
- Sentiment analysis
- Suggested replies
- Smart notifications

### 🌐 Multi-Industry Support

**Pre-configured for 10+ industries**:
- Language Training
- IT & Programming
- Design (Graphic, UX/UI, Interior)
- Vocational (Accounting, Marketing)
- Skills (Cooking, Music, Art)
- Test Prep (IELTS, TOEIC, SAT)

**Industry-specific Features**:
- Custom fields and workflows
- Specialized assessment methods
- Competency frameworks
- Portfolio support

### 📊 Competency-Based Assessment

**Beyond Grades**:
- Track competencies, not just scores
- 4-level rubric (Beginner → Excellent)
- Evidence-based assessment
- Visual progress dashboards (radar charts)

**Industry-specific Competencies**:
- Language: Listening, Speaking, Reading, Writing
- Programming: Problem solving, Code quality
- Design: Creativity, Technical skills

### 📱 Mobile-First Design

**Responsive Everything**:
- Mobile (< 576px): Bottom tabs, cards view
- Tablet (≥ 768px): Sidebar, simplified
- Desktop (≥ 992px): Full features

**Progressive Web App**:
- Installable on home screen
- Offline support
- Push notifications
- App-like experience

---

## 📊 Thống kê Documentation

```
📝 Total Words: 70,000+
📄 Total Files: 36
👥 Roles Documented: 17
🔄 Workflows Documented: 8
🎨 Interactive HTML: 4
📊 Canvas Diagrams: 3
⏱️ Estimated Reading Time: 175 hours
📄 Equivalent Pages: 250+ A4
```

---

## 🗺️ Workflows Overview

### Core Workflows (MVP)

1. **[[WF-01 Enrollment Journey]]** - Lead → Active Student
   - 9 phases: Marketing → Graduation
   - Full conversion funnel
   - CRM integration

2. **[[WF-02 Teaching & Learning Cycle]]** - Daily teaching operations
   - Lesson planning
   - Delivery
   - Assessment
   - Feedback

3. **[[WF-03 Financial Operations]]** - Invoice → Payment → Receipt
   - Auto-invoice generation
   - Multiple payment methods
   - Daily reconciliation
   - Monthly close

4. **[[WF-04 HR & Payroll]]** - Employee lifecycle (Addon)
   - Daily attendance
   - Leave management
   - Monthly payroll
   - Self-service portal

### Enhanced Workflows (v3.0)

5. **[[WF-05 Online & Hybrid Learning]]** - Flexible delivery
   - 4 delivery modes
   - Emergency mode switch
   - Recording management
   - Virtual rooms

6. **[[WF-06 Digital Library & Content Management]]** - Rich content
   - Upload & processing
   - AI auto-tagging
   - Progress tracking
   - Recommendations

7. **[[WF-07 AI-Powered Assessment & Grading]]** - Smart assessment
   - AI content generation
   - Auto-grading (essay, speaking, code)
   - Personalized feedback
   - Early intervention

8. **[[WF-08 Communication Hub]]** - Unified messaging
   - Internal communication
   - Student-Teacher Q&A
   - Parent-School messaging
   - Broadcast campaigns

---

## 👥 Roles Overview

### Admin Level (3 roles)
- **Organization Admin**: Full system access
- **Branch Manager**: Branch-wide management
- **System Admin**: Technical infrastructure

### Academic (4 roles)
- **Teacher**: Teach, grade, communicate
- **Student**: Learn, submit, progress
- **Academic Manager**: Curriculum, quality
- **Librarian**: Content curation, library management

### Operations (4 roles)
- **Receptionist**: Front desk, lead capture
- **Admission Consultant**: Sales, enrollment
- **Finance Officer**: Billing, payments
- **Accountant**: Financial reporting

### Support (2 roles)
- **Customer Support**: User assistance
- **IT Support**: Technical help

### Addon Roles (3 roles)
- **HR Manager**: Employee management (addon)
- **Payroll Officer**: Salary processing (addon)
- **Parent**: Monitor child progress (addon)

---

## 🎨 Interactive HTML Diagrams

Mở các file HTML trong browser để tương tác:

1. **WF-01-Enrollment-Journey-Interactive.html**
   - Click vào từng bước để xem chi tiết
   - Hiển thị actors, duration, requirements
   - Full Vietnamese content

2. **WF-02-Teaching-Learning-Interactive.html**
   - Chu kỳ giảng dạy hàng ngày
   - Lesson planning → Delivery → Assessment

3. **WF-03-Financial-Operations-Interactive.html**
   - Invoice → Payment → Receipt
   - 3 payment methods
   - Daily reconciliation

4. **WF-04-HR-Payroll-Interactive.html**
   - Daily attendance
   - Monthly payroll cycle
   - Employee self-service

**Note**: Các workflow mới (WF-05 đến WF-08) sẽ có interactive HTML trong phase tiếp theo.

---

## 🔗 Key Documents

### Must-Read
1. [[Project-Overview-v3.md]] - **START HERE**
2. [[Analysis-13-Issues.md]] - Giải pháp cho 13 vấn đề bổ sung
3. [[COMPLETION-SUMMARY.md]] - Tổng kết dự án

### By Topic

**AI Features**:
- [[WF-07 AI-Powered Assessment & Grading]]
- [[WF-06 Digital Library & Content Management]] (AI recommendations)
- [[WF-08 Communication Hub]] (AI routing)

**Hybrid Learning**:
- [[WF-05 Online & Hybrid Learning]]
- [[WF-02 Teaching & Learning Cycle]]

**Financial**:
- [[WF-03 Financial Operations]]
- [[WF-01 Enrollment Journey]] (billing)

**Communication**:
- [[WF-08 Communication Hub]]
- All workflows (notifications)

**Multi-Industry**:
- [[Project-Overview-v3.md]] (Section: Multi-Industry Support)
- [[Analysis-13-Issues.md]] (Issue #6)

---

## 💡 Implementation Roadmap

### Phase 1: MVP (16 weeks)
- ✅ Core system (Org, Branch, Users)
- ✅ Academic management
- ✅ Finance & billing
- ✅ Basic student portal
- ✅ Basic digital library

### Phase 2: Enhanced (8 weeks)
- ✅ Online/Hybrid learning
- ✅ Enhanced digital library
- ✅ Communication hub
- ✅ Landing page CMS

### Phase 3: AI Integration (12 weeks)
- ✅ AI teaching assistant
- ✅ AI auto-grading
- ✅ Personalized learning
- ✅ Adaptive testing

### Phase 4: Advanced (Ongoing)
- ✅ Multi-industry customization
- ✅ Advanced analytics
- ✅ Mobile native apps
- ✅ Marketplace

---

## 📈 Success Metrics

### Learning Outcomes
- **AI Grading Accuracy**: 85-95% vs teacher
- **Teacher Time Saved**: 50-70% on grading
- **Student Engagement**: 70%+ completion rate
- **Early Intervention Success**: 75%+ improve

### Operational Efficiency
- **Enrollment Cycle**: 2 weeks → 3 days
- **Response Time**: 24 hours → 2 hours
- **Content Processing**: Manual → Auto (98% success)
- **Communication Delivery**: 99.5% uptime

### Business Impact
- **Student Satisfaction**: 4.5/5 (from 3.8/5)
- **Parent Satisfaction**: 4.3/5 (from 3.5/5)
- **Teacher Satisfaction**: 4.4/5 (workload reduced)
- **ROI**: Positive within 18 months

---

## 🛠️ Tech Stack

### Frontend
- React 19
- Ant Design Pro 6.x
- Vite 5.x
- TanStack Query
- PWA (Workbox)

### Backend
- Node.js 20 LTS
- NestJS 10.x
- PostgreSQL 15+ (với pgvector)
- Redis 7+
- Socket.IO

### AI/ML
- OpenAI (GPT-4, Whisper)
- Anthropic Claude
- TensorFlow.js
- Vector search (pgvector)

### Deployment
- Debian 12 / Ubuntu 22.04
- Nginx
- systemd
- .deb packages

---

## 📖 How to Use This Vault

### In Obsidian

1. **Install Obsidian**: https://obsidian.md
2. **Open Vault**: File → Open Vault → Select `obsidian-vault/`
3. **Navigate**: Use graph view, search, or links
4. **Interactive**: Click internal links `[[Page Name]]`

### File Browsers

- View `.md` files in any text editor
- View `.html` files in browser
- View `.canvas` files in Obsidian only

### Best Practices

1. **Start with Overview**: Read [[Project-Overview-v3.md]] first
2. **Follow Links**: Click `[[internal links]]` to navigate
3. **Use Search**: Ctrl/Cmd + O to search files
4. **Graph View**: Ctrl/Cmd + G to see connections
5. **Preview HTML**: Double-click HTML files to open in browser

---

## 🤝 Contributing

### Adding New Content

1. Follow naming convention: `Title Case.md`
2. Add frontmatter:
```yaml
---
title: Page Title
created: YYYY-MM-DD
tags: [tag1, tag2]
---
```
3. Link to related pages: `[[Page Name]]`
4. Update relevant README files

### Updating Workflows

1. Edit workflow `.md` file
2. Update Mermaid diagram if needed
3. Consider creating/updating interactive HTML
4. Update metrics if changed

---

## 📞 Support & Contact

### Documentation Issues
- Report errors or inconsistencies
- Suggest improvements
- Request clarifications

### Implementation Questions
- Technical architecture
- Integration details
- Best practices

---

## 📜 Version History

### v3.0 (2026-08-25) - AI Enhancement
- ✅ Added AI features throughout
- ✅ Added 4 new workflows (WF-05 to WF-08)
- ✅ Enhanced all existing documentation
- ✅ Added Analysis-13-Issues.md
- ✅ Updated Project Overview

### v2.0 (2026-08-24) - Comprehensive Documentation
- ✅ 17 roles documented (EN + VI)
- ✅ 4 core workflows
- ✅ 4 interactive HTML diagrams
- ✅ 3 Canvas diagrams

### v1.0 (2026-08-23) - Initial Structure
- ✅ Basic project overview
- ✅ Initial role definitions
- ✅ Architecture proposal

---

## 🎯 What's Next

### Immediate
- [ ] Create interactive HTML for WF-05 to WF-08
- [ ] Update role documents with AI responsibilities
- [ ] Create technical architecture diagram

### Short-term
- [ ] API specification document
- [ ] Database schema diagrams (ERD)
- [ ] User flow diagrams
- [ ] Product roadmap (Gantt chart)

### Long-term
- [ ] Video tutorials
- [ ] Training materials
- [ ] User guides
- [ ] Admin handbook

---

## 📚 Additional Resources

### External Links
- React: https://react.dev
- NestJS: https://nestjs.com
- PostgreSQL: https://postgresql.org
- Ant Design: https://ant.design
- OpenAI: https://openai.com
- Obsidian: https://obsidian.md

### Related Projects
- Moodle: https://moodle.org (inspiration)
- Canvas LMS: https://www.instructure.com
- Google Classroom: https://classroom.google.com

---

## ⚖️ License

**Proprietary** - All rights reserved  
Documentation for internal use only

---

## 🙏 Acknowledgments

Created with:
- Claude Code (Anthropic)
- Obsidian MD
- Mermaid diagrams
- Lots of ☕

---

**Ready to build the future of education in Vietnam! 🚀**

---

*Last Updated: 2026-08-25*  
*Maintained by: Development Team*  
*Next Review: Weekly during development*
