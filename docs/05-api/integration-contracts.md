# Integration Contracts: LMS đa ngành đa chi nhánh

**Feature**: `001-lms-multi-branch`

## Payment Provider Adapter

### Outbound operations

- `create_payment_attempt(invoice, amount, idempotency_key)`
- `query_payment_attempt(provider_reference)`
- `refund_payment(provider_reference, amount, idempotency_key)`

### Inbound events

- payment_pending
- payment_confirmed
- payment_failed
- payment_cancelled
- refund_confirmed

### Required guarantees

- Signature validation.
- Replay protection.
- Stable provider event id.
- Idempotent processing.
- Reconciliation query for unknown state.
- No financial settlement from browser redirect alone.

## Meeting Provider Adapter

### Outbound operations

- `create_meeting(session)`
- `update_meeting(session)`
- `cancel_meeting(external_meeting_id)`
- `fetch_attendance(external_meeting_id, window)`
- `fetch_recording(external_meeting_id)`

### Inbound events

- meeting_created
- meeting_updated
- meeting_cancelled
- participant_joined
- participant_left
- recording_ready
- recording_removed

### Required guarantees

- Provider event unique key.
- Signature and timestamp validation.
- Mapping failure routed to review queue.
- Periodic reconciliation for attendance and recordings.
- Recording access remains controlled by LMS permissions.

## Accounting/ERP Adapter

### Outbound operations

- `publish_document(event)`
- `query_document(external_reference)`
- `reconcile(source_period, branch_scope)`

### Result classes

- `accepted`: provider accepted and returns external reference.
- `duplicate`: provider confirms event already processed.
- `retryable_error`: retry with backoff.
- `business_error`: do not retry blindly; require correction/review.
- `unavailable`: keep pending and retry later.

### Required guarantees

- Stable idempotency key.
- Payload versioning.
- Source entity and branch mapping.
- External reference persisted.
- Reconciliation report for mismatch.

## AI Provider Adapter

### Outbound operations

- `complete(task_input, policy_context)`
- `embed(content, policy_context)` when search/indexing is approved.

### Required response fields

- `provider`
- `model_version`
- `output`
- `citations_or_sources`
- `confidence`
- `safety_flags`
- `usage_cost`
- `provider_request_reference`

### Required guarantees

- Input data has passed permission and minimization checks.
- Provider failure maps to manual fallback.
- Output schema validation before domain use.
- High-risk output always routed to review.
- Prompt, model and policy version recorded for audit.

## License Management System (FUTURE — D9)

> ⚠️ **(D9)** Hệ thống quản lý license **chưa triển khai** ở giai đoạn này. LMS chạy license mặc định (LicenseService stub). Mục này là **điểm kết nối chờ (integration seam)** — contract sẽ kích hoạt khi triển khai hệ thống quản lý license.

### Outbound operations (LMS → hệ thống quản lý license)

- `activate_license(organization, license_key_or_file)` — kích hoạt/áp license.
- `get_license_status(organization)` — trạng thái + constraints + usage.
- `activate_addon(organization, addon_id, serial_key)`.
- `refresh_entitlement(organization_id)` — đồng bộ entitlement/module states.

### Inbound events

- `license_issued` · `license_revoked` · `license_renewed` · `addon_activated`.

### Required guarantees

- Signature/timestamp validation (RSA-2048, replay protection).
- Không phone-home từng request: license verify local, chỉ sync khi có sự kiện thay đổi.
- Usage data (max_students...) do LMS tính và báo về khi cần đối soát.
- Contract hiện tại được LMS expose qua endpoint `/license/*` (xem `api-spec.yaml`) — đánh dấu FUTURE.
