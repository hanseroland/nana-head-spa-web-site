import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Divider,
    Paper,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { GetMonthlyAppointmentTrend } from '@/apiCalls/appointments'; // Importe l'appel API
import { GetAllFormulas } from '@/apiCalls/formulas'; // Si tu veux filtrer par formule



const AppointmentTrendChartCard = () => {
    const theme = useTheme();
    const [chartData, setChartData] = useState({ dates: [], counts: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState(''); // Pour le filtre par statut
    const [filterFormula, setFilterFormula] = useState(''); // Pour le filtre par formule
    const [formulas, setFormulas] = useState([]); // Pour la liste des formules

    useEffect(() => {
        const fetchFormulas = async () => {
            // Si tu veux la liste des formules pour le filtre
            const response = await GetAllFormulas();
            if (response.success) {
                setFormulas(response.data);
            }
        };
        fetchFormulas();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const filters = {};
                if (filterStatus) {
                    filters.status = filterStatus;
                }
                if (filterFormula) {
                    filters.formulaId = filterFormula;
                }

                const response = await GetMonthlyAppointmentTrend(filters);
                if (response.success) {
                    const dates = response.data.map(item => new Date(item.date));
                    const counts = response.data.map(item => item.count);
                    setChartData({ dates, counts });
                } else {
                    setError(response.message || 'Erreur lors du chargement de la progression des rendez-vous.');
                }
            } catch (err) {
                console.error("Erreur API:", err);
                setError("Impossible de se connecter au serveur pour la progression des rendez-vous.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [filterStatus, filterFormula]); // Re-fetch quand les filtres changent

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Progression des Rendez-vous (3 Mois)
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Filtres */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="status-filter-label">Statut</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        id="status-filter"
                        value={filterStatus}
                        label="Statut"
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <MenuItem value="">Tous</MenuItem>
                        <MenuItem value="pending">En attente</MenuItem>
                        <MenuItem value="confirmed">Confirmé</MenuItem>
                        <MenuItem value="cancelled">Annulé</MenuItem>
                        <MenuItem value="completed">Terminé</MenuItem>
                        <MenuItem value="in_progress">En cours</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="formula-filter-label">Formule</InputLabel>
                    <Select
                        labelId="formula-filter-label"
                        id="formula-filter"
                        value={filterFormula}
                        label="Formule"
                        onChange={(e) => setFilterFormula(e.target.value)}
                    >
                        <MenuItem value="">Toutes</MenuItem>
                        {formulas.map((formula) => (
                            <MenuItem key={formula._id} value={formula._id}>{formula.title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : chartData.dates.length > 0 ? (
                <Box sx={{ width: '100%', height: 300, flexGrow: 1 }}>
                    <LineChart
                        xAxis={[{
                            data: chartData.dates,
                            scaleType: 'time',
                            valueFormatter: (date) => date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
                        }]}
                        series={[{
                            data: chartData.counts,
                            label: 'Nombre de rendez-vous',
                            color: theme.palette.primary.main // Couleur principale du thème
                        }]}
                        width={600} // Ajustez selon la largeur du conteneur ou utilisez flex pour responsive
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
                <Alert severity="info">Aucune donnée de progression des rendez-vous disponible pour la période et les filtres sélectionnés.</Alert>
            )}
        </Paper>
    );
};

export default AppointmentTrendChartCard;