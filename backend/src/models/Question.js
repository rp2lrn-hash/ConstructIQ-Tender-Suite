const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  questionnaire_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'questionnaires',
      key: 'id'
    }
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  question_type: {
    type: DataTypes.ENUM('text', 'textarea', 'radio', 'checkbox', 'dropdown', 'date', 'number', 'file_upload'),
    allowNull: false
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  is_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  order_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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
  tableName: 'questions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Question;
