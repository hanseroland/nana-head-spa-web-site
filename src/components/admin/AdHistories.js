import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    List,
    ListItem,
    ListItemText,
    Chip,
    useTheme,
} from '@mui/material';
import { GetMyAdHistory } from '@/apiCalls/fidelity';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdHistories = ({ onRefresh }) => { // onRefresh est une prop optionnelle si vous voulez le rafraîchir de l'extérieur
    const [adHistory, setAdHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [errorHistory, setErrorHistory] = useState(null);

    const theme = useTheme();

    const fetchAdHistory = async () => {
        setLoadingHistory(true);
        setErrorHistory(null);
        try {
            const historyResponse = await GetMyAdHistory();
            if (historyResponse.success) {
                setAdHistory(Array.isArray(historyResponse.data) ? historyResponse.data : []);
            } else {
                setErrorHistory(historyResponse.message || "Erreur lors du chargement de l'historique des publicités.");
                setAdHistory([]);
            }
        } catch (err) {
            console.error("Erreur API lors du chargement de l'historique des pubs:", err);
            setErrorHistory("Impossible de se connecter au serveur pour récupérer l'historique des publicités.");
            setAdHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchAdHistory();
    }, [onRefresh]); // Recharger l'historique si onRefresh change (peut être un compteur ou un boolean)

    return (
        <Paper
            elevation={2}
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: '16px',
                width: '100%',
                maxWidth: '700px', // Pour correspondre à la largeur du FidelityProgress
                mx: 'auto', // Centrage
                backgroundColor: theme.palette.background.paper,
                mt: 3, // Marge supérieure pour séparer du composant de progression
            }}
        >
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 2 }}>
                Historique des Publicités Visionnées
            </Typography>

            {loadingHistory ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={20} sx={{ color: theme.palette.primary.main }} />
                    <Typography sx={{ ml: 1, color: theme.palette.text.secondary }}>Chargement de l'historique...</Typography>
                </Box>
            ) : errorHistory ? (
                <Alert severity="error" sx={{ width: '100%' }}>{errorHistory}</Alert>
            ) : adHistory.length === 0 ? (
                <Alert severity="info" sx={{ width: '100%' }}>
                    Vous n'avez pas encore visionné de publicités pour la progression de fidélité.
                </Alert>
            ) : (
                <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: '8px', overflow: 'hidden' }}>
                    {adHistory.map((entry, index) => (
                        <ListItem key={entry._id || index} divider>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                                            Niveau {entry.levelBeforeAd} {'->'} {entry.levelAfterAd}
                                        </Typography>
                                        <Chip
                                            label={format(new Date(entry.watchedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                            size="small"
                                            sx={{
                                                backgroundColor: theme.palette.custom.bubble1,
                                                color: theme.palette.primary.main,
                                            }}
                                        />
                                    </Box>
                                }
                                secondary={entry.adId ? `ID Publicité: ${entry.adId}` : 'Publicité générique'}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default AdHistories;