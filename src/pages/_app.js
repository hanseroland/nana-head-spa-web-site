import "@/styles/globals.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { getAppTheme } from "../themes/theme";
import { useState } from "react";
import Navbar from "../components/Layouts/Navbar";
import Footer from "../components/Layouts/Footer";

export default function App({ Component, pageProps }) {
  const [themeMode, setThemeMode] = useState('light'); // ou 'dark'

  return (
    <ThemeProvider theme={getAppTheme(themeMode)}>
      {/* CssBaseline applique les styles globaux de Material-UI */}
      <CssBaseline enableColorScheme />
      <Navbar themeMode={themeMode} setThemeMode={setThemeMode}/>
      <Component {...pageProps} />
      <Footer/>
    </ThemeProvider>
   
  )
 
}
