import Head from "next/head";
import { Container } from "@mui/material";
import ReusableHero from "@/components/ui/ReusableHero";
import QuickContactInfo from "@/components/ui/contact/QuickContactInfo";
import ContactForm from "@/components/ui/contact/ContactForm";
import GoogleMapEmbed from "@/components/ui/contact/GoogleMapEmbed";
import CallToActionReservation from "@/components/ui/contact/CallToActionReservation";
import SocialMediaContact from "@/components/ui/contact/SocialMediaContact";






export default function Contact() {

    

    return (
        <>
            <Head>
                <title> Contact | NANA HEAD SPA</title>
                <meta name="description" content="Découvrez nos spa head pour le bien-être et la relaxation." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
          
            <ReusableHero
                image="/images/archenana-head-spa.jpeg"
                title="Un moment de bien-être commence par un premier contact"
                subtitle="Je suis là pour répondre à vos questions et planifier votre rendez-vous."

            />

            <Container maxWidth="lg">
                <QuickContactInfo/>
                <SocialMediaContact/>
                {/*<ContactForm/>*/}
                <GoogleMapEmbed/>
                {/*<CallToActionReservation/>*/}
            </Container>
            
            
           
        </>
    );
}