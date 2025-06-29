import React, { useEffect, useState } from 'react'
import { Box, TextField, Button, Typography } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Grid from "@mui/material/Grid2";
import { useDispatch } from 'react-redux';
import { Cached } from '@mui/icons-material';
import { useDispatch } from 'react-redux';


function PersonalDetailForm() {


    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch();


    // Vérifier si resumeData.personalInfo est défini avant d'accéder aux valeurs
    const [initialValues, setInitialValues] = useState({
        fullName: "",
        jobTitle: "",
        address: "",
        phone: "",
        email: "",
    });

    // Schéma de validation avec Yup
    const validationSchema = Yup.object({
        fullName: Yup.string().required("Le nom complet est requis"),
        jobTitle: Yup.string().required("Le titre du poste est requis"),
        address: Yup.string().required("L'adresse est requise"),
        phone: Yup.string()
            .matches(/^\+?\d{10,15}$/, "Numéro de téléphone invalide")
            .required("Le téléphone est requis"),
        email: Yup.string()
            .email("Email invalide")
            .required("L'email est requis"),
    });




    useEffect(() => {
        if (resumeData && resumeData.personalInfo) {
            setInitialValues({
                fullName: resumeData.personalInfo.fullName || "",
                jobTitle: resumeData.personalInfo.jobTitle || "",
                address: resumeData.personalInfo.address || "",
                phone: resumeData.personalInfo.phone || "",
                email: resumeData.personalInfo.email || "",
            });

        } else {
            setInitialValues({
                fullName: "",
                jobTitle: "",
                address: "",
                phone: "",
                email: "",
            });
        }
    }, [resumeData]);



    // Mise à jour du contexte dès qu'un champ change (sans attendre validation)
    const handleChange = (e, setFieldValue) => {

        const { name, value } = e.target;
        setFieldValue(name, value);
        setResumeData((prev) => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (values, { setSubmitting }) => {


        setIsLoading(true)

        const response = await UpdatePersonalInfo()

        if (response.success) {
            dispatch(SetCurrentResume(response.data));
        }
        setIsLoading(false)
        setTimeout(() => {
            alert("Détails enregistrés avec succès !");
            setSubmitting(false);
        }, 1000);
    };


    return (
        <Box>

            <Box
                sx={{
                    maxWidth: 800,
                    mx: "auto",
                    p: 4,
                    mt: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 4,

                }}
            >
                {resumeData ? (
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting, setFieldValue }) => (
                            <Form>
                                <Grid container spacing={2}>
                                    {/* Nom complet */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="fullName"
                                            label="Nom Complet"
                                            variant="outlined"
                                            onChange={(e) => handleChange(e, setFieldValue)}
                                            error={touched.fullName && Boolean(errors.fullName)}
                                            helperText={touched.fullName && errors.fullName}
                                        />
                                    </Grid>

                                    {/* Titre du poste */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="jobTitle"
                                            label="Titre du poste"
                                            variant="outlined"
                                            onChange={(e) => handleChange(e, setFieldValue)}
                                            error={touched.jobTitle && Boolean(errors.jobTitle)}
                                            helperText={touched.jobTitle && errors.jobTitle}
                                        />
                                    </Grid>

                                    {/* Adresse */}
                                    <Grid size={{ xs: 12, sm: 12 }}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="address"
                                            label="Adresse"
                                            variant="outlined"
                                            onChange={(e) => handleChange(e, setFieldValue)}
                                            error={touched.address && Boolean(errors.address)}
                                            helperText={touched.address && errors.address}
                                        />
                                    </Grid>

                                    {/* Téléphone */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="phone"
                                            label="Téléphone"
                                            variant="outlined"
                                            onChange={(e) => handleChange(e, setFieldValue)}
                                            error={touched.phone && Boolean(errors.phone)}
                                            helperText={touched.phone && errors.phone}
                                        />
                                    </Grid>

                                    {/* Email */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="email"
                                            label="Email"
                                            type="email"
                                            variant="outlined"
                                            onChange={(e) => handleChange(e, setFieldValue)}
                                            error={touched.email && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Bouton de soumission */}
                                <Box mt={3} textAlign="right">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isLoading}

                                    >
                                        {isLoading ? <Cached /> : "Enregistrer"}
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                ) : (
                    <Typography variant="body1" color="textSecondary" textAlign="center">
                        Chargement des données...
                    </Typography>
                )}
            </Box>
        </Box>
    )
}

export default PersonalDetailForm