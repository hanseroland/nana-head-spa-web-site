import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Divider,
    Paper,
    List,
    ListItem,
    ListItemText,
    useTheme,
    Stack
} from '@mui/material';
import { GetFormulaPopularity } from '@/apiCalls/appointments'; // Importe l'appel API

const FormulaPopularityCard = () => {
    const theme = useTheme();
    const [popularity, setPopularity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GetFormulaPopularity();
                if (response.success) {
                    setPopularity(response.data);
                } else {
                    setError(response.message || 'Erreur lors du chargement de la popularité des formules.');
                }
            } catch (err) {
                console.error("Erreur API:", err);
                setError("Impossible de se connecter au serveur pour la popularité des formules.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Popularité des Formules
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : popularity && (popularity.mostReserved.length > 0 || popularity.leastReserved.length > 0) ? (
                <Stack spacing={3}>
                    {popularity.mostReserved.length > 0 && (
                        <Box>
                            <Typography variant="h6" sx={{ color: theme.palette.secondary.main, mb: 1 }}>
                                Top 5 des plus réservées
                            </Typography>
                            <List dense>
                                {popularity.mostReserved.map((formula, index) => (
                                    <ListItem key={formula.formulaId || index} sx={{
                                        backgroundColor: theme.palette.background.paper,
                                        borderRadius: '8px',
                                        mb: 0.5,
                                        boxShadow: theme.shadows[1],
                                        '&:hover': {
                                            boxShadow: theme.shadows[3],
                                        }
                                    }}>
                                        <ListItemText primary={`${index + 1}. ${formula.title}`} secondary={`Réservations: ${formula.count}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    {popularity.leastReserved.length > 0 && (
                        <Box>
                            <Typography variant="h6" sx={{ color: theme.palette.secondary.main, mb: 1 }}>
                                Top 5 des moins réservées*
                            </Typography>
                            <List dense>
                                {popularity.leastReserved.map((formula, index) => (
                                    <ListItem key={formula.formulaId || index} sx={{
                                        backgroundColor: theme.palette.background.paper,
                                        borderRadius: '8px',
                                        mb: 0.5,
                                        boxShadow: theme.shadows[1],
                                        '&:hover': {
                                            boxShadow: theme.shadows[3],
                                        }
                                    }}>
                                        <ListItemText primary={`${index + 1}. ${formula.title}`} secondary={`Réservations: ${formula.count}`} />
                                    </ListItem>
                                ))}
                            </List>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                *Parmi les formules ayant au moins une réservation.
                            </Typography>
                        </Box>
                    )}
                </Stack>
            ) : (
                <Alert severity="info">Aucune donnée de popularité de formule disponible.</Alert>
            )}
        </Paper>
    );
};

export default FormulaPopularityCard;