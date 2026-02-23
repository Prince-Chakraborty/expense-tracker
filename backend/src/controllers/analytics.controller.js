const { getCategoryBreakdown, getMonthlyTrends, detectAnomalies, getTotalStats } = require('../services/analytics.service');
const { setCache, getCache } = require('../services/cache.service');

const getCategoryStats = async (req, res) => {
  try {
    const cacheKey = `analytics:categories:${req.user.id}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json({ data: cached, fromCache: true });

    const data = await getCategoryBreakdown(req.user.id);
    await setCache(cacheKey, data, 300);
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMonthlyStats = async (req, res) => {
  try {
    const cacheKey = `analytics:monthly:${req.user.id}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json({ data: cached, fromCache: true });

    const data = await getMonthlyTrends(req.user.id);
    await setCache(cacheKey, data, 300);
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAnomalies = async (req, res) => {
  try {
    const data = await detectAnomalies(req.user.id);
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const cacheKey = `analytics:stats:${req.user.id}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json({ data: cached, fromCache: true });

    const data = await getTotalStats(req.user.id);
    await setCache(cacheKey, data, 300);
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategoryStats, getMonthlyStats, getAnomalies, getStats };
