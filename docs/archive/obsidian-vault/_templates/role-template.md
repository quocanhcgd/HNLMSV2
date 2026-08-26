---
title: {{ROLE_NAME}}
role_id: {{ROLE_ID}}
category: {{CATEGORY}}
access_level: {{LEVEL}}
created: {{date}}
tags: [role, {{CATEGORY}}]
---

# {{ROLE_NAME}}

## Overview

**Role ID**: `{{ROLE_ID}}`  
**Category**: {{CATEGORY}}  
**Access Level**: {{LEVEL}} (1=Limited, 5=Full Admin)  
**License Requirement**: Base System / {{ADDON}}

---

## Description

{{Brief description of this role's purpose and responsibilities}}

---

## Key Responsibilities

- {{Responsibility 1}}
- {{Responsibility 2}}
- {{Responsibility 3}}

---

## Permissions

### Can View
- [ ] {{Resource 1}}
- [ ] {{Resource 2}}

### Can Create
- [ ] {{Resource 1}}
- [ ] {{Resource 2}}

### Can Edit
- [ ] {{Resource 1}}
- [ ] {{Resource 2}}

### Can Delete
- [ ] {{Resource 1}}
- [ ] {{Resource 2}}

---

## Scope

**Organization Scope**: {{Yes/No}}
**Branch Scope**: {{Yes/No/Optional}}
**Student Scope**: {{Yes/No/Optional}}

---

## Typical Workflows

This role participates in:
- [[WF-XX Workflow Name]]
- [[WF-YY Workflow Name]]

---

## Related Roles

**Reports To**: [[Role Name]]
**Manages**: [[Role Name]], [[Role Name]]
**Collaborates With**: [[Role Name]], [[Role Name]]

---

## Navigation Access

**Menu Items Visible**:
```yaml
- Dashboard
- {{Menu 1}}
  - {{Submenu 1.1}}
  - {{Submenu 1.2}}
- {{Menu 2}}
```

---

## Data Access Rules

```typescript
// Pseudo-code for access control
function canAccess(user: {{ROLE_NAME}}, resource: Resource): boolean {
  // Rule 1: {{Description}}
  if ({{condition}}) return false;
  
  // Rule 2: {{Description}}
  if ({{condition}}) return true;
  
  return false;
}
```

---

## User Scenarios

### Scenario 1: {{Scenario Name}}
**Goal**: {{What user wants to achieve}}
**Steps**:
1. {{Step 1}}
2. {{Step 2}}
3. {{Step 3}}

**Expected Outcome**: {{Result}}

---

## Common Tasks

| Task | Frequency | Average Time |
|------|-----------|--------------|
| {{Task 1}} | Daily | 5 min |
| {{Task 2}} | Weekly | 15 min |
| {{Task 3}} | Monthly | 30 min |

---

## Training Requirements

**Required Knowledge**:
- {{Knowledge area 1}}
- {{Knowledge area 2}}

**Training Duration**: {{X hours/days}}

---

## Notes

{{Any additional notes, edge cases, or special considerations}}

---

**Last Updated**: {{date}}
**Reviewed By**: {{reviewer}}
