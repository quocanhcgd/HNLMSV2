---
title: Payroll Officer
role_id: payroll_officer
category: hr
access_level: 2
created: 2026-08-25
tags: [role, hr, addon]
---

# 💰 Payroll Officer

## Overview

**Role ID**: `payroll_officer`  
**Category**: Human Resources  
**Access Level**: 2 (Moderate - Payroll processing)  
**License Requirement**: HRM & Payroll Addon

---

## Description

Payroll Officer processes monthly payroll, calculates salaries, manages deductions, generates payslips, và ensures timely payment to employees. Works under [[HR Manager]].

---

## Key Responsibilities

### 1. Payroll Processing (🤖 AI-Enhanced)
- Calculate monthly salaries automatically
- Process teaching hours (from attendance tracking)
- Handle deductions (tax, insurance, social security)
- Generate payslips automatically
- Coordinate with finance for payment
- Maintain payroll records
- **🆕 AI-powered automated payroll calculation**
- **🆕 Auto-import attendance and teaching hours**
- **🆕 Automated tax and deduction calculations**
- **🆕 Smart error detection and validation**

### 2. Salary Management (🤖 AI-Enhanced)
- **🆕 Automated bonus and commission calculations**
- **🆕 Overtime tracking and calculation**
- **🆕 Pro-rated salary for new/exiting employees**
- **🆕 AI-powered salary adjustment recommendations**

### 3. Compliance (🤖 AI-Enhanced)
- **🆕 Automated tax compliance checking**
- **🆕 Social insurance calculations**
- **🆕 Labor law compliance alerts**
- **🆕 Automated government reporting**

### 4. AI Payroll Assistant (New!)
- **🤖 Auto-Calculate**: Salaries, taxes, deductions
- **🤖 Error Detection**: Flag unusual amounts or patterns
- **🤖 Predictive Analytics**: Forecast payroll costs
- **🤖 Smart Alerts**: Missing data, compliance issues
- **🤖 Automated Reports**: Monthly payroll summaries

---

## Permissions

### Can View
- [x] Employee salary information
- [x] Attendance và hours worked
- [x] Payroll history

### Can Create
- [x] Payroll runs
- [x] Payslips
- [x] Payroll reports

### Can Edit
- [x] Draft payroll (before approval)
- [x] Deduction amounts

### Can Delete
- [ ] ~~Cannot delete payroll records~~

---

## Typical Workflows

- [[WF-04 HR & Payroll]] - Payroll processing
- [[WF-32 Monthly Payroll Run]]

---

## Related Roles

**Reports To**: [[HR Manager]]
**Collaborates With**: [[Finance Officer]], [[Accountant]]

---

## User Scenarios

### Scenario 1: Monthly Payroll Processing

**Steps**:
1. Navigate to **Payroll → New Payroll Run**
2. Select period: September 2024
3. System loads all active employees
4. For each employee:
   
   **Full-time staff** (e.g., Finance Officer):
   - Base salary: 12,000,000 VND
   - Attendance: 22/22 days ✓
   - Deductions:
     - Social insurance: 800,000 VND
     - Health insurance: 300,000 VND
     - Tax: 1,200,000 VND
   - **Net: 9,700,000 VND**
   
   **Teachers** (hourly):
   - Base salary: 8,000,000 VND
   - Teaching hours: 80 hours
   - Hourly rate: 150,000 VND/hour
   - Gross: 8,000,000 + (80 × 150,000) = 20,000,000 VND
   - Deductions: 3,500,000 VND
   - **Net: 16,500,000 VND**

5. Review totals:
   - Total employees: 25
   - Gross payroll: 285,000,000 VND
   - Total deductions: 42,000,000 VND
   - Net payroll: 243,000,000 VND
6. Submit for [[HR Manager]] approval
7. After approval, generate payslips
8. Send payslips via email
9. Coordinate với [[Finance Officer]] for payment
10. Mark payroll as "Paid" when completed

**Expected Outcome**: All employees paid accurately và on time

---

## Common Tasks

| Task | Frequency | Time |
|------|-----------|------|
| Calculate payroll | Monthly | 4 hours |
| Generate payslips | Monthly | 1 hour |
| Handle inquiries | As needed | 15 min/inquiry |
| Update salary records | As needed | 10 min |

---

**Last Updated**: 2026-08-25
