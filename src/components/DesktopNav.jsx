import { Home, Plus, TrendingUp } from 'lucide-react';

function DesktopNav({ activeTab, onTabChange, onAddExpenseClick }) {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      onClick: () => onTabChange('dashboard')
    },
    {
      id: 'summary',
      label: 'Summary',
      icon: TrendingUp,
      onClick: () => onTabChange('summary')
    }
  ];

  return (
    <nav className="hidden md:flex items-center gap-2 bg-white border-b border-gray-200 px-4 sticky top-[73px] z-30 shadow-sm">
      <div className="container mx-auto flex items-center w-full">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={tab.onClick}
                className={`flex items-center gap-2 px-4 py-3 transition-all duration-200 rounded-t-lg border-b-2 ${
                  isActive
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-gray-50'
                }`}
                aria-label={tab.label}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex-1"></div>
        <button
          onClick={onAddExpenseClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
          aria-label="Add Expense"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </div>
    </nav>
  );
}

export default DesktopNav;

