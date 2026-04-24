const { Assignment, Questionnaire, User, Notification } = require('../models');

// Create a new assignment
exports.createAssignment = async (req, res) => {
  try {
    const { questionnaire_id, assigned_to, due_date, notes } = req.body;
    const assigned_by = req.user.id;

    // Check if questionnaire exists
    const questionnaire = await Questionnaire.findByPk(questionnaire_id);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    // Check if assignee exists
    const assignee = await User.findByPk(assigned_to);
    if (!assignee) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create assignment
    const assignment = await Assignment.create({
      questionnaire_id,
      assigned_to,
      assigned_by,
      due_date,
      notes,
      status: 'pending'
    });

    // Create notification for the assignee
    await Notification.create({
      user_id: assigned_to,
      type: 'assignment',
      title: 'New Questionnaire Assignment',
      message: `You have been assigned to complete the questionnaire: ${questionnaire.title}`,
      related_id: assignment.id,
      related_type: 'assignment',
      is_read: false
    });

    // Fetch complete assignment with relations
    const completeAssignment = await Assignment.findByPk(assignment.id, {
      include: [
        { model: Questionnaire, as: 'questionnaire' },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assigner', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json(completeAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all assignments for current user
exports.getMyAssignments = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { assigned_to: req.user.id };

    if (status) where.status = status;

    const assignments = await Assignment.findAll({
      where,
      include: [
        { model: Questionnaire, as: 'questionnaire', include: [{ model: User, as: 'creator', attributes: ['id', 'name'] }] },
        { model: User, as: 'assigner', attributes: ['id', 'name', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get assignments created by current user
exports.getCreatedAssignments = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { assigned_by: req.user.id };

    if (status) where.status = status;

    const assignments = await Assignment.findAll({
      where,
      include: [
        { model: Questionnaire, as: 'questionnaire' },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching created assignments:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findByPk(id, {
      include: [
        { model: Questionnaire, as: 'questionnaire', include: [{ model: User, as: 'creator', attributes: ['id', 'name'] }] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assigner', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if user has access to this assignment
    if (assignment.assigned_to !== req.user.id && assignment.assigned_by !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update assignment status
exports.updateAssignmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if user has access to update this assignment
    if (assignment.assigned_to !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await assignment.update({ status });

    // If completed, notify the assigner
    if (status === 'completed') {
      const questionnaire = await Questionnaire.findByPk(assignment.questionnaire_id);
      await Notification.create({
        user_id: assignment.assigned_by,
        type: 'response_submitted',
        title: 'Assignment Completed',
        message: `The questionnaire "${questionnaire.title}" has been completed by the assignee`,
        related_id: assignment.id,
        related_type: 'assignment',
        is_read: false
      });
    }

    const updatedAssignment = await Assignment.findByPk(id, {
      include: [
        { model: Questionnaire, as: 'questionnaire' },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'assigner', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json(updatedAssignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if user is the assigner
    if (assignment.assigned_by !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await assignment.destroy();

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: error.message });
  }
};
