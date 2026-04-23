const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tender = sequelize.define('Tender', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  customer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING
  },
  budget_range_min: {
    type: DataTypes.DECIMAL(15, 2)
  },
  budget_range_max: {
    type: DataTypes.DECIMAL(15, 2)
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  submission_deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'closed', 'awarded', 'cancelled'),
    defaultValue: 'draft'
  },
  documents: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  requirements: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  evaluation_criteria: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  created_by: {
    type: DataTypes.UUID
  }
}, {
  tableName: 'tenders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Tender;
