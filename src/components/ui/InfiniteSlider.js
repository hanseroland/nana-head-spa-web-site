import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, useTheme, IconButton, CircularProgress } from '@mui/material';
import Image from 'next/image'; // Optimisation Next.js
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { GetAllGalleryImages } from '@/apiCalls/gallery'; // Assurez-vous que ce chemin est correct

// Galerie statique par défaut
const staticImages = [
  { src: '/images/nana-head.jpeg', label: "Nawël responsable de Nana Head Spa" },
  { src: '/images/spa-nana-head.jpeg', label: 'Interieur Nana Head Spa' },
  { src: '/images/arche-nana-head.jpeg', label: 'Arche' },
  { src: '/images/presentation-nana-head.jpeg', label: 'Interieur Nana Head Spa' },
  { src: '/images/presentation-nana-head-spa.jpeg', label: 'Interieur Nana Head Spa' },
  { src: '/images/archenana-head-spa.jpeg', label: 'Interieur Nana Head Spa' },
];

const InfiniteSlider = () => {
  const theme = useTheme();
  const [startIndex, setStartIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]); // État pour les images de la BDD
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const visibleItems = 8; // Nombre d'images visibles

  // Fonction pour charger les images de la galerie depuis l'API
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


  // Déterminez la source des images : BDD ou statique
  const imagesToDisplay = galleryImages.length > 0 ? galleryImages : staticImages;

  // Duplique les images pour l'effet infini.
  // On duplique imagesToDisplay, pas seulement staticImages.
  const duplicatedImages = [...imagesToDisplay, ...imagesToDisplay, ...imagesToDisplay];


  // Auto-scroll avec pause au hover
  useEffect(() => {
    // S'assurer qu'il y a des images à faire défiler
    if (imagesToDisplay.length === 0) return;

    const interval = setInterval(() => {
      setStartIndex(prev => (prev + 1) % imagesToDisplay.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [imagesToDisplay.length]); // Dépend de la longueur des images actuellement affichées

  // Images visibles actuellement pour le slider infini
  // On utilise imagesToDisplay.length ici pour la logique de modulo
  const visibleImages = duplicatedImages.slice(
    startIndex,
    startIndex + visibleItems
  );

  if (imagesToDisplay.length === 0) {
    return null;
  }

  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      py: 4,
      backgroundColor: theme.palette.background.default
    }}>
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

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
          <Typography ml={2}>Chargement de la galerie...</Typography>
        </Box>
      )}

      {error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <Typography color="error" textAlign="center">
            {error}
            <br />
            Affichage de la galerie par défaut.
          </Typography>
        </Box>
      )}

      {!loading && imagesToDisplay.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <Typography color="text.secondary" textAlign="center">
            Aucune image disponible pour le moment.
          </Typography>
        </Box>
      )}

      {!loading && imagesToDisplay.length > 0 && (
        <>
          {/* Boutons de navigation - conditionnels si au moins une image */}
          {imagesToDisplay.length > 0 && (
            <>
              <IconButton
                onClick={() => setStartIndex(prev => (prev - 1 + imagesToDisplay.length) % imagesToDisplay.length)}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  zIndex: 2,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark
                  }
                }}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                onClick={() => setStartIndex(prev => (prev + 1) % imagesToDisplay.length)}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  zIndex: 2,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark
                  }
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}


          {/* Conteneur du slider */}
          <motion.div
            // Animer le x en fonction du startIndex et de la taille des éléments
            animate={{
              x: `-${(startIndex % imagesToDisplay.length) * (100 / visibleItems)}%`
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            style={{
              display: 'flex',
              // La largeur doit être basée sur le nombre total d'images dupliquées
              width: `${(duplicatedImages.length / visibleItems) * 100}%`
            }}
          >
            {duplicatedImages.map((image, index) => (
              <Box
                key={`${image.src}-${index}`} // Clé unique combinant src et index pour éviter les problèmes avec les images dupliquées
                sx={{
                  flex: `0 0 ${100 / visibleItems}%`,
                  px: 1,
                  position: 'relative',
                  aspectRatio: '4/3' // Maintient le ratio d'aspect pour toutes les images
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: '250px', md: '350px' },
                    height: { xs: '250px', md: '350px' },
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      boxShadow: theme.shadows[6]
                    }
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.label}
                    fill
                    style={{ objectFit: 'cover' }}
                    // Ajoutez un gestionnaire d'erreurs pour les images si nécessaire
                    onError={(e) => {
                      console.error("Erreur de chargement d'image:", image.src, e);
                      e.target.style.display = 'none'; // Cache l'image cassée
                    }}
                  />


                </Box>
              </Box>
            ))}
          </motion.div>
        </>
      )}
    </Box>
  );
};

export default InfiniteSlider;