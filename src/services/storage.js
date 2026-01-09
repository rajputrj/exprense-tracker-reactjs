// localStorage-based storage service (client-side only)
// This replaces the API calls with browser localStorage

const STORAGE_KEY = 'spendsmart_expenses';

export const getExpenses = async () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to read expenses from localStorage:', error);
    return [];
  }
};

export const createExpense = async (expenseData) => {
  try {
    const expenses = await getExpenses();
    const newExpense = {
      id: Date.now().toString(),
      title: expenseData.title,
      amount: parseFloat(expenseData.amount),
      description: expenseData.description || '',
      date: new Date().toISOString()
    };
    
    expenses.push(newExpense);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    
    return newExpense;
  } catch (error) {
    console.error('Failed to save expense to localStorage:', error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const expenses = await getExpenses();
    const filtered = expenses.filter(exp => exp.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete expense from localStorage:', error);
    throw error;
  }
};

