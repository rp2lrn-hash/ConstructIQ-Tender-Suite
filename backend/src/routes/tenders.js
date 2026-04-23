const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/tenderController');
const auth = require('../middleware/auth');
const { isAdmin, isCustomerUser, isEvaluator } = require('../middleware/rbac');
const { tenantIsolation, auditLog } = require('../middleware/tenant');
const upload = require('../middleware/upload');

router.use(auth);
router.use(tenantIsolation);

router.get('/', isCustomerUser, tenderController.getAllTenders);
router.get('/:id', isCustomerUser, tenderController.getTenderById);
router.post('/', isEvaluator, auditLog('CREATE_TENDER'), tenderController.createTender);
router.put('/:id', isEvaluator, auditLog('UPDATE_TENDER'), tenderController.updateTender);
router.delete('/:id', isAdmin, auditLog('DELETE_TENDER'), tenderController.deleteTender);
router.post('/:id/publish', isEvaluator, auditLog('PUBLISH_TENDER'), tenderController.publishTender);
router.post('/:id/close', isEvaluator, auditLog('CLOSE_TENDER'), tenderController.closeTender);

router.post('/:id/upload', isEvaluator, upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ message: 'File uploaded successfully', file: req.file });
});

module.exports = router;
