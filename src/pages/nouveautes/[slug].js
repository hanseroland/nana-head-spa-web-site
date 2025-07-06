// pages/nouveautes/[slug].js

import Head from 'next/head';
import Link from 'next/link'; // N'oubliez pas d'importer Link pour les liens vers d'autres articles
import { Box, Container, Typography, CircularProgress, Grid } from '@mui/material'; // Importez Grid pour la mise en page des cartes
import { GetArticleBySlug, GetAllArticles } from '@/apiCalls/articles';
import { useRouter } from 'next/router';
import BlogCard from '@/components/ui/blog/BlogCard'; // Importez BlogCard pour réutiliser l'affichage des articles

const ArticlePage = ({ article, error, otherArticles = [] }) => { // Accepte now otherArticles
    const router = useRouter();

    const getExcerpt = (htmlContent, maxLength = 160) => {
        if (!htmlContent) return '';
        const textContent = htmlContent.replace(/<[^>]*>/g, '');
        if (textContent.length > maxLength) {
            return textContent.substring(0, maxLength) + '...';
        }
        return textContent;
    };

    if (router.isFallback) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundColor: (theme) => theme.palette.background.default,
                }}
            >
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Chargement de l'article...
                </Typography>
            </Box>
        );
    }

    if (error || !article) {
        return (
            <Box
                component="section"
                sx={{
                    width: '100%',
                    minHeight: '100vh',
                    backgroundColor: (theme) => theme.palette.background.default,
                    color: (theme) => theme.palette.text.primary,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 6,
                }}
            >
                <Typography variant="h5" color="error" gutterBottom>
                    {error || "Article introuvable ou inaccessible."}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Veuillez vérifier l'URL ou revenir à la page d'accueil.
                </Typography>
            </Box>
        );
    }

    const formatArticleForDisplay = (articleData) => {
        const authorData = articleData.author
            ? [{
                name: `${articleData.author.firstName || ''} ${articleData.author.lastName || ''}`.trim() || 'Auteur Inconnu',
                avatar: articleData.author.avatar || '/images/avatar/default_avatar.png',
            }]
            : [{ name: 'Auteur Inconnu', avatar: '/images/avatar/default_avatar.png' }];

        return {
            img: articleData.image || 'https://via.placeholder.com/1200x600?text=Article+Image',
            tag: articleData.category || 'Non classifié',
            title: articleData.title || 'Titre manquant',
            description: articleData.content || 'Contenu manquant.', // 'description' est le contenu HTML complet ici
            authors: authorData,
            date: articleData.publishedAt || new Date().toISOString(),
            slug: articleData.slug,
        };
    };

    const formattedArticle = formatArticleForDisplay(article);
    const metaDescription = getExcerpt(formattedArticle.description, 160);

    return (
        <>
            <Head>
                <title>{formattedArticle.title} | NANA HEAD SPA</title>
                <meta name="description" content={metaDescription} />
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
                    mt: 10,
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ mb: 4 }}>
                        <img
                            src={formattedArticle.img}
                            alt={formattedArticle.title}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: 400,
                                objectFit: 'cover',
                                borderRadius: '8px',
                                marginBottom: '24px',
                            }}
                        />
                        <Typography variant="caption" fontWeight={600} color="primary" sx={{ mb: 1 }}>
                            {formattedArticle.tag.toUpperCase()}
                        </Typography>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', fontWeight: 700 }}>
                            {formattedArticle.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Par {formattedArticle.authors.map(a => a.name).join(', ')} le {new Date(formattedArticle.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>

                        <Box
                            sx={{
                                color: 'text.primary',
                                lineHeight: 1.8,
                                '& h1, & h2, & h3, & h4, & h5, & h6': {
                                    marginTop: '1.5em',
                                    marginBottom: '0.5em',
                                    fontWeight: 600,
                                    color: 'text.primary',
                                },
                                '& p': {
                                    marginBottom: '1em',
                                },
                                '& ul, & ol': {
                                    marginLeft: '2em',
                                    marginBottom: '1em',
                                },
                                '& li': {
                                    marginBottom: '0.5em',
                                },
                                '& strong, & b': {
                                    fontWeight: 700,
                                },
                                '& em, & i': {
                                    fontStyle: 'italic',
                                },
                                '& a': {
                                    color: (theme) => theme.palette.primary.main,
                                    textDecoration: 'underline',
                                },
                                '& img': {
                                    maxWidth: '100%',
                                    height: 'auto',
                                    display: 'block',
                                    margin: '1em auto',
                                    borderRadius: '8px',
                                },
                                '& blockquote': {
                                    borderLeft: `4px solid ${(theme) => theme.palette.divider}`,
                                    paddingLeft: '1em',
                                    marginLeft: '0',
                                    fontStyle: 'italic',
                                    color: (theme) => theme.palette.text.secondary,
                                },
                            }}
                            dangerouslySetInnerHTML={{ __html: formattedArticle.description }}
                        />
                    </Box>

                    {/* --- Section "Lire d'autres articles" --- */}
                    {otherArticles.length > 0 && (
                        <Box sx={{ mt: 8 }}>
                            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center', fontWeight: 700 }}>
                                Lire d'autres articles
                            </Typography>
                            <Grid container spacing={4}>
                                {otherArticles.map((otherArticle) => (
                                    <Grid size={{ xs: 12, md: 4, sm: 6 }} key={otherArticle.slug}>
                                        <BlogCard
                                            img={otherArticle.image || 'https://via.placeholder.com/600x400?text=Article+Image'}
                                            tag={otherArticle.category || 'Non classifié'}
                                            title={otherArticle.title || 'Titre manquant'}
                                            description={otherArticle.content || 'Contenu manquant.'} // BlogCard gérera l'extrait
                                            authors={otherArticle.author ? [{
                                                name: `${otherArticle.author.firstName || ''} ${otherArticle.author.lastName || ''}`.trim() || 'Auteur Inconnu',
                                                avatar: otherArticle.author.avatar || '/images/avatar/default_avatar.png',
                                            }] : [{ name: 'Auteur Inconnu', avatar: '/images/avatar/default_avatar.png' }]}
                                            date={otherArticle.publishedAt || new Date().toISOString()}
                                            slug={otherArticle.slug}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default ArticlePage;

// --- Fonctions de génération de chemins (getStaticPaths) et de props (getStaticProps) ---

export async function getStaticPaths() {
    let paths = [];
    try {
        const response = await GetAllArticles({
            isPublished: true,
            // Pour getStaticPaths, ne pas limiter, on veut tous les slugs
            // Une API plus optimisée renverrait juste les slugs
        });

        if (response.success && response.data) {
            paths = response.data.map((article) => ({
                params: { slug: article.slug },
            }));
        } else {
            console.warn("Aucun article trouvé pour la génération statique des chemins. Response:", response);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des chemins des articles pour getStaticPaths :", error);
        paths = [];
    }

    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    const { slug } = params;
    let article = null;
    let error = null;
    let otherArticles = []; // Initialisez un tableau vide pour les autres articles

    try {
        // 1. Récupérer l'article principal
        const articleResponse = await GetArticleBySlug(slug);

        if (articleResponse.success && articleResponse.data) {
            article = articleResponse.data;
        } else {
            error = articleResponse.message || `Article avec le slug "${slug}" introuvable ou inaccessible.`;
            console.error(error);
        }

        // Si l'article principal n'est pas trouvé ou n'est pas publié, renvoyer notFound
        if (!article || !article.isPublished) {
            return {
                notFound: true,
                revalidate: 60,
            };
        }

        // 2. Récupérer d'autres articles (limitez-en un certain nombre, par exemple 3)
        // Vous pouvez filtrer par catégorie, par date, ou simplement prendre les plus récents
        const otherArticlesResponse = await GetAllArticles({
            isPublished: true,
            limit: 3, // Récupère 3 autres articles
            // Si vous voulez des articles de la même catégorie, ajoutez: category: article.category
        });

        if (otherArticlesResponse.success && otherArticlesResponse.data) {
            // Filtrer l'article actuel de la liste des autres articles
            otherArticles = otherArticlesResponse.data.filter(
                (otherArt) => otherArt.slug !== slug
            );

            // S'assurer d'avoir exactement le nombre voulu après filtrage, au cas où l'article principal était dans les 3 premiers
            if (otherArticles.length < 3 && otherArticlesResponse.totalCount > 3) {
                // Si on n'a pas assez d'articles après le filtre, essayez de récupérer plus
                // Ceci est un scénario plus avancé. Pour l'instant, on se contente de ce qu'on a.
                // Pour un site de production, vous pourriez faire une autre requête GetAllArticles(limit: 4)
                // et filtrer pour être sûr d'avoir 3 articles différents.
            }

            // Formater les autres articles pour qu'ils correspondent aux props de BlogCard
            otherArticles = otherArticles.map(otherArt => ({
                image: otherArt.image,
                category: otherArt.category,
                title: otherArt.title,
                content: otherArt.content, // Garder le contenu HTML pour BlogCard.getExcerpt
                author: otherArt.author, // L'auteur doit être peuplé par l'API
                publishedAt: otherArt.publishedAt,
                slug: otherArt.slug,
            }));

        } else {
            console.warn("Impossible de récupérer d'autres articles:", otherArticlesResponse.message);
        }

    } catch (err) {
        error = `Erreur serveur lors de la récupération de l'article "${slug}" ou des autres articles : ${err.message}`;
        console.error(error);
    }

    return {
        props: {
            article,
            error,
            otherArticles, // Passez les autres articles au composant
        },
        revalidate: 60,
    };
}