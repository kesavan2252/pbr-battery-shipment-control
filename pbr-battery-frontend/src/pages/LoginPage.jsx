import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700  p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md transform transition-all duration-300 hover:scale-105">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
          Welcome!
        </h2>
        <p className="text-center text-gray-600 text-lg mb-8">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 ease-in-out text-gray-800 text-base placeholder-gray-400"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 ease-in-out text-gray-800 text-base placeholder-gray-400"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg w-full text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-75 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600 text-xs sm:text-sm mt-8">
          Hint: Try 'admin' / 'admin123' or 'user' / 'userpass'
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
