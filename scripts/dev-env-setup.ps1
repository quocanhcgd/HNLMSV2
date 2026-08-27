# ============================================================
# EduCenter LMS - Dev Environment Setup (Windows)
# Chạy script này MỘT LẦN để chuẩn bị máy lập trình:
#   - pnpm (quản lý package monorepo)
#   - Redis 7-compatible (Memurai Developer) cho BullMQ
#   - PostgreSQL: role + database 'educ_lms' + schema + seed
#     (tự đổi tên DB cũ 'educenter_lms' -> 'educ_lms' nếu còn tồn tại)
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
Write-Step "PostgreSQL: role lms + database educ_lms + schema + seed"
if (-not (Get-Command psql -ErrorAction SilentlyContinue)) { throw "Không tìm thấy psql - cài PostgreSQL 15/16 trước" }
Write-Ok "psql $(psql --version)"

$pgUser = Read-Host "   Superuser PostgreSQL (mặc định: postgres)" 
if ([string]::IsNullOrWhiteSpace($pgUser)) { $pgUser = 'postgres' }
$pgPassPlain = $null
for ($attempt = 1; $attempt -le 3 -and -not $pgPassPlain; $attempt++) {
    $pgPass = Read-Host -AsSecureString "   Mật khẩu superuser '$pgUser' (lần $attempt/3)"
    $pgPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPass))
    if ([string]::IsNullOrEmpty($pgPassPlain)) { Write-Warn "Mật khẩu trống - thử lại"; $pgPassPlain = $null; continue }
    $env:PGPASSWORD = $pgPassPlain
    $test = & psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -tAc "SELECT 1" 2>&1
    if ($LASTEXITCODE -eq 0 -and "$test".Trim() -eq '1') { Write-Ok "Kết nối PostgreSQL OK (user $pgUser, port 5432)"; break }
    $detail = ($test -join ' ').Trim()
    if ($detail.Length -gt 220) { $detail = $detail.Substring(0, 220) + '...' }
    Write-Warn "Kết nối thất bại. Chi tiết: $detail"
    $pgPassPlain = $null
}
if (-not $pgPassPlain) { throw "Không kết nối được PostgreSQL - kiểm tra mật khẩu, port 5432 và service postgresql-x64-16 (xem lỗi psql phía trên)" }

$lmsPass = Read-Host -AsSecureString "   Mật khẩu cho role dev 'lms' (Enter = mặc định 'lms_dev')"
$lmsPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($lmsPass))
if ([string]::IsNullOrEmpty($lmsPassPlain)) { $lmsPassPlain = 'lms_dev' }

$env:PGPASSWORD = $pgPassPlain
$root = Split-Path $PSScriptRoot -Parent
$schema = Join-Path $root 'database\lms-schema.sql'
$seed   = Join-Path $root 'database\lms-seed.sql'

# Role + database (idempotent) — placeholder được thay bằng mật khẩu đã escape (không dùng biến psql :'var', tránh lỗi nội suy)
$sql = @'
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'lms') THEN
    CREATE ROLE lms LOGIN PASSWORD '__LMS_PASS__';
  ELSE
    ALTER ROLE lms WITH LOGIN PASSWORD '__LMS_PASS__';
  END IF;
END $$;
'@.Replace('__LMS_PASS__', $lmsPassPlain.Replace("'", "''"))
& psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -v ON_ERROR_STOP=1 -c $sql
if ($LASTEXITCODE -ne 0) { throw "Tạo role lms thất bại - xem lỗi psql phía trên (bước kết nối superuser đã OK nên không phải lỗi mật khẩu)" }

$dbExists = "$(& psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='educ_lms'")".Trim()
$legacyExists = "$(& psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='educenter_lms'")".Trim()
if ($dbExists -ne '1' -and $legacyExists -eq '1') {
    Write-Warn "Phát hiện DB cũ 'educenter_lms' (từ bản script trước) - đang đổi tên thành 'educ_lms'..."
    & psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='educenter_lms' AND pid <> pg_backend_pid();" | Out-Null
    & psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -v ON_ERROR_STOP=1 -c "ALTER DATABASE educenter_lms RENAME TO educ_lms;"
    if ($LASTEXITCODE -ne 0) { throw "Đổi tên DB cũ thất bại - đóng các kết nối pgAdmin/psql tới educenter_lms rồi chạy lại" }
    Write-Ok "Đã đổi tên educenter_lms -> educ_lms"
    $dbExists = '1'
}
if ($dbExists -ne '1') {
    & psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -c "CREATE DATABASE educ_lms OWNER lms ENCODING 'UTF8' TEMPLATE template0"
    if ($LASTEXITCODE -ne 0) { throw "CREATE DATABASE thất bại" }
    Write-Ok "Đã tạo database educ_lms (owner lms)"
} else {
    Write-Ok "Database educ_lms đã tồn tại"
}

# Đảm bảo role lms là owner của DB/schema/bảng (tránh 'permission denied to create extension'
# khi DB được tạo trước đó bởi user khác - ví dụ tạo tay qua pgAdmin/createdb)
& psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -c "ALTER DATABASE educ_lms OWNER TO lms;" | Out-Null
& psql -U $pgUser -h 127.0.0.1 -p 5432 -d educ_lms -c "ALTER SCHEMA public OWNER TO lms;" | Out-Null
$ownSql = @'
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I OWNER TO lms', r.tablename);
  END LOOP;
END $$;
'@
& psql -U $pgUser -h 127.0.0.1 -p 5432 -d educ_lms -c $ownSql | Out-Null
Write-Ok "Đã chuyển quyền sở hữu educ_lms (DB + schema public + bảng) sang role lms"

# Extension + schema + seed (chạy với role lms)
$env:PGPASSWORD = $lmsPassPlain
$hasSchema = "$(& psql -U lms -h 127.0.0.1 -p 5432 -d educ_lms -tAc "SELECT to_regclass('public.users')")".Trim()
$seedRows = '0'
if ($hasSchema -ne '') { $seedRows = "$(& psql -U lms -h 127.0.0.1 -p 5432 -d educ_lms -tAc "SELECT count(*) FROM lessons")".Trim() }
if ($hasSchema -eq '') {
    & psql -U lms -h 127.0.0.1 -p 5432 -d educ_lms -v ON_ERROR_STOP=1 -f $schema
    if ($LASTEXITCODE -ne 0) { throw "Lỗi khi chạy lms-schema.sql" }
    & psql -U lms -h 127.0.0.1 -p 5432 -d educ_lms -v ON_ERROR_STOP=1 -f $seed
    if ($LASTEXITCODE -ne 0) { throw "Lỗi khi chạy lms-seed.sql" }
    Write-Ok "Schema + seed đã nạp vào educ_lms"
} elseif ($seedRows -eq '0') {
    Write-Warn "Phát hiện seed dở dang (schema có nhưng bảng lessons trống) - tạo lại database sạch để nạp đầy đủ..."
    $env:PGPASSWORD = $pgPassPlain
    & psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='educ_lms' AND pid <> pg_backend_pid();" | Out-Null
    & psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -v ON_ERROR_STOP=1 -c "DROP DATABASE educ_lms;"
    & psql -U $pgUser -h 127.0.0.1 -p 5432 -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE educ_lms OWNER lms ENCODING 'UTF8' TEMPLATE template0"
    if ($LASTEXITCODE -ne 0) { throw "Tạo lại database thất bại" }
    $env:PGPASSWORD = $lmsPassPlain
    & psql -U lms -h 127.0.0.1 -p 5432 -d educ_lms -v ON_ERROR_STOP=1 -f $schema
    if ($LASTEXITCODE -ne 0) { throw "Lỗi khi chạy lms-schema.sql (sau khi tạo lại)" }
    & psql -U lms -h 127.0.0.1 -p 5432 -d educ_lms -v ON_ERROR_STOP=1 -f $seed
    if ($LASTEXITCODE -ne 0) { throw "Lỗi khi chạy lms-seed.sql (sau khi tạo lại)" }
    Write-Ok "Đã tạo lại educ_lms sạch + nạp schema + seed đầy đủ"
} else {
    Write-Ok "Schema + seed đã tồn tại - bỏ qua (muốn nạp lại từ đầu: DROP DATABASE educ_lms rồi chạy lại script)"
}
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
Verify "psql -U lms -d educ_lms SELECT 1" { & psql -U lms -h 127.0.0.1 -p 5432 -d educ_lms -tAc "SELECT 1" }
Remove-Item Env:PGPASSWORD

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host " HOÀN TẤT sau $([int]((Get-Date)-$start).TotalSeconds)s" -ForegroundColor Green
Write-Host " - kết nối DB:  postgresql://lms:<pass>@127.0.0.1:5432/educ_lms" -ForegroundColor White
Write-Host " - Redis:       127.0.0.1:6379 (service Memurai/Redis)" -ForegroundColor White
Write-Host " - Bước kế:     pnpm install && pnpm dev  (web 5173, api 4000, worker)" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
