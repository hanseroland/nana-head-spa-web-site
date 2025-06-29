// client/components/Layouts/AuthLayout.js

import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const AuthLayout = ({ children }) => {
    return (
        <Box
            sx={{
                minHeight: '100vh', // Prend toute la hauteur de la fenêtre
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centre verticalement le contenu
                alignItems: 'center',     // Centre horizontalement le contenu
                // On peut ajouter un fond spécifique si désiré pour les pages d'auth
                // background: 'linear-gradient(to bottom right, #fce4ec, #e0f2f7)', // Exemple de dégradé girly
                bgcolor: 'background.default', // Utilise la couleur de fond du thème MUI
                p: 2, // Petit padding général
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Bienvenue sur NANA HEAD SPA ! {/* Titre de la page d'authentification */}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
                <a href="/" style={{ color: "white", textDecoration: "none", fontWeight: 'bolder' }}> {/* Mise à jour du href pour Next.js */}
                    Accueil
                </a>
            </Typography>
            <Container maxWidth="sm"> {/* Conteneur pour limiter la largeur du contenu d'auth */}
                {children} {/* C'est ici que le contenu de la page (connexion/inscription) sera rendu */}
            </Container>
        </Box>
    );
};

export default AuthLayout;