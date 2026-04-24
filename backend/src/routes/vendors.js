const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { authenticate } = require('../middleware/auth');
const { isAdmin, isCustomerUser, isEvaluator } = require('../middleware/rbac');
const { tenantIsolation, auditLog } = require('../middleware/tenant');

router.use(authenticate);
router.use(tenantIsolation);

router.get('/', vendorController.getAllVendors);
router.get('/:id', vendorController.getVendorById);
router.post('/', auditLog('CREATE_VENDOR'), vendorController.createVendor);
router.put('/:id', isCustomerUser, auditLog('UPDATE_VENDOR'), vendorController.updateVendor);
router.delete('/:id', isAdmin, auditLog('DELETE_VENDOR'), vendorController.deleteVendor);
router.put('/:id/compliance', isEvaluator, auditLog('UPDATE_COMPLIANCE'), vendorController.updateComplianceStatus);

module.exports = router;
