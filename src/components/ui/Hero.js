import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles"; 
import Bubble from "./Bubble";
import globalVariables from "@/config/globalVariables";
import { useRouter } from "next/router";

export default function Hero() {
  const theme = useTheme();
  const router = useRouter();

  const bubbleVariants = {
    animate: {
      y: [0, -50, 0],
      opacity: [0.6, 0.8, 0.6],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        minHeight: { xs: "40vh", md: "70vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.background.default})`,
        color: theme.palette.text.primary,
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 6, sm: 8, md: 10 },
      }}
    >
      <Bubble />

      {/* Bulles flottantes */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 0.3, y: 0 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        style={{
          position: "absolute",
          top: "8%",
          left: "10%",
          width: "120px",
          height: "120px",
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
          right: "10%",
          width: "160px",
          height: "160px",
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
          gap: { xs: 4, md: 6 },
          zIndex: 2,
        }}
      >
        {/* Partie gauche */}
        <Box
          component={motion.div}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          mt={{ xs: 4, md: 6 }}
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
              fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem", lg: "4.5rem" },
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.62)',
            }}
          >
            Bienvenue chez <span style={{ color: theme.palette.primary.main }}>{globalVariables.siteName}</span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "background.default",
              mb: 4,
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem" },
            }}
          >
            Offrez-vous une expérience de bien-être unique et relaxante.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mt: 4,
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
                fontSize: { xs: "1rem", md: "1.1rem" },
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
                fontSize: { xs: "1rem", md: "1.1rem" },
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
          mt={{ xs: 4, md: 6 }}
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            position: "relative",
            borderRadius: "1rem",
            overflow: "hidden",
            boxShadow: (theme) => theme.shadows[4],
          }}
        >
          <Box
            sx={{
              width: { md: "400px", lg: "530px" },
              height: { md: "420px", lg: "550px" },
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: (theme) => theme.shadows[4],
              position: "relative",
              mt: 2,
              mx: "auto",
            }}
          >
            <video
              src="/videos/spa-head.mp4"
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
