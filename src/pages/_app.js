import "@/styles/globals.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { getAppTheme } from "@/themes/theme";
import { useRouter } from "next/router";
import AdminLayout from "@/components/Layouts/AdminLayout";
import WebLayout from "@/components/Layouts/WebLayout";
import { useState } from "react";
import AuthLayout from "@/components/Layouts/AuthLayout";
//import { Provider } from "react-redux";
//import store from "@/redux/store";
import { AuthProvider, useAuth } from '@/context/AuthContext';


export default function App({ Component, pageProps }) {

  const router = useRouter();
  const [themeMode, setThemeMode] = useState('light'); // ou 'dark'

  // Définissez les routes qui utiliseront le AuthLayout
  const authRoutes = ['/connexion', '/inscription', '/reinitialiser-mot-de-passe', '/mot-de-passe-oublie']; // Ajoutez toutes vos routes d'authentification ici

  const isAdminRoute = router.pathname.startsWith('/admin');
  const isAuthRoute = authRoutes.includes(router.pathname); // <-- Nouveau: Vérifie si c'est une route d'authentification

  let LayoutComponent;

  if (isAuthRoute) { // Si c'est une route d'authentification
    LayoutComponent = AuthLayout;
  } else if (isAdminRoute) { // Si c'est une route admin
    LayoutComponent = AdminLayout;
  } else { // Par défaut, pour toutes les autres pages
    LayoutComponent = WebLayout;
  }


  return (
    <AuthProvider>
      {/*<Provider store={store} >*/}
      <ThemeProvider theme={getAppTheme(themeMode)}>
        {/* CssBaseline applique les styles globaux de Material-UI */}
        <CssBaseline enableColorScheme />
        <LayoutComponent themeMode={themeMode} setThemeMode={setThemeMode}>
          <Component {...pageProps} />
        </LayoutComponent>
      </ThemeProvider>
      {/*</Provider>*/}
    </AuthProvider>

  )
}

// ✅ Composant auxiliaire pour gérer l'état de chargement initial du contexte
function AuthContent({ LayoutComponent, themeMode, setThemeMode, Component, pageProps }) {
  const { loading } = useAuth(); // Accédez à l'état de chargement du contexte

  // Affiche un écran de chargement global pendant la vérification initiale de l'authentification
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Chargement de l'application...</Typography>
      </Box>
    );
  }

  return (
    <LayoutComponent themeMode={themeMode} setThemeMode={setThemeMode}>
      <Component {...pageProps} />
    </LayoutComponent>
  );
}
