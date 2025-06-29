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
import { GetFidelityAndEngagementStats } from '@/apiCalls/users'; // Importe l'appel API
import {
    EmojiEvents as TrophyIcon,
    PeopleAlt as ActiveUsersIcon,
    Subscriptions as AdsIcon,
} from '@mui/icons-material';

const FidelityEngagementCard = () => {
    const theme = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GetFidelityAndEngagementStats();
                if (response.success) {
                    setStats(response.data);
                } else {
                    setError(response.message || 'Erreur lors du chargement des statistiques de fidélité et engagement.');
                }
            } catch (err) {
                console.error("Erreur API:", err);
                setError("Impossible de se connecter au serveur pour les statistiques de fidélité et engagement.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Fidélité & Engagement
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : stats ? (
                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrophyIcon color="warning" />
                        <Typography variant="body1">
                            <Typography component="span" variant="h6" color="warning.main" sx={{ fontWeight: 700 }}>
                                {stats.usersAboveLevel500}
                            </Typography>{' '}
                            utilisateurs niveau fidélité &gt; 500
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrophyIcon color="info" />
                        <Typography variant="body1">
                            <Typography component="span" variant="h6" color="info.main" sx={{ fontWeight: 700 }}>
                                {stats.usersAboveLevel1000}
                            </Typography>{' '}
                            utilisateurs niveau fidélité &gt; 1000
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AdsIcon color="secondary" />
                        <Typography variant="body1">
                            <Typography component="span" variant="h6" color="secondary.main" sx={{ fontWeight: 700 }}>
                                {stats.totalAdsWatchedCount}
                            </Typography>{' '}
                            publicités visionnées au total
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ActiveUsersIcon color="success" />
                        <Typography variant="body1">
                            <Typography component="span" variant="h6" color="success.main" sx={{ fontWeight: 700 }}>
                                {stats.activeClientsCount}
                            </Typography>{' '}
                            clients actifs (RDV récents)
                        </Typography>
                    </Box>
                    {/* Si tu as un taux de rétention, tu peux l'afficher ici */}
                    {/*
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon color="primary" />
            <Typography variant="body1">
              Taux de rétention: <Typography component="span" variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>{stats.retentionRate * 100}%</Typography>
            </Typography>
          </Box>
          */}
                </Stack>
            ) : (
                <Alert severity="info">Aucune donnée de fidélité ou d'engagement disponible.</Alert>
            )}
        </Paper>
    );
};

export default FidelityEngagementCard;