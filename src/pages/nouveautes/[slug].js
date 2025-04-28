import Head from "next/head";
import { Container, Typography } from "@mui/material";






export default function Article() {

    

    return (
        <>
            <Head>
                <title> Article | NANA HEAD SPA</title>
                <meta name="description" content="Découvrez nos spa head pour le bien-être et la relaxation." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
           

            <Container maxWidth="lg">
                <Typography variant="h2" align="center"> Article </Typography>
            </Container>
            
            
           
        </>
    );
}