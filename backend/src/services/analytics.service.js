const Expense = require('../models/expense.model');
const { Op, fn, col } = require('sequelize');

/**
 * Get category-wise spending breakdown for a user
 * Groups expenses by category and sums total amount
 */
const getCategoryBreakdown = async (userId) => {
  const expenses = await Expense.findAll({
    where: { userId },
    attributes: ['category', [fn('SUM', col('amount')), 'total']],
    group: ['category'],
    raw: true,
  });
  return expenses;
};

/**
 * Get monthly spending trends for last 6 months
 * Uses PostgreSQL DATE_TRUNC to group by month
 */
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

/**
 * Detect anomalous expenses using Z-score algorithm
 * 
 * Z-score measures how many standard deviations a value is from the mean.
 * Formula: Z = (X - μ) / σ
 * Where: X = expense amount, μ = mean, σ = standard deviation
 * 
 * A Z-score > 2 means the expense is unusually high (top 2.5% of spending)
 * This flags potential fraud, data entry errors, or unusual purchases
 * 
 * Requires minimum 3 expenses for statistical significance
 */
const detectAnomalies = async (userId) => {
  const expenses = await Expense.findAll({
    where: { userId },
    raw: true,
  });

  // Need at least 3 data points for meaningful statistical analysis
  if (expenses.length < 3) return [];

  const amounts = expenses.map((e) => parseFloat(e.amount));

  // Calculate mean (average) of all expense amounts
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;

  // Calculate variance: average of squared differences from mean
  const variance = amounts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / amounts.length;

  // Standard deviation: square root of variance
  const stdDev = Math.sqrt(variance);

  // Flag expenses where Z-score exceeds threshold of 2
  const anomalies = expenses.filter((e) => {
    const zScore = (parseFloat(e.amount) - mean) / stdDev;
    return Math.abs(zScore) > 2;
  });

  // Persist anomaly flags to database for future reference
  await Promise.all(
    anomalies.map((e) => Expense.update({ isAnomaly: true }, { where: { id: e.id } }))
  );

  return anomalies;
};

/**
 * Get total spending statistics for a user
 * Returns total amount, transaction count, and average transaction value
 */
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