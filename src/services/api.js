import axios from 'axios';

// Use environment variable if set, otherwise use relative URL for same-origin or localhost for dev
// const API_URL = import.meta.env.VITE_API_URL || 
//   (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');
const API_URL =  'https://exprense-tracker-nodejs.vercel.app/api'

const api = axios.create({
  baseURL: API_URL,
});

export const getExpenses = async () => {
  const response = await api.get('/expenses');
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await api.post('/expenses', expenseData);
  return response.data;
};

export const deleteExpense = async (id, userId, userRole) => {
  const response = await api.delete(`/expenses/${id}`, {
    data: { userId, userRole }
  });
  return response.data;
};

export const getNumberOfPersons = async () => {
  const response = await api.get('/settings/persons');
  return response.data.numberOfPersons;
};

export const updateNumberOfPersons = async (number) => {
  const response = await api.post('/settings/persons', { numberOfPersons: number });
  return response.data;
};

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const deleteUser = async (userId, deletedBy) => {
  const response = await api.delete(`/users/${userId}`, {
    data: { deletedBy }
  });
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

