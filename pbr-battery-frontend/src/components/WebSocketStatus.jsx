import React from 'react';

function WebSocketStatus({ status, lastUpdated }) {
  const statusColor = status === 'Live' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-700">
      <span className={`inline-block w-3 h-3 rounded-full ${statusColor}`}></span>
      <span className="font-medium">{status}</span>
      {lastUpdated && (
        <span className="ml-2 text-gray-500">
          Last updated: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

export default WebSocketStatus;