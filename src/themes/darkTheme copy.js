import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d33e68',
    },
    secondary: {
      main: '#D2B48C',
    },
    background: {
      default: '#1E1E1E',
      paper: '#2C2C2C',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CFCFCF',
    },
    custom: {
      bubble1: '#FFD1DC', // Couleur des bulles 1
      bubble2: '#d33e68', // Couleur des bulles 2
    },
    divider: '#3C3C3C', // Couleur de la bordure pour le mode sombre
    custom: {
      terracotta: '#E2725B',
    },
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.5)', // Ombre plus marquée pour le mode sombre
    // Ajoute d'autres ombres si nécessaire
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
        },
      },
    },
  },
});

export default darkTheme;