const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { authenticate } = require('../middleware/auth');
const { isEvaluator } = require('../middleware/rbac');
const { tenantIsolation, auditLog } = require('../middleware/tenant');

router.use(authenticate);
router.use(tenantIsolation);

router.get('/', isEvaluator, evaluationController.getAllEvaluations);
router.get('/:id', isEvaluator, evaluationController.getEvaluationById);
router.post('/', isEvaluator, auditLog('CREATE_EVALUATION'), evaluationController.createEvaluation);
router.put('/:id', isEvaluator, auditLog('UPDATE_EVALUATION'), evaluationController.updateEvaluation);
router.get('/tender/:tender_id', isEvaluator, evaluationController.getEvaluationsByTender);

module.exports = router;
