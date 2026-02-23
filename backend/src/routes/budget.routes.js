const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { setBudget, getBudgets, deleteBudget } = require('../controllers/budget.controller');
const { validate, budgetSchema } = require('../middleware/validation.middleware');

router.use(protect);
router.post('/', validate(budgetSchema), setBudget);
router.get('/', getBudgets);
router.delete('/:id', deleteBudget);

module.exports = router;