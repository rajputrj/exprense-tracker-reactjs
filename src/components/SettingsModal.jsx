import { useState, useEffect } from 'react';
import { X, Users, Save } from 'lucide-react';
import { getNumberOfPeople, updateNumberOfPeople } from '../services/settings';

function SettingsModal({ onClose, onSave }) {
  const [numberOfPeople, setNumberOfPeople] = useState(8);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load current settings
    const currentNumber = getNumberOfPeople();
    setNumberOfPeople(currentNumber);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (numberOfPeople < 1 || numberOfPeople > 20) {
      alert('Number of people must be between 1 and 20');
      return;
    }

    setIsSaving(true);
    const success = updateNumberOfPeople(numberOfPeople);
    setIsSaving(false);

    if (success) {
      onSave(numberOfPeople);
      onClose();
    } else {
      alert('Failed to save settings. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90 hover:scale-110"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            <p className="text-gray-600 text-sm">Configure expense splitting</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="numberOfPeople" className="block text-gray-700 font-medium mb-2">
              Number of People for Bill Splitting
            </label>
            <input
              type="number"
              id="numberOfPeople"
              name="numberOfPeople"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
              min="1"
              max="20"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-semibold"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Expenses will be split equally among {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}
            </p>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Example:</strong> If you add an expense of ₹{numberOfPeople * 100}, each person will owe ₹100
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="spinner w-5 h-5 border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsModal;

