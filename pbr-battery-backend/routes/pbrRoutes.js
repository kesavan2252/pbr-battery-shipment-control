// routes/pbrRoutes.js

const express = require('express');
const router = express.Router();

const {
  getContracts,
  getShipments,
  addShipment,
  toggleContractLock,
  seedContracts
} = require('../controllers/pbrController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Routes
router.get('/contracts', protect, getContracts);
router.get('/shipments/:contractId', protect, getShipments);
router.post('/shipments', protect, addShipment);

// Admin-specific routes
router.put('/contracts/:contractId/toggle-lock', protect, authorizeRoles('admin'), toggleContractLock);
router.post('/seed-contracts', protect, authorizeRoles('admin'), seedContracts);

module.exports = router;
