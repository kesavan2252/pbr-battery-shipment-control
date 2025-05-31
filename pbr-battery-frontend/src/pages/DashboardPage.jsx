// src/pages/DashboardPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import ShipmentLog from '../components/ShipmentLog';
import ThresholdVisualization from '../components/ThresholdVisualization';
import ContractLockToggle from '../components/ContractLockToggle';
import ContractSummary from '../components/ContractSummary';
import AddShipmentModal from '../components/AddShipmentModal';
import WebSocketStatus from '../components/WebSocketStatus';
//import { dummyContracts, dummyShipments } from '../data/dummydata'; // Make sure to uncomment and use dummy data if not fetching from API initially
import { useAuth } from '../hooks/useAuth';
import { initSocket, disconnectSocket, subscribeToShipments, subscribeToContractUpdates } from '../services/websocket';
import api from '../services/api';

function DashboardPage() {
  const [contracts, setContracts] = useState([]);
  const [shipmentLogs, setShipmentLogs] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState('');
  const [isAddShipmentModalOpen, setIsAddShipmentModalOpen] = useState(false);
  const [webSocketStatus, setWebSocketStatus] = useState('Disconnected');
  const [lastUpdated, setLastUpdated] = useState(null);

  const { isAdmin } = useAuth();

  // --- API Callbacks ---
  const fetchContracts = useCallback(async () => {
    try {
      const response = await api.get('/api/pbr/contracts');
      setContracts(response.data);
      if (response.data.length > 0) {
        setSelectedContractId(response.data[0].contractId);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      // Handle error, e.g., show a message
    }
  }, []);

  const fetchShipmentLogs = useCallback(async (contractId) => {
    if (!contractId) {
      setShipmentLogs([]);
      return;
    }
    try {
      const response = await api.get(`/api/pbr/shipments/${contractId}`);
      setShipmentLogs(response.data);
    } catch (error) {
      console.error(`Error fetching shipments for ${contractId}:`, error);
      // Handle error
    }
  }, []);

  const handleContractLockToggle = async (contractId, newIsLockedStatus) => {
    try {
      const response = await api.put(`/api/pbr/contracts/${contractId}/toggle-lock`, { isLocked: newIsLockedStatus });
      console.log(response.data.message);
      // The socket.io update will refresh the contract data, no need to set state directly here
    } catch (error) {
      console.error('Error toggling contract lock:', error.response?.data?.message || error.message);
      alert('Failed to toggle contract lock. Check console for details.');
    }
  };

  const handleAddShipment = useCallback(async (newShipmentData) => {
    try {
      const response = await api.post('/api/pbr/shipments', newShipmentData);
      console.log(response.data.message);
      // Socket.io will push the new shipment and updated contract, so we just close the modal
      setIsAddShipmentModalOpen(false);
    } catch (error) {
      console.error('Error adding shipment:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Failed to add shipment. Check console for details.');
    }
  }, []);

  // --- WebSocket Management ---
  useEffect(() => {
    initSocket(setWebSocketStatus);

    subscribeToShipments((newShipment) => {
      // Check if the new shipment is for the currently selected contract
      if (newShipment.contractId === selectedContractId) {
        setShipmentLogs(prev => [newShipment, ...prev]);
      }
      setLastUpdated(new Date());
      // If it's a contract update, re-fetch contracts to ensure UI is fresh
      fetchContracts(); // Re-fetch contracts to update shipped count and lock status
    });

    subscribeToContractUpdates((updatedContract) => {
      setContracts(prev => prev.map(c => c.contractId === updatedContract.contractId ? updatedContract : c));
      setLastUpdated(new Date());
    });

    return () => {
      disconnectSocket();
    };
  }, [selectedContractId, fetchContracts]); // Add selectedContractId to dependency array, and fetchContracts

  // --- Initial Data Fetch on Component Mount ---
  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]); // Call fetchContracts only once on mount

  // --- Fetch shipments whenever selectedContractId changes ---
  useEffect(() => {
    fetchShipmentLogs(selectedContractId);
  }, [selectedContractId, fetchShipmentLogs]);

  // Derive selected contract and filtered shipment logs
  const selectedContract = contracts.find(
    (contract) => contract.contractId === selectedContractId
  );

  const filteredShipmentLogs = shipmentLogs.filter(
    (log) => log.contractId === selectedContractId
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <WebSocketStatus status={webSocketStatus} lastUpdated={lastUpdated} />
          {isAdmin && (
            <button
              onClick={() => setIsAddShipmentModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 text-sm sm:text-base"
            >
              Add Shipment
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Select Contract</h2>
          <select
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-700 text-sm sm:text-base transition duration-200 ease-in-out"
            value={selectedContractId}
            onChange={(e) => setSelectedContractId(e.target.value)}
          >
            {contracts.length === 0 ? (
              <option value="">No contracts available</option>
            ) : (
              contracts.map((contract) => (
                <option key={contract.contractId} value={contract.contractId}>
                  {contract.contractId}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
          {selectedContract ? (
            <ContractSummary contract={selectedContract} />
          ) : (
            <p className="text-gray-600 text-sm">Select a contract to view its summary.</p>
          )}
        </div>

        <div className="col-span-1 bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          {selectedContract ? (
            <ThresholdVisualization
              batteriesShipped={selectedContract.batteriesShipped}
              threshold={selectedContract.threshold}
            />
          ) : (
            <p className="text-gray-600 text-sm">Please select a contract to view threshold.</p>
          )}
        </div>

        <div className="col-span-1 bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          {selectedContract ? (
            <ContractLockToggle
              contractId={selectedContract.contractId}
              isLocked={selectedContract.isLocked}
              onToggle={handleContractLockToggle}
            />
          ) : (
            <p className="text-gray-600 text-sm">Please select a contract.</p>
          )}
        </div>
      </div>

      <div className="col-span-full bg-white p-6 rounded-lg shadow-md overflow-hidden">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Shipment Log for {selectedContractId}</h2>
        {selectedContractId ? (
          <ShipmentLog shipmentLogs={filteredShipmentLogs} />
        ) : (
          <p className="text-gray-600 text-sm">Select a contract to view its shipment history.</p>
        )}
      </div>

      {isAddShipmentModalOpen && (
        <AddShipmentModal
          onClose={() => setIsAddShipmentModalOpen(false)}
          onAddShipment={handleAddShipment}
          contracts={contracts}
          selectedContractId={selectedContractId}
        />
      )}
    </>
  );
}

export default DashboardPage;