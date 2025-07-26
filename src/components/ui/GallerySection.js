'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, useTheme, CircularProgress } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { motion } from 'framer-motion';
import { GetAllGalleryImages } from '@/apiCalls/gallery'; // Correction : Importation de GetAllGalleryImages
import Image from 'next/image';

const GallerySection = () => {
  const theme = useTheme();

  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGalleryImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetAllGalleryImages();
      if (response.success && response.data) {
        // Formate les images de la BDD pour qu'elles correspondent au format attendu par le slider
        const formattedImages = response.data.map(img => ({
          src: img.image.url, // Supposons que l'URL est dans img.image.url
          label: img.title || 'Image de la galerie',
        }));
        setGalleryImages(formattedImages);
        console.log(galleryImages)
      } else {
        setError(response.message || "Erreur lors du chargement des images de la galerie.");
        setGalleryImages([]); // En cas d'erreur, assurez-vous que le tableau est vide
      }
    } catch (err) {
      console.error("Erreur API lors du chargement des images de la galerie:", err);
      setError("Impossible de se connecter au serveur pour récupérer les images de la galerie.");
      setGalleryImages([]); // En cas d'erreur de connexion, assurez-vous que le tableau est vide
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleryImages();
  }, [fetchGalleryImages]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Ne rien afficher si aucune image n'est trouvée après chargement
  if (galleryImages.length === 0) {
    return null;
  }

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
        {galleryImages.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{
              borderRadius: '1.5rem',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: theme.shadows[3],
              minHeight: '250px', // Ou une hauteur fixe comme '300px'
            }}
          >
            <Image
              src={image.src}
              alt={image.label}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimisation pour différents écrans
              style={{ objectFit: 'cover' }}
              // Ajoutez un gestionnaire d'erreurs pour les images si nécessaire
              onError={(e) => {
                console.error("Erreur de chargement d'image:", image.src, e);
                e.target.style.display = 'none'; // Cache l'image cassée
              }}
            />
          </motion.div>
        ))}
      </Masonry>
    </Box>
  );
};

export default GallerySection;