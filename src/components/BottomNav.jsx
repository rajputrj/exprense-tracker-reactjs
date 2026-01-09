import { Home, Plus, TrendingUp, User } from 'lucide-react';

function BottomNav({ activeTab, onTabChange, onAddExpenseClick }) {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      onClick: () => onTabChange('dashboard')
    },
    {
      id: 'add',
      label: 'Add',
      icon: Plus,
      onClick: onAddExpenseClick,
      isPrimary: true
    },
    {
      id: 'summary',
      label: 'Summary',
      icon: TrendingUp,
      onClick: () => onTabChange('summary')
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      onClick: () => onTabChange('profile')
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden animate-slideUp">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                onClick={tab.onClick}
                className="flex flex-col items-center justify-center w-16 h-16 -mt-6 bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label={tab.label}
              >
                <Icon className="w-6 h-6 text-white transition-transform duration-300 hover:rotate-90" />
              </button>
            );
          }
          
          return (
            <button
              key={tab.id}
              onClick={tab.onClick}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
                isActive
                  ? 'text-blue-500 scale-105'
                  : 'text-gray-500 hover:text-gray-700 hover:scale-105'
              }`}
              aria-label={tab.label}
            >
              <Icon className={`w-5 h-5 mb-1 transition-all duration-300 ${isActive ? 'text-blue-500 scale-110' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium transition-all duration-300 ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;

