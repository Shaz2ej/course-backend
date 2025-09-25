# Video Save Error Troubleshooting

## Current Error: "Database schema issue detected"

This error indicates that the database operations are failing. Let's troubleshoot step by step.

## Step 1: Test with Basic Video URL

Try adding a video with JUST a simple YouTube URL to test the basic functionality:

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

If this works, the issue is with embed code handling.
If this fails, the issue is with basic video creation.

## Step 2: Check Required Database Columns

The minimum required columns for `course_videos` table are:
- `id` (UUID, Primary Key)
- `course_id` (UUID, Foreign Key)
- `title` (Text)
- `description` (Text)
- `video_url` (Text)
- `created_at` (Timestamp)

## Step 3: Verify Course ID

Make sure you're adding the video to an existing course. The error might be caused by:
- Invalid course ID
- Course doesn't exist
- Foreign key constraint failure

## Step 4: Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try adding a video
4. Look for detailed error messages

## Step 5: Database Update (Optional)

If you want embed code support, run this in Supabase SQL Editor:

```sql
ALTER TABLE course_videos ADD COLUMN embed_code TEXT;
```

## Common Solutions

### Solution 1: Use Simple URL
Instead of embed codes, use direct video URLs:
- ✅ `https://www.youtube.com/watch?v=VIDEO_ID`
- ❌ `<iframe src="..."></iframe>`

### Solution 2: Check Course Selection
Make sure you're adding videos to an existing course from the Courses page.

### Solution 3: Verify Database Connection
Check if other operations (adding students, packages) work to confirm Supabase connection.

## Still Getting Errors?

1. **Clear browser cache** and refresh
2. **Check Supabase project status** in dashboard
3. **Verify database permissions** in Supabase
4. **Test with a simple video URL** first

## Working Test Case

Try this exact sequence:
1. Go to Courses page
2. Click "Add Video" on any existing course
3. Enter title: "Test Video"
4. Enter URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
5. Click "Create"

If this fails, the issue is with basic database operations, not embed codes.