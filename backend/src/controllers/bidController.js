const { Bid } = require('../models');

const getAllBids = async (req, res) => {
  try {
    const bids = await Bid.findAll();
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBidById = async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }
    res.json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBid = async (req, res) => {
  try {
    const bid = await Bid.create(req.body);
    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBid = async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }
    await bid.update(req.body);
    res.json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }
    await bid.destroy();
    res.json({ message: 'Bid deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const withdrawBid = async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }
    await bid.update({ status: 'withdrawn' });
    res.json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBidsByTender = async (req, res) => {
  try {
    const bids = await Bid.findAll({ where: { tender_id: req.params.tender_id } });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBids,
  getBidById,
  createBid,
  updateBid,
  deleteBid,
  withdrawBid,
  getBidsByTender
};
