const express = require('express');
const router = express.Router();
const responseController = require('../controllers/responseController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All routes require authentication
router.use(authenticate);

// Create response
router.post('/', responseController.createResponse);

// Get all responses
router.get('/', responseController.getAllResponses);

// Get response by ID
router.get('/:id', responseController.getResponseById);

// Update response
router.put('/:id', responseController.updateResponse);

// Delete response (admin only)
router.delete('/:id', authorize(['admin']), responseController.deleteResponse);

// Update response status (evaluator and admin only)
router.patch('/:id/status', authorize(['evaluator', 'admin']), responseController.updateResponseStatus);

// Add internal notes (evaluator and admin only)
router.patch('/:id/notes', authorize(['evaluator', 'admin']), responseController.addInternalNotes);

// Get response progress
router.get('/:id/progress', responseController.getResponseProgress);

module.exports = router;
