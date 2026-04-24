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
const questionnaireRoutes = require('./questionnaires');
const responseRoutes = require('./responses');
const assignmentRoutes = require('./assignments');
const notificationRoutes = require('./notifications');

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/tenders', tenderRoutes);
router.use('/vendors', vendorRoutes);
router.use('/bids', bidRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/contracts', contractRoutes);
router.use('/reports', reportRoutes);
router.use('/questionnaires', questionnaireRoutes);
router.use('/responses', responseRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/notifications', notificationRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
