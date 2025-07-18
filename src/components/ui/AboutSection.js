import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Grid, useTheme, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import globalVariables from '@/config/globalVariables';
import { GetAllPageBanners } from '@/apiCalls/banners';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const PAGE_NAME_KEY = "qui-suis-je"; // The specific page name key


function AboutSection() {
  const theme = useTheme();

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
      component="section"
      id="about"
      sx={{
        px: { xs: 3, md: 10 },
        py: { xs: 6, md: 12 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Grid
        container
        spacing={6}
        alignItems="center"
        justifyContent="center"
      >
        {/* Image - portrait */}
        <Grid size={{ xs: 12, md: 6 }} >
          <Box

            sx={{
              borderRadius: "2rem",
              overflow: "hidden",
              boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
            }}
          >
            {showImage ? (
              <Image
                src={bannerImageUrl}
                alt="Portrait de Nawële, fondatrice de l'institut"
                width={400}
                height={600}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
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
        </Grid>



        {/* Texte */}
        <Grid size={{ xs: 12, md: 12 }} >
          <MotionTypography
            variant="h3"
            component="h2"
            fontFamily="Poppins"
            fontWeight="bold"
            color={theme.palette.primary.main}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            mb={3}
          >
            Qui suis-je ?
          </MotionTypography>

          <MotionTypography
            variant="body1"
            fontFamily="Poppins"
            color="text.secondary"
            lineHeight={1.8}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Hello tout le monde !<br />
            Je me présente pour celles et ceux qui ne me connaissent pas encore : je m&apos;appelle Nawël, je suis la fondatrice de NANA HEAD SPA à Lannion, ouvert le 2 décembre 2024.
            <br />
            Avant de me lancer dans cette aventure incroyable, j&apos;ai travaillé dans des domaines aussi variés que le commerce, l&apos;animation, la restauration et j&apos;ai fait plusieurs saisons en station de ski – autant dire que la polyvalence, ça me connaît ! Mais au fond de moi, j&apos;ai toujours rêvé de devenir ma propre patronne, et aujourd&apos;hui, je vis enfin ce rêve.
            <br />
            J&apos;ai suivi une formation spécialisée à Paris, j&apos;ai perfectionné mes massages avec des heures d&apos;entraînement, et j&apos;ai rénové mon local de A à Z toute seule pour créer un espace de bien-être à mon image, pensé pour la détente et le renouveau.
            <br />
            Mon objectif ? Vous faire découvrir des moments d&apos;évasion et de relaxation profonde grâce à des soins uniques pour prendre soin de votre cuir chevelu, de vos cheveux et de votre esprit.
            <br />
            Merci à tous pour votre soutien incroyable depuis le début de cette aventure. Si vous n&apos;êtes jamais venus, j&apos;ai hâte de vous rencontrer et de vous faire découvrir tout ce que le Head Spa peut vous offrir !
          </MotionTypography>

          {/* Signature manuscrite */}
          <MotionTypography
            variant="h5"
            fontFamily="Poppins"
            color="text.secondary"
            mt={4}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Nawël ❤️
          </MotionTypography>
        </Grid>

      </Grid>
    </Box>
  );
}

export default AboutSection;
