const { Tender, Bid, Contract, User, Vendor, AuditLog } = require('../models');
const { Sequelize } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    const totalTenders = await Tender.count();
    const activeTenders = await Tender.count({ where: { status: 'published' } });
    const totalBids = await Bid.count();
    const totalContracts = await Contract.count();
    const activeContracts = await Contract.count({ where: { status: 'active' } });
    const totalVendors = await Vendor.count();
    const compliantVendors = await Vendor.count({ where: { is_compliant: true } });

    const recentTenders = await Tender.findAll({
      limit: 5,
      order: [['created_at', 'DESC']]
    });

    const upcomingDeadlines = await Tender.findAll({
      where: { status: 'published' },
      order: [['submission_deadline', 'ASC']],
      limit: 5
    });

    res.json({
      stats: {
        totalTenders,
        activeTenders,
        totalBids,
        totalContracts,
        activeContracts,
        totalVendors,
        compliantVendors
      },
      recentTenders,
      upcomingDeadlines
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTenderAnalytics = async (req, res) => {
  try {
    const tendersByStatus = await Tender.findAll({
      attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
      group: ['status']
    });

    const tendersByCategory = await Tender.findAll({
      attributes: ['category', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
      group: ['category']
    });

    res.json({
      tendersByStatus,
      tendersByCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBidAnalytics = async (req, res) => {
  try {
    const bidsByStatus = await Bid.findAll({
      attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
      group: ['status']
    });

    const bidsByTender = await Bid.findAll({
      attributes: ['tender_id', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
      group: ['tender_id']
    });

    res.json({
      bidsByStatus,
      bidsByTender
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      order: [['created_at', 'DESC']],
      limit: 100
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getTenderAnalytics,
  getBidAnalytics,
  getAuditLogs
};
