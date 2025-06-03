import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/api'; // Fallback for local
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
  console.log('Simulating WebSocket emit for addShipment:', shipmentData);
  // socket.emit('addShipment', shipmentData); // Backend would listen to this
};