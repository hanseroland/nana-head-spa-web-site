import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#d33e68', // rose principal
    },
    secondary: {
      main: '#D2B48C', // beige doux
    },
    background: {
      default: '#FFF8F5', // fond très clair cocooning
      paper: '#FFFFFF', 
    },
    text: {
      primary: '#4B4B4B', // gris foncé lisible
      secondary: '#7A7A7A', // gris moyen
    },
    divider: '#E0E0E0',
    custom: {
      bubble1: '#FFD1DC', // bulles plus claires
      bubble2: '#d33e68', // bulles plus saturées
      terracotta: '#E2725B', // logo
    },
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.1)',
  ],
  typography: {
    fontFamily: `'Poppins', 'Helvetica', 'Arial', sans-serif`,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '2rem',
          textTransform: 'none',
          padding: '0.75rem 1.5rem',
          fontWeight: 600,
        },
      },
    },
  },
});

export default lightTheme;
