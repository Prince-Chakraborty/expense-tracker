const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { validate, expenseSchema } = require('../middleware/validation.middleware');
const { apiLimiter } = require('../middleware/rateLimit.middleware');
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require('../controllers/expense.controller');

router.use(protect);
router.use(apiLimiter);

router.post('/', validate(expenseSchema), createExpense);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
