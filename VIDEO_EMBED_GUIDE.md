# Video Embed Code Support Guide

This guide explains how to use the new video embed code functionality in the Course Admin Panel.

## Overview

The course system now supports two ways to add videos:

1. **Video URLs** - Direct links to video platforms (backward compatible)
2. **Embed Codes** - HTML iframe embed codes for embedded video players

## Supported Platforms

### Trusted Platforms
- YouTube (youtube.com, youtu.be, youtube-nocookie.com)
- Vimeo (vimeo.com, player.vimeo.com)
- Odysee (odysee.com)

### How It Works

When you paste content into the video input field, the system automatically detects whether it's a URL or embed code:

- **URLs**: Stored in the `video_url` field, opened in new tabs when clicked
- **Embed Codes**: Stored in the `embed_code` field, rendered as interactive players with preview

## Using Video URLs

### Example YouTube URL
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### Example Vimeo URL
```
https://vimeo.com/123456789
```

## Using Embed Codes

### Example YouTube Embed
```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

### Example Vimeo Embed
```html
<iframe src="https://player.vimeo.com/video/123456789" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
```

### Example Odysee Embed
```html
<iframe id="odysee-iframe" width="560" height="315" src="https://odysee.com/$/embed/video-name:abc123" allowfullscreen></iframe>
```

## Features

### Auto-Detection
- Automatically detects whether input is a URL or embed code
- Shows visual indicators for the input type
- Displays platform information (YouTube, Vimeo, etc.)

### Security
- Sanitizes embed codes to prevent XSS attacks
- Adds sandbox attributes to iframes for security
- Warns about untrusted sources
- Only allows trusted video platforms

### Preview Functionality
- **Embed codes**: Shows inline preview with toggle button
- **URLs**: Opens in new tab/window
- **Platform badges**: Shows which platform the video is from

### Backward Compatibility
- Existing video URLs continue to work
- No data migration required
- Mixed usage supported (some videos as URLs, others as embeds)

## Admin Interface

### Adding Videos

1. **Go to Courses page**
2. **Click "Add Video" or "View Videos" → "Add Video"**
3. **Enter video title and description**
4. **Paste either:**
   - Direct video URL (e.g., YouTube link)
   - Embed code from video platform
5. **The system automatically detects the type**
6. **Click "Create" to save**

### Video Display

In the Videos modal, you'll see:
- **Platform badge** (YouTube, Vimeo, etc.)
- **Type indicator** (URL or Embed Code)
- **Preview button** (for embed codes)
- **Open button** (opens video in new tab)
- **Edit/Delete buttons**

### Preview Controls

- **Eye icon**: Toggle embed preview on/off
- **External link icon**: Open video in new tab
- **Play icon**: For URL-only videos

## Database Schema

### New Column
```sql
ALTER TABLE course_videos 
ADD COLUMN embed_code TEXT;
```

### Updated CourseVideo Structure
```javascript
{
  id: "uuid",
  course_id: "uuid", 
  title: "Video Title",
  description: "Optional description",
  video_url: "https://youtube.com/watch?v=...", // Can be null if embed_code is used
  embed_code: "<iframe src='...'></iframe>",    // Can be null if video_url is used
  created_at: "2024-01-01T00:00:00Z"
}
```

## Priority System

When both `video_url` and `embed_code` are present:
1. **Embed code takes precedence** for rendering
2. **URL is used as fallback** for the "Open" button
3. **URL is extracted from embed code** if not provided separately

## Security Considerations

### Trusted Sources Only
- Only embed codes from trusted domains are allowed
- Untrusted sources show warning messages
- Manual review recommended for non-standard platforms

### Sanitization
- All embed codes are sanitized before storage
- Dangerous attributes removed (onclick, javascript:, etc.)
- Sandbox attributes added to iframes

### Content Security
- iframes run in sandboxed environment
- Limited permissions (allow-same-origin, allow-scripts, allow-popups, allow-forms)

## Troubleshooting

### "Input not recognized" warning
- Check if the URL is valid
- Ensure embed code contains proper iframe tags
- Try copying the embed code again from the source platform

### "Untrusted source" warning
- Only use embed codes from YouTube, Vimeo, or Odysee
- For other platforms, use direct URLs instead
- Contact admin to add new trusted domains if needed

### Preview not showing
- Ensure embed code is complete and valid
- Check if the video is publicly accessible
- Some videos may have embedding restrictions

### Video not loading in preview
- Video may be private or restricted
- Platform may have changed embed format
- Try refreshing the page or re-adding the embed code

## Best Practices

### When to Use URLs
- Simple video sharing
- Videos that don't need inline preview
- Maximum compatibility
- Quick setup

### When to Use Embed Codes  
- Rich interactive experience
- Custom player controls
- Inline video viewing
- Professional presentation

### Performance Tips
- Use URLs for large video lists to reduce page load
- Enable previews only when needed
- Consider lazy loading for many embedded videos

## Migration from URLs to Embed Codes

Existing videos with URLs will continue to work. To upgrade:

1. **Edit the video**
2. **Replace URL with embed code**
3. **System will automatically detect the change**
4. **URL is preserved for fallback**

No data loss occurs during this process.

## Development Notes

### Key Files Modified
- `src/components/VideoForm.jsx` - Form with auto-detection
- `src/components/VideosModal.jsx` - Video listing and preview
- `src/components/VideoPlayer.jsx` - Video rendering component
- `src/lib/videoUtils.js` - Utility functions
- `src/lib/types.js` - TypeScript definitions

### Utility Functions
- `detectVideoInputType()` - Auto-detect URL vs embed
- `sanitizeEmbedCode()` - Security sanitization
- `isTrustedEmbedSource()` - Domain validation
- `extractUrlFromEmbed()` - URL extraction
- `getVideoPlatform()` - Platform identification

## Support

For technical issues or questions about video embed functionality:

1. Check this guide first
2. Verify embed code format
3. Test with known working examples
4. Contact development team if issues persist