require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const http = require('http'); // Required for Socket.IO
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const pbrRoutes = require('./routes/pbrRoutes');
const { initSocket } = require('./utils/socket'); // Import initSocket

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO

// Initialize Socket.IO
initSocket(server); // Pass the http server to initSocket

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})); // Allow cross-origin requests
app.use(express.json()); // Body parser for JSON data

// Routes
// Verify route mounting
app.use('/api/auth', authRoutes);
app.use('/api/pbr', pbrRoutes);

// Basic home route
app.get('/', (req, res) => {
  res.send('PBR Battery Shipment Monitoring API is running...');
});

const PORT = process.env.PORT || 5000; // Use port 5000 as specified earlier

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});