const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const auth = require('../middleware/auth');
const { isCustomerUser } = require('../middleware/rbac');
const { tenantIsolation, auditLog } = require('../middleware/tenant');
const upload = require('../middleware/upload');

router.use(auth);
router.use(tenantIsolation);

router.get('/', isCustomerUser, bidController.getAllBids);
router.get('/:id', isCustomerUser, bidController.getBidById);
router.post('/', isCustomerUser, auditLog('SUBMIT_BID'), bidController.createBid);
router.put('/:id', isCustomerUser, auditLog('UPDATE_BID'), bidController.updateBid);
router.post('/:id/withdraw', isCustomerUser, auditLog('WITHDRAW_BID'), bidController.withdrawBid);
router.get('/tender/:tender_id', isCustomerUser, bidController.getBidsByTender);

router.post('/:id/upload', isCustomerUser, upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ message: 'File uploaded successfully', file: req.file });
});

module.exports = router;
