import Head from "next/head";
import PhilosophySection from "../components/ui/PhilosophySection";
import { Container } from "@mui/material";
import AboutSection from "../components/ui/AboutSection";
import TestimonialsSection from "../components/ui/TestimonialsSection";
import GallerySection from "../components/ui/GallerySection";
import ReusableHero from "../components/ui/ReusableHero";





export default function Presentation() {



    return (
        <>
            <Head>
                <title>Présentation | NANA HEAD SPA</title>
                <meta name="description" content="Découvrez nos spa head pour le bien-être et la relaxation." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
          
            <ReusableHero
                image="https://images.unsplash.com/photo-1642703168632-5a711d91b043?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                title="Présentation de NANA HEAD SPA"
                subtitle="Découvrez notre univers de bien-être et de détente, où chaque détail est pensé pour vous offrir une expérience inoubliable."

            />

            <Container maxWidth="lg">
                <PhilosophySection />
                <AboutSection />
                <TestimonialsSection />
                <GallerySection />
            </Container>



        </>
    );
} 