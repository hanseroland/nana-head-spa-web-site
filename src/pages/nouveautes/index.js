// pages/nouveautes/index.js

import Head from "next/head";
import { Box, Container, Pagination, CircularProgress, Typography } from "@mui/material";
import BlogHeader from "@/components/ui/blog/BlogHeader";
import SearchBar from "@/components/ui/blog/SearchBar";
import CategoryChips from "@/components/ui/blog/CategoryChips";
import BlogGrid from "@/components/ui/blog/BlogGrid";
import { useMemo, useState, useEffect } from "react";
import { GetAllArticles } from "@/apiCalls/articles";

const POSTS_PER_PAGE = 4;

export default function Blog({ initialArticles = [], totalArticlesCount = 0, error }) {
    const categories = ["Toutes les catégories", "nouveauté", "conseil"];

    const [articles, setArticles] = useState(initialArticles);
    const [totalCount, setTotalCount] = useState(totalArticlesCount);
    const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // ✅ Fonction utilitaire pour formater un article reçu de l'API
    const formatArticleForCard = (article) => {
        // Assurez-vous que l'auteur est peuplé et a les propriétés nécessaires
        const authorData = article.author
            ? [{
                name: `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim() || 'Auteur Inconnu',
                avatar: article.author.avatar || '/images/avatar/default_avatar.png',
            }]
            : [{ name: 'Auteur Inconnu', avatar: '/images/avatar/default_avatar.png' }]; // Toujours un tableau, même si vide ou inconnu

        return {
            img: article.image?.url || 'https://via.placeholder.com/600x400?text=Article+Image', // Image par défaut si manquante
            tag: article.category || 'Non classifié',
            title: article.title || 'Titre manquant',
            description: article.content ? (article.content.substring(0, 150) + (article.content.length > 150 ? '...' : '')) : 'Contenu manquant.',
            authors: authorData,
            date: article.publishedAt || new Date().toISOString(), // Date actuelle si manquante
            slug: article.slug,
        };
    };

    const fetchArticles = async (category, term, currentPage) => {
        setLoading(true);
        try {
            const filters = {
                isPublished: true,
                limit: POSTS_PER_PAGE,
                skip: (currentPage - 1) * POSTS_PER_PAGE
            };

            if (category !== "Toutes les catégories") {
                filters.category = category;
            }
            if (term) {
                filters.searchTerm = term;
            }

            const response = await GetAllArticles(filters);
            if (response.success) {
                // ✅ Formater les articles ici avant de les stocker dans l'état
                const formattedArticles = response.data.map(formatArticleForCard);
                setArticles(formattedArticles);
                setTotalCount(response.totalCount);
            } else {
                console.error("Erreur lors de la récupération des articles:", response.message);
                setArticles([]);
                setTotalCount(0);
            }
        } catch (err) {
            console.error("Erreur inattendue lors du fetch des articles:", err);
            setArticles([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchArticles(selectedCategory, searchTerm, page);


    }, [selectedCategory, searchTerm, page]);


    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setPage(1);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setPage(1);
    };

    const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

    if (error) {
        return (
            <Box
                component="section"
                sx={{
                    width: "100%",
                    minHeight: "100vh",
                    backgroundColor: (theme) => theme.palette.background.default,
                    color: (theme) => theme.palette.text.primary,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 6,
                }}
            >
                <Typography variant="h5" color="error">
                    Erreur lors du chargement des articles : {error}
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Head>
                <title>Nouveautés | NANA HEAD SPA</title>
                <meta name="description" content="Découvrez mes nouveautés / conseils du moment" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Box
                component="section"
                sx={{
                    width: "100%",
                    minHeight: "100vh",
                    backgroundColor: (theme) => theme.palette.background.default,
                    color: (theme) => theme.palette.text.primary,
                    py: 6,
                }}
            >
                <Container maxWidth="lg">
                    <BlogHeader />

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column-reverse', md: 'row' },
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: { xs: 'start', md: 'center' },
                            gap: 4,
                            overflow: 'auto',
                        }}
                    >
                        <CategoryChips
                            categories={categories}
                            onClick={handleCategoryClick}
                            selectedCategory={selectedCategory}
                        />

                        <SearchBar onSearch={handleSearch} />

                    </Box>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        articles.length > 0 ? (
                            <BlogGrid posts={articles} />
                        ) : (
                            <Typography variant="h6" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                                Aucun article trouvé pour votre recherche.
                            </Typography>
                        )
                    )}


                    {totalPages > 1 && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(e, value) => setPage(value)}
                                color="primary"
                            />
                        </Box>
                    )}

                </Container>
            </Box>
        </>
    );
}

export async function getServerSideProps() {
    try {
        const response = await GetAllArticles({
            isPublished: true,
            limit: POSTS_PER_PAGE,
            skip: 0
        });

        if (response.success) {
            // ✅ Formater les articles ici aussi pour le rendu initial
            const formattedArticles = response.data.map(article => {
                const authorData = article.author
                    ? [{
                        name: `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim() || 'Auteur Inconnu',
                        avatar: article.author.avatar || '/images/avatar/default_avatar.png',
                    }]
                    : [{ name: 'Auteur Inconnu', avatar: '/images/avatar/default_avatar.png' }];

                return {
                    img: article.image || 'https://via.placeholder.com/600x400?text=Article+Image',
                    tag: article.category || 'Non classifié',
                    title: article.title || 'Titre manquant',
                    description: article.content ? (article.content.substring(0, 150) + (article.content.length > 150 ? '...' : '')) : 'Contenu manquant.',
                    authors: authorData,
                    date: article.publishedAt || new Date().toISOString(),
                    slug: article.slug,
                };
            });

            return {
                props: {
                    initialArticles: formattedArticles, // Passez les articles formatés
                    totalArticlesCount: response.totalCount || response.data.length,
                    error: null
                },
            };
        } else {
            console.error("Erreur getServerSideProps:", response.message);
            return {
                props: {
                    initialArticles: [],
                    totalArticlesCount: 0,
                    error: response.message || "Échec du chargement initial des articles."
                },
            };
        };
    } catch (error) {
        console.error("Erreur serveur lors de getServerSideProps:", error);
        return {
            props: {
                initialArticles: [],
                totalArticlesCount: 0,
                error: "Impossible de se connecter au serveur pour récupérer les articles."
            },
        };
    }
}