import { useMemo } from 'react';
import { Users, DollarSign } from 'lucide-react';

function PerPersonSummary({ expenses, numberOfPeople = 8 }) {
  const peopleList = useMemo(() => {
    return Array.from({ length: numberOfPeople }, (_, i) => `Person ${i + 1}`);
  }, [numberOfPeople]);

  const perPersonData = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const perPersonAmount = totalExpenses / numberOfPeople;

    return {
      totalExpenses,
      perPersonAmount,
      expenseCount: expenses.length
    };
  }, [expenses]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Per Person Summary</h3>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
        <p className="text-2xl font-bold text-blue-600">₹{perPersonData.totalExpenses.toFixed(2)}</p>
        <p className="text-xs text-gray-500 mt-1">
          {perPersonData.expenseCount} expense{perPersonData.expenseCount !== 1 ? 's' : ''} split among {numberOfPeople} people
        </p>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-800">Each Person Owes:</span>
          </div>
          <span className="text-2xl font-bold text-green-600">
            ₹{perPersonData.perPersonAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700 mb-3">Breakdown by Person:</p>
        {peopleList.map((person, index) => (
          <div
            key={person}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-all duration-200 hover-lift animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                index % 8 === 0 ? 'bg-blue-500' :
                index % 8 === 1 ? 'bg-green-500' :
                index % 8 === 2 ? 'bg-purple-500' :
                index % 8 === 3 ? 'bg-yellow-500' :
                index % 8 === 4 ? 'bg-pink-500' :
                index % 8 === 5 ? 'bg-indigo-500' :
                index % 8 === 6 ? 'bg-red-500' : 'bg-orange-500'
              }`}></div>
              <span className="font-medium text-gray-800">{person}</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">
              ₹{perPersonData.perPersonAmount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          All expenses are split equally among all {numberOfPeople} people
        </p>
      </div>
    </div>
  );
}

export default PerPersonSummary;

