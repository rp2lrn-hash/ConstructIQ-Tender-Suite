const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Bid = sequelize.define('Bid', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tender_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tenders',
      key: 'id'
    }
  },
  vendor_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vendors',
      key: 'id'
    }
  },
  customer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  pricing_details: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  total_bid_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  technical_proposal: {
    type: DataTypes.TEXT
  },
  documents: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  submission_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('submitted', 'under_review', 'accepted', 'rejected', 'withdrawn'),
    defaultValue: 'submitted'
  },
  submission_notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'bids',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Bid;
