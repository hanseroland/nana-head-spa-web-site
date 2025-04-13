import React from 'react';
import { Box, Typography } from "@mui/material";
import { motion } from 'framer-motion';

function BlogHeader() {
  return (
    <Box
      component="header"
      sx={{
        px: { xs: 3, md: 8 },
        py: { xs: 6, md: 10 },
        backgroundColor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}>

      {/* Effet de texte animé avec framer-motion */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            fontFamily: "Poppins",
            textAlign: "center",
            mb: 4,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          }}
        >
          Bienvenue sur notre Blog
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
      >
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            mb: 6,
            fontSize: { xs: "1rem", sm: "1.2rem" },
            color: (theme) => theme.palette.text.secondary,
          }}
        >
          Explorez nos articles pour en savoir plus sur le bien-être, les soins et les astuces pour une vie relaxante.
        </Typography>
      </motion.div>

   
    </Box>
  );
}

export default BlogHeader;
