import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { useRouter } from "next/router";
import { GetAllPageBanners } from '@/apiCalls/banners';
import globalVariables from "@/config/globalVariables";
import { useTheme } from "@mui/material/styles";



const HeroBanner = () => {

    const router = useRouter();
    const theme = useTheme();

    const [bannerVideoUrl, setBannerVideoUrl] = useState(null);
    const [loadingApi, setLoadingApi] = useState(true);
    const [errorBanner, setErrorBanner] = useState(null);
    const [videoLoaded, setVideoLoaded] = useState(false);

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
            sx={{
                width: '100%',
                height: { xs: '60vh', md: '100vh' },
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                color: 'text.primary',
                p: { xs: 2, md: 0 }
            }}
        >
            {/* Conteneur de la vidéo en arrière-plan */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Overlay pour améliorer la lisibilité du texte
                        zIndex: 1,
                    }
                }}
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        minWidth: '100%',
                        minHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        objectFit: 'cover'
                    }}
                >
                    <source src="/videos/vocexjwlar2co1asbsq7.mov" type="video/webm" />
                    <source src={bannerVideoUrl} type="video/mp4" />
                    Votre navigateur ne supporte pas la balise vidéo.
                </video>
            </Box>

            {/* Contenu de la bannière (texte et boutons) */}
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 4,
                        width: '100%',
                    }}
                >
                    {/* Bloc de gauche (titres et boutons) */}
                    <Box
                        sx={{
                            flex: 1,
                            textAlign: { xs: 'center', md: 'left' },
                            zIndex: 2,
                        }}
                    >
                        <Typography
                            variant="h2"
                            component="h1"
                            gutterBottom
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
                            variant="h5"
                            component="p"
                            gutterBottom
                            sx={{
                                color: "background.default",
                                mb: { xs: 1, sm: 4, md: 4 },
                                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem" },
                            }}
                        >
                            Offrez-vous une expérience de bien-être unique et relaxante.
                        </Typography>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            justifyContent={{ xs: 'center', md: 'flex-start' }}
                        >
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderRadius: "2rem",
                                    border: `2px solid ${theme.palette.primary.main}`,
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: "bold",
                                    fontFamily: "Poppins",
                                    textTransform: "none",
                                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                                    fontSize: { xs: "12px", md: "1rem" },
                                    width: { xs: "100%", md: "auto" },
                                    backgroundColor: "transparent",
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                    },

                                }}
                            >
                                Découvrez nos formules
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderRadius: "2rem",
                                    border: `2px solid ${theme.palette.primary.main}`,
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: "bold",
                                    fontFamily: "Poppins",
                                    textTransform: "none",
                                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                                    fontSize: { xs: "12px", md: "1rem" },
                                    width: { xs: "100%", md: "auto" },
                                    backgroundColor: "transparent",
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                    },
                                }}
                            >
                                Prendre un rendez-vous
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default HeroBanner;