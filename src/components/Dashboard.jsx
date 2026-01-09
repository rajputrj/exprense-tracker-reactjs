import { useState, useMemo } from 'react';
import { DollarSign, Wallet, TrendingUp, Trash2 } from 'lucide-react';
import SpendingTrend from './SpendingTrend';
import PerPersonSummary from './PerPersonSummary';
import { TOTAL_PEOPLE } from '../constants/people';

function Dashboard({ expenses, loading, onDeleteExpense }) {
  const metrics = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const averageSpend = expenses.length > 0 ? totalExpenses / expenses.length : 0;
    const transactionCount = expenses.length;

    return {
      totalExpenses: totalExpenses.toFixed(2),
      averageSpend: averageSpend.toFixed(2),
      transactionCount
    };
  }, [expenses]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const groupedByDate = useMemo(() => {
    const grouped = {};
    expenses.forEach(expense => {
      const date = formatDate(expense.date);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(expense);
    });
    return grouped;
  }, [expenses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">Track, manage, and analyze your expenses efficiently.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Expenses"
          value={`₹${metrics.totalExpenses}`}
          subtitle="Lifetime spend"
          icon={<DollarSign className="w-6 h-6" />}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Average Spend"
          value={`₹${metrics.averageSpend}`}
          subtitle="Per transaction"
          icon={<Wallet className="w-6 h-6" />}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <MetricCard
          title="Transaction Count"
          value={metrics.transactionCount.toString()}
          subtitle="Total recorded"
          icon={<TrendingUp className="w-6 h-6" />}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No expenses yet. Add your first expense to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Description</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Total Amount</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Per Person</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice().reverse().map((expense) => {
                    const perPersonAmount = expense.amount / TOTAL_PEOPLE;
                    return (
                      <tr key={expense.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-700">{formatDate(expense.date)}</td>
                        <td className="py-3 px-4 text-gray-800 font-medium">{expense.title}</td>
                        <td className="py-3 px-4 text-gray-600">{expense.description || '-'}</td>
                        <td className="py-3 px-4 text-gray-800 font-semibold">₹{expense.amount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ₹{perPersonAmount.toFixed(2)} each
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onDeleteExpense(expense.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Delete expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Spending Trend */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Spending Trend</h3>
          <SpendingTrend expenses={expenses} />
        </div>
      </div>

      {/* Per Person Summary */}
      <div className="mt-6">
        <PerPersonSummary expenses={expenses} />
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, bgColor, iconColor }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
        <p className="text-gray-500 text-xs">{subtitle}</p>
      </div>
      <div className={`${bgColor} rounded-full p-4 ${iconColor}`}>
        {icon}
      </div>
    </div>
  );
}

export default Dashboard;

