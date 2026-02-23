const Budget = require('../models/budget.model');
const Expense = require('../models/expense.model');
const { Op, fn, col, cast } = require('sequelize');

const setBudget = async (req, res) => {
  try {
    const { category, monthlyLimit, month } = req.body;
    if (!category || !monthlyLimit || !month) {
      return res.status(400).json({ message: 'Category, monthlyLimit and month are required' });
    }
    if (monthlyLimit <= 0) {
      return res.status(400).json({ message: 'Monthly limit must be positive' });
    }
    await Budget.destroy({ where: { userId: req.user.id, category, month } });
    const budget = await Budget.create({ userId: req.user.id, category, monthlyLimit, month });
    return res.status(201).json({ message: 'Budget set successfully', budget });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBudgets = async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const budgets = await Budget.findAll({ where: { userId: req.user.id, month } });

    const budgetsWithSpending = await Promise.all(budgets.map(async (budget) => {
      const expenses = await Expense.findAll({
        where: {
          userId: req.user.id,
          category: budget.category,
        },
        raw: true,
      });

      const monthExpenses = expenses.filter(e => {
        const expDate = new Date(e.date);
        const expMonth = expDate.getFullYear() + '-' + String(expDate.getMonth() + 1).padStart(2, '0');
        return expMonth === month;
      });

      const spent = monthExpenses.reduce((a, b) => a + parseFloat(b.amount), 0);
      const limit = parseFloat(budget.monthlyLimit);
      const percentage = Math.min((spent / limit) * 100, 100);
      return {
        ...budget.toJSON(),
        spent,
        percentage: percentage.toFixed(1),
        isExceeded: spent > limit,
        remaining: Math.max(limit - spent, 0),
      };
    }));

    return res.status(200).json({ budgets: budgetsWithSpending });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    await budget.destroy();
    return res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { setBudget, getBudgets, deleteBudget };