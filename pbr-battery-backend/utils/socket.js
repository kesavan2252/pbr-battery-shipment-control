const { Server } = require('socket.io');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173", // Your frontend URL
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

// Emitter functions to send specific events
const emitNewShipment = (shipment) => {
  if (io) {
    io.emit('shipmentUpdate', shipment);
  } else {
    console.warn('Socket.IO not initialized, cannot emit new shipment.');
  }
};

const emitContractUpdate = (contract) => {
  if (io) {
    io.emit('contractUpdate', contract);
  } else {
    console.warn('Socket.IO not initialized, cannot emit contract update.');
  }
};

module.exports = {
  initSocket,
  emitNewShipment,
  emitContractUpdate
};