import { useEffect, useState } from 'react';

const useWebSocket = (userId: string) => {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    let ws: WebSocket;

    try {
      ws = new WebSocket('wss://expense-tracker-7n2z.onrender.com');

      ws.onopen = () => {
        ws.send(JSON.stringify({ userId }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setAlerts((prev) => [data, ...prev]);
        } catch (e) {}
      };

      ws.onerror = () => {
        console.log('WebSocket not available');
      };
    } catch (e) {
      console.log('WebSocket not available');
    }

    return () => {
      if (ws) ws.close();
    };
  }, [userId]);

  return { alerts };
};

export default useWebSocket;
