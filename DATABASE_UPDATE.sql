-- Database Schema Update for Video Embed Code Support
-- Run this SQL in your Supabase SQL editor

-- Add video_embed column to course_videos table
ALTER TABLE course_videos 
ADD COLUMN video_embed TEXT;

-- Add a comment to explain the new column
COMMENT ON COLUMN course_videos.video_embed IS 'Stores HTML embed code for videos (iframe). If both video_url and video_embed are provided, video_embed takes precedence for rendering.';

-- Create index for better performance when querying by video_embed
CREATE INDEX IF NOT EXISTS idx_course_videos_video_embed 
ON course_videos(video_embed) 
WHERE video_embed IS NOT NULL;

-- Update the existing table description
COMMENT ON TABLE course_videos IS 'Stores course video information. Supports both direct URLs (video_url) and HTML embed codes (video_embed) for flexible video integration.';