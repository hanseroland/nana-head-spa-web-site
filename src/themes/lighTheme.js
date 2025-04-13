import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#E59AA6', // rose pastel
    },
    secondary: {
      main: '#D2B48C', // beige doux
    },
    background: {
      default: '#FFF8F5', // fond très clair cocooning
      paper: '#FFFFFF',
    },
    text: {
      primary: '#4B4B4B',
      secondary: '#7A7A7A',
    },
    custom: {
      bubble1: '#FFD1DC', // Couleur des bulles 1
      bubble2: '#E59AA6', // Couleur des bulles 2
    },
    divider: '#E0E0E0', // Couleur de la bordure
    custom: {
      terracotta: '#E2725B', // Couleur du logo
    },
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.1)', // Ombre légère pour les composants
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

export default lightTheme;