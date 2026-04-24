const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Response = sequelize.define('Response', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Tenders',
      key: 'id'
    }
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Customers',
      key: 'id'
    }
  },
  questionnaire_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'questionnaires',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'completed', 'overdue', 'reviewed'),
    defaultValue: 'not_started'
  },
  submitted_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  assignment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'assignments',
      key: 'id'
    }
  },
  assigned_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  submitted_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  internal_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'responses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Response;
