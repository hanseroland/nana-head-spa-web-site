// client/pages/sign-in.js

import React, { useCallback, useEffect, useState } from "react";
import { TextField, Typography, Box, IconButton, Alert, CircularProgress } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from 'next/router';
import SubmitButton from "../common/SubmitButton";
import { LoginUser } from "@/apiCalls/auth";
// ✅ Import du hook useAuth
import { useAuth } from '@/context/AuthContext';




// Schéma de validation pour la connexion
const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Email invalide").required("L'email est requis"),
    password: Yup.string().required("Le mot de passe est requis"),
});

const SignIn = () => {


    const router = useRouter();
    const { login, isAuthenticated, currentUser, loading } = useAuth(); // ✅ Récupère les fonctions et l'état du contexte
    const [loginError, setLoginError] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false); // Pour le spinner global

    const handleSignin = useCallback(async (values) => {
        setIsAuthenticating(true); // Active le spinner
        setLoginError(null); // Réinitialise les erreurs précédentes

        try {

            // Utilisez la fonction simulée ou la fonction réelle de l'API
            const response = await LoginUser(values);

            if (response.success && response.data) {

                await login(response.data);

                const redirectPath = router.query.redirect || (response.data.role === 'admin' ? '/admin/dashboard' : '/admin/moncompte');
                router.push(redirectPath);

            } else {
                setLoginError(response.message || "Échec de la connexion.");
            }
        } catch (error) {
            console.error("Erreur de connexion :", error.message);
            setLoginError(error.message || "Une erreur inattendue est survenue lors de la connexion.");
        } finally {
            setIsAuthenticating(false); // Désactive le spinner
        }
    }, [login, router]);


    // ✅ useEffect pour rediriger si déjà connecté (le contexte gère l'état d'authentification)
    useEffect(() => {
        if (!loading && isAuthenticated) {
            // Si déjà authentifié, redirige vers le tableau de bord approprié
            const targetPath = currentUser?.role === 'admin' ? '/admin/dashboard' : '/admin/moncompte';
            router.push(targetPath);
        }
    }, [loading, isAuthenticated, currentUser, router]);


    // ✅ Afficher un spinner si le contexte est en cours de chargement initial
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2 }}>Vérification de la session...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: "auto",
                my: 4,
                p: 3,
                border: "1px solid #ccc",
                borderRadius: 2,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                textAlign: "center",
                bgcolor: "background.default",
            }}
        >
            <IconButton href="/" sx={{ mb: 2 }}>
                <ArrowBackIcon />
            </IconButton>

            <Typography variant="h4" component="h1" gutterBottom>
                Connexion
            </Typography>

            {/* Affichage des messages d'erreur */}
            {loginError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {loginError}
                </Alert>
            )}

            <Formik
                initialValues={{
                    email: "",
                    password: "",
                }}
                validationSchema={LoginSchema}
                onSubmit={handleSignin}
            >
                {({ errors, touched }) => ( // isSubmitting est déjà géré par isAuthenticating
                    <Form>
                        <Box mb={2}>
                            <Field
                                name="email"
                                as={TextField}
                                fullWidth
                                label="Email"
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                            />
                        </Box>
                        <Box mb={2}>
                            <Field
                                name="password"
                                as={TextField}
                                fullWidth
                                label="Mot de passe"
                                type="password"
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                            />
                        </Box>
                        <SubmitButton
                            isSubmitting={isAuthenticating} // Utilise l'état d'authentification pour le spinner
                            title="Se connecter"
                        />

                        <Typography variant="body2" sx={{ mb: 1, mt: 2 }}>
                            ou
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Vous n'avez pas de compte ? {" "}
                            <a href="/inscription" style={{ color: "blue", textDecoration: "none" }}>
                                Inscrivez-vous
                            </a>
                        </Typography>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default SignIn;