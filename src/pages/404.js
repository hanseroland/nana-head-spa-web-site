// pages/404.jsx
import Link from 'next/link';
import Head from 'next/head'; // Pour le titre de la page dans le <head>
import { Box, Typography, Button, useTheme } from '@mui/material';

export default function Custom404() {
    const theme = useTheme();

    return (
        <>
            <Head>
                <title>Page non trouvée - Nana Head Spa</title>
            </Head>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh', // Prend la majeure partie de la hauteur de la vue
                    textAlign: 'center',
                    p: { xs: 2, md: 4 },
                    backgroundColor: theme.palette.background.default, // Utilise la couleur de fond de ton thème
                    color: theme.palette.text.primary,
                }}
            >
                <Typography variant="h1" sx={{ fontSize: { xs: '6rem', md: '10rem' }, fontWeight: 700, color: theme.palette.primary.main }}>
                    404
                </Typography>
                <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 2, color: theme.palette.text.secondary }}>
                    Oups ! Page non trouvée.
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', color: theme.palette.text.secondary }}>
                    La page que vous recherchez n'existe pas ou a été déplacée. Ne vous inquiétez pas, vous pouvez retourner à la page d'accueil.
                </Typography>
                <Link href="/" passHref legacyBehavior>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{
                            mt: 3,
                            px: 4,
                            py: 1.5,
                            borderRadius: theme.shape.borderRadius,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                            },
                        }}
                    >
                        Retourner à l'accueil
                    </Button>
                </Link>
            </Box>
        </>
    );
}