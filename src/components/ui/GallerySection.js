'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { motion } from 'framer-motion';

const images = [
  { src: '/images/nana-head.jpeg', label: "Nawël responsable de Nana Head Spa" },
  { src: '/images/spa-nana-head.jpeg', label: 'Interieur Nana Head Spa' },
  { src: '/images/archenana-head-spa.jpeg', label: 'Interieur Nana Head Spa' },
  { src: '/images/presentation-nana-head.jpeg', label: 'Interieur Nana Head Spa' },
  { src: '/images/arche-nana-head.jpeg', label: 'Arche' },
  { src: '/images/presentation-nana-head-spa.jpeg', label: 'Interieur Nana Head Spa' },
 

];

const GallerySection = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        px: { xs: 2, md: 8 },
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 600,
          textAlign: 'center',
          mb: 4,
        }}
      >
        📸 Galerie Visuelle
      </Typography>
      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
          color: theme.palette.text.secondary,
          mb: 6,
        }}
      >
        Rassurez-vous par l’image : découvrez notre univers doux et relaxant.
      </Typography>

      <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{
              borderRadius: '1.5rem',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: theme.shadows[3],
            }}
          >
            <img
              src={image.src}
              alt={image.label}
              loading="lazy"
              style={{
                width: '100%',
                display: 'block',
                borderRadius: '1.5rem',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                bgcolor: 'rgba(0,0,0,0.4)',
                color: '#fff',
                py: 1,
                textAlign: 'center',
                fontWeight: 500,
                fontSize: '0.9rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              {image.label}
            </Box>
          </motion.div>
        ))}
      </Masonry>
    </Box>
  );
};

export default GallerySection;
