// components/SpaIntroSection.jsx
import React from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import globalVariables from '@/src/config/globalVariables';

const SpaIntroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

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
      {/* Illustration Image */}
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
        <Box sx={{ borderRadius: '2rem', overflow: 'hidden', width: '100%', maxWidth: 450, boxShadow: theme.shadows[1] }}>
          <Image
            src="/images/spa-nana-head.jpeg"
            alt="Expérience head spa pour femmes"
            width={450}
            height={440}
            layout="responsive"
            objectFit="cover"
            quality={90}
            priority
          />
        </Box>
      </Box>


      {/* Texte */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 2 }}>
          L’univers du {globalVariables.siteName}
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4, whiteSpace: 'pre-line' }}>
          Offrez à vos cheveux et votre esprit une pause bien méritée.{"\n"}
          Notre {globalVariables.siteName}, pensé exclusivement pour les femmes, mêle douceur, détente et soins personnalisés.{"\n"}
          Chaque geste, chaque parfum, chaque son est conçu pour apaiser vos tensions et raviver votre éclat naturel.{"\n"}
          Loin du stress du quotidien, entrez dans une bulle de sérénité et de beauté.{"\n"}
          Découvrez une ambiance unique, subtilement parfumée et enveloppée de teintes douces.{"\n"}
          Laissez-vous chouchouter par des rituels capillaires venus du Japon, dans un cocon girly, doux et relaxant.
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
