// client/components/admin/forms/BannerForm.js

import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Typography,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    CardMedia,
    IconButton
} from '@mui/material';
import { Close as CloseIcon, Image as ImageIcon } from '@mui/icons-material';

import { ManagePageBanner } from '@/apiCalls/banners'; // Votre appel API ManagePageBanner
import SubmitButton from '../common/SubmitButton';

// Liste des noms de pages possibles (à adapter selon votre application)
const PAGE_NAMES = [
    { value: 'accueil', label: 'Accueil' },
    { value: 'presentation', label: 'Présentation' },
    { value: 'formules', label: 'Formules' },
    { value: 'reservations', label: 'Réservations' },
    { value: 'contact', label: 'Contact' },
    // Ajoutez d'autres pages si nécessaire
];

// Types de bannières (à adapter selon votre backend)
const BANNER_TYPES = [
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Vidéo' },
    // Ajoutez d'autres types si nécessaire
];

/**
 * @function BannerForm
 * @description Composant de formulaire pour ajouter ou modifier une bannière.
 * @param {object} props - Les props du composant.
 * @param {object} [props.bannerData=null] - Les données de la bannière à modifier. Null pour une nouvelle bannière.
 * @param {function} props.onClose - Fonction de rappel à appeler après soumission réussie ou annulation.
 */
function BannerForm({ bannerData = null, onClose }) {
    const [formPageName, setFormPageName] = useState('');
    const [formType, setFormType] = useState('image');
    const [formTitle, setFormTitle] = useState('');
    const [formSubtitle, setFormSubtitle] = useState('');
    const [formFile, setFormFile] = useState(null); // Le fichier média sélectionné (pour un nouvel upload)
    const [formMediaPreview, setFormMediaPreview] = useState(null); // URL de l'aperçu (locale ou Cloudinary)

    // Nouveaux états pour la gestion du média existant
    const [currentCloudinaryMediaUrl, setCurrentCloudinaryMediaUrl] = useState(null);
    const [shouldClearMedia, setShouldClearMedia] = useState(false);

    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false); // Pour savoir si on est en mode édition

    // Charge les données de la bannière si bannerData est fourni (mode modification)
    useEffect(() => {
        if (bannerData) {
            setIsEditMode(true);
            setFormPageName(bannerData.pageName);
            setFormType(bannerData.type);
            setFormTitle(bannerData.title);
            setFormSubtitle(bannerData.subtitle);

            if (bannerData.media && bannerData.media.url) {
                setFormMediaPreview(bannerData.media.url);
                setCurrentCloudinaryMediaUrl(bannerData.media.url);
                setShouldClearMedia(false);
            } else {
                setFormMediaPreview(null);
                setCurrentCloudinaryMediaUrl(null);
                setShouldClearMedia(false);
            }
        } else {
            // Réinitialise pour un nouvel ajout
            setIsEditMode(false);
            setFormPageName('');
            setFormType('image');
            setFormTitle('');
            setFormSubtitle('');
            setFormFile(null);
            setFormMediaPreview(null);
            setCurrentCloudinaryMediaUrl(null);
            setShouldClearMedia(false);
        }
        setFormError(null); // Toujours réinitialiser l'erreur quand les données changent
    }, [bannerData]);

    // Gère le changement du fichier média
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormFile(file);
            setFormMediaPreview(URL.createObjectURL(file));
            setShouldClearMedia(false);
        } else {
            // Si l'utilisateur annule la sélection de fichier
            setFormFile(null);
            if (currentCloudinaryMediaUrl) {
                setFormMediaPreview(currentCloudinaryMediaUrl);
                setShouldClearMedia(false);
            } else {
                setFormMediaPreview(null);
                setShouldClearMedia(true); // Si aucune URL Cloudinary et aucun nouveau fichier, on marque pour effacement
            }
        }
    };

    // Supprime l'aperçu du média et indique que le média existant doit être supprimé
    const handleRemoveMedia = () => {
        setFormFile(null);
        setFormMediaPreview(null);
        setCurrentCloudinaryMediaUrl(null);
        setShouldClearMedia(true);
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);

        // Validation front-end de base
        if (!formPageName || !formTitle || (!formFile && !currentCloudinaryMediaUrl && !isEditMode)) {
            setFormError("Veuillez remplir tous les champs requis et sélectionner un média.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('pageName', formPageName);
        formData.append('type', formType);
        formData.append('title', formTitle);
        formData.append('subtitle', formSubtitle);

        if (formFile) {
            formData.append('media', formFile);
        } else if (isEditMode && shouldClearMedia) {
            formData.append('clearMedia', 'true');
        }

        // Si c'est une modification, inclure l'ID de la bannière pour le backend
        if (isEditMode && bannerData?._id) {
            formData.append('bannerId', bannerData._id); // Le backend utilisera cet ID pour identifier la bannière à modifier
        }

        try {
            // ManagePageBanner gère la création ou la mise à jour en fonction de la présence de 'bannerId' dans formData
            const response = await ManagePageBanner(formData);

            if (response.success) {
                alert(response.message); // Ou un snackbar
                onClose(); // Appelle la fonction de rappel pour fermer le modal et rafraîchir la liste
            } else {
                setFormError(response.message || `Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de la bannière.`);
            }
        } catch (error) {
            console.error("Erreur API lors de la soumission du formulaire de bannière:", error);
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
                {isEditMode ? 'Modifier la bannière' : 'Ajouter une nouvelle bannière'}
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
                    <FormControl fullWidth margin="dense" required>
                        <InputLabel id="page-name-label">Page associée</InputLabel>
                        <Select
                            labelId="page-name-label"
                            value={formPageName}
                            label="Page associée"
                            onChange={(e) => setFormPageName(e.target.value)}
                        // error={!formPageName && !loading && formSubmitted} // Ajouter un état pour `formSubmitted` pour la validation au clic
                        >
                            {PAGE_NAMES.map((page) => (
                                <MenuItem key={page.value} value={page.value}>
                                    {page.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense" required>
                        <InputLabel id="banner-type-label">Type de Média</InputLabel>
                        <Select
                            labelId="banner-type-label"
                            value={formType}
                            label="Type de Média"
                            onChange={(e) => setFormType(e.target.value)}
                        >
                            {BANNER_TYPES.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Titre de la bannière"
                        fullWidth
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        required
                    />
                    <TextField
                        label="Sous-titre (optionnel)"
                        fullWidth
                        multiline
                        rows={2}
                        value={formSubtitle}
                        onChange={(e) => setFormSubtitle(e.target.value)}
                    />

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Fichier Média ({formType === 'video' ? 'Vidéo' : 'Image'})</Typography>
                        <input
                            type="file"
                            accept={formType === 'video' ? 'video/*' : 'image/*'}
                            onChange={handleFileChange}
                            style={{ display: 'block', marginBottom: '10px' }}
                            required={!isEditMode && !formMediaPreview} // Requis seulement en mode création si pas d'aperçu
                        />
                        {formMediaPreview && (
                            <Box sx={{ position: 'relative', width: '100%', maxWidth: 250, mt: 1 }}>
                                {formType === 'video' ? (
                                    <video controls style={{ width: '100%', height: 'auto', maxHeight: '150px', borderRadius: 4 }}>
                                        <source src={formMediaPreview} type="video/mp4" />
                                        Votre navigateur ne supporte pas la balise vidéo.
                                    </video>
                                ) : (
                                    <CardMedia
                                        component="img"
                                        image={formMediaPreview}
                                        alt="Aperçu du média"
                                        sx={{ width: '100%', height: 'auto', maxHeight: '150px', borderRadius: 1 }}
                                    />
                                )}
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                                    }}
                                    onClick={handleRemoveMedia}
                                    size="small"
                                >
                                    <CloseIcon fontSize="small" color="error" />
                                </IconButton>
                            </Box>
                        )}
                        {!formMediaPreview && (
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                {isEditMode && currentCloudinaryMediaUrl ?
                                    "Le média actuel sera supprimé si vous ne sélectionnez pas de nouveau fichier." :
                                    "Aucun média sélectionné."
                                }
                            </Typography>
                        )}
                    </Box>

                    <SubmitButton
                        loading={loading}
                        title={isEditMode ? 'Modifier la bannière' : 'Ajouter la bannière'}
                    />
                </>
            )}
        </Box>
    );
}

export default BannerForm;