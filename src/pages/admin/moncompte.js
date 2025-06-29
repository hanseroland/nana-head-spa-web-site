// client/pages/mon-compte.js

import React from 'react'; // Plus besoin de useState et useEffect locaux pour le chargement de l'user
import MyAccountForm from '@/components/admin/forms/MyAccountForm'; // Assurez-vous que le chemin est correct
import { Grid, Box, Typography, Container, CircularProgress, Alert } from '@mui/material';
import { SetCurrentUser } from '@/redux/slices/userSlice'; // Importation de l'action pour mettre à jour l'utilisateur
import MenuShortcut from '@/components/admin/common/MenuShortcut';
import { useAuth } from '@/context/AuthContext';


function Moncompte() {


    // ✅ On récupère currentUser, isAuthenticated et la fonction login depuis le contexte
    const { currentUser, isAuthenticated, loading, login } = useAuth();

    /**
      * @function handleProfileUpdateSuccess
      * @description Gère la mise à jour réussie du profil en mettant à jour l'état du contexte.
      * @param {object} updatedFields Les champs du profil qui ont été mis à jour.
      */
    const handleProfileUpdateSuccess = (updatedFields) => {

        login({
            ...currentUser, // Garde les autres propriétés de l'utilisateur
            ...updatedFields, // Applique les mises à jour
        }, null);
        console.log('Profil mis à jour avec succès dans le COntext !', updatedFields);
        // Ici, vous pourriez aussi déclencher une alerte de succès côté UI si MyAccountForm ne le fait pas déjà.
    };


    // Affiche un spinner pendant le chargement initial des informations utilisateur via le contexte
    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2 }}>Chargement du profil...</Typography>
            </Container>
        );
    }

    // Si l'utilisateur n'est pas authentifié après le chargement, affiche un message d'erreur ou redirige
    // Note: Normalement, `AdminLayout` devrait déjà gérer la redirection si `isAuthenticated` est false.
    // Cette partie est une sécurité ou pour un affichage spécifique sur la page si l'accès n'est pas direct via layout.
    if (!isAuthenticated || !currentUser) {
        return (
            <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
                <Alert severity="error">
                    <Typography variant="h6">Accès non autorisé</Typography>
                    <Typography>Veuillez vous connecter pour accéder à votre compte.</Typography>
                </Alert>
            </Container>
        );
    }

    // Si currentUser est disponible, on rend le formulaire
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
                Mon Compte
            </Typography>
            <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="flex-start" // Ajusté pour un meilleur alignement
            >
                <Grid size={{ xs: 12, md: 6, sm: 6, lg: 6 }}> {/* Utilise 'item' et définit la taille */}
                    <MyAccountForm
                        user={currentUser} // Passe l'utilisateur depuis Redux
                        onUpdateSuccess={handleProfileUpdateSuccess}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6, sm: 6, lg: 6 }}> {/* Une autre colonne pour d'autres informations */}
                    {/* Ici, vous pouvez ajouter d'autres composants comme l'historique des rendez-vous,
                        les informations de fidélité, etc. */}
                    <Box sx={{ p: 3, border: '1px dashed grey', borderRadius: 2, minHeight: 200 }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            <MenuShortcut userRole={currentUser?.role} />
                        </Typography>
                        {/* Ajoutez d'autres infos pertinentes ici */}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Moncompte;