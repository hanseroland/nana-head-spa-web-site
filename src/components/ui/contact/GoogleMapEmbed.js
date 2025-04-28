'use client';

import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const GoogleMapEmbed = () => {
  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      sx={{
        px: 2,
        py: 6,
        maxWidth: '100%',
        mx: 'auto',
        borderRadius: '2rem',
        overflow: 'hidden',
        boxShadow: 3,
      }}
    >
      <Box
        component="iframe"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d737.3110946429382!2d-3.456279!3d48.74971600000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48122c07c87a1a17%3A0xce35a7a9b4be1032!2s15%20Rue%20Pen%20Kerivon%2C%2022300%20Lannion%2C%20France!5e1!3m2!1sfr!2ssn!4v1745802373220!5m2!1sfr!2ssn"
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        sx={{
          borderRadius: '2rem',
          width: '100%',
          height: { xs: 300, md: 450 },
          filter: 'brightness(95%) contrast(105%)',
        }}
      />
    </Box>
  );
};

export default GoogleMapEmbed;
