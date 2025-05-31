import React from 'react';

function ThresholdVisualization({ batteriesShipped, threshold }) {
  if (threshold === 0) {
    return (
      <div className="text-center text-gray-600 text-sm p-4">
        Threshold is 0. Cannot visualize.
      </div>
    );
  }

  const percentage = Math.min(100, (batteriesShipped / threshold) * 100);
  const isApproachingLimit = percentage >= 80;
  const isExceededLimit = batteriesShipped >= threshold;

  return (
    <div className="w-full max-w-xs sm:max-w-sm text-center p-2">
      <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">Shipment Progress</h3>
      <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out
            ${isExceededLimit ? 'bg-red-700' : isApproachingLimit ? 'bg-red-500' : 'bg-blue-500'}
          `}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-sm sm:text-base font-medium text-gray-700">
        Shipped: {batteriesShipped}/{threshold} ({percentage.toFixed(0)}%)
      </p>
      {isExceededLimit && (
        <p className="text-xs sm:text-sm text-red-700 font-bold mt-1 animate-pulse">
          ⚠ Shipment Limit EXCEEDED!
        </p>
      )}
      {!isExceededLimit && isApproachingLimit && (
        <p className="text-xs sm:text-sm text-orange-600 font-medium mt-1">
          ⚠ Approaching shipment limit!
        </p>
      )}
    </div>
  );
}

export default ThresholdVisualization;