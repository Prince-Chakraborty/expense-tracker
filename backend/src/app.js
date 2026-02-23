const express = require('express');
const http = require('http');
const cors = require('cors');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const expenseRoutes = require('./routes/expense.routes');
const ocrRoutes = require('./routes/ocr.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const importRoutes = require('./routes/import.routes');
const { initWebSocket } = require('./services/websocket.service');
const { setupSwagger } = require('./config/swagger');
const { errorHandler, notFound } = require('./middleware/error.middleware');
const recurringRoutes = require('./routes/recurring.routes');
const { processRecurring } = require('./controllers/recurring.controller');
const exportRoutes = require('./routes/export.routes');
const passport = require('./config/passport');
const session = require('express-session');
const oauthRoutes = require('./routes/oauth.routes');
const adminRoutes = require('./routes/admin.routes');
const budgetRoutes = require('./routes/budget.routes');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(session({ secret: process.env.JWT_ACCESS_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/import', importRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/budgets', budgetRoutes);

initWebSocket(server);
setInterval(processRecurring, 24 * 60 * 60 * 1000);
setupSwagger(app);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const start = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
    console.log('WebSocket server ready');
    processRecurring();
  });
};

start();

module.exports = app;
