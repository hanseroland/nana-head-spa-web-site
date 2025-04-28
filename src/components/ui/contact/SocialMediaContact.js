'use client';

import { FacebookOutlined, Instagram } from '@mui/icons-material';
import { Box, Button, Grid, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const SocialMediaContact = () => {
  const theme = useTheme();

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      sx={{
        textAlign: 'center',
        py: 4,
        px: 2,
        mt: { xs: 1, md: 1 },
        mx: 'auto',
        maxWidth: 1000,
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: theme.palette.primary.main,
          mb: 4,
        }}
      >
        Suivez-nous sur les réseaux
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* Icônes Réseaux Sociaux */}
        <Grid item>
          <IconButton
            component="a"
            href="https://www.facebook.com/share/1Bz63Ahy2u/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: '50%',
              p: 2,
              boxShadow: 2,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
              },
              color: theme.palette.primary.main,
            }}
          >
            <FacebookOutlined  />
          </IconButton>
        </Grid>

        <Grid item>
          <IconButton
            component="a"
            href="https://www.instagram.com/nana_head_spa?igsh=MWhnbWVuY3F0YTVodA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: '50%',
              p: 2,
              boxShadow: 2,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: theme.palette.primary.main ,
                color: '#fff',
              },
              color: theme.palette.primary.main ,
            }}
          >
            <Instagram size={32} />
          </IconButton>
        </Grid>
      </Grid>

      {/* QR Code pour Instagram */}
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="h6"
          component="p"
          sx={{ mb: 2, fontWeight: 500}}
        >
          Scannez pour accéder directement à notre page Instagram ✨
        </Typography>

        <Box
          sx={{
            width: 200,
            height: 200,
            mx: 'auto',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: 3,
          }}
        >
          <Image
            src="/images/instagramQR.jpeg"
            alt="QR Code Instagram Nana Head Spa"
            width={200}
            height={200}
            style={{ objectFit: 'cover' }}
          />
        </Box>
      </Box>

      {/* Bouton Réserver via Instagram */}
      <Box sx={{ mt: 6 }}>
        <Button
          component={Link}
          href="https://ig.me/m/nana_head_spa"
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            borderRadius: '2rem',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            transition: 'background-color 0.3s',
            '&:hover': {
             backgroundColor: theme.palette.primary.dark,
              color: 'primary.main'
          },
          }}
        >
          Réserver sur Instagram
        </Button>
      </Box>
    </Box>
  );
};

export default SocialMediaContact;
