const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AnswerDetail = sequelize.define('AnswerDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  response_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'responses',
      key: 'id'
    }
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'questions',
      key: 'id'
    }
  },
  answer_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  answer_value: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  file_path: {
    type: DataTypes.STRING(500),
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
  tableName: 'answer_details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = AnswerDetail;
