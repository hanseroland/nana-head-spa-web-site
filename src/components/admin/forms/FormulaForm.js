// client/components/admin/FormulaForm.js

import React, { useState, useEffect } from "react";
import { TextField, Typography, Box, Alert, Switch, FormControlLabel, CircularProgress } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router';
import { CreateFormula, UpdateFormula, GetFormulaById } from "@/apiCalls/formulas";
import SubmitButton from "../common/SubmitButton";

// Schéma de validation
const FormulaSchema = Yup.object().shape({
    title: Yup.string()
        .required("Le titre de la formule est requis")
        .min(3, "Le titre doit contenir au moins 3 caractères"),
    etiquette: Yup.string().max(50, "L'étiquette est trop longue"),
    price: Yup.number() // <- CHANGEMENT CLÉ : passe à number
        .required("Le prix est requis")
        .min(0, "Le prix ne peut pas être négatif")
        .typeError("Le prix doit être un nombre valide"), // Message d'erreur pour type incorrect

    duration: Yup.number() // <- CHANGEMENT CLÉ : passe à number
        .required("La durée est requise")
        .min(1, "La durée doit être d'au moins 1 minute")
        .typeError("La durée doit être un nombre valide (en minutes)"), // Message d'erreur pour type incorrect
    soins: Yup.string().optional(), // Reste une string ici pour la validation du champ texte
    raison: Yup.string()
        .max(1000, "La raison est trop longue (max 1000 caractères)"),
    isActive: Yup.boolean().required("Le statut actif est requis"),
});

// Composant Formulaire d'ajout/modification de formule
// Ajout de la prop 'onClose' pour notifier le parent de la fermeture du modal/rafraîchissement
const FormulaForm = ({ formulaId, onClose }) => {

    const router = useRouter(); // Non utilisé directement ici pour la redirection, mais peut l'être
    const [formError, setFormError] = useState(null);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState({
        title: "",
        etiquette: "",
        price: "",
        duration: "",
        image: "",
        soins: "", // Initialisé comme une chaîne pour le TextField multi-lignes
        raison: "",
        isActive: true,
    });
    const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);

    // Effet pour charger les données de la formule si un formulaId est fourni (mode modification)
    useEffect(() => {
        const fetchFormulaData = async () => {
            if (formulaId) {
                setIsLoadingInitialData(true);
                setFormError(null);
                try {
                    const response = await GetFormulaById(formulaId);
                    if (response.success && response.data) {
                        // Joindre le tableau de soins par des retours à la ligne pour le TextField
                        const formattedSoins = response.data.soins ? response.data.soins.join('\n') : '';
                        setInitialFormValues({
                            ...response.data,
                            soins: formattedSoins,
                        });
                    } else {
                        setFormError(response.message || "Impossible de charger les données de la formule.");
                        // Si la formule n'est pas trouvée ou erreur, ferme le modal
                        onClose();
                    }
                } catch (error) {
                    console.error("Erreur lors du chargement des données de la formule :", error);
                    setFormError("Erreur de connexion lors du chargement des données.");
                    // En cas d'erreur de connexion, ferme le modal
                    onClose();
                } finally {
                    setIsLoadingInitialData(false);
                }
            } else {
                // Réinitialise les valeurs pour le mode ajout quand formulaId est null
                setInitialFormValues({
                    title: "",
                    etiquette: "",
                    price: "",
                    duration: "",
                    soins: "",
                    raison: "",
                    isActive: true,
                });
            }
        };

        fetchFormulaData();
    }, [formulaId, onClose]); // Déclenche quand formulaId change ou onClose change

    const handleSubmit = async (values, { resetForm }) => {
        console.log("handleSubmit called with values:", values);
        setIsSubmittingForm(true);
        setFormError(null);

        try {
            // Diviser la chaîne de soins par les retours à la ligne pour obtenir un tableau
            const formattedSoins = values.soins
                ? values.soins.split('\n').map(s => s.trim()).filter(s => s.length > 0)
                : [];

            const formulaDataToSend = {
                ...values,
                soins: formattedSoins,
            };

            let response;
            if (formulaId) {
                response = await UpdateFormula(formulaId, formulaDataToSend);
            } else {
                response = await CreateFormula(formulaDataToSend);
            }

            if (response.success) {
                alert(`Formule ${formulaId ? 'mise à jour' : 'ajoutée'} avec succès !`);
                // Appel de onClose pour fermer le modal et rafraîchir la liste parente
                onClose();
            } else {
                setFormError(response.message || `Une erreur inattendue est survenue lors de ${formulaId ? 'la mise à jour' : "l'ajout"} de la formule.`);
            }
        } catch (error) {
            console.error(`Erreur ${formulaId ? 'de mise à jour' : "d'ajout"} de formule :`, error.message);
            setFormError(error.message || "Une erreur inattendue est survenue.");
        } finally {
            setIsSubmittingForm(false);
        }
    };

    if (formulaId && isLoadingInitialData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Chargement des données...</Typography>
            </Box>
        );
    }

    if (formulaId && formError && !isLoadingInitialData) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>
                <Button variant="contained" onClick={onClose}>Fermer</Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 600, // Ajusté pour un bon affichage dans le modal
                mx: "auto",
                my: 0, // Pas de marge verticale dans le modal
                p: 0, // Pas de padding supplémentaire, le modal gère déjà
                // Suppression du border, borderRadius, boxShadow et bgcolor car le DialogModal s'en occupe
            }}
        >
            {/* Le titre est maintenant géré par le DialogModal */}
            {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {formError}
                </Alert>
            )}

            <Formik
                initialValues={initialFormValues}
                validationSchema={FormulaSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ errors, touched, setFieldValue, values }) => (
                    <Form>
                        <Box mb={2}>
                            <Field
                                name="title"
                                as={TextField}
                                fullWidth
                                label="Titre de la formule"
                                error={touched.title && Boolean(errors.title)}
                                helperText={touched.title && errors.title}
                            />
                        </Box>
                        <Box mb={2}>
                            <Field
                                name="etiquette"
                                as={TextField}
                                fullWidth
                                label="Étiquette (ex: Découverte)"
                                error={touched.etiquette && Boolean(errors.etiquette)}
                                helperText={touched.etiquette && errors.etiquette}
                            />
                        </Box>
                        <Box mb={2}>
                            <Field
                                name="price"
                                as={TextField}
                                fullWidth
                                label="Prix (ex: 60€ ou 80.50€)"
                                error={touched.price && Boolean(errors.price)}
                                helperText={touched.price && errors.price}
                            />
                        </Box>
                        <Box mb={2}>
                            <Field
                                name="duration"
                                as={TextField}
                                fullWidth
                                label="Durée (ex: 45 min, 1h30 min)"
                                error={touched.duration && Boolean(errors.duration)}
                                helperText={touched.duration && errors.duration}
                            />
                        </Box>
                        <Box mb={2}>
                            <Field
                                name="soins"
                                as={TextField}
                                fullWidth
                                label="Soins (un soin par ligne)"
                                multiline
                                rows={6}
                                error={touched.soins && Boolean(errors.soins)}
                                helperText="Entrez chaque soin sur une nouvelle ligne."
                            />
                        </Box>
                        <Box mb={2}>
                            <Field
                                name="raison"
                                as={TextField}
                                fullWidth
                                label="Description / Raison"
                                multiline
                                rows={4}
                                error={touched.raison && Boolean(errors.raison)}
                                helperText={touched.raison && errors.raison}
                            />
                        </Box>
                        <Box mb={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={values.isActive}
                                        onChange={(event) => {
                                            setFieldValue("isActive", event.target.checked);
                                        }}
                                        name="isActive"
                                        color="primary"
                                    />
                                }
                                label="Formule active"
                            />
                            {touched.isActive && errors.isActive && (
                                <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                                    {errors.isActive}
                                </Typography>
                            )}
                        </Box>

                        <SubmitButton
                            loading={isSubmittingForm}
                            title={formulaId ? "Mettre à jour la formule" : "Ajouter la formule"}
                        />
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default FormulaForm;