import express from 'express';
import admin from '../firebaseAdmin.js';

const router = express.Router();

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packagesSnapshot = await admin.firestore().collection('packages').get();
    const packages = [];
    packagesSnapshot.forEach(doc => {
      packages.push({ id: doc.id, ...doc.data() });
    });
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// Get package by ID
router.get('/:id', async (req, res) => {
  try {
    const packageDoc = await admin.firestore().collection('packages').doc(req.params.id).get();
    if (!packageDoc.exists) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json({ id: packageDoc.id, ...packageDoc.data() });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ error: 'Failed to fetch package' });
  }
});

// Create package
router.post('/', async (req, res) => {
  try {
    const packageData = req.body;
    const docRef = await admin.firestore().collection('packages').add(packageData);
    const packageDoc = await docRef.get();
    res.status(201).json({ id: packageDoc.id, ...packageDoc.data() });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Failed to create package' });
  }
});

// Update package
router.put('/:id', async (req, res) => {
  try {
    const packageData = req.body;
    await admin.firestore().collection('packages').doc(req.params.id).update(packageData);
    const updatedDoc = await admin.firestore().collection('packages').doc(req.params.id).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'Failed to update package' });
  }
});

// Delete package
router.delete('/:id', async (req, res) => {
  try {
    await admin.firestore().collection('packages').doc(req.params.id).delete();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

// Get courses by package ID
router.get('/:packageId/courses', async (req, res) => {
  try {
    const coursesSnapshot = await admin.firestore().collection('packages').doc(req.params.packageId).collection('courses').get();
    const courses = [];
    coursesSnapshot.forEach(doc => {
      courses.push({ id: doc.id, ...doc.data() });
    });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Create course in package
router.post('/:packageId/courses', async (req, res) => {
  try {
    const courseData = req.body;
    const docRef = await admin.firestore().collection('packages').doc(req.params.packageId).collection('courses').add(courseData);
    const courseDoc = await docRef.get();
    res.status(201).json({ id: courseDoc.id, ...courseDoc.data() });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update course in package
router.put('/:packageId/courses/:courseId', async (req, res) => {
  try {
    const courseData = req.body;
    await admin.firestore().collection('packages').doc(req.params.packageId).collection('courses').doc(req.params.courseId).update(courseData);
    const updatedDoc = await admin.firestore().collection('packages').doc(req.params.packageId).collection('courses').doc(req.params.courseId).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete course from package
router.delete('/:packageId/courses/:courseId', async (req, res) => {
  try {
    await admin.firestore().collection('packages').doc(req.params.packageId).collection('courses').doc(req.params.courseId).delete();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

export default router;