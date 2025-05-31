import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000'; // Fallback for local
let socket;

export const initSocket = (setStatus) => {
  if (socket) return; // Prevent multiple connections

  socket = io(WS_URL, {
    transports: ['websocket'], // Prefer WebSocket
    auth: {
      token: localStorage.getItem('jwt_token') // Send JWT token for authentication
    }
  });

  socket.on('connect', () => {
    console.log('WebSocket Connected');
    setStatus('Live');
  });

  socket.on('disconnect', (reason) => {
    console.log('WebSocket Disconnected:', reason);
    setStatus('Disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket Connection Error:', error);
    setStatus('Disconnected');
  });

  // Handle JWT authentication failure from server side if implemented
  socket.on('auth_error', (message) => {
    console.error('WebSocket Auth Error:', message);
    // Potentially clear token and redirect to login
    localStorage.removeItem('jwt_token');
    // window.location.href = '/login'; // Or use useNavigate if this is inside a component
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToShipments = (callback) => {
  if (!socket) {
    console.error("Socket not initialized. Call initSocket first.");
    return;
  }
  socket.on('newShipment', callback);
};

export const subscribeToContractUpdates = (callback) => {
  if (!socket) {
    console.error("Socket not initialized. Call initSocket first.");
    return;
  }
  socket.on('contractUpdate', callback);
};

// Example of emitting an event (e.g., from AddShipmentModal)
export const emitAddShipment = (shipmentData) => {
  if (!socket) {
    console.error("Socket not initialized. Cannot emit shipment.");
    return;
  }
  // In a real app, this would be an API call, and backend emits newShipment
  // For dummy data, we'll simulate the state update directly in DashboardPage.jsx
  console.log('Simulating WebSocket emit for addShipment:', shipmentData);
  // socket.emit('addShipment', shipmentData); // Backend would listen to this
};
// src/data/dummyData.js

export const dummyContracts = [
    {
      contractId: 'PBR-CON-001',
      deviceCount: 100,
      batteriesShipped: 75,
      threshold: 120, // 100 * 1.2
      isLocked: false,
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
      notificationsSent: [],
    },
    {
      contractId: 'PBR-CON-002',
      deviceCount: 50,
      batteriesShipped: 60,
      threshold: 60, // 50 * 1.2
      isLocked: true,
      lastUpdated: new Date(Date.now() - 60 * 60 * 1000),
      notificationsSent: [],
    },
    {
      contractId: 'PBR-CON-003',
      deviceCount: 200,
      batteriesShipped: 10,
      threshold: 240, // 200 * 1.2
      isLocked: false,
      lastUpdated: new Date(Date.now() - 90 * 60 * 1000),
      notificationsSent: [],
    },
  ];
  
  export const dummyShipments = [
    {
      shipmentId: 'SH-001',
      contractId: 'PBR-CON-001',
      batteriesShipped: 10,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'APPROVED',
      initiatedBy: 'System',
      isEmailAlertSent: false,
    },
    {
      shipmentId: 'SH-002',
      contractId: 'PBR-CON-001',
      batteriesShipped: 20,
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: 'APPROVED',
      initiatedBy: 'User A',
      isEmailAlertSent: false,
    },
    {
      shipmentId: 'SH-003',
      contractId: 'PBR-CON-002',
      batteriesShipped: 15,
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'BLOCKED',
      initiatedBy: 'User B',
      isEmailAlertSent: true,
    },
    {
      shipmentId: 'SH-004',
      contractId: 'PBR-CON-001',
      batteriesShipped: 5,
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      status: 'APPROVED',
      initiatedBy: 'System',
      isEmailAlertSent: false,
    },
    {
      shipmentId: 'SH-005',
      contractId: 'PBR-CON-003',
      batteriesShipped: 10,
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      status: 'APPROVED',
      initiatedBy: 'User C',
      isEmailAlertSent: false,
    },
    {
      shipmentId: 'SH-006',
      contractId: 'PBR-CON-001',
      batteriesShipped: 40,
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      status: 'APPROVED',
      initiatedBy: 'User C',
      isEmailAlertSent: true,
    }
  ];