const WebSocket = require('ws');

let wss;
const clients = new Map();

const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        if (data.userId) {
          clients.set(data.userId, ws);
          console.log('User ' + data.userId + ' connected to WebSocket');
        }
      } catch (error) {
        console.error('WebSocket message error:', error.message);
      }
    });

    ws.on('close', () => {
      clients.forEach((client, userId) => {
        if (client === ws) clients.delete(userId);
      });
      console.log('WebSocket client disconnected');
    });
  });
};

const sendAlert = (userId, message, type = 'warning') => {
  const client = clients.get(userId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({ type, message, timestamp: new Date() }));
  }
};

const sendBudgetAlert = (userId, category, amount, budget) => {
  sendAlert(userId, `⚠️ Budget Alert: ${category} spending ₹${amount} exceeded budget of ₹${budget}!`, 'budget_alert');
};

const sendAnomalyAlert = (userId, expense) => {
  sendAlert(userId, `🚨 Anomaly Detected: Unusual expense of ₹${expense.amount} for "${expense.title}"`, 'anomaly_alert');
};

module.exports = { initWebSocket, sendAlert, sendBudgetAlert, sendAnomalyAlert };
