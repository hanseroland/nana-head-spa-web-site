'use client';

import React from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, useTheme, useMediaQuery, List, ListItem, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const formulas = [
  {
    id: 1,
    title: 'Formule éclat express',
    price: '60€',
    duration: '45 min',
    image: '/images/pexels-karolina-grabowska-4041386.jpg',
    soins: [
      '🪞 Diagnostic capillaire',
      '💆‍♀️ Massage du crâne relaxant',
      '🖌️ Brosses spécifique pour activer la circulation du sang',
      '🌿 Huiles essentielles adaptées',
      '🚿 Rinçage classique',
      '+ 🧴 2 Shampooings',
      '+ 💧 Après-shampooing',
    ],
  },
  {
    id: 2,
    title: 'Formule : Sérénité Absolue',
    price: '80€',
    duration: '60 min',
    image: '/images/pexels-hannah-barata-776560167-27925507.jpg',
    soins: [
      '🪞 Diagnostic capillaire',
      '💆‍♀️ Massage du crâne relaxant',
      '🖌️ Brosses spécifiques pour activer la circulation du sang',
      '🌿 Huiles essentielles adaptées',
      '🤲 Massage visage & haut du corps pour soulager les tensions',
      '🌫️ Soin vapeur drainant (cellules mortes & sébum)',
      '🚿 Rinçage sous l’arche',
      '+ 🧴 2 shampooings + après-shampooing',
    ],
  },
  {
    id: 3,
    title: "Formule : Renaissance suprême",
    price: "120€",
    duration: "1h30 min",
    image: "/images/pexels-elly-fairytale-3865560.jpg",
    soins: [
      '🪞 Diagnostic capillaire',
      '💆‍♀️ Massage du crâne relaxant',
      '🖌️ Brosses spécifiques pour activer la circulation du sang',
      '🌿 Huiles essentielles adaptées',
      '🤲 Massage visage & haut du corps pour soulager les tensions',
      '🌫️ Soin vapeur drainant (cellules mortes & sébum)',
      '🚿 Rinçage sous l’arche',
      '+ 🧴 2 shampooings + après-shampooing',
    ],
  },
];


const StarFormulasSection = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="section"
      sx={{
        px: { xs: 3, md: 8 },
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        sx={{ color: theme.palette.primary.main, mb: 4, fontWeight: 600, textAlign: 'center' }}
      >
        Nos formules stars
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: 4,
          mb: 6,
        }}
      >
        {formulas.map((formula) => (
          <Card
            key={formula.id}
            component={motion.div}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            elevation={1}
            sx={{
              borderRadius: '2rem',
              overflow: 'hidden',
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[1],
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >

            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                {formula.title}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600, mt: 1 }}>
                {formula.price} ・ {formula.duration}
              </Typography>


              <List dense sx={{ pl: 0.1 }}>
                {formula.soins.map((soin, index) => (
                  <ListItem key={index} disableGutters sx={{ py: 0.1 }}>
                    <ListItemText
                      primary={soin}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        color: theme.palette.text.secondary,

                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardMedia
              component="img"
              height="220"
              image={formula.image}
              alt={formula.title}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        ))}
      </Box>

      <Box display="flex" justifyContent="center">
        <Button
          color="primary"
          variant="contained"
          size="medium"
          sx={{
            fontWeight: 600,
            fontFamily: 'Poppins',
            textTransform: 'none',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              color: 'primary.main'
            },
          }}
          onClick={() => router.push('/formules')}
        >
          Voir toutes nos formules
        </Button>
      </Box>
    </Box>
  );
};

export default StarFormulasSection;
