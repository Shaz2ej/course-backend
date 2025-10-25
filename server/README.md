# course-backend

Backend server for course admin panel with Firebase Admin SDK

# Firebase Admin SDK Server

This directory contains the backend server that uses Firebase Admin SDK for secure Firestore access.

## Setup

1. Create a Firebase service account key:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

2. Update the service account information in `firebaseAdmin.js`:
   - Replace the placeholder values with your actual service account key data

## Running the Server

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

## API Endpoints

The server provides RESTful endpoints for Firestore operations:

- `GET /api/students` - Fetch all students
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

Similar endpoints are available for packages, courses, videos, and purchases.

## Security

The Firebase Admin SDK runs with full read and write access to your Firebase project. 
Never expose this server publicly without proper authentication and authorization checks.