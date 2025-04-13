import React from 'react';
import { Box, Typography, Avatar, Grid, Rating, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

// Données des témoignages
const testimonials = [
  {
    name: "Sophie M.",
    content: "Une expérience incroyable ! Le head spa m'a détendue comme jamais auparavant. Gaëlle est douce et attentionnée.",
    rating: 5,
  },
  {
    name: "Julie R.",
    content: "Un vrai moment de bien-être dans un lieu magnifique. Je recommande à 100% !",
    rating: 5,
  },
  {
    name: "Camille T.",
    content: "Un accueil chaleureux et un soin de qualité. J’y retourne dès que possible.",
    rating: 5,
  },
];

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

function TestimonialsSection() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      id="testimonials"
      sx={{
        px: { xs: 3, md: 10 },
        py: { xs: 6, md: 12 },
        backgroundColor: theme.palette.background.default,
        textAlign: 'center',
      }}
    >
      {/* Titre */}
      <MotionTypography
        variant="h3"
        component="h2"
        fontFamily="Poppins"
        fontWeight="bold"
        color="primary"
        mb={6}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Avis de nos clientes
      </MotionTypography>

      {/* Grid des témoignages */}
      <Grid container spacing={2} justifyContent="center">
        {testimonials.map((item, index) => (
          <Grid item size={{ xs: 12, sm:6, md: 4 }} key={index}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
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
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: "2rem",
                p: 4,
                height: '100%',
                boxShadow: '0 12px 30px rgba(0,0,0,0.05)',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#E59AA6',
                  color: 'white',
                  mx: 'auto',
                  width: 44,
                  height: 44,
                  fontSize: "1.5rem",
                  mb: 2,
                  fontFamily: 'Poppins',
                }}
              >
                {item.name.charAt(0)}
              </Avatar>

              <Typography
                variant="body1"
                sx={{
                  fontStyle: "italic",
                  color: theme.palette.text.secondary,
                  fontFamily: "Poppins",
                  mb: 2,
                }}
              >
                “{item.content}”
              </Typography>

              <Rating value={item.rating} readOnly size="small" />
              <Typography
                variant="subtitle2"
                sx={{ mt: 2, fontFamily: "Poppins" }}
              >
                {item.name}
              </Typography>
            </MotionBox>
          </Grid>
        ))}
      </Grid>

      {/* Bouton CTA */}
      <MotionBox
        mt={6}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Button
          href="https://www.google.com/search?q=avis+institut+head+spa+gaelle"
          target="_blank"
          rel="noopener"
          variant="outlined"
          size="large"
          sx={{
            borderColor: "#E59AA6",
            color: "#E59AA6",
            fontFamily: "Poppins",
            fontWeight: 600,
            px: 4,
            py: 1.5,
            mt: 2,
            '&:hover': {
              backgroundColor: "#E59AA6",
              color: "white",
            }
          }}
        >
          Voir tous les avis Google
        </Button>
      </MotionBox>
    </Box>
  );
}

export default TestimonialsSection;
