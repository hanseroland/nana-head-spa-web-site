import Head from "next/head";
import { Container } from "@mui/material";
import ReusableHero from "@/components/ui/ReusableHero";
import TestimonialsSection from "@/components/ui/TestimonialsSection";
import HeadSpaFormulas from "@/components/ui/HeadSpaFormulas";






export default function Formules() {



    return (
        <>
            <Head>
                <title> Mes Formules | NANA HEAD SPA</title>
                <meta name="description" content="Découvrez mon spa head pour le bien-être et la relaxation." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <ReusableHero
                image=""
                title="Mes Formules : Découvrez mes rituels de soin capillaire"
                subtitle="Chaque formule est conçue pour allier relaxation, soin du cuir chevelu et beauté naturelle des cheveux."
                pageName="formules"
            />
            <Container maxWidth="lg">
                <HeadSpaFormulas />
                <TestimonialsSection />
            </Container>



        </>
    );
}