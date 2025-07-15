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
    const [imageFile, setImageFile] = useState(null); // Le fichier image sélectionné (pour un nouvel upload)
    const [imagePreview, setImagePreview] = useState(null); // URL de l'image à afficher (locale ou Cloudinary)

    // ✅ Nouveaux états pour la gestion de l'image existante de Cloudinary
    const [currentCloudinaryImageUrl, setCurrentCloudinaryImageUrl] = useState(null); // L'URL de l'image existante de l'article
    const [shouldClearImage, setShouldClearImage] = useState(false); // Flag pour indiquer au backend de supprimer l'image existante

    const [isPublished, setIsPublished] = useState(false);

    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false); // Pour savoir si on est en mode édition

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

                    // ✅ Si l'article a une image Cloudinary existante
                    if (article.image && article.image.url) {
                        setImagePreview(article.image.url); // Affiche l'image existante de Cloudinary
                        setCurrentCloudinaryImageUrl(article.image.url); // Stocke l'URL initiale
                        setShouldClearImage(false); // S'assure que le flag de suppression est à false
                    } else {
                        setImagePreview(null);
                        setCurrentCloudinaryImageUrl(null);
                        setShouldClearImage(false);
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

    // Gère le changement de l'image (pour l'aperçu et le fichier à envoyer)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Définit le fichier à envoyer
            setImagePreview(URL.createObjectURL(file)); // Crée un aperçu temporaire pour l'affichage
            setShouldClearImage(false); // Si une nouvelle image est sélectionnée, on ne veut pas la supprimer
        } else {
            // Si l'utilisateur annule la sélection de fichier, on revient à l'état précédent
            setImageFile(null);
            if (currentCloudinaryImageUrl) {
                // Si une image Cloudinary existait, on revient à son aperçu
                setImagePreview(currentCloudinaryImageUrl);
                setShouldClearImage(false);
            } else {
                // Sinon, il n'y a plus d'image du tout
                setImagePreview(null);
                setShouldClearImage(true); // Si aucune image Cloudinary n'existait et rien n'est sélectionné,
                // cela pourrait être un cas où l'utilisateur voulait la supprimer (si elle était là)
                // mais cela est principalement géré par handleRemoveImage.
            }
        }
    };

    // Supprime l'aperçu de l'image et indique que l'image existante doit être supprimée
    const handleRemoveImage = () => {
        setImageFile(null); // Efface le fichier temporaire sélectionné
        setImagePreview(null); // Efface l'aperçu visuel
        setCurrentCloudinaryImageUrl(null); // Indique qu'il n'y a plus d'image Cloudinary existante à conserver
        setShouldClearImage(true); // ✅ Définit le flag pour indiquer au backend de supprimer l'image
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

        // ✅ Logique de gestion de l'image pour FormData
        if (imageFile) {
            // Un nouveau fichier a été sélectionné, on l'ajoute à FormData
            formData.append('image', imageFile);
        } else if (isEditMode && shouldClearImage) {
            // En mode édition, SI aucun nouveau fichier n'a été sélectionné (imageFile est null)
            // ET QUE le flag shouldClearImage est vrai (l'utilisateur a cliqué sur la croix)
            formData.append('clearImage', 'true'); // Envoyer ce flag au backend
        }
        // else: Si ni imageFile ni shouldClearImage, le backend ne verra pas de changement pour 'image',
        // et l'image existante sera conservée (si elle n'a pas été explicitement supprimée).

        let response;
        try {
            if (isEditMode) {
                // En mode édition, on envoie toujours FormData pour gérer l'image (nouvel upload/suppression/pas de changement)
                response = await UpdateArticle(articleSlug, formData);
            } else {
                // Pour la création, l'image est requise par notre backend
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
                            // L'image est requise seulement en mode création et si aucune image n'est déjà présente
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
                        {/* ✅ Messages d'état pour l'utilisateur */}
                        {!imagePreview && isEditMode && currentCloudinaryImageUrl && (
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                Image actuelle supprimée. L'article n'aura plus d'image si vous ne sélectionnez pas de nouvelle image.
                            </Typography>
                        )}
                        {!imagePreview && !isEditMode && (
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                Aucune image sélectionnée. Une image est requise pour créer un article.
                            </Typography>
                        )}
                        {!imagePreview && isEditMode && !currentCloudinaryImageUrl && (
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                Aucune image sélectionnée. L'article n'aura pas d'image.
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