// theme/theme.js
import darkTheme from './darkTheme';
import lightTheme from './lighTheme';

export const getAppTheme = (mode = 'light') => {
  return mode === 'dark' ? darkTheme : lightTheme;
};