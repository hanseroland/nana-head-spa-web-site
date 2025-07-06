import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Facebook, Instagram } from '@mui/icons-material';

function Copyright() {
    return (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            {'Copyright © '}
            <Link color="text.secondary" href="#">
                NANA HEAD SPA by HRP
            </Link>
            &nbsp;
            {new Date().getFullYear()}
        </Typography>
    );
}

export default function Footer() {
    return (
        <React.Fragment>
            <Divider />
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: { xs: 4, sm: 8 },
                    py: { xs: 8, sm: 10 },
                    textAlign: { sm: 'center', md: 'left' },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        width: '100%',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            minWidth: { xs: '100%', sm: '60%' },
                        }}
                    >
                        <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: 'Poppins',
                                    fontWeight: 'bold',
                                    color: 'primary.main',
                                    display: { xs: 'none', md: 'flex' },
                                    mr: 4
                                }}
                            >
                                NANA HEAD SPA
                            </Typography>
                            {/* LOGO */}
                            <Link href="/" passHref>
                                <Box
                                    component="img"
                                    src="/images/logo-nana-head.png" // <-- ton chemin de logo ici (mets /logo.svg, /logo.png, ou ce que tu veux)
                                    alt="Nana Head Spa Logo"
                                    sx={{
                                        height: 80, // adapte la taille du logo si besoin
                                        width: 'auto',
                                        borderRadius: '50%',
                                        display: { xs: 'none', md: 'block' },
                                        mr: 4,
                                        cursor: 'pointer',
                                    }}
                                />
                            </Link>
                            {/*<Typography
                                variant="body2"
                                gutterBottom
                                sx={{ fontWeight: 600, mt: 2 }}
                            >
                                Rejoigner notre newsletter
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            Abonnez-vous pour des mises à jour hebdomadaires. Aucun spam, jamais !                            </Typography>
                            <InputLabel htmlFor="email-newsletter">Email</InputLabel>
                            <Stack direction="row" spacing={1} useFlexGap>
                                <TextField
                                    id="email-newsletter"
                                    hiddenLabel
                                    size="small"
                                    variant="outlined"
                                    fullWidth
                                    aria-label="Entrer votre adresse email"
                                    placeholder="Votre adresse email"
                                    slotProps={{
                                        htmlInput: {
                                            autoComplete: 'off',
                                            'aria-label': 'Entrer votre adresse email',
                                        },
                                    }}
                                    sx={{ width: '250px' }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    sx={{ flexShrink: 0 }}
                                >
                                    S&apos;abonner
                                </Button>
                            </Stack>*/}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'none', sm: 'flex' },
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: '600' }}>
                            Produits
                        </Typography>
                        <Link color="text.secondary" variant="body2" href="/formules">
                            Formules
                        </Link>
                        <Link color="text.secondary" variant="body2" href="/reservations">
                            Reservations
                        </Link>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'none', sm: 'flex' },
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: '600' }}>
                            Entreprise
                        </Typography>
                        <Link color="text.secondary" variant="body2" href="/presentation">
                            Présentation
                        </Link>
                        <Link color="text.secondary" variant="body2" href="/nouveautes">
                            Nouveautés / Ofrres
                        </Link>

                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'none', sm: 'flex' },
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        {/* <Typography variant="body2" sx={{ fontWeight: '600' }}>
                            Legalité
                        </Typography>
                        <Link color="text.secondary" variant="body2" href="#">
                            Termes et conditions
                        </Link>
                        <Link color="text.secondary" variant="body2" href="#">
                            Confidentialité
                        </Link>*/}
                        <Link color="text.secondary" variant="body2" href="/contact">
                            Contact
                        </Link>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        pt: { xs: 4, sm: 8 },
                        width: '100%',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <div>
                        <Link color="text.secondary" variant="body2" href="#">
                            Politique de confidentialité
                        </Link>
                        <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
                            &nbsp;•&nbsp;
                        </Typography>
                        <Link color="text.secondary" variant="body2" href="#">
                            Conditions d&apos;utilisation
                        </Link>
                        <Copyright />
                    </div>
                    <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        sx={{ justifyContent: 'left', color: 'text.secondary' }}
                    >
                        <IconButton
                            color="inherit"
                            size="small"
                            href="https://www.instagram.com/nana_head_spa?igsh=MWhnbWVuY3F0YTVodA%3D%3D&utm_source=qr"
                            aria-label="Instagram"
                            sx={{ alignSelf: 'center' }}
                        >
                            <Instagram />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            size="small"
                            href="https://www.facebook.com/share/1Bz63Ahy2u/?mibextid=wwXIfr"
                            aria-label="X"
                            sx={{ alignSelf: 'center' }}
                        >
                            <Facebook />
                        </IconButton>
                    </Stack>
                </Box>
            </Container>
        </React.Fragment>
    );
}