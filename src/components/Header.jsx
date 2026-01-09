import { Clock, User, LogOut, Plus } from 'lucide-react';

function Header({ onAddExpenseClick, onLogout }) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">SpendSmart</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <span>Welcome back, Admin</span>
              <User className="w-5 h-5" />
            </div>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onAddExpenseClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

