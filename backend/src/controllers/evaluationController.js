const { Evaluation } = require('../models');

const getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.findAll();
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEvaluationById = async (req, res) => {
  try {
    const evaluation = await Evaluation.findByPk(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.create(req.body);
    res.status(201).json(evaluation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findByPk(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    await evaluation.update(req.body);
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findByPk(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    await evaluation.destroy();
    res.json({ message: 'Evaluation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEvaluationsByTender = async (req, res) => {
  try {
    const evaluations = await Evaluation.findAll({ where: { tender_id: req.params.tender_id } });
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationsByTender
};
