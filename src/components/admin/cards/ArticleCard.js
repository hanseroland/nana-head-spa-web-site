// client/components/admin/cards/ArticleCard.js

import React from 'react';
import { motion } from 'framer-motion';
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    Chip,
    useTheme
} from '@mui/material';

/**
 * @function ArticleCard
 * @description Composant d'affichage d'un article sous forme de carte pour l'administration.
 * @param {object} props - Les props du composant.
 * @param {object} props.article - L'objet article à afficher.
 * @param {function} props.onEditClick - Fonction de rappel à appeler pour modifier l'article.
 * @param {function} props.onDeleteClick - Fonction de rappel à appeler pour supprimer l'article.
 */
function ArticleCard({ article, onEditClick, onDeleteClick }) {
    const theme = useTheme();

    if (!article) {
        return null;
    }

    // Fonction utilitaire pour extraire un extrait de texte
    const getExcerpt = (htmlContent, maxLength = 100) => {
        // Supprime les balises HTML de manière basique
        const textContent = htmlContent.replace(/<[^>]*>/g, '');
        if (textContent.length > maxLength) {
            return textContent.substring(0, maxLength) + '...';
        }
        return textContent;
    };

    return (
        <Card
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            elevation={1}
            sx={{
                borderRadius: '0.75rem', // Un peu moins arrondi que les formules si tu veux
                overflow: 'hidden',
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[1],
                display: 'flex',
                flexDirection: 'column',
                height: '100%', // S'assure que toutes les cartes ont la même hauteur dans une grille
            }}
        >
            {/* Image de l'article */}
            {article.image && (
                <CardMedia
                    component="img"
                    height="180" // Hauteur fixe pour l'image
                    image={article.image}
                    alt={article.title}
                    sx={{ objectFit: 'cover' }}
                />
            )}

            <CardContent sx={{ flexGrow: 1 }}> {/* flexGrow pour que le contenu prenne l'espace disponible */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    {/* Titre de l'article */}
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: theme.palette.text.primary, flexGrow: 1 }}>
                        {article.title}
                    </Typography>
                    {/* Catégorie */}
                    {article.category && (
                        <Chip
                            label={article.category}
                            size="small"
                            color={article.category === 'nouveauté' ? 'primary' : 'secondary'}
                            sx={{ ml: 1 }}
                        />
                    )}
                </Box>

                {/* État de publication */}
                <Chip
                    label={article.isPublished ? 'Publié' : 'Brouillon'}
                    size="small"
                    color={article.isPublished ? 'success' : 'warning'}
                    sx={{ mb: 1 }}
                />

                {/* Extrait du contenu */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {getExcerpt(article.content)}
                </Typography>

                {/* Date de publication */}
                <Typography variant="caption" color="text.disabled">
                    Publié le: {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                </Typography>

            </CardContent>

            <CardActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => onEditClick(article.slug)}
                    sx={{ textTransform: 'none', fontSize: 14 }}
                >
                    Modifier
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onDeleteClick(article.slug)}
                    sx={{ textTransform: 'none', fontSize: 14 }}
                >
                    Supprimer
                </Button>
            </CardActions>
        </Card>
    );
}

export default ArticleCard;