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
import { PieChart } from '@mui/x-charts/PieChart'; // Importe PieChart
import { GetAppointmentCountsByStatus } from '@/apiCalls/appointments'; // Importe l'appel API

const statusColors = {
    'pending': '#ffc107',    // warning - jaune
    'confirmed': '#28a745',  // success - vert
    'cancelled': '#dc3545',  // error - rouge
    'completed': '#007bff',  // primary - bleu
    'in_progress': '#17a2b8' // info - cyan
};

const AppointmentStatsCard = () => {
    const theme = useTheme();
    const [stats, setStats] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GetAppointmentCountsByStatus();
                if (response.success) {
                    setStats(response.data);
                    // Préparer les données pour le Pie Chart
                    const dataForChart = Object.entries(response.data.statusCounts).map(([status, count], index) => ({
                        id: index,
                        value: count,
                        label: `${status.replace('_', ' ')} (${count})`,
                        color: statusColors[status] || theme.palette.grey[500], // Utilise les couleurs prédéfinies ou gris par défaut
                    }));
                    setPieChartData(dataForChart);
                } else {
                    setError(response.message || 'Erreur lors du chargement des statistiques de rendez-vous.');
                }
            } catch (err) {
                console.error("Erreur API:", err);
                setError("Impossible de se connecter au serveur pour les statistiques de rendez-vous.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Paper
            elevation={3}
            sx={{
                p: { xs: 1, sm: 2 },
                borderRadius: '16px',
                height: '100%',
                width: { xs: '50%', sm: '100%' },
                display: 'flex',
                flexDirection: 'column',
            }}>
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
                Statistiques Rendez-vous
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : stats && stats.totalAppointments > 0 ? (
                <Stack spacing={2} alignItems="center">
                    <Typography variant="body1">
                        <Typography component="span" variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                            {stats.totalAppointments}
                        </Typography> {' '}
                        rendez-vous au total
                    </Typography>
                    <Box sx={{ width: '100%', height: 250 }}>
                        <PieChart
                            series={[{
                                data: pieChartData,
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            }]}
                            height={250}
                            margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                            sx={{
                                // Styles pour la légende du graphique si tu en as une
                                '& .MuiChartsLegend-root': {
                                    fill: theme.palette.text.primary,
                                },
                            }}
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Répartition par statut
                    </Typography>
                </Stack>
            ) : (
                <Alert severity="info">Aucun rendez-vous enregistré pour le moment.</Alert>
            )}
        </Paper>
    );
};

export default AppointmentStatsCard;