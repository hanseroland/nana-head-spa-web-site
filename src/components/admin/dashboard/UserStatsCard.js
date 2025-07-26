'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Divider,
    Paper,
    Stack,
    useTheme
} from '@mui/material';
import { GetUserCountsByRole } from '@/apiCalls/users'; // Importe l'appel API

const UserStatsCard = () => {
    const theme = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GetUserCountsByRole();
                if (response.success) {
                    setStats(response.data);
                } else {
                    setError(response.message || 'Erreur lors du chargement des statistiques utilisateurs.');
                }
            } catch (err) {
                console.error("Erreur API:", err);
                setError("Impossible de se connecter au serveur pour les statistiques utilisateurs.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Paper elevation={2}
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
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: { xs: '15px', sm: '2rem' },
                }}
            >
                Statistiques Utilisateurs
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : stats ? (
                <Stack spacing={1.5}>
                    <Typography variant="body1">
                        <Typography component="span" variant="h6" color="primary.main" sx={{ fontSize: { xs: '10px', sm: '13px' }, fontWeight: 700 }}>
                            {stats.totalUsers}
                        </Typography> {' '}
                        utilisateurs au total
                    </Typography>
                    <Typography variant="body1">
                        <Typography component="span" variant="h6" color="success.main" sx={{ fontSize: { xs: '10px', sm: '13px' }, fontWeight: 700 }}>
                            {stats.totalClients}
                        </Typography> {' '}
                        clients
                    </Typography>
                    <Typography variant="body1">
                        <Typography component="span" variant="h6" color="secondary.main" sx={{ fontSize: { xs: '10px', sm: '13px' }, fontWeight: 700 }}>
                            {stats.totalAdmins}
                        </Typography> {' '}
                        administrateurs
                    </Typography>
                </Stack>
            ) : (
                <Alert severity="info"
                    sx={{
                        textAlign: 'center',
                        mt: 2,
                        fontSize: { xs: '10px', sm: '15px' },
                        width: { xs: '50%', sm: '100%' },
                    }}

                >
                    Aucune donnée utilisateur disponible.
                </Alert>
            )}
        </Paper>
    );
};

export default UserStatsCard;