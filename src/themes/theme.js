// theme/theme.js
import darkTheme from './darkTheme';
import lightTheme from './lighTheme';

export const getAppTheme = (mode = 'dark') => {
  return mode === 'light' ? lightTheme : darkTheme;
};