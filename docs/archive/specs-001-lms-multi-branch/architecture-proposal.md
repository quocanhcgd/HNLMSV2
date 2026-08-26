# Architecture Proposal: LMS đa ngành đa chi nhánh - SaaS Multi-tenant

**Date**: 2026-08-25  
**Status**: Proposal  
**Target**: Production-ready SaaS platform

---

## Executive Summary

Tài liệu này đề xuất kiến trúc mới cho hệ thống LMS SaaS multi-tenant, thay thế kiến trúc cũ với các cải tiến:

### Key Changes from Original Design

| Aspect | Original | Proposed | Rationale |
|--------|----------|----------|-----------|
| **Frontend Stack** | Next.js + shadcn/ui + Tailwind CSS 4 beta | React 19 + Ant Design Pro + CSS-in-JS | Mature ecosystem, proven admin patterns, production stability |
| **UI Architecture** | 3 separate shells (public/platform/admin) with shadcn registry | Unified component library với role-based layout routing | Giảm complexity, dễ maintain, tái sử dụng tốt hơn |
| **Theme System** | Semantic tokens + preset versioning | Ant Design theming + CSS variables | Đủ tùy biến, không over-engineer |
| **Database per Tenant** | Maintained | Enhanced with connection pooling & migration orchestration | Keep isolation benefits, improve operations |
| **Deployment** | Native systemd (no Docker) | Native systemd + CI/CD automation + health checks | Add automation while respecting constraints |
| **Module System** | Complex manifest + license gates | Simplified feature flags + usage-based billing | Easier to develop, clearer business model |

---

## Part 1: Frontend Architecture Redesign

### 1.1 Technology Stack

```yaml
Core Framework:
  - React 19 (stable)
  - TypeScript 5.x
  - Vite (build tool, faster than webpack)
  
Admin UI Library:
  - Ant Design 5.x (component library)
  - Ant Design Pro (admin templates & layouts)
  - ProComponents (advanced table, form, list)
  
Public Site:
  - React + Ant Design components
  - React Router for navigation
  - Server-side rendering via Express/Fastify
  
State Management:
  - TanStack Query (server state)
  - Zustand (client state, lightweight)
  
Forms & Validation:
  - React Hook Form
  - Zod (schema validation)
  
Styling:
  - CSS-in-JS (Ant Design built-in)
  - CSS Modules for custom styles
  - CSS Variables for theming
```

**Why Ant Design Pro?**

✅ **Production-proven**: Used by Alibaba, Ant Financial, thousands of enterprises  
✅ **Complete admin patterns**: CRUD tables, forms, charts, layouts out-of-box  
✅ **Internationalization**: Built-in i18n (Vietnamese + English)  
✅ **Accessibility**: WCAG 2.0 AA compliant by default  
✅ **Mobile responsive**: Built-in responsive layouts  
✅ **Extensible**: Easy to customize without fighting the framework  
✅ **Documentation**: Comprehensive docs in multiple languages  

**Not Using:**
- ❌ shadcn/ui: Good for startups, but requires building everything from primitives
- ❌ Tailwind CSS: Utility-first adds verbosity, not ideal for large teams
- ❌ Custom design system: Over-engineering for current scale

---

### 1.2 Application Structure

```
apps/web/
├── public/                      # Static assets
├── src/
│   ├── main.tsx                # App entry point
│   ├── router.tsx              # Route definitions
│   │
│   ├── layouts/                # Layout components
│   │   ├── PublicLayout.tsx   # For landing pages
│   │   ├── AdminLayout.tsx    # For authenticated users
│   │   └── BlankLayout.tsx    # For login/error pages
│   │
│   ├── pages/                  # Page components (route handlers)
│   │   ├── public/
│   │   │   ├── Home/
│   │   │   ├── Programs/
│   │   │   └── Contact/
│   │   ├── auth/
│   │   │   ├── Login/
│   │   │   └── ForgotPassword/
│   │   ├── admin/
│   │   │   ├── Dashboard/
│   │   │   ├── Organizations/
│   │   │   ├── Branches/
│   │   │   ├── Users/
│   │   │   └── Settings/
│   │   ├── admission/
│   │   │   ├── Leads/
│   │   │   ├── Consultations/
│   │   │   └── Enrollments/
│   │   ├── academic/
│   │   │   ├── Programs/
│   │   │   ├── Courses/
│   │   │   ├── Classes/
│   │   │   └── Schedules/
│   │   ├── learning/
│   │   │   ├── Library/
│   │   │   ├── Assessments/
│   │   │   └── Progress/
│   │   ├── hrm/
│   │   │   ├── Employees/
│   │   │   ├── Attendance/
│   │   │   └── Performance/
│   │   ├── finance/
│   │   │   ├── Invoices/
│   │   │   ├── Payments/
│   │   │   ├── Payroll/
│   │   │   └── Reports/
│   │   └── platform/           # Super-admin only
│   │       ├── Tenants/
│   │       ├── Plans/
│   │       └── Billing/
│   │
│   ├── components/             # Shared components
│   │   ├── business/          # Business logic components
│   │   │   ├── BranchSelector/
│   │   │   ├── UserSelector/
│   │   │   ├── CourseCard/
│   │   │   └── EnrollmentStatus/
│   │   └── common/            # Generic components
│   │       ├── PageHeader/
│   │       ├── DataTable/
│   │       ├── FormBuilder/
│   │       └── ErrorBoundary/
│   │
│   ├── services/              # API clients
│   │   ├── api.ts            # Base API client (axios/fetch)
│   │   ├── auth.service.ts
│   │   ├── organization.service.ts
│   │   ├── admission.service.ts
│   │   └── ...
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── usePermission.ts
│   │   ├── useTenant.ts
│   │   └── useDataTable.ts
│   │
│   ├── stores/               # Zustand stores
│   │   ├── auth.store.ts
│   │   ├── tenant.store.ts
│   │   └── ui.store.ts
│   │
│   ├── types/                # TypeScript types
│   │   ├── api.types.ts
│   │   ├── entities.types.ts
│   │   └── enums.ts
│   │
│   ├── utils/                # Utility functions
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── permissions.ts
│   │
│   ├── config/              # Configuration
│   │   ├── routes.config.ts
│   │   ├── menu.config.ts
│   │   └── theme.config.ts
│   │
│   └── locales/             # i18n translations
│       ├── vi-VN.json
│       └── en-US.json
│
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

### 1.3 Navigation & Menu System

**Simplified Role-Based Menu** (không còn 3 shells riêng biệt):

```typescript
// config/menu.config.ts
export const menuConfig = {
  // Public routes (no auth)
  public: [
    { path: '/', label: 'Trang chủ' },
    { path: '/programs', label: 'Chương trình đào tạo' },
    { path: '/about', label: 'Giới thiệu' },
    { path: '/contact', label: 'Liên hệ' },
  ],
  
  // Authenticated routes (role-based visibility)
  authenticated: [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: 'DashboardOutlined',
      path: '/dashboard',
      roles: ['*'], // All roles
    },
    {
      key: 'admission',
      label: 'Tuyển sinh',
      icon: 'UserAddOutlined',
      roles: ['admin', 'consultant'],
      children: [
        { path: '/admission/leads', label: 'Khách hàng tiềm năng' },
        { path: '/admission/consultations', label: 'Tư vấn' },
        { path: '/admission/enrollments', label: 'Ghi danh' },
      ],
    },
    {
      key: 'academic',
      label: 'Đào tạo',
      icon: 'BookOutlined',
      roles: ['admin', 'academic_manager', 'teacher'],
      children: [
        { path: '/academic/programs', label: 'Chương trình' },
        { path: '/academic/courses', label: 'Khóa học' },
        { path: '/academic/classes', label: 'Lớp học' },
        { path: '/academic/schedules', label: 'Lịch học' },
      ],
    },
    {
      key: 'learning',
      label: 'Học tập',
      icon: 'ReadOutlined',
      roles: ['student', 'parent', 'teacher'],
      children: [
        { path: '/learning/my-classes', label: 'Lớp của tôi' },
        { path: '/learning/library', label: 'Thư viện' },
        { path: '/learning/assessments', label: 'Bài kiểm tra' },
      ],
    },
    {
      key: 'hrm',
      label: 'Nhân sự',
      icon: 'TeamOutlined',
      roles: ['admin', 'hr_manager'],
      children: [
        { path: '/hrm/employees', label: 'Nhân viên' },
        { path: '/hrm/attendance', label: 'Chấm công' },
        { path: '/hrm/leave', label: 'Nghỉ phép' },
      ],
    },
    {
      key: 'finance',
      label: 'Tài chính',
      icon: 'DollarOutlined',
      roles: ['admin', 'finance_manager'],
      children: [
        { path: '/finance/invoices', label: 'Hóa đơn' },
        { path: '/finance/payments', label: 'Thanh toán' },
        { path: '/finance/payroll', label: 'Bảng lương' },
      ],
    },
    {
      key: 'settings',
      label: 'Cài đặt',
      icon: 'SettingOutlined',
      roles: ['admin'],
      children: [
        { path: '/settings/organization', label: 'Tổ chức' },
        { path: '/settings/branches', label: 'Chi nhánh' },
        { path: '/settings/users', label: 'Người dùng' },
        { path: '/settings/roles', label: 'Vai trò' },
      ],
    },
    // Super-admin only
    {
      key: 'platform',
      label: 'Platform Admin',
      icon: 'CloudOutlined',
      roles: ['super_admin'],
      children: [
        { path: '/platform/tenants', label: 'Tenants' },
        { path: '/platform/plans', label: 'Plans' },
        { path: '/platform/billing', label: 'Billing' },
      ],
    },
  ],
};
```

**Benefits:**
- ✅ Single routing mechanism (React Router)
- ✅ Role-based menu rendering (không cần 3 shells)
- ✅ Dynamic menu theo permissions
- ✅ Easier to add/remove features

---

### 1.4 Theming System (Simplified)

**Thay vì:** Semantic tokens + preset versioning (over-engineered)  
**Dùng:** Ant Design theming + CSS Variables

```typescript
// config/theme.config.ts
import type { ThemeConfig } from 'antd';

export const defaultTheme: ThemeConfig = {
  token: {
    // Brand colors
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    
    // Spacing
    borderRadius: 6,
    
    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
  },
  
  components: {
    Button: {
      controlHeight: 36,
    },
    Table: {
      headerBg: '#fafafa',
    },
  },
};

// Per-tenant theme override (stored in DB)
export interface TenantTheme {
  tenant_id: string;
  primary_color: string;
  logo_url: string;
  favicon_url: string;
  custom_css?: string;
}
```

**Runtime theme loading:**

```typescript
// Load tenant theme on login
const { data: tenantTheme } = useQuery({
  queryKey: ['tenant-theme', tenantId],
  queryFn: () => api.get(`/tenants/${tenantId}/theme`),
});

// Apply theme
<ConfigProvider theme={{
  ...defaultTheme,
  token: {
    ...defaultTheme.token,
    colorPrimary: tenantTheme?.primary_color || defaultTheme.token.colorPrimary,
  },
}}>
  <App />
</ConfigProvider>
```

**Why simpler?**
- ✅ Ant Design theming handles 90% use cases
- ✅ No need for preset versioning (overkill for SaaS)
- ✅ CSS Variables for additional customization
- ✅ Tenant can customize primary color + logo (enough for branding)

---

## Part 2: Backend Architecture Refinements

### 2.1 Module System Simplification

**Old:** Complex module manifest + dependency graph + license gates  
**New:** Feature flags + usage-based billing

```typescript
// Simplified feature flag model
enum Feature {
  // Core (always enabled)
  ORGANIZATION_MANAGEMENT = 'org.management',
  USER_MANAGEMENT = 'org.users',
  BASIC_REPORTING = 'org.reporting.basic',
  
  // Tier 1: Basic Plan
  LANDING_PAGE = 'marketing.landing',
  CRM_LEADS = 'marketing.crm.leads',
  ACADEMIC_CORE = 'academic.core',
  CLASS_MANAGEMENT = 'academic.classes',
  
  // Tier 2: Professional Plan
  ASSESSMENTS = 'academic.assessments',
  ENGLISH_PATHWAY = 'academic.english',
  ONLINE_CLASSES = 'academic.online',
  PARENT_PORTAL = 'learning.parent_portal',
  LIBRARY = 'learning.library',
  
  // Tier 3: Enterprise Plan
  HRM_FULL = 'hrm.full',
  PAYROLL = 'finance.payroll',
  BRANCH_FINANCE = 'finance.branch',
  AI_ASSISTANCE = 'ai.assistance',
  ADVANCED_REPORTING = 'reporting.advanced',
  API_ACCESS = 'platform.api',
  
  // Add-ons (pay-per-use)
  SMS_NOTIFICATIONS = 'communication.sms',
  EMAIL_CAMPAIGNS = 'marketing.email_campaigns',
  CUSTOM_DOMAIN = 'platform.custom_domain',
}

// Database schema
table tenants {
  id uuid primary_key
  name varchar
  subdomain varchar unique  // acme.lms-platform.com
  plan_id uuid references plans
  status enum('trial', 'active', 'suspended', 'cancelled')
  trial_ends_at timestamp
  subscription_ends_at timestamp
  created_at timestamp
}

table plans {
  id uuid primary_key
  name varchar  // Basic, Professional, Enterprise
  price_monthly decimal
  price_yearly decimal
  max_branches int
  max_students int
  max_storage_gb int
  features jsonb  // array of Feature enum values
}

table tenant_features {
  tenant_id uuid references tenants
  feature varchar  // Feature enum
  enabled boolean default true
  quota int  // null = unlimited
  usage int default 0
  primary key (tenant_id, feature)
}

table tenant_usage {
  tenant_id uuid references tenants
  metric varchar  // 'storage_gb', 'sms_sent', 'ai_requests'
  value decimal
  period date  // monthly aggregation
  primary key (tenant_id, metric, period)
}
```

**Feature Check (Backend):**

```typescript
// Guard decorator
@RequireFeature(Feature.ASSESSMENTS)
@RequirePermission('assessments.create')
async createAssessment(dto: CreateAssessmentDto) {
  // Implementation
}

// Service method
class FeatureService {
  async isEnabled(tenantId: string, feature: Feature): Promise<boolean> {
    const tenant = await this.tenantRepo.findOne(tenantId);
    
    // Check if plan includes feature
    const plan = await this.planRepo.findOne(tenant.plan_id);
    if (!plan.features.includes(feature)) {
      return false;
    }
    
    // Check if explicitly disabled
    const override = await this.tenantFeatureRepo.findOne({
      tenant_id: tenantId,
      feature: feature,
    });
    
    if (override && !override.enabled) {
      return false;
    }
    
    // Check quota if applicable
    if (override?.quota !== null && override.usage >= override.quota) {
      return false;
    }
    
    return true;
  }
}
```

**Benefits:**
- ✅ Simpler than module manifest + dependency graph
- ✅ Clearer business model (tiered pricing)
- ✅ Easier to add/remove features
- ✅ Usage tracking built-in for billing

---

### 2.2 Authentication & Multi-tenancy

**Tenant Resolution Strategy:**

```typescript
// 1. Subdomain-based (primary)
// https://acme.lms-platform.com → tenant: acme

// 2. Custom domain (enterprise)
// https://lms.acme.com → lookup custom_domains table

// 3. API key (for integrations)
// Header: X-API-Key: tenant_xxx_secret_yyy

// Middleware
class TenantMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    let tenant: Tenant;
    
    // Check custom domain first
    const customDomain = await this.customDomainRepo.findByDomain(req.hostname);
    if (customDomain) {
      tenant = customDomain.tenant;
    } else {
      // Extract subdomain
      const subdomain = req.hostname.split('.')[0];
      tenant = await this.tenantRepo.findBySubdomain(subdomain);
    }
    
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    
    if (tenant.status !== 'active') {
      throw new ForbiddenException('Tenant is not active');
    }
    
    // Attach to request context
    req.tenant = tenant;
    req.tenantId = tenant.id;
    
    next();
  }
}

// Database connection pooling per tenant
class TenantDatabaseService {
  private pools = new Map<string, Pool>();
  
  async getConnection(tenantId: string): Promise<PoolClient> {
    if (!this.pools.has(tenantId)) {
      const tenant = await this.tenantRepo.findOne(tenantId);
      const pool = new Pool({
        host: tenant.db_host,
        port: tenant.db_port,
        database: tenant.db_name,
        user: tenant.db_user,
        password: await this.decrypt(tenant.db_password_encrypted),
        max: 10, // connection pool size per tenant
      });
      this.pools.set(tenantId, pool);
    }
    
    return this.pools.get(tenantId).connect();
  }
}
```

**Session Management:**

```typescript
// JWT payload
interface JwtPayload {
  user_id: string;
  tenant_id: string;
  roles: string[];
  permissions: string[];
  exp: number;
}

// Authorization decorator
@RequireRole('admin', 'finance_manager')
async approvePayroll() {
  // Implementation
}

@RequirePermission('payroll.approve')
async approvePayroll() {
  // Implementation
}
```

---

### 2.3 Data Isolation & Scope Enforcement

**Repository Pattern với Tenant Scope:**

```typescript
// Base repository with tenant scope
abstract class TenantScopedRepository<T> {
  constructor(
    protected connection: Connection,
    protected tenantId: string,
  ) {}
  
  // All queries automatically filtered by tenant
  async find(where: any): Promise<T[]> {
    return this.connection
      .getRepository(this.entityClass)
      .find({
        where: {
          organization_id: this.tenantId,
          ...where,
        },
      });
  }
  
  async findOne(id: string): Promise<T> {
    const entity = await this.connection
      .getRepository(this.entityClass)
      .findOne({
        where: {
          id,
          organization_id: this.tenantId,
        },
      });
    
    if (!entity) {
      throw new NotFoundException();
    }
    
    return entity;
  }
}

// Usage
class ClassRepository extends TenantScopedRepository<Class> {
  async findByBranch(branchId: string): Promise<Class[]> {
    // Tenant scope automatically applied
    return this.find({ branch_id: branchId });
  }
}
```

**Branch-Level Scope:**

```typescript
// For users with branch-specific permissions
class ScopedService {
  async checkBranchAccess(userId: string, branchId: string): Promise<boolean> {
    const grants = await this.scopeGrantRepo.find({
      user_id: userId,
      branch_id: branchId,
      effective_from: LessThanOrEqual(new Date()),
      effective_to: MoreThanOrEqual(new Date()),
    });
    
    return grants.length > 0;
  }
  
  async listAccessibleBranches(userId: string): Promise<string[]> {
    const user = await this.userRepo.findOne(userId);
    
    // Super admin: all branches
    if (user.is_super_admin) {
      return this.branchRepo.findAll().then(b => b.map(x => x.id));
    }
    
    // Regular user: granted branches
    const grants = await this.scopeGrantRepo.find({
      user_id: userId,
      effective_from: LessThanOrEqual(new Date()),
      effective_to: MoreThanOrEqual(new Date()),
    });
    
    return grants.map(g => g.branch_id);
  }
}
```

---

## Part 3: Deployment & Operations

### 3.1 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Unit tests
        run: npm run test:unit
      
      - name: Integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
          REDIS_URL: redis://localhost:6379
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build artifacts
        run: |
          npm ci --production
          npm run build
          
      - name: Create release tarball
        run: |
          VERSION=${GITHUB_REF#refs/tags/}
          tar -czf lms-${VERSION}.tar.gz \
            dist/ \
            node_modules/ \
            package.json \
            infra/
      
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: release
          path: lms-*.tar.gz
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
      
      - name: Deploy to server
        env:
          SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
        run: |
          # Upload to server
          scp lms-*.tar.gz deploy@$DEPLOY_HOST:/opt/lms/releases/
          
          # Run deployment script
          ssh deploy@$DEPLOY_HOST 'bash /opt/lms/scripts/deploy.sh'
      
      - name: Health check
        run: |
          sleep 10
          curl -f https://platform.lms.com/health || exit 1
```

---

### 3.2 Native Deployment Scripts

```bash
#!/bin/bash
# /opt/lms/scripts/deploy.sh

set -e

VERSION=$(ls /opt/lms/releases/lms-*.tar.gz | tail -1 | sed 's/.*lms-\(.*\)\.tar\.gz/\1/')
RELEASE_DIR="/opt/lms/releases/${VERSION}"
CURRENT_DIR="/opt/lms/current"

echo "==> Deploying version ${VERSION}"

# 1. Extract release
mkdir -p ${RELEASE_DIR}
tar -xzf /opt/lms/releases/lms-${VERSION}.tar.gz -C ${RELEASE_DIR}

# 2. Database backup
echo "==> Creating database backup"
pg_dump -h localhost -U lms_user -d lms_platform > /opt/lms/backups/pre-${VERSION}.sql

# 3. Run migrations
echo "==> Running migrations"
cd ${RELEASE_DIR}
NODE_ENV=production node dist/migration.js up

# 4. Symlink to current
echo "==> Switching to new version"
ln -sfn ${RELEASE_DIR} ${CURRENT_DIR}

# 5. Restart services
echo "==> Restarting services"
sudo systemctl restart lms-web
sudo systemctl restart lms-api
sudo systemctl restart lms-worker

# 6. Health check
echo "==> Running health checks"
sleep 5

if ! curl -f http://localhost:3000/health; then
  echo "Health check failed! Rolling back..."
  
  # Rollback
  PREVIOUS=$(ls -t /opt/lms/releases/ | sed -n 2p)
  ln -sfn /opt/lms/releases/${PREVIOUS} ${CURRENT_DIR}
  sudo systemctl restart lms-web lms-api lms-worker
  
  exit 1
fi

echo "==> Deployment successful"

# 7. Cleanup old releases (keep last 3)
ls -t /opt/lms/releases/ | tail -n +4 | xargs -I {} rm -rf /opt/lms/releases/{}
```

---

### 3.3 Systemd Service Units

```ini
# /etc/systemd/system/lms-web.service
[Unit]
Description=LMS Web Frontend
After=network.target

[Service]
Type=simple
User=lms
Group=lms
WorkingDirectory=/opt/lms/current
Environment="NODE_ENV=production"
Environment="PORT=3000"
EnvironmentFile=/opt/lms/config/web.env
ExecStart=/usr/bin/node dist/web/main.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/lms/current/uploads

[Install]
WantedBy=multi-user.target
```

```ini
# /etc/systemd/system/lms-api.service
[Unit]
Description=LMS API Backend
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=lms
Group=lms
WorkingDirectory=/opt/lms/current
Environment="NODE_ENV=production"
Environment="PORT=4000"
EnvironmentFile=/opt/lms/config/api.env
ExecStart=/usr/bin/node dist/api/main.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

# Health check
ExecStartPost=/bin/sleep 5
ExecStartPost=/usr/bin/curl -f http://localhost:4000/health

[Install]
WantedBy=multi-user.target
```

```ini
# /etc/systemd/system/lms-worker.service
[Unit]
Description=LMS Background Worker
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=lms
Group=lms
WorkingDirectory=/opt/lms/current
Environment="NODE_ENV=production"
EnvironmentFile=/opt/lms/config/worker.env
ExecStart=/usr/bin/node dist/worker/main.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

---

### 3.4 Nginx Configuration

```nginx
# /etc/nginx/sites-available/lms-platform

# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=web_limit:10m rate=30r/s;

# Upstream servers
upstream lms_web {
    least_conn;
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

upstream lms_api {
    least_conn;
    server 127.0.0.1:4000 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

# Wildcard for tenant subdomains
server {
    listen 80;
    listen [::]:80;
    server_name *.lms-platform.com lms-platform.com;
    
    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name *.lms-platform.com lms-platform.com;
    
    # SSL
    ssl_certificate /etc/letsencrypt/live/lms-platform.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lms-platform.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Logs
    access_log /var/log/nginx/lms-access.log;
    error_log /var/log/nginx/lms-error.log;
    
    # API routes
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://lms_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files (uploaded content)
    location /uploads/ {
        alias /opt/lms/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Web frontend (SPA)
    location / {
        limit_req zone=web_limit burst=50 nodelay;
        
        proxy_pass http://lms_web;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Part 4: Database Strategy

### 4.1 Master Database (Platform Level)

```sql
-- Master database: lms_platform_master
-- Stores tenant metadata, billing, platform admin

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(63) UNIQUE NOT NULL,
    custom_domain VARCHAR(255),
    
    -- Database connection info
    db_host VARCHAR(255) NOT NULL,
    db_port INTEGER NOT NULL DEFAULT 5432,
    db_name VARCHAR(63) NOT NULL,
    db_user VARCHAR(63) NOT NULL,
    db_password_encrypted TEXT NOT NULL,
    
    -- Subscription
    plan_id UUID REFERENCES plans(id),
    status VARCHAR(20) NOT NULL DEFAULT 'trial',
    trial_ends_at TIMESTAMP,
    subscription_starts_at TIMESTAMP,
    subscription_ends_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by UUID,
    
    CONSTRAINT valid_subdomain CHECK (subdomain ~ '^[a-z0-9-]+$')
);

CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    features JSONB NOT NULL DEFAULT '[]',
    
    -- Limits
    max_branches INTEGER,
    max_students INTEGER,
    max_teachers INTEGER,
    max_storage_gb INTEGER,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tenant_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    plan_id UUID NOT NULL REFERENCES plans(id),
    status VARCHAR(20) NOT NULL, -- active, past_due, cancelled
    
    billing_cycle VARCHAR(20), -- monthly, yearly
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    
    cancel_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tenant_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    subscription_id UUID REFERENCES tenant_subscriptions(id),
    
    amount_subtotal DECIMAL(10,2) NOT NULL,
    amount_tax DECIMAL(10,2) DEFAULT 0,
    amount_total DECIMAL(10,2) NOT NULL,
    
    status VARCHAR(20) NOT NULL, -- draft, open, paid, void
    due_date DATE,
    paid_at TIMESTAMP,
    
    invoice_pdf_url TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_subscriptions_tenant ON tenant_subscriptions(tenant_id);
```

---

### 4.2 Tenant Database Template

```sql
-- Template database: lms_tenant_template
-- Each tenant gets a clone of this schema

-- Organization & Access Control
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    manager_user_id UUID,
    status VARCHAR(20) DEFAULT 'active',
    opened_at DATE,
    closed_at DATE,
    
    UNIQUE(organization_id, code)
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(organization_id, email)
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name VARCHAR(100) NOT NULL,
    permissions JSONB DEFAULT '[]',
    
    UNIQUE(organization_id, name)
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT NOW(),
    granted_by UUID REFERENCES users(id),
    
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE scope_grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    effective_from TIMESTAMP DEFAULT NOW(),
    effective_to TIMESTAMP,
    
    granted_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Academic Core
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    department_id UUID REFERENCES departments(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_hours INTEGER,
    status VARCHAR(20) DEFAULT 'draft'
);

CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    program_id UUID NOT NULL REFERENCES programs(id),
    
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    capacity INTEGER,
    modality VARCHAR(20), -- in_person, online, hybrid
    
    enrollment_status VARCHAR(20) DEFAULT 'open',
    start_date DATE,
    end_date DATE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    student_id UUID NOT NULL REFERENCES students(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    
    enrolled_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active',
    completion_status VARCHAR(20),
    
    UNIQUE(student_id, class_id)
);

-- Finance
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    branch_id UUID REFERENCES branches(id),
    student_id UUID NOT NULL REFERENCES students(id),
    enrollment_id UUID REFERENCES enrollments(id),
    
    invoice_number VARCHAR(50) UNIQUE,
    amount_total DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    amount_due DECIMAL(10,2) NOT NULL,
    
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending',
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    provider VARCHAR(50),
    provider_transaction_id VARCHAR(255),
    
    status VARCHAR(20) NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE,
    
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Trail
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    actor_user_id UUID REFERENCES users(id),
    
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    
    before_snapshot JSONB,
    after_snapshot JSONB,
    
    ip_address INET,
    user_agent TEXT,
    correlation_id UUID,
    
    occurred_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_events_org ON audit_events(organization_id, occurred_at DESC);
CREATE INDEX idx_audit_events_entity ON audit_events(entity_type, entity_id);

-- Add more tables as needed for HRM, Payroll, Assessments, etc.
```

---

### 4.3 Tenant Provisioning

```typescript
// Service for provisioning new tenants
class TenantProvisioningService {
  async createTenant(dto: CreateTenantDto): Promise<Tenant> {
    // 1. Validate subdomain availability
    const existing = await this.masterDb.query(
      'SELECT id FROM tenants WHERE subdomain = $1',
      [dto.subdomain]
    );
    
    if (existing.rows.length > 0) {
      throw new ConflictException('Subdomain already taken');
    }
    
    // 2. Generate database credentials
    const dbName = `lms_tenant_${dto.subdomain}`;
    const dbUser = `tenant_${dto.subdomain}`;
    const dbPassword = this.generateSecurePassword();
    
    // 3. Create database from template
    await this.masterDb.query(
      `CREATE DATABASE ${dbName} TEMPLATE lms_tenant_template`
    );
    
    // 4. Create database user
    await this.masterDb.query(`
      CREATE USER ${dbUser} WITH PASSWORD '${dbPassword}';
      GRANT ALL PRIVILEGES ON DATABASE ${dbName} TO ${dbUser};
    `);
    
    // 5. Insert tenant record
    const tenant = await this.masterDb.query(`
      INSERT INTO tenants (
        name, subdomain, 
        db_host, db_port, db_name, db_user, db_password_encrypted,
        plan_id, status, trial_ends_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      dto.name,
      dto.subdomain,
      process.env.DB_HOST,
      5432,
      dbName,
      dbUser,
      await this.encrypt(dbPassword),
      dto.plan_id,
      'trial',
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    ]);
    
    // 6. Connect to tenant database and initialize
    const tenantConn = await this.getTenantConnection(tenant.rows[0].id);
    await tenantConn.query(`
      INSERT INTO organizations (name) VALUES ($1)
      RETURNING id
    `, [dto.name]);
    
    // 7. Create default admin user
    await this.createDefaultAdmin(tenantConn, dto.admin_email);
    
    return tenant.rows[0];
  }
  
  async deleteTenant(tenantId: string, force: boolean = false) {
    const tenant = await this.findTenant(tenantId);
    
    if (!force) {
      // Soft delete: update status
      await this.masterDb.query(
        'UPDATE tenants SET status = $1 WHERE id = $2',
        ['deleted', tenantId]
      );
    } else {
      // Hard delete: drop database
      await this.masterDb.query(`DROP DATABASE IF EXISTS ${tenant.db_name}`);
      await this.masterDb.query(`DROP USER IF EXISTS ${tenant.db_user}`);
      await this.masterDb.query('DELETE FROM tenants WHERE id = $1', [tenantId]);
    }
  }
}
```

---

## Part 5: Additional Production Standards

### 5.1 Observability

```typescript
// Structured logging
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'lms-api',
    version: process.env.APP_VERSION,
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: '/var/log/lms/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: '/var/log/lms/combined.log' 
    }),
  ],
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration_ms: duration,
      tenant_id: req.tenantId,
      user_id: req.user?.id,
      ip: req.ip,
      user_agent: req.get('user-agent'),
    });
  });
  
  next();
});
```

**Metrics (Prometheus format):**

```typescript
import prometheus from 'prom-client';

// Custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 1, 3, 5],
});

const activeTenants = new prometheus.Gauge({
  name: 'active_tenants_total',
  help: 'Number of active tenants',
});

const databaseConnections = new prometheus.Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections',
  labelNames: ['tenant_id'],
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
```

---

### 5.2 Health Checks

```typescript
// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
    checks: {
      database: 'unknown',
      redis: 'unknown',
      storage: 'unknown',
    },
  };
  
  try {
    // Check master database
    await masterDb.query('SELECT 1');
    health.checks.database = 'healthy';
  } catch (error) {
    health.checks.database = 'unhealthy';
    health.status = 'unhealthy';
  }
  
  try {
    // Check Redis
    await redis.ping();
    health.checks.redis = 'healthy';
  } catch (error) {
    health.checks.redis = 'unhealthy';
    health.status = 'degraded';
  }
  
  try {
    // Check object storage
    await storage.headBucket();
    health.checks.storage = 'healthy';
  } catch (error) {
    health.checks.storage = 'unhealthy';
    health.status = 'degraded';
  }
  
  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Readiness check (for load balancer)
app.get('/ready', async (req, res) => {
  // Only check critical dependencies
  try {
    await masterDb.query('SELECT 1');
    res.status(200).send('OK');
  } catch (error) {
    res.status(503).send('Not Ready');
  }
});
```

---

### 5.3 Backup & Disaster Recovery

```bash
#!/bin/bash
# /opt/lms/scripts/backup-master-db.sh

BACKUP_DIR="/opt/lms/backups/master"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Backup master database
pg_dump -h localhost -U lms_master -d lms_platform_master \
  -F c -b -v -f "${BACKUP_DIR}/master_${DATE}.dump"

# Compress
gzip "${BACKUP_DIR}/master_${DATE}.dump"

# Upload to S3 (optional)
aws s3 cp "${BACKUP_DIR}/master_${DATE}.dump.gz" \
  s3://lms-backups/master/ \
  --storage-class STANDARD_IA

# Cleanup old backups
find ${BACKUP_DIR} -name "master_*.dump.gz" -mtime +${RETENTION_DAYS} -delete

echo "Master database backup completed: master_${DATE}.dump.gz"
```

```bash
#!/bin/bash
# /opt/lms/scripts/backup-tenant-db.sh

TENANT_ID=$1
BACKUP_DIR="/opt/lms/backups/tenants"
DATE=$(date +%Y%m%d_%H%M%S)

if [ -z "$TENANT_ID" ]; then
  echo "Usage: $0 <tenant_id>"
  exit 1
fi

# Get tenant database info from master
DB_INFO=$(psql -h localhost -U lms_master -d lms_platform_master -t -A -c \
  "SELECT db_name FROM tenants WHERE id = '${TENANT_ID}'")

if [ -z "$DB_INFO" ]; then
  echo "Tenant not found: ${TENANT_ID}"
  exit 1
fi

# Backup tenant database
pg_dump -h localhost -U lms_master -d ${DB_INFO} \
  -F c -b -v -f "${BACKUP_DIR}/${TENANT_ID}_${DATE}.dump"

gzip "${BACKUP_DIR}/${TENANT_ID}_${DATE}.dump"

echo "Tenant database backup completed: ${TENANT_ID}_${DATE}.dump.gz"
```

**Automated backup via cron:**

```bash
# /etc/cron.d/lms-backup
# Backup master DB daily at 2 AM
0 2 * * * lms /opt/lms/scripts/backup-master-db.sh

# Backup all tenant DBs daily at 3 AM
0 3 * * * lms /opt/lms/scripts/backup-all-tenants.sh
```

---

### 5.4 Monitoring & Alerting

```yaml
# alerting-rules.yml (for Prometheus Alertmanager)
groups:
  - name: lms_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} requests/sec"
      
      - alert: DatabaseConnectionPoolExhausted
        expr: database_connections_active > 80
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Database connection pool nearly exhausted"
      
      - alert: DiskSpaceRunningOut
        expr: node_filesystem_avail_bytes{mountpoint="/opt/lms"} / node_filesystem_size_bytes < 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Disk space running out"
      
      - alert: ServiceDown
        expr: up{job="lms-api"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "LMS API is down"
```

---

### 5.5 Security Hardening

```typescript
// Security middleware
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // For Ant Design
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Login rate limiting (stricter)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});

app.use('/api/auth/login', loginLimiter);

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow tenant subdomains
    if (!origin || /\.lms-platform\.com$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

**SQL Injection Prevention:**

```typescript
// Always use parameterized queries
// ❌ BAD
const result = await db.query(
  `SELECT * FROM users WHERE email = '${email}'`
);

// ✅ GOOD
const result = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// Or use ORM (TypeORM, Prisma)
const user = await userRepository.findOne({ where: { email } });
```

**Sensitive Data Encryption:**

```typescript
import crypto from 'crypto';

class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key: Buffer;
  
  constructor() {
    this.key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  }
  
  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }
  
  decrypt(encrypted: string): string {
    const [ivHex, authTagHex, encryptedData] = encrypted.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

---

## Part 6: Testing Strategy

### 6.1 Test Coverage Targets

```yaml
Coverage Requirements:
  Unit Tests:
    overall: 80%
    critical_paths: 95%  # auth, billing, payroll, authorization
    
  Integration Tests:
    required_scenarios:
      - tenant_isolation
      - multi_branch_scope
      - payment_idempotency
      - webhook_replay_protection
      - payroll_lock_enforcement
      - parent_delegation
      
  E2E Tests:
    p1_user_stories: 100%
    smoke_tests: always run on deploy
    
  Performance Tests:
    load_test_scale:
      tenants: 50
      students_per_tenant: 2000
      concurrent_users: 500
    response_time_p95:
      list_endpoints: < 2s
      detail_endpoints: < 500ms
      mutations: < 1s
```

---

### 6.2 Example Test Structure

```typescript
// Unit test example
describe('TenantService', () => {
  let service: TenantService;
  let mockRepo: MockType<TenantRepository>;
  
  beforeEach(() => {
    mockRepo = createMock<TenantRepository>();
    service = new TenantService(mockRepo);
  });
  
  describe('createTenant', () => {
    it('should create tenant with valid subdomain', async () => {
      mockRepo.findBySubdomain.mockResolvedValue(null);
      
      const dto = {
        name: 'ACME Corp',
        subdomain: 'acme',
        admin_email: 'admin@acme.com',
      };
      
      const result = await service.createTenant(dto);
      
      expect(result).toHaveProperty('id');
      expect(result.subdomain).toBe('acme');
      expect(mockRepo.create).toHaveBeenCalled();
    });
    
    it('should reject duplicate subdomain', async () => {
      mockRepo.findBySubdomain.mockResolvedValue({ id: 'existing' });
      
      await expect(
        service.createTenant({ subdomain: 'acme', ... })
      ).rejects.toThrow(ConflictException);
    });
  });
});

// Integration test example
describe('Tenant Isolation (Integration)', () => {
  let app: INestApplication;
  let tenantA: Tenant;
  let tenantB: Tenant;
  
  beforeAll(async () => {
    app = await createTestApp();
    tenantA = await createTenant('tenant-a');
    tenantB = await createTenant('tenant-b');
  });
  
  it('should not allow cross-tenant data access', async () => {
    // Create class in tenant A
    const classA = await request(app.getHttpServer())
      .post('/api/classes')
      .set('Host', 'tenant-a.test.com')
      .set('Authorization', `Bearer ${tenantAToken}`)
      .send({ name: 'Class A' })
      .expect(201);
    
    // Try to access from tenant B
    await request(app.getHttpServer())
      .get(`/api/classes/${classA.body.id}`)
      .set('Host', 'tenant-b.test.com')
      .set('Authorization', `Bearer ${tenantBToken}`)
      .expect(404); // Should not find it
  });
});

// E2E test example
describe('Enrollment Flow (E2E)', () => {
  it('should complete full enrollment process', async () => {
    // 1. Create lead
    const lead = await page.goto('/contact');
    await page.fill('[name=name]', 'John Doe');
    await page.fill('[name=email]', 'john@example.com');
    await page.click('button:text("Submit")');
    await expect(page).toHaveText('Received');
    
    // 2. Consultant logs in
    await loginAsConsultant();
    await page.goto('/admission/leads');
    await page.click(`tr:has-text("John Doe")`);
    
    // 3. Assign assessment
    await page.click('button:text("Assign Assessment")');
    await page.selectOption('[name=assessment]', 'entrance-test');
    await page.click('button:text("Send")');
    
    // 4. Complete assessment (as lead)
    const assessmentLink = await getAssessmentLink('john@example.com');
    await page.goto(assessmentLink);
    await completeAssessment();
    
    // 5. Create enrollment
    await loginAsConsultant();
    await page.goto(`/admission/leads/${leadId}`);
    await page.click('button:text("Enroll")');
    await page.selectOption('[name=class]', 'beginner-english');
    await page.click('button:text("Confirm")');
    
    // 6. Verify invoice created
    await expect(page).toHaveText('Invoice created');
    await page.click('a:text("View Invoice")');
    await expect(page.locator('.invoice-total')).toContainText('5,000,000');
  });
});
```

---

## Part 7: Migration Path from Old Design

### 7.1 What to Keep

✅ **Keep from original:**
- Database-per-tenant strategy (excellent isolation)
- Outbox/Inbox pattern for integrations
- Audit logging approach
- Authorization scope model (organization → branch → student)
- Parent delegation concept
- AI governance with human review
- Native Linux deployment (no Docker)

---

### 7.2 What to Change

🔄 **Replace/Simplify:**
- ❌ shadcn/ui + Tailwind CSS 4 beta → ✅ Ant Design Pro (mature, complete)
- ❌ 3 separate shells → ✅ Unified app with role-based routing
- ❌ Theme preset versioning → ✅ Simple tenant theming
- ❌ Complex module manifest → ✅ Feature flags + tiered plans
- ❌ Next.js Server Components complexity → ✅ React SPA with SSR for public
- ❌ Manual systemd setup → ✅ CI/CD automation + health checks

---

### 7.3 Implementation Phases (Revised)

```yaml
Phase 1: Foundation (Weeks 1-3)
  - Setup monorepo structure
  - Configure TypeScript, ESLint, Prettier
  - Setup Vite build
  - Create master database schema
  - Create tenant database template
  - Implement tenant provisioning service
  - Setup CI/CD pipeline
  
Phase 2: Authentication & Multi-tenancy (Weeks 4-5)
  - Implement subdomain-based tenant resolution
  - JWT authentication
  - Role-based access control
  - Session management
  - Tenant database connection pooling
  
Phase 3: Admin Foundation (Weeks 6-8)
  - Setup Ant Design Pro
  - Create layout structure
  - Implement navigation system
  - Build common components (DataTable, FormBuilder, PageHeader)
  - Setup i18n
  - Implement theme system
  
Phase 4: Core Business Logic (Weeks 9-16)
  Priority order based on business value:
  
  4.1 Organization & Access (Week 9)
    - Organization management
    - Branch CRUD
    - User management
    - Role & permission assignment
    - Scope grants
  
  4.2 Academic Core (Weeks 10-11)
    - Department & Program management
    - Course & Class management
    - Student management
    - Enrollment flow
  
  4.3 Admission & CRM (Week 12)
    - Landing page CMS
    - Lead capture & routing
    - Consultation workflow
    
  4.4 Finance (Weeks 13-14)
    - Invoice management
    - Payment integration (Stripe/VNPay)
    - Payment webhook handling
    - Receipt generation
  
  4.5 Learning (Week 15)
    - Library/Content management
    - Student portal
    - Progress tracking
  
  4.6 HRM & Payroll (Week 16)
    - Employee management
    - Attendance tracking
    - Payroll calculation
    
Phase 5: Advanced Features (Weeks 17-20)
  - Assessment engine
  - English pathway
  - Online class integration
  - Parent delegation
  - Communication/notifications
  - AI assistance integration
  
Phase 6: Platform Admin (Week 21)
  - Tenant management UI
  - Plan & billing management
  - Usage tracking & reporting
  - Migration tools
  
Phase 7: Testing & Hardening (Weeks 22-24)
  - Complete test coverage
  - Security audit
  - Performance optimization
  - Load testing
  - Documentation
  
Phase 8: Deployment & Launch (Week 25)
  - Production setup
  - Monitoring & alerting
  - Backup & recovery procedures
  - Launch checklist
```

---

## Part 8: Cost & Resource Estimates

### 8.1 Infrastructure Costs (Monthly, USD)

```yaml
Small Scale (< 10 tenants, < 5k students):
  VPS/Cloud Server: $50-100
    - 4 vCPU, 8GB RAM, 160GB SSD
    - Debian/Ubuntu
  
  PostgreSQL (managed): $25-50
    - Or self-hosted on VPS
  
  Redis (managed): $10-20
    - Or self-hosted
  
  Object Storage: $5-20
    - 100GB storage + bandwidth
  
  Domain & SSL: $20/year
  
  Backup Storage: $10-30
  
  Total: ~$100-200/month

Medium Scale (10-50 tenants, 5k-25k students):
  Application Servers (2x): $200-300
    - Load balanced
  
  Database (managed): $100-200
    - Read replicas for reporting
  
  Redis (managed): $50-100
  
  Object Storage: $50-100
  
  CDN: $20-50
  
  Monitoring (Datadog/New Relic): $100-200
  
  Total: ~$500-950/month

Large Scale (50-200 tenants, 25k-100k students):
  Application Servers (4x): $600-800
  Database Cluster: $400-800
  Redis Cluster: $200-300
  Object Storage: $200-500
  CDN: $100-200
  Monitoring: $300-500
  
  Total: ~$1,800-3,100/month
```

---

### 8.2 Development Timeline

```
Full MVP (Phase 1-6): 21 weeks (~5 months)
With Testing & Launch: 25 weeks (~6 months)

Team composition:
  - 2 Full-stack developers
  - 1 DevOps engineer (part-time)
  - 1 QA engineer (part-time)
  - 1 Product owner

Cost estimate:
  Development: $80k-120k (depending on location)
  Infrastructure (staging): $500/month x 6 = $3k
  Tools & licenses: $2k
  
  Total: ~$85k-125k for MVP
```

---

## Part 9: Next Steps

### To proceed with this proposal:

1. **Review & Approve**
   - Review this architecture proposal
   - Provide feedback on any aspects
   - Approve to proceed with documentation updates

2. **Update Documentation**
   - Update `spec.md` (remove UI-specific requirements, add SaaS specifics)
   - Update `plan.md` (new stack, simplified architecture)
   - Update `data-model.md` (add master DB schema)
   - Rewrite `tasks.md` (new implementation phases)
   - Update `contracts/api-contracts.md`
   - Update `quickstart.md` (new validation scenarios)

3. **Create New Artifacts**
   - API specification (OpenAPI 3.0)
   - Database schema diagrams
   - Sequence diagrams for key flows
   - Deployment runbook
   - Security checklist

4. **Setup Development Environment**
   - Initialize monorepo
   - Setup development database
   - Create development tenant
   - Configure IDE & tooling

---

## Questions for Clarification

Before finalizing, please confirm:

1. **Business Model**: 
   - Self-service signup hoặc sales-led onboarding?
   - Pricing: per student, per teacher, hay flat rate?
   
2. **Scale Expectations**:
   - Target: bao nhiêu tenants trong 12 tháng đầu?
   - Average students per tenant?

3. **Integration Requirements**:
   - Payment gateway nào? (VNPay, Momo, Stripe?)
   - Meeting platform nào? (Zoom, Google Meet, MS Teams?)
   - Accounting software nào? (MISA, Fast, custom?)

4. **Compliance**:
   - Có yêu cầu compliance đặc biệt? (GDPR, Vietnam data residency?)
   - Có cần SOC 2 / ISO 27001?

5. **Team & Timeline**:
   - Team size hiện tại?
   - Target launch date?
   - MVP scope có thể giảm không?

---

**Status**: Awaiting feedback to proceed with documentation updates.
