// client/components/admin/forms/ArticleForm.js

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
    CircularProgress,
    Alert,
    FormControlLabel,
    Checkbox,
    CardMedia,
    IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { CreateArticle, GetArticleBySlug, UpdateArticle } from '@/apiCalls/articles'; // Assure-toi que le chemin est correct
import ReactSimpleWysiwyg from 'react-simple-wysiwyg'; // Importe l'éditeur WYSIWYG
import SubmitButton from '../common/SubmitButton';


/**
 * @function ArticleForm
 * @description Composant de formulaire pour ajouter ou modifier un article.
 * @param {object} props - Les props du composant.
 * @param {string} [props.articleSlug=null] - Le slug de l'article à modifier. Null pour un nouvel article.
 * @param {function} props.onClose - Fonction de rappel à appeler après soumission réussie ou annulation.
 */
function ArticleForm({ articleSlug = null, onClose }) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('nouveauté');
    const [content, setContent] = useState(''); // Contenu de l'éditeur WYSIWYG
    const [imageFile, setImageFile] = useState(null); // Le fichier image sélectionné
    const [imagePreview, setImagePreview] = useState(null); // URL d'aperçu pour l'image
    const [isPublished, setIsPublished] = useState(false);

    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false); // Pour savoir si on est en mode édition
    const [initialImage, setInitialImage] = useState(null); // Pour stocker l'image existante en mode édition

    // Charge les données de l'article si un slug est fourni (mode modification)
    const fetchArticleData = useCallback(async () => {
        if (articleSlug) {
            setIsEditMode(true);
            setLoading(true);
            setFormError(null);
            try {
                const response = await GetArticleBySlug(articleSlug);
                if (response.success && response.data) {
                    const article = response.data;
                    setTitle(article.title);
                    setCategory(article.category);
                    setContent(article.content);
                    setIsPublished(article.isPublished);
                    if (article.image) {
                        setImagePreview(article.image); // Affiche l'image existante
                        setInitialImage(article.image); // Stocke l'URL de l'image initiale
                    }
                } else {
                    setFormError(response.message || "Erreur lors du chargement de l'article.");
                }
            } catch (err) {
                console.error("Erreur API lors du chargement de l'article :", err);
                setFormError("Impossible de charger les données de l'article.");
            } finally {
                setLoading(false);
            }
        }
    }, [articleSlug]);

    useEffect(() => {
        fetchArticleData();
    }, [fetchArticleData]);

    // Gère le changement de l'image (pour l'aperçu)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); // Crée un aperçu de l'image
        } else {
            setImageFile(null);
            setImagePreview(initialImage); // Revient à l'image initiale si l'utilisateur annule la sélection
        }
    };

    // Supprime l'aperçu de l'image et le fichier sélectionné
    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        // Si en mode édition, réinitialise à l'image initiale ou à null si aucune initiale
        if (isEditMode) {
            setInitialImage(null); // Si on retire l'image en mode édition, on suppose qu'on veut la supprimer du backend
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('content', content);
        formData.append('isPublished', isPublished);

        // Seulement ajouter l'image si un nouveau fichier a été sélectionné
        if (imageFile) {
            formData.append('image', imageFile);
        } else if (isEditMode && initialImage === null) {
            // Si en mode édition et que l'utilisateur a retiré l'image (initialImage est devenu null)
            // On peut envoyer un indicateur pour que le backend supprime l'image existante
            // Ou simplement ne rien envoyer, et le backend ne modifiera pas l'image si elle n'est pas dans FormData
            // Pour être explicite, on pourrait ajouter un champ comme 'removeImage: true'
            // Ici, nous ne l'envoyons pas si imageFile est null, cela dépend de la logique backend.
            // Notre backend actuel s'attend à 'image' ou rien. Ne rien envoyer signifie pas de mise à jour de l'image.
        }


        let response;
        try {
            if (isEditMode) {
                // Pour la modification, on peut envoyer soit FormData (si imageFile est présent), soit un objet simple
                // Si imageFile n'est pas présent, on envoie un objet simple pour ne pas toucher à l'image existante
                // à moins que initialImage soit null (signifiant que l'utilisateur l'a retirée)
                let dataToSend = formData;
                if (!imageFile && initialImage !== null) { // Si pas de nouveau fichier et l'image initiale existe, pas de modification d'image
                    dataToSend = { title, category, content, isPublished };
                } else if (!imageFile && initialImage === null) { // Si pas de nouveau fichier et pas d'image initiale (retirée par l'utilisateur)
                    dataToSend = { title, category, content, isPublished, image: '' }; // Envoie une chaîne vide pour supprimer l'image
                }

                response = await UpdateArticle(articleSlug, dataToSend);

            } else {
                // Pour la création, l'image est requise par notre backend actuel
                if (!imageFile) {
                    setFormError("Une image est requise pour créer un article.");
                    setLoading(false);
                    return;
                }
                response = await CreateArticle(formData);
            }

            if (response.success) {
                onClose(); // Ferme le modal et rafraîchit la liste
            } else {
                setFormError(response.message || `Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de l'article.`);
            }
        } catch (error) {
            console.error("Erreur API :", error);
            setFormError("Une erreur inattendue est survenue.");
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
                maxWidth: 800, // Limite la largeur du formulaire
                mx: 'auto',
                position: 'relative'
            }}
        >
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                {isEditMode ? 'Modifier l\'article' : 'Ajouter un nouvel article'}
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
                        label="Titre de l'article"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <TextField
                        label="Catégorie"
                        select
                        fullWidth
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <MenuItem value="nouveauté">Nouveauté</MenuItem>
                        <MenuItem value="conseil">Conseil</MenuItem>
                    </TextField>

                    <Typography variant="subtitle1" sx={{ mt: 1 }}>Contenu de l'article</Typography>
                    <ReactSimpleWysiwyg
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        containerProps={{ style: { minHeight: 200 } }}
                    />

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Image de l'article</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'block', marginBottom: '10px' }}
                            // Requis si en mode création et pas d'image initiale
                            required={!isEditMode && !imagePreview}
                        />
                        {imagePreview && (
                            <Box sx={{ position: 'relative', width: '100%', maxWidth: 300, mt: 1 }}>
                                <CardMedia
                                    component="img"
                                    image={imagePreview}
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
                        {!imagePreview && isEditMode && initialImage && (
                            <Typography variant="body2" color="textSecondary">
                                Aucune nouvelle image sélectionnée. L'image actuelle sera conservée.
                            </Typography>
                        )}
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isPublished}
                                onChange={(e) => setIsPublished(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Publier l'article"
                    />

                    <SubmitButton
                        loading={loading}
                        title={isEditMode ? 'Modifier l\'article' : 'Créer l\'article'}
                    />

                </>
            )}
        </Box>
    );
}

export default ArticleForm;