'use client';

import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';

const CallToActionReservation = () => {
  const theme = useTheme();

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      sx={{
        backgroundColor: theme.palette.background.default, // Utilisation du fond thème
        textAlign: 'center',
        py:2,
        px: 2,
        borderRadius: '2rem',
        boxShadow: 3,
        mt: { xs: 4, md:2 },
        mx: 'auto',
        maxWidth: 800,
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary, // Texte selon le thème
          mb: 4,
        }}
      >
        Prête à vous offrir un moment rien que pour vous ?
      </Typography>

      <Button
        component={Link}
        href="/reservations"
        variant="contained"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          borderRadius: '2rem',
          px: 4,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 500,
          textTransform: 'none',
          transition: 'background-color 0.3s',
          '&:hover': {
             backgroundColor: theme.palette.primary.dark,
              color: 'primary.main'
          },
        }}
      >
        Réserver un soin
      </Button>
    </Box>
  );
};

export default CallToActionReservation;
