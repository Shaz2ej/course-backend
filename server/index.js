import express from 'express';
import admin from './firebaseAdmin.js';

const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Example route to fetch students from Firestore using Admin SDK
app.get('/api/students', async (req, res) => {
  try {
    const studentsSnapshot = await db.collection('students').get();
    const students = [];
    studentsSnapshot.forEach((doc) => {
      students.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Example route to create a student in Firestore using Admin SDK
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, phone, referral_code } = req.body;
    const studentData = {
      name,
      email,
      phone,
      referral_code,
      created_at: new Date()
    };
    
    const docRef = await db.collection('students').add(studentData);
    res.status(201).json({ id: docRef.id, ...studentData });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Example route to update a student in Firestore using Admin SDK
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    await db.collection('students').doc(id).update(updates);
    res.json({ id, ...updates });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Example route to delete a student from Firestore using Admin SDK
app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('students').doc(id).delete();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});