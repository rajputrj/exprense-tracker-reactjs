// Authentication service
import { login } from './api';

const USER_KEY = 'currentUser';
const AUTH_TIMESTAMP_KEY = 'authTimestamp';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const loginUser = async (username, password) => {
  const user = await login(username, password);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
    return user;
  }
  return null;
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
    
    if (!userStr || !timestamp) {
      return null;
    }
    
    const timestampNum = parseInt(timestamp);
    const now = Date.now();
    
    // Check if session is still valid
    if (now - timestampNum < SESSION_DURATION) {
      return JSON.parse(userStr);
    } else {
      // Session expired
      logout();
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_TIMESTAMP_KEY);
};

export const isSuperAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'superadmin';
};

