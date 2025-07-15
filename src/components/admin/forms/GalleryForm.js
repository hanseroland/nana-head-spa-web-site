// client/components/admin/forms/GalleryForm.js

import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    CardMedia,
    IconButton
} from '@mui/material';
import { Close as CloseIcon, Image as ImageIcon } from '@mui/icons-material';
import SubmitButton from '../common/SubmitButton'; // Assurez-vous que le chemin est correct

import { CreateGalleryImage, UpdateGalleryImage } from '@/apiCalls/gallery'; // Vos appels API

/**
 * @function GalleryForm
 * @description Composant de formulaire pour ajouter ou modifier une image de galerie.
 * @param {object} props - Les props du composant.
 * @param {object} [props.imageData=null] - Les données de l'image à modifier. Null pour une nouvelle image.
 * @param {function} props.onClose - Fonction de rappel à appeler après soumission réussie ou annulation.
 */
function GalleryForm({ imageData = null, onClose }) {
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formOrder, setFormOrder] = useState(0);
    const [formFile, setFormFile] = useState(null); // Le fichier image sélectionné (pour un nouvel upload)
    const [formImagePreview, setFormImagePreview] = useState(null); // URL de l'aperçu (locale ou Cloudinary)

    // Nouveaux états pour la gestion de l'image existante
    const [currentCloudinaryImageUrl, setCurrentCloudinaryImageUrl] = useState(null);
    const [shouldClearImage, setShouldClearImage] = useState(false);

    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false); // Pour savoir si on est en mode édition

    // Charge les données de l'image si imageData est fourni (mode modification)
    useEffect(() => {
        if (imageData) {
            setIsEditMode(true);
            setFormTitle(imageData.title);
            setFormDescription(imageData.description);
            setFormOrder(imageData.order);

            if (imageData.image && imageData.image.url) {
                setFormImagePreview(imageData.image.url);
                setCurrentCloudinaryImageUrl(imageData.image.url);
                setShouldClearImage(false);
            } else {
                setFormImagePreview(null);
                setCurrentCloudinaryImageUrl(null);
                setShouldClearImage(false);
            }
        } else {
            // Réinitialise pour un nouvel ajout
            setIsEditMode(false);
            setFormTitle('');
            setFormDescription('');
            setFormOrder(0);
            setFormFile(null);
            setFormImagePreview(null);
            setCurrentCloudinaryImageUrl(null);
            setShouldClearImage(false);
        }
        setFormError(null); // Toujours réinitialiser l'erreur quand les données changent
    }, [imageData]);

    // Gère le changement du fichier image
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormFile(file);
            setFormImagePreview(URL.createObjectURL(file));
            setShouldClearImage(false);
        } else {
            // Si l'utilisateur annule la sélection de fichier
            setFormFile(null);
            if (currentCloudinaryImageUrl) {
                setFormImagePreview(currentCloudinaryImageUrl);
                setShouldClearImage(false);
            } else {
                setFormImagePreview(null);
                setShouldClearImage(true); // Si aucune URL Cloudinary et aucun nouveau fichier, on marque pour effacement
            }
        }
    };

    // Supprime l'aperçu de l'image et indique que l'image existante doit être supprimée
    const handleRemoveImage = () => {
        setFormFile(null);
        setFormImagePreview(null);
        setCurrentCloudinaryImageUrl(null);
        setShouldClearImage(true);
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);

        // Validation front-end de base
        if (!formTitle || (!formFile && !currentCloudinaryImageUrl && !isEditMode)) {
            setFormError("Veuillez remplir le titre et sélectionner une image.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', formTitle);
        formData.append('description', formDescription);
        formData.append('order', formOrder);

        if (formFile) {
            formData.append('image', formFile);
        } else if (isEditMode && shouldClearImage) {
            formData.append('clearImage', 'true');
        }

        let response;
        try {
            if (isEditMode) {
                // Pour la modification, l'ID est dans l'URL de l'appel API UpdateGalleryImage
                response = await UpdateGalleryImage(imageData._id, formData);
            } else {
                response = await CreateGalleryImage(formData);
            }

            if (response.success) {
                alert(response.message); // Ou un snackbar
                onClose(); // Appelle la fonction de rappel pour fermer le modal et rafraîchir la liste
            } else {
                setFormError(response.message || `Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de l'image.`);
            }
        } catch (error) {
            console.error("Erreur API lors de la soumission du formulaire d'image:", error);
            setFormError(error.response?.data?.message || "Une erreur inattendue est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                position: 'relative'
            }}
        >
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                {isEditMode ? 'Modifier l\'image de la galerie' : 'Ajouter une nouvelle image'}
            </Typography>

            {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {formError}
                </Alert>
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && (
                <>
                    <TextField
                        label="Titre de l'image"
                        fullWidth
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        required
                    />
                    <TextField
                        label="Description (optionnel)"
                        fullWidth
                        multiline
                        rows={3}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                    />
                    <TextField
                        label="Ordre d'affichage"
                        type="number"
                        fullWidth
                        value={formOrder}
                        onChange={(e) => setFormOrder(Number(e.target.value))}
                        inputProps={{ min: 0 }}
                    />

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Fichier Image</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'block', marginBottom: '10px' }}
                            required={!isEditMode && !formImagePreview} // Requis seulement en mode création si pas d'aperçu
                        />
                        {formImagePreview && (
                            <Box sx={{ position: 'relative', width: '100%', maxWidth: 200, mt: 1 }}>
                                <CardMedia
                                    component="img"
                                    image={formImagePreview}
                                    alt="Aperçu de l'image"
                                    sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                                    }}
                                    onClick={handleRemoveImage}
                                    size="small"
                                >
                                    <CloseIcon fontSize="small" color="error" />
                                </IconButton>
                            </Box>
                        )}
                        {!formImagePreview && (
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                {isEditMode && currentCloudinaryImageUrl ?
                                    "L'image actuelle sera supprimée si vous ne sélectionnez pas de nouveau fichier." :
                                    "Aucune image sélectionnée."
                                }
                            </Typography>
                        )}
                    </Box>

                    <SubmitButton
                        loading={loading}
                        title={isEditMode ? 'Modifier l\'image' : 'Ajouter l\'image'}
                    />
                </>
            )}
        </Box>
    );
}

export default GalleryForm;