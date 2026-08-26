# 03. Data Model — EduCenter LMS (Unified)

**Version**: 4.1 (Consolidated)
**Date**: 2026-08-26
**Status**: ✅ Nguồn chuẩn — kế thừa `data-model.md` cũ, **bỏ hoàn toàn phần multi-tenant/SaaS**

> **Thay đổi chính so với bản cũ**: xóa `TenantInstance`, `ScheduledDowntime`, `ProductPlan`, `PlanEntitlement` (SaaS billing), super-admin. Giữ nguyên `License`, `LicenseEntitlement`, `EffectiveModuleState` (đổi thành model on-premise + serial key addon). `AITask`/`AIPolicyDecision`/`AIReview` giữ lại nhưng đánh dấu **phase 3 (AI)** — bảng nullable, không triển khai ở MVP. **D9 (2026-08-26)**: hệ thống quản lý license chưa triển khai — các entity license giữ lại nhưng **RESERVED** (bảng vẫn tạo, chưa kích hoạt/gate thật), LicenseService là stub trả license mặc định; dùng làm điểm kết nối chờ khi có hệ thống quản lý license.

---

## Quy ước chung

- Mọi entity thuộc trung tâm có `organization_id` (thường 1 organization mỗi installation).
- Entity phạm vi chi nhánh có `branch_id` hoặc quan hệ phạm vi tương đương.
- Entity nhạy cảm có `created_at`, `updated_at`, trạng thái và audit history.
- **Không xóa vật lý**: tài chính, payroll, điểm, bài làm, audit, đồng bộ đã chốt — soft delete/append-only.
- File lớn lưu ngoài database (`/var/lms/uploads`); database lưu metadata + quyền truy cập.
- UUID làm primary key; timestamp ISO 8601; tiền dùng decimal chính xác (không float).

---

## 1. Identity, Organization & Authorization

### Organization
- `id`, `name`, `brand_settings` (logo, màu), `contact_settings`, `timezone`, `academic_period`, `status`
- Mỗi installation thường có đúng 1 organization (mô hình on-premise).

### Branch
- `id`, `organization_id`, `code` (unique trong org), `name`, `address`, `manager_user_id`, `status`, `opened_at`, `closed_at`
- Rule: branch inactive → không nhận ghi danh, hóa đơn hoặc khoản chi mới.

### User, Role, Permission, ScopeGrant
- `User`: email, `password_hash`, full_name, avatar, phone, status, liên kết nhân sự/học viên.
- `Role`: tên vai trò + tập permission (predefined, tùy chỉnh).
- `Permission`: `resource`, `action` (vd `invoice:create`).
- `ScopeGrant`: user × (organization | branch | class | student) × hiệu lực từ/đến.
- Rule: backend kiểm tra scope trên mọi read/write/export; UI visibility **không** thay thế authorization.

### AuditEvent
- `id`, `organization_id`, `branch_id`, `actor_user_id`, `action`, `entity_type`, `entity_id`, `before_snapshot`, `after_snapshot`, `result`, `correlation_id`, `occurred_at`
- Rule: append-only, giữ 7 năm (NFR-011), không chứa secret.

---

## 2. License & Module Management (RESERVED — D9, chưa kích hoạt)

> Giai đoạn này **không triển khai hệ thống quản lý license**: LicenseService là **stub** trả license mặc định (dev/evaluation) → mọi module `effective_enabled = true`, không enforce constraint. Các entity dưới đây **RESERVED** (bảng vẫn được tạo để giữ schema cho điểm kết nối chờ) và sẽ kích hoạt khi kết nối hệ thống quản lý license ở giai đoạn sau.

### License [RESERVED]
- `id`, `organization_id`, `license_key_id`, `term_type` (perpetual|subscription), `starts_at`, `expires_at`, `grace_until`, `status` (active|grace|expired|revoked), `signature`, `issued_at`, `revoked_at`
- Ràng buộc (từ file license JSON): `max_students`, `max_branches`, `max_storage_gb`, `base_modules[]`, `addons[]`, `support_until`, `updates_until`.
- Rule: license được ký RSA-2048/SHA-256, verify local; **không** kiểm tra remote từng request. **[FUTURE — D9]**

### AddonLicense (serial key) [RESERVED]
- `id`, `license_id`, `addon_id`, `serial_key`, `activated_at`, `expires_at`, `status` (active|grace|expired)
- Rule: hết hạn + grace 30 ngày → read-only → disabled; dữ liệu addon không xóa. **[FUTURE — D9]**

### EffectiveModuleState
- `organization_id`, `module_key`, `installed`, `configured_enabled`, `licensed_enabled`, `dependency_satisfied`, `effective_enabled`, `reason`, `evaluated_at`
- Rule: `effective_enabled` chỉ true khi installed && configured && licensed && đủ dependency; guard backend dùng state này **trước** permission check nghiệp vụ.

### FeatureFlag
- `key`, `module_key`, `value`, `description` — cấu hình hành vi không cần code.

### BrandTheme
- `organization_id`, `preset_key`, `light_tokens`, `dark_tokens`, `font_tokens`, `radius_scale`, `logo_refs`, `version`, `status`
- Rule: chỉ lưu semantic tokens (Ant Design compatible); theme lỗi contrast không publish.

---

## 3. Marketing & Tuyển sinh (Addon CRM — P2)

### LandingContent
- `id`, `organization_id`, `branch_id?`, `content_type`, `slug` (unique public), `title`, `summary`, `body`, `media_refs`, `status` (draft|review|published|revoked|archived), `published_at`, `published_by`, `version`

### Lead, Consultation, LeadAssignment
- `Lead`: contact, source, interested_branch, interested_program, consent_status, status
- `Consultation`: lead, consultant, notes, next_action, occurred_at
- `LeadAssignment`: lead, branch, consultant, assigned_at, released_at, reason

---

## 4. Academic Core (MVP)

### Department, Program, Course, LearningContent
- `Department`: ngành đào tạo.
- `Program`: mục tiêu, thời lượng, completion_rules, status.
- `Course`: cấu trúc học phần, thứ tự, prerequisites, learning outcomes.
- `LearningContent`: loại nội dung, owner, version, approval_status, `access_scope` (public|class|private), `file_refs`.
- Rule: version đã dùng trong ghi danh không xóa; nội dung giới hạn quyền cần permission trước khi cấp URL.

### Class, Schedule, Enrollment
- `Class`: program, branch, `modality` (offline|online|hybrid — online/hybrid ở P2), capacity, enrollment_status, teacher assignments.
- `Schedule`: class, room/online_session, start/end, recurrence.
- `Enrollment`: student, class, status (pending_payment|active|completed|dropped|suspended), enrolled_at, completion_state, `financial_account_ref` (liên kết invoice).
- Rule: chống trùng lịch giảng viên/phòng/buổi; class inactive không nhận ghi danh; tiến độ tách theo enrollment.

### Student, ParentLink, Delegation
- `Student`: profile, status, identity references.
- `ParentLink`: parent user, student, relationship, status.
- `Delegation`: parent link, permission set, effective_from/to, approved_by — **(P2, addon Parent)**.
- Rule: parent nhiều học viên phải có scope tách biệt; thu hồi delegation chặn dữ liệu mới.

---

## 5. Learning, Assessment & English

### LibraryResource (MVP — cơ bản)
- metadata, category, subject, `access_scope`, version, file_ref, usage_policy, status.

### AssessmentBankItem, Assessment, AssessmentAttempt, AssessmentResult (P2 — addon Assessment)
- `AssessmentBankItem`: prompt, skill, topic, difficulty, answer_schema, approval_state.
- `Assessment`: type (entrance|mock), blueprint, window, attempts_allowed, scoring_policy, result_visibility.
- `AssessmentAttempt`: assessment, candidate, started_at, submitted_at, state, answers.
- `AssessmentResult`: attempt, total_score, skill_scores, topic_scores, recommendations.
- Rule: unique business key chống duplicate attempt; answer/result immutable sau công bố.

### EnglishPathway, EnglishSkillRecord (P2)
- `EnglishPathway`: level, modules, placement_rules.
- `EnglishSkillRecord`: student, skill (listening|speaking|reading|writing), level, score, evidence, assessed_at.
- Rule: 4 kỹ năng lưu riêng; speaking/writing có trạng thái chờ chấm thủ công.

---

## 6. Online Class & Communication (P2)

### OnlineSession (P2 — addon Online Classes)
- `id`, `class_id`, `provider` (zoom|meet|teams), `external_meeting_id`, `join_reference`, `host_reference`, `scheduled_at`, `attendance_sync_state`, `recording_ref`, `status`
- Rule: provider event unique theo (provider, event_id); recording private, cấp quyền qua LMS.

### Conversation, ConversationMember, Message, Notification (P2 — Communication Hub)
- `Conversation`: gắn class/student/lead/nghiệp vụ.
- `Member`: vai trò + thời hạn truy cập.
- `Message`: immutable history + moderation/report state.
- `Notification`: audience, delivery state, read_at.
- Rule: member bị thu hồi không xem dữ liệu mới ngoài scope; retention theo policy.

---

## 7. HRM, Giáo viên & Payroll (P3 — Addon HRM)

### EmployeeProfile, EmploymentContract
- profile, position, branch assignments, skills, certifications, status.
- contract type, start/end, salary_basis, attachments, approval_state.

### TeacherAssignment, WorkSchedule, Attendance, LeaveRequest, PerformanceReview
- `TeacherAssignment`: teacher, class, subject/skill, workload, effective period.
- `WorkSchedule`: branch, shift, planned hours.
- `Attendance`: employee, date, check-in/out, source, approval_state.
- `LeaveRequest`: type, period, balance_delta, approval_state.
- `PerformanceReview`: cycle, goals, ratings, feedback, improvement_plan.
- Rule: nhân sự nhiều chi nhánh phân bổ rõ; assignment kiểm tra năng lực và lịch; điều chỉnh attendance sau duyệt có audit.

### PayrollPeriod, PayrollLine, Payslip
- `PayrollPeriod`: period, branch/organization, status (open|calculating|approved|locked|adjusting).
- `PayrollLine`: employee, base_pay, teaching_pay, allowance, deduction, tax, insurance, net_pay, calculation_version.
- `Payslip`: payroll line, publication state, file_ref.
- Rule: lock sau approve; thay đổi sau lock tạo adjustment record; công thức versioned; không sửa trực tiếp kỳ lịch sử.

---

## 8. Branch Finance & Student Billing (MVP)

### Budget, FinanceCategory, CashAccount (Finance nâng cao — một phần P2)
- `Budget`: branch, period, approved_amount, spent_amount, status.
- `FinanceCategory`: income/expense, code, mapping_code.
- `CashAccount`: branch, account_type, balance_reference.

### FinanceEntry, ExpenseRequest, ReceiptDocument
- `FinanceEntry`: category, branch, amount, occurred_at, source, approval_state, document_refs.
- `ExpenseRequest`: requester, approvers, threshold, status.
- `ReceiptDocument`: file metadata, hash, retention class.
- Rule: thiếu chứng từ hoặc vượt hạn mức → không vào finalized ledger; khoản chi phê duyệt nhiều cấp lưu từng quyết định.

### Invoice, PaymentTransaction, Refund, AccountingSync
- `Invoice`: payer, student/enrollment, amount, discount, due_at, balance_state (pending|partially_paid|paid|overdue|void).
- `PaymentTransaction`: provider, attempt_id, amount, state, provider_reference, **idempotency_key** (unique).
- `Refund`: original_payment, amount, reason, state (record mới, không sửa payment gốc).
- `AccountingSync`: source entity, event type/version, external reference, state, retry/error — **(P3, addon ERP)**.
- Rule: redirect **không** đủ xác nhận thanh toán; webhook/API reconcile mới xác nhận.

---

## 9. AI Governance (P3 — chừa chỗ, không triển khai ở MVP)

### AITask, AIPolicyDecision, AIReview
- `AITask`: purpose, requester, scope, input_ref, output_ref, model_version, prompt_version, status, confidence, cost.
- `AIPolicyDecision`: allowed data, redactions, policy result, reason.
- `AIReview`: reviewer, decision, feedback, appeal_state, reviewed_at.
- Rule: AI không tự đổi điểm/lương/quyền lợi/kỷ luật/kết luận gian lận; task dữ liệu ngoài scope bị từ chối; output thiếu nguồn/confidence thấp → needs_review.

---

## 10. Integration Primitives (MVP)

### OutboxEvent
- `event_id`, entity, organization/branch, event_type, payload_version, idempotency_key, state, attempts, next_attempt_at, last_error.

### InboxEvent
- provider, external_event_id, signature_state, received_at, processed_at, state, raw_reference.
- Rule: unique `(provider, external_event_id)`; handler idempotent; lỗi vượt retry → dead-letter + replay có kiểm soát.

---

## 11. Đối chiếu với database schema

Bảng DDL chi tiết cho từng entity ở trên: xem [`04-database-schema.md`](./04-database-schema.md).

| Phân vùng | MVP (tạo ở migration base) | Addon/phase (tạo qua migration addon) |
|---|---|---|
| Core | organizations, branches, users, roles, permissions, scope_grants, audit_events, outbox/inbox, settings | — |
| License | licenses, addon_licenses, module_states, feature_flags (RESERVED — D9, tạo bảng nhưng chưa kích hoạt) | — |
| Academic | departments, programs, courses, classes, schedules, rooms, students, enrollments | — |
| Learning | learning_content, content_versions, content_progress | library_resources nâng cao (P2) |
| Finance | invoices, invoice_lines, payments, payment_transactions, refunds, receipts | budgets, finance_entries, expense_requests (P2), accounting_sync (P3) |
| CRM (P2) | — | landing_content, leads, consultations, lead_assignments |
| Assessment (P2) | — | assessment_bank_items, assessments, attempts, results, english_* |
| Online (P2) | — | online_sessions, meeting_events |
| Communication (P2) | — | conversations, conversation_members, messages |
| HRM (P3) | — | employees, contracts, attendance, leave, payroll_* |
| AI (P3) | — | ai_tasks, ai_policy_decisions, ai_reviews |

---

**Xem tiếp**: [`04-database-schema.md`](./04-database-schema.md)
