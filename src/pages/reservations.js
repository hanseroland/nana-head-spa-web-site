import Head from "next/head";
import { Container, Typography } from "@mui/material";
import ReusableHero from "../components/ui/ReusableHero";






export default function Reservation() {

    

    return (
        <>
            <Head>
                <title> Reservation | NANA HEAD SPA </title>
                <meta name="description" content="Découvrez nos spa head pour le bien-être et la relaxation." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <ReusableHero
                image="/images/pexels-arina-krasnikova-6663572.jpg"
                title={"Réservez votre moment de détente"}
                subtitle={"Choisissez votre soin et réservez en ligne pour profiter d'une expérience de bien-être unique."}
            />

            <Container maxWidth="lg">
                <Typography variant="h2" align="center"> Reservation </Typography>
            </Container>
            
            
           
        </>
    );
}