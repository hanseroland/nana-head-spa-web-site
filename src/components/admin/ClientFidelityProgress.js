import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Paper,
    LinearProgress,
    useTheme,
    Snackbar,
} from '@mui/material';
import { WatchAdAndLevelUp, GetMyFidelityLevel } from '@/apiCalls/fidelity';
import { format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

const FidelityProgress = ({ onLevelUpSuccess }) => {
    const [level, setLevel] = useState(1);
    const [lastAdWatchedAt, setLastAdWatchedAt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progressing, setProgressing] = useState(false);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const theme = useTheme();

    // Fonction pour récupérer le niveau de fidélité et la dernière date de progression
    const fetchFidelityData = async () => {
        setLoading(true);
        setError(null);
        try {
            const levelResponse = await GetMyFidelityLevel();
            if (levelResponse.success) {
                setLevel(levelResponse.data.level);
                setLastAdWatchedAt(levelResponse.data.lastAdWatchedAt ? new Date(levelResponse.data.lastAdWatchedAt) : null);
            } else {
                setError(levelResponse.message || 'Erreur lors de la récupération du niveau de fidélité.');
            }
        } catch (err) {
            console.error('Erreur API lors de la récupération du niveau de fidélité:', err);
            setError('Impossible de se connecter au serveur pour récupérer votre niveau de fidélité.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFidelityData();
    }, []);

    const handleWatchAd = async () => {
        if (progressing) return; // Empêcher les clics multiples
        setProgressing(true);
        setError(null);

        // Simulation de la lecture d'une publicité (1 minute)
        setSnackbarMessage('Lecture de la publicité... (environ 1 minute)');
        setSnackbarSeverity('info');
        setSnackbarOpen(true);

        setTimeout(async () => {
            try {
                const response = await WatchAdAndLevelUp();
                if (response.success) {
                    setLevel(response.data.newLevel);
                    setLastAdWatchedAt(response.data.lastAdWatchedAt ? new Date(response.data.lastAdWatchedAt) : null);
                    setSnackbarMessage(response.message);
                    setSnackbarSeverity('success');
                    // APPEL DU CALLBACK ICI pour informer le parent
                    if (onLevelUpSuccess) {
                        onLevelUpSuccess();
                    }
                    // Important: Si AdHistories n'est pas un enfant, vous devrez rafraîchir son état
                    // via un contexte ou un gestionnaire d'état global, ou passer une prop onLevelUp.
                    // Pour l'instant, on suppose qu'AdHistories récupère ses propres données.
                } else {
                    setError(response.message);
                    setSnackbarMessage(response.message);
                    setSnackbarSeverity('error');
                }
            } catch (err) {
                console.error('Erreur lors de la progression de niveau:', err);
                setError('Une erreur inattendue est survenue.');
                setSnackbarMessage('Une erreur inattendue est survenue.');
                setSnackbarSeverity('error');
            } finally {
                setProgressing(false);
                setSnackbarOpen(true);
            }
        }, 60000); // 60 secondes = 1 minute
    };

    const canLevelUp = lastAdWatchedAt === null || !isToday(lastAdWatchedAt);
    const nextLevel = Math.min(level + 1, 1000); // Pour la barre de progression

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 4 }, // Padding autour du contenu
                maxWidth: '700px', // Largeur maximale
                mx: 'auto', // Centrage
                backgroundColor: theme.palette.background.default, // Fond principal
                color: theme.palette.text.primary, // Couleur du texte
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 2, sm: 3 },
            }}
        >
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    textAlign: 'center',
                    color: theme.palette.primary.main,
                }}
            >
                Débloque les Niveaux de Fidélité
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                    <CircularProgress sx={{ color: theme.palette.primary.main }} />
                    <Typography sx={{ mt: 2, color: theme.palette.text.secondary }}>Chargement de votre progression...</Typography>
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>
            ) : (
                <Paper
                    elevation={4} // Plus d'élévation pour le bloc principal
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: '20px', // Très arrondis
                        width: '100%',
                        backgroundColor: theme.palette.background.paper,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: { xs: 2, sm: 3 },
                    }}
                >
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Votre Niveau Actuel
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            color: theme.palette.custom.terracotta, // Couleur accentuée
                            fontSize: { xs: '3rem', sm: '4rem' },
                            lineHeight: 1,
                        }}
                    >
                        {level}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Prochain niveau : {nextLevel} / 1000
                    </Typography>

                    <LinearProgress
                        variant="determinate"
                        value={(level / 1000) * 100}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            width: '100%',
                            backgroundColor: theme.palette.divider,
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: theme.palette.primary.main,
                                borderRadius: 5,
                            },
                        }}
                    />

                    {level < 1000 ? (
                        <Button
                            variant="contained"
                            onClick={handleWatchAd}
                            disabled={progressing || !canLevelUp}
                            sx={{ mt: 2, width: { xs: '100%', sm: 'auto' } }}
                        >
                            {progressing ? (
                                <>
                                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                                    Publicité en cours...
                                </>
                            ) : canLevelUp ? (
                                'Regarder une pub pour passer un niveau'
                            ) : (
                                `Revenez demain (${lastAdWatchedAt ? format(new Date(lastAdWatchedAt.getTime() + 24 * 60 * 60 * 1000), 'dd/MM/yyyy', { locale: fr }) : ''})`
                            )}
                        </Button>
                    ) : (
                        <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
                            Félicitations ! Vous avez atteint le niveau maximum de 1000.
                        </Alert>
                    )}

                    {lastAdWatchedAt && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            Dernière progression : {format(lastAdWatchedAt, "dd/MM/yyyy à HH:mm", { locale: fr })}
                        </Typography>
                    )}
                </Paper>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default FidelityProgress;