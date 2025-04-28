import Head from "next/head";
import { Box, Container, Pagination } from "@mui/material";
import BlogHeader from "@/components/ui/blog/BlogHeader";
import SearchBar from "@/components/ui/blog/SearchBar";
import CategoryChips from "@/components/ui/blog/CategoryChips";
import BlogGrid from "@/components/ui/blog/BlogGrid";
import { useMemo, useState } from "react";

const POSTS_PER_PAGE = 4;


const cardData = [
    {
        img: 'https://images.unsplash.com/photo-1506003094589-53954a26283f?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Astuces',
        title: '5 astuces bien-être à adopter après une séance de head spa',
        description:
            "Optimisez les bienfaits de votre séance grâce à ces rituels simples à faire chez vous. Respiration, hydratation, huiles... on vous dit tout !",
        authors: [
            { name: 'Camille Lemoine', avatar: '/images/avatar/person_110935.png' },
            { name: 'Sophie Delmas', avatar: '/images/avatar/person_110935.png' },
        ],
    },
    {
        img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Beauté',
        title: 'Les secrets d’un cuir chevelu sain pour des cheveux sublimes',
        description:
            "Un cuir chevelu équilibré, c’est la base d’une chevelure éclatante. Découvrez nos conseils pour prendre soin de votre racine à la pointe.",
        authors: [{ name: 'Léna Morel', avatar: '/images/avatar/person_110935.png' }],
    },
    {
        img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Visage',
        title: 'Le massage facial japonais : une technique miracle contre les tensions',
        description:
            "Inspiré du kobido, ce massage stimule la circulation et l’éclat de votre peau. Une expérience sensorielle unique à découvrir absolument.",
        authors: [{ name: 'Émilie Renard', avatar: '/images/avatar/person_110935.png' }],
    },
    {
        img: 'https://images.unsplash.com/photo-1498843053639-170ff2122f35?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Main',
        title: 'Routine cocooning : prendre soin de ses mains en hiver',
        description:
            "Entre gommages doux, huiles nourrissantes et bains de paraffine, vos mains aussi méritent un moment de douceur et d’attention.",
        authors: [{ name: 'Juliette Blanc', avatar: '/images/avatar/person_110935.png' }],
    },
    {
        img: 'https://images.unsplash.com/photo-1581182800629-7d90925ad072?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Beauté',
        title: 'Nos rituels capillaires éco-responsables préférés',
        description:
            "Envie de prendre soin de vos cheveux tout en respectant la planète ? On vous partage nos soins naturels et gestes green à adopter dès maintenant.",
        authors: [
            { name: 'Claire Dubois', avatar: '/images/avatar/person_110935.png' },
            { name: 'Marine Giraud', avatar: '/images/avatar/person_110935.png' },
        ],
    },
    {
        img: 'https://images.unsplash.com/photo-1522108098940-de49801b5b40?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Astuces',
        title: 'Comment prolonger les bienfaits d’un soin head spa à la maison ?',
        description:
            "Adoptez une routine douce et efficace pour entretenir les effets apaisants du head spa chez vous, jour après jour.",
        authors: [{ name: 'Nina Lefèvre', avatar: '/images/avatar/person_110935.png' }],
    },
    {
        img: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Actualité',
        title: 'Mise en ligne de notre site web : une nouvelle ère de beauté commence ✨',
        description:
            "Nous sommes ravies de vous accueillir dans notre univers doux et sensoriel. Découvrez nos soins, notre communauté et nos conseils bien-être dès aujourd’hui !",
        authors: [{ name: 'Équipe HeadSpa Harmony', avatar: '/images/avatar/person_110935.png' }],
    },
];



export default function Blog() {

    const categories = ["Toutes les catégories", "Astuces", "Beauté", "Visage", "Main"];

    const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setPage(1); // Reset to first page
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setPage(1); // Reset to first page
    };


    // 🎯 FILTRAGE + RECHERCHE
    const filteredPosts = useMemo(() => {
        return cardData.filter((post) => {
            const matchCategory = selectedCategory === "Toutes les catégories" || post.tag === selectedCategory;
            const matchTitle = post.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchCategory && matchTitle;
        });
    }, [selectedCategory, searchTerm]);

    // 🎯 PAGINATION
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = useMemo(() => {
        const startIndex = (page - 1) * POSTS_PER_PAGE;
        return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
    }, [filteredPosts, page]);

    return (
        <>
            <Head>
                <title>Nouveautés | NANA HEAD SPA</title>
                <meta name="description" content="Découvrez mes nouveautés / offres du moment" />
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
                    <BlogGrid posts={paginatedPosts} />

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