import React from 'react';

function ContractSummary({ contract }) {
  if (!contract) {
    return (
      <div className="text-center text-gray-600 text-sm p-4">
        Select a contract to view its summary.
      </div>
    );
  }

  const remaining = contract.threshold - contract.batteriesShipped;
  const isOverThreshold = remaining < 0;

  return (
    <div className="p-2">
      <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">Contract Summary</h3>
      <div className="text-sm sm:text-base text-gray-700 space-y-1">
        <p><strong>Contract ID:</strong> {contract.contractId}</p>
        <p><strong>Devices:</strong> {contract.deviceCount}</p>
        <p><strong>Shipment Threshold:</strong> {contract.threshold}</p>
        <p><strong>Shipped:</strong> {contract.batteriesShipped}</p>
        <p>
          <strong>Remaining:</strong>
          <span className={`font-bold ml-1 ${isOverThreshold ? 'text-red-600' : 'text-green-600'}`}>
            {isOverThreshold ? `-${Math.abs(remaining)} (OVER)` : remaining}
          </span>
        </p>
        <p><strong>Last Updated:</strong> {new Date(contract.lastUpdated).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default ContractSummary;