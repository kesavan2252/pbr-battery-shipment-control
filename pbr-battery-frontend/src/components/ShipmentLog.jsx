import React, { useState, useMemo } from 'react';

function ShipmentLog({ shipmentLogs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredAndSearchedLogs = useMemo(() => {
    return shipmentLogs.filter(log => {
      const matchesSearch = log.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.initiatedBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || log.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [shipmentLogs, searchTerm, filterStatus]);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <div className="p-4 bg-white border-b border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search shipments by ID or user..."
          className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="BLOCKED">Blocked</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Shipment ID
            </th>
            <th
              scope="col"
              className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Batteries Shipped
            </th>
            <th
              scope="col"
              className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Timestamp
            </th>
            <th
              scope="col"
              className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Initiated By
            </th>
            <th
              scope="col"
              className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email Alert {/* Changed column header */}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredAndSearchedLogs.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-center text-gray-500 text-sm">
                No shipments found matching your criteria.
              </td>
            </tr>
          ) : (
            filteredAndSearchedLogs.map((log) => (
              <tr key={log.shipmentId} className="hover:bg-gray-50">
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {log.shipmentId}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700">
                  {log.batteriesShipped}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${log.status === 'APPROVED' ? 'bg-green-100 text-green-800' : ''}
                      ${log.status === 'BLOCKED' ? 'bg-red-100 text-red-800' : ''}
                      ${log.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700">
                  {log.initiatedBy}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-center">
                  {log.isEmailAlertSent ? (
                    <span className="flex items-center justify-center text-red-500 text-base sm:text-lg" title="Email Alert Sent">
                      📧 <span className="ml-1 text-xs sm:text-sm text-gray-600">Email Sent</span>
                    </span>
                  ) : (
                    <span className="text-gray-500 text-xs sm:text-sm">No Alert</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ShipmentLog;