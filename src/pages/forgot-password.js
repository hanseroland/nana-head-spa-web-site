import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, TextField, Alert, CircularProgress, Link } from '@mui/material';
import SubmitButton from '@/components/admin/common/SubmitButton';
import { ForgotPasswordRequest } from '@/apiCalls/auth';

// Schéma de validation pour l'email
const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Email invalide").required("L'email est requis"),
});

const ForgotPassword = () => {
    const [status, setStatus] = useState(null); // 'success', 'error', 'loading'
    const [message, setMessage] = useState('');

    const handleSubmit = async (values, { setSubmitting }) => {
        setStatus('loading');
        setMessage('');

        try {
            const response = await ForgotPasswordRequest(values);
            if (response.success) {
                setStatus('success');
                setMessage(response.message);
            } else {
                setStatus('error');
                setMessage(response.message || 'Erreur lors de la demande de réinitialisation.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            sx={
                {
                    maxWidth: 400,
                    mx: 'auto',
                    my: 8,
                    p: 3,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}
        >
            <Typography variant="h5" component="h1" gutterBottom>
                Mot de passe oublié
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
                Entrez votre email pour recevoir un lien de réinitialisation.
            </Typography>

            {status === 'success' && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            {status === 'error' && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

            {status !== 'success' && (
                <Formik
                    initialValues={{ email: '' }}
                    validationSchema={ForgotPasswordSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form>
                            <Field
                                name="email"
                                as={TextField}
                                label="Email"
                                fullWidth
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                sx={{ mb: 2 }}
                            />
                            <SubmitButton isSubmitting={isSubmitting} title="Envoyer le lien" />
                        </Form>
                    )}
                </Formik>
            )}

            <Typography variant="body2" sx={{ mt: 2 }}>
                <Link href="/connexion">Retour à la connexion</Link>
            </Typography>
        </Box>
    );
};

export default ForgotPassword;