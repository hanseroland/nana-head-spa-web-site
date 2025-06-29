// client/pages/mon-compte.js

import React, { useState } from 'react'; // Plus besoin de useState et useEffect locaux pour le chargement de l'user
import { Grid, Box, Container } from '@mui/material';
import ClientFidelityProgress from '@/components/admin/ClientFidelityProgress';
import AdHistories from '@/components/admin/AdHistories';

function Fidelite() {


    // Nouveau état pour déclencher le rafraîchissement de l'historique
    const [refreshHistoryTrigger, setRefreshHistoryTrigger] = useState(0); // On utilise un compteur pour forcer le changement

    // Fonction appelée par FidelityProgress quand le niveau change avec succès
    const handleLevelUpSuccess = () => {
        setRefreshHistoryTrigger(prev => prev + 1); // Incrémente le compteur pour forcer le rafraîchissement
    };


    return (
        <Container>

            <Grid
                container
                spacing={4}
                justifyContent="center"
                alignItems="flex-start" // Ajusté pour un meilleur alignement
            >
                <Grid size={{ xs: 12, md: 6, sm: 6, lg: 6 }} > {/* Utilise 'item' et définit la taille */}
                    <Box sx={{ p: 3, border: '1px dashed grey', borderRadius: 2, minHeight: 200 }}>
                        <ClientFidelityProgress onLevelUpSuccess={handleLevelUpSuccess} />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6, sm: 6, lg: 6 }} > {/* Une autre colonne pour d'autres informations */}
                    {/* Ici, vous pouvez ajouter d'autres composants comme l'historique des rendez-vous,
                        les informations de fidélité, etc. */}
                    <Box sx={{ p: 3, border: '1px dashed grey', borderRadius: 2, minHeight: 200 }}>
                        <AdHistories onRefresh={refreshHistoryTrigger} />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Fidelite;