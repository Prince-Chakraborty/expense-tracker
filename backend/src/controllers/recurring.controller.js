const RecurringExpense = require('../models/recurring.model');
const Expense = require('../models/expense.model');

const createRecurring = async (req, res) => {
  try {
    const { title, amount, category, frequency, nextDate, notes } = req.body;
    if (!title || !amount || !nextDate) {
      return res.status(400).json({ message: 'Title, amount and nextDate are required' });
    }
    const recurring = await RecurringExpense.create({
      userId: req.user.id, title, amount, category, frequency, nextDate, notes
    });
    return res.status(201).json({ message: 'Recurring expense created', recurring });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getRecurring = async (req, res) => {
  try {
    const recurring = await RecurringExpense.findAll({
      where: { userId: req.user.id, isActive: true },
      order: [['nextDate', 'ASC']],
    });
    return res.status(200).json({ recurring });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteRecurring = async (req, res) => {
  try {
    const recurring = await RecurringExpense.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!recurring) return res.status(404).json({ message: 'Not found' });
    await recurring.update({ isActive: false });
    return res.status(200).json({ message: 'Recurring expense deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const processRecurring = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const dueExpenses = await RecurringExpense.findAll({
      where: { nextDate: today, isActive: true },
      raw: true,
    });

    for (const exp of dueExpenses) {
      await Expense.create({
        userId: exp.userId,
        title: exp.title + ' (Auto)',
        amount: exp.amount,
        category: exp.category,
        date: today,
        notes: 'Auto-logged recurring expense',
      });

      const next = new Date(exp.nextDate);
      if (exp.frequency === 'daily') next.setDate(next.getDate() + 1);
      else if (exp.frequency === 'weekly') next.setDate(next.getDate() + 7);
      else if (exp.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
      else if (exp.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);

      await RecurringExpense.update(
        { nextDate: next.toISOString().split('T')[0] },
        { where: { id: exp.id } }
      );
    }
    console.log('Processed ' + dueExpenses.length + ' recurring expenses');
  } catch (error) {
    console.error('Recurring process error:', error.message);
  }
};

module.exports = { createRecurring, getRecurring, deleteRecurring, processRecurring };