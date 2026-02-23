const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { exportCSV } = require('../controllers/export.controller');

router.use(protect);
router.get('/csv', exportCSV);

module.exports = router;