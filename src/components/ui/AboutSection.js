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
              src="/images/nana-head.jpeg" // à remplacer par ton image réelle
              alt="Portrait de Gaëlle, fondatrice de l'institut"
              width={400}
              height={600}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </MotionBox>
        </Grid>

        {/* Texte */}
        <Grid  size={{ xs: 12, md: 12 }} >
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
            Hello tout le monde !<br />
            Je me présente pour celles et ceux qui ne me connaissent pas encore : je m&apos;appelle Nawël, je suis la fondatrice de NANA HEAD SPA à Lannion, ouvert le 2 décembre 2024.
            <br />
            Avant de me lancer dans cette aventure incroyable, j&apos;ai travaillé dans des domaines aussi variés que le commerce, l&apos;animation, la restauration et j&apos;ai fait plusieurs saisons en station de ski – autant dire que la polyvalence, ça me connaît ! Mais au fond de moi, j&apos;ai toujours rêvé de devenir ma propre patronne, et aujourd&apos;hui, je vis enfin ce rêve.
            <br />
            J&apos;ai suivi une formation spécialisée à Paris, j&apos;ai perfectionné mes massages avec des heures d&apos;entraînement, et j&apos;ai rénové mon local de A à Z toute seule pour créer un espace de bien-être à mon image, pensé pour la détente et le renouveau.
            <br />
            Mon objectif ? Vous faire découvrir des moments d&apos;évasion et de relaxation profonde grâce à des soins uniques pour prendre soin de votre cuir chevelu, de vos cheveux et de votre esprit.
            <br />
            Merci à tous pour votre soutien incroyable depuis le début de cette aventure. Si vous n&apos;êtes jamais venus, j&apos;ai hâte de vous rencontrer et de vous faire découvrir tout ce que le Head Spa peut vous offrir !
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
            Nawël
          </MotionTypography>
        </Grid>

      </Grid>
    </Box>
  );
}

export default AboutSection;
