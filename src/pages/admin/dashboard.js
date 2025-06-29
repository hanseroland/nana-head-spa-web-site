import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    useTheme,
    Divider,
    CircularProgress,
    Alert,
} from '@mui/material';

// Importe les composants enfants du dashboard
import RecentAppointmentsCard from '@/components/admin/dashboard/RecentAppointmentsCard';
import NewRegistrationsChartCard from '@/components/admin/dashboard/NewRegistrationsChartCard';
import MenuShortcut from '@/components/admin/common/MenuShortcut';
import UserStatsCard from '@/components/admin/dashboard/UserStatsCard';
import AppointmentStatsCard from '@/components/admin/dashboard/AppointmentStatsCard';
import FormulaPopularityCard from '@/components/admin/dashboard/FormulaPopularityCard';
import AppointmentTrendChartCard from '@/components/admin/dashboard/AppointmentTrendChartCard';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';


const Dashboard = () => {

    const theme = useTheme();
    const router = useRouter(); // Initialisation de useRouter


    // ✅ On récupère currentUser, isAuthenticated et loading depuis le contexte
    const { currentUser, isAuthenticated, loading } = useAuth();


    // --- Affichage conditionnel basé sur l'état de chargement et d'authentification ---

    // Affiche un spinner pendant le chargement initial des informations utilisateur via le contexte
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2 }}>Chargement du tableau de bord...</Typography>
            </Box>
        );
    }

    // Gère la redirection si l'utilisateur n'est pas authentifié ou n'est pas un admin
    if (!isAuthenticated || !currentUser || currentUser.role !== 'admin') {
        // Redirige vers la page de connexion si non authentifié
        // Ou redirige un client vers son espace si il tente d'accéder au dashboard admin
        if (!isAuthenticated) {
            router.push('/connexion');
        } else if (currentUser.role !== 'admin') {
            router.push('/admin/moncompte'); // Redirige le client vers son compte
        }

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
                <Alert severity="error">
                    <Typography variant="h6">Accès Refusé</Typography>
                    <Typography>Vous n'êtes pas autorisé à accéder à cette page.</Typography>
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 4 }, flexGrow: 1, backgroundColor: theme.palette.background.default }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                Tableau de Bord Administrateur
            </Typography>


            <Grid container spacing={{ xs: 1, md: 1 }}>

                <Grid size={{ xs: 12, md: 6 }}>
                    <RecentAppointmentsCard />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} >
                    <UserStatsCard />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }} >
                    <MenuShortcut userRole={currentUser?.role} />
                </Grid>

                <Grid mt={2} container size={{ xs: 12, md: 12 }} spacing={{ xs: 2, md: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }} >
                        <NewRegistrationsChartCard />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }} >
                        <AppointmentStatsCard />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }} >
                        <FormulaPopularityCard />
                    </Grid>
                </Grid>



                <Grid mt={2} container size={{ xs: 12, md: 12 }} spacing={{ xs: 2, md: 3 }}>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary, mt: 4 }}>
                            Performance et Tendances
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }} >
                        <AppointmentTrendChartCard />
                    </Grid>

                </Grid>




            </Grid>

        </Box>
    );
};

export default Dashboard;