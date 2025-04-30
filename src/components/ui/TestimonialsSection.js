import React from 'react';
import { Box, Typography, Avatar, Grid, Rating, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

// Données des témoignages
const testimonials = [
  {
    name: "Morgane Quevert",
    content: "Superbe expérience pleine de conseils et de détente. Nawël est très douce et professionnelle. Mes cheveux n'ont jamais été aussi beau et brillant. Je suis repartie avec l'envie de revenir tant ce moment était agréable. Je recommande fortement ce lieu et cette personne.",
    rating: 5,
  },
  {
    name: "Léane Boudouin",
    content: "Superbe expérience que je vais renouveler !Très professionnelle, de bon conseil pour m’aider à soigner mon psoriasis !" +
      " J\’ai du psoriasis dans le cuir chevelu depuis des années et grâce à cette séance je vois le changement de suite." +
      " Suite aux soins, mes cheveux sont plus souple et brillant, un grand merci à elle !",
    rating: 5,
  },
  {
    name: "Mag R",
    content: "C’était GÉNIAL. Nawël est super souriante, sympa et douce.Je suis repartie sur un petit nuage, avec pleins de bons conseils." +
      " Encore un grand merci pour le cadeau d’anniversaire. Finalement, une fois par an, c’est pas assez, alors je reviendrai vite!",
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
      <Container maxWidth="lg">
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
            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
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
                    bgcolor: theme.palette.primary.main,
                    mx: 'auto',
                    width: 44,
                    height: 44,
                    fontSize: "1.5rem",
                    mb: 2,
                    fontFamily: 'Poppins',
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                      color: 'primary.main'
                    },
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
            href="https://www.google.com/search?q=avis+nana+head+spa"
            target="_blank"
            rel="noopener"
            variant="outlined"
            size="large"
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              fontFamily: "Poppins",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              mt: 2,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                color: 'primary.main'
              },
            }}
          >
            Voir tous les avis Google
          </Button>
        </MotionBox>
      </Container>
    </Box>
  );
}

export default TestimonialsSection;
