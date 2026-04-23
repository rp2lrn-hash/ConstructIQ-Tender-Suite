const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const tenderRoutes = require('./tenders');
const vendorRoutes = require('./vendors');
const bidRoutes = require('./bids');
const evaluationRoutes = require('./evaluations');
const contractRoutes = require('./contracts');
const reportRoutes = require('./reports');

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/tenders', tenderRoutes);
router.use('/vendors', vendorRoutes);
router.use('/bids', bidRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/contracts', contractRoutes);
router.use('/reports', reportRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
