import React from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip,
    Divider,
    Avatar
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Schéma de validation avec Yup
const validationSchema = Yup.object().shape({
    status: Yup.string()
        .required('Le statut est requis')
        .oneOf(['confirmé', 'en cours', 'rejeté'], 'Statut invalide'),
    notes: Yup.string()
        .max(500, 'Les notes ne doivent pas dépasser 500 caractères')
});

const RendezvousForm = ({ rendezvous, onSave, onCancel }) => {
    // Valeurs initiales du formulaire
    const initialValues = {
        status: rendezvous?.status || 'en cours',
        notes: rendezvous?.notes || ''
    };

    // Options de statut
    const statusOptions = [
        { value: 'confirmé', label: 'Confirmé', color: 'success' },
        { value: 'en cours', label: 'En cours', color: 'warning' },
        { value: 'rejeté', label: 'Rejeté', color: 'error' }
    ];

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onSave({
                    ...values,
                    id: rendezvous.id
                });
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, isSubmitting }) => (
                <Form>
                    <Box sx={{ p: 3 }}>
                        {/* Section Informations client */}
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1 }} />
                            Informations client
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                        <PersonIcon />
                                    </Avatar>
                                    <Typography>{rendezvous.client}</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                        <PhoneIcon />
                                    </Avatar>
                                    <Typography>{rendezvous.telephone}</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                                    <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                        <EmailIcon />
                                    </Avatar>
                                    <Typography>{rendezvous.email}</Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Section Détails RDV */}
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <EventIcon sx={{ mr: 1 }} />
                            Détails du rendez-vous
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                                    <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                                        <EventIcon />
                                    </Avatar>
                                    <Typography>
                                        {new Date(rendezvous.date).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                                    <Avatar sx={{ bgcolor: 'secondary.light', mr: 2 }}>
                                        <AccessTimeIcon />
                                    </Avatar>
                                    <Typography>
                                        {new Date(rendezvous.date).toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Section Édition */}
                        <Typography variant="h6" gutterBottom>
                            Gestion du rendez-vous
                        </Typography>

                        <Grid container spacing={2}>
                            {/* Champ Statut */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="status-label">Statut</InputLabel>
                                    <Field
                                        as={Select}
                                        labelId="status-label"
                                        id="status"
                                        name="status"
                                        label="Statut"
                                        error={touched.status && Boolean(errors.status)}
                                    >
                                        {statusOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Chip
                                                    label={option.label}
                                                    color={option.color}
                                                    size="small"
                                                    sx={{ minWidth: 100 }}
                                                />
                                            </MenuItem>
                                        ))}
                                    </Field>
                                    {touched.status && errors.status && (
                                        <Typography color="error" variant="caption">{errors.status}</Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Champ Notes */}
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    name="notes"
                                    label="Notes complémentaires"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    variant="outlined"
                                    error={touched.notes && Boolean(errors.notes)}
                                    helperText={touched.notes && errors.notes}
                                />
                            </Grid>
                        </Grid>

                        {/* Actions */}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                onClick={onCancel}
                                variant="outlined"
                                color="secondary"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                            >
                                Enregistrer les modifications
                            </Button>
                        </Box>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default RendezvousForm;