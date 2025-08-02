'use client';

import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Container, Typography } from "@mui/material"; // CircularProgress removed
import { Skeleton } from "@mui/material"; // Skeleton imported
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import Bubble from "./Bubble";
import globalVariables from "@/config/globalVariables";
import { useRouter } from "next/router";
import { GetAllPageBanners } from '@/apiCalls/banners';

export default function Hero() {
  const theme = useTheme();
  const router = useRouter();

  const [bannerVideoUrl, setBannerVideoUrl] = useState(null);
  const [loadingApi, setLoadingApi] = useState(true); // Renamed from loadingBanner to clarify API call state
  const [errorBanner, setErrorBanner] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false); // New state to track actual video loading

  const fetchHomeBanner = useCallback(async () => {
    setLoadingApi(true);
    setErrorBanner(null);
    setVideoLoaded(false); // Reset video loaded state
    setBannerVideoUrl(null); // Clear previous URL to ensure skeleton shows if new fetch starts

    try {
      const response = await GetAllPageBanners();
      if (response.success && response.data) {
        const homeVideoBanner = response.data.find(
          (banner) => banner.pageName === 'accueil' && banner.type === 'video' && banner.media?.url
        );

        if (homeVideoBanner) {
          setBannerVideoUrl(homeVideoBanner.media.url);
          // videoLoaded will be set to true by the useEffect monitoring video preload
        } else {
          setErrorBanner("Aucune bannière vidéo n'a été trouvée pour la page d'accueil.");
          setBannerVideoUrl(null);
          setVideoLoaded(true); // No video to load, so consider it "loaded" for UI purposes
        }
      } else {
        setErrorBanner(response.message || "Erreur lors du chargement des bannières.");
        setBannerVideoUrl(null);
        setVideoLoaded(true); // API error, no video to load, consider "loaded"
      }
    } catch (err) {
      console.error("Erreur API lors du chargement des bannières:", err);
      setErrorBanner("Impossible de se connecter au serveur pour récupérer les bannières.");
      setBannerVideoUrl(null);
      setVideoLoaded(true); // Network error, no video to load, consider "loaded"
    } finally {
      setLoadingApi(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeBanner();
  }, [fetchHomeBanner]);

  // Preload video to set videoLoaded state
  useEffect(() => {
    if (!loadingApi && bannerVideoUrl && !videoLoaded) {
      const videoElement = document.createElement('video');
      videoElement.src = bannerVideoUrl;
      videoElement.preload = 'auto'; // Request browser to preload
      videoElement.onloadeddata = () => { // Or oncanplaythrough for more certainty
        setVideoLoaded(true);
      };
      videoElement.onerror = (e) => {
        console.error("Erreur de préchargement de la vidéo :", bannerVideoUrl, e);
        setErrorBanner("Impossible de charger la vidéo de la bannière. Le fichier vidéo est peut-être corrompu ou inaccessible.");
        setBannerVideoUrl(null); // Remove the problematic URL
        setVideoLoaded(true); // Consider it "loaded" to hide skeleton
      };
    } else if (!loadingApi && !bannerVideoUrl && !videoLoaded) {
      // If API finished and no URL, mark video as loaded
      setVideoLoaded(true);
    }
  }, [loadingApi, bannerVideoUrl, videoLoaded]);



  const showVideoContent = !loadingApi && videoLoaded && bannerVideoUrl;
  const showNoVideoMessage = !loadingApi && videoLoaded && !bannerVideoUrl;

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        minHeight: { xs: "40vh", md: "70vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.background.default})`,
        color: theme.palette.text.primary,
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 6, sm: 8, md: 10 },
      }}
    >
      <Bubble />

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 0.3, y: 0 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        style={{
          position: "absolute",
          top: "8%",
          left: "10%",
          width: "120px",
          height: "120px",
          backgroundColor: "#FFD1DC",
          borderRadius: "50%",
          filter: "blur(50px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.3, y: 0 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "160px",
          height: "160px",
          backgroundColor: "#E59AA6",
          borderRadius: "50%",
          filter: "blur(70px)",
        }}
      />

      <Container
        maxWidth="fluid"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 2, md: 2 },
          zIndex: 2,
        }}
      >
        <Box
          component={motion.div}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          mt={{ xs: 4, md: 6 }}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              fontFamily: "Poppins",
              color: "background.default",
              mb: { xs: 1, sm: 4, md: 4 },
              fontSize: { xs: "1.5rem", sm: "3rem", md: "4rem", lg: "4rem" },
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.62)',
            }}
          >
            Bienvenue chez <span style={{ color: theme.palette.primary.main }}>{globalVariables.siteName}</span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "background.default",
              mb: { xs: 1, sm: 4, md: 4 },
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem" },
            }}
          >
            Offrez-vous une expérience de bien-être unique et relaxante.
          </Typography>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: { xs: "row", md: "row" },
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                borderRadius: "2rem",
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                fontFamily: "Poppins",
                textTransform: "none",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                fontSize: { xs: "12px", md: "1rem" },
                width: { xs: "190px", md: "auto" },
              }}
              component={motion.a}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/formules')}
            >
              Découvrir nos formules
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                borderRadius: "2rem",
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                fontFamily: "Poppins",
                textTransform: "none",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                fontSize: { xs: "12px", md: "1rem" },
                width: { xs: "190px", md: "auto" },
              }}
              component={motion.a}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/reservations')}
            >
              Prendre un rendez-vous
            </Button>
          </Box>
        </Box>
        {/** Video ordi */}
        <Box
          component={motion.div}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          mt={{ xs: 4, md: 6 }}
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            position: "relative",
            borderRadius: "1rem",
            overflow: "hidden",

          }}
        >
          <Box
            sx={{
              width: { sm: '300px', md: "450px", lg: "700px" },
              height: { sx: "420px", sm: '300px', md: "450px", lg: "700px" },
              borderRadius: "50%",
              overflow: "hidden",
              position: "relative",
              mt: 2,
              mx: "auto",
            }}
          >
            {loadingApi || !videoLoaded ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  transform: "scale(1.1) rotate(-10deg)",
                  transformOrigin: "center",
                }}
              />
            ) : showVideoContent ? (
              <video
                key={bannerVideoUrl}
                src={bannerVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scale(1.1) rotate(-10deg)",
                  transformOrigin: "center",
                }}
                onError={(e) => {
                  console.error("Erreur de lecture de la vidéo :", bannerVideoUrl, e);
                  setBannerVideoUrl(null); // Clear the problematic URL
                  setErrorBanner("La vidéo ne peut pas être lue.");
                }}
              />
            ) : showNoVideoMessage ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: theme.palette.grey[300] }}>
                <Typography variant="caption" color="text.secondary">
                  {errorBanner || "Vidéo non disponible pour le moment."}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Box>

        {/** Video mobile */}
        <Box
          component={motion.div}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          mt={{ xs: 1, md: 1 }}
          sx={{
            flex: 1,
            display: { xs: "block", md: "none", sm: "block" },
            position: "relative",
            overflow: "hidden",
            borderRadius: "20px",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: { xs: "350px", sm: "450px" },
              overflow: "hidden",
              position: "relative",

            }}
          >
            {loadingApi || !videoLoaded ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.1)',
                }}
              />
            ) : showVideoContent ? (
              <video
                key={bannerVideoUrl}
                src={bannerVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  //borderRadius: "1rem",
                  //transform: "scale(1.1) rotate(-10deg)",
                  transformOrigin: "center",
                }}
                onError={(e) => {
                  console.error("Erreur de lecture de la vidéo :", bannerVideoUrl, e);
                  setBannerVideoUrl(null); // Clear the problematic URL
                  setErrorBanner("La vidéo ne peut pas être lue.");
                }}
              />
            ) : showNoVideoMessage ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: theme.palette.grey[300] }}>
                <Typography variant="caption" color="text.secondary">
                  {errorBanner || "Vidéo non disponible pour le moment."}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Box>
        {/**Boutons mobiles */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: { xs: "row", md: "row" },
            gap: 1,
            mt: 1,
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              borderRadius: "2rem",
              px: 3,
              py: 1,
              fontWeight: "bold",
              fontFamily: "Poppins",
              textTransform: "none",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
              fontSize: { xs: "12px", md: "1rem" },
              width: { xs: "190px", md: "auto" },
            }}
            component={motion.a}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/formules')}
          >
            Découvrir nos formules
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              borderRadius: "2rem",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              fontFamily: "Poppins",
              textTransform: "none",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
              fontSize: { xs: "12px", md: "1rem" },
              width: { xs: "190px", md: "auto" },
            }}
            component={motion.a}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/reservations')}
          >
            Prendre un rendez-vous
          </Button>
        </Box>
      </Container>
    </Box>
  );
}