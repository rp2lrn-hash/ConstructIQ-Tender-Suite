const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const auth = require('../middleware/auth');
const { isEvaluator } = require('../middleware/rbac');
const { tenantIsolation, auditLog } = require('../middleware/tenant');
const upload = require('../middleware/upload');

router.use(auth);
router.use(tenantIsolation);

router.get('/', isEvaluator, contractController.getAllContracts);
router.get('/:id', isEvaluator, contractController.getContractById);
router.post('/', isEvaluator, auditLog('CREATE_CONTRACT'), contractController.createContract);
router.put('/:id', isEvaluator, auditLog('UPDATE_CONTRACT'), contractController.updateContract);
router.post('/:id/sign', isEvaluator, auditLog('SIGN_CONTRACT'), contractController.signContract);
router.post('/:id/complete', isEvaluator, auditLog('COMPLETE_CONTRACT'), contractController.completeContract);

router.post('/:id/upload', isEvaluator, upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ message: 'File uploaded successfully', file: req.file });
});

module.exports = router;
