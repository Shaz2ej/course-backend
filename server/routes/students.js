import express from 'express';
import admin from '../firebaseAdmin.js';

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const studentsSnapshot = await admin.firestore().collection('students').get();
    const students = [];
    studentsSnapshot.forEach(doc => {
      students.push({ id: doc.id, ...doc.data() });
    });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const studentDoc = await admin.firestore().collection('students').doc(req.params.id).get();
    if (!studentDoc.exists) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ id: studentDoc.id, ...studentDoc.data() });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Create student
router.post('/', async (req, res) => {
  try {
    const studentData = req.body;
    const docRef = await admin.firestore().collection('students').add(studentData);
    const studentDoc = await docRef.get();
    res.status(201).json({ id: studentDoc.id, ...studentDoc.data() });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const studentData = req.body;
    await admin.firestore().collection('students').doc(req.params.id).update(studentData);
    const updatedDoc = await admin.firestore().collection('students').doc(req.params.id).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    await admin.firestore().collection('students').doc(req.params.id).delete();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

export default router;