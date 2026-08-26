-- =====================================================
-- Setup Script: Run this to create database
-- =====================================================

-- Connect to educenter_lms database first!
-- In pgAdmin: Right-click educenter_lms → Query Tool → Run this

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Then run the main schema file: lms-schema.sql

-- After schema is created, you can run seed data: lms-seed.sql