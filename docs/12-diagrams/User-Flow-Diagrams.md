# 🔄 User Flow Diagrams - AI-Powered LMS

**Version**: 3.0  
**Date**: 2026-08-25  
**Purpose**: Visual representation of key user journeys

---

## 📋 Table of Contents

1. [Student Flows](#student-flows)
2. [Teacher Flows](#teacher-flows)
3. [Admin Flows](#admin-flows)
4. [Parent Flows](#parent-flows)

---

## Student Flows

### 1. Student Registration & First Login

```mermaid
flowchart TD
    Start([Student visits website]) --> HasAccount{Has account?}
    
    HasAccount -->|No| Register[Click Register]
    Register --> FillForm[Fill registration form<br/>Email, Name, Phone, Password]
    FillForm --> Submit[Submit registration]
    Submit --> EmailVerify[Receive verification email]
    EmailVerify --> ClickLink[Click verification link]
    ClickLink --> Verified[Account verified]
    
    HasAccount -->|Yes| Login[Click Login]
    Verified --> Login
    
    Login --> EnterCreds[Enter email & password]
    EnterCreds --> AuthCheck{Valid?}
    AuthCheck -->|No| LoginError[Show error message]
    LoginError --> EnterCreds
    
    AuthCheck -->|Yes| Dashboard[Redirect to Dashboard]
    Dashboard --> FirstTime{First time?}
    FirstTime -->|Yes| Onboarding[Show onboarding tour]
    FirstTime -->|No| ShowDashboard[Show main dashboard]
    Onboarding --> ShowDashboard
    ShowDashboard --> End([Ready to learn])
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style Dashboard fill:#fff3e0
    style AuthCheck fill:#ffebee
```

---

### 2. Student Enrolls in Class

```mermaid
flowchart TD
    Start([Student logged in]) --> Browse[Browse available programs]
    Browse --> ViewProgram[Click program to view details]
    ViewProgram --> CheckClasses[See available classes]
    CheckClasses --> SelectClass[Select preferred class<br/>Check: Schedule, Teacher, Price]
    
    SelectClass --> Enroll[Click Enroll]
    Enroll --> CheckEligibility{Eligible?}
    
    CheckEligibility -->|Need placement| PlacementTest[Take placement test]
    PlacementTest --> AIGrade[AI auto-grades test]
    AIGrade --> ShowLevel[Show recommended level]
    ShowLevel --> SelectAppropriate[Select appropriate class]
    SelectAppropriate --> ConfirmEnroll
    
    CheckEligibility -->|Already eligible| ConfirmEnroll[Confirm enrollment]
    
    ConfirmEnroll --> ReviewPrice[Review price & discount]
    ReviewPrice --> CreateInvoice[System creates invoice]
    CreateInvoice --> PaymentMethod{Payment method?}
    
    PaymentMethod -->|Online| OnlinePayment[VNPay/Momo gateway]
    OnlinePayment --> PaymentSuccess{Success?}
    PaymentSuccess -->|Yes| ConfirmPayment
    PaymentSuccess -->|No| PaymentError[Show error, retry]
    PaymentError --> PaymentMethod
    
    PaymentMethod -->|Transfer| BankTransfer[Bank transfer instructions]
    BankTransfer --> WaitConfirm[Wait for confirmation]
    WaitConfirm --> StaffVerify[Staff verifies payment]
    StaffVerify --> ConfirmPayment
    
    PaymentMethod -->|Cash| CashAtBranch[Pay at branch]
    CashAtBranch --> StaffReceive[Staff receives & confirms]
    StaffReceive --> ConfirmPayment
    
    ConfirmPayment[Enrollment confirmed] --> SendWelcome[Receive welcome email]
    SendWelcome --> AccessClass[Access class materials]
    AccessClass --> End([Ready to start learning])
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style AIGrade fill:#f3e5f5
    style PaymentSuccess fill:#ffebee
```

---

### 3. Student Completes Assignment

```mermaid
flowchart TD
    Start([Student in Dashboard]) --> ViewClass[Go to My Classes]
    ViewClass --> SelectClass[Select class]
    SelectClass --> ViewAssignments[View Assignments tab]
    ViewAssignments --> FilterAssignments{Filter by}
    
    FilterAssignments -->|All| ShowAll[Show all assignments]
    FilterAssignments -->|Due soon| ShowDue[Show due soon]
    FilterAssignments -->|Incomplete| ShowIncomplete[Show not submitted]
    
    ShowAll --> SelectAssignment
    ShowDue --> SelectAssignment
    ShowIncomplete --> SelectAssignment
    
    SelectAssignment[Click assignment to open] --> ViewDetails[View assignment details<br/>Instructions, Due date, Points]
    
    ViewDetails --> CheckType{Assignment type?}
    
    CheckType -->|Multiple Choice| StartMC[Start quiz]
    StartMC --> AnswerMC[Select answers A/B/C/D]
    AnswerMC --> SubmitMC[Submit quiz]
    SubmitMC --> InstantGrade[AI grades instantly]
    InstantGrade --> ShowResultMC[Show score immediately]
    ShowResultMC --> ViewExplanations[View explanations]
    ViewExplanations --> End
    
    CheckType -->|Essay| WriteEssay[Write essay<br/>300-500 words]
    WriteEssay --> SaveDraft{Save as draft?}
    SaveDraft -->|Yes| AutoSave[Auto-save every 30s]
    AutoSave --> ContinueLater[Continue later]
    SaveDraft -->|No| SubmitEssay[Submit essay]
    SubmitEssay --> AIGradeEssay[AI grades essay<br/>10-30 seconds]
    AIGradeEssay --> TeacherReview[Teacher reviews AI grade]
    TeacherReview --> PublishGrade[Teacher publishes grade]
    PublishGrade --> NotifyStudent[Student notified]
    NotifyStudent --> ViewGrade[View grade & feedback]
    ViewGrade --> End
    
    CheckType -->|Speaking| RecordAudio[Record audio<br/>1-2 minutes]
    RecordAudio --> PlaybackCheck[Listen to check]
    PlaybackCheck --> Satisfied{Satisfied?}
    Satisfied -->|No| RecordAudio
    Satisfied -->|Yes| SubmitSpeaking[Submit recording]
    SubmitSpeaking --> AITranscribe[AI transcribes<br/>Whisper API]
    AITranscribe --> AIAnalyze[AI analyzes<br/>Pronunciation, Fluency, Grammar]
    AIAnalyze --> AIScore[AI calculates scores]
    AIScore --> TeacherListens[Teacher listens & verifies]
    TeacherListens --> AdjustScore[Adjust score if needed]
    AdjustScore --> PublishSpeaking[Publish grade]
    PublishSpeaking --> NotifyStudent
    
    CheckType -->|Code| WriteCode[Write code solution]
    WriteCode --> TestLocally[Test with sample cases]
    TestLocally --> SubmitCode[Submit code]
    SubmitCode --> RunTests[Run hidden test cases]
    RunTests --> AIReview[AI code review]
    AIReview --> CalculateScore[Calculate score<br/>50% tests + 25% quality + 25% efficiency]
    CalculateScore --> ShowCodeResult[Show detailed results]
    ShowCodeResult --> End
    
    End([Assignment completed])
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style InstantGrade fill:#f3e5f5
    style AIGradeEssay fill:#f3e5f5
    style AITranscribe fill:#f3e5f5
    style AIAnalyze fill:#f3e5f5
    style AIReview fill:#f3e5f5
```

---

### 4. Student Views Content in Digital Library

```mermaid
flowchart TD
    Start([Student in Dashboard]) --> Library[Go to Digital Library]
    Library --> ViewOptions{How to find content?}
    
    ViewOptions -->|Browse| BrowseCategories[Browse by category<br/>Grammar, Vocabulary, Speaking, etc.]
    BrowseCategories --> FilterBrowse[Filter: Level, Language, Type]
    FilterBrowse --> SelectContent
    
    ViewOptions -->|Search| SearchBox[Enter search keywords]
    SearchBox --> AISearch[AI semantic search]
    AISearch --> ShowResults[Show relevant results]
    ShowResults --> SelectContent
    
    ViewOptions -->|Recommendations| AIRecommend[View AI recommendations<br/>Based on learning path]
    AIRecommend --> SelectContent
    
    SelectContent[Click content to view] --> CheckType{Content type?}
    
    CheckType -->|Video| LoadVideo[Load video player]
    LoadVideo --> SelectQuality[Select quality<br/>360p, 480p, 720p, 1080p]
    SelectQuality --> PlayVideo[Play video]
    PlayVideo --> TrackProgress[AI tracks progress<br/>Current position, time spent]
    TrackProgress --> Actions{User action?}
    
    Actions -->|Pause/Play| TogglePlay[Toggle playback]
    TogglePlay --> Actions
    
    Actions -->|Bookmark| AddBookmark[Add bookmark with note]
    AddBookmark --> SaveBookmark[Save bookmark position]
    SaveBookmark --> Actions
    
    Actions -->|Complete| MarkComplete[Mark as completed]
    MarkComplete --> UpdateProgress[Update progress: 100%]
    UpdateProgress --> ShowNext[Show next recommended content]
    ShowNext --> SelectNext{Continue?}
    SelectNext -->|Yes| SelectContent
    SelectNext -->|No| RateContent
    
    Actions -->|Close| SavePosition[Auto-save current position]
    SavePosition --> RateContent
    
    CheckType -->|Document| LoadPDF[Load PDF viewer]
    LoadPDF --> ReadDocument[Read document]
    ReadDocument --> HighlightText[Highlight important parts]
    HighlightText --> TakeNotes[Take notes]
    TakeNotes --> MarkComplete
    
    CheckType -->|Audio| LoadAudioPlayer[Load audio player]
    LoadAudioPlayer --> PlayAudio[Play audio]
    PlayAudio --> TrackProgress
    
    CheckType -->|Interactive| LoadInteractive[Load interactive content]
    LoadInteractive --> CompleteActivities[Complete interactive activities]
    CompleteActivities --> AutoGrade[AI auto-grades interactions]
    AutoGrade --> ShowScore[Show score]
    ShowScore --> MarkComplete
    
    RateContent[Rate content 1-5 stars] --> UpdateStats[Update usage stats]
    UpdateStats --> End([Learning session complete])
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style AISearch fill:#f3e5f5
    style AIRecommend fill:#f3e5f5
    style TrackProgress fill:#f3e5f5
    style AutoGrade fill:#f3e5f5
```

---

## Teacher Flows

### 5. Teacher Creates Assignment with AI

```mermaid
flowchart TD
    Start([Teacher in Dashboard]) --> SelectClass[Select class]
    SelectClass --> Assignments[Go to Assignments tab]
    Assignments --> CreateNew[Click Create Assignment]
    CreateNew --> ChooseMethod{How to create?}
    
    ChooseMethod -->|Manual| SelectType[Select assignment type<br/>MC, Essay, Speaking, Code]
    SelectType --> EnterDetails[Enter details<br/>Title, Instructions, Points]
    EnterDetails --> CreateQuestions[Create questions manually]
    CreateQuestions --> SetRubric[Define rubric/criteria]
    SetRubric --> SetDeadline
    
    ChooseMethod -->|AI Generate| AIForm[Fill AI generation form]
    AIForm --> SpecifyTopic[Specify topic & level]
    SpecifyTopic --> SpecifyCount[Number of questions]
    SpecifyCount --> SpecifyFocus[Focus areas (optional)]
    SpecifyFocus --> SubmitAI[Submit to AI]
    SubmitAI --> AIGenerating[AI generates assignment<br/>GPT-4, 10-30 seconds]
    AIGenerating --> ShowPreview[Show generated assignment]
    ShowPreview --> ReviewAI{Review quality?}
    
    ReviewAI -->|Good| ApproveAI[Approve as-is]
    ApproveAI --> SetDeadline
    
    ReviewAI -->|Need changes| EditGenerated[Edit generated content]
    EditGenerated --> SetRubric
    
    SetDeadline[Set deadlines & attempts] --> ConfigureAI[Configure AI grading]
    ConfigureAI --> EnableAI{Enable AI grading?}
    
    EnableAI -->|Yes| SetAIOptions[Set AI options<br/>Model, Require review]
    SetAIOptions --> Preview
    
    EnableAI -->|No| ManualGrading[Manual grading only]
    ManualGrading --> Preview
    
    Preview[Preview assignment] --> SatisfiedPreview{Satisfied?}
    SatisfiedPreview -->|No| EditGenerated
    SatisfiedPreview -->|Yes| PublishDecision{Publish now?}
    
    PublishDecision -->|Yes| Publish[Publish to class]
    Publish --> NotifyStudents[Students notified]
    NotifyStudents --> End
    
    PublishDecision -->|No| SaveDraft[Save as draft]
    SaveDraft --> End
    
    End([Assignment ready])
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style AIGenerating fill:#f3e5f5
    style ConfigureAI fill:#f3e5f5
```

---

### 6. Teacher Reviews & Grades Submission

```mermaid
flowchart TD
    Start([Teacher in Dashboard]) --> Notification{How arrived?}
    
    Notification -->|Push notification| ClickNotif[Click notification]
    Notification -->|Manual check| GoToClass[Go to class]
    
    ClickNotif --> ViewSubmission
    GoToClass --> SelectClass[Select class]
    SelectClass --> Assignments[Go to Assignments]
    Assignments --> SelectAssignment[Select assignment]
    SelectAssignment --> ViewSubmissions[View all submissions]
    ViewSubmissions --> FilterSubs{Filter}
    
    FilterSubs -->|Pending| ShowPending[Show ungraded]
    FilterSubs -->|Graded| ShowGraded[Show graded]
    FilterSubs -->|All| ShowAll[Show all]
    
    ShowPending --> SelectSubmission
    ShowGraded --> SelectSubmission
    ShowAll --> SelectSubmission
    
    SelectSubmission[Click submission to review] --> ViewSubmission[View student's work]
    
    ViewSubmission --> CheckAIGraded{AI graded?}
    
    CheckAIGraded -->|Yes| ViewAIGrade[View AI grade & feedback]
    ViewAIGrade --> ReviewAI[Review AI assessment]
    ReviewAI --> AgreeWithAI{Agree with AI?}
    
    AgreeWithAI -->|Yes| ApproveAI[Approve AI grade]
    ApproveAI --> AddTeacherNote
    
    AgreeWithAI -->|No| AdjustScore[Adjust score]
    AdjustScore --> ExplainChange[Explain adjustment reason]
    ExplainChange --> AddTeacherNote
    
    CheckAIGraded -->|No| ManualGrade[Grade manually]
    ManualGrade --> EnterScore[Enter score for each criterion]
    EnterScore --> WriteFeedback[Write feedback]
    WriteFeedback --> AddTeacherNote
    
    AddTeacherNote[Add teacher's personal note] --> PreviewGrade[Preview grade & feedback]
    PreviewGrade --> SatisfiedGrade{Satisfied?}
    
    SatisfiedGrade -->|No| AdjustScore
    SatisfiedGrade -->|Yes| PublishGrade[Publish grade]
    
    PublishGrade --> NotifyStudent[Student notified<br/>Push + Email]
    NotifyStudent --> UpdateStats[Update class analytics]
    UpdateStats --> NextSubmission{More submissions?}
    
    NextSubmission -->|Yes| SelectSubmission
    NextSubmission -->|No| ViewSummary[View grading summary<br/>Class average, distribution]
    ViewSummary --> End([Grading complete])
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style ViewAIGrade fill:#f3e5f5
    style AgreeWithAI fill:#ffebee
```

---

### 7. Teacher Uploads Content to Digital Library

```mermaid
flowchart TD
    Start([Teacher in Dashboard]) --> Library[Go to Digital Library]
    Library --> Upload[Click Upload Content]
    Upload --> SelectType{Content type?}
    
    SelectType -->|Video| UploadVideo[Select video file<br/>MP4, AVI, MOV]
    UploadVideo --> CheckSize{File size?}
    CheckSize -->|> 500MB| TooLarge[Error: File too large<br/>Max 500MB]
    TooLarge --> UploadVideo
    CheckSize -->|OK| StartUpload
    
    SelectType -->|Document| UploadDoc[Select document<br/>PDF, DOCX, PPTX]
    UploadDoc --> StartUpload
    
    SelectType -->|Audio| UploadAudio[Select audio file<br/>MP3, WAV]
    UploadAudio --> StartUpload
    
    SelectType -->|Interactive| CreateInteractive[Create interactive content]
    CreateInteractive --> StartUpload
    
    StartUpload[Upload to server] --> ShowProgress[Show upload progress]
    ShowProgress --> UploadComplete[Upload complete]
    UploadComplete --> FillMetadata[Fill metadata form]
    
    FillMetadata --> EnterTitle[Enter title]
    EnterTitle --> EnterDescription[Enter description]
    EnterDescription --> SelectCategory[Select category]
    SelectCategory --> EnterTags[Enter tags]
    EnterTags --> SelectLevel[Select level]
    SelectLevel --> SelectLanguage[Select language]
    SelectLanguage --> SetAccess[Set access level<br/>Public/Enrolled/Class/Paid]
    
    SetAccess --> SubmitMetadata[Submit metadata]
    SubmitMetadata --> AIProcessing[AI processes content]
    
    AIProcessing --> AITasks{Processing tasks}
    AITasks -->|Video| VideoTasks[• Transcode to multiple qualities<br/>• Generate thumbnail<br/>• Extract audio for transcript<br/>• Generate transcript with Whisper]
    AITasks -->|Document| DocTasks[• Convert to web format<br/>• Extract text for search<br/>• Generate preview images]
    AITasks -->|Audio| AudioTasks[• Transcode format<br/>• Generate transcript<br/>• Extract keywords]
    
    VideoTasks --> AITagging
    DocTasks --> AITagging
    AudioTasks --> AITagging
    
    AITagging[AI auto-tags content<br/>Topics, difficulty, keywords] --> AISummary[AI generates summary]
    AISummary --> AIEmbedding[Generate vector embedding<br/>for semantic search]
    AIEmbedding --> ProcessComplete[Processing complete]
    
    ProcessComplete --> NotifyTeacher[Teacher notified<br/>Content ready]
    NotifyTeacher --> ReviewAI[Review AI-generated tags]
    ReviewAI --> ApproveAI{Approve AI tags?}
    
    ApproveAI -->|Yes| PublishContent[Publish content]
    ApproveAI -->|No| EditTags[Edit tags manually]
    EditTags --> PublishContent
    
    PublishContent --> MakeVisible[Make visible to students]
    MakeVisible --> ShareOptions{Share to?}
    
    ShareOptions -->|Library only| JustLibrary[Add to public library]
    JustLibrary --> End
    
    ShareOptions -->|Specific class| ShareToClass[Share to class]
    ShareToClass --> NotifyStudents[Students notified]
    NotifyStudents --> End
    
    ShareOptions -->|Multiple classes| SelectClasses[Select classes]
    SelectClasses --> ShareToClass
    
    End([Content published & available])
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style AIProcessing fill:#f3e5f5
    style AITagging fill:#f3e5f5
    style AISummary fill:#f3e5f5
    style AIEmbedding fill:#f3e5f5
```

---

## Admin Flows

### 8. Branch Manager Reviews Analytics

```mermaid
flowchart TD
    Start([Branch Manager logs in]) --> Dashboard[Land on Dashboard]
    Dashboard --> ViewMetrics[View key metrics<br/>Students, Revenue, Classes]
    ViewMetrics --> NeedDetails{Need more details?}
    
    NeedDetails -->|No| End
    NeedDetails -->|Yes| SelectReport{Which report?}
    
    SelectReport -->|Academic| AcademicReport[Academic Performance Report]
    AcademicReport --> SelectPeriod[Select period<br/>Weekly/Monthly/Semester]
    SelectPeriod --> GenerateAcademic[Generate report]
    GenerateAcademic --> ShowAcademic[Show metrics:<br/>• Average grades<br/>• Completion rates<br/>• Attendance rates<br/>• Student satisfaction]
    ShowAcademic --> AIInsightsAcademic[AI insights:<br/>• Top performing classes<br/>• Classes needing attention<br/>• Teacher effectiveness<br/>• Learning trends]
    AIInsightsAcademic --> ExportOption
    
    SelectReport -->|Financial| FinancialReport[Financial Report]
    FinancialReport --> SelectPeriodFin[Select period]
    SelectPeriodFin --> GenerateFinancial[Generate report]
    GenerateFinancial --> ShowFinancial[Show metrics:<br/>• Total revenue<br/>• Outstanding payments<br/>• Revenue by program<br/>• Cash flow]
    ShowFinancial --> AIInsightsFin[AI insights:<br/>• Revenue trends<br/>• Payment predictions<br/>• At-risk accounts<br/>• Forecasting]
    AIInsightsFin --> ExportOption
    
    SelectReport -->|Enrollment| EnrollmentReport[Enrollment Report]
    EnrollmentReport --> SelectPeriodEnroll[Select period]
    SelectPeriodEnroll --> GenerateEnrollment[Generate report]
    GenerateEnrollment --> ShowEnrollment[Show metrics:<br/>• New enrollments<br/>• Retention rate<br/>• Lead conversion<br/>• Class capacity]
    ShowEnrollment --> AIInsightsEnroll[AI insights:<br/>• Enrollment trends<br/>• Popular programs<br/>• Churn predictions<br/>• Growth opportunities]
    AIInsightsEnroll --> ExportOption
    
    SelectReport -->|Staff| StaffReport[Staff Performance Report]
    StaffReport --> SelectPeriodStaff[Select period]
    SelectPeriodStaff --> GenerateStaff[Generate report]
    GenerateStaff --> ShowStaff[Show metrics:<br/>• Teacher ratings<br/>• Consultant conversions<br/>• Attendance<br/>• Workload]
    ShowStaff --> AIInsightsStaff[AI insights:<br/>• Top performers<br/>• Training needs<br/>• Retention risks<br/>• Optimization recommendations]
    AIInsightsStaff --> ExportOption
    
    ExportOption{Export report?}
    ExportOption -->|Yes| SelectFormat[Select format<br/>PDF, Excel, CSV]
    SelectFormat --> DownloadReport[Download report]
    DownloadReport --> ShareOption{Share?}
    ShareOption -->|Yes| EmailReport[Email to stakeholders]
    ShareOption -->|No| End
    EmailReport --> End
    
    ExportOption -->|No| TakeAction{Take action?}
    TakeAction -->|Yes| ActionOptions{What action?}
    
    ActionOptions -->|Follow up| CreateTask[Create follow-up task]
    ActionOptions -->|Escalate| NotifyManagement[Notify senior management]
    ActionOptions -->|Intervene| PlanIntervention[Plan intervention]
    
    CreateTask --> End
    NotifyManagement --> End
    PlanIntervention --> End
    
    TakeAction -->|No| End
    
    End([Analytics review complete])
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style AIInsightsAcademic fill:#f3e5f5
    style AIInsightsFin fill:#f3e5f5
    style AIInsightsEnroll fill:#f3e5f5
    style AIInsightsStaff fill:#f3e5f5
```

---

## Parent Flows

### 9. Parent Sends Message to School

```mermaid
flowchart TD
    Start([Parent opens app/website]) --> Login[Login to parent portal]
    Login --> Dashboard[View child's dashboard]
    Dashboard --> NeedHelp{Need to contact school?}
    
    NeedHelp -->|Yes| Compose[Click Compose Message]
    NeedHelp -->|No| End
    
    Compose --> ChooseRecipient{Who to contact?}
    
    ChooseRecipient -->|Teacher| SelectTeacher[Select teacher]
    ChooseRecipient -->|Branch| SelectBranch[Select department/staff]
    ChooseRecipient -->|General| GeneralInquiry[General inquiry]
    
    SelectTeacher --> WriteMessage
    SelectBranch --> WriteMessage
    GeneralInquiry --> WriteMessage
    
    WriteMessage[Write message content] --> ChooseVisibility{Make it}
    
    ChooseVisibility -->|Private| PrivateMsg[Private message<br/>Only recipient sees]
    ChooseVisibility -->|Public| PublicQA[Public Q&A<br/>Other parents can see]
    
    PrivateMsg --> SendMessage
    PublicQA --> SendMessage
    
    SendMessage[Send message] --> AISentiment[AI analyzes sentiment]
    AISentiment --> AIClassify[AI classifies topic]
    AIClassify --> AIUrgency[AI detects urgency]
    AIUrgency --> AIRoute[AI routes to correct staff]
    
    AIRoute --> StaffReceives[Staff receives message<br/>With priority & context]
    StaffReceives --> StaffDecision{How to respond?}
    
    StaffDecision -->|Use AI draft| ViewAIDraft[View AI-suggested response]
    ViewAIDraft --> EditDraft{Edit draft?}
    EditDraft -->|Yes| ModifyResponse[Modify AI response]
    EditDraft -->|No| SendResponse
    ModifyResponse --> SendResponse
    
    StaffDecision -->|Write own| WriteOwn[Write custom response]
    WriteOwn --> SendResponse
    
    SendResponse[Send response to parent] --> ParentNotified[Parent notified<br/>Push + Email]
    ParentNotified --> ParentReads[Parent reads response]
    ParentReads --> Satisfied{Satisfied?}
    
    Satisfied -->|Yes| RateResponse[Rate response helpful]
    RateResponse --> End
    
    Satisfied -->|No| ReplyMore[Reply with more questions]
    ReplyMore --> AISentiment
    
    Satisfied -->|Escalate| RequestEscalation[Request escalation]
    RequestEscalation --> ManagerNotified[Manager notified]
    ManagerNotified --> ManagerResponds[Manager responds]
    ManagerResponds --> ParentNotified
    
    End([Issue resolved])
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style AISentiment fill:#f3e5f5
    style AIClassify fill:#f3e5f5
    style AIUrgency fill:#f3e5f5
    style AIRoute fill:#f3e5f5
    style ViewAIDraft fill:#f3e5f5
```

---

### 10. Parent Views Child's Progress Report

```mermaid
flowchart TD
    Start([Parent logs in]) --> Dashboard[View parent dashboard]
    Dashboard --> SelectChild{Multiple children?}
    
    SelectChild -->|Yes| ChooseChild[Select child]
    SelectChild -->|No| ViewProgress
    ChooseChild --> ViewProgress
    
    ViewProgress[View child's progress] --> ReportOptions{What to view?}
    
    ReportOptions -->|Overview| QuickView[Quick overview<br/>• Current classes<br/>• Recent grades<br/>• Attendance rate<br/>• Upcoming assignments]
    QuickView --> End
    
    ReportOptions -->|Detailed Report| SelectPeriod[Select period<br/>Weekly/Monthly/Semester]
    SelectPeriod --> GenerateReport[Generate progress report]
    GenerateReport --> ShowSections[Show report sections]
    
    ShowSections --> AttendanceSection[📊 Attendance<br/>• Sessions attended: 38/40<br/>• Rate: 95%<br/>• Late count: 2]
    AttendanceSection --> GradesSection
    
    GradesSection[📝 Grades<br/>• Average: 85.5%<br/>• Assignments: 12/12 completed<br/>• Trend: Improving]
    GradesSection --> CompetenciesSection
    
    CompetenciesSection[🎯 Competencies<br/>• Grammar: Proficient<br/>• Speaking: Developing<br/>• Listening: Proficient<br/>• Writing: Proficient]
    CompetenciesSection --> EngagementSection
    
    EngagementSection[💡 Engagement<br/>• Content viewed: 45 items<br/>• Learning time: 18 hours<br/>• Completion rate: 89%]
    EngagementSection --> AIInsightsSection
    
    AIInsightsSection[🤖 AI Insights<br/>• Strengths: Strong in grammar<br/>• Areas to improve: Speaking fluency<br/>• Recommendations:<br/>  - Practice speaking daily<br/>  - Watch pronunciation videos<br/>  - Join conversation club]
    AIInsightsSection --> TeacherComments
    
    TeacherComments[👨‍🏫 Teacher Comments<br/>"John is making great progress...<br/>Needs more practice in speaking..."]
    TeacherComments --> ActionOptions
    
    ActionOptions{Actions available}
    
    ActionOptions -->|Download| DownloadPDF[Download as PDF]
    DownloadPDF --> End
    
    ActionOptions -->|Email| EmailReport[Email report to self]
    EmailReport --> End
    
    ActionOptions -->|Contact| ContactTeacher[Contact teacher]
    ContactTeacher --> ComposeMessage[Compose message to teacher]
    ComposeMessage --> SendMsg[Send message]
    SendMsg --> End
    
    ActionOptions -->|Schedule| ScheduleMeeting[Schedule parent-teacher meeting]
    ScheduleMeeting --> PickTime[Pick available time]
    PickTime --> ConfirmMeeting[Confirm meeting]
    ConfirmMeeting --> End
    
    ActionOptions -->|Close| End
    
    End([Report reviewed])
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style AIInsightsSection fill:#f3e5f5
```

---

## Summary

### User Flows Created:
1. ✅ **Student Registration & First Login**
2. ✅ **Student Enrolls in Class** (with placement test & payment)
3. ✅ **Student Completes Assignment** (4 types: MC, Essay, Speaking, Code)
4. ✅ **Student Views Content in Digital Library**
5. ✅ **Teacher Creates Assignment with AI**
6. ✅ **Teacher Reviews & Grades Submission**
7. ✅ **Teacher Uploads Content to Digital Library**
8. ✅ **Branch Manager Reviews Analytics**
9. ✅ **Parent Sends Message to School** (AI-routed)
10. ✅ **Parent Views Child's Progress Report**

### Key Features Illustrated:
- 🤖 **AI Integration**: Auto-grading, recommendations, insights
- 🔄 **Multi-path flows**: Different user decisions
- ⚡ **Real-time**: Instant notifications, live updates
- 📊 **Analytics**: Progress tracking, performance metrics
- 💬 **Communication**: Multi-channel messaging
- 🎓 **Learning**: Content delivery, assessment, feedback

---

**Last Updated**: 2026-08-25  
**Format**: Mermaid flowcharts  
**Total Flows**: 10 major user journeys
