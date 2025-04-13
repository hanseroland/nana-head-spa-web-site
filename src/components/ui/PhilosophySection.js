import React from "react";
import { Box, Typography, Grid, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { SpaRounded, EmojiNatureRounded, FavoriteBorderRounded } from "@mui/icons-material";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const philosophyData = [
  {
    icon: <SpaRounded sx={{ fontSize: 40, color: "#E59AA6" }} />,
    title: "Bien-être holistique",
    description: "Nous prenons soin de votre corps, de votre esprit et de vos émotions pour un équilibre global et durable.",
  },
  {
    icon: <EmojiNatureRounded sx={{ fontSize: 40, color: "#E59AA6" }} />,
    title: "Beauté naturelle",
    description: "Nous valorisons la simplicité, la douceur et la beauté authentique, sans artifices.",
  },
  {
    icon: <FavoriteBorderRounded sx={{ fontSize: 40, color: "#E59AA6" }} />,
    title: "Relation de confiance",
    description: "Chaque cliente est accueillie avec écoute, respect et bienveillance dans un espace sécurisant.",
  },
];

function PhilosophySection() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        px: { xs: 3, md: 8 },
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.background.default,
        textAlign: "center",
      }}
    >
      <MotionTypography
        variant="h3"
        fontFamily="Poppins"
        fontWeight="bold"
        color={theme.palette.primary.main}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        mb={6}
      >
        Notre philosophie
      </MotionTypography>

      <Grid container spacing={2} justifyContent="center">
        {philosophyData.map((item, index) => (
          <Grid size={{ xs: 12, sm: 4 }} key={index}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              sx={{
                backgroundColor: (theme.vars || theme).palette.background.paper,
                '&:hover': {
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                },
                '&:focus-visible': {
                    outline: '3px solid',
                    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
                    outlineOffset: '2px',
                },
                borderRadius: "2rem",
                border: `1px solid ${theme.palette.primary.main}`,

                p: 4,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
                height: "100%",
              }}
            
            >
              <Box mb={2}>{item.icon}</Box>
              <Typography variant="h6" fontFamily="Poppins" fontWeight="600" mb={1}>
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                fontFamily="Poppins"
                color="text.secondary"
                sx={{ maxWidth: 300, margin: "0 auto" }}
              >
                {item.description}
              </Typography>
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default PhilosophySection;
