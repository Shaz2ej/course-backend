# Deployment Guide - Course Admin Panel

## Quick Start for APK Generation

### Method 1: Using Capacitor (Recommended)

1. **Install Capacitor**:
```bash
cd course-admin-panel
npm install @capacitor/core @capacitor/cli @capacitor/android
```

2. **Initialize Capacitor**:
```bash
npx cap init "Course Admin Panel" com.courseadmin.app
```

3. **Add Android Platform**:
```bash
npx cap add android
```

4. **Build and Sync**:
```bash
npm run build
npx cap sync
```

5. **Open in Android Studio**:
```bash
npx cap open android
```

6. **Generate APK in Android Studio**:
   - Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
   - APK will be generated in `android/app/build/outputs/apk/debug/`

### Method 2: Using Cordova

1. **Install Cordova**:
```bash
npm install -g cordova
```

2. **Create Cordova Project**:
```bash
cordova create courseadmin com.courseadmin.app "Course Admin Panel"
cd courseadmin
```

3. **Add Android Platform**:
```bash
cordova platform add android
```

4. **Copy Built Files**:
```bash
# Copy contents of course-admin-panel/dist to courseadmin/www
cp -r ../course-admin-panel/dist/* www/
```

5. **Build APK**:
```bash
cordova build android
```

## Database Setup

### Database Configuration

1. **Create Tables** in database SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students table
CREATE TABLE students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    referral_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Packages table
CREATE TABLE packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases table
CREATE TABLE purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    commission_earned NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Withdrawals table
CREATE TYPE withdrawal_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE withdrawals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status withdrawal_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course videos table
CREATE TABLE course_videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    video_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Package courses junction table
CREATE TABLE package_courses (
    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (package_id, course_id)
);

-- Affiliates table
CREATE TABLE affiliates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    referral_code TEXT UNIQUE NOT NULL,
    total_leads INTEGER DEFAULT 0,
    total_commission NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. **Set up Row Level Security (RLS)** for production:

```sql
-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

-- Create policies (example for admin access)
CREATE POLICY "Admin can do everything" ON students FOR ALL USING (true);
CREATE POLICY "Admin can do everything" ON packages FOR ALL USING (true);
CREATE POLICY "Admin can do everything" ON purchases FOR ALL USING (true);
CREATE POLICY "Admin can do everything" ON withdrawals FOR ALL USING (true);
CREATE POLICY "Admin can do everything" ON courses FOR ALL USING (true);
CREATE POLICY "Admin can do everything" ON course_videos FOR ALL USING (true);
CREATE POLICY "Admin can do everything" ON package_courses FOR ALL USING (true);
CREATE POLICY "Admin can do everything" ON affiliates FOR ALL USING (true);
```

## Production Deployment

### Web Deployment

1. **Build for Production**:
```bash
npm run build
```

2. **Deploy to Vercel**:
```bash
npm install -g vercel
vercel --prod
```

3. **Deploy to Netlify**:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Environment Variables

For production, create a `.env` file:

```env
# Database configuration variables would go here
```

## Testing

### Local Testing
```bash
# Development server
npm run dev

# Production build testing
npm run build
npm run preview
```

### Mobile Testing
1. Use Chrome DevTools mobile simulation
2. Test on actual devices using local network IP
3. Use tools like BrowserStack for cross-device testing

## Security Checklist

- [ ] Enable RLS in database
- [ ] Add authentication for admin access
- [ ] Use environment variables for sensitive data
- [ ] Implement input validation
- [ ] Add rate limiting
- [ ] Enable HTTPS in production
- [ ] Regular security audits

## Performance Optimization

- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Implement lazy loading
- [ ] Use CDN for static assets
- [ ] Monitor bundle size
- [ ] Implement caching strategies

## Troubleshooting

### Common Issues

1. **Build Errors**:
   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Verify all imports are correct

2. **Database Connection Issues**:
   - Verify URL and API key
   - Check network connectivity
   - Ensure tables exist in database

3. **APK Generation Issues**:
   - Ensure Android SDK is installed
   - Check Java version compatibility
   - Verify Capacitor/Cordova configuration

### Support

For technical support:
1. Check the README.md file
2. Review error logs in browser console
3. Check database dashboard for issues
4. Verify all dependencies are installed correctly

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor database usage and limits
- Backup database regularly
- Review and update security policies
- Monitor app performance metrics

### Updates
- Test all updates in development first
- Use semantic versioning
- Document all changes
- Maintain backward compatibility when possible