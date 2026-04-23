const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Evaluation = sequelize.define('Evaluation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  bid_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'bids',
      key: 'id'
    }
  },
  technical_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  },
  financial_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  },
  compliance_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  },
  weighted_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  },
  evaluator_id: {
    type: DataTypes.UUID
  },
  evaluation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  comments: {
    type: DataTypes.TEXT
  },
  criteria_breakdown: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  recommendation: {
    type: DataTypes.ENUM('recommended', 'not_recommended', 'needs_review'),
    defaultValue: 'needs_review'
  }
}, {
  tableName: 'evaluations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Evaluation;
