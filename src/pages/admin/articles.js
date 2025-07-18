// client/pages/admin/articles/index.js (ou Articles.js)

import React, { useCallback, useEffect, useState } from 'react';
import HeaderFeature from '@/components/admin/common/HeaderFeature';
import DialogModal from '@/components/common/DialogModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import ArticleForm from '@/components/admin/forms/ArticleForm';
import ArticleCard from '@/components/admin/cards/ArticleCard';
import { GetAllArticles, DeleteArticle } from '@/apiCalls/articles';

import {
    Alert,
    Box,
    CircularProgress,
    Grid,
    Typography,
} from '@mui/material';

function Articles() {
    // --- États pour le modal d'ajout/édition ---
    const [openArticleModal, setOpenArticleModal] = useState(false);
    const [selectedArticleSlug, setSelectedArticleSlug] = useState(null);
    const [articleModalTitle, setArticleModalTitle] = useState('');

    // --- États pour la gestion des articles ---
    const [articles, setArticles] = useState([]);
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [articlesError, setArticlesError] = useState(null);

    // --- États pour le modal de confirmation de suppression ---
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [articleToDeleteSlug, setArticleToDeleteSlug] = useState(null);
    const [deletingArticle, setDeletingArticle] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // Fonction pour charger les articles depuis l'API
    const fetchArticles = useCallback(async () => {
        setLoadingArticles(true);
        setArticlesError(null);
        try {
            // Un admin peut vouloir voir tous les articles (publiés et non publiés)
            const response = await GetAllArticles({ showAll: true });
            if (response.success) {
                setArticles(response.data);
            } else {
                setArticlesError(response.message || "Erreur lors du chargement des articles.");
            }
        } catch (err) {
            console.error("Erreur API lors du chargement des articles :", err);
            setArticlesError("Impossible de se connecter au serveur pour récupérer les articles.");
        } finally {
            setLoadingArticles(false);
        }
    }, []);

    // Charge les articles au montage du composant
    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    // --- Gestion du modal d'ajout/édition ---

    // Ouvre le modal en mode "Ajout"
    const handleAddArticleClick = () => {
        setSelectedArticleSlug(null); // Pas de slug pour l'ajout
        setArticleModalTitle('Ajouter un nouvel article');
        setOpenArticleModal(true);
    };

    // Ouvre le modal en mode "Modification"
    const handleEditArticleClick = (slug) => {
        setSelectedArticleSlug(slug); // Passe le slug de l'article à modifier
        setArticleModalTitle('Modifier l\'article');
        setOpenArticleModal(true);
    };

    // Ferme le modal d'ajout/édition et rafraîchit les articles
    const handleCloseArticleModal = () => {
        setOpenArticleModal(false);
        setSelectedArticleSlug(null); // Réinitialise le slug sélectionné
        fetchArticles(); // Rafraîchit la liste après ajout/modification
    };

    // --- Gestion de la suppression d'article ---

    const handleDeleteArticleClick = (slug) => {
        setArticleToDeleteSlug(slug);
        setOpenConfirmModal(true);
        setDeleteError(null);
    };

    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
        setArticleToDeleteSlug(null);
    };

    const handleConfirmDelete = useCallback(async () => {
        if (!articleToDeleteSlug) return; // S'assurer qu'un slug est présent

        setDeletingArticle(true); // Active l'état de chargement
        setDeleteError(null); // Réinitialise les erreurs

        try {
            const response = await DeleteArticle(articleToDeleteSlug);
            if (response.success) {
                // Si la suppression réussit, ferme le modal et rafraîchit la liste
                handleCloseConfirmModal();
                fetchArticles();
            } else {
                // Affiche un message d'erreur si l'API échoue
                setDeleteError(response.message || "Erreur lors de la suppression de l'article.");
            }
        } catch (err) {
            console.error("Erreur API lors de la suppression de l'article :", err);
            setDeleteError("Impossible de se connecter au serveur pour supprimer l'article.");
        } finally {
            setDeletingArticle(false); // Désactive l'état de chargement
        }
    }, [articleToDeleteSlug, fetchArticles]);

    return (
        <Box
            sx={{ padding: 3 }}

        >
            <HeaderFeature
                headerTitle="Articles"
                buttonTitle="Nouvel article"
                onAdd={handleAddArticleClick} // L'action pour le bouton "Nouvel article"
            />

            {/* Affichage du chargement des articles */}
            {loadingArticles && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30vh' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Chargement des articles...</Typography>
                </Box>
            )}

            {/* Affichage des erreurs de chargement des articles */}
            {articlesError && (
                <Alert severity="error" sx={{ my: 3 }}>
                    {articlesError}
                </Alert>
            )}

            {/* Message si aucun article n'est disponible */}
            {!loadingArticles && !articlesError && articles.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6">Aucun article disponible pour le moment.</Typography>
                </Box>
            )}

            {/* Affichage de la grille des articles */}
            {!loadingArticles && !articlesError && articles.length > 0 && (
                <Grid container spacing={4}>
                    {articles.map((article) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article._id}>
                            <ArticleCard
                                article={article}
                                onEditClick={handleEditArticleClick}
                                onDeleteClick={handleDeleteArticleClick}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Modal pour l'ajout/édition d'article */}
            <DialogModal
                form={<ArticleForm articleSlug={selectedArticleSlug} onClose={handleCloseArticleModal} />}
                title={articleModalTitle}
                openModal={openArticleModal}
                setOpenModal={setOpenArticleModal}
            />

            {/* Modal de confirmation de suppression */}
            <ConfirmationModal
                open={openConfirmModal}
                onClose={handleCloseConfirmModal}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression de l'article"
                message={`Voulez-vous vraiment supprimer cet article ? Cette action est irréversible.`}
                confirmText={deletingArticle ? <CircularProgress size={24} color="inherit" /> : 'Supprimer'}
                cancelText="Annuler"
            />

            {/* Affichage des erreurs de suppression */}
            {deleteError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {deleteError}
                </Alert>
            )}
        </Box>
    );
}

export default Articles;