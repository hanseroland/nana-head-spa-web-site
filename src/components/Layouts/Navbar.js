import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Link from 'next/link';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/router'; // ✅ import pour détecter la page active

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
    const theme = useTheme();
    const router = useRouter(); // ✅ pour accéder au chemin actif
    const currentPath = router.pathname;


    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const toggleTheme = () => {
        setThemeMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
    };

    const navLinks = [
        { label: 'Presentation', href: '/presentation' },
        { label: 'Formules', href: '/formules' },
        { label: 'Reservations', href: '/reservations' },
       // { label: 'Nouveautés', href: '/nouveautes' },
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
                        <IconButton onClick={toggleTheme} color="inherit">
                            {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon sx={{ color: "#fff" }} />}
                        </IconButton>
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
                                <Link  href="/" passHref>
                                    <MenuItem
                                        sx={{
                                            fontWeight: 600,
                                            fontFamily: 'Poppins',
                                            textTransform: 'none',
                                            color:'primary.main' ,
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
                                <MenuItem>
                                    <Button color="primary" variant="contained" fullWidth>
                                        Se connecter
                                    </Button>
                                </MenuItem>
                                <MenuItem>
                                    <Button color="primary" variant="outlined" fullWidth>
                                        S'inscrire
                                    </Button>
                                </MenuItem>
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}
