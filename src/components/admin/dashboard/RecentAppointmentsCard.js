'use client';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
    Divider,
    useTheme
} from '@mui/material';
import { GetUpcomingAppointmentsForAdmin } from '@/apiCalls/appointments'; // Importe l'appel API

const RecentAppointmentsCard = () => {
    const theme = useTheme();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GetUpcomingAppointmentsForAdmin();
                if (response.success) {
                    setAppointments(response.data);
                } else {
                    setError(response.message || 'Erreur lors du chargement des rendez-vous à venir.');
                }
            } catch (err) {
                console.error("Erreur API:", err);
                setError("Impossible de se connecter au serveur pour les rendez-vous.");
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom
                sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: { xs: '15px', sm: '2rem' },
                }}>
                Rendez-vous à Venir
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : appointments.length > 0 ? (
                <List dense>
                    {appointments.map((apt) => (
                        <ListItem key={apt._id} sx={{
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: '8px',
                            mb: 1,
                            boxShadow: theme.shadows[1],
                            '&:hover': {
                                boxShadow: theme.shadows[3],
                            }
                        }}>
                            <ListItemText
                                primary={
                                    <Typography
                                        component="span"
                                        variant="body1"
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: { xs: '10px', sm: '13px' },
                                        }}

                                    >
                                        {new Date(apt.date).toLocaleDateString('fr-FR')} à {apt.startTime} - {apt.client?.firstName} {apt.client?.lastName}
                                    </Typography>
                                }
                                secondary={
                                    <Typography component="span" variant="body2" color="text.secondary">
                                        {" "} {apt.formula?.title} - Statut: {apt.status.replace('_', ' ')}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Alert
                    severity="info"
                    sx={{
                        textAlign: 'center',
                        mt: 2,
                        fontSize: { xs: '10px', sm: '15px' },
                        width: { xs: '50%', sm: '100%' },
                    }}
                >
                    Aucun rendez-vous prévu pour les prochains jours.
                </Alert>
            )}
        </Box>
    );
};

export default RecentAppointmentsCard;