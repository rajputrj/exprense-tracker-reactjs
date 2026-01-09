import { useMemo, useState, useEffect } from 'react';
import { Calculator, ArrowRight, TrendingUp } from 'lucide-react';
import { getUsers } from '../services/api';

function Settlements({ expenses, numberOfPeople, currentUserId }) {
  const [users, setUsers] = useState([]);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await getUsers();
        // Exclude superadmin from calculations
        const regularUsers = usersData.filter(user => user.role !== 'superadmin');
        setUsers(regularUsers);
        // Create a map for quick lookup (include all users for expense lookup)
        const map = {};
        usersData.forEach(user => {
          map[user.id] = user;
        });
        setUserMap(map);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };
    loadUsers();
  }, []);
  const settlements = useMemo(() => {
    // Use all users from the users list (numberOfPeople represents the count)
    // Get all user IDs from the users array
    const allUserIds = users.map(user => user.id);
    
    // Calculate who paid what
    const paidByUser = {};
    const totalPerPerson = {};
    
    // Initialize with all user IDs
    allUserIds.forEach(userId => {
      paidByUser[userId] = 0;
      totalPerPerson[userId] = 0;
    });
    
    // Track actual payments by user
    expenses.forEach(expense => {
      if (expense.createdBy && paidByUser[expense.createdBy] !== undefined) {
        paidByUser[expense.createdBy] += expense.amount;
      }
    });
    
    // Calculate what each person owes (split equally)
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const perPersonShare = numberOfPeople > 0 ? totalExpenses / numberOfPeople : 0;
    
    allUserIds.forEach(userId => {
      totalPerPerson[userId] = perPersonShare;
    });
    
    // Calculate net balances
    const balances = {};
    allUserIds.forEach(userId => {
      balances[userId] = (paidByUser[userId] || 0) - totalPerPerson[userId];
    });
    
    // Calculate settlements (who should pay whom)
    const settlements = [];
    const positiveBalances = [];
    const negativeBalances = [];
    
    Object.entries(balances).forEach(([userId, balance]) => {
      if (balance > 0) {
        positiveBalances.push({ userId, balance });
      } else if (balance < 0) {
        negativeBalances.push({ userId, balance: Math.abs(balance) });
      }
    });
    
    // Sort by balance amount
    positiveBalances.sort((a, b) => b.balance - a.balance);
    negativeBalances.sort((a, b) => b.balance - a.balance);
    
    // Calculate who pays whom
    let posIdx = 0;
    let negIdx = 0;
    
    while (posIdx < positiveBalances.length && negIdx < negativeBalances.length) {
      const payer = negativeBalances[negIdx];
      const receiver = positiveBalances[posIdx];
      
      const amount = Math.min(payer.balance, receiver.balance);
      
      settlements.push({
        from: payer.userId,
        to: receiver.userId,
        amount: parseFloat(amount.toFixed(2))
      });
      
      payer.balance -= amount;
      receiver.balance -= amount;
      
      if (payer.balance < 0.01) negIdx++;
      if (receiver.balance < 0.01) posIdx++;
    }
    
    return settlements;
  }, [expenses, numberOfPeople, users]);

  const userBalances = useMemo(() => {
    const balances = {};
    const paidByUser = {};
    
    // Use all users from the users list
    const allUserIds = users.map(user => user.id);
    
    // Initialize paid amounts
    allUserIds.forEach(userId => {
      paidByUser[userId] = 0;
    });
    
    expenses.forEach(expense => {
      if (expense.createdBy && paidByUser[expense.createdBy] !== undefined) {
        paidByUser[expense.createdBy] += expense.amount;
      }
    });
    
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const perPersonShare = numberOfPeople > 0 ? totalExpenses / numberOfPeople : 0;
    
    allUserIds.forEach(userId => {
      const paid = paidByUser[userId] || 0;
      balances[userId] = {
        paid,
        owes: perPersonShare,
        net: paid - perPersonShare
      };
    });
    
    return balances;
  }, [expenses, numberOfPeople, users]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-fadeIn">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Settlements</h3>
      </div>

      {settlements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>All expenses are balanced. No settlements needed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold text-blue-800 mb-2">Payment Instructions:</p>
            <p className="text-xs text-blue-700">
              The following payments need to be made to balance all expenses.
            </p>
          </div>
          
          {settlements.map((settlement, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-xs">
                    {userMap[settlement.from]?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">
                    {userMap[settlement.to]?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{userMap[settlement.from]?.name || 'Unknown'}</span> should pay
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{userMap[settlement.to]?.name || 'Unknown'}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">₹{settlement.amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t">
        <h4 className="font-semibold text-gray-800 mb-3">Individual Balances:</h4>
        <div className="space-y-2">
          {Object.entries(userBalances).map(([userId, balance]) => (
            <div
              key={userId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {userMap[userId]?.name || `User ${userId}`}
                </p>
                <p className="text-xs text-gray-500">
                  Paid: ₹{balance.paid.toFixed(2)} | Owes: ₹{balance.owes.toFixed(2)}
                </p>
              </div>
              <div className={`text-lg font-bold ${
                balance.net >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {balance.net >= 0 ? '+' : ''}₹{Math.abs(balance.net).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settlements;

