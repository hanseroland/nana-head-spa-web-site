'use client';

import React from 'react';
import { Box, Typography, Button, Card, CardContent, useTheme, useMediaQuery, List, ListItem, ListItemText, Chip, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const formulas = [
  {
    id: 1,
    title: 'Formule : Eclat express',
    etiquette: 'Découverte',
    price: '60€',
    duration: '45 min',
    image: '/images/pexels-karolina-grabowska-4041386.jpg',
    soins: [
      '🪞 Diagnostic capillaire',
      '💆‍♀️ Massage du crâne relaxant',
      '- Brosses spécifique pour activer la circulation sanguine',
      '🌿 Huiles essentielles adaptées',
      '+ 🚿 Rinçage classique',
      '+ 🧴 2 Shampooings',
      '+ 💧 Après-shampooing',
    ],
    raison:"Une pause bien-être express qui redonne vie aux cheveux et booste l'énergie en moins d'une heure. Parfait pour les personnes pressées!"
  },
  {
    id: 2,
    title: 'Formule : Sérénité Absolue',
    etiquette: '',
    price: '80€',
    duration: '60 min',
    image: '/images/pexels-hannah-barata-776560167-27925507.jpg',
    soins: [
      '🪞 Diagnostic capillaire',
      '💆‍♀️ Massage du crâne relaxant',
      '- Brosses spécifiques pour activer la circulation sanguine',
      '🌿 Huiles essentielles adaptées',
      "🤲 Massage visage, des cervicales, jusqu'au bout des doigts",
      '🌫️ Soin vapeur drainant (cellules mortes & sébum)',
      '🚿 Rinçage sous l’arche',
      '+ 🧴 2 shampooings + après-shampooing',
    ],
    raison:"Ce soin est parfait pour celles qui souhaitent s'offrir un moment de lâcher-prise tout en revitalisant leur chevelure. Un moment suspendu qui relie relaxation et beauté!"
  },
  {
    id: 3,
    title: "Formule : Renaissance suprême",
    etiquette: '',
    price: "120€",
    duration: "1h30 min",
    image: "/images/pexels-elly-fairytale-3865560.jpg",
    soins: [
      '🪞 Diagnostic capillaire',
      '💆‍♀️ Massage du crâne relaxant',
      '- Brosses spécifiques pour activer la circulation sanguine',
      '🌿 Huiles essentielles adaptées',
      "🤲 Massage visage, des cervicales, jusqu'au bout des doigts",
      '🌫️ Soin vapeur drainant (cellules mortes & sébum)',
      '🚿 Rinçage sous l’arche',
      '+ 🧴 2 shampooings + après-shampooing',
    ],
    raison:'Cette formule complète offre une parenthèse de bien-être inégalée. On en ressort avec un esprit apaisé et des cheveux resplendissants! Une expérience unique, parfaite pour un cadeau ou un moment de ressourcement total.'
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
        Mes formules stars
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
                {formula.title} {" "}
                {formula.etiquette && (
                  <Chip
                    label={formula.etiquette}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: '#000',
                      fontWeight: 600,
                      marginTop: '0.5rem',
                    }}
                  />
                )}
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
              <Divider sx={{ my: 2 }} />
              <Box display="block" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    Pourquoi on l'adore ?
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600, mt: 1 }}>
                  {formula.raison}
                </Typography>
              </Box>
              
            </CardContent>
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
