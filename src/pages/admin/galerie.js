import React from 'react'
import { Box, useTheme } from '@mui/material'
import GalleryManager from '@/components/admin/GalleryManager';


function Galerie() {

    const theme = useTheme(); // Accédez au thème actuel pour le style

    return (
        <Box
            sx={{
                p: 3, // Padding responsive
                mx: 'auto', // Centrer le contenu
                backgroundColor: theme.palette.background.default, // Utilise le fond par défaut du thème
                minHeight: '100vh', // S'assure qu'il prend toute la hauteur de la fenêtre
                color: theme.palette.text.primary, // Couleur principale du texte
            }}
        >
            <GalleryManager />
        </Box>
    )
}

export default Galerie