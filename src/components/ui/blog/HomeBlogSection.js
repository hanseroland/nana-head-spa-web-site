import React from "react";
import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import HomeBlogGrid from "./HomeBlogGrid";
import { useRouter } from "next/router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);


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


function HomeBlogSection() {

  const router = useRouter();
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md:2 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container>
        {/* Header avec animation */}
        <MotionBox
          textAlign="center"
          mb={6}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <MotionTypography
            variant="h4"
            component="h2"
            fontWeight="bold"
            fontFamily="Poppins"
            fontSize={{ xs: "2rem", sm: "2.5rem" }}
            sx={{
              mb: 2,
              color: theme.palette.primary.main
            }}
          >
            Nouveautés / Offres du moments ✨
          </MotionTypography>
          <Typography
            variant="body1"
            color="text.secondary"
            fontFamily="Poppins"
            fontSize={{ xs: "1rem", sm: "1.2rem" }}
          >
            Découvrez nos derniers articles pour une vie plus douce et équilibrée.
          </Typography>
        </MotionBox>

        {/* Grid des 3 derniers posts */}
        <HomeBlogGrid posts={cardData} />

        {/* CTA animé */}
        <Box mt={6} textAlign="center">
          <MotionButton
            variant="contained"
            size="large"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => router.push("/nouveautes")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            sx={{
              borderRadius: "2rem",
              textTransform: "none",
              fontWeight: 600,
              fontFamily: "Poppins",
              px: 4,
              py: 1.5,
              boxShadow: theme.shadows[2],
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                color: 'primary.main'
              },
            }}
          >
            Voir les nouveautés
          </MotionButton>
        </Box>
      </Container>
    </Box>
  );
}

export default HomeBlogSection;