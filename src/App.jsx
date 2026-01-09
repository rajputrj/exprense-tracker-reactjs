import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Summary from './components/Summary';
import Profile from './components/Profile';
import Header from './components/Header';
import AddExpenseModal from './components/AddExpenseModal';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import Toast from './components/Toast';
import { getExpenses, createExpense, deleteExpense } from './services/api';

const AUTH_KEY = 'isAuthenticated';
const AUTH_TIMESTAMP_KEY = 'authTimestamp';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);

  // Secure authentication check
  const checkAuthentication = () => {
    const authStatus = localStorage.getItem(AUTH_KEY);
    const authTimestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
    
    if (authStatus === 'true' && authTimestamp) {
      const timestamp = parseInt(authTimestamp);
      const now = Date.now();
      // Check if session is still valid (within 24 hours)
      if (now - timestamp < SESSION_DURATION) {
        return true;
      } else {
        // Session expired, clear auth
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(AUTH_TIMESTAMP_KEY);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    // Check authentication on mount
    if (checkAuthentication()) {
      setIsAuthenticated(true);
      loadExpenses();
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }

    // Check authentication on window focus (prevents direct access attempts)
    const handleFocus = () => {
      if (!checkAuthentication()) {
        setIsAuthenticated(false);
        setExpenses([]);
      }
    };

    // Check authentication on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !checkAuthentication()) {
        setIsAuthenticated(false);
        setExpenses([]);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleLogin = () => {
    // Set authentication with timestamp
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
    setIsAuthenticated(true);
    loadExpenses();
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    setIsAuthenticated(false);
    setExpenses([]);
  };

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const newExpense = await createExpense(expenseData);
      setExpenses([...expenses, newExpense]);
      setIsModalOpen(false);
      showToast('Expense added successfully!', 'success');
    } catch (error) {
      console.error('Failed to add expense:', error);
      showToast('Failed to add expense. Please try again.', 'error');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter(exp => exp.id !== id));
      showToast('Expense deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete expense:', error);
      showToast('Failed to delete expense. Please try again.', 'error');
    }
  };

  // Show login page if not authenticated - SECURE: No direct access allowed
  if (!isAuthenticated) {
    // Clear any stale data when showing login
    if (expenses.length > 0) {
      setExpenses([]);
    }
    return <Login onLogin={handleLogin} />;
  }

  // Render content based on active tab
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 animate-fadeIn">
          <div className="spinner mb-4"></div>
          <div className="text-gray-500 animate-pulse-slow">Loading expenses...</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="animate-fadeIn">
            <Dashboard 
              expenses={expenses} 
              loading={loading}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
        );
      case 'summary':
        return (
          <div className="animate-fadeIn">
            <Summary expenses={expenses} />
          </div>
        );
      case 'profile':
        return (
          <div className="animate-fadeIn">
            <Profile onLogout={handleLogout} />
          </div>
        );
      default:
        return (
          <div className="animate-fadeIn">
            <Dashboard 
              expenses={expenses} 
              loading={loading}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
        );
    }
  };

  // Only show dashboard if authenticated
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header 
        onAddExpenseClick={() => setIsModalOpen(true)}
        onLogout={handleLogout}
      />
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>
      
      {/* Bottom Navigation - Mobile Only */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddExpenseClick={() => setIsModalOpen(true)}
      />
      
      {isModalOpen && (
        <AddExpenseModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddExpense}
        />
      )}
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;

