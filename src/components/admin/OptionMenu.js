import * as React from 'react';
import { styled } from '@mui/material/styles';
import Divider, { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Avatar } from '@mui/material';
import Link from 'next/link';

const MenuItem = styled(MuiMenuItem)({
    margin: '2px 0',
});

export default function OptionsMenu({ logout }) {


    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose(); // Ferme le menu
        if (logout) { // S'assure que la prop logout est bien fournie
            logout(); // Appelle la fonction de déconnexion passée en prop
        }
    };

    return (
        <React.Fragment>
            <Avatar
                aria-label="Open menu"
                onClick={handleClick}
                alt="avatar" sx={{ width: 45, height: 45 }}
            >
                H
            </Avatar>
            <Menu
                anchorEl={anchorEl}
                id="menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                sx={{
                    [`& .${listClasses.root}`]: {
                        padding: '4px',
                    },
                    [`& .${paperClasses.root}`]: {
                        padding: 0,
                    },
                    [`& .${dividerClasses.root}`]: {
                        margin: '4px -4px',
                    },
                }}
            >

                <Link href="/admin/moncompte" passHref>
                    <MenuItem onClick={handleClose}>Mon compte</MenuItem>
                </Link>
                <Link href="/admin/mes-soins" passHref>
                    <MenuItem onClick={handleClose}>Historique des soins</MenuItem>
                </Link>
                <Link href="/admin/fidelite" passHref>
                    <MenuItem onClick={handleClose}>Historique de Fidélité</MenuItem>
                </Link>
                <Divider />
                <Link href="/admin/mesrendezvous" passHref>
                    <MenuItem onClick={handleClose}>Mes rendez-vous</MenuItem>
                </Link>
                <MenuItem onClick={handleClose}>Mes soins</MenuItem>
                <MenuItem onClick={handleClose}>Chat</MenuItem>
                <Divider />
                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        [`& .${listItemIconClasses.root}`]: {
                            ml: 'auto',
                            minWidth: 0,
                        },
                    }}
                >
                    <ListItemText>Se déconnecter</ListItemText>
                    <ListItemIcon>
                        <LogoutRoundedIcon fontSize="small" />
                    </ListItemIcon>
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}