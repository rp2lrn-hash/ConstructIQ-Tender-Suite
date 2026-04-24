const { Questionnaire, Question, User, Customer, Tender } = require('../models');

// Create a new questionnaire
exports.createQuestionnaire = async (req, res) => {
  try {
    const { title, description, customer_id, project_id, questions } = req.body;
    const created_by = req.user.id;

    console.log('Creating questionnaire with data:', { title, description, customer_id, project_id, created_by, questions });

    const questionnaire = await Questionnaire.create({
      title,
      description,
      customer_id,
      project_id,
      created_by,
      is_active: true
    });

    console.log('Questionnaire created:', questionnaire.id);

    // Create questions if provided
    if (questions && questions.length > 0) {
      const questionData = questions.map((q, index) => ({
        questionnaire_id: questionnaire.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options || null,
        is_required: q.is_required || false,
        order_index: q.order_index || index
      }));
      await Question.bulkCreate(questionData);
      console.log('Questions created:', questionData.length);
    }

    // Fetch the complete questionnaire with questions
    const completeQuestionnaire = await Questionnaire.findByPk(questionnaire.id, {
      include: [{ model: Question, as: 'questions', order: [['order_index', 'ASC']] }]
    });

    res.status(201).json(completeQuestionnaire);
  } catch (error) {
    console.error('Error creating questionnaire:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all questionnaires
exports.getAllQuestionnaires = async (req, res) => {
  try {
    const { customer_id, project_id, is_active } = req.query;
    const where = {};

    if (customer_id) where.customer_id = customer_id;
    if (project_id) where.project_id = project_id;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    console.log('Fetching questionnaires with where:', where);

    const questionnaires = await Questionnaire.findAll({
      where,
      include: [
        { model: Question, as: 'questions', order: [['order_index', 'ASC']] },
        { model: Customer, as: 'customer', attributes: ['id', 'name'] },
        { model: Tender, as: 'project', attributes: ['id', 'title'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });

    console.log('Fetched questionnaires count:', questionnaires.length);
    res.json(questionnaires);
  } catch (error) {
    console.error('Error fetching questionnaires:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get questionnaire by ID
exports.getQuestionnaireById = async (req, res) => {
  try {
    const { id } = req.params;

    const questionnaire = await Questionnaire.findByPk(id, {
      include: [
        { model: Question, as: 'questions', order: [['order_index', 'ASC']] },
        { model: Customer, as: 'customer', attributes: ['id', 'name'] },
        { model: Tender, as: 'project', attributes: ['id', 'title'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    res.json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update questionnaire
exports.updateQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, customer_id, project_id, is_active, questions } = req.body;

    const questionnaire = await Questionnaire.findByPk(id);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    await questionnaire.update({
      title,
      description,
      customer_id,
      project_id,
      is_active
    });

    // Update questions if provided
    if (questions) {
      // Delete existing questions
      await Question.destroy({ where: { questionnaire_id: id } });

      // Create new questions
      const questionData = questions.map((q, index) => ({
        questionnaire_id: id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options || null,
        is_required: q.is_required || false,
        order_index: q.order_index || index
      }));
      await Question.bulkCreate(questionData);
    }

    // Fetch updated questionnaire
    const updatedQuestionnaire = await Questionnaire.findByPk(id, {
      include: [{ model: Question, as: 'questions', order: [['order_index', 'ASC']] }]
    });

    res.json(updatedQuestionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete questionnaire
exports.deleteQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;

    const questionnaire = await Questionnaire.findByPk(id);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    await questionnaire.destroy();

    res.json({ message: 'Questionnaire deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Activate/Deactivate questionnaire
exports.toggleQuestionnaireStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const questionnaire = await Questionnaire.findByPk(id);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    await questionnaire.update({ is_active });

    res.json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
