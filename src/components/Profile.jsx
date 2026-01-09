import { User, LogOut, Shield, Clock, Settings } from 'lucide-react';

function Profile({ onLogout, onOpenSettings, numberOfPeople = 8 }) {
  return (
    <div className="animate-fadeIn">
      <div className="mb-8 animate-slideIn">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Profile</h2>
        <p className="text-gray-600">Manage your account and settings.</p>
      </div>

      <div className="max-w-2xl">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 hover-lift transition-smooth animate-fadeIn">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Admin</h3>
              <p className="text-gray-600">adminfonua</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-semibold text-gray-800">Administrator</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Session</p>
                <p className="font-semibold text-gray-800">Active (24 hours)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Bill Splitting</p>
                <p className="font-semibold text-gray-800">{numberOfPeople} people</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 animate-fadeIn" style={{ animationDelay: '150ms' }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <Settings className="w-5 h-5" />
            Configure Bill Splitting
          </button>
        </div>

        {/* Actions Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            Logout
          </button>
        </div>

        {/* App Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            SpendSmart Expense Tracker
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;

