import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles"; // Importer le thème
import Bubble from "./Bubble";
import globalVariables from "@/src/config/globalVariables";
import { useRouter } from "next/router";


export default function Hero() {

  const theme = useTheme(); // Accéder au thème Material-UI
  const router = useRouter();


  // Variantes pour les animations des bulles
  const bubbleVariants = {
    animate: {
      y: [0, -50, 0], // Mouvement vertical
      opacity: [0.6, 0.8, 0.6], // Variation d'opacité
      transition: {
        duration: 6, // Durée de l'animation
        repeat: Infinity, // Répétition infinie
        ease: "easeInOut",
      },
    },
  };

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        minHeight: "40vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.background.default})`, // Dégradé girly
        color: theme.palette.text.primary,
        px: { xs: 2, sm: 4 },
        py: { xs: 6, sm: 8 },
      }}
    >

      {/* Bulles animées en arrière-plan */}
      <Bubble/>

      {/* Éléments flottants */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 0.3, y: 0 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: "150px",
          height: "150px",
          backgroundColor: "#FFD1DC",
          borderRadius: "50%",
          filter: "blur(50px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.3, y: 0 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "20%",
          width: "200px",
          height: "200px",
          backgroundColor: "#E59AA6",
          borderRadius: "50%",
          filter: "blur(70px)",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 4, md: 8 },
          zIndex: 2, // S'assurer que le contenu est au-dessus des éléments flottants
        }}
      >
        {/* Partie gauche */}
        <Box
          component={motion.div}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          mt={5}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              fontFamily: "Poppins",
              color: "background.default",
              mb: 2,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.62)', // Douce ombre pour lisibilité
            }}
          >
            Bienvenue au <span style={{ color: theme.palette.primary.main }}> {globalVariables.siteName} </span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "background.default",
              mb: 4,
              fontSize: { xs: "1rem", sm: "1.2rem" },
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.62)', // Douce ombre pour lisibilité
            }}
          >
            Offrez-vous une expérience de bien-être unique et relaxante.
          </Typography>


          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" }, // Vertical sur mobile, horizontal sur desktop
              gap: 2, // Espacement entre les boutons
              mt: 4, // Marge supérieure pour espacer les boutons du texte
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                borderRadius: "2rem",
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                fontFamily: "Poppins",
                textTransform: "none",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
              }}
              component={motion.a}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }} 
              onClick={() => router.push('/formules')}
            >
              Découvrir nos formules
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                borderRadius: "2rem",
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                fontFamily: "Poppins",
                textTransform: "none",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
              }}
              component={motion.a}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/reservations')}
            >
              Prendre un rendez-vous
            </Button>
          </Box>

        </Box>

        {/* Partie droite */}
        <Box
          component={motion.div}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          mt={5}
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" }, // Masquer la vidéo en mode tablette et mobile
            position: "relative",
            borderRadius: "1rem",
            overflow: "hidden",
            boxShadow: (theme) => theme.shadows[3],
          }}
        >

          <Box
            sx={{
              width: "500px", // Taille de la bulle
              height: "500px", // Taille de la bulle
              borderRadius: "50%", // Forme circulaire
              overflow: "hidden", // Masquer les débordements
              boxShadow: (theme) => theme.shadows[4], // Ombre pour un effet de profondeur
              position: "relative",
              mt: 2,
            }}
          >
            <video
              src="/videos/spa-vid3.mp4"
              autoPlay
              loop
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}