import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Divider,
    useTheme
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { GetNewRegistrationsLast7Days } from '@/apiCalls/users'; // Importe l'appel API

const NewRegistrationsChartCard = () => {
    const theme = useTheme();
    const [chartData, setChartData] = useState({ dates: [], counts: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GetNewRegistrationsLast7Days();
                if (response.success) {
                    const dates = response.data.map(item => new Date(item.date));
                    const counts = response.data.map(item => item.count);
                    setChartData({ dates, counts });
                } else {
                    setError(response.message || 'Erreur lors du chargement des données d\'inscription.');
                }
            } catch (err) {
                console.error("Erreur API:", err);
                setError("Impossible de se connecter au serveur pour les nouvelles inscriptions.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Nouvelles Inscriptions (7 Jours)
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : chartData.dates.length > 0 ? (
                <Box sx={{ width: '100%', height: 300 }}>
                    <LineChart
                        xAxis={[{
                            data: chartData.dates,
                            scaleType: 'time',
                            valueFormatter: (date) => date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
                        }]}
                        series={[{ data: chartData.counts, label: 'Inscriptions' }]}
                        width={500} // La largeur peut être ajustée ou devenir fluide avec un conteneur parent
                        height={300}
                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        sx={{
                            '& .MuiChartsAxis-line': { stroke: theme.palette.text.secondary },
                            '& .MuiChartsAxis-tickLabel': { fill: theme.palette.text.secondary },
                            '& .MuiChartsLegend-root': { fill: theme.palette.text.primary },
                        }}
                    />
                </Box>
            ) : (
                <Alert severity="info">Pas de données d'inscription récentes.</Alert>
            )}
        </Box>
    );
};

export default NewRegistrationsChartCard;