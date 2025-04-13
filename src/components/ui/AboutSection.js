import React from "react";
import { Box, Typography, Grid, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

function AboutSection() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      id="about"
      sx={{
        px: { xs: 3, md: 10 },
        py: { xs: 6, md: 12 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Grid
        container
        spacing={6}
        alignItems="center"
        justifyContent="center"
      >
        {/* Image - portrait */}
        <Grid  size={{ xs: 12, md: 6 }} >
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            sx={{
              borderRadius: "2rem",
              overflow: "hidden",
              boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
            }}
          >
            <Image
              src="/images/usen-parmanov-JJi82Ayk_kQ-unsplash.jpg" // à remplacer par ton image réelle
              alt="Portrait de Gaëlle, fondatrice de l'institut"
              width={600}
              height={800}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </MotionBox>
        </Grid>

        {/* Texte */}
        <Grid  size={{ xs: 12, md: 6 }} >
          <MotionTypography
            variant="h3"
            component="h2"
            fontFamily="Poppins"
            fontWeight="bold"
            color={theme.palette.primary.main}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            mb={3}
          >
            Qui suis-je ?
          </MotionTypography>

          <MotionTypography
            variant="body1"
            fontFamily="Poppins"
            color="text.secondary"
            lineHeight={1.8}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Je m'appelle Gaëlle, passionnée par le bien-être et les soins du cuir chevelu. J’ai découvert le head spa au cours d’un voyage au Japon, une expérience profondément relaxante et régénérante.
            <br /><br />
            De retour en France, j’ai décidé de créer un cocon dédié au soin du cheveu et de l’esprit, un espace où chaque personne peut se reconnecter à elle-même à travers des rituels doux, inspirés de la nature.
            <br /><br />
            Mon objectif : vous offrir un moment suspendu, où détente, écoute et confiance sont les maîtres mots. Parce que vous méritez un instant rien que pour vous.
          </MotionTypography>

          {/* Signature manuscrite */}
          <MotionTypography
            variant="h5"
            fontFamily="'Pacifico', cursive"
            color="#E59AA6"
            mt={4}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Gaëlle
          </MotionTypography>
        </Grid>

      </Grid>
    </Box>
  );
}

export default AboutSection;
