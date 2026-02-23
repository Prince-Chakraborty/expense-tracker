const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getCategoryStats, getMonthlyStats, getAnomalies, getStats } = require('../controllers/analytics.controller');

router.use(protect);

router.get('/categories', getCategoryStats);
router.get('/monthly', getMonthlyStats);
router.get('/anomalies', getAnomalies);
router.get('/stats', getStats);

module.exports = router;
