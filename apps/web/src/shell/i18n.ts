/**
 * i18n cho AppShell + Dashboard — dict PORT NGUYÊN VẸN từ docs/13-mockups/02-admin-dashboard.html
 * (lines 219-280). Lang mặc định theo localStorage `ec-lang` (vi), đồng bộ data-i18n của mockup.
 */
export interface AdminDict {
  org_name: string;
  grp_admin: string; grp_biz: string; grp_addon: string;
  nav_dashboard: string; nav_org: string; nav_license: string;
  nav_users: string; nav_academic: string; nav_enroll: string;
  nav_finance: string; nav_reports: string; nav_crm: string; nav_hrm: string;
  not_activated: string;
  user_name: string; user_role: string;
  user_profile: string; user_settings: string; user_password: string; user_logout: string;
  all_branches: string; br_hn: string; br_hcm: string;
  page_dash: string; page_sub: string;
  kpi_students: string; kpi_classes: string; kpi_revenue: string; kpi_debt: string;
  tr_students: string; tr_classes: string; tr_revenue: string; tr_debt: string;
  ch_enroll: string; ch_year: string;
  m: string[];
  don_title: string; don_total: string;
  don_vnpay: string; don_cash: string; don_bank: string; don_momo: string;
  rec_title: string; rec_all: string;
  col_student: string; col_class: string; col_branch: string; col_fee: string; col_status: string;
  st_pending: string; st_paid: string;
  al_title: string;
  al_overdue: string; al_overdue_sub: string;
  al_addon: string; al_addon_sub: string;
  al_storage: string; al_storage_sub: string;
  al_class: string; al_class_sub: string;
  qa_title: string; qa_enroll: string; qa_class: string; qa_fee: string; qa_report: string;
  toast_notif: string; toast_view_all: string; toast_demo: string; toast_switch: string;
}

export const I18N: Record<'vi' | 'en', AdminDict> = {
  vi: {
    org_name: 'Trung tâm Ngoại ngữ ABC',
    grp_admin: 'Quản trị', grp_biz: 'Nghiệp vụ', grp_addon: 'Addon',
    nav_dashboard: 'Dashboard', nav_org: 'Tổ chức & Chi nhánh', nav_license: 'License',
    nav_users: 'Người dùng & Vai trò', nav_academic: 'Đào tạo', nav_enroll: 'Học viên & Ghi danh',
    nav_finance: 'Tài chính', nav_reports: 'Báo cáo', nav_crm: 'Tuyển sinh & CRM', nav_hrm: 'Nhân sự & Lương',
    not_activated: 'Chưa kích hoạt',
    user_name: 'Nguyễn Văn Admin', user_role: 'Organization Admin',
    user_profile: 'Hồ sơ', user_settings: 'Cài đặt', user_password: 'Đổi mật khẩu', user_logout: 'Đăng xuất',
    all_branches: 'Tất cả chi nhánh', br_hn: 'Chi nhánh Hà Nội', br_hcm: 'Chi nhánh TP.HCM',
    page_dash: 'Dashboard', page_sub: 'Tổng quan hoạt động toàn tổ chức',
    kpi_students: 'Học viên đang theo học', kpi_classes: 'Lớp đang mở', kpi_revenue: 'Doanh thu tháng này', kpi_debt: 'Công nợ phải thu',
    tr_students: '▲ 8,2% so với tháng trước', tr_classes: '▲ 3 lớp mới tuần này',
    tr_revenue: '▲ 12,4% (mục tiêu 1,3 tỷ)', tr_debt: '▼ 5 hóa đơn quá hạn > 30 ngày',
    ch_enroll: '📈 Ghi danh theo tháng', ch_year: 'Năm 2026',
    m: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'T1'],
    don_title: '💳 Doanh thu theo phương thức', don_total: 'tổng thu',
    don_vnpay: 'VNPay — 62%', don_cash: 'Tiền mặt — 22%', don_bank: 'Chuyển khoản — 13%', don_momo: 'MoMo — 3%',
    rec_title: '🆕 Ghi danh gần đây', rec_all: 'Xem tất cả →',
    col_student: 'Học viên', col_class: 'Lớp', col_branch: 'Chi nhánh', col_fee: 'Học phí', col_status: 'Trạng thái',
    st_pending: 'Chờ thanh toán', st_paid: '● Đã thanh toán',
    al_title: '⚠️ Cần xử lý',
    al_overdue: '🔴 5 hóa đơn quá hạn > 30 ngày', al_overdue_sub: 'Tổng 18,6 triệu ₫ — kiểm tra tại Tài chính',
    al_addon: '🟠 Addon "Đánh giá & Kiểm tra" hết hạn sau 12 ngày', al_addon_sub: 'Gia hạn serial để tránh chuyển read-only',
    al_storage: '🔵 Lưu trữ đạt 34% (34/100 GB)', al_storage_sub: 'Không cần xử lý ngay',
    al_class: '🔵 3 lớp sắp hết chỗ', al_class_sub: 'Lớp EN-B1-26 còn 2/20 chỗ',
    qa_title: '⚡ Thao tác nhanh', qa_enroll: 'Ghi danh học viên', qa_class: 'Tạo lớp mới', qa_fee: 'Thu học phí', qa_report: 'Báo cáo doanh thu',
    toast_notif: 'Demo: 3 thông báo chưa đọc', toast_view_all: 'Demo: đi tới màn hình Ghi danh (US4)',
    toast_demo: 'Demo: ', toast_switch: 'Đã chuyển phạm vi dữ liệu sang: ',
  },
  en: {
    org_name: 'ABC Language Center',
    grp_admin: 'Administration', grp_biz: 'Operations', grp_addon: 'Addons',
    nav_dashboard: 'Dashboard', nav_org: 'Organization & Branches', nav_license: 'License',
    nav_users: 'Users & Roles', nav_academic: 'Academic', nav_enroll: 'Students & Enrollment',
    nav_finance: 'Finance', nav_reports: 'Reports', nav_crm: 'Admissions & CRM', nav_hrm: 'HR & Payroll',
    not_activated: 'Not activated',
    user_name: 'Nguyen Van Admin', user_role: 'Organization Admin',
    user_profile: 'Profile', user_settings: 'Settings', user_password: 'Change password', user_logout: 'Log out',
    all_branches: 'All branches', br_hn: 'Hanoi branch', br_hcm: 'HCMC branch',
    page_dash: 'Dashboard', page_sub: 'Org-wide activity overview',
    kpi_students: 'Active students', kpi_classes: 'Open classes', kpi_revenue: 'Revenue this month', kpi_debt: 'Receivables',
    tr_students: '▲ 8.2% vs last month', tr_classes: '▲ 3 new classes this week',
    tr_revenue: '▲ 12.4% (target 1.3B)', tr_debt: '▼ 5 invoices overdue > 30 days',
    ch_enroll: '📈 Monthly enrollment', ch_year: 'Year 2026',
    m: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    don_title: '💳 Revenue by payment method', don_total: 'collected',
    don_vnpay: 'VNPay — 62%', don_cash: 'Cash — 22%', don_bank: 'Bank transfer — 13%', don_momo: 'MoMo — 3%',
    rec_title: '🆕 Recent enrollments', rec_all: 'View all →',
    col_student: 'Student', col_class: 'Class', col_branch: 'Branch', col_fee: 'Tuition', col_status: 'Status',
    st_pending: 'Pending payment', st_paid: '● Paid',
    al_title: '⚠️ Needs attention',
    al_overdue: '🔴 5 invoices overdue > 30 days', al_overdue_sub: 'Total 18.6M VND — check Finance',
    al_addon: '🟠 Addon "Assessment & Testing" expires in 12 days', al_addon_sub: 'Renew serial to avoid read-only mode',
    al_storage: '🔵 Storage at 34% (34/100 GB)', al_storage_sub: 'No action needed',
    al_class: '🔵 3 classes almost full', al_class_sub: 'Class EN-B1-26 has 2/20 slots left',
    qa_title: '⚡ Quick actions', qa_enroll: 'Enroll student', qa_class: 'New class', qa_fee: 'Collect tuition', qa_report: 'Revenue report',
    toast_notif: 'Demo: 3 unread notifications', toast_view_all: 'Demo: go to Enrollment screen (US4)',
    toast_demo: 'Demo: ', toast_switch: 'Data scope switched to: ',
  },
};
