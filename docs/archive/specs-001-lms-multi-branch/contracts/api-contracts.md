# API Contracts: LMS đa ngành đa chi nhánh

**Feature**: `001-lms-multi-branch`

Các contract dưới đây mô tả hành vi bên ngoài cần giữ ổn định. Tên đường dẫn là quy ước logical; framework và encoding cụ thể được quyết định khi triển khai.

## Quy tắc chung

- Mọi request authenticated mang context người dùng; backend tự tính organization/branch/student scope.
- Không tin `branch_id`, `student_id`, `role` hoặc permission do client gửi nếu không khớp scope server.
- Response lỗi có `code`, `message`, `correlation_id` và `details` phù hợp; không tiết lộ dữ liệu nhạy cảm.
- Các command ghi dữ liệu hỗ trợ idempotency khi có side effect tài chính, tuyển sinh hoặc tích hợp.
- Pagination bắt buộc cho danh sách lớn; export chạy bất đồng bộ.
- Timestamp dùng ISO 8601; tiền dùng đơn vị tiền tệ cấu hình và decimal chính xác.

## Public contracts

### Public catalog

`GET /public/programs`

- Query: `branch`, `department`, `status=published`, `page`, `page_size`.
- Response: chương trình/lớp được phép công khai, lịch tuyển sinh, mô tả và CTA.
- Không trả dữ liệu nội bộ, số điện thoại riêng, lương, học phí bị giới hạn hoặc tài liệu private.

### Consultation lead

`POST /public/consultations`

- Body: `name`, `contact`, `interest`, `preferred_branch`, `preferred_program`, `source`, `consent`.
- Response: `lead_reference`, `status`, `next_step`.
- Idempotency: có thể dùng `client_submission_key` để tránh gửi trùng.
- Không xác nhận ghi danh hoặc thanh toán từ endpoint này.

## Authenticated contracts

### Scope, modules and permissions

`GET /me/context`

- Response: user profile, roles, effective branch scopes, delegated student scopes, permission summary, effective modules và quotas.
- Chỉ dùng cho UI; mọi endpoint nghiệp vụ vẫn phải kiểm tra lại quyền và entitlement.

`GET /organization/modules`

- Response: module key, installed, configured, licensed, dependency state, effective state, reason và quota usage.
- Core modules luôn effective; tenant admin không thể tự cấp entitlement ngoài license.

`PUT /organization/modules/{module_key}`

- Body: `configured_enabled`.
- Backend từ chối bật khi thiếu entitlement hoặc dependency; tắt module không xóa dữ liệu.
- Thay đổi tạo audit event và invalidates module-state cache.

### Theme management

`GET /organization/theme`

- Response: active shadcn-compatible semantic tokens, preset key, logo refs và version.

`POST /organization/themes/preview`

- Body: preset/tokens/font/radius/logo changes.
- Response: normalized tokens, contrast/accessibility validation và preview reference.

`POST /organization/themes/{version}/publish`

- Chỉ publish theme đã validation; rollback bằng cách publish lại version trước.

### Enrollment and invoice

`POST /enrollments`

- Body: `student_id`, `class_id`, `enrollment_source`.
- Response: `enrollment_id`, `state`, `invoice_summary`.
- Transaction boundary: enrollment và nghĩa vụ học phí được tạo nhất quán.

`POST /invoices/{invoice_id}/payment-attempts`

- Header: `Idempotency-Key`.
- Body: `amount`, `payment_method`.
- Response: `payment_attempt_id`, `state`, provider handoff data.
- Không đánh dấu paid dựa trên response redirect.

`GET /invoices/{invoice_id}`

- Response: invoice total, discounts, paid amount, balance, payment states, due date và quyền xem.

### Learning and assessment

`POST /classes/{class_id}/online-sessions`

- Body: `scheduled_at`, `duration`, `participant_policy`.
- Response: `session_id`, `sync_state`.
- Link tham gia chỉ được cấp sau khi server kiểm tra enrollment/delegation.

`POST /assessments/{assessment_id}/attempts`

- Response: `attempt_id`, `started_at`, `expires_at`, `state`.
- Unique business key chống tạo attempt trùng.

`POST /assessment-attempts/{attempt_id}/submit`

- Body: answers hoặc reference tới draft đã xác nhận.
- Response: `submission_state`, `result_state`.
- Nộp lặp phải idempotent và không tạo attempt mới.

### Parent delegation and conversations

`POST /students/{student_id}/parent-delegations`

- Body: `parent_user_id`, `permissions`, `effective_from`, `effective_to`.
- Response: delegation state và effective permissions.
- Chỉ người có quyền quản lý hồ sơ học viên được cấp hoặc thu hồi delegation.

`POST /conversations`

- Body: `context_type`, `context_id`, `member_refs`, `subject`.
- Response: conversation metadata; backend tự loại thành viên ngoài scope.

`POST /conversations/{conversation_id}/messages`

- Body: `body`, optional attachment references.
- Response: message reference, moderation/delivery state.

### HRM, payroll and branch finance

`POST /payroll-periods/{period_id}/calculate`

- Response: calculation job reference, period state.
- Tính payroll phải chạy versioned policy và có snapshot nguồn dữ liệu.

`POST /payroll-periods/{period_id}/approve`

- Response: approved/locked state, approval audit.
- Sau lock, chỉnh sửa phải dùng adjustment workflow.

`POST /finance/expense-requests`

- Body: branch, category, amount, requester, documents.
- Response: request state, approval route.
- Không finalized nếu thiếu chứng từ hoặc chưa đủ phê duyệt.

## Integration webhook contracts

### Payment webhook

`POST /integrations/{provider}/payment-webhooks`

Required behavior:

- Validate signature and replay window.
- Persist inbox event before processing.
- Unique provider event id.
- Return safe acknowledgment after persistence.
- Process transaction update asynchronously.
- Duplicate delivery has no second financial effect.

### Meeting webhook

`POST /integrations/{provider}/meeting-webhooks`

Events: attendance, meeting_updated, meeting_cancelled, recording_ready, recording_removed.

Required behavior: signature validation, provider event idempotency, session mapping, recording permission check và reconcile fallback.

### Accounting/ERP sync

Worker contract `AccountingSyncEvent`:

```json
{
  "event_id": "stable-source-event-id",
  "organization_id": "org-ref",
  "branch_id": "branch-ref",
  "entity_type": "invoice|payment|refund|finance_entry|payroll_period",
  "entity_id": "entity-ref",
  "event_type": "created|approved|settled|refunded|adjusted",
  "payload_version": 1,
  "idempotency_key": "stable-key",
  "payload": {}
}
```

Provider adapter phải trả `accepted`, `external_reference`, `duplicate`, `retryable_error` hoặc `business_error`.

## AI contracts

### AI task request

`POST /ai/tasks`

- Body: `purpose`, `context_type`, `context_id`, `requested_action`, `input_refs`.
- Backend chạy policy check và data minimization trước provider.
- Response: `task_id`, `state`, `confidence`, `review_required`.

### AI review

`POST /ai/tasks/{task_id}/review`

- Body: `decision=approved|rejected|needs_revision`, `feedback`, optional correction.
- Tác vụ ảnh hưởng điểm, lương, quyền lợi, kỷ luật hoặc gian lận luôn yêu cầu review.
- Mọi review tạo audit event và có thể được khiếu nại theo chính sách.

## Super Admin License Contracts

Các endpoint này nằm trong control plane riêng về route, permission và audit; tenant admin không có quyền truy cập.

`POST /super-admin/product-plans`

- Body: plan code/name, term options monthly/yearly/lifetime, module entitlements, quotas, support/update policy.
- Plan phải versioned; thay đổi plan không tự sửa license lịch sử.

`POST /super-admin/licenses`

- Body: organization, plan version, term type, starts/expires, grace policy, entitlement overrides, quotas.
- Response: license id, signed license document metadata, activation state.

`POST /super-admin/licenses/{license_id}/renew`

- Hỗ trợ gia hạn tháng/năm và cập nhật term mới; lifetime dùng amendment cho module/quota/support policy.

`POST /super-admin/licenses/{license_id}/revoke`

- Body: reason, effective_at, optional grace behavior.
- Revoke phải audit và phát license state event.

`GET /runtime/license-state`

- Response: verified signature state, active/grace/expired/revoked, effective modules, quotas, last verified và next verification.
- Không trả private signing key hoặc secret.

## Contract invariants

- Không có endpoint nào cho phép client bỏ qua organization/branch/student scope.
- Không có business endpoint nào được thực thi nếu module effective state là disabled, kể cả khi frontend còn route cũ.
- Không module phụ thuộc nào được bật khi dependency chưa effective.
- Không tenant admin nào tự cấp license hoặc quota ngoài signed entitlement.
- Không thay đổi theme nào yêu cầu sửa màu hard-code trong component nghiệp vụ.
- Không có redirect payment nào tự chốt invoice.
- Không có webhook nào được xử lý hai lần.
- Không có payroll period locked nào bị sửa trực tiếp.
- Không có AI output rủi ro cao nào tự thay đổi dữ liệu cuối cùng khi chưa được review.
- Không có private file nào được cấp URL trước khi authorization thành công.
- Không có SaaS tenant nào dùng chung database với tenant khác.
- Không cutover tenant khi chưa có backup, final sync, validation, license đích và rollback readiness.
- Migration một tenant không được làm gián đoạn tenant khác.
