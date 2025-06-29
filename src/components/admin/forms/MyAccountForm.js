
import React, { useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    Alert,
    AlertTitle,
    Paper,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import SubmitButton from '../common/SubmitButton';


// Définition du schéma de validation avec Yup
const validationSchema = yup.object({
    firstName: yup
        .string()
        .trim()
        .min(2, 'Le prénom doit contenir au moins 2 caractères.')
        .max(50, 'Le prénom ne doit pas dépasser 50 caractères.')
        .required('Le prénom est requis.'),
    lastName: yup
        .string()
        .trim()
        .min(2, 'Le nom doit contenir au moins 2 caractères.')
        .max(50, 'Le nom ne doit pas dépasser 50 caractères.')
        .required('Le nom est requis.'),
    phone: yup
        .string()
        .trim()
        .matches(/^((\+|00)[1-9]{1,3})?[0-9]{6,14}$/, 'Le numéro de téléphone est invalide.')
        .optional(), // Rendre le numéro de téléphone facultatif
});

const MyAccountForm = ({ user, onUpdateSuccess }) => {
    // user: Les données de l'utilisateur actuel (passées en prop depuis la page parente)
    // onUpdateSuccess: Une fonction à appeler après une mise à jour réussie

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const formik = useFormik({
        initialValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || '',
        },

        validationSchema: validationSchema,
        enableReinitialize: true, // Permet de réinitialiser le formulaire si les props 'user' changent
        onSubmit: async (values) => {
            setLoading(true);
            setError(null);
            setSuccess(false);

            try {
                // Simuler un appel API pour la mise à jour des informations
                // Dans une vraie application, vous feriez ici un appel fetch ou axios
                // Exemple: const response = await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(values), headers: { 'Content-Type': 'application/json' } });
                // const data = await response.json();

                console.log('Tentative de mise à jour des informations:', values);

                // Simulation d'une réponse réussie après un délai
                await new Promise((resolve) => setTimeout(resolve, 1500));

                // Si l'API renvoie une erreur, la gérer ici
                // if (!response.ok) {
                //     throw new Error(data.message || 'Échec de la mise à jour du profil.');
                // }

                setSuccess(true);
                // Appeler la fonction de succès pour mettre à jour l'état de l'utilisateur parent si nécessaire
                onUpdateSuccess && onUpdateSuccess(values);

                // Réinitialiser le message de succès après quelques secondes
                setTimeout(() => setSuccess(false), 3000);
            } catch (err) {
                console.error('Erreur lors de la mise à jour:', err);
                setError(err.message || 'Une erreur inattendue est survenue.');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
                Mes Informations Personnelles
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Erreur</AlertTitle>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    <AlertTitle>Succès</AlertTitle>
                    Vos informations ont été mises à jour avec succès !
                </Alert>
            )}

            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="Prénom"
                    name="firstName"
                    autoComplete="given-name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Nom"
                    name="lastName"
                    autoComplete="family-name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    id="phone"
                    label="Numéro de téléphone"
                    name="phone"
                    autoComplete="tel"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    sx={{ mb: 2 }}
                />
                {/* L'email n'est pas modifiable directement via ce formulaire pour des raisons de sécurité et d'unicité */}
                <TextField
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Adresse email"
                    name="email"
                    value={user?.email || ''}
                    disabled
                    InputProps={{
                        readOnly: true, // Rend le champ non modifiable
                    }}
                    sx={{ mb: 3, '& .MuiInputBase-input.Mui-disabled': { color: 'text.primary', opacity: 0.8 } }}
                />
                <SubmitButton
                    loading={loading}
                    title="Mettre à jour le profil"
                />
            </Box>
        </Paper>
    );
};

export default MyAccountForm;