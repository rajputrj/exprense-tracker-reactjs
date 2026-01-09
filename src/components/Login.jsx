import { useState } from 'react';
import { LogIn, Clock } from 'lucide-react';

const STATIC_USERNAME = 'ayodhya';
const STATIC_PASSWORD = 'ayodhya';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.username === STATIC_USERNAME && formData.password === STATIC_PASSWORD) {
      // Store login state in localStorage with timestamp for security
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authTimestamp', Date.now().toString());
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SpendSmart</h1>
          <p className="text-gray-600 text-sm">Expense Tracker</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Expense tracking made simple
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

