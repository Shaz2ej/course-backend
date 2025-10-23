# Course Admin Panel

A fully functional mobile admin panel for a course/affiliate platform built with React.

## Features

### 🎯 Core Features
- **Dashboard**: Overview with key statistics (students, revenue, purchases, withdrawals)
- **Students Management**: Add, edit, delete, and search students with referral codes
- **Purchases Management**: View and manage all purchase transactions
- **Withdrawals Management**: Review and approve/reject withdrawal requests
- **Packages Management**: Create and manage course packages with thumbnails
- **Courses Management**: Manage courses and video content
- **Analytics**: View performance metrics and insights

### 🔧 Technical Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **APK Ready**: Optimized for mobile app deployment
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Search & Filters**: Advanced search and filtering capabilities
- **Video Embed Support**: Support for both video URLs and HTML embed codes (iframe)
- **Auto-Detection**: Automatically detects video URLs vs embed codes
- **Security**: Sanitized embed codes with trusted source validation

## Technology Stack

- **Frontend**: React 19, Vite
- **UI Framework**: Tailwind CSS, shadn/ui
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Backend**: Firebase Admin SDK (secure server-side access)

## Database Schema

The application connects to the following database tables:

### Students
- `id` (UUID, Primary Key)
- `name` (Text)
- `email` (Text)
- `phone` (Text)
- `referral_code` (Text)
- `created_at` (Timestamp)

### Purchases
- `id` (UUID, Primary Key)
- `student_id` (UUID, Foreign Key)
- `package_id` (UUID, Foreign Key)
- `amount` (Numeric)
- `status` (Text)
- `commission_earned` (Numeric)

### Withdrawals
- `id` (UUID, Primary Key)
- `student_id` (UUID, Foreign Key)
- `amount` (Numeric)
- `status` (ENUM: pending, approved, rejected)
- `created_at` (Timestamp)

### Packages
- `id` (UUID, Primary Key)
- `title` (Text)
- `description` (Text)
- `price` (Numeric)
- `thumbnail_url` (Text, Nullable)
- `created_at` (Timestamp)

### Courses
- `id` (UUID, Primary Key)
- `title` (Text)
- `description` (Text)
- `created_at` (Timestamp)

### Course Videos
- `id` (UUID, Primary Key)
- `course_id` (UUID, Foreign Key)
- `title` (Text)
- `description` (Text)
- `video_url` (Text, Nullable) - Direct video URL
- `embed_code` (Text, Nullable) - HTML embed code (iframe)
- `created_at` (Timestamp)

**Note**: Either `video_url` or `embed_code` can be used. If both are present, `embed_code` takes precedence for rendering.

### Package Courses (Junction Table)
- `package_id` (UUID, Foreign Key)
- `course_id` (UUID, Foreign Key)

### Affiliates
- `id` (UUID, Primary Key)
- `student_id` (UUID, Foreign Key)
- `referral_code` (Text)
- `total_leads` (Integer)
- `total_commission` (Numeric)

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd course-admin-panel

# Install dependencies
pnpm install
```

### 2. Firebase Admin SDK Setup
The application now uses Firebase Admin SDK for secure server-side Firestore access:

1. Create a Firebase service account key:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

2. Update the service account information in `server/firebaseAdmin.js`:
   - Replace the placeholder values with your actual service account key data

### 3. Database Setup
Create the required tables in your database project using the SQL schema provided above. You can run these commands in the database SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables (run each CREATE TABLE statement)
-- See the database schema section above for complete table definitions
```

### 4. Development
```bash
# Start frontend development server
pnpm run dev

# In a separate terminal, start backend server
pnpm run server:dev

# The app will be available at http://localhost:5173
# The API server will be available at http://localhost:3001
```

### 5. Production Build
```bash
# Create production build
pnpm run build

# The build files will be in the 'dist' directory
```

## APK Deployment

### Using Capacitor (Recommended)
1. Install Capacitor:
```bash
pnpm add @capacitor/core @capacitor/cli @capacitor/android
```

2. Initialize Capacitor:
```bash
npx cap init course-admin-panel com.example.courseadmin
```

3. Add Android platform:
```bash
npx cap add android
```

4. Build and sync:
```bash
pnpm run build
npx cap sync
```

5. Open in Android Studio:
```bash
npx cap open android
```

### Using Cordova
1. Install Cordova:
```bash
npm install -g cordova
```

2. Create Cordova project:
```bash
cordova create courseadmin com.example.courseadmin CourseAdmin
```

3. Copy dist files to www directory and build APK

## Project Structure

```
course-admin-panel/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Layout.jsx    # Main layout component
│   │   └── StudentForm.jsx # Student form component
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Students.jsx
│   │   ├── Purchases.jsx
│   │   ├── Withdrawals.jsx
│   │   ├── Packages.jsx
│   │   ├── Courses.jsx
│   │   └── Analytics.jsx
│   ├── lib/              # Utility functions
│   │   ├── apiClient.js  # API client for backend communication
│   │   └── firestoreUtils.js # Firestore utility functions
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── server/               # Backend server with Firebase Admin SDK
│   ├── firebaseAdmin.js  # Firebase Admin SDK initialization
│   ├── index.js          # Express server
│   └── package.json      # Server dependencies
├── package.json
└── README.md
```

## Key Features Implementation

### Dashboard Statistics
- Real-time data from database
- Responsive cards showing key metrics
- Loading states and error handling

### Students Management
- Add/Edit/Delete students
- Auto-generated referral codes
- Search and filter functionality
- Form validation

### Withdrawals Management
- Approve/Reject functionality
- Status tracking (pending, approved, rejected)
- Real-time updates

### Responsive Design
- Mobile-first approach
- Collapsible sidebar navigation
- Touch-friendly interface
- Optimized for various screen sizes

## Environment Variables

The database configuration is currently using stub implementations.

## Security Considerations

- Implement authentication for admin access
- Validate all user inputs
- Use environment variables for sensitive data
- Implement proper error handling
- The Firebase Admin SDK provides secure server-side access to Firestore

## Performance Optimizations

- Code splitting with React.lazy()
- Image optimization for thumbnails
- Efficient database queries
- Caching strategies
- Bundle size optimization

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.