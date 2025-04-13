'use client';

import React from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, useTheme, useMediaQuery, List, ListItem, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const formulas = [
  {
    id: 1,
    title: 'Rituel Éclat Capillaire',
    price: '49€',
    duration: '45 min',
    image: '/images/pexels-karolina-grabowska-4041386.jpg',
    soins: [
      'Massage crânien relaxant',
      'Bain vapeur aux huiles essentielles',
      'Brume hydratante pour cuir chevelu',
    ],
  },
  {
    id: 2,
    title: 'Détente Intense & Massage',
    price: '65€',
    duration: '60 min',
    image: '/images/pexels-hannah-barata-776560167-27925507.jpg',
    soins: [
      'Massage japonais du cuir chevelu',
      'Masque nourrissant cheveux',
      'Ambiance sensorielle relaxante',
    ],
  },
  {
    id: 3,
    title: 'Soin Japonais Premium',
    price: '89€',
    duration: '75 min',
    image: '/images/pexels-elly-fairytale-3865560.jpg',
    soins: [
      'Double massage crâne & nuque',
      'Application de sérum capillaire bio',
      'Thé détente & ambiance musicale',
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
            <CardMedia
              component="img"
              height="220"
              image={formula.image}
              alt={formula.title}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                {formula.title}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                {formula.price} ・ {formula.duration}
              </Typography>

              <Typography variant="subtitle2" sx={{ mt: 2,fontWeight: 600, color: theme.palette.secondary.main }}>
                Soins inclus :
              </Typography>
              <List dense sx={{ pl: 1 }}>
                {formula.soins.map((soin, index) => (
                  <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
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
              color: 'text.primary',
              '&:hover': { color: 'primary.main' },
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
