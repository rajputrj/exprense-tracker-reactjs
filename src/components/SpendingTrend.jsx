import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function SpendingTrend({ expenses }) {
  const chartData = useMemo(() => {
    const grouped = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = 0;
      }
      grouped[dateKey] += expense.amount;
    });

    return Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount: parseFloat(amount.toFixed(2)) }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [expenses]);

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data to display
      </div>
    );
  }

  const maxAmount = Math.max(...chartData.map(d => d.amount), 0);
  const yAxisMax = Math.ceil(maxAmount / 60) * 60;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          domain={[0, yAxisMax || 240]}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip 
          formatter={(value) => [`₹${value}`, 'Amount']}
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
        />
        <Bar 
          dataKey="amount" 
          fill="#3b82f6" 
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SpendingTrend;

