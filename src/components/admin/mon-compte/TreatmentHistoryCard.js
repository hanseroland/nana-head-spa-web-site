import React from 'react';
import { Box, Typography, Paper, Chip, Divider, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';


//fonction utilitaire pour le statut ---
const getStatusProps = (status, theme) => {
    let color = theme.palette.text.primary; // Couleur par défaut
    let label = 'Inconnu';
    let chipColor = 'default'; // Couleur par défaut du composant Chip

    switch (status) {
        case 'pending':
            label = 'En attente';
            chipColor = 'info'; // MUI info color (blue)
            color = theme.palette.info.main;
            break;
        case 'confirmed':
            label = 'Confirmé';
            chipColor = 'success'; // MUI success color (green)
            color = theme.palette.success.main;
            break;
        case 'cancelled':
            label = 'Annulé';
            chipColor = 'error'; // MUI error color (red)
            color = theme.palette.error.main;
            break;
        case 'in_progress':
            label = 'En cours';
            chipColor = 'warning'; // MUI warning color (orange)
            color = theme.palette.warning.main;
            break;
        case 'completed':
            label = 'Terminé';
            chipColor = 'primary'; // Utilise la couleur primaire de ton thème pour "terminé"
            color = theme.palette.primary.main;
            break;
        default:
            // Laissez les valeurs par défaut
            break;
    }
    return { label, chipColor, color };
};
// --- Fin fonction utilitaire ---



const TreatmentHistoryCard = ({ appointment }) => {
    const theme = useTheme();

    // Vérifications défensives pour les champs populés
    const formulaTitle = appointment.formula?.title || 'Formule inconnue';
    const formulaPrice = appointment.formula?.price || 'Prix inconnu';
    const beauticianName = appointment?.processedBy
        ? `${appointment?.processedBy.firstName} ${appointment?.processedBy.lastName}`
        : 'N/A';
    const notes = appointment.adminNotes || 'Aucune note spécifique.';
    const status = appointment.status || 'unknown'; // Récupère le statut du RDV

    // Utilise la fonction utilitaire pour obtenir les props du statut
    const statusProps = getStatusProps(status, theme);


    return (
        <Paper
            elevation={2} // Ombre subtile pour la profondeur, style Apple
            sx={{
                p: { xs: 2, sm: 3 }, // Plus de padding sur les grands écrans
                borderRadius: '16px', // Bords arrondis
                backgroundColor: theme.palette.background.paper, // Utilise le fond paper du thème
                border: `1px solid ${theme.palette.divider}`, // Bordure subtile
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)', // Léger soulèvement au survol
                },
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1.5, sm: 2 }, // Espacement entre les éléments
            }}
        >
            {/* Date & Titre de la formule */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        fontSize: { xs: '1rem', sm: '1.15rem' },
                        flexGrow: 1, // Permet au titre de prendre l'espace disponible
                        minWidth: 0, // Empêche le débordement avec les longs titres
                        pr: 1, // Padding à droite
                    }}
                >
                    {formulaTitle} - {formulaPrice} €
                </Typography>
                <Chip
                    label={appointment.date ? format(new Date(appointment.date), 'dd MMMM yyyy', { locale: fr }) : 'Date inconnue'}
                    size="small"
                    color="primary"
                    sx={{
                        backgroundColor: theme.palette.primary.main, // Couleur de bulle claire
                        fontWeight: 500,
                        fontSize: { xs: '0.75rem', sm: '0.8rem' },
                        px: { xs: 1, sm: 1.5 },
                        py: { xs: 0.5, sm: 0.75 },
                        borderRadius: '12px',
                    }}
                />
            </Box>

            <Divider sx={{ my: { xs: 1, sm: 1.5 }, borderColor: theme.palette.divider }} />

            {/* Détails (Esthéticienne, Notes) */}
            <Box>
                {
                    beauticianName?.processedBy && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
                            <b>Esthéticienne :</b>{' '}
                            <Typography component="span" variant="body1" color="text.primary" sx={{ fontWeight: 600 }}>
                                {beauticianName}
                            </Typography>
                        </Typography>
                    )
                }

                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    <b>Notes du soin :</b>{' '}
                    <Typography component="span" variant="body1" color="text.primary">
                        {notes}
                    </Typography>
                </Typography>

                {/* --- Ajout du statut du RDV --- */}
                <Box sx={{ mt: 1 }}> {/* Marge pour séparer du texte précédent */}
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        <b>Statut du RDV :</b>{' '}
                        <Chip
                            label={statusProps.label}
                            color={statusProps.chipColor} // Utilise la couleur de chip Mui
                            size="small"
                            sx={{
                                fontWeight: 600,
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                px: { xs: 0.5, sm: 1 },
                                borderRadius: '8px',
                                // Appliquer une couleur de texte spécifique si nécessaire
                                // color: statusProps.color // La couleur du texte est gérée par la prop `color` du Chip MUI par défaut
                            }}
                        />
                    </Typography>
                </Box>
                {/* --- Fin de l'ajout du statut --- */}
            </Box>
        </Paper>
    );
};

export default TreatmentHistoryCard;