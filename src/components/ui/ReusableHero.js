'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { GetAllPageBanners } from '@/apiCalls/banners';


const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

function ReusableHero({ image: defaultImage, title, subtitle, pageName }) {
  const theme = useTheme();

  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [loadingApi, setLoadingApi] = useState(true);
  const [errorBanner, setErrorBanner] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchPageBanner = useCallback(async () => {
    setLoadingApi(true);
    setErrorBanner(null);
    setImageLoaded(false);
    try {
      const response = await GetAllPageBanners();
      if (response.success && response.data) {
        const foundBanner = response.data.find(
          (banner) => banner.pageName === pageName && banner.type === 'image' && banner.media?.url
        );

        if (foundBanner) {
          setBannerImageUrl(foundBanner.media.url);
        } else {
          setBannerImageUrl(null);
          setImageLoaded(true);
        }
      } else {
        setErrorBanner(response.message || `Erreur lors du chargement de la bannière pour la page ${pageName}.`);
        setBannerImageUrl(null);
        setImageLoaded(true);
      }
    } catch (err) {
      console.error(`Erreur API lors du chargement de la bannière pour la page ${pageName}:`, err);
      setErrorBanner(`Impossible de se connecter au serveur pour récupérer la bannière de la page ${pageName}.`);
      setBannerImageUrl(null);
      setImageLoaded(true);
    } finally {
      setLoadingApi(false);
    }
  }, [pageName]);

  useEffect(() => {
    fetchPageBanner();
  }, [fetchPageBanner]);

  const finalImageToDisplay = bannerImageUrl || defaultImage;

  useEffect(() => {
    if (!loadingApi && finalImageToDisplay && !imageLoaded) {
      const img = new Image();
      img.src = finalImageToDisplay;
      img.onload = () => {
        setImageLoaded(true);
      };
      img.onerror = () => {
        console.error("Erreur de chargement de l'image :", finalImageToDisplay);
        setImageLoaded(true);
      };
    } else if (!loadingApi && !finalImageToDisplay) {
      setImageLoaded(true);
    }
  }, [loadingApi, finalImageToDisplay, imageLoaded]);

  const showBackgroundImage = !loadingApi && imageLoaded && finalImageToDisplay;
  const backgroundColorForLoading = "#a7264aff'";

  return (
    <MotionBox
      component="section"
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      sx={{
        position: 'relative',
        height: { xs: '60vh', md: '90vh' },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundImage: showBackgroundImage ? `url(${finalImageToDisplay})` : 'none',
        backgroundColor: showBackgroundImage ? 'transparent' : backgroundColorForLoading,
        transition: 'background-image 0.5s ease-in-out, background-color 0.5s ease-in-out',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(1px)',
          zIndex: 1,
        }}
      />

      <Container
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
        }}
      >
        {loadingApi || !imageLoaded ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', mb: 4 }}>
            <Box sx={{ width: '60%', height: 80, backgroundColor: theme.palette.background.default, borderRadius: 1, mb: 2 }} />
            <Box sx={{ width: '40%', height: 40, backgroundColor: theme.palette.background.default, borderRadius: 1 }} />
          </Box>
        ) : (
          <>
            {!loadingApi && errorBanner && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" color="error" sx={{ color: theme.palette.error.light }}>

                </Typography>
              </Box>
            )}

            <MotionTypography
              variant="h2"
              fontFamily="Poppins"
              fontWeight="bold"
              fontSize={{ xs: '2rem', sm: '2.5rem', md: '3rem' }}
              color={theme.palette.background.default}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.4 }}
              sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
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
              sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}
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