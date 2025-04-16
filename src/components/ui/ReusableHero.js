'use client';

import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

function ReusableHero({ image, title, subtitle }) {
  const theme = useTheme();

  return (
    <MotionBox
      component="section"
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      sx={{
        position: 'relative',
        height: { xs: '60vh', md: '90vh' },
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Voile doux */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(1px)',
        }}
      />

      {/* Texte centré */}
      <Container
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
        }}
      >
        <MotionTypography
          variant="h2"
          fontFamily="Poppins"
          fontWeight="bold"
          fontSize={{ xs: '2rem', sm: '2.5rem', md: '3rem' }}
          color={theme.palette.primary.main}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.4 }}
        >
          {title}
        </MotionTypography>

        <MotionTypography
          variant="subtitle1"
          fontFamily="Poppins"
          fontSize={{ xs: '1rem', sm: '1.2rem' }}
          color="#fff"
          mt={2}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          {subtitle}
        </MotionTypography>
      </Container>
    </MotionBox>
  );
}

export default ReusableHero;
