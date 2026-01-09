import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Summary from './components/Summary';
import Profile from './components/Profile';
import UserManagement from './components/UserManagement';
import Settlements from './components/Settlements';
import Header from './components/Header';
import AddExpenseModal from './components/AddExpenseModal';
import BottomNav from './components/BottomNav';
import DesktopNav from './components/DesktopNav';
import Login from './components/Login';
import Toast from './components/Toast';
import Loader from './components/Loader';
import { getExpenses, createExpense, deleteExpense, getUsers } from './services/api';
import { getCurrentUser, logout as authLogout, isSuperAdmin } from './services/auth';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addingExpense, setAddingExpense] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  useEffect(() => {
    // Load user count from backend (excluding superadmin)
    const loadUserCount = async () => {
      try {
        const users = await getUsers();
        // Exclude superadmin from count
        const regularUsers = users.filter(user => user.role !== 'superadmin');
        setNumberOfPeople(regularUsers.length || 1);
      } catch (error) {
        console.error('Failed to load users:', error);
        setNumberOfPeople(1); // Default fallback
      }
    };

    loadUserCount();

    // Check authentication on mount
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      loadExpenses();
    } else {
      setLoading(false);
    }

    // Check authentication on window focus
    const handleFocus = () => {
      const user = getCurrentUser();
      if (!user) {
        setCurrentUser(null);
        setExpenses([]);
      }
    };

    // Check authentication on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const user = getCurrentUser();
        if (!user) {
          setCurrentUser(null);
          setExpenses([]);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    loadExpenses();
  };

  const handleLogout = () => {
    authLogout();
    setCurrentUser(null);
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

  const handleUserCreated = async () => {
    // Reload user count when a user is created or deleted (excluding superadmin)
    try {
      const users = await getUsers();
      // Exclude superadmin from count
      const regularUsers = users.filter(user => user.role !== 'superadmin');
      const newCount = regularUsers.length || 1;
      setNumberOfPeople(newCount);
      // Reload expenses to reflect new calculations (and remove deleted user's expenses)
      await loadExpenses();
    } catch (error) {
      console.error('Failed to reload user count:', error);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      setAddingExpense(true);
      const newExpense = await createExpense({
        ...expenseData,
        createdBy: currentUser.id
      });
      setExpenses([...expenses, newExpense]);
      setIsModalOpen(false);
      showToast('Expense added successfully!', 'success');
    } catch (error) {
      console.error('Failed to add expense:', error);
      showToast('Failed to add expense. Please try again.', 'error');
    } finally {
      setAddingExpense(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      setDeletingExpense(id);
      await deleteExpense(id, currentUser.id, currentUser.role);
      setExpenses(expenses.filter(exp => exp.id !== id));
      showToast('Expense deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete expense:', error);
      const errorMsg = error.response?.data?.error || 'Failed to delete expense. Please try again.';
      showToast(errorMsg, 'error');
    } finally {
      setDeletingExpense(null);
    }
  };

  // Show login page if not authenticated - SECURE: No direct access allowed
  if (!currentUser) {
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
          <Loader size="lg" text="Loading expenses..." />
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
              deletingExpense={deletingExpense}
              numberOfPeople={numberOfPeople}
              currentUser={currentUser}
            />
          </div>
        );
      case 'summary':
        return (
          <div className="animate-fadeIn">
            <Summary 
              expenses={expenses} 
              numberOfPeople={numberOfPeople}
              currentUser={currentUser}
            />
            {currentUser && currentUser.role === 'superadmin' ? (
              <div className="mt-8 border-t-2 border-blue-200 pt-8">
                <UserManagement onUserCreated={handleUserCreated} />
              </div>
            ) : (
              currentUser && (
                <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> User Management is only available for Super Admin users. 
                    You are currently logged in as: <strong>{currentUser.name}</strong> ({currentUser.role})
                  </p>
                </div>
              )
            )}
            <div className="mt-8">
              <Settlements 
                expenses={expenses} 
                numberOfPeople={numberOfPeople}
                currentUserId={currentUser?.id}
              />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="animate-fadeIn">
            <Profile 
              onLogout={handleLogout} 
              numberOfPeople={numberOfPeople}
            />
          </div>
        );
      default:
        return (
          <div className="animate-fadeIn">
            <Dashboard 
              expenses={expenses} 
              loading={loading}
              onDeleteExpense={handleDeleteExpense}
              deletingExpense={deletingExpense}
              numberOfPeople={numberOfPeople}
            />
          </div>
        );
    }
  };

  // Only show dashboard if authenticated
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header 
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      
      {/* Desktop Navigation */}
      <DesktopNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddExpenseClick={() => setIsModalOpen(true)}
      />
      
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
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
          isSubmitting={addingExpense}
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

