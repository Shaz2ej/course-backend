# Quick Database Update Instructions

## For Supabase Users

1. **Open your Supabase project dashboard**
2. **Go to SQL Editor**
3. **Run this single command:**

```sql
ALTER TABLE course_videos ADD COLUMN video_embed TEXT;
```

4. **Click "Run" to execute**

That's it! Your database is now ready to support video embed codes.

## Verification

After running the update, you can verify it worked by:

1. Going to **Table Editor** → **course_videos**
2. You should see a new column called **video_embed**

## If You Get an Error

If you see an error like "column already exists", it means the update was already applied successfully.

## Alternative: Use Without Database Update

The system will automatically fall back to using only the `video_url` field if the `video_embed` column doesn't exist. Embed codes will be converted to URLs when possible.