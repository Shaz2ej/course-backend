import express from 'express';
import admin from '../firebaseAdmin.js';

const router = express.Router();

// Get all withdrawals
router.get('/', async (req, res) => {
  try {
    const withdrawalsSnapshot = await admin.firestore().collection('withdrawals').get();
    const withdrawals = [];
    withdrawalsSnapshot.forEach(doc => {
      withdrawals.push({ id: doc.id, ...doc.data() });
    });
    res.json(withdrawals);
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
});

// Update withdrawal
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    await admin.firestore().collection('withdrawals').doc(id).update(updateData);
    
    const updatedDoc = await admin.firestore().collection('withdrawals').doc(id).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    res.status(500).json({ error: 'Failed to update withdrawal' });
  }
});

export default router;