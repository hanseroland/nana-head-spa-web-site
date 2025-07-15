'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Container, useTheme, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { GetAllPageBanners } from '@/apiCalls/banners'; // Assurez-vous que ce chemin est correct

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

/**
 * Composant ReusableHero pour afficher une bannière dynamique ou statique.
 * @param {object} props - Les props du composant.
 * @param {string} props.image - L'URL de l'image statique par défaut.
 * @param {string} props.title - Le titre de la bannière.
 * @param {string} props.subtitle - Le sous-titre de la bannière.
 * @param {string} props.pageName - Le nom de la page associée à la bannière (ex: 'presentation', 'reservations').
 */
function ReusableHero({ image: defaultImage, title, subtitle, pageName }) {
  const theme = useTheme();

  const [bannerImageUrl, setBannerImageUrl] = useState(null); // URL de l'image de la BDD
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [errorBanner, setErrorBanner] = useState(null);

  // Fonction pour charger la bannière de page depuis l'API
  const fetchPageBanner = useCallback(async () => {
    setLoadingBanner(true);
    setErrorBanner(null);
    try {
      const response = await GetAllPageBanners();
      if (response.success && response.data) {
        // Trouvez la bannière pour la page spécifiée qui est de type 'image'
        const foundBanner = response.data.find(
          (banner) => banner.pageName === pageName && banner.type === 'image' && banner.media?.url
        );

        if (foundBanner) {
          setBannerImageUrl(foundBanner.media.url);
        } else {
          // Si aucune bannière image correspondante n'est trouvée, on utilise l'image par défaut.
          setBannerImageUrl(null);
        }
      } else {
        setErrorBanner(response.message || `Erreur lors du chargement de la bannière pour la page ${pageName}.`);
        setBannerImageUrl(null); // Utilise l'image par défaut en cas d'erreur API
      }
    } catch (err) {
      console.error(`Erreur API lors du chargement de la bannière pour la page ${pageName}:`, err);
      setErrorBanner(`Impossible de se connecter au serveur pour récupérer la bannière de la page ${pageName}.`);
      setBannerImageUrl(null); // Utilise l'image par défaut en cas d'erreur réseau
    } finally {
      setLoadingBanner(false);
    }
  }, [pageName]); // Dépend de pageName pour recharger si la prop change

  useEffect(() => {
    fetchPageBanner();
  }, [fetchPageBanner]);

  // Déterminez l'image à afficher
  // Pendant le chargement, on peut afficher un fond ou un loader si souhaité.
  // Une fois le chargement terminé, si bannerImageUrl est défini, on l'utilise, sinon defaultImage.
  const imageToDisplay = loadingBanner ? defaultImage : (bannerImageUrl || defaultImage);
  // Note: On utilise defaultImage pendant le chargement pour éviter un "flash" visuel
  // si le chargement prend du temps. Si vous préférez un loader, vous devrez adapter le style.


  return (
    <MotionBox
      component="section"
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      sx={{
        position: 'relative',
        height: { xs: '60vh', md: '90vh' },
        backgroundImage: `url(${imageToDisplay})`, // Utilise l'image déterminée
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
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Ajoute un overlay sombre pour la lisibilité
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
        {loadingBanner && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', mb: 4 }}>
            <CircularProgress color="primary" sx={{ mb: 2 }} />
            <Typography variant="body2" color="white">Chargement de la bannière...</Typography>
          </Box>
        )}

        {!loadingBanner && errorBanner && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="error">
              {errorBanner}
              <br />
              Affichage de l'image par défaut.
            </Typography>
          </Box>
        )}

        {!loadingBanner && ( // Affiche le titre/sous-titre uniquement après le chargement
          <>
            <MotionTypography
              variant="h2"
              fontFamily="Poppins"
              fontWeight="bold"
              fontSize={{ xs: '2rem', sm: '2.5rem', md: '3rem' }}
              color={theme.palette.primary.main}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.4 }}
              sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }} // Améliore la lisibilité sur l'image
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
              sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }} // Améliore la lisibilité
            >
              {subtitle}
            </MotionTypography>
          </>
        )}
      </Container>
    </MotionBox>
  );
}

export default ReusableHero;