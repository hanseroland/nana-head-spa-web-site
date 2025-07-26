'use client';


import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import globalVariables from '@/config/globalVariables';
import { GetAllPageBanners } from '@/apiCalls/banners';

const PAGE_NAME_KEY = "univers-de-nana-head-spa";

const SpaIntroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [errorBanner, setErrorBanner] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchSpaIntroBanner = useCallback(async () => {
    setLoadingBanner(true);
    setErrorBanner(null);
    setImageLoaded(false);
    try {
      const response = await GetAllPageBanners();
      if (response.success && response.data) {
        const foundBanner = response.data.find(
          (banner) => banner.pageName === PAGE_NAME_KEY && banner.type === 'image' && banner.media?.url
        );

        if (foundBanner) {
          setBannerImageUrl(foundBanner.media.url);
          // imageLoaded will be set to true by the useEffect monitoring image preload
        } else {
          setBannerImageUrl(null); // No specific image found for this page/type
          setImageLoaded(true); // No image to load, consider it "loaded" for UI purposes
          setErrorBanner("Aucune image de bannière trouvée pour cette section.");
        }
      } else {
        setErrorBanner(response.message || "Erreur lors du chargement des bannières.");
        setBannerImageUrl(null);
        setImageLoaded(true); // API error, no image to load, consider "loaded"
      }
    } catch (err) {
      console.error(`Erreur API lors du chargement de la bannière pour ${PAGE_NAME_KEY}:`, err);
      setErrorBanner("Impossible de se connecter au serveur pour récupérer la bannière.");
      setBannerImageUrl(null);
      setImageLoaded(true); // Network error, no image to load, consider "loaded"
    } finally {
      setLoadingBanner(false);
    }
  }, []);

  useEffect(() => {
    fetchSpaIntroBanner();
  }, [fetchSpaIntroBanner]);

  // Preload image to set imageLoaded state
  useEffect(() => {
    if (!loadingBanner && bannerImageUrl && !imageLoaded) {
      const img = new window.Image(); // Use window.Image to ensure it's client-side
      img.src = bannerImageUrl;
      img.onload = () => {
        setImageLoaded(true);
      };
      img.onerror = (e) => {
        console.error("Erreur de préchargement de l'image de bannière:", bannerImageUrl, e);
        setErrorBanner("Le chargement de l'image a échoué. Veuillez vérifier l'URL ou le fichier.");
        setBannerImageUrl(null); // Clear the problematic URL
        setImageLoaded(true); // Consider it "loaded" to hide skeleton
      };
    } else if (!loadingBanner && !bannerImageUrl && !imageLoaded) {
      // If API finished and no URL, mark image as loaded
      setImageLoaded(true);
    }
  }, [loadingBanner, bannerImageUrl, imageLoaded]);

  const showImage = !loadingBanner && imageLoaded && bannerImageUrl;

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      sx={{
        backgroundColor: theme.palette.background.default,
        px: { xs: 3, md: 8 },
        py: { xs: 6, md: 10 },
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
      }}
    >
      {/* Illustration Image / Skeleton */}
      <Box
        component={motion.div}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            borderRadius: '2rem',
            overflow: 'hidden',
            width: '100%',
            maxWidth: 500,
            height: { xs: 250, sm: 350, md: 460 }, // Fixed height for skeleton
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showImage ? (
            <Image
              src={bannerImageUrl}
              alt="Image d'interieur de l'univers Nana Head Spa"
              width={450}
              height={460}
              layout="responsive"
              objectFit="cover"
              quality={90}
              priority
            />
          ) : (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.1)',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Texte */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 2 }}>
          L’univers de {globalVariables.siteName}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '15px', color: theme.palette.text.primary, mb: 4, whiteSpace: 'pre-line' }}>
          Offrez à vos cheveux et votre esprit une pause bien méritée.{"\n"}
          Chez {globalVariables.siteName}, on accueille aussi bien les femmes que les hommes dans un cocon apaisant, ou le bien être est au cœur de tout.{"\n"}
          Ici, chaque soin du cuir chevelu est pensé pour soulager les tensions, purifier l'esprit et sublimer la chevelure.{"\n"}
          Inspirée des rituels Japonais, mes massages capillaires allient détente profonde et soins personnalisés.{"\n"}
          Dans une ambiance douce et chaleureuse, vous êtes écouté(e)s chouchouté(e)s et respecté(e)s.{"\n"}{"\n"}

          <b>NANA HEAD SPA, c'est plus qu'un soin : c'est une parenthèse rien que pour vous.</b>{"\n"}
        </Typography>
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
          onClick={() => router.push('/presentation')}
        >
          En savoir plus
        </Button>
      </Box>
    </Box>
  );
};

export default SpaIntroSection;