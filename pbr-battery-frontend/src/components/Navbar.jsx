import React from 'react';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location = '/login';
  };

  return (
    <nav className="bg-blue-600 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-800 text-xl font-bold">
            PBR Battery System
          </span>
          
          <div className="flex items-center gap-4 bg-white-200">
            <div className="text-right">
              <p className="font-large text-white-100  ">{user?.name}</p>
              <p className="text-sm text-white-100"> Welcome,
                {user?.role === 'admin' ? 'Admin' : 'User'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
