const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Budget = sequelize.define('Budget', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  category: { type: DataTypes.ENUM('food','transport','shopping','health','entertainment','utilities','other'), allowNull: false },
  monthlyLimit: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  month: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

module.exports = Budget;