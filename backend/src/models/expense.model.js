const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'food',
      'transport',
      'shopping',
      'health',
      'entertainment',
      'utilities',
      'other'
    ),
    defaultValue: 'other',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  receiptUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  receiptText: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isAnomaly: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'expenses',
  indexes: [
    { fields: ['userId'] },
    { fields: ['category'] },
    { fields: ['date'] },
  ],
});

module.exports = Expense;
