const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaireController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All routes require authentication
router.use(authenticate);

// Create questionnaire (evaluator and admin only)
router.post('/', authorize(['evaluator', 'admin']), questionnaireController.createQuestionnaire);

// Get all questionnaires
router.get('/', questionnaireController.getAllQuestionnaires);

// Get questionnaire by ID
router.get('/:id', questionnaireController.getQuestionnaireById);

// Update questionnaire (evaluator and admin only)
router.put('/:id', authorize(['evaluator', 'admin']), questionnaireController.updateQuestionnaire);

// Delete questionnaire (admin only)
router.delete('/:id', authorize(['admin']), questionnaireController.deleteQuestionnaire);

// Toggle questionnaire status (evaluator and admin only)
router.patch('/:id/status', authorize(['evaluator', 'admin']), questionnaireController.toggleQuestionnaireStatus);

module.exports = router;
