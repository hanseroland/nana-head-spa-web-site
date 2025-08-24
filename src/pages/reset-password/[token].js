import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, TextField, Alert } from '@mui/material';
import SubmitButton from '@/components/admin/common/SubmitButton';
import { useRouter } from 'next/router';
import { ResetPassword } from '@/apiCalls/auth';


const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, 'Le mot de passe doit contenir au moins 6 caractères.')
        .required('Le mot de passe est requis'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas.')
        .required('La confirmation du mot de passe est requise'),
});

const ResetPasswordPage = () => {
    const router = useRouter();
    const { token } = router.query;
    const [status, setStatus] = useState(null); // 'success', 'error', 'loading'
    const [message, setMessage] = useState('');

    const handleSubmit = async (values, { setSubmitting }) => {
        if (!token) {
            setStatus('error');
            setMessage('Jeton de réinitialisation manquant.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const response = await ResetPassword(token, values);
            if (response.success) {
                setStatus('success');
                setMessage(response.message);
            } else {
                setStatus('error');
                setMessage(response.message || 'Échec de la réinitialisation du mot de passe.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Une erreur est survenue lors de la réinitialisation.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', my: 8, p: 3, border: '1px solid #ccc', borderRadius: 2, boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <Typography variant="h5" component="h1" gutterBottom>
                Réinitialiser le mot de passe
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
                Entrez votre nouveau mot de passe.
            </Typography>

            {status === 'success' && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {message}
                    <Link href="/connexion" sx={{ display: 'block', mt: 1 }}>Retour à la connexion</Link>
                </Alert>
            )}
            {status === 'error' && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

            {status !== 'success' && (
                <Formik
                    initialValues={{ password: '', confirmPassword: '' }}
                    validationSchema={ResetPasswordSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form>
                            <Field
                                name="password"
                                as={TextField}
                                label="Nouveau mot de passe"
                                type="password"
                                fullWidth
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                sx={{ mb: 2 }}
                            />
                            <Field
                                name="confirmPassword"
                                as={TextField}
                                label="Confirmer le mot de passe"
                                type="password"
                                fullWidth
                                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                helperText={touched.confirmPassword && errors.confirmPassword}
                                sx={{ mb: 2 }}
                            />
                            <SubmitButton isSubmitting={isSubmitting} title="Réinitialiser" />
                        </Form>
                    )}
                </Formik>
            )}
        </Box>
    );
};

export default ResetPasswordPage;