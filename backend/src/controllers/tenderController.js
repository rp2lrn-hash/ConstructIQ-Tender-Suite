const { Tender } = require('../models');

const getAllTenders = async (req, res) => {
  try {
    const tenders = await Tender.findAll();
    res.json(tenders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTenderById = async (req, res) => {
  try {
    const tender = await Tender.findByPk(req.params.id);
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }
    res.json(tender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTender = async (req, res) => {
  try {
    const tender = await Tender.create(req.body);
    res.status(201).json(tender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTender = async (req, res) => {
  try {
    const tender = await Tender.findByPk(req.params.id);
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }
    await tender.update(req.body);
    res.json(tender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTender = async (req, res) => {
  try {
    const tender = await Tender.findByPk(req.params.id);
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }
    await tender.destroy();
    res.json({ message: 'Tender deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const publishTender = async (req, res) => {
  try {
    const tender = await Tender.findByPk(req.params.id);
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }
    await tender.update({ status: 'published' });
    res.json(tender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const closeTender = async (req, res) => {
  try {
    const tender = await Tender.findByPk(req.params.id);
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }
    await tender.update({ status: 'closed' });
    res.json(tender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTenders,
  getTenderById,
  createTender,
  updateTender,
  deleteTender,
  publishTender,
  closeTender
};
