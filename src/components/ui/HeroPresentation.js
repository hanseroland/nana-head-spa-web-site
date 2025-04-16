import React from "react";
import { Box, Typography, Container, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

function HeroPresentation() {
  const theme = useTheme();

  return (
    <MotionBox
      component="section"
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      sx={{
        position: "relative",
        height: { xs: "60vh", md: "90vh" },
        backgroundImage: `url("https://images.unsplash.com/photo-1642703168632-5a711d91b043?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Voile doux */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          //backgroundColor: "rgba(255, 14, 183, 0.15)",
          backdropFilter: "blur(1px)",
        }}
      />

      {/* Texte centré */}
      <Container
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <MotionTypography
          variant="h2"
          fontFamily="Poppins"
          fontWeight="bold"
          fontSize={{ xs: "2rem", sm: "2.5rem", md: "3rem" }}
          color={theme.palette.primary.main}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.4 }}
        >
          Un cocon de bien-être au cœur de la ville
        </MotionTypography>

        <MotionTypography
          variant="subtitle1"
          fontFamily="Poppins"
          fontSize={{ xs: "1rem", sm: "1.2rem" }}
          color="#fff"
          mt={2} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          Laissez-vous porter par une expérience sensorielle unique.
        </MotionTypography>
      </Container>
    </MotionBox>
  );
}

export default HeroPresentation;
