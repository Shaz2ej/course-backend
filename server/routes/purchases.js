import express from 'express';
import admin from '../firebaseAdmin.js';

const router = express.Router();

// Get all purchases
router.get('/', async (req, res) => {
  try {
    const purchasesSnapshot = await admin.firestore().collection('purchases').get();
    const purchases = [];
    purchasesSnapshot.forEach(doc => {
      purchases.push({ id: doc.id, ...doc.data() });
    });
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

// Create purchase
router.post('/', async (req, res) => {
  try {
    const purchaseData = req.body;
    const docRef = await admin.firestore().collection('purchases').add(purchaseData);
    const purchaseDoc = await docRef.get();
    res.status(201).json({ id: purchaseDoc.id, ...purchaseDoc.data() });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

// Update purchase
router.put('/:id', async (req, res) => {
  try {
    const purchaseData = req.body;
    await admin.firestore().collection('purchases').doc(req.params.id).update(purchaseData);
    const updatedDoc = await admin.firestore().collection('purchases').doc(req.params.id).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating purchase:', error);
    res.status(500).json({ error: 'Failed to update purchase' });
  }
});

export default router;