// Settings service for managing app configuration
// Now uses backend API instead of localStorage
import { getNumberOfPersons as apiGetNumberOfPersons, updateNumberOfPersons as apiUpdateNumberOfPersons } from './api';

const DEFAULT_NUMBER_OF_PEOPLE = 8;

// Cache for number of persons (to avoid repeated API calls)
let cachedNumberOfPeople = null;

export const getNumberOfPeople = async () => {
  try {
    if (cachedNumberOfPeople !== null) {
      return cachedNumberOfPeople;
    }
    const number = await apiGetNumberOfPersons();
    cachedNumberOfPeople = number;
    return number;
  } catch (error) {
    console.error('Failed to load number of people from API:', error);
    // Fallback to default if API fails
    return DEFAULT_NUMBER_OF_PEOPLE;
  }
};

export const updateNumberOfPeople = async (number) => {
  try {
    const result = await apiUpdateNumberOfPersons(number);
    cachedNumberOfPeople = result.numberOfPersons;
    return true;
  } catch (error) {
    console.error('Failed to save number of people:', error);
    return false;
  }
};

// Sync function for initial load (returns default, will be updated by async call)
export const getNumberOfPeopleSync = () => {
  return cachedNumberOfPeople || DEFAULT_NUMBER_OF_PEOPLE;
};

