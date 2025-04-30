'use client';

import { Box, Typography, Link, Stack } from '@mui/material';
import { Phone, LocationOn, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const contactDetails = [
  {
    icon: <Phone sx={{ fontSize: 40 }} />,
    label: 'Téléphone',
    value: '+33 06 66 73 59 53',
    link: 'tel:+33666735953',
  },
  {
    icon: <LocationOn sx={{ fontSize: 40 }} />,
    label: 'Adresse',
    value: '15 rue Pen Kerivon, LANNION, France',
    link: 'https://www.google.com/maps/place/15+Rue+Pen+Kerivon,+22300+Lannion,+France',
  },
  {
    icon: <Email sx={{ fontSize: 40 }} />,
    label: 'E-mail',
    value: 'nawel22@laposte.net',
    link: 'mailto:nawel22@laposte.net',
  },
];

const QuickContactInfo = () => {
  const theme = useTheme();

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      sx={{
        px: 2,
        py: 6,
        maxWidth: '1000px',
        mx: 'auto',
        textAlign: 'center',
        mb: 4,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        justifyContent="center"
        alignItems="center"
      >
        {contactDetails.map((item, index) => (
          <Box
            key={index}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200 }}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: '2rem',
              p: 4,
              minWidth: '250px',
              boxShadow: 3,
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <Link
              href={item.link}
              target="_blank"
              underline="none"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: theme.palette.primary.main,
                '&:hover': { color: theme.palette.secondary.main },
              }}
            >
              {item.icon}
              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {item.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: theme.palette.text.secondary,
                  maxWidth: '200px',
                }}
              >
                {item.value}
              </Typography>
            </Link>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default QuickContactInfo;
