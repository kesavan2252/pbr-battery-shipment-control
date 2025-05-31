import React, { useState } from 'react';

function AddShipmentModal({ onClose, onAddShipment, contracts, selectedContractId }) {
  const [contractId, setContractId] = useState(selectedContractId || (contracts.length > 0 ? contracts[0].contractId : ''));
  const [batteriesShipped, setBatteriesShipped] = useState('');
  const [initiatedBy, setInitiatedBy] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const shippedQty = parseInt(batteriesShipped);
    if (isNaN(shippedQty) || shippedQty <= 0) {
      setError('Please enter a valid positive number for batteries shipped.');
      return;
    }

    if (!contractId) {
        setError('Please select a contract.');
        return;
    }
    if (!initiatedBy.trim()) {
        setError('Please enter who initiated the shipment.');
        return;
    }

    onAddShipment({ contractId, batteriesShipped: shippedQty, initiatedBy });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">Add New Shipment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-contract-id" className="block text-gray-700 text-sm font-bold mb-2">
              Contract ID
            </label>
            <select
              id="modal-contract-id"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-700 text-sm"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              required
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
          <div>
            <label htmlFor="modal-batteries-shipped" className="block text-gray-700 text-sm font-bold mb-2">
              Batteries Shipped
            </label>
            <input
              type="number"
              id="modal-batteries-shipped"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
              placeholder="e.g., 50"
              value={batteriesShipped}
              onChange={(e) => setBatteriesShipped(e.target.value)}
              min="1"
              required
            />
          </div>
          <div>
            <label htmlFor="modal-initiated-by" className="block text-gray-700 text-sm font-bold mb-2">
              Initiated By
            </label>
            <input
              type="text"
              id="modal-initiated-by"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
              placeholder="e.g., John Doe or System"
              value={initiatedBy}
              onChange={(e) => setInitiatedBy(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Add Shipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddShipmentModal;