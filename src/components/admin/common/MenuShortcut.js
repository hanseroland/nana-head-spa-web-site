import React from 'react';
import { Box, Typography, Paper, Button, Divider, useTheme } from '@mui/material';
import { useRouter } from 'next/router'; // Ou 'react-router-dom' si tu ne utilises pas Next.js

// Définition des options de navigation pour chaque rôle
const clientNavigation = [

    { name: 'Historique des soins', path: '/admin/mes-soins' },
    { name: 'Historique de fidélité', path: '/adlin/fidelite' },
    { name: 'Mes rendez-vous', path: '/admin/mesrendezvous' },
    { name: 'Articles et Conseils', path: '/admin/articles' },

];

const adminNavigation = [
    { name: 'Gestion des rendez-vous', path: '/admin/rendezvous' },
    { name: 'Gestion des formules', path: '/admin/formules' },
    { name: 'Gestion des utilisateurs', path: '/admin/users' },
    { name: 'Articles et Conseils', path: '/admin/articles' },

];

const MenuShortcut = ({ userRole = 'client' }) => { // userRole par défaut à 'client' si non spécifié
    const theme = useTheme();
    const router = useRouter();

    // Sélectionne les options de navigation en fonction du rôle
    const navigationOptions = userRole === 'admin' ? adminNavigation : clientNavigation;
    const menuTitle = userRole === 'admin' ? 'Raccourcis' : 'Raccourcis';

    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <Paper
            elevation={4} // Élévation pour un effet de profondeur prononcé comme les widgets Apple
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: '20px', // Bords très arrondis
                backgroundColor: theme.palette.background.paper, // Utilise le fond paper du thème
                width: '100%',
                maxWidth: '400px', // Largeur fixe pour le menu pour le rendre compact
                mx: 'auto', // Centrage horizontal
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1.5, sm: 2 }, // Espacement entre les éléments
                boxShadow: `0px 8px 20px rgba(0, 0, 0, ${theme.palette.mode === 'dark' ? 0.3 : 0.1})`, // Ombre plus prononcée
            }}
        >
            <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    textAlign: 'center',
                    color: theme.palette.primary.main,
                    mb: { xs: 2, sm: 3 },
                }}
            >
                {menuTitle}
            </Typography>

            <Divider sx={{ mb: { xs: 1.5, sm: 2 }, borderColor: theme.palette.divider }} />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5, // Espacement entre les boutons de navigation
                }}
            >
                {navigationOptions.map((item) => (
                    <Button
                        key={item.name}
                        variant="contained"
                        fullWidth // Le bouton prend toute la largeur disponible
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                            justifyContent: 'flex-start', // Alignement du texte à gauche
                            py: { xs: 1.2, sm: 1.5 }, // Padding vertical
                            borderRadius: '12px', // Bords légèrement arrondis
                            backgroundColor: theme.palette.action.selected, // Couleur de fond neutre pour les boutons du menu
                            color: theme.palette.text.primary, // Texte de couleur primaire
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover, // Changement de couleur au survol
                            },
                            boxShadow: 'none', // Pas d'ombre sur les boutons eux-mêmes pour un look plus plat
                            textTransform: 'none', // Pas de majuscules
                            fontSize: { xs: '0.95rem', sm: '1rem' },
                            fontWeight: 500,
                        }}
                    >
                        {item.name}
                    </Button>
                ))}
            </Box>
        </Paper>
    );
};

export default MenuShortcut;