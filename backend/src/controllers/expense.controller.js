const Expense = require('../models/expense.model');
const { deleteCache } = require('../services/cache.service');

const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;
    if (!title || !amount || !date) {
      return res.status(400).json({ message: 'Title, amount and date are required' });
    }
    const expense = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      category: category || 'other',
      date,
      notes,
    });

    await deleteCache(`analytics:categories:${req.user.id}`);
    await deleteCache(`analytics:stats:${req.user.id}`);
    await deleteCache(`analytics:monthly:${req.user.id}`);

    return res.status(201).json({ message: 'Expense created successfully', expense });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: expenses } = await Expense.findAndCountAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
      limit,
      offset,
    });

    return res.status(200).json({
      expenses,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    return res.status(200).json({ expense });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    await expense.update(req.body);
    await deleteCache(`analytics:categories:${req.user.id}`);
    await deleteCache(`analytics:stats:${req.user.id}`);
    return res.status(200).json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    await expense.destroy();
    await deleteCache(`analytics:categories:${req.user.id}`);
    await deleteCache(`analytics:stats:${req.user.id}`);
    return res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense };
