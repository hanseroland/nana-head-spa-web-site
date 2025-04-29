import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, useTheme, IconButton } from '@mui/material';
import Image from 'next/image'; // Optimisation Next.js
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

const images = [
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
  const visibleItems = 8; // Nombre d'images visibles

  // Duplique les images pour l'effet infini
  const duplicatedImages = [...images, ...images, ...images];

  // Auto-scroll avec pause au hover
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex(prev => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Images visibles actuellement
  const visibleImages = duplicatedImages.slice(
    startIndex,
    startIndex + visibleItems
  );

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

      {/* Boutons de navigation */}
      <IconButton
        onClick={() => setStartIndex(prev => (prev - 1 + images.length) % images.length)}
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
        onClick={() => setStartIndex(prev => (prev + 1) % images.length)}
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

      {/* Conteneur du slider */}
      <motion.div
        animate={{
          x: `-${(startIndex % images.length) * (100 / visibleItems)}%`
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
        style={{
          display: 'flex',
          width: `${(duplicatedImages.length / visibleItems) * 100}%`
        }}
      >
        {duplicatedImages.map((image, index) => (
          <Box
            key={`${image.src}-${index}`}
            sx={{
              flex: `0 0 ${100 / visibleItems}%`,
              px: 1,
              position: 'relative',
              aspectRatio: '4/3'
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
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
              />

              {/* Overlay texte */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
                    : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="white"
                  sx={{
                    fontWeight: 500,
                    textAlign: 'center',
                    textShadow: theme.palette.mode === 'dark'
                      ? '0 1px 3px rgba(0,0,0,0.8)'
                      : '0 1px 2px rgba(0,0,0,0.8)'
                  }}
                >
                 
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </motion.div>
    </Box>
  );
};

export default InfiniteSlider;
