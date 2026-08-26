# Data Model: LMS đa ngành đa chi nhánh

**Feature**: `001-lms-multi-branch`

## Quy ước chung

- Mọi entity thuộc trung tâm có `organization_id`.
- Entity có phạm vi chi nhánh có `branch_id` hoặc quan hệ phạm vi tương đương.
- Mọi entity nhạy cảm có `created_at`, `updated_at`, trạng thái và audit history phù hợp.
- Không xóa vật lý các bản ghi tài chính, payroll, điểm, bài làm, audit hoặc đồng bộ đã chốt.
- File lớn lưu ngoài database; database lưu metadata và quyền truy cập.

## Identity, organization và authorization

### Organization

- `id`
- `name`
- `brand_settings`
- `contact_settings`
- `timezone`
- `academic_period`
- `status`
- `database_instance_id`
- `database_name`
- `deployment_mode`
- `migration_state`
- `scheduled_downtime_policy`

Relationships: có nhiều `Branch`, `User`, `Role`, `Setting`, `AuditEvent`, `TenantInstance`.

Rules: mỗi organization sử dụng database riêng của tenant; dữ liệu tenant không dùng chung database với organization khác. Việc chuyển từ shared instance sang instance riêng chỉ thực hiện một chiều, có kiểm tra đối soát và không hỗ trợ chuyển ngược. Downtime phục vụ migration, maintenance hoặc cutover phải được lập lịch, thông báo trước và lưu audit.

### TenantInstance

- `id`
- `organization_id`
- `database_endpoint`
- `database_name`
- `deployment_mode`
- `provisioning_state`
- `migration_state`
- `cutover_at`
- `scheduled_downtime_id`
- `created_at`
- `updated_at`

Rules: instance chỉ thuộc một organization; migration sang instance riêng phải bảo toàn dữ liệu, idempotent và có bước verify trước cutover. Sau cutover, instance cũ chỉ được giữ ở trạng thái read-only hoặc archival theo chính sách lưu trữ.

### ScheduledDowntime

- `id`
- `organization_id`
- `tenant_instance_id`
- `reason`
- `starts_at`
- `ends_at`
- `status`
- `notice_sent_at`
- `created_by`

Rules: downtime có lịch phải có thời gian bắt đầu/kết thúc và trạng thái; trong thời gian downtime, hệ thống chặn các write không an toàn và hiển thị trạng thái vận hành phù hợp.
### Branch

- `id`
- `organization_id`
- `code`
- `name`
- `address`
- `manager_user_id`
- `status`
- `opened_at`
- `closed_at`

Rules: `code` duy nhất trong organization; branch inactive không nhận ghi danh, hóa đơn hoặc khoản chi mới.

### User, Role, Permission, ScopeGrant

- `User`: hồ sơ đăng nhập, trạng thái, liên kết nhân sự hoặc học viên.
- `Role`: tên vai trò và tập permission.
- `Permission`: resource, action.
- `ScopeGrant`: user, organization, branch, class, student, hiệu lực từ/đến.

Rules: backend phải kiểm tra scope trên mọi read/write/export; UI visibility không thay thế authorization.

### AuditEvent

- `id`
- `organization_id`
- `branch_id`
- `actor_user_id`
- `action`
- `entity_type`
- `entity_id`
- `before_snapshot`
- `after_snapshot`
- `result`
- `correlation_id`
- `occurred_at`

Rules: append-only, không chứa secret hoặc dữ liệu nhạy cảm vượt chính sách lưu trữ.

## Module và license management

### ModuleDefinition

- `module_key`
- `name`
- `version`
- `core`
- `dependencies`
- `license_feature_key`
- `permissions`
- `routes`
- `navigation`
- `jobs`
- `migration_version`
- `status`

Rules: `module_key` ổn định; core module không thể tắt; dependency graph không được có vòng lặp; module migration chỉ tiến về trước.

### ProductPlan, PlanEntitlement

- `ProductPlan`: code, name, status, billing_period monthly/yearly/lifetime, price metadata, support/update policy.
- `PlanEntitlement`: plan, module key, enabled, quota key/value, effective policy.

Rules: plan versioned; thay đổi plan không sửa lịch sử license đã phát hành nếu không qua amendment.

### License, LicenseEntitlement, LicenseAssignment

- `License`: organization, plan, license_key_id, term_type, starts_at, expires_at, grace_until, status, signature, issued_at, revoked_at.
- `LicenseEntitlement`: license, module key, enabled, quotas, override source.
- `LicenseAssignment`: license, organization/instance fingerprint, activated_at, last_verified_at, status.

State transitions:

- draft -> active -> grace -> expired.
- active/grace -> suspended hoặc revoked bởi super admin có quyền.
- monthly/yearly có `expires_at`; lifetime không hết quyền sử dụng nhưng có metadata support/update riêng.

Rules: license document được ký số và xác minh local; không kiểm tra remote trên từng request; thay đổi issue/renew/revoke/override phải audit; tắt module không xóa dữ liệu.

### EffectiveModuleState

- `organization_id`
- `module_key`
- `installed`
- `configured_enabled`
- `licensed_enabled`
- `dependency_satisfied`
- `effective_enabled`
- `reason`
- `evaluated_at`

Rules: effective enabled chỉ true khi module installed, được cấu hình bật, được license cho phép và đủ dependency; backend guard dùng state này trước permission check nghiệp vụ.

### BrandTheme

- `organization_id`
- `preset_key`
- `light_tokens`
- `dark_tokens`
- `font_tokens`
- `radius_scale`
- `logo_refs`
- `version`
- `status`

Rules: chỉ semantic shadcn-compatible tokens được lưu; preset phải preview trước publish; theme lỗi contrast hoặc thiếu token bắt buộc không được publish.

## Marketing và tuyển sinh

### LandingContent

- `id`, `organization_id`, `branch_id?`
- `content_type`
- `slug`
- `title`, `summary`, `body`, `media_refs`
- `status`: draft, review, published, revoked, archived
- `published_at`, `published_by`
- `version`

Rules: chỉ published mới xuất hiện public; slug công khai duy nhất trong phạm vi site.

### Lead, Consultation, Assignment

- `Lead`: contact, source, interested_branch, interested_program, consent_status, status.
- `Consultation`: lead, consultant, notes, next_action, occurred_at.
- `LeadAssignment`: lead, branch, consultant, assigned_at, released_at, reason.

Rules: lead trùng cần nhận diện theo chính sách; thông tin liên hệ và consent được audit.

## Academic core

### Department, Program, Course, Module, LearningContent

- `Department`: ngành đào tạo.
- `Program`: mục tiêu, thời lượng, completion_rules, status.
- `Course/Module`: cấu trúc học phần và thứ tự.
- `LearningContent`: loại nội dung, owner, version, approval_status, access_scope, file_refs.

Rules: phiên bản đã được dùng trong ghi danh không bị xóa; nội dung giới hạn quyền cần permission trước khi cấp URL.

### Class, Schedule, Enrollment

- `Class`: program, branch, modality, capacity, enrollment_status, teacher assignments.
- `Schedule`: class, room/online_session, start/end, recurrence.
- `Enrollment`: student, class, status, enrolled_at, completion_state, financial_account_ref.

Rules: không trùng lịch giảng viên/phòng/buổi online; lớp inactive không nhận ghi danh mới; tiến độ tách theo enrollment.

### Student, ParentLink, Delegation

- `Student`: profile, status, identity references.
- `ParentLink`: parent user, student, relationship, status.
- `Delegation`: parent link, permission set, effective_from/to, approved_by.

Rules: phụ huynh nhiều học viên phải có scope tách biệt; thu hồi delegation chặn dữ liệu mới; mỗi request phải nêu student scope.

## Learning, assessment và English

### LibraryResource

- metadata, category, subject, access_scope, version, file_ref, usage_policy, status.

### AssessmentBankItem, Assessment, AssessmentAttempt, AssessmentResult

- `AssessmentBankItem`: prompt, skill, topic, difficulty, answer_schema, approval_state.
- `Assessment`: type entrance/mock, blueprint, window, attempts_allowed, scoring_policy, result_visibility.
- `AssessmentAttempt`: assessment, candidate, started_at, submitted_at, state, answers.
- `AssessmentResult`: attempt, total_score, skill_scores, topic_scores, recommendations.

Rules: unique business key chống duplicate attempt; timeout xử lý theo assessment policy; answer/result history immutable sau công bố.

### EnglishPathway, EnglishSkillRecord

- `EnglishPathway`: level, modules, placement_rules.
- `EnglishSkillRecord`: student, skill listening/speaking/reading/writing, level, score, evidence, assessed_at.

Rules: bốn kỹ năng lưu riêng; speaking/writing có trạng thái chờ chấm thủ công.

## Online class và communication

### OnlineSession

- `id`, `class_id`
- `provider`
- `external_meeting_id`
- `join_reference`
- `host_reference`
- `scheduled_at`
- `attendance_sync_state`
- `recording_ref`
- `status`

Rules: provider event unique theo provider/event_id; recording private và cấp quyền qua LMS.

### Conversation, ConversationMember, Message, Notification

- Conversation gắn với class, student, lead hoặc nghiệp vụ.
- Member có vai trò và thời hạn truy cập.
- Message immutable history với moderation/report state.
- Notification có audience, delivery state, read_at.

Rules: member bị thu hồi không xem dữ liệu mới ngoài scope; lịch sử bảo toàn theo retention policy.

## HRM, giáo viên và payroll

### EmployeeProfile, EmploymentContract

- profile, position, branch assignments, skills, certifications, status.
- contract type, start/end, salary_basis, attachments, approval_state.

### TeacherAssignment, WorkSchedule, Attendance, LeaveRequest, PerformanceReview

- TeacherAssignment: teacher, class, subject/skill, workload, effective period.
- WorkSchedule: branch, shift, planned hours.
- Attendance: employee, date, check-in/out, source, approval_state.
- LeaveRequest: type, period, balance_delta, approval_state.
- PerformanceReview: cycle, goals, ratings, feedback, improvement_plan.

Rules: nhân sự nhiều chi nhánh phải phân bổ rõ; assignment kiểm tra năng lực và lịch; điều chỉnh attendance sau duyệt có audit.

### PayrollPeriod, PayrollLine, Payslip

- `PayrollPeriod`: period, branch/organization, status open/calculating/approved/locked/adjusting.
- `PayrollLine`: employee, base_pay, teaching_pay, allowance, deduction, tax, insurance, net_pay, calculation_version.
- `Payslip`: payroll line, publication state, file_ref.

Rules: lock sau approve; thay đổi sau lock tạo adjustment record; công thức versioned; không sửa trực tiếp kỳ lịch sử.

## Branch finance và student billing

### Budget, FinanceCategory, CashAccount

- Budget: branch, period, approved_amount, spent_amount, status.
- FinanceCategory: income/expense, code, mapping_code.
- CashAccount: branch, account_type, balance_reference.

### FinanceEntry, ExpenseRequest, ReceiptDocument

- FinanceEntry: category, branch, amount, occurred_at, source, approval_state, document_refs.
- ExpenseRequest: requester, approvers, threshold, status.
- ReceiptDocument: file metadata, hash, retention class.

Rules: thiếu chứng từ hoặc vượt hạn mức không vào finalized ledger; khoản chi phê duyệt nhiều cấp phải lưu từng quyết định.

### Invoice, PaymentTransaction, Refund, AccountingSync

- Invoice: payer, student/enrollment, amount, discount, due_at, balance_state.
- PaymentTransaction: provider, attempt_id, amount, state, provider_reference, idempotency_key.
- Refund: original_payment, amount, reason, state.
- AccountingSync: source entity, event type/version, external reference, state, retry/error.

Rules: redirect không đủ để xác nhận thanh toán; webhook/API reconcile mới xác nhận; refund là record mới; unique idempotency key chống trùng.

## AI governance

### AITask, AIPolicyDecision, AIReview

- `AITask`: purpose, requester, scope, input_ref, output_ref, model_version, prompt_version, status, confidence, cost.
- `AIPolicyDecision`: allowed data, redactions, policy result, reason.
- `AIReview`: reviewer, decision, feedback, appeal_state, reviewed_at.

Rules: AI không tự đổi điểm, lương, quyền lợi, kỷ luật hoặc kết luận gian lận; task có dữ liệu ngoài scope bị từ chối; output thiếu nguồn hoặc confidence thấp chuyển needs_review.

## Integration primitives

### OutboxEvent

- `event_id`, entity, organization/branch, event_type, payload_version, idempotency_key, state, attempts, next_attempt_at, last_error.

### InboxEvent

- provider, external_event_id, signature_state, received_at, processed_at, state, raw_reference.

Rules: unique `(provider, external_event_id)`; handler idempotent; lỗi vượt retry vào dead-letter và cần thao tác replay có kiểm soát.
