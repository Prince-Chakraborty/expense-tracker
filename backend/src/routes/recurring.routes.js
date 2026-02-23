const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createRecurring, getRecurring, deleteRecurring } = require('../controllers/recurring.controller');

router.use(protect);
router.post('/', createRecurring);
router.get('/', getRecurring);
router.delete('/:id', deleteRecurring);

module.exports = router;