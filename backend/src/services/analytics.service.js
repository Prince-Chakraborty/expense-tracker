const Expense = require('../models/expense.model');
const { Op, fn, col, literal } = require('sequelize');

const getCategoryBreakdown = async (userId) => {
  const expenses = await Expense.findAll({
    where: { userId },
    attributes: ['category', [fn('SUM', col('amount')), 'total']],
    group: ['category'],
    raw: true,
  });
  return expenses;
};

const getMonthlyTrends = async (userId) => {
  const expenses = await Expense.findAll({
    where: {
      userId,
      date: {
        [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      },
    },
    attributes: [
      [fn('DATE_TRUNC', 'month', col('date')), 'month'],
      [fn('SUM', col('amount')), 'total'],
    ],
    group: [fn('DATE_TRUNC', 'month', col('date'))],
    order: [[fn('DATE_TRUNC', 'month', col('date')), 'ASC']],
    raw: true,
  });
  return expenses;
};

const detectAnomalies = async (userId) => {
  const expenses = await Expense.findAll({
    where: { userId },
    raw: true,
  });

  if (expenses.length < 3) return [];

  const amounts = expenses.map((e) => parseFloat(e.amount));
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const variance = amounts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);

  const anomalies = expenses.filter((e) => {
    const zScore = (parseFloat(e.amount) - mean) / stdDev;
    return Math.abs(zScore) > 2;
  });

  await Promise.all(
    anomalies.map((e) => Expense.update({ isAnomaly: true }, { where: { id: e.id } }))
  );

  return anomalies;
};

const getTotalStats = async (userId) => {
  const expenses = await Expense.findAll({
    where: { userId },
    raw: true,
  });

  const total = expenses.reduce((a, b) => a + parseFloat(b.amount), 0);
  const count = expenses.length;
  const average = count > 0 ? total / count : 0;

  return { total, count, average };
};

module.exports = { getCategoryBreakdown, getMonthlyTrends, detectAnomalies, getTotalStats };
