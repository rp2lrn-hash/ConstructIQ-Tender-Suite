const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vendor = sequelize.define('Vendor', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  license_no: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  certifications: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  compliance_status: {
    type: DataTypes.ENUM('compliant', 'non_compliant', 'pending_review'),
    defaultValue: 'pending_review'
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  contact_phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.TEXT
  },
  business_type: {
    type: DataTypes.STRING
  },
  years_in_business: {
    type: DataTypes.INTEGER
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'blacklisted'),
    defaultValue: 'active'
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  }
}, {
  tableName: 'vendors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Vendor;
