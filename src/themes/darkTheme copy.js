import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD1DC', // bulles douces en contraste du rose
    },
    secondary: {
      main: '#D2B48C', // beige qui reste visible sur fond rose
    },
    background: {
      default: '#d33e68', // fond rose demandé
      paper: '#e35c83', // un rose un peu plus clair pour les cartes
    },
    text: {
      primary: '#FFFFFF', // blanc sur fond rose
      secondary: '#FFE4EC', // rose très clair pour du texte secondaire
    },
    divider: '#FFB6C1', // rose clair pour les séparateurs
    custom: {
      bubble1: '#FFE4EC', // bulles plus claires pour ressortir sur le fond
      bubble2: '#d33e68', // rose principal
      terracotta: '#FF8C7E', // terracotta légèrement éclairci pour ressortir
    },
  },
  shadows: [
    'none',
    '0px 2px 6px rgba(0, 0, 0, 0.2)', // plus doux car fond déjà saturé
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
          backgroundColor: '#FFE4EC',
          color: '#d33e68',
          '&:hover': {
            backgroundColor: '#FFD1DC',
          },
        },
      },
    },
  },
});

export default darkTheme;
