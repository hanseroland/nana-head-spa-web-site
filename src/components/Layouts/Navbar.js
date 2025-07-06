import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Link from 'next/link';
import { Divider, useTheme, CircularProgress } from '@mui/material'; // Ajout de CircularProgress
import { useRouter } from 'next/router';
// ✅ Importez le hook useAuth
import { useAuth } from '@/context/AuthContext';
import { GetAllArticles } from '@/apiCalls/articles'; // Adjust path if necessary



const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: (theme.vars || theme).shadows[1],
    padding: '8px 12px',
}));

export default function Navbar({ themeMode, setThemeMode }) {

    const [open, setOpen] = React.useState(false);
    const [hasNewsOrTips, setHasNewsOrTips] = React.useState(false);
    const theme = useTheme();
    const router = useRouter();
    const currentPath = router.pathname;

    //l'état d'authentification et l'utilisateur depuis le contexte
    const { isAuthenticated, loading, currentUser, logout } = useAuth();



    // ✅ Récupérer les articles pour vérifier les "nouveautés" ou "conseils" publiés
    React.useEffect(() => {
        const fetchPublishedArticles = async () => {
            try {
                // Nous allons faire deux appels pour chaque catégorie
                // Ou mieux: un seul appel avec des ORs si votre backend le supporte.
                // Pour l'instant, faisons deux appels pour plus de clarté.
                const filters = { isPublished: true };

                // Vérifier les nouveautés
                const newsResponse = await GetAllArticles({ ...filters, category: 'nouveauté' });
                if (newsResponse.success && newsResponse.data && newsResponse.data.length > 0) {
                    setHasNewsOrTips(true);
                    return; // Si des nouveautés sont trouvées, on arrête ici
                }

                // Si pas de nouveautés, vérifier les conseils
                const tipsResponse = await GetAllArticles({ ...filters, category: 'conseil' });
                if (tipsResponse.success && tipsResponse.data && tipsResponse.data.length > 0) {
                    setHasNewsOrTips(true);
                    return; // Si des conseils sont trouvés, on arrête ici
                }

                // Si ni nouveauté ni conseil publié
                setHasNewsOrTips(false);

            } catch (error) {
                console.error("Erreur lors de la récupération des articles publiés:", error);
                setHasNewsOrTips(false); // Assumer qu'il n'y a pas d'articles si erreur
            }
        };

        fetchPublishedArticles();
    }, []); // Dépendances vides pour n'exécuter qu'une fois au montage


    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const toggleTheme = () => {
        setThemeMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
    };

    // Détermine le chemin du compte en fonction du rôle de l'utilisateur
    const accountPath = currentUser?.role === 'admin' ? '/admin/dashboard' : '/admin/moncompte';

    // ✅ Création dynamique des liens de navigation
    const navLinks = [
        { label: 'Présentation', href: '/presentation' },
        { label: 'Formules', href: '/formules' },
        { label: 'Réservations', href: '/reservations' },
        // N'inclure "Nouveautés" que si hasNewsOrTips est vrai
        ...(hasNewsOrTips ? [{ label: 'Nouveautés & Conseils', href: '/nouveautes' }] : []), // Ajustez l'URL de votre page "Nouveautés & Conseils"
        { label: 'Contact', href: '/contact' }
    ];

    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 'calc(var(--template-frame-height, 0px) + 8px)',
            }}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    {/* LOGO */}
                    <Link href="/" passHref>
                        <Box
                            component="img"
                            src="/images/logo-nana-head.png"
                            alt="Nana Head Spa Logo"
                            sx={{
                                height: 80,
                                width: 'auto',
                                borderRadius: '50%',
                                display: { xs: 'none', md: 'block' },
                                mr: 4,
                                cursor: 'pointer',
                            }}
                        />
                    </Link>

                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                        {/* LIENS DESKTOP */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {navLinks.map((link) => {
                                const isActive = currentPath === link.href;

                                return (
                                    <Link key={link.label} href={link.href} passHref>
                                        <Button
                                            variant="text"
                                            color="primary"
                                            size="medium"
                                            sx={{
                                                fontWeight: 600,
                                                fontFamily: 'sans-serif',
                                                textTransform: 'none',
                                                color: isActive ? 'primary.main' : 'text.primary',
                                                borderBottom: isActive ? '2px solid' : '2px solid transparent',
                                                borderColor: isActive ? 'primary.main' : 'transparent',
                                                borderRadius: 0,
                                                backgroundColor: 'transparent',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    color: 'custom.bubble2',
                                                    borderBottom: '2px solid',
                                                    borderColor: 'primary.main',
                                                },
                                            }}
                                        >
                                            {link.label}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* ACTIONS DESKTOP */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <IconButton
                            onClick={toggleTheme}
                            color="inherit"
                            sx={{
                                backgroundColor: theme.palette.primary.main
                            }}
                        >
                            {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon sx={{ color: "#fff" }} />}
                        </IconButton>

                        {/* ✅ Conditionnement des boutons en fonction de l'état d'authentification */}
                        {loading ? (
                            <CircularProgress size={24} color="primary" />
                        ) : (
                            isAuthenticated ? (
                                <>
                                    <Link href={accountPath} passHref>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            size="medium"
                                            sx={{
                                                fontWeight: 600,
                                                fontFamily: 'Poppins',
                                                textTransform: 'none',
                                                backgroundColor: theme.palette.primary.main,
                                                color: theme.palette.primary.contrastText,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.primary.dark,
                                                    color: 'primary.main'
                                                },
                                            }}
                                        >
                                            Mon Compte
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={logout} // Utilise la fonction logout du contexte
                                        color="secondary" // ou une autre couleur appropriée
                                        variant="outlined"
                                        size="medium"
                                        sx={{
                                            fontWeight: 600,
                                            fontFamily: 'Poppins',
                                            textTransform: 'none',
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.primary.contrastText,
                                            '&:hover': {
                                                backgroundColor: theme.palette.primary.dark,
                                                color: 'primary.main'
                                            },
                                        }}
                                    >
                                        Déconnexion
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/inscription" passHref>
                                        <Button
                                            color="primary"
                                            variant="text"
                                            size="medium"
                                            sx={{
                                                fontWeight: 600,
                                                fontFamily: 'Poppins',
                                                textTransform: 'none',
                                                backgroundColor: theme.palette.primary.main,
                                                color: theme.palette.primary.contrastText,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.primary.dark,
                                                    color: 'primary.main'
                                                },
                                            }}
                                        >
                                            S&apos;inscrire
                                        </Button>
                                    </Link>
                                    <Link href="/connexion" passHref>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            size="medium"
                                            sx={{
                                                fontWeight: 600,
                                                fontFamily: 'Poppins',
                                                textTransform: 'none',
                                                backgroundColor: theme.palette.primary.main,
                                                color: theme.palette.primary.contrastText,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.primary.dark,
                                                    color: 'primary.main'
                                                },
                                            }}
                                        >
                                            Se connecter
                                        </Button>
                                    </Link>
                                </>
                            )
                        )}
                    </Box>


                    {/* MENU MOBILE */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={toggleDrawer(false)}
                            PaperProps={{
                                sx: {
                                    top: 'var(--template-frame-height, 0px)',
                                },
                            }}
                        >
                            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Box>

                                {/* LIENS MOBILE */}
                                <Link href="/" passHref>
                                    <MenuItem
                                        sx={{
                                            fontWeight: 600,
                                            fontFamily: 'Poppins',
                                            textTransform: 'none',
                                            color: 'primary.main',
                                            backgroundColor: 'transparent',
                                            '&:hover': {
                                                color: 'text.primary',

                                            },
                                        }}
                                    >
                                        Accueil
                                    </MenuItem>
                                </Link>

                                {navLinks.map((link) => {
                                    const isActive = currentPath === link.href;
                                    return (
                                        <Link key={link.label} href={link.href} passHref>
                                            <MenuItem
                                                sx={{
                                                    fontWeight: 600,
                                                    fontFamily: 'Poppins',
                                                    textTransform: 'none',
                                                    color: isActive ? 'primary.main' : 'text.primary',
                                                    backgroundColor: isActive
                                                        ? alpha(theme.palette.primary.main, 0.05)
                                                        : 'transparent',
                                                    '&:hover': {
                                                        color: 'primary.main',
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                    },
                                                }}
                                            >
                                                {link.label}
                                            </MenuItem>
                                        </Link>
                                    );
                                })}

                                <Divider sx={{ my: 3 }} />

                                <MenuItem>
                                    <IconButton onClick={toggleTheme} color="inherit">
                                        {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                                    </IconButton>
                                </MenuItem>

                                {/* ✅ Conditionnement des boutons dans le menu mobile */}
                                {loading ? (
                                    <MenuItem sx={{ justifyContent: 'center' }}>
                                        <CircularProgress size={24} color="primary" />
                                    </MenuItem>
                                ) : (
                                    isAuthenticated ? (
                                        <>
                                            <Link href={accountPath} passHref>
                                                <MenuItem>
                                                    <Button color="primary" variant="contained" fullWidth>
                                                        Mon Compte
                                                    </Button>
                                                </MenuItem>
                                            </Link>
                                            <MenuItem onClick={logout}> {/* Utilise onClick sur MenuItem pour la déconnexion */}
                                                <Button color="secondary" variant="outlined" fullWidth>
                                                    Déconnexion
                                                </Button>
                                            </MenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/inscription" passHref>
                                                <MenuItem>
                                                    <Button color="primary" variant="contained" fullWidth>
                                                        S&apos;inscrire
                                                    </Button>
                                                </MenuItem>
                                            </Link>
                                            <Link href="/connexion" passHref>
                                                <MenuItem>
                                                    <Button color="primary" variant="outlined" fullWidth>
                                                        Se connecter
                                                    </Button>
                                                </MenuItem>
                                            </Link>
                                        </>
                                    )
                                )}
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar >
    );
}