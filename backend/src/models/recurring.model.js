const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const RecurringExpense = sequelize.define('RecurringExpense', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  category: { type: DataTypes.ENUM('food','transport','shopping','health','entertainment','utilities','other'), defaultValue: 'other' },
  frequency: { type: DataTypes.ENUM('daily','weekly','monthly','yearly'), defaultValue: 'monthly' },
  nextDate: { type: DataTypes.DATEONLY, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { timestamps: true, tableName: 'recurring_expenses' });

module.exports = RecurringExpense;