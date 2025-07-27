// pages/privacy-policy.jsx
import React from 'react';
import Head from 'next/head'; // Pour gérer le <head> de la page
import { Box, useTheme } from '@mui/material';
import PrivacyPolicyPage from '@/components/ui/PrivacyPolicyPage';

const PrivacyPolicy = () => {
    const theme = useTheme();

    return (
        <>
            <Head>
                <title>Politique de Confidentialité - Nana Head Spa</title>
                <meta name="description" content="Découvrez la politique de confidentialité de Nana Head Spa concernant la collecte et l'utilisation de vos données personnelles." />
            </Head>
            <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 5 }}>
                <PrivacyPolicyPage />
            </Box>
        </>
    );
};

export default PrivacyPolicy;