const { Response, AnswerDetail, Questionnaire, Question, User, Customer, Tender, Assignment } = require('../models');

// Create a new response
exports.createResponse = async (req, res) => {
  try {
    const { project_id, customer_id, questionnaire_id, answers, assignment_id, status } = req.body;
    const submitted_by = req.user.id;

    const response = await Response.create({
      project_id,
      customer_id,
      questionnaire_id,
      assignment_id,
      status: status || 'in_progress',
      submitted_by,
      assigned_date: new Date()
    });

    // Create answer details if provided
    if (answers && answers.length > 0) {
      const answerData = answers.map(a => ({
        response_id: response.id,
        question_id: a.question_id,
        answer_text: a.answer_text || null,
        answer_value: a.answer_value || null,
        file_path: a.file_path || null
      }));
      await AnswerDetail.bulkCreate(answerData);
    }

    // Fetch complete response
    const completeResponse = await Response.findByPk(response.id, {
      include: [
        { model: AnswerDetail, as: 'answer_details', include: [{ model: Question, as: 'question' }] },
        { model: Questionnaire, as: 'questionnaire' },
        { model: Tender, as: 'project', attributes: ['id', 'title'] },
        { model: Customer, as: 'customer', attributes: ['id', 'name'] },
        { model: User, as: 'submitter', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json(completeResponse);
  } catch (error) {
    console.error('Error creating response:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all responses
exports.getAllResponses = async (req, res) => {
  try {
    const { project_id, customer_id, questionnaire_id, status } = req.query;
    const where = {};

    if (project_id) where.project_id = project_id;
    if (customer_id) where.customer_id = customer_id;
    if (questionnaire_id) where.questionnaire_id = questionnaire_id;
    if (status) where.status = status;

    const responses = await Response.findAll({
      where,
      include: [
        { model: AnswerDetail, as: 'answer_details', include: [{ model: Question, as: 'question' }] },
        { model: Questionnaire, as: 'questionnaire', attributes: ['id', 'title'], include: [{ model: Question, as: 'questions', attributes: ['id'] }] },
        { model: Tender, as: 'project', attributes: ['id', 'title'] },
        { model: Customer, as: 'customer', attributes: ['id', 'name'] },
        { model: User, as: 'submitter', attributes: ['id', 'name', 'email'] },
        { model: Assignment, as: 'assignment', attributes: ['id', 'created_at', 'due_date', 'status'], include: [
          { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'assigner', attributes: ['id', 'name', 'email'] }
        ]}
      ],
      order: [['last_updated', 'DESC']]
    });

    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get response by ID
exports.getResponseById = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Response.findByPk(id, {
      include: [
        { model: AnswerDetail, as: 'answer_details', include: [{ model: Question, as: 'question' }] },
        { model: Questionnaire, as: 'questionnaire', attributes: ['id', 'title'], include: [{ model: Question, as: 'questions', attributes: ['id'] }] },
        { model: Tender, as: 'project', attributes: ['id', 'title'] },
        { model: Customer, as: 'customer', attributes: ['id', 'name'] },
        { model: User, as: 'submitter', attributes: ['id', 'name', 'email'] },
        { model: Assignment, as: 'assignment', include: [
          { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'assigner', attributes: ['id', 'name', 'email'] }
        ]}
      ]
    });

    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update response
exports.updateResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, answers, internal_notes, assignment_id } = req.body;

    const response = await Response.findByPk(id);
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    await response.update({
      status: status || response.status,
      internal_notes: internal_notes !== undefined ? internal_notes : response.internal_notes,
      last_updated: new Date(),
      submitted_date: status === 'completed' ? new Date() : response.submitted_date,
      assignment_id: assignment_id !== undefined ? assignment_id : response.assignment_id
    });

    // Update answers if provided
    if (answers) {
      // Delete existing answers
      await AnswerDetail.destroy({ where: { response_id: id } });

      // Create new answers
      const answerData = answers.map(a => ({
        response_id: id,
        question_id: a.question_id,
        answer_text: a.answer_text || null,
        answer_value: a.answer_value || null,
        file_path: a.file_path || null
      }));
      await AnswerDetail.bulkCreate(answerData);
    }

    // Fetch updated response
    const updatedResponse = await Response.findByPk(id, {
      include: [
        { model: AnswerDetail, as: 'answer_details', include: [{ model: Question, as: 'question' }] },
        { model: Questionnaire, as: 'questionnaire', attributes: ['id', 'title'] }
      ]
    });

    res.json(updatedResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete response
exports.deleteResponse = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Response.findByPk(id);
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    await response.destroy();

    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update response status
exports.updateResponseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const response = await Response.findByPk(id);
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    await response.update({
      status,
      last_updated: new Date(),
      submitted_date: status === 'completed' ? new Date() : response.submitted_date
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add internal notes
exports.addInternalNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { internal_notes } = req.body;

    const response = await Response.findByPk(id);
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    await response.update({
      internal_notes,
      last_updated: new Date()
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get response progress (for progress bars)
exports.getResponseProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Response.findByPk(id, {
      include: [
        { model: Questionnaire, include: [{ model: Question }] },
        { model: AnswerDetail }
      ]
    });

    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    const totalQuestions = response.Questionnaire.Questions.length;
    const answeredQuestions = response.AnswerDetails.length;
    const requiredQuestions = response.Questionnaire.Questions.filter(q => q.is_required).length;
    const answeredRequired = response.AnswerDetails.filter(ad => {
      const question = response.Questionnaire.Questions.find(q => q.id === ad.question_id);
      return question && question.is_required;
    }).length;

    const progress = {
      total: totalQuestions,
      answered: answeredQuestions,
      percentage: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
      required_total: requiredQuestions,
      required_answered: answeredRequired,
      can_submit: requiredQuestions === answeredRequired
    };

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
