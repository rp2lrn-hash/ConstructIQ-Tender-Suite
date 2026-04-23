const { sequelize } = require('../config/database');
const Customer = require('./Customer');
const User = require('./User');
const Tender = require('./Tender');
const Vendor = require('./Vendor');
const Bid = require('./Bid');
const Evaluation = require('./Evaluation');
const Contract = require('./Contract');
const AuditLog = require('./AuditLog');

// Define relationships
Customer.hasMany(User, { foreignKey: 'customer_id', as: 'users' });
User.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Customer.hasMany(Tender, { foreignKey: 'customer_id', as: 'tenders' });
Tender.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Customer.hasMany(Vendor, { foreignKey: 'customer_id', as: 'vendors' });
Vendor.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Tender.hasMany(Bid, { foreignKey: 'tender_id', as: 'bids' });
Bid.belongsTo(Tender, { foreignKey: 'tender_id', as: 'tender' });

Vendor.hasMany(Bid, { foreignKey: 'vendor_id', as: 'bids' });
Bid.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });

Customer.hasMany(Bid, { foreignKey: 'customer_id', as: 'bids' });
Bid.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Bid.hasOne(Evaluation, { foreignKey: 'bid_id', as: 'evaluation' });
Evaluation.belongsTo(Bid, { foreignKey: 'bid_id', as: 'bid' });

Tender.hasOne(Contract, { foreignKey: 'tender_id', as: 'contract' });
Contract.belongsTo(Tender, { foreignKey: 'tender_id', as: 'tender' });

Vendor.hasMany(Contract, { foreignKey: 'vendor_id', as: 'contracts' });
Contract.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });

Customer.hasMany(Contract, { foreignKey: 'customer_id', as: 'contracts' });
Contract.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Customer.hasMany(AuditLog, { foreignKey: 'customer_id', as: 'audit_logs' });
AuditLog.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

module.exports = {
  sequelize,
  Customer,
  User,
  Tender,
  Vendor,
  Bid,
  Evaluation,
  Contract,
  AuditLog
};
