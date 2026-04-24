const { Contract } = require('../models');

const getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.findAll();
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createContract = async (req, res) => {
  try {
    const contract = await Contract.create(req.body);
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    await contract.update(req.body);
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    await contract.destroy();
    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const signContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    await contract.update({ status: 'signed' });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const completeContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    await contract.update({ status: 'completed' });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  signContract,
  completeContract
};
