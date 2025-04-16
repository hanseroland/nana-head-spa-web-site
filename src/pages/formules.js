import Head from "next/head";
import { Container, Typography } from "@mui/material";
import ReusableHero from "../components/ui/ReusableHero";
import StarFormulasSection from "../components/ui/StarFormulasSection";
import TestimonialsSection from "../components/ui/TestimonialsSection";






export default function Formules() {

    

    return (
        <>
            <Head>
                <title> Formules | NANA HEAD SPA</title>
                <meta name="description" content="Découvrez nos spa head pour le bien-être et la relaxation." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
           
            <ReusableHero
                image="/images/pexels-craytive-1502219.jpg"
                title="Nos Formules : Découvrez nos rituels de soin capillaire"
                subtitle="Chaque formule est conçue pour allier relaxation, soin du cuir chevelu et beauté naturelle des cheveux."
            />
            <Container maxWidth="lg">
                <StarFormulasSection/>
                <TestimonialsSection/>
            </Container>
            
            
           
        </>
    );
}