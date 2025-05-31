import React from 'react';
import { useAuth } from '../hooks/useAuth'; // Import useAuth to check isAdmin

function ContractLockToggle({ contractId, isLocked, onToggle }) {
  const { isAdmin } = useAuth(); // Get isAdmin status

  const handleToggle = () => {
    if (isAdmin) { // Only allow toggle if user is admin
      // In a real app, this would trigger an API call to update the contract's lock status
      onToggle(contractId, !isLocked);
    } else {
      alert("You do not have administrative privileges to perform this action.");
    }
  };

  return (
    <div className="text-center p-2">
      <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">Contract Lock Status</h3>
      <p className={`text-xl sm:text-2xl font-bold ${isLocked ? 'text-red-600' : 'text-green-600'} mb-4`}>
        {isLocked ? 'LOCKED' : 'UNLOCKED'}
      </p>
      <button
        onClick={handleToggle}
        className={`py-2 px-4 sm:px-6 rounded-md font-semibold transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75
          ${isAdmin
            ? (isLocked ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white')
            : 'bg-gray-400 text-gray-700 cursor-not-allowed' // Grey out if not admin
          }
        `}
        disabled={!isAdmin} // Disable button if not admin
      >
        {isLocked ? 'Unlock Contract' : 'Lock Contract'}
      </button>
      <p className="text-xs text-gray-500 mt-2">
        Admin action: Overrides automatic lock.
      </p>
    </div>
  );
}

export default ContractLockToggle;