// Settings service for managing app configuration
const SETTINGS_KEY = 'spendsmart_settings';

const DEFAULT_SETTINGS = {
  numberOfPeople: 8
};

export const getSettings = () => {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    if (settings) {
      return JSON.parse(settings);
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
};

export const updateNumberOfPeople = (number) => {
  const settings = getSettings();
  settings.numberOfPeople = parseInt(number) || DEFAULT_SETTINGS.numberOfPeople;
  return saveSettings(settings);
};

export const getNumberOfPeople = () => {
  const settings = getSettings();
  return settings.numberOfPeople || DEFAULT_SETTINGS.numberOfPeople;
};

