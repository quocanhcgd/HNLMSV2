---
title: Finance Officer
role_id: finance_officer
category: finance
access_level: 3
created: 2026-08-25
tags: [role, finance, mvp, critical]
---

# 💰 Finance Officer

## Overview

**Role ID**: `finance_officer`  
**Category**: Finance  
**Access Level**: 3 (Moderate-High - Financial data)  
**License Requirement**: Base System (Included)

---

## Description

Finance Officer quản lý tất cả hoạt động tài chính bao gồm invoice, payment collection, reconciliation và financial reporting. Có quyền truy cập dữ liệu tài chính trong phạm vi chi nhánh được phân công.

**Typical Users**: 
- Kế toán viên
- Thu ngân
- Finance Manager

---

## Key Responsibilities

### 1. Invoice Management (🤖 AI-Enhanced)
- Xem và quản lý invoices
- Theo dõi invoices chưa thanh toán (receivables)
- Gửi payment reminders
- Handle invoice disputes
- **🆕 AI-powered automated payment reminders**
- **🆕 Predictive overdue risk alerts**
- **🆕 Smart reminder scheduling based on payment patterns**

### 2. Payment Processing (🤖 AI-Enhanced)
- Record cash payments
- Verify bank transfers
- Monitor online payment webhooks (VNPay, Momo)
- Issue official receipts automatically
- Process refunds (with approval)
- **🆕 Automated payment gateway reconciliation**
- **🆕 AI fraud detection on transactions**
- **🆕 Auto-matching payments to invoices**

### 3. Financial Reconciliation (🤖 AI-Enhanced)
- Daily cash reconciliation
- Bank statement matching
- Payment gateway reconciliation
- Identify discrepancies
- **🆕 AI-powered anomaly detection**
- **🆕 Automated bank statement matching**
- **🆕 Smart discrepancy alerts**

### 4. Financial Reporting (🤖 AI-Enhanced)
- Generate revenue reports
- Track receivables and payables
- Cash flow monitoring
- Monthly financial close
- **🆕 AI-powered financial analytics**
- **🆕 Revenue forecasting**
- **🆕 Automated report generation**
- **🆕 Predictive cash flow projections**

### 5. AI Financial Assistant (New!)
- **🤖 Payment Predictions**: AI predicts payment likelihood
- **🤖 Churn Risk**: Identify at-risk non-paying students
- **🤖 Revenue Analytics**: Trends and insights
- **🤖 Automated Reminders**: Smart timing based on behavior
- **🤖 Fraud Detection**: Unusual transaction patterns

---

## Permissions

### Can View
- [x] All invoices in assigned branch(es)
- [x] All payment transactions
- [x] Student financial records (branch-scoped)
- [x] Financial reports and analytics
- [x] Bank reconciliation data
- [x] Receipt history

### Can Create
- [x] Manual payment records (cash/bank transfer)
- [x] Payment receipts
- [x] Financial reports
- [x] Payment reminders
- [x] Refund requests (pending approval)

### Can Edit
- [x] Payment records (before reconciliation)
- [x] Invoice notes
- [x] Receipt information (before sending)

### Can Delete
- [ ] ~~Cannot delete financial records~~
- [ ] ~~Cannot delete invoices~~
- [ ] ~~Cannot delete payment transactions~~

**Restrictions**:
- ❌ Cannot modify invoice amounts (generated from enrollment)
- ❌ Cannot delete financial records (audit compliance)
- ❌ Cannot approve own refund requests
- ❌ Cannot access other branches' financial data
- ❌ Cannot modify student enrollment or academic data

---

## Scope

**Organization Scope**: No
**Branch Scope**: Assigned branch(es) only
**Financial Scope**: Full access to branch financial data

---

## Typical Workflows

This role participates in:
- [[WF-01 Enrollment Journey]] - Payment phase
- [[WF-03 Financial Operations]] - Primary role
- [[WF-11 Monthly Financial Close]] - Reconciliation and reporting
- [[WF-12 Refund Processing]] - Refund handling

---

## Related Roles

**Reports To**: [[Branch Manager]], [[Organization Admin]]
**Collaborates With**: 
- [[Admission Consultant]] - Invoice questions
- [[Receptionist]] - Cash collection
- [[Student]] - Payment inquiries
- [[Accountant]] - Month-end close

---

## Navigation Access

**Menu Items Visible**:
```yaml
- Dashboard
  - Financial Summary
  - Today's Collections
  - Pending Payments
- Finance
  - Invoices
    - All Invoices
    - Pending Payment
    - Overdue
    - Paid
  - Payments
    - Record Payment
    - Payment History
    - Reconciliation
  - Receipts
    - Generate Receipt
    - Receipt History
  - Reports
    - Daily Collection Report
    - Revenue by Program
    - Receivables Aging
    - Cash Flow
- Settings
  - Payment Gateway Config (view only)
  - Receipt Templates
```

---

## Data Access Rules

```typescript
// Finance Officer can access branch financial data
function canAccessInvoice(user: FinanceOfficer, invoiceId: string): boolean {
  const invoice = await Invoice.findOne({ id: invoiceId });
  if (!invoice) return false;
  
  // Check if invoice belongs to user's branch
  const enrollment = await Enrollment.findOne({ id: invoice.enrollment_id });
  if (!enrollment) return false;
  
  const class = await Class.findOne({ id: enrollment.class_id });
  
  return user.branchIds.includes(class.branch_id);
}

// Can record payment for accessible invoices
function canRecordPayment(user: FinanceOfficer, invoiceId: string): boolean {
  if (!canAccessInvoice(user, invoiceId)) return false;
  
  const invoice = await Invoice.findOne({ id: invoiceId });
  
  // Cannot record payment for cancelled invoices
  if (invoice.status === 'cancelled') return false;
  
  // Cannot record payment exceeding invoice amount
  return true;
}
```

---

## User Scenarios

### Scenario 1: Recording Cash Payment
**Goal**: Thu tiền mặt tại quầy và cập nhật hệ thống

**Steps**:
1. Student arrives at counter with invoice number
2. Navigate to **Finance → Invoices**
3. Search invoice by number: `INV-2024-0123`
4. Verify invoice details:
   - Student name: Nguyễn Văn A
   - Amount due: 5,000,000 VND
5. Click **Record Payment**
6. Select payment method: `Cash`
7. Enter amount received: `5,000,000 VND`
8. Generate receipt number automatically
9. Click **Submit**
10. System updates invoice status to `Paid`
11. Print receipt (2 copies)
12. Give receipt to student, keep one for records
13. Place cash in cash drawer, note in cash log

**Expected Outcome**: 
- Invoice marked as paid
- Receipt generated and sent via email
- Cash recorded in daily collection
- Student has official receipt

---

### Scenario 2: Bank Transfer Reconciliation
**Goal**: Đối chiếu chuyển khoản ngân hàng với invoices

**Steps**:
1. Download bank statement (morning routine)
2. Navigate to **Finance → Payments → Reconciliation**
3. Upload bank statement CSV
4. System auto-matches transactions to invoices:
   - Match by amount and date
   - Match by reference number in description
5. Review matched transactions (green checkmarks)
6. Manually match unmatched transactions:
   - Find invoice by student name in description
   - Link transaction to invoice
7. Identify discrepancies:
   - Wrong amount transferred
   - Missing reference number
8. For each matched payment:
   - Click **Confirm**
   - System records payment
   - Updates invoice status
   - Generates receipt
9. For discrepancies:
   - Add to follow-up list
   - Contact student for clarification
10. Mark reconciliation as complete for the day

**Expected Outcome**: 
- All bank transfers matched to invoices
- Invoices updated to paid status
- Receipts sent automatically
- Discrepancies flagged for follow-up

---

### Scenario 3: Handling Overdue Payments
**Goal**: Theo dõi và nhắc nhở học phí chưa đóng

**Steps**:
1. Navigate to **Finance → Invoices → Overdue**
2. See list of overdue invoices:
   - Sort by days overdue
   - Filter by amount
3. Select invoice: `INV-2024-0089`
   - Student: Trần Thị B
   - Amount: 3,000,000 VND
   - Due date: 15 days ago
4. Click **View Details**
5. Check payment history: No payments recorded
6. Click **Send Payment Reminder**
7. Choose reminder template: `Polite Reminder - 2 weeks overdue`
8. Customize message if needed
9. Send via email and SMS
10. Log reminder sent in invoice history
11. Set follow-up date: 3 days
12. Repeat for all overdue invoices
13. Generate overdue report for Branch Manager

**Expected Outcome**: 
- All overdue students reminded
- Follow-up dates set
- Manager aware of receivables situation
- Improved collection rate

---

### Scenario 4: Processing Refund
**Goal**: Hoàn tiền cho học viên nghỉ học giữa chừng

**Steps**:
1. Receive refund request from [[Branch Manager]]
2. Navigate to **Finance → Invoices**
3. Find invoice for the enrollment
4. Verify enrollment status: `Cancelled` by manager
5. Calculate refund amount:
   - Total paid: 6,000,000 VND
   - Classes attended: 4/24
   - Prorated usage: 1,000,000 VND
   - Refundable: 5,000,000 VND
6. Click **Create Refund**
7. Enter refund details:
   - Amount: 5,000,000 VND
   - Reason: Early withdrawal
   - Refund method: Bank transfer
   - Bank details: (from student profile)
8. Submit for approval to [[Branch Manager]]
9. After approval, process refund:
   - Create payment transaction (negative amount)
   - Generate refund receipt
   - Update invoice balance
10. Transfer money to student's bank account
11. Update refund status: `Completed`
12. Send confirmation email to student

**Expected Outcome**: 
- Refund processed accurately
- Audit trail maintained
- Student receives money back
- Financial records updated

---

## Common Tasks

| Task | Frequency | Average Time | Critical? |
|------|-----------|--------------|-----------|
| Record cash payments | Daily | 5 min/payment | Yes |
| Bank reconciliation | Daily | 30-45 min | Yes |
| Generate daily collection report | Daily | 10 min | Yes |
| Send payment reminders | Weekly | 20 min | Yes |
| Process refunds | As needed | 15-20 min | Yes |
| Monthly financial close | Monthly | 2-3 hours | Yes |
| Respond to payment inquiries | Daily | Variable | No |

---

## Training Requirements

**Required Knowledge**:
- Basic accounting principles
- Cash handling procedures
- Bank reconciliation process
- Payment gateway operations
- Receipt generation and numbering
- Refund policies

**Training Duration**: 
- Initial training: 4 hours
- Hands-on practice: 1 week
- Ongoing support: As needed

**Training Modules**:
1. Invoice & Payment System (1.5 hours)
2. Cash Handling & Reconciliation (1 hour)
3. Payment Gateway & Online Payments (1 hour)
4. Reporting & Month-End Close (0.5 hour)

---

## Security Considerations

⚠️ **High Security Role** - Handles financial transactions and sensitive data

**Best Practices**:
- Cash drawer access restricted to assigned Finance Officers
- Dual control for large transactions (over 10M VND)
- Daily cash count and reconciliation
- Secure storage of physical receipts
- Strong passwords and 2FA when available
- Never share login credentials
- Log out from shared computers

**Audit Trail**:
All financial actions are logged:
- Payment recordings
- Receipt generations
- Refund requests and approvals
- Report exports
- Financial data access

---

## Performance Metrics

Finance Officers are evaluated on:
- **Collection Rate**: % of invoices paid on time
- **Reconciliation Accuracy**: % of transactions matched correctly
- **Response Time**: Average time to respond to payment inquiries
- **Error Rate**: % of payment recording errors
- **Receivables Days**: Average days to collect payment

**Accessible via**: Dashboard → Finance KPIs

---

## Edge Cases

### Payment Gateway Timeout
Q: Online payment shows "Pending" for hours, what to do?
A: Use **Finance → Payments → Reconciliation → Manual Check** to query payment gateway status. If confirmed paid, manually record payment with gateway reference. If failed, notify student to retry.

### Duplicate Payment
Q: Student paid twice by mistake (online + cash), how to refund?
A: Create refund for one payment. Choose faster method (original payment method). Document both transactions clearly in notes. No approval needed for duplicate payment refunds.

### Partial Payment
Q: Student can only pay half now, rest later?
A: Record partial payment. Invoice status becomes `Partially Paid`. Set reminder for remaining balance. Student enrollment remains active but may have restricted access to some features until fully paid.

### Invoice Correction
Q: Invoice generated with wrong amount, can it be fixed?
A: Cannot directly edit invoice amount. Cancel original invoice (with approval) and create manual invoice with correct amount. Document reason in notes. Link new invoice to enrollment.

---

## Notes

- All cash must be deposited to bank daily (end of business day)
- Keep physical receipt copies for 7 years (legal requirement)
- Month-end close deadline: 3rd business day of new month
- Payment gateway reconciliation must be done within 24 hours
- Escalate large discrepancies (>500K VND) to Branch Manager immediately
- Use payment reference numbers for all bank transfers

---

## Related Documentation

- [[Branch Manager]] - Approvals for refunds and adjustments
- [[Accountant]] - Month-end coordination
- [[WF-03 Financial Operations]] - Detailed financial workflows
- [[Payment Gateway Integration Guide]] - Technical details

---

**Last Updated**: 2026-08-25
**Reviewed By**: Branch Manager, Accountant
**Next Review**: 2026-09-25
