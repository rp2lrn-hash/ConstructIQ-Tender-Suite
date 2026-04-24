const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { User } = require('../models');

// All routes require authentication
router.use(authenticate);

// Get users for assignment (excluding current user)
router.get('/users', async (req, res) => {
  try {
    console.log('Fetching users for assignment, current user:', req.user.id);
    const users = await User.findAll({
      where: {
        id: { [require('sequelize').Op.ne]: req.user.id }
      },
      attributes: ['id', 'name', 'email', 'role', 'status']
    });
    console.log('Users found:', users.length);
    console.log('Users:', JSON.stringify(users, null, 2));
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create assignment
router.post('/', assignmentController.createAssignment);

// Get my assignments (assigned to me)
router.get('/my', assignmentController.getMyAssignments);

// Get assignments I created
router.get('/created', assignmentController.getCreatedAssignments);

// Get assignment by ID
router.get('/:id', assignmentController.getAssignmentById);

// Update assignment status
router.patch('/:id/status', assignmentController.updateAssignmentStatus);

// Delete assignment
router.delete('/:id', assignmentController.deleteAssignment);

module.exports = router;
