import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import { Instagram } from '@mui/icons-material';

function Copyright() {
    return (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            {'Copyright © '}
            <Link color="text.secondary" href="#">
                SPA-HEAD
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
                                SPA-HEAD
                            </Typography>
                            <Typography
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
                            </Stack>
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
                        <Link color="text.secondary" variant="body2" href="#">
                            Formules
                        </Link>
                        <Link color="text.secondary" variant="body2" href="#">
                            Témoignages
                        </Link>
                        <Link color="text.secondary" variant="body2" href="#">
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
                        <Link color="text.secondary" variant="body2" href="#">
                          Présentation
                        </Link>
                        <Link color="text.secondary" variant="body2" href="#">
                          Blog
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
                            Legalité
                        </Typography>
                        <Link color="text.secondary" variant="body2" href="#">
                            Termes et conditions
                        </Link>
                        <Link color="text.secondary" variant="body2" href="#">
                            Confidentialité
                        </Link>
                        <Link color="text.secondary" variant="body2" href="#">
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
                            href="#"
                            aria-label="Instagram"
                            sx={{ alignSelf: 'center' }}
                        >
                            <Instagram />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            size="small"
                            href="#"
                            aria-label="X"
                            sx={{ alignSelf: 'center' }}
                        >
                            <TwitterIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            size="small"
                            href="#"
                            aria-label="LinkedIn"
                            sx={{ alignSelf: 'center' }}
                        >
                            <LinkedInIcon />
                        </IconButton>
                    </Stack>
                </Box>
            </Container>
        </React.Fragment>
    );
}