const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { isAdmin, isEvaluator } = require('../middleware/rbac');
const { tenantIsolation, auditLog } = require('../middleware/tenant');

router.use(auth);
router.use(tenantIsolation);

router.get('/users', isAdmin, adminController.getAllUsers);
router.post('/users', isAdmin, auditLog('CREATE_USER'), adminController.createUser);
router.put('/users/:id/role', isAdmin, auditLog('UPDATE_USER_ROLE'), adminController.updateUserRole);
router.delete('/users/:id', isAdmin, auditLog('DELETE_USER'), adminController.deleteUser);

router.get('/customers', isAdmin, adminController.getAllCustomers);
router.post('/customers', isAdmin, auditLog('CREATE_CUSTOMER'), adminController.createCustomer);
router.put('/customers/:id', isAdmin, auditLog('UPDATE_CUSTOMER'), adminController.updateCustomer);

module.exports = router;
