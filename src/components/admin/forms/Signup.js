// client/pages/signup.js (ou inscription.js, selon votre structure de routes Next.js)

import React, { useCallback, useEffect, useState } from "react";
import {
    TextField,
    Typography,
    Box,
    IconButton,
    Alert,            // Ajout pour les messages de succès/erreur
    AlertTitle,       // Ajout pour un titre aux alertes
    CircularProgress, // Ajout pour le spinner si nécessaire

} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from 'next/router'; // Remplacement de useNavigate par useRouter pour Next.js
import SubmitButton from "../common/SubmitButton";
import { RegisterUser } from "@/apiCalls/auth";
import { useAuth } from '@/context/AuthContext';



// Expression régulière pour les numéros de téléphone français
// Elle correspond à 0 suivi de 9 chiffres.
const phoneRegExp = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;


const SignupSchema = Yup.object().shape({
    firstName: Yup.string() // Changé 'name' en 'firstName' pour correspondre au User Model
        .trim()
        .min(2, 'Le prénom doit contenir au moins 2 caractères.')
        .max(50, 'Le prénom ne doit pas dépasser 50 caractères.')
        .required("Le prénom est requis"),
    lastName: Yup.string() // Ajout de 'lastName' pour correspondre au User Model
        .trim()
        .min(2, 'Le nom doit contenir au moins 2 caractères.')
        .max(50, 'Le nom ne doit pas dépasser 50 caractères.')
        .required("Le nom est requis"),
    email: Yup.string().email("Email invalide").required("L'email est requis"),
    phone: Yup.string()
        .matches(phoneRegExp, 'Numéro de téléphone invalide (doit être un numéro français de 10 chiffres commençant par 0 ou +33).')
        .required("Le numéro de téléphone est requis"),
    password: Yup.string()
        .min(6, "Le mot de passe doit comporter au moins 6 caractères")
        .required("Le mot de passe est requis"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Les mots de passe ne correspondent pas")
        .required("La confirmation du mot de passe est requise"),
});

const Signup = () => {


    const router = useRouter(); // Utilisation de useRouter pour Next.js
    const { isAuthenticated, loading, currentUser } = useAuth(); // ✅ Récupère l'état d'authentification du contexte
    const [statusMessage, setStatusMessage] = useState(null); // Pour les messages de succès/erreur (objet { type: 'success'|'error', text: '...' })
    const [isSubmittingForm, setIsSubmittingForm] = useState(false); // État pour le chargement du formulaire

    const handleRegister = useCallback(async (values) => {
        setIsSubmittingForm(true); // Active le spinner
        setStatusMessage(null); // Réinitialise les messages précédents

        try {

            const response = await RegisterUser(values);

            if (response.success) {
                setStatusMessage({ type: 'success', text: response.message });
                // l'utilisateur devra se connecter après l'inscription.
                router.push('/connexion'); // Redirige vers la page de connexion après l'inscription réussie
            } else {
                // Le simulateRegisterUser rejette, donc cette partie ne sera pas atteinte directement
                // si la simulation échoue par rejet. Le catch s'en chargera.
                setStatusMessage({ type: 'error', text: response.message || "Échec de l'inscription." });
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            setStatusMessage({ type: 'error', text: error.message || "Une erreur inattendue est survenue lors de l'inscription." });
        } finally {
            setIsSubmittingForm(false); // Désactive le spinner
        }
    }, [router]); // `router` est la dépendance car `router.push` est utilisé

    // ✅ useEffect pour rediriger si l'utilisateur est déjà connecté via le contexte
    useEffect(() => {
        if (!loading && isAuthenticated) {
            const targetPath = currentUser?.role === 'admin' ? '/admin/dashboard' : '/admin/moncompte';
            router.push(targetPath);
        }
    }, [loading, isAuthenticated, currentUser, router]);


    // ✅ Affiche un spinner si le contexte est en cours de chargement initial
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
                Inscription
            </Typography>

            {/* Affichage des messages de statut */}
            {statusMessage && (
                <Alert severity={statusMessage.type} sx={{ mb: 2 }}>
                    <AlertTitle>{statusMessage.type === 'success' ? 'Succès' : 'Erreur'}</AlertTitle>
                    {statusMessage.text}
                </Alert>
            )}

            <Formik
                initialValues={{
                    firstName: "", // Changé de 'name'
                    lastName: "",  // Ajout
                    email: "",
                    password: "",
                    confirmPassword: "",
                }}
                validationSchema={SignupSchema}
                onSubmit={handleRegister}
            >
                {({ errors, touched }) => ( // isSubmitting n'est plus nécessaire ici
                    <Form>
                        <Box mb={2}>
                            <Field
                                name="firstName"
                                as={TextField}
                                fullWidth
                                label="Prénom"
                                error={touched.firstName && Boolean(errors.firstName)}
                                helperText={touched.firstName && errors.firstName}
                            />
                        </Box>
                        <Box mb={2}>
                            <Field
                                name="lastName"
                                as={TextField}
                                fullWidth
                                label="Nom"
                                error={touched.lastName && Boolean(errors.lastName)}
                                helperText={touched.lastName && errors.lastName}
                            />
                        </Box>
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
                                name="phone"
                                as={TextField}
                                fullWidth
                                label="Téléphone (France)"
                                error={touched.phone && Boolean(errors.phone)}
                                helperText={touched.phone && errors.phone}
                                type="tel" // Indique que c'est un champ de téléphone pour les navigateurs
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
                        <Box mb={2}>
                            <Field
                                name="confirmPassword"
                                as={TextField}
                                fullWidth
                                label="Confirmer le mot de passe"
                                type="password"
                                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                helperText={touched.confirmPassword && errors.confirmPassword}
                            />
                        </Box>

                        <SubmitButton
                            loading={isSubmittingForm} // Utilisation de l'état de soumission pour le bouton
                            title="Créer un compte"
                        />


                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Vous avez déjà un compte ?{" "}
                            <a href="/connexion" style={{ color: "blue", textDecoration: "none" }}> {/* Mise à jour du href pour Next.js */}
                                Se connecter
                            </a>
                        </Typography>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default Signup;