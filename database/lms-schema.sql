-- =====================================================
-- EduCenter LMS - Database Schema
-- PostgreSQL 14+
-- Created: 2026-08-25
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- Users table (students, teachers, admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    -- Profile
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    phone VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other', 'PreferNotToSay')),

    -- Role
    role VARCHAR(50) NOT NULL CHECK (role IN ('Student', 'Teacher', 'Admin')),

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended', 'Deleted')),

    -- Security
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    two_fa_enabled BOOLEAN DEFAULT FALSE,
    two_fa_secret VARCHAR(255),

    -- Session
    last_login_at TIMESTAMP,
    last_login_ip INET,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    -- Indexes
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for users
CREATE INDEX idx_users_email ON users(LOWER(email)) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_password_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_tokens_user ON password_reset_tokens(user_id);

-- =====================================================
-- COURSES & CONTENT
-- =====================================================

-- Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Course Info
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),

    -- Teacher
    teacher_id UUID NOT NULL REFERENCES users(id),

    -- Classification
    category VARCHAR(100),
    level VARCHAR(50) CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),

    -- Settings
    is_published BOOLEAN DEFAULT FALSE,
    enrollment_limit INTEGER,

    -- Stats (denormalized for performance)
    total_lessons INTEGER DEFAULT 0,
    total_assignments INTEGER DEFAULT 0,
    total_enrolled INTEGER DEFAULT 0,

    -- Timestamps
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Indexes for courses
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_published ON courses(is_published) WHERE deleted_at IS NULL;
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_created_at ON courses(created_at DESC);
CREATE INDEX idx_courses_search ON courses USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Course enrollments
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Progress tracking
    progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    lessons_completed INTEGER DEFAULT 0,
    assignments_completed INTEGER DEFAULT 0,

    -- Grading
    current_grade DECIMAL(4,2),

    -- Status
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Dropped', 'Suspended')),

    -- Timestamps
    enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    last_accessed_at TIMESTAMP,

    UNIQUE(course_id, student_id)
);

-- Indexes for enrollments
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_student ON course_enrollments(student_id);
CREATE INDEX idx_enrollments_status ON course_enrollments(status);
CREATE INDEX idx_enrollments_enrolled_at ON course_enrollments(enrolled_at DESC);

-- Lessons
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    -- Lesson Info
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    description TEXT,

    -- Content
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('Video', 'Text', 'PDF', 'Quiz', 'Interactive')),
    content_url VARCHAR(500), -- Video URL, PDF URL, etc.
    content_text TEXT, -- For text lessons
    duration_minutes INTEGER, -- Estimated duration

    -- Organization
    module_name VARCHAR(255), -- Module 1, Module 2, etc.
    order_index INTEGER NOT NULL,

    -- Settings
    is_published BOOLEAN DEFAULT FALSE,
    is_free_preview BOOLEAN DEFAULT FALSE, -- Allow non-enrolled students to preview

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    UNIQUE(course_id, slug)
);

-- Indexes for lessons
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_order ON lessons(course_id, order_index);
CREATE INDEX idx_lessons_module ON lessons(course_id, module_name);
CREATE INDEX idx_lessons_published ON lessons(is_published);

-- Lesson progress (track which lessons students completed)
CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Progress
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,

    -- Video tracking (if content_type = Video)
    video_progress_seconds INTEGER DEFAULT 0,
    video_total_seconds INTEGER,

    -- Timestamps
    first_viewed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_viewed_at TIMESTAMP,

    UNIQUE(lesson_id, student_id)
);

-- Indexes for lesson progress
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX idx_lesson_progress_completed ON lesson_progress(is_completed);

-- =====================================================
-- ASSIGNMENTS & SUBMISSIONS
-- =====================================================

-- Assignments
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    -- Assignment Info
    title VARCHAR(500) NOT NULL,
    description TEXT,
    instructions TEXT,

    -- Type
    assignment_type VARCHAR(50) NOT NULL CHECK (assignment_type IN ('Essay', 'Code', 'FileUpload', 'Quiz', 'Speaking')),

    -- Grading
    max_score DECIMAL(5,2) NOT NULL DEFAULT 100,
    grading_method VARCHAR(50) DEFAULT 'Manual' CHECK (grading_method IN ('Manual', 'AI', 'Auto')),

    -- Deadlines
    due_date TIMESTAMP NOT NULL,
    late_submission_allowed BOOLEAN DEFAULT TRUE,
    late_penalty_percentage DECIMAL(5,2) DEFAULT 10,

    -- Files
    attachment_urls JSONB, -- Array of file URLs

    -- AI Grading Config (if grading_method = AI)
    ai_grading_rubric JSONB, -- Grading criteria for AI

    -- Timestamps
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Indexes for assignments
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignments_type ON assignments(assignment_type);

-- Submissions
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Submission Content
    submission_text TEXT, -- For essays
    submission_files JSONB, -- Array of uploaded file URLs
    submission_metadata JSONB, -- Extra data (code language, etc.)

    -- Grading
    score DECIMAL(5,2),
    grade_letter VARCHAR(5), -- A, B+, C, etc.
    feedback TEXT,

    -- AI Grading
    ai_score DECIMAL(5,2), -- AI suggested score
    ai_feedback TEXT, -- AI generated feedback
    ai_graded_at TIMESTAMP,

    -- Status
    status VARCHAR(50) DEFAULT 'Submitted' CHECK (status IN ('Draft', 'Submitted', 'Grading', 'Graded', 'Returned')),

    -- Timestamps
    submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    graded_at TIMESTAMP,
    graded_by UUID REFERENCES users(id), -- Teacher who graded

    -- Late submission
    is_late BOOLEAN DEFAULT FALSE,

    UNIQUE(assignment_id, student_id)
);

-- Indexes for submissions
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX idx_submissions_graded_by ON submissions(graded_by);

-- =====================================================
-- GRADING & PERFORMANCE
-- =====================================================

-- Grades summary (denormalized for quick access)
CREATE TABLE student_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    -- Grades
    total_assignments INTEGER DEFAULT 0,
    completed_assignments INTEGER DEFAULT 0,
    average_score DECIMAL(5,2),
    letter_grade VARCHAR(5),

    -- Ranking
    rank_in_class INTEGER,
    percentile DECIMAL(5,2),

    -- Updated
    last_updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE(student_id, course_id)
);

-- Indexes for grades
CREATE INDEX idx_student_grades_student ON student_grades(student_id);
CREATE INDEX idx_student_grades_course ON student_grades(course_id);
CREATE INDEX idx_student_grades_avg_score ON student_grades(average_score DESC);

-- =====================================================
-- AI USAGE TRACKING
-- =====================================================

-- AI grading logs
CREATE TABLE ai_grading_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,

    -- AI Details
    ai_model VARCHAR(100), -- gpt-4, claude-3, etc.
    ai_provider VARCHAR(50), -- OpenAI, Anthropic, etc.

    -- Request/Response
    request_payload JSONB,
    response_payload JSONB,

    -- Scoring
    score_given DECIMAL(5,2),
    feedback_generated TEXT,

    -- Performance
    processing_time_ms INTEGER,
    tokens_used INTEGER,

    -- Cost tracking
    cost_usd DECIMAL(10,6),

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for AI logs
CREATE INDEX idx_ai_logs_submission ON ai_grading_logs(submission_id);
CREATE INDEX idx_ai_logs_created_at ON ai_grading_logs(created_at DESC);
CREATE INDEX idx_ai_logs_model ON ai_grading_logs(ai_model);

-- AI credits usage (for license system integration)
CREATE TABLE ai_credits_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- User
    user_id UUID REFERENCES users(id),

    -- Usage
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('EssayGrading', 'CodeGrading', 'SpeakingAnalysis', 'ContentRecommendation')),
    credits_used INTEGER NOT NULL,

    -- Reference
    reference_type VARCHAR(50), -- Submission, Lesson, etc.
    reference_id UUID,

    -- Timestamp
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for AI credits
CREATE INDEX idx_ai_credits_user ON ai_credits_usage(user_id);
CREATE INDEX idx_ai_credits_created_at ON ai_credits_usage(created_at DESC);
CREATE INDEX idx_ai_credits_action ON ai_credits_usage(action_type);

-- =====================================================
-- CERTIFICATES
-- =====================================================

-- Certificates
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    -- Certificate Info
    certificate_number VARCHAR(100) UNIQUE NOT NULL, -- CERT-YYYYMMDD-XXXX
    certificate_url VARCHAR(500), -- PDF URL

    -- Requirements
    final_score DECIMAL(5,2),
    completion_percentage DECIMAL(5,2),

    -- Verification
    verification_code VARCHAR(100) UNIQUE NOT NULL,

    -- Timestamps
    issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP, -- NULL = never expires

    UNIQUE(student_id, course_id)
);

-- Indexes for certificates
CREATE INDEX idx_certificates_student ON certificates(student_id);
CREATE INDEX idx_certificates_course ON certificates(course_id);
CREATE INDEX idx_certificates_number ON certificates(certificate_number);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);

-- =====================================================
-- DISCUSSIONS & COMMUNICATION
-- =====================================================

-- Discussion threads (forum-style)
CREATE TABLE discussion_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    -- Thread Info
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,

    -- Author
    author_id UUID NOT NULL REFERENCES users(id),

    -- Stats
    reply_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,

    -- Flags
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    last_activity_at TIMESTAMP
);

-- Indexes for threads
CREATE INDEX idx_threads_course ON discussion_threads(course_id);
CREATE INDEX idx_threads_author ON discussion_threads(author_id);
CREATE INDEX idx_threads_last_activity ON discussion_threads(last_activity_at DESC);

-- Discussion replies
CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES discussion_threads(id) ON DELETE CASCADE,

    -- Reply Info
    content TEXT NOT NULL,

    -- Author
    author_id UUID NOT NULL REFERENCES users(id),

    -- Flags
    is_solution BOOLEAN DEFAULT FALSE, -- Mark as best answer

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Indexes for replies
CREATE INDEX idx_replies_thread ON discussion_replies(thread_id);
CREATE INDEX idx_replies_author ON discussion_replies(author_id);
CREATE INDEX idx_replies_created_at ON discussion_replies(created_at);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Notification Info
    type VARCHAR(50) NOT NULL CHECK (type IN ('AssignmentDue', 'AssignmentGraded', 'NewLesson', 'NewMessage', 'CourseUpdate', 'System')),
    title VARCHAR(255) NOT NULL,
    message TEXT,

    -- Link
    link_url VARCHAR(500),

    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================
-- SYSTEM CONFIGURATION
-- =====================================================

-- System settings (key-value store)
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    value_type VARCHAR(50) DEFAULT 'string' CHECK (value_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert default config
INSERT INTO system_config (key, value, value_type, description) VALUES
('license_key', 'STUB', 'string', 'License key for validation (STUB for development)'),
('license_mode', 'stub', 'string', 'License validation mode: stub or production'),
('instance_id', uuid_generate_v4()::text, 'string', 'Unique instance ID for license binding'),
('ai_provider', 'openai', 'string', 'AI provider: openai, anthropic, or custom'),
('ai_credits_remaining', '999999', 'number', 'Remaining AI credits (tracked locally for now)'),
('max_students', '999999', 'number', 'Maximum students allowed (controlled by license)'),
('features_enabled', '["ai_grading","analytics","certificates"]', 'json', 'Enabled features (controlled by license)');

-- =====================================================
-- AUDIT LOGS
-- =====================================================

-- Audit logs (track all important actions)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- User
    user_id UUID REFERENCES users(id),
    user_email VARCHAR(255),
    user_role VARCHAR(50),

    -- Action
    action VARCHAR(100) NOT NULL, -- 'user.create', 'course.publish', 'submission.grade', etc.
    entity_type VARCHAR(50) NOT NULL, -- 'User', 'Course', 'Submission', etc.
    entity_id UUID,

    -- Changes (before/after)
    changes JSONB,

    -- Request Info
    ip_address INET,
    user_agent TEXT,

    -- Timestamp
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for audit logs
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- Partition audit_logs by month (for large-scale deployments)
-- CREATE TABLE audit_logs_2026_08 PARTITION OF audit_logs FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Update course stats when enrollment changes
CREATE OR REPLACE FUNCTION update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE courses SET total_enrolled = total_enrolled + 1 WHERE id = NEW.course_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE courses SET total_enrolled = total_enrolled - 1 WHERE id = OLD.course_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER course_enrollment_count
    AFTER INSERT OR DELETE ON course_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_course_enrollment_count();

-- Function: Update thread reply count
CREATE OR REPLACE FUNCTION update_thread_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE discussion_threads
        SET reply_count = reply_count + 1,
            last_activity_at = NOW()
        WHERE id = NEW.thread_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE discussion_threads
        SET reply_count = reply_count - 1
        WHERE id = OLD.thread_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER thread_reply_count
    AFTER INSERT OR DELETE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION update_thread_reply_count();

-- =====================================================
-- VIEWS
-- =====================================================

-- View: Active students with course info
CREATE VIEW active_students_view AS
SELECT
    u.id AS student_id,
    u.full_name,
    u.email,
    u.avatar_url,
    COUNT(DISTINCT ce.course_id) AS total_courses,
    AVG(ce.progress_percentage) AS avg_progress,
    AVG(sg.average_score) AS avg_grade,
    MAX(ce.last_accessed_at) AS last_active
FROM users u
LEFT JOIN course_enrollments ce ON u.id = ce.student_id AND ce.status = 'Active'
LEFT JOIN student_grades sg ON u.id = sg.student_id
WHERE u.role = 'Student' AND u.status = 'Active'
GROUP BY u.id;

-- View: Course analytics
CREATE VIEW course_analytics_view AS
SELECT
    c.id AS course_id,
    c.title,
    c.teacher_id,
    u.full_name AS teacher_name,
    c.total_enrolled,
    COUNT(DISTINCT ce.student_id) AS active_students,
    AVG(ce.progress_percentage) AS avg_progress,
    AVG(sg.average_score) AS avg_grade,
    COUNT(DISTINCT a.id) AS total_assignments,
    COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'Submitted') AS pending_submissions
FROM courses c
LEFT JOIN users u ON c.teacher_id = u.id
LEFT JOIN course_enrollments ce ON c.id = ce.course_id AND ce.status = 'Active'
LEFT JOIN student_grades sg ON c.id = sg.course_id
LEFT JOIN assignments a ON c.id = a.course_id
LEFT JOIN submissions s ON a.id = s.assignment_id
WHERE c.deleted_at IS NULL
GROUP BY c.id, u.full_name;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE users IS 'All system users (students, teachers, admins)';
COMMENT ON TABLE courses IS 'Course catalog';
COMMENT ON TABLE course_enrollments IS 'Student enrollments in courses';
COMMENT ON TABLE lessons IS 'Course lessons/modules';
COMMENT ON TABLE assignments IS 'Course assignments';
COMMENT ON TABLE submissions IS 'Student assignment submissions';
COMMENT ON TABLE ai_grading_logs IS 'AI grading activity logs';
COMMENT ON TABLE certificates IS 'Course completion certificates';
COMMENT ON TABLE system_config IS 'System configuration (including license stub)';

-- =====================================================
-- DATA RETENTION POLICIES (Comments only, implement via cron)
-- =====================================================

-- Delete old audit logs (> 1 year)
-- DELETE FROM audit_logs WHERE timestamp < NOW() - INTERVAL '1 year';

-- Delete old AI grading logs (> 90 days)
-- DELETE FROM ai_grading_logs WHERE created_at < NOW() - INTERVAL '90 days';

-- Delete old password reset tokens (> 24 hours)
-- DELETE FROM password_reset_tokens WHERE expires_at < NOW();

-- =====================================================
-- END OF SCHEMA
-- =====================================================