const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Contract = sequelize.define('Contract', {
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
  contract_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  contract_value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  signed_date: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending_signature', 'active', 'completed', 'terminated'),
    defaultValue: 'draft'
  },
  documents: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  payment_terms: {
    type: DataTypes.TEXT
  },
  deliverables: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  tableName: 'contracts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Contract;
