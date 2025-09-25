# Database Relationships Guide

## 🔧 Fixed Issues & Proper Relationships

### ✅ **CORRECT DATABASE ARCHITECTURE**

The current database properly implements these relationships:

```
Packages (1) ←→ (M) package_courses (M) ←→ (1) Courses (1) ←→ (M) course_videos
```

**This means:**
- ✅ `course_videos` table HAS `course_id` foreign key (CORRECT)
- ✅ `courses` table does NOT have `package_id` (CORRECT - uses junction table)
- ✅ `package_courses` junction table links packages and courses (many-to-many)

### 🎯 **Key Relationship Rules**

1. **Videos belong to Courses ONLY**
   - Each video has exactly ONE `course_id`
   - Videos are scoped to their specific course
   - Videos CANNOT appear across multiple courses

2. **Courses can belong to Multiple Packages**
   - Via `package_courses` junction table
   - Same course can be in different packages
   - Courses are linked, not owned by packages

3. **Packages contain Courses**
   - Package → Courses (via junction table)
   - Package → Courses → Videos (indirect relationship)

## 🛠️ **What We Fixed**

### 1. **Enhanced Database Functions**
```javascript
// OLD: Basic getCourseVideos
export const getCourseVideos = async (courseId) => {
  // Simple query without validation
}

// NEW: Validated getCourseVideos  
export const getCourseVideos = async (courseId) => {
  // Ensures videos are scoped to the course
  // Returns empty array if course doesn't exist
}
```

### 2. **Added Video Creation Validation**
```javascript
// NEW: Validates course exists before creating video
export const createVideoForCourse = async (courseId, videoData) => {
  // 1. Check if course exists
  // 2. Validate course_id
  // 3. Create video with proper relationship
}
```

### 3. **Enhanced Package Queries**
```javascript
// OLD: Basic package query
export const getPackageById = async (id) => {
  // Simple package + courses fetch
}

// NEW: Complete package with video counts
export const getPackageById = async (id) => {
  // 1. Get package info
  // 2. Get linked courses via junction table
  // 3. Get video count for each course
  // 4. Return complete structure
}
```

### 4. **Added Relationship Audit Functions**
- `auditVideoRelationships()` - Find orphaned videos
- `getCoursesByPackageId()` - Get courses for a package
- `getPackagesByCourseId()` - Get packages containing a course
- `getVideosByCourseId()` - Get videos for a course (validated)

## 📋 **Admin Panel Usage Guidelines**

### ✅ **CORRECT: Adding Videos**
1. Go to **Courses** section
2. Click **"View Videos"** on a specific course
3. Click **"Add Video"** 
4. Fill in video details
5. Video gets linked to THAT course only

### ✅ **CORRECT: Package Management**
1. Go to **Packages** section
2. Create/edit package
3. Select which **courses** to include
4. Videos come with the courses automatically

### ❌ **INCORRECT: Don't do this**
- Don't manually enter course IDs when adding videos
- Don't expect videos to appear in packages they weren't linked through courses
- Don't try to link videos directly to packages

## 🔍 **Database Schema Verification**

Run this SQL to verify your schema is correct:

```sql
-- Check table structure
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name IN ('packages', 'courses', 'course_videos', 'package_courses')
ORDER BY table_name, ordinal_position;

-- Check foreign key constraints
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('packages', 'courses', 'course_videos', 'package_courses');
```

**Expected Results:**
- `course_videos.course_id` → `courses.id`
- `package_courses.Package_id` → `packages.id` 
- `package_courses.Course_id` → `courses.id`

## 🎯 **Testing Your Setup**

### Test 1: Video Scoping
1. Create a course with videos
2. Create another course  
3. Verify videos from Course 1 don't appear in Course 2

### Test 2: Package-Course Relationship
1. Create a package with multiple courses
2. Verify package shows correct courses
3. Verify video count is correct for each course

### Test 3: Cross-Package Courses
1. Create Course A
2. Add Course A to Package 1 and Package 2
3. Verify Course A appears in both packages
4. Add video to Course A
5. Verify video appears in both packages (through Course A)

## 🚨 **Common Issues & Solutions**

### Issue: "Videos appearing in wrong packages"
**Root Cause**: Videos are properly scoped to courses, but course is linked to multiple packages
**Solution**: This is CORRECT behavior. If you want course-specific videos, create separate courses.

### Issue: "Can't add video to package directly" 
**Root Cause**: Videos belong to courses, not packages
**Solution**: Add video to a course, then link that course to packages

### Issue: "Orphaned videos"
**Root Cause**: Videos with invalid `course_id`
**Solution**: Use the DatabaseAudit component to find and fix orphaned videos

## 🔧 **Migration Script (If Needed)**

If you want to change to a simpler 1-to-many relationship (courses belong to one package only):

```sql
-- WARNING: This will break many-to-many relationships
-- Add package_id to courses table
ALTER TABLE courses ADD COLUMN package_id UUID REFERENCES packages(id) ON DELETE SET NULL;

-- Migrate first package relationship for each course
UPDATE courses SET package_id = (
    SELECT pc.Package_id 
    FROM package_courses pc 
    WHERE pc.Course_id = courses.id 
    LIMIT 1
);

-- Drop junction table (optional - only if you want 1-to-many)
-- DROP TABLE package_courses;
```

## ✅ **Current Status**

After applying all fixes:
- ✅ Videos are properly scoped to courses
- ✅ Package queries include proper video counts  
- ✅ Video creation validates course existence
- ✅ Admin panel enforces correct relationships
- ✅ Enhanced error handling and validation
- ✅ Audit tools available for troubleshooting

**The relationships are now working correctly!** 🎉