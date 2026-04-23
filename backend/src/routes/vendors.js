const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const auth = require('../middleware/auth');
const { isAdmin, isCustomerUser, isEvaluator } = require('../middleware/rbac');
const { tenantIsolation, auditLog } = require('../middleware/tenant');

router.use(auth);
router.use(tenantIsolation);

router.get('/', isCustomerUser, vendorController.getAllVendors);
router.get('/:id', isCustomerUser, vendorController.getVendorById);
router.post('/', isCustomerUser, auditLog('CREATE_VENDOR'), vendorController.createVendor);
router.put('/:id', isCustomerUser, auditLog('UPDATE_VENDOR'), vendorController.updateVendor);
router.delete('/:id', isAdmin, auditLog('DELETE_VENDOR'), vendorController.deleteVendor);
router.put('/:id/compliance', isEvaluator, auditLog('UPDATE_COMPLIANCE'), vendorController.updateComplianceStatus);

module.exports = router;
