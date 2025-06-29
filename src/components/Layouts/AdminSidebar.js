import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import OptionsMenu from '../admin/OptionMenu';



const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    })
);

const AdminSidebar = ({ open, handleDrawerClose, links, themeMode, setThemeMode, logout }) => {



    const theme = useTheme();

    const router = useRouter(); // ✅ pour accéder au chemin actif
    const currentPath = router.pathname;


    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const toggleTheme = () => {
        setThemeMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
    };

    return (
        <Drawer variant="permanent" open={open}>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {links.map((link, index) => {

                    const isActive = currentPath === link.href;

                    return (

                        <ListItem key={link.text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                component={Link}
                                href={link.path}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    borderBottom: isActive ? '2px solid' : '2px solid transparent',
                                    borderColor: isActive ? 'primary.main' : 'transparent',
                                    backgroundColor: 'transparent',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        color: 'custom.bubble2',
                                        borderBottom: '2px solid',
                                        borderColor: 'primary.main',
                                    },
                                }}
                                passHref
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: isActive ? 'primary.main' : 'text.primary',

                                    }}
                                >
                                    {link.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={link.text}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
            <Divider />
            <List>
                <Box
                    display="flex"
                    justifyContent="center"
                >
                    <Stack
                        direction="row"
                        sx={{
                            p: 2,
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <OptionsMenu
                            logout={logout}
                        />
                    </Stack>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    mb={2}
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

                </Box>

            </List>
        </Drawer>
    );
};

export default AdminSidebar;
