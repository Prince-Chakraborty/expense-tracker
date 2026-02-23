const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const Expense = require('../models/expense.model');

router.use(protect, adminOnly);

router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalExpenses = await Expense.count();
    const expenses = await Expense.findAll({ raw: true });
    const totalAmount = expenses.reduce((a, b) => a + parseFloat(b.amount), 0);
    return res.status(200).json({ totalUsers, totalExpenses, totalAmount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;