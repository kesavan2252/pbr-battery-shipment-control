const mongoose = require('mongoose');

const ShipmentLogSchema = new mongoose.Schema({
  shipmentId: {
    type: String,
    required: true,
    unique: true,
  },
  contractId: {
    type: String,
    required: true,
    ref: 'PBRContract',
  },
  batteriesShipped: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['APPROVED', 'BLOCKED', 'PENDING'],
    required: true,
  },
  initiatedBy: {
    type: String,
    required: true,
  },
  isEmailAlertSent: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true }); // Adding timestamps

const ShipmentLog = mongoose.model('ShipmentLog', ShipmentLogSchema);

module.exports = ShipmentLog;