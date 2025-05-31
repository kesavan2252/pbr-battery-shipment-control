const mongoose = require('mongoose');

const PBRContractSchema = new mongoose.Schema({
  contractId: {
    type: String,
    required: true,
    unique: true,
  },
  deviceCount: {
    type: Number,
    required: true,
  },
  batteriesShipped: {
    type: Number,
    default: 0,
  },
  threshold: {
    type: Number,
    required: true,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  notificationsSent: [
    {
      email: String,
      timestamp: { type: Date, default: Date.now },
      message: String,
    },
  ],
}, { timestamps: true }); // Adding timestamps for consistency

const PBRContract = mongoose.model('PBRContract', PBRContractSchema);

module.exports = PBRContract;