const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const { isAdmin, isCustomerUser, isEvaluator } = require('../middleware/rbac');
const { tenantIsolation } = require('../middleware/tenant');

router.use(auth);
router.use(tenantIsolation);

router.get('/dashboard', isCustomerUser, reportController.getDashboardStats);
router.get('/tenders/analytics', isEvaluator, reportController.getTenderAnalytics);
router.get('/bids/analytics', isEvaluator, reportController.getBidAnalytics);
router.get('/audit-logs', isAdmin, reportController.getAuditLogs);

module.exports = router;
