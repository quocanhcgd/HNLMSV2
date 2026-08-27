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
  // --- License screen (mockup 01 appScreen) ---
  crumb_settings: string; page_license: string; page_sub_lic: string;
  lic_title: string; lic_status: string; lic_active: string; lic_id: string; lic_type: string;
  lic_perpetual: string; lic_support: string; lic_signature: string; lic_valid: string; lic_activated: string;
  btn_relicense: string; btn_addon: string;
  con_title: string; con_students: string; con_branches: string; con_storage: string; ok: string;
  addon_title: string; col_addon: string; col_expiry: string; col_action: string;
  addon_crm: string; addon_crm_desc: string; addon_assess: string; addon_assess_desc: string;
  addon_online: string; addon_online_desc: string; addon_hrm: string; addon_hrm_desc: string; addon_note: string;
  modal_addon_title: string; serial_key: string; serial_ph: string;
  opt_crm_price: string; opt_assess_price: string; opt_online_price: string; opt_hrm_price: string;
  cancel: string; activate: string;
  modal_relic_title: string; dropzone_title: string; dropzone_sub: string; upload_none: string; apply_btn: string;
  status_updated: string; lic_v2: string; max_students: string; max_branches: string;
  activated_badge: string; dash: string;
  toast_serial: string; toast_serial_ok: string; toast_upload_ok: string; toast_applied: string;
  upload_progress: string; upload_done: string; verifying: string;
  // --- Users & Roles screen (mockup 03) ---
  page_sub_users: string;
  tab_users: string; tab_roles: string; ph_search: string;
  role_all: string; role_oa: string; role_bm: string; role_t: string; role_s: string; role_fo: string; role_am: string;
  role_sa: string; role_ac: string;
  br_all: string; st_all: string; st_active: string; st_locked: string; btn_new_user: string;
  col_user: string; col_role: string; col_scope: string; col_last: string; col_actions: string;
  st_ok: string; st_off: string; btn_details: string; btn_scope: string;
  scope_all: string; scope_hn_classes: string; scope_hcm_classes: string; total_label: string; audit_note: string;
  role_oa_d: string; role_bm_d: string; role_am_d: string; role_t_d: string; role_fo_d: string; role_s_d: string;
  role_sa_d: string; role_ac_d: string;
  scope_txt: string; scope_br: string; scope_acad: string; scope_teach: string; scope_fin: string; scope_study: string;
  scope_tech: string; addon_tag: string;
  grp_org: string; grp_users: string; grp_acad: string; grp_fin: string; grp_lic: string;
  undo: string; save: string; perm_note: string;
  modal_new_user: string; f_name: string; f_email: string; f_pass: string; f_branch: string; ph_name: string;
  f_roles: string; hint_multi_role: string;
  f_scope: string; scope_branch_hn: string; scope_classes: string; scope_students: string; hint_scope: string;
  create: string;
  modal_scope: string; scope_type: string; scope_branch: string; scope_class: string; scope_student: string;
  scope_object: string; from: string; to: string; f_reason: string; ph_reason: string; grant: string;
  toast_reset: string; toast_saved: string; toast_created: string; toast_scope_granted: string;
  // --- Reports screen (mockup 04) ---
  page_sub_reports: string;
  t0: string; t0d: string; t1: string; t1d: string; t2: string; t2d: string; t3: string; t3d: string;
  p_title: string; fmt_xlsx: string; fmt_pdf: string; fmt_csv: string; btn_create: string; p_note: string;
  jobs_title: string; jobs_empty: string; st_processing: string; st_done: string; btn_download: string;
  sample: string; export_xlsx: string; export_pdf: string;
  h0: string[]; h1: string[]; h2: string[]; h3: string[];
  s_good: string; s_full: string; s_open: string; s_normal: string; s_low: string; s_med: string; s_high: string;
  r0: string; r1: string; r2: string; r3: string; r4: string; r5: string; r6: string; r7: string;
  r8: string; r9: string; r10: string; r11: string; r12: string; r13: string;
  period: string; period2: string;
  toast_queued: string; toast_queued2: string; toast_ready: string; toast_ready2: string;
  toast_export: string; toast_download: string;
  // --- Org & Branches screen (T030/T031 — mockup 02 nav_org) ---
  page_sub_org: string;
  tab_org: string; tab_branches: string;
  f_org_name: string; f_timezone: string; f_academic_period: string;
  org_slug: string; org_currency: string;
  toast_org_saved: string;
  br_code: string; br_name: string; br_address: string; br_status: string;
  br_active: string; br_archived: string;
  btn_add_branch: string; btn_edit: string; btn_archive: string;
  modal_add_branch: string; modal_edit_branch: string;
  ph_branch_code: string; ph_branch_name: string; ph_branch_addr: string;
  toast_branch_created: string; toast_branch_updated: string; toast_branch_archived: string;
  no_branches: string; col_code: string;
  confirm_archive: string; toast_failed: string; loading: string;
  // --- T030/T031 extension: manager cột + select ---
  br_manager: string; f_manager: string; opt_no_manager: string; select_branch: string;
  // --- T035 wiring: Users & Roles thật ---
  total_users: string;
  det_title: string; det_phone: string; det_created: string; det_roles: string; det_scopes: string;
  no_scopes: string; btn_revoke: string; btn_save_roles: string;
  toast_role_saved: string; toast_roles_updated: string; toast_scope_removed: string; toast_scope_future: string;
  grp_sys: string;
  // --- T030/T031 mở rộng: khai báo đầy đủ org/branch ---
  grp_general: string; grp_contact: string; grp_bank: string; grp_brand: string;
  f_short_name: string; f_tax_code: string; f_license_no: string; f_representative: string; f_founded_at: string;
  f_address: string; f_phone: string; f_hotline: string; f_website: string; f_fax: string;
  f_bank_name: string; f_bank_account: string; f_bank_holder: string;
  f_logo_url: string; f_slogan: string; f_brand_color: string;
  f_opened_at: string; f_closed_at: string; f_note: string;
  col_contact: string; col_opened: string;
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
    // License screen (mockup 01)
    crumb_settings: 'Cài đặt', page_license: 'License & Kích hoạt',
    page_sub_lic: 'Trạng thái license, ràng buộc và addon',
    lic_title: '🔑 Trạng thái License',
    lic_status: 'Trạng thái', lic_active: '● Hoạt động', lic_id: 'License ID', lic_type: 'Loại license',
    lic_perpetual: 'Perpetual (vĩnh viễn)', lic_support: 'Hỗ trợ đến', lic_signature: 'Chữ ký',
    lic_valid: 'Hợp lệ (RSA-2048)', lic_activated: 'Ngày kích hoạt',
    btn_relicense: 'Cập nhật license mới', btn_addon: 'Kích hoạt addon',
    con_title: '📏 Ràng buộc (Constraints)', con_students: 'Học viên tối đa', con_branches: 'Chi nhánh tối đa', con_storage: 'Lưu trữ (GB)', ok: 'OK',
    addon_title: '🧩 Addons', col_addon: 'Addon', col_expiry: 'Hết hạn', col_action: 'Thao tác',
    addon_crm: 'Tuyển sinh & CRM', addon_crm_desc: 'Landing, lead, tư vấn',
    addon_assess: 'Đánh giá & Kiểm tra', addon_assess_desc: 'Thi đầu vào, mock test',
    addon_online: 'Lớp học Online', addon_online_desc: 'Zoom / Meet / Teams',
    addon_hrm: 'Nhân sự & Lương', addon_hrm_desc: 'Chấm công, payroll',
    addon_note: 'ℹ️ Addon hết hạn sẽ vào grace period 30 ngày (read-only), sau đó tự động tắt — dữ liệu không bị xóa.',
    modal_addon_title: 'Kích hoạt Addon', serial_key: 'Serial key', serial_ph: 'CRM-XXXX-XXXX-XXXX-XXXX',
    opt_crm_price: 'Tuyển sinh & CRM — 500$/năm', opt_assess_price: 'Đánh giá & Kiểm tra — 600$/năm',
    opt_online_price: 'Lớp học Online — 400$/năm', opt_hrm_price: 'Nhân sự & Lương — 800$/năm',
    cancel: 'Hủy', activate: 'Kích hoạt',
    modal_relic_title: 'Cập nhật License', dropzone_title: 'Kéo thả license file (.json) hoặc bấm để chọn',
    dropzone_sub: 'Hệ thống xác minh chữ ký offline — không gửi dữ liệu ra ngoài',
    upload_none: 'Chưa có file được chọn', apply_btn: 'Xác minh & áp dụng',
    status_updated: '● Hoạt động (đã cập nhật)', lic_v2: 'LIC-2026-001-ABC-EDU (v2)',
    max_students: 'Học viên tối đa', max_branches: 'Chi nhánh tối đa',
    activated_badge: 'Đã kích hoạt', dash: '—',
    toast_serial: 'Vui lòng nhập serial key (demo: CRM-A1B2-C3D4-E5F6-G7H8)',
    toast_serial_ok: '✅ Addon "Tuyển sinh & CRM" kích hoạt thành công',
    toast_upload_ok: 'Tải license thành công — chữ ký hợp lệ',
    toast_applied: '✅ License mới đã áp dụng — constraints được nâng cấp',
    upload_progress: 'Đang tải file license-abc-edu-2026.json (1.2 KB)...',
    upload_done: '✅ File hợp lệ — license-abc-edu-2026.json (chữ ký RSA-2048 OK)',
    verifying: 'Đang xác minh chữ ký & áp dụng constraints...',
    // Users & Roles (mockup 03)
    page_sub_users: 'Quản lý tài khoản, phân quyền theo module và scope chi nhánh',
    tab_users: '👤 Người dùng (42)', tab_roles: '🛡️ Vai trò & Quyền',
    ph_search: '🔍 Tìm theo tên / email...',
    role_all: 'Vai trò: Tất cả', role_oa: 'Organization Admin', role_bm: 'Branch Manager', role_t: 'Teacher',
    role_s: 'Student', role_fo: 'Finance Officer', role_am: 'Academic Manager',
    role_sa: 'System Admin', role_ac: 'Admission Consultant',
    br_all: 'Chi nhánh: Tất cả', st_all: 'Trạng thái: Tất cả', st_active: 'Hoạt động', st_locked: 'Khóa',
    btn_new_user: 'Tạo người dùng',
    col_user: 'Người dùng', col_role: 'Vai trò', col_scope: 'Chi nhánh (scope)',
    col_last: 'Đăng nhập gần nhất', col_actions: 'Thao tác',
    st_ok: '● Hoạt động', st_off: 'Đã khóa',
    btn_details: 'Chi tiết', btn_scope: 'Cấp scope',
    scope_all: 'Tất cả chi nhánh', scope_hn_classes: 'Hà Nội — lớp: EN-B1-26',
    scope_hcm_classes: 'TP.HCM — lớp: IT-Python-09, EN-B1-26',
    total_label: 'Tổng 42 người dùng',
    audit_note: '🔒 Mọi thay đổi vai trò / scope đều được ghi vào audit log (giữ 7 năm — NFR-011).',
    role_oa_d: 'Tất cả quyền trên toàn hệ thống', role_bm_d: 'Quyền trong chi nhánh được gán',
    role_am_d: 'Chương trình, lớp, lịch học', role_t_d: 'Lớp được phân công',
    role_fo_d: 'Hóa đơn, thanh toán, báo cáo', role_s_d: 'Lớp của mình, tiến độ',
    role_sa_d: 'Hạ tầng kỹ thuật', role_ac_d: 'Addon CRM — chưa kích hoạt',
    scope_txt: 'Toàn bộ chi nhánh', scope_br: 'Phạm vi chi nhánh', scope_acad: 'Đào tạo', scope_teach: 'Giảng dạy',
    scope_fin: 'Tài chính theo branch', scope_study: 'Học tập', scope_tech: 'Kỹ thuật', addon_tag: 'addon',
    grp_org: '🏢 Organization', grp_users: '👥 Users', grp_acad: '📚 Academic', grp_fin: '💰 Finance', grp_lic: '🔑 License',
    undo: 'Hoàn tác', save: 'Lưu thay đổi', perm_note: 'ℹ️ Bấm vào quyền để bật/tắt (demo). Vai trò hệ thống (Organization Admin) không cho bỏ quyền lõi.',
    modal_new_user: '+ Tạo người dùng', f_name: 'Họ tên *', f_email: 'Email *', f_pass: 'Mật khẩu tạm *', f_branch: 'Chi nhánh *',
    ph_name: 'Nguyễn Văn A', f_roles: 'Vai trò *',
    hint_multi_role: 'Có thể chọn nhiều vai trò. Vai trò addon (CRM, HRM) chỉ xuất hiện khi addon được kích hoạt.',
    f_scope: 'Phạm vi truy cập (scope)',
    scope_branch_hn: 'Toàn chi nhánh: Hà Nội', scope_classes: 'Chỉ lớp được chỉ định', scope_students: 'Chỉ học viên được chỉ định',
    hint_scope: 'Backend sẽ kiểm tra scope trên mọi read/write/export — không chỉ ẩn menu (FR-004).',
    create: 'Tạo người dùng',
    modal_scope: '📌 Cấp phạm vi truy cập — Lê Văn Giang',
    scope_type: 'Loại scope', scope_branch: 'Chi nhánh', scope_class: 'Lớp học', scope_student: 'Học viên cụ thể',
    scope_object: 'Đối tượng', from: 'Hiệu lực từ', to: 'Hiệu lực đến', f_reason: 'Lý do (audit)', ph_reason: 'Chuyển công tác, quản lý thêm chi nhánh...', grant: 'Cấp scope',
    toast_reset: 'Đã khôi phục thay đổi', toast_saved: '✅ Đã lưu quyền cho vai trò — audit event được tạo',
    toast_created: '✅ Đã tạo người dùng',
    toast_scope_granted: '✅ Đã cấp scope truy cập — hiệu lực và được ghi audit',
    // Reports (mockup 04)
    page_sub_reports: 'Tạo và tải báo cáo theo chi nhánh (chạy bất đồng bộ)',
    t0: '📝 Tổng hợp ghi danh', t0d: 'Số học viên ghi danh theo chương trình / tháng / chi nhánh',
    t1: '💰 Doanh thu theo chi nhánh', t1d: 'Doanh thu, phương thức thanh toán, công nợ',
    t2: '📊 Công suất lớp học', t2d: 'Tỷ lệ lấp đầy lớp, giảng viên, phòng',
    t3: '🎓 Tiến độ học viên', t3d: 'Tiến độ % theo lớp, rủi ro bỏ học',
    p_title: '⚙️ Tham số báo cáo', fmt_xlsx: 'Excel (.xlsx)', fmt_pdf: 'PDF', fmt_csv: 'CSV',
    btn_create: 'Tạo báo cáo',
    p_note: 'Báo cáo chạy bất đồng bộ qua worker — bạn có thể rời trang, sẽ nhận thông báo khi hoàn tất (US8). Dữ liệu giới hạn trong scope chi nhánh của bạn (SEC-010).',
    jobs_title: '📂 Báo cáo đã tạo gần đây',
    jobs_empty: 'Chưa có báo cáo nào trong tháng này — bấm "Tạo báo cáo" để bắt đầu.',
    st_processing: 'Đang xử lý', st_done: 'Hoàn tất',
    btn_download: '⬇ Tải xuống', sample: '(dữ liệu mẫu)',
    export_xlsx: 'Xuất Excel', export_pdf: 'Xuất PDF',
    h0: ['Chương trình', 'Ghi danh mới', 'Đang học', 'Hoàn thành', 'Bỏ học'],
    h1: ['Chi nhánh', 'Thu học phí', 'Tiền mặt', 'VNPay', 'Chuyển khoản', 'Công nợ'],
    h2: ['Lớp', 'Chi nhánh', 'Sức chứa', 'Đã ghi danh', 'Tỷ lệ', 'Trạng thái'],
    h3: ['Học viên', 'Lớp', 'Tiến độ', 'Điểm TB', 'Rủi ro'],
    s_good: 'Tốt', s_full: 'Đầy', s_open: 'Còn trống', s_normal: 'Bình thường',
    s_low: 'Thấp', s_med: 'Trung bình', s_high: 'Cao',
    r0: 'EN — Tiếng Anh tổng quát', r1: 'IELTS luyện thi', r2: 'IT — Lập trình', r3: 'Kỹ năng mềm',
    r4: 'Hà Nội', r5: 'TP.HCM',
    r6: 'EN-B1-26 (K41)', r7: 'IT-Python-09', r8: 'IELTS-6.5-03', r9: 'EN-A2-12 (K40)',
    r10: 'Nguyễn Minh Anh', r11: 'Trần Quốc Bảo', r12: 'Lê Thu Hà', r13: 'Phạm Đức Huy',
    period: 'T8/2026',
    toast_queued: 'Đã đưa báo cáo vào hàng đợi (job #', toast_queued2: ') — chạy qua lms-worker',
    toast_ready: '✅ Báo cáo "', toast_ready2: '" đã sẵn sàng',
    toast_export: 'Demo: xuất file (thực tế: kiểm tra quyền report:export + URL có hạn 5 phút)',
    toast_download: 'Demo: tải file',
    period2: 'T7/2026',
    page_sub_org: 'Cấu hình tổ chức và quản lý chi nhánh',
    tab_org: 'Tổ chức', tab_branches: 'Chi nhánh',
    f_org_name: 'Tên tổ chức', f_timezone: 'Múi giờ', f_academic_period: 'Năm học / kỳ hiện tại',
    org_slug: 'Slug (định danh)', org_currency: 'Tiền tệ',
    toast_org_saved: '✅ Đã lưu cấu hình tổ chức',
    br_code: 'Mã CN', br_name: 'Tên chi nhánh', br_address: 'Địa chỉ', br_status: 'Trạng thái',
    br_active: '● Hoạt động', br_archived: 'Đã đóng cửa',
    btn_add_branch: 'Thêm chi nhánh', btn_edit: 'Sửa', btn_archive: 'Đóng cửa',
    modal_add_branch: 'Thêm chi nhánh', modal_edit_branch: 'Sửa chi nhánh',
    ph_branch_code: 'VD: HN1', ph_branch_name: 'VD: Chi nhánh Hà Nội', ph_branch_addr: 'Số 123, đường ABC',
    toast_branch_created: '✅ Đã tạo chi nhánh', toast_branch_updated: '✅ Đã cập nhật chi nhánh',
    toast_branch_archived: '✅ Đã đóng cửa chi nhánh',
    no_branches: 'Chưa có chi nhánh nào',
    col_code: 'Mã',
    confirm_archive: 'Đóng cửa chi nhánh này? Người dùng và scope gắn chi nhánh sẽ không bị xóa.',
    toast_failed: '❌ Thao tác thất bại',
    loading: 'Đang tải...',
    br_manager: 'Quản lý', f_manager: 'Người quản lý (tùy chọn)', opt_no_manager: '— Không có —',
    select_branch: 'Chọn chi nhánh',
    total_users: 'Tổng {n} người dùng',
    det_title: 'Chi tiết người dùng', det_phone: 'Điện thoại', det_created: 'Tạo lúc',
    det_roles: 'Vai trò', det_scopes: 'Scope truy cập', no_scopes: 'Chưa có scope',
    btn_revoke: 'Thu hồi', btn_save_roles: 'Lưu vai trò',
    toast_role_saved: '✅ Đã lưu quyền cho vai trò', toast_roles_updated: '✅ Đã cập nhật vai trò',
    toast_scope_removed: '✅ Đã thu hồi scope',
    toast_scope_future: 'Cấp scope lớp/học viên cần dữ liệu Academic (P5) — cấp scope chi nhánh trước',
    grp_sys: 'Hệ thống',
    grp_general: 'Thông tin chung', grp_contact: 'Liên hệ', grp_bank: 'Ngân hàng', grp_brand: 'Thương hiệu',
    f_short_name: 'Tên viết tắt', f_tax_code: 'Mã số thuế', f_license_no: 'Số ĐKKD / Giấy phép',
    f_representative: 'Người đại diện', f_founded_at: 'Ngày thành lập',
    f_address: 'Địa chỉ trụ sở', f_phone: 'Điện thoại', f_hotline: 'Hotline', f_website: 'Website', f_fax: 'Fax',
    f_bank_name: 'Tên ngân hàng', f_bank_account: 'Số tài khoản', f_bank_holder: 'Chủ tài khoản',
    f_logo_url: 'Logo (URL)', f_slogan: 'Slogan', f_brand_color: 'Màu chủ đạo',
    f_opened_at: 'Ngày khai trương', f_closed_at: 'Ngày đóng cửa', f_note: 'Ghi chú',
    col_contact: 'Liên hệ', col_opened: 'Khai trương',
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
    // License screen (mockup 01)
    crumb_settings: 'Settings', page_license: 'License & Activation',
    page_sub_lic: 'License status, constraints and addons',
    lic_title: '🔑 License Status',
    lic_status: 'Status', lic_active: '● Active', lic_id: 'License ID', lic_type: 'License type',
    lic_perpetual: 'Perpetual (lifetime)', lic_support: 'Support until', lic_signature: 'Signature',
    lic_valid: 'Valid (RSA-2048)', lic_activated: 'Activated on',
    btn_relicense: 'Update license', btn_addon: 'Activate addon',
    con_title: '📏 Constraints', con_students: 'Max students', con_branches: 'Max branches', con_storage: 'Storage (GB)', ok: 'OK',
    addon_title: '🧩 Addons', col_addon: 'Addon', col_expiry: 'Expires', col_action: 'Actions',
    addon_crm: 'Admissions & CRM', addon_crm_desc: 'Landing pages, leads, consulting',
    addon_assess: 'Assessment & Testing', addon_assess_desc: 'Placement tests, mock exams',
    addon_online: 'Online Classes', addon_online_desc: 'Zoom / Meet / Teams',
    addon_hrm: 'HR & Payroll', addon_hrm_desc: 'Attendance, payroll',
    addon_note: 'ℹ️ Expired addons enter a 30-day grace period (read-only), then disable automatically — data is never deleted.',
    modal_addon_title: 'Activate Addon', serial_key: 'Serial key', serial_ph: 'CRM-XXXX-XXXX-XXXX-XXXX',
    opt_crm_price: 'Admissions & CRM — $500/yr', opt_assess_price: 'Assessment & Testing — $600/yr',
    opt_online_price: 'Online Classes — $400/yr', opt_hrm_price: 'HR & Payroll — $800/yr',
    cancel: 'Cancel', activate: 'Activate',
    modal_relic_title: 'Update License', dropzone_title: 'Drag & drop license file (.json) or click to select',
    dropzone_sub: 'Verified offline — no data leaves your server',
    upload_none: 'No file selected', apply_btn: 'Verify & apply',
    status_updated: '● Active (updated)', lic_v2: 'LIC-2026-001-ABC-EDU (v2)',
    max_students: 'Max students', max_branches: 'Max branches',
    activated_badge: 'Activated', dash: '—',
    toast_serial: 'Please enter a serial key (demo: CRM-A1B2-C3D4-E5F6-G7H8)',
    toast_serial_ok: '✅ Addon "Admissions & CRM" activated',
    toast_upload_ok: 'License uploaded — signature valid',
    toast_applied: '✅ New license applied — constraints upgraded',
    upload_progress: 'Uploading license-abc-edu-2026.json (1.2 KB)...',
    upload_done: '✅ Valid file — license-abc-edu-2026.json (RSA-2048 signature OK)',
    verifying: 'Verifying signature & applying constraints...',
    // Users & Roles (mockup 03)
    page_sub_users: 'Manage accounts, module permissions and branch scopes',
    tab_users: '👤 Users (42)', tab_roles: '🛡️ Roles & Permissions',
    ph_search: '🔍 Search by name / email...',
    role_all: 'Role: All', role_oa: 'Organization Admin', role_bm: 'Branch Manager', role_t: 'Teacher',
    role_s: 'Student', role_fo: 'Finance Officer', role_am: 'Academic Manager',
    role_sa: 'System Admin', role_ac: 'Admission Consultant',
    br_all: 'Branch: All', st_all: 'Status: All', st_active: 'Active', st_locked: 'Locked',
    btn_new_user: 'New user',
    col_user: 'User', col_role: 'Role', col_scope: 'Branch (scope)',
    col_last: 'Last login', col_actions: 'Actions',
    st_ok: '● Active', st_off: 'Locked',
    btn_details: 'Details', btn_scope: 'Grant scope',
    scope_all: 'All branches', scope_hn_classes: 'Hanoi — class: EN-B1-26',
    scope_hcm_classes: 'HCMC — classes: IT-Python-09, EN-B1-26',
    total_label: '42 users total',
    audit_note: '🔒 Any role / scope change is written to the audit log (kept 7 years — NFR-011).',
    role_oa_d: 'Full permissions across the system', role_bm_d: 'Permissions within granted branch',
    role_am_d: 'Programs, classes, schedules', role_t_d: 'Assigned classes',
    role_fo_d: 'Invoices, payments, reports', role_s_d: 'Own classes, progress',
    role_sa_d: 'Technical infrastructure', role_ac_d: 'CRM addon — not activated',
    scope_txt: 'All branches', scope_br: 'Branch scope', scope_acad: 'Academic', scope_teach: 'Teaching',
    scope_fin: 'Finance by branch', scope_study: 'Learning', scope_tech: 'Technical', addon_tag: 'addon',
    grp_org: '🏢 Organization', grp_users: '👥 Users', grp_acad: '📚 Academic', grp_fin: '💰 Finance', grp_lic: '🔑 License',
    undo: 'Undo', save: 'Save changes', perm_note: 'ℹ️ Click a permission to toggle (demo). System roles (Organization Admin) cannot drop core permissions.',
    modal_new_user: '+ New user', f_name: 'Full name *', f_email: 'Email *', f_pass: 'Temp password *', f_branch: 'Branch *',
    ph_name: 'Nguyen Van A', f_roles: 'Roles *',
    hint_multi_role: 'Multiple roles allowed. Addon roles (CRM, HRM) only appear once the addon is activated.',
    f_scope: 'Access scope',
    scope_branch_hn: 'Whole branch: Hanoi', scope_classes: 'Assigned classes only', scope_students: 'Assigned students only',
    hint_scope: 'Backend enforces scope on every read/write/export — not just menu hiding (FR-004).',
    create: 'Create user',
    modal_scope: '📌 Grant access scope — Le Van Giang',
    scope_type: 'Scope type', scope_branch: 'Branch', scope_class: 'Class', scope_student: 'Specific student',
    scope_object: 'Object', from: 'Valid from', to: 'Valid until', f_reason: 'Reason (audit)', ph_reason: 'Transfer, managing additional branch...', grant: 'Grant scope',
    toast_reset: 'Changes reset', toast_saved: '✅ Permissions saved — audit event created',
    toast_created: '✅ User created',
    toast_scope_granted: '✅ Access scope granted — effective and audited',
    // Reports (mockup 04)
    page_sub_reports: 'Create & download branch-scoped reports (async)',
    t0: '📝 Enrollment summary', t0d: 'Enrollments by program / month / branch',
    t1: '💰 Revenue by branch', t1d: 'Revenue, payment methods, receivables',
    t2: '📊 Class utilization', t2d: 'Fill rate, teachers, rooms',
    t3: '🎓 Student progress', t3d: 'Progress % by class, dropout risk',
    p_title: '⚙️ Report parameters', fmt_xlsx: 'Excel (.xlsx)', fmt_pdf: 'PDF', fmt_csv: 'CSV',
    btn_create: 'Generate report',
    p_note: 'Reports run asynchronously via worker — you can leave the page and get notified when done (US8). Data is limited to your branch scope (SEC-010).',
    jobs_title: '📂 Recent reports',
    jobs_empty: 'No reports this month — click "Generate report" to start.',
    st_processing: 'Processing', st_done: 'Done',
    btn_download: '⬇ Download', sample: '(sample data)',
    export_xlsx: 'Export Excel', export_pdf: 'Export PDF',
    h0: ['Program', 'New enrollments', 'Active', 'Completed', 'Dropouts'],
    h1: ['Branch', 'Tuition collected', 'Cash', 'VNPay', 'Bank transfer', 'Receivables'],
    h2: ['Class', 'Branch', 'Capacity', 'Enrolled', 'Rate', 'Status'],
    h3: ['Student', 'Class', 'Progress', 'Avg score', 'Risk'],
    s_good: 'Good', s_full: 'Full', s_open: 'Open', s_normal: 'Normal',
    s_low: 'Low', s_med: 'Medium', s_high: 'High',
    r0: 'EN — General English', r1: 'IELTS prep', r2: 'IT — Programming', r3: 'Soft skills',
    r4: 'Hanoi', r5: 'HCMC',
    r6: 'EN-B1-26 (K41)', r7: 'IT-Python-09', r8: 'IELTS-6.5-03', r9: 'EN-A2-12 (K40)',
    r10: 'Nguyen Minh Anh', r11: 'Tran Quoc Bao', r12: 'Le Thu Ha', r13: 'Pham Duc Huy',
    period: 'Aug 2026',
    toast_queued: 'Report queued (job #', toast_queued2: ') — running on lms-worker',
    toast_ready: '✅ Report "', toast_ready2: '" is ready',
    toast_export: 'Demo: export (real: check report:export permission + 5-min signed URL)',
    toast_download: 'Demo: download file',
    period2: 'Jul 2026',
    page_sub_org: 'Organization configuration & branch management',
    tab_org: 'Organization', tab_branches: 'Branches',
    f_org_name: 'Organization name', f_timezone: 'Timezone', f_academic_period: 'Current academic period',
    org_slug: 'Slug', org_currency: 'Currency',
    toast_org_saved: '✅ Organization settings saved',
    br_code: 'Code', br_name: 'Branch name', br_address: 'Address', br_status: 'Status',
    br_active: '● Active', br_archived: 'Archived',
    btn_add_branch: 'Add branch', btn_edit: 'Edit', btn_archive: 'Archive',
    modal_add_branch: 'Add branch', modal_edit_branch: 'Edit branch',
    ph_branch_code: 'e.g. HN1', ph_branch_name: 'e.g. Hanoi branch', ph_branch_addr: '123 ABC street',
    toast_branch_created: '✅ Branch created', toast_branch_updated: '✅ Branch updated',
    toast_branch_archived: '✅ Branch archived',
    no_branches: 'No branches yet',
    col_code: 'Code',
    confirm_archive: 'Archive this branch? Users and scopes linked to it will not be deleted.',
    toast_failed: '❌ Action failed',
    loading: 'Loading...',
    br_manager: 'Manager', f_manager: 'Manager (optional)', opt_no_manager: '— None —',
    select_branch: 'Select branch',
    total_users: 'Total {n} users',
    det_title: 'User details', det_phone: 'Phone', det_created: 'Created',
    det_roles: 'Roles', det_scopes: 'Access scopes', no_scopes: 'No scopes yet',
    btn_revoke: 'Revoke', btn_save_roles: 'Save roles',
    toast_role_saved: '✅ Role permissions saved', toast_roles_updated: '✅ Roles updated',
    toast_scope_removed: '✅ Scope revoked',
    toast_scope_future: 'Class/student scope needs Academic data (P5) — grant branch scope first',
    grp_sys: 'System',
    grp_general: 'General info', grp_contact: 'Contact', grp_bank: 'Bank', grp_brand: 'Branding',
    f_short_name: 'Short name', f_tax_code: 'Tax code', f_license_no: 'Business license no.',
    f_representative: 'Representative', f_founded_at: 'Founded date',
    f_address: 'Head office address', f_phone: 'Phone', f_hotline: 'Hotline', f_website: 'Website', f_fax: 'Fax',
    f_bank_name: 'Bank name', f_bank_account: 'Account number', f_bank_holder: 'Account holder',
    f_logo_url: 'Logo (URL)', f_slogan: 'Slogan', f_brand_color: 'Brand color',
    f_opened_at: 'Opening date', f_closed_at: 'Closing date', f_note: 'Note',
    col_contact: 'Contact', col_opened: 'Opened',
  },
};
