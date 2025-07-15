import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Container, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import Bubble from "./Bubble"; // Assurez-vous que ce chemin est correct
import globalVariables from "@/config/globalVariables";
import { useRouter } from "next/router";
import { GetAllPageBanners } from '@/apiCalls/banners'; // Importez votre appel API pour les bannières

export default function Hero() {
  const theme = useTheme();
  const router = useRouter();

  const [bannerVideoUrl, setBannerVideoUrl] = useState(null); // URL de la vidéo de la BDD
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [errorBanner, setErrorBanner] = useState(null);

  // Vidéo statique par défaut
  const staticVideoSrc = "/videos/spa-head.mp4";

  // Charger les bannières de la page d'accueil
  const fetchHomeBanner = useCallback(async () => {
    setLoadingBanner(true);
    setErrorBanner(null);
    try {
      const response = await GetAllPageBanners();
      if (response.success && response.data) {
        // Trouvez la bannière pour la page 'home' qui est de type 'video'
        const homeVideoBanner = response.data.find(
          (banner) => banner.pageName === 'accueil' && banner.type === 'video' && banner.media?.url
        );

        if (homeVideoBanner) {
          setBannerVideoUrl(homeVideoBanner.media.url);
        } else {
          // Si aucune bannière vidéo pour la page 'home' n'est trouvée, on reste sur le null,
          // ce qui fera afficher la vidéo statique.
          setBannerVideoUrl(null);
        }
      } else {
        // En cas d'échec de l'API, affiche un message d'erreur et utilise la vidéo statique
        setErrorBanner(response.message || "Erreur lors du chargement des bannières.");
        setBannerVideoUrl(null);
      }
    } catch (err) {
      console.error("Erreur API lors du chargement des bannières:", err);
      setErrorBanner("Impossible de se connecter au serveur pour récupérer les bannières.");
      setBannerVideoUrl(null);
    } finally {
      setLoadingBanner(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeBanner();
  }, [fetchHomeBanner]);

  // Déterminez la vidéo à afficher
  // Si loadingBanner est vrai, on ne sait pas encore si on a une vidéo, donc on n'affiche rien (ou un placeholder).
  // Une fois le chargement terminé, si bannerVideoUrl est défini, on l'utilise, sinon la statique.
  const videoToDisplay = loadingBanner ? null : (bannerVideoUrl || staticVideoSrc);

  const bubbleVariants = {
    animate: {
      y: [0, -50, 0],
      opacity: [0.6, 0.8, 0.6],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

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

      {/* Bulles flottantes */}
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
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 4, md: 6 },
          zIndex: 2,
        }}
      >
        {/* Partie gauche */}
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
              mb: 2,
              fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem", lg: "4.5rem" },
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.62)',
            }}
          >
            Bienvenue chez <span style={{ color: theme.palette.primary.main }}>{globalVariables.siteName}</span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "background.default",
              mb: 4,
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem" },
            }}
          >
            Offrez-vous une expérience de bien-être unique et relaxante.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
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
                fontSize: { xs: "1rem", md: "1.1rem" },
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
                fontSize: { xs: "1rem", md: "1.1rem" },
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

        {/* Partie droite (vidéo) */}
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
            boxShadow: (theme) => theme.shadows[4],
          }}
        >
          <Box
            sx={{
              width: { md: "400px", lg: "530px" },
              height: { md: "420px", lg: "550px" },
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: (theme) => theme.shadows[4],
              position: "relative",
              mt: 2,
              mx: "auto",
            }}
          >
            {loadingBanner ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                <CircularProgress color="secondary" />
              </Box>
            ) : videoToDisplay ? (
              <video
                key={videoToDisplay} // Ajoute une clé pour forcer le re-rendu si l'URL change
                src={videoToDisplay}
                autoPlay
                loop
                muted
                playsInline // Important pour la lecture automatique sur mobile
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scale(1.1) rotate(-10deg)", // Zoom + inclinaison vers la gauche
                  transformOrigin: "center",
                }}
                onError={(e) => {
                  console.error("Erreur de chargement de la vidéo :", videoToDisplay, e);
                  // Optionnel : Bascule vers la vidéo statique en cas d'échec de la dynamique
                  setBannerVideoUrl(staticVideoSrc);
                  setErrorBanner("Impossible de charger la vidéo de la bannière. Affichage de la vidéo par défaut.");
                }}
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: theme.palette.grey[300] }}>
                <Typography variant="caption" color="text.secondary">Vidéo non disponible</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}