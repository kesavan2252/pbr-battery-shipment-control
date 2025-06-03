import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000';

export default function DashboardPage() {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const socket = io(API_URL, {
      transports: ['websocket'],
      autoConnect: true
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/pbr/contracts`);
      setContracts(response.data);
      if (response.data.length > 0) {
        setSelectedContract(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('Failed to fetch contracts');
    }
  };

  const handleContractLockToggle = async (contractId) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/pbr/contracts/${contractId}/toggle-lock`,
        { isLocked: !selectedContract.isLocked },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setContracts(prev =>
          prev.map(contract =>
            contract.contractId === contractId
              ? { ...contract, isLocked: !contract.isLocked }
              : contract
          )
        );
        setSelectedContract(prev => ({ ...prev, isLocked: !prev.isLocked }));
        toast.success(`Contract ${!selectedContract.isLocked ? 'locked' : 'unlocked'} successfully`);
      }
    } catch (error) {
      console.error('Error toggling contract lock:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle contract lock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Contract</h2>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedContract?.contractId || ''}
              onChange={(e) => {
                const contract = contracts.find(c => c.contractId === e.target.value);
                setSelectedContract(contract);
              }}
            >
              {contracts.map(contract => (
                <option key={contract.contractId} value={contract.contractId}>
                  {contract.contractId}
                </option>
              ))}
            </select>
          </div>

          {selectedContract && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contract Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Contract ID:</span> {selectedContract.contractId}</p>
                  <p><span className="font-medium">Devices:</span> {selectedContract.deviceCount}</p>
                  <p><span className="font-medium">Threshold:</span> {selectedContract.threshold}</p>
                  <p><span className="font-medium">Shipped:</span> {selectedContract.batteriesShipped}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipment Progress</h3>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{
                        width: `${(selectedContract.batteriesShipped / selectedContract.threshold) * 100}%`
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    {selectedContract.batteriesShipped} / {selectedContract.threshold}
                    ({Math.round((selectedContract.batteriesShipped / selectedContract.threshold) * 100)}%)
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Lock Status</h3>
                <div className="flex flex-col items-center">
                  <span
                    className={`text-lg font-bold mb-4 ${
                      selectedContract.isLocked ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {selectedContract.isLocked ? 'LOCKED' : 'UNLOCKED'}
                  </span>
                  <button
                    onClick={() => handleContractLockToggle(selectedContract.contractId)}
                    disabled={loading}
                    className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                      loading
                        ? 'bg-gray-400'
                        : selectedContract.isLocked
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {loading ? 'Processing...' : selectedContract.isLocked ? 'Unlock Contract' : 'Lock Contract'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}