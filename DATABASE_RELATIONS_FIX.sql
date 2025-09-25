-- DATABASE RELATIONS AUDIT AND FIX
-- Run this SQL in your Supabase SQL editor to audit and fix the relationships

-- First, let's check the current schema
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('packages', 'courses', 'course_videos', 'package_courses')
ORDER BY table_name, ordinal_position;

-- Check foreign key constraints
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name IN ('packages', 'courses', 'course_videos', 'package_courses');

-- Option 1: Keep current many-to-many architecture (RECOMMENDED)
-- This allows courses to belong to multiple packages
-- Just ensure the relationships are working correctly

-- Fix package_courses table if needed (standardize column names)
-- If you want lowercase column names:
/*
ALTER TABLE package_courses RENAME COLUMN "Package_id" TO package_id;
ALTER TABLE package_courses RENAME COLUMN "Course_id" TO course_id;
*/

-- Option 2: Add package_id to courses table (if you want 1-to-many relationship)
-- WARNING: This means each course can only belong to ONE package
-- Uncomment the lines below if you want this approach:

/*
-- Add package_id column to courses table
ALTER TABLE courses ADD COLUMN package_id UUID REFERENCES packages(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_courses_package_id ON courses(package_id);

-- Migrate existing relationships from junction table to direct foreign key
-- This will move the FIRST package relationship for each course
INSERT INTO courses (id, title, description, created_at, package_id)
SELECT 
    c.id,
    c.title, 
    c.description,
    c.created_at,
    (SELECT pc.Package_id FROM package_courses pc WHERE pc.Course_id = c.id LIMIT 1) as package_id
FROM courses c
ON CONFLICT (id) DO UPDATE SET 
    package_id = EXCLUDED.package_id;

-- After migration, you could drop the junction table if you want:
-- DROP TABLE package_courses;
*/

-- Ensure course_videos table has proper constraints (should already be correct)
-- This should already exist, but let's verify:
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_videos' AND column_name = 'course_id'
    ) THEN
        ALTER TABLE course_videos ADD COLUMN course_id UUID REFERENCES courses(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Ensure video_embed column exists (for embed code support)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_videos' AND column_name = 'video_embed'
    ) THEN
        ALTER TABLE course_videos ADD COLUMN video_embed TEXT;
    END IF;
END $$;

-- Add helpful indexes for performance
CREATE INDEX IF NOT EXISTS idx_course_videos_course_id ON course_videos(course_id);
CREATE INDEX IF NOT EXISTS idx_package_courses_package_id ON package_courses(Package_id);
CREATE INDEX IF NOT EXISTS idx_package_courses_course_id ON package_courses(Course_id);

-- Create a view for easier querying (packages with their courses and video counts)
CREATE OR REPLACE VIEW package_details AS
SELECT 
    p.id as package_id,
    p.title as package_title,
    p.description as package_description,
    p.price,
    p.thumbnail_url,
    p.created_at as package_created_at,
    COUNT(DISTINCT c.id) as course_count,
    COUNT(DISTINCT cv.id) as total_video_count
FROM packages p
LEFT JOIN package_courses pc ON p.id = pc.Package_id
LEFT JOIN courses c ON pc.Course_id = c.id  
LEFT JOIN course_videos cv ON c.id = cv.course_id
GROUP BY p.id, p.title, p.description, p.price, p.thumbnail_url, p.created_at;

-- Create a view for course details with video counts
CREATE OR REPLACE VIEW course_details AS
SELECT 
    c.id as course_id,
    c.title as course_title,
    c.description as course_description,
    c.created_at as course_created_at,
    COUNT(cv.id) as video_count
FROM courses c
LEFT JOIN course_videos cv ON c.id = cv.course_id
GROUP BY c.id, c.title, c.description, c.created_at;