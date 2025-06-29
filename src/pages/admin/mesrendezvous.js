import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, useTheme } from '@mui/material';
import { GetMyAppointments } from '@/apiCalls/appointments'; // Votre appel API
import TreatmentHistoryCard from '@/components/admin/mon-compte/TreatmentHistoryCard';

const MesRendezVous = () => {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme(); // Accédez au thème actuel pour le style

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GetMyAppointments();
                if (response.success) {
                    // S'assurer que les données sont un tableau avant de les définir
                    setHistory(Array.isArray(response.data) ? response.data : []);
                } else {
                    setError(response.message || 'Échec du chargement de l\'historique des soins.');
                    setHistory([]);
                }
            } catch (err) {
                console.error('Erreur lors de la récupération de l\'historique des soins :', err);
                setError('Impossible de se connecter au serveur pour récupérer l\'historique.');
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []); // Le tableau de dépendances vide signifie que cela s'exécute une fois au montage

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 4 }, // Padding responsive
                maxWidth: '900px', // Largeur maximale pour le contenu, le centre sur les grands écrans
                mx: 'auto', // Centrer le contenu
                backgroundColor: theme.palette.background.default, // Utilise le fond par défaut du thème
                minHeight: '100vh', // S'assure qu'il prend toute la hauteur de la fenêtre
                color: theme.palette.text.primary, // Couleur principale du texte
            }}
        >
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: 700, // Gras pour les titres
                    mb: { xs: 3, sm: 4 },
                    textAlign: 'center',
                    color: theme.palette.primary.main, // Couleur primaire pour le titre principal
                }}
            >
                Mes Rendez-vous Pris
            </Typography>

            {loading && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                    <CircularProgress sx={{ color: theme.palette.primary.main }} />
                    <Typography sx={{ mt: 2, color: theme.palette.text.secondary }}>Chargement de vos RDV...</Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && history.length === 0 && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    Vous n'avez pas encore pris de RDV.
                </Alert>
            )}

            <Box
                sx={{
                    display: 'grid', // Utilise CSS Grid pour une mise en page responsive
                    gap: { xs: 2, sm: 3 }, // Espacement entre les cartes
                    gridTemplateColumns: {
                        xs: '1fr', // 1 colonne sur les écrans très petits
                        sm: 'repeat(auto-fill, minmax(300px, 1fr))', // Remplissage automatique avec min 300px de large sur les petits+
                        md: 'repeat(auto-fill, minmax(350px, 1fr))', // Cartes légèrement plus larges sur les moyens+
                    },
                }}
            >
                {history.map((appointment) => (
                    <TreatmentHistoryCard key={appointment._id} appointment={appointment} />
                ))}
            </Box>
        </Box>
    );
};

export default MesRendezVous;