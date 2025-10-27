import express from 'express';
import admin from '../firebaseAdmin.js';

const router = express.Router({ mergeParams: true });

// Get videos by course ID
router.get('/', async (req, res) => {
  try {
    const { packageId, courseId } = req.params;
    const videosSnapshot = await admin.firestore().collection('packages').doc(packageId).collection('courses').doc(courseId).collection('videos').get();
    const videos = [];
    videosSnapshot.forEach(doc => {
      videos.push({ id: doc.id, ...doc.data() });
    });
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Create video in course
router.post('/', async (req, res) => {
  try {
    const { packageId, courseId } = req.params;
    const videoData = req.body;
    const docRef = await admin.firestore().collection('packages').doc(packageId).collection('courses').doc(courseId).collection('videos').add(videoData);
    const videoDoc = await docRef.get();
    res.status(201).json({ id: videoDoc.id, ...videoDoc.data() });
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
});

// Update video in course
router.put('/:videoId', async (req, res) => {
  try {
    const { packageId, courseId, videoId } = req.params;
    const videoData = req.body;
    await admin.firestore().collection('packages').doc(packageId).collection('courses').doc(courseId).collection('videos').doc(videoId).update(videoData);
    const updatedDoc = await admin.firestore().collection('packages').doc(packageId).collection('courses').doc(courseId).collection('videos').doc(videoId).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// Delete video from course
router.delete('/:videoId', async (req, res) => {
  try {
    const { packageId, courseId, videoId } = req.params;
    await admin.firestore().collection('packages').doc(packageId).collection('courses').doc(courseId).collection('videos').doc(videoId).delete();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

export default router;