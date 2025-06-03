// controllers/pbrController.js

const PBRContract = require('../models/PBRContract');
const ShipmentLog = require('../models/ShipmentLog');
const mongoose = require('mongoose');
const { sendPBRAlertEmail } = require('../services/emailService');
const { emitNewShipment, emitContractUpdate } = require('../utils/socket');

// GET /api/pbr/contracts
const getContracts = async (req, res) => {
  try {
    const contracts = await PBRContract.find({});
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contracts', error: error.message });
  }
};

// GET /api/pbr/shipments/:contractId
const getShipments = async (req, res) => {
  try {
    const { contractId } = req.params;
    const shipments = await ShipmentLog.find({ contractId }).sort({ timestamp: -1 });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shipments', error: error.message });
  }
};

// POST /api/pbr/shipments
const addShipment = async (req, res) => {
  const { contractId, batteriesShipped, initiatedBy } = req.body;

  if (!contractId || !batteriesShipped || !initiatedBy) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const contract = await PBRContract.findOne({ contractId }).session(session);

    if (!contract) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.isLocked) {
      const blockedShipment = new ShipmentLog({
        shipmentId: `SH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        contractId,
        batteriesShipped,
        status: 'BLOCKED',
        initiatedBy,
        isEmailAlertSent: false
      });

      await blockedShipment.save({ session });
      await session.commitTransaction();
      session.endSession();

      emitNewShipment(blockedShipment);
      return res.status(400).json({ message: 'Contract is locked, shipment blocked.', status: 'BLOCKED' });
    }

    const newTotalShipped = contract.batteriesShipped + batteriesShipped;
    let shipmentStatus = 'APPROVED';
    let isEmailAlertSent = false;

    if (newTotalShipped > contract.threshold) {
      shipmentStatus = 'BLOCKED';
      contract.isLocked = true;
      isEmailAlertSent = true;

      contract.notificationsSent.push({
        email: process.env.ALERT_RECIPIENTS,
        message: `Shipment limit reached, contract ${contractId} locked.`,
      });

      await sendPBRAlertEmail(contract);
    }

    if (shipmentStatus === 'APPROVED') {
      contract.batteriesShipped = newTotalShipped;
    }

    contract.lastUpdated = new Date();
    await contract.save({ session });

    const shipment = new ShipmentLog({
      shipmentId: `SH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      contractId,
      batteriesShipped,
      status: shipmentStatus,
      initiatedBy,
      isEmailAlertSent
    });

    await shipment.save({ session });

    await session.commitTransaction();
    session.endSession();

    emitNewShipment(shipment);
    emitContractUpdate(contract);

    res.status(201).json({ message: 'Shipment processed successfully', shipment, contract });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error adding shipment:', error);
    res.status(500).json({ message: 'Server error processing shipment', error: error.message });
  }
};

// PUT /api/pbr/contracts/:contractId/toggle-lock
async function toggleContractLock(req, res) {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const contract = await PBRContract.findById(req.params.id).session(session);
        
        if (!contract) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Contract not found' });
        }

        if (typeof req.body.isLocked !== 'boolean') {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Invalid isLocked value' });
        }

        contract.isLocked = req.body.isLocked;
        contract.lastUpdated = new Date();
        await contract.save({ session });
        
        await session.commitTransaction();
        res.status(200).json(contract);
    } catch (error) {
        await session.abortTransaction();
        console.error('Lock toggle error:', error);
        res.status(500).json({ 
            message: 'Error updating contract lock status',
            error: error.message 
        });
    } finally {
        session.endSession();
    }
}

// POST /api/pbr/seed-contracts
const seedContracts = async (req, res) => {
  try {
    await PBRContract.deleteMany({});
    await ShipmentLog.deleteMany({});

    const initialContracts = [
      { contractId: 'PBR-CON-001', deviceCount: 100, batteriesShipped: 0, threshold: 120, isLocked: false },
      { contractId: 'PBR-CON-002', deviceCount: 50, batteriesShipped: 0, threshold: 60, isLocked: false },
      { contractId: 'PBR-CON-003', deviceCount: 200, batteriesShipped: 0, threshold: 240, isLocked: false }
    ];

    await PBRContract.insertMany(initialContracts);
    res.status(201).json({ message: 'Contracts seeded', contracts: initialContracts });

  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ message: 'Failed to seed contracts', error: error.message });
  }
};

// ✅ Export all handlers as an object
module.exports = {
  getContracts,
  getShipments,
  addShipment,
  toggleContractLock,
  seedContracts
};
