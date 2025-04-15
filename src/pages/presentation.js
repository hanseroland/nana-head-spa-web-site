import Head from "next/head";
import HeroPresentation from "../components/ui/HeroPresentation";
import PhilosophySection from "../components/ui/PhilosophySection";
import { Container } from "@mui/material";
import AboutSection from "../components/ui/AboutSection";
import TestimonialsSection from "../components/ui/TestimonialsSection";





export default function Presentation() {

    

    return (
        <>
            <Head>
                <title>Présentation | ANA HEAD SPA</title>
                <meta name="description" content="Découvrez nos spa head pour le bien-être et la relaxation." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <HeroPresentation/>

            <Container maxWidth="lg">
                <PhilosophySection/>
                <AboutSection/>
                <TestimonialsSection/>
            </Container>
            
            
           
        </>
    );
} 