'use client';

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
            elevation={4}
            sx={{
                p: { xs: 1, sm: 2 },
                borderRadius: '16px',
                height: '100%',
                width: { xs: '50%', sm: '100%' },
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    textAlign: 'flex-start',
                    color: theme.palette.primary.main,
                    fontSize: { xs: '15px', sm: '2rem' },
                    mb: { xs: 2, sm: 3 },
                }}
            >
                {menuTitle}
            </Typography>

            <Divider sx={{ mb: { xs: 1, sm: 2 }, borderColor: theme.palette.divider }} />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1, // Espacement entre les boutons de navigation
                }}
            >
                {navigationOptions.map((item) => (
                    <Button
                        key={item.name}
                        variant="contained"
                        fullWidth
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                            justifyContent: 'flex-start',
                            py: { xs: 1.2, sm: 1.5 },
                            borderRadius: '12px',
                            backgroundColor: theme.palette.action.selected,
                            color: theme.palette.text.primary,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            },
                            boxShadow: 'none',
                            textTransform: 'none',
                            fontSize: { xs: '10px', sm: '15px' },
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