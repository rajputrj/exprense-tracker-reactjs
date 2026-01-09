import { useMemo } from 'react';
import { TrendingUp, DollarSign, Users } from 'lucide-react';
import PerPersonSummary from './PerPersonSummary';
import SpendingTrend from './SpendingTrend';

function Summary({ expenses, numberOfPeople = 8 }) {
  const summaryData = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const perPersonAmount = totalExpenses / numberOfPeople;
    const expenseCount = expenses.length;
    const averagePerExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

    return {
      totalExpenses,
      perPersonAmount,
      expenseCount,
      averagePerExpense
    };
  }, [expenses]);

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 animate-slideIn">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Summary</h2>
        <p className="text-gray-600">View detailed expense analysis and breakdowns.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 hover-lift transition-smooth animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Total Expenses</h3>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">₹{summaryData.totalExpenses.toFixed(2)}</p>
          <p className="text-sm text-gray-500">{summaryData.expenseCount} transactions</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 hover-lift transition-smooth animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Per Person</h3>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">₹{summaryData.perPersonAmount.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Split among {numberOfPeople} people</p>
        </div>
      </div>

      {/* Spending Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 animate-fadeIn" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-800">Spending Trend</h3>
        </div>
        <SpendingTrend expenses={expenses} />
      </div>

      {/* Per Person Summary */}
      <PerPersonSummary expenses={expenses} numberOfPeople={numberOfPeople} />
    </div>
  );
}

export default Summary;

