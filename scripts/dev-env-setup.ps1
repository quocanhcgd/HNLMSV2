# ============================================================
# EduCenter LMS - Dev Environment Setup (Windows)
# Chạy script này MỘT LẦN để chuẩn bị máy lập trình:
#   - pnpm (quản lý package monorepo)
#   - Redis 7-compatible (Memurai Developer) cho BullMQ
#   - PostgreSQL: role + database 'educenter_lms' + schema + seed
#   - Execution policy cho phép chạy script npm (pnpm.ps1)
# Script tự nâng quyền Administrator nếu cần.
# ============================================================
#Requires -Version 5.1

$ErrorActionPreference = 'Stop'

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "   [OK] $msg" -ForegroundColor Green }
function Write-Warn($msg){ Write-Host "   [!] $msg" -ForegroundColor Yellow }

# ---------- 0. Self-elevate ----------
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Warn "Script chưa chạy với quyền Administrator - đang tự nâng quyền..."
    Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit
}

Write-Step "EduCenter LMS - Dev Environment Setup"
$start = Get-Date

# ---------- 1. Execution policy (user) ----------
Write-Step "Execution policy (RemoteSigned - CurrentUser)"
try {
    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
    Write-Ok "Set-ExecutionPolicy RemoteSigned (CurrentUser)"
} catch { Write-Warn "Không set được execution policy: $($_.Exception.Message)" }

# ---------- 2. Node + pnpm ----------
Write-Step "Node.js + pnpm"
$node = node --version
Write-Ok "Node $node (cần >= 20)"
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "   Đang cài pnpm (npm install -g pnpm@9)..."
    npm install -g pnpm@9 --no-fund --no-audit
    if ($LASTEXITCODE -ne 0) { throw "npm install -g pnpm thất bại (xem log phía trên)" }
}
Write-Ok "pnpm $(pnpm --version)"

# ---------- 3. Redis (Memurai Developer - Redis 7 compatible) ----------
Write-Step "Redis 7-compatible (Memurai Developer) cho BullMQ"
$memuraiSvc = Get-Service -Name 'Memurai' -ErrorAction SilentlyContinue
if (-not $memuraiSvc) {
    Write-Host "   Memurai chưa cài - cài qua Chocolatey (memurai-developer)..."
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) { throw "Không tìm thấy Chocolatey - cài https://chocolatey.org/install trước" }
    choco install memurai-developer -y --no-progress
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "memurai-developer thất bại - thử fallback redis-64 (Redis 5.0, chấp nhận cho dev, BullMQ có thể cần nâng cấp sau)..."
        choco install redis-64 -y --no-progress
    }
    Start-Sleep -Seconds 3
    $memuraiSvc = Get-Service -Name 'Memurai' -ErrorAction SilentlyContinue
    if (-not $memuraiSvc) { $memuraiSvc = Get-Service -Name 'Redis' -ErrorAction SilentlyContinue }
}
if ($memuraiSvc) {
    if ($memuraiSvc.Status -ne 'Running') { Start-Service $memuraiSvc.Name }
    Write-Ok "Service '$($memuraiSvc.Name)' đang chạy"
} else {
    Write-Warn "Chưa thấy service Redis/Memurai - kiểm tra thủ công sau bước này"
}

# ---------- 4. PostgreSQL: role + database + schema + seed ----------
Write-Step "PostgreSQL: role lms + database educenter_lms + schema + seed"
if (-not (Get-Command psql -ErrorAction SilentlyContinue)) { throw "Không tìm thấy psql - cài PostgreSQL 15/16 trước" }
Write-Ok "psql $(psql --version)"

$pgUser = Read-Host "   Superuser PostgreSQL (mặc định: postgres)" 
if ([string]::IsNullOrWhiteSpace($pgUser)) { $pgUser = 'postgres' }
$pgPass = Read-Host -AsSecureString "   Mật khẩu superuser '$pgUser'"
$pgPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPass))
if ([string]::IsNullOrEmpty($pgPassPlain)) { throw "Cần mật khẩu superuser PostgreSQL để tạo database" }

$lmsPass = Read-Host -AsSecureString "   Mật khẩu cho role dev 'lms' (Enter = mặc định 'lms_dev')"
$lmsPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($lmsPass))
if ([string]::IsNullOrEmpty($lmsPassPlain)) { $lmsPassPlain = 'lms_dev' }

$env:PGPASSWORD = $pgPassPlain
$root = Split-Path $PSScriptRoot -Parent
$schema = Join-Path $root 'database\lms-schema.sql'
$seed   = Join-Path $root 'database\lms-seed.sql'

# Role + database (idempotent)
$sql = @"
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'lms') THEN
    CREATE ROLE lms LOGIN PASSWORD '$lmsPassPlain';
  ELSE
    ALTER ROLE lms WITH LOGIN PASSWORD '$lmsPassPlain';
  END IF;
END \$\$;
"@
& psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -v ON_ERROR_STOP=1 -c $sql
if ($LASTEXITCODE -ne 0) { throw "Tạo role lms thất bại (sai mật khẩu superuser?)" }

$dbExists = & psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='educenter_lms'"
if ($dbExists.Trim() -ne '1') {
    & psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -c "CREATE DATABASE educenter_lms OWNER lms ENCODING 'UTF8' TEMPLATE template0"
    if ($LASTEXITCODE -ne 0) { throw "CREATE DATABASE thất bại" }
    Write-Ok "Đã tạo database educenter_lms (owner lms)"
} else {
    Write-Ok "Database educenter_lms đã tồn tại"
}

# Extension + schema + seed (chạy với role lms)
$env:PGPASSWORD = $lmsPassPlain
& psql -U lms -h 127.0.0.1 -p 5432 -d educenter_lms -v ON_ERROR_STOP=1 -f $schema
if ($LASTEXITCODE -ne 0) { throw "Lỗi khi chạy lms-schema.sql" }
& psql -U lms -h 127.0.0.1 -p 5432 -d educenter_lms -v ON_ERROR_STOP=1 -f $seed
if ($LASTEXITCODE -ne 0) { throw "Lỗi khi chạy lms-seed.sql" }
Write-Ok "Schema + seed đã nạp vào educenter_lms"
Remove-Item Env:PGPASSWORD

# ---------- 5. Verify ----------
Write-Step "Verification"
function Verify($label, [scriptblock]$block) {
    try { & $block | Out-Null; Write-Ok $label } catch { Write-Warn "$label - LỖI: $($_.Exception.Message)" }
}
Verify "Node $(node --version)"        { node --version }
Verify "pnpm $(pnpm --version)"        { pnpm --version }
Verify "redis-cli ping"                { if (Get-Command redis-cli -ErrorAction SilentlyContinue) { redis-cli ping } elseif (Get-Command memurai-cli -ErrorAction SilentlyContinue) { memurai-cli ping } else { throw 'no redis-cli/memurai-cli' } }
$env:PGPASSWORD = $lmsPassPlain
Verify "psql -U lms -d educenter_lms SELECT 1" { & psql -U lms -h 127.0.0.1 -p 5432 -d educenter_lms -tAc "SELECT 1" }
Remove-Item Env:PGPASSWORD

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host " HOÀN TẤT sau $([int]((Get-Date)-$start).TotalSeconds)s" -ForegroundColor Green
Write-Host " - kết nối DB:  postgresql://lms:<pass>@127.0.0.1:5432/educenter_lms" -ForegroundColor White
Write-Host " - Redis:       127.0.0.1:6379 (service Memurai/Redis)" -ForegroundColor White
Write-Host " - Bước kế:     pnpm i && pnpm --filter api start:dev" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
