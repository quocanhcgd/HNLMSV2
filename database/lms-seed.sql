-- =====================================================
-- LMS Seed Data - Sample data for development
-- Run after lms-schema.sql
-- =====================================================

-- =====================================================
-- 1. USERS (Students, Teachers, Admins)
-- =====================================================

-- Admin user
INSERT INTO users (id, email, password_hash, full_name, role, status, email_verified, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@educenter.vn', '$2a$10$40S.iEM8CPv/S2j7OZVupeV7pKvaFpFYRIWJykGwnTAdRnDlJj1WS', 'Admin User', 'Admin', 'Active', TRUE, NOW());
-- Password: admin123 (hashed with bcrypt)

-- Teachers
INSERT INTO users (id, email, password_hash, full_name, avatar_url, role, status, email_verified, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'tranvanb@educenter.vn', '$2a$10$wjn3zr18wzMxYgUTsoLoaOEe30r1C8rzftBz5wxtjNKe.RexRHTPC', 'Prof. Tran Van B', 'https://ui-avatars.com/api/?name=Tran+Van+B&background=0d9488&color=fff', 'Teacher', 'Active', TRUE, NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'nguyenthic@educenter.vn', '$2a$10$wjn3zr18wzMxYgUTsoLoaOEe30r1C8rzftBz5wxtjNKe.RexRHTPC', 'Dr. Nguyen Thi C', 'https://ui-avatars.com/api/?name=Nguyen+Thi+C&background=8b5cf6&color=fff', 'Teacher', 'Active', TRUE, NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'lethid@educenter.vn', '$2a$10$wjn3zr18wzMxYgUTsoLoaOEe30r1C8rzftBz5wxtjNKe.RexRHTPC', 'Ms. Le Thi D', 'https://ui-avatars.com/api/?name=Le+Thi+D&background=ec4899&color=fff', 'Teacher', 'Active', TRUE, NOW());
-- Password for all: teacher123

-- Students
INSERT INTO users (id, email, password_hash, full_name, avatar_url, date_of_birth, gender, role, status, email_verified, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440010', 'nguyenvana@student.edu', '$2a$10$zj1NOmbkQV5J1cMeAKDoEeQo8SG/fxPT7tfoFyaPyObsNUTjFb39i', 'Nguyen Van A', 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0d9488&color=fff', '2005-03-15', 'Male', 'Student', 'Active', TRUE, NOW()),
('770e8400-e29b-41d4-a716-446655440011', 'tranthib@student.edu', '$2a$10$zj1NOmbkQV5J1cMeAKDoEeQo8SG/fxPT7tfoFyaPyObsNUTjFb39i', 'Tran Thi B', 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=10b981&color=fff', '2005-07-20', 'Female', 'Student', 'Active', TRUE, NOW()),
('770e8400-e29b-41d4-a716-446655440012', 'levanthanh@student.edu', '$2a$10$zj1NOmbkQV5J1cMeAKDoEeQo8SG/fxPT7tfoFyaPyObsNUTjFb39i', 'Le Van Thanh', 'https://ui-avatars.com/api/?name=Le+Van+Thanh&background=f59e0b&color=fff', '2005-11-08', 'Male', 'Student', 'Active', TRUE, NOW()),
('770e8400-e29b-41d4-a716-446655440013', 'phamthihoa@student.edu', '$2a$10$zj1NOmbkQV5J1cMeAKDoEeQo8SG/fxPT7tfoFyaPyObsNUTjFb39i', 'Pham Thi Hoa', 'https://ui-avatars.com/api/?name=Pham+Thi+Hoa&background=8b5cf6&color=fff', '2005-05-25', 'Female', 'Student', 'Active', TRUE, NOW()),
('770e8400-e29b-41d4-a716-446655440014', 'hoangvanminh@student.edu', '$2a$10$zj1NOmbkQV5J1cMeAKDoEeQo8SG/fxPT7tfoFyaPyObsNUTjFb39i', 'Hoang Van Minh', 'https://ui-avatars.com/api/?name=Hoang+Van+Minh&background=ec4899&color=fff', '2005-09-12', 'Male', 'Student', 'Active', TRUE, NOW());
-- Password for all students: student123

-- More students (for realistic class sizes)
INSERT INTO users (email, password_hash, full_name, date_of_birth, gender, role, status, email_verified, created_at)
SELECT
    'student' || generate_series || '@student.edu',
    '$2a$10$zj1NOmbkQV5J1cMeAKDoEeQo8SG/fxPT7tfoFyaPyObsNUTjFb39i',
    'Student ' || generate_series,
    DATE '2005-01-01' + (random() * 365 * 3)::int,
    CASE WHEN random() < 0.5 THEN 'Male' ELSE 'Female' END,
    'Student',
    'Active',
    TRUE,
    NOW()
FROM generate_series(6, 100);

-- =====================================================
-- 2. COURSES
-- =====================================================

-- Course 1: Advanced Mathematics
INSERT INTO courses (id, title, slug, description, thumbnail_url, teacher_id, category, level, is_published, total_lessons, total_assignments, total_enrolled, published_at, created_at) VALUES
('880e8400-e29b-41d4-a716-446655440020',
 'Advanced Mathematics',
 'advanced-mathematics',
 'Master calculus, linear algebra, and advanced mathematical concepts with practical applications and AI-powered assistance.',
 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
 '660e8400-e29b-41d4-a716-446655440001',
 'Mathematics',
 'Advanced',
 TRUE,
 12,
 8,
 85,
 NOW() - INTERVAL '30 days',
 NOW() - INTERVAL '60 days');

-- Course 2: Computer Science 101
INSERT INTO courses (id, title, slug, description, thumbnail_url, teacher_id, category, level, is_published, total_lessons, total_assignments, total_enrolled, published_at, created_at) VALUES
('880e8400-e29b-41d4-a716-446655440021',
 'Computer Science 101',
 'computer-science-101',
 'Introduction to programming, algorithms, and computational thinking using Python.',
 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
 '660e8400-e29b-41d4-a716-446655440002',
 'Computer Science',
 'Beginner',
 TRUE,
 15,
 10,
 92,
 NOW() - INTERVAL '45 days',
 NOW() - INTERVAL '90 days');

-- Course 3: English Literature
INSERT INTO courses (id, title, slug, description, thumbnail_url, teacher_id, category, level, is_published, total_lessons, total_assignments, total_enrolled, published_at, created_at) VALUES
('880e8400-e29b-41d4-a716-446655440022',
 'English Literature',
 'english-literature',
 'Explore classic and contemporary literature with critical analysis and essay writing.',
 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
 '660e8400-e29b-41d4-a716-446655440003',
 'Literature',
 'Intermediate',
 TRUE,
 10,
 6,
 68,
 NOW() - INTERVAL '20 days',
 NOW() - INTERVAL '40 days');

-- =====================================================
-- 3. COURSE ENROLLMENTS
-- =====================================================

-- Enroll specific students in Advanced Mathematics
INSERT INTO course_enrollments (course_id, student_id, progress_percentage, lessons_completed, assignments_completed, current_grade, status, enrolled_at, last_accessed_at)
VALUES
('880e8400-e29b-41d4-a716-446655440020', '770e8400-e29b-41d4-a716-446655440010', 68.0, 8, 5, 8.9, 'Active', NOW() - INTERVAL '25 days', NOW() - INTERVAL '2 hours'),
('880e8400-e29b-41d4-a716-446655440020', '770e8400-e29b-41d4-a716-446655440011', 75.0, 9, 6, 9.2, 'Active', NOW() - INTERVAL '25 days', NOW() - INTERVAL '5 hours'),
('880e8400-e29b-41d4-a716-446655440020', '770e8400-e29b-41d4-a716-446655440012', 45.0, 5, 3, 7.5, 'Active', NOW() - INTERVAL '25 days', NOW() - INTERVAL '1 day'),
('880e8400-e29b-41d4-a716-446655440020', '770e8400-e29b-41d4-a716-446655440013', 82.0, 10, 7, 9.5, 'Active', NOW() - INTERVAL '25 days', NOW() - INTERVAL '3 hours'),
('880e8400-e29b-41d4-a716-446655440020', '770e8400-e29b-41d4-a716-446655440014', 60.0, 7, 4, 8.2, 'Active', NOW() - INTERVAL '25 days', NOW() - INTERVAL '12 hours');

-- Enroll students in Computer Science 101
INSERT INTO course_enrollments (course_id, student_id, progress_percentage, lessons_completed, assignments_completed, current_grade, status, enrolled_at, last_accessed_at)
VALUES
('880e8400-e29b-41d4-a716-446655440021', '770e8400-e29b-41d4-a716-446655440010', 42.0, 6, 4, 8.5, 'Active', NOW() - INTERVAL '40 days', NOW() - INTERVAL '1 day'),
('880e8400-e29b-41d4-a716-446655440021', '770e8400-e29b-41d4-a716-446655440011', 54.0, 8, 5, 8.8, 'Active', NOW() - INTERVAL '40 days', NOW() - INTERVAL '6 hours'),
('880e8400-e29b-41d4-a716-446655440021', '770e8400-e29b-41d4-a716-446655440012', 38.0, 5, 3, 7.8, 'Active', NOW() - INTERVAL '40 days', NOW() - INTERVAL '2 days');

-- Enroll students in English Literature
INSERT INTO course_enrollments (course_id, student_id, progress_percentage, lessons_completed, assignments_completed, current_grade, status, enrolled_at, last_accessed_at)
VALUES
('880e8400-e29b-41d4-a716-446655440022', '770e8400-e29b-41d4-a716-446655440010', 0.0, 0, 0, NULL, 'Active', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('880e8400-e29b-41d4-a716-446655440022', '770e8400-e29b-41d4-a716-446655440013', 20.0, 2, 1, 8.0, 'Active', NOW() - INTERVAL '15 days', NOW() - INTERVAL '3 days');

-- Bulk enroll remaining students (randomly distributed)
INSERT INTO course_enrollments (course_id, student_id, progress_percentage, lessons_completed, assignments_completed, current_grade, status, enrolled_at, last_accessed_at)
SELECT
    course_id,
    id AS student_id,
    (random() * 100)::decimal(5,2),
    (random() * 12)::int,
    (random() * 8)::int,
    (6 + random() * 4)::decimal(4,2),
    'Active',
    NOW() - (random() * 30)::int * INTERVAL '1 day',
    NOW() - (random() * 5)::int * INTERVAL '1 day'
FROM
    users,
    (VALUES
        ('880e8400-e29b-41d4-a716-446655440020'::uuid),
        ('880e8400-e29b-41d4-a716-446655440021'::uuid),
        ('880e8400-e29b-41d4-a716-446655440022'::uuid)
    ) AS courses(course_id)
WHERE
    users.role = 'Student'
    AND users.email LIKE 'student%@student.edu'
    AND random() < 0.3; -- 30% chance to enroll in each course

-- =====================================================
-- 4. LESSONS
-- =====================================================

-- Advanced Mathematics Lessons
INSERT INTO lessons (course_id, title, slug, description, content_type, content_url, content_text, duration_minutes, module_name, order_index, is_published, is_free_preview) VALUES
-- Module 1
('880e8400-e29b-41d4-a716-446655440020', 'Introduction to Limits', 'introduction-to-limits', 'Understanding the concept of limits and their applications', 'Video', 'https://youtube.com/watch?v=example1', NULL, 12, 'Module 1: Calculus Fundamentals', 1, TRUE, TRUE),
('880e8400-e29b-41d4-a716-446655440020', 'Derivatives and Applications', 'derivatives-and-applications', 'Learn about derivatives and how to apply them', 'Video', 'https://youtube.com/watch?v=example2', NULL, 18, 'Module 1: Calculus Fundamentals', 2, TRUE, FALSE),
('880e8400-e29b-41d4-a716-446655440020', 'Integration Techniques', 'integration-techniques', 'Master various integration methods', 'Video', 'https://youtube.com/watch?v=example3', NULL, 22, 'Module 1: Calculus Fundamentals', 3, TRUE, FALSE),

-- Module 2
('880e8400-e29b-41d4-a716-446655440020', 'Matrices and Vectors', 'matrices-and-vectors', 'Introduction to linear algebra concepts', 'Video', 'https://youtube.com/watch?v=example4', NULL, 16, 'Module 2: Linear Algebra', 4, TRUE, FALSE),
('880e8400-e29b-41d4-a716-446655440020', 'Eigenvalues and Eigenvectors', 'eigenvalues-and-eigenvectors', 'Understanding eigenvalues and their significance', 'Video', 'https://youtube.com/watch?v=example5', NULL, 20, 'Module 2: Linear Algebra', 5, TRUE, FALSE),
('880e8400-e29b-41d4-a716-446655440020', 'Linear Transformations', 'linear-transformations', 'Applying linear transformations', 'Video', 'https://youtube.com/watch?v=example6', NULL, 15, 'Module 2: Linear Algebra', 6, TRUE, FALSE);

-- Computer Science 101 Lessons
INSERT INTO lessons (course_id, title, slug, description, content_type, content_url, duration_minutes, module_name, order_index, is_published, is_free_preview) VALUES
('880e8400-e29b-41d4-a716-446655440021', 'Python Basics', 'python-basics', 'Getting started with Python programming', 'Video', 'https://youtube.com/watch?v=example7', 20, 'Module 1: Introduction', 1, TRUE, TRUE),
('880e8400-e29b-41d4-a716-446655440021', 'Variables and Data Types', 'variables-and-data-types', 'Understanding Python data types', 'Video', 'https://youtube.com/watch?v=example8', 15, 'Module 1: Introduction', 2, TRUE, FALSE),
('880e8400-e29b-41d4-a716-446655440021', 'Control Structures', 'control-structures', 'If statements, loops, and more', 'Video', 'https://youtube.com/watch?v=example9', 25, 'Module 2: Programming Concepts', 3, TRUE, FALSE),
('880e8400-e29b-41d4-a716-446655440021', 'Functions and Modules', 'functions-and-modules', 'Writing reusable code', 'Video', 'https://youtube.com/watch?v=example10', 18, 'Module 2: Programming Concepts', 4, TRUE, FALSE);

-- English Literature Lessons
INSERT INTO lessons (course_id, title, slug, description, content_type, content_text, duration_minutes, module_name, order_index, is_published, is_free_preview) VALUES
('880e8400-e29b-41d4-a716-446655440022', 'Introduction to Shakespeare', 'introduction-to-shakespeare', 'Overview of Shakespeare''s works', 'Text', 'Shakespeare (1564-1616) is widely regarded as the greatest writer in the English language...', 30, 'Module 1: Classic Literature', 1, TRUE, TRUE),
('880e8400-e29b-41d4-a716-446655440022', 'Romeo and Juliet Analysis', 'romeo-and-juliet-analysis', 'Deep dive into the famous tragedy', 'Text', 'Romeo and Juliet is a tragedy about two young star-crossed lovers...', 40, 'Module 1: Classic Literature', 2, TRUE, FALSE);

-- =====================================================
-- 5. LESSON PROGRESS
-- =====================================================

-- Student 1 (Nguyen Van A) completed 8 lessons in Math
INSERT INTO lesson_progress (lesson_id, student_id, is_completed, completed_at, first_viewed_at, last_viewed_at)
SELECT
    id AS lesson_id,
    '770e8400-e29b-41d4-a716-446655440010' AS student_id,
    TRUE,
    NOW() - (order_index * INTERVAL '3 days'),
    NOW() - (order_index * INTERVAL '3 days') - INTERVAL '1 hour',
    NOW() - (order_index * INTERVAL '3 days')
FROM lessons
WHERE course_id = '880e8400-e29b-41d4-a716-446655440020'
AND order_index <= 8;

-- =====================================================
-- 6. ASSIGNMENTS
-- =====================================================

-- Advanced Mathematics Assignments
INSERT INTO assignments (id, course_id, title, description, instructions, assignment_type, max_score, grading_method, due_date, late_submission_allowed, published_at, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440030', '880e8400-e29b-41d4-a716-446655440020', 'Calculus Problem Set #5', 'Solve derivatives and integration problems', 'Complete all 10 problems in the attached PDF. Show your work.', 'FileUpload', 100, 'Manual', NOW() + INTERVAL '3 days', TRUE, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('990e8400-e29b-41d4-a716-446655440031', '880e8400-e29b-41d4-a716-446655440020', 'Linear Algebra Quiz', 'Test your understanding of matrices', 'Complete the online quiz (30 minutes time limit)', 'Quiz', 100, 'Auto', NOW() - INTERVAL '2 days', FALSE, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

-- Computer Science 101 Assignments
INSERT INTO assignments (id, course_id, title, description, instructions, assignment_type, max_score, grading_method, due_date, late_submission_allowed, published_at, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440032', '880e8400-e29b-41d4-a716-446655440021', 'Python Programming Project', 'Build a simple calculator app', 'Create a Python program that can perform basic arithmetic operations. Submit your .py file.', 'Code', 100, 'AI', NOW() + INTERVAL '5 days', TRUE, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

-- English Literature Assignments
INSERT INTO assignments (id, course_id, title, description, instructions, assignment_type, max_score, grading_method, due_date, late_submission_allowed, ai_grading_rubric, published_at, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440033', '880e8400-e29b-41d4-a716-446655440022', 'Essay: Shakespeare Analysis', 'Write an analytical essay on Romeo and Juliet', 'Write a 1000-word essay analyzing the themes in Romeo and Juliet.', 'Essay', 100, 'AI',
 NOW() + INTERVAL '8 days', TRUE,
 '{"criteria": [{"name": "Thesis Statement", "weight": 20}, {"name": "Analysis Depth", "weight": 30}, {"name": "Evidence", "weight": 25}, {"name": "Writing Quality", "weight": 25}]}'::jsonb,
 NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days');

-- =====================================================
-- 7. SUBMISSIONS (Some completed, some pending grading)
-- =====================================================

-- Student 1 submitted and graded
INSERT INTO submissions (assignment_id, student_id, submission_text, score, grade_letter, feedback, status, submitted_at, graded_at, graded_by) VALUES
('990e8400-e29b-41d4-a716-446655440031', '770e8400-e29b-41d4-a716-446655440010', 'Quiz answers...', 85.0, 'B+', 'Good work! Review question 7.', 'Graded', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', '660e8400-e29b-41d4-a716-446655440001');

-- Student 2 submitted, pending grading
INSERT INTO submissions (assignment_id, student_id, submission_files, status, submitted_at, is_late) VALUES
('990e8400-e29b-41d4-a716-446655440030', '770e8400-e29b-41d4-a716-446655440011', '["https://s3.amazonaws.com/uploads/problem-set-5.pdf"]'::jsonb, 'Submitted', NOW() - INTERVAL '2 hours', FALSE);

-- Student 3 submitted, pending AI grading
INSERT INTO submissions (assignment_id, student_id, submission_files, status, submitted_at, is_late) VALUES
('990e8400-e29b-41d4-a716-446655440032', '770e8400-e29b-41d4-a716-446655440012', '["https://s3.amazonaws.com/uploads/calculator.py"]'::jsonb, 'Submitted', NOW() - INTERVAL '5 hours', FALSE);

-- =====================================================
-- 8. STUDENT GRADES (Summary)
-- =====================================================

INSERT INTO student_grades (student_id, course_id, total_assignments, completed_assignments, average_score, letter_grade, last_updated_at) VALUES
('770e8400-e29b-41d4-a716-446655440010', '880e8400-e29b-41d4-a716-446655440020', 8, 5, 8.9, 'A-', NOW()),
('770e8400-e29b-41d4-a716-446655440011', '880e8400-e29b-41d4-a716-446655440020', 8, 6, 9.2, 'A', NOW()),
('770e8400-e29b-41d4-a716-446655440012', '880e8400-e29b-41d4-a716-446655440020', 8, 3, 7.5, 'B', NOW());

-- =====================================================
-- 9. NOTIFICATIONS
-- =====================================================

INSERT INTO notifications (user_id, type, title, message, link_url, is_read, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440010', 'AssignmentDue', 'Assignment Due Soon', 'Calculus Problem Set #5 is due in 3 days', '/assignments/990e8400-e29b-41d4-a716-446655440030', FALSE, NOW()),
('770e8400-e29b-41d4-a716-446655440010', 'AssignmentGraded', 'Assignment Graded', 'Your Linear Algebra Quiz has been graded: 85/100', '/submissions/view', TRUE, NOW() - INTERVAL '2 days'),
('660e8400-e29b-41d4-a716-446655440001', 'NewMessage', 'New Submission', '1 new submission to grade: Problem Set #5', '/assignments/pending', FALSE, NOW() - INTERVAL '2 hours');

-- =====================================================
-- 10. DISCUSSION THREADS
-- =====================================================

INSERT INTO discussion_threads (course_id, title, content, author_id, reply_count, view_count, created_at, last_activity_at) VALUES
('880e8400-e29b-41d4-a716-446655440020', 'Help with Derivatives', 'I''m stuck on problem 7 in the homework. Can someone explain the chain rule again?', '770e8400-e29b-41d4-a716-446655440010', 3, 15, NOW() - INTERVAL '1 day', NOW() - INTERVAL '5 hours');

INSERT INTO discussion_replies (thread_id, content, author_id, created_at) VALUES
((SELECT id FROM discussion_threads WHERE title = 'Help with Derivatives'), 'The chain rule is used when you have a composite function. Let me show you an example...', '660e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '20 hours'),
((SELECT id FROM discussion_threads WHERE title = 'Help with Derivatives'), 'Thanks! That makes more sense now.', '770e8400-e29b-41d4-a716-446655440010', NOW() - INTERVAL '18 hours');

-- =====================================================
-- 11. CERTIFICATES (Some students completed courses)
-- =====================================================

INSERT INTO certificates (student_id, course_id, certificate_number, certificate_url, final_score, completion_percentage, verification_code, issued_at) VALUES
('770e8400-e29b-41d4-a716-446655440013', '880e8400-e29b-41d4-a716-446655440020', 'CERT-20260825-0001', 'https://certificates.educenter.vn/cert-001.pdf', 9.5, 100.0, 'VERIFY-ABC123XYZ', NOW() - INTERVAL '5 days');

-- =====================================================
-- SUMMARY
-- =====================================================

-- Run this to see what was created:
SELECT 'Users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Courses', COUNT(*) FROM courses
UNION ALL
SELECT 'Enrollments', COUNT(*) FROM course_enrollments
UNION ALL
SELECT 'Lessons', COUNT(*) FROM lessons
UNION ALL
SELECT 'Assignments', COUNT(*) FROM assignments
UNION ALL
SELECT 'Submissions', COUNT(*) FROM submissions
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'Certificates', COUNT(*) FROM certificates;

-- Test queries to verify data:
-- SELECT * FROM users WHERE role = 'Student' LIMIT 5;
-- SELECT * FROM courses;
-- SELECT * FROM course_enrollments WHERE student_id = '770e8400-e29b-41d4-a716-446655440010';
-- SELECT * FROM active_students_view LIMIT 5;

-- Login credentials for testing:
-- Admin: admin@educenter.vn / admin123
-- Teacher: tranvanb@educenter.vn / teacher123
-- Student: nguyenvana@student.edu / student123