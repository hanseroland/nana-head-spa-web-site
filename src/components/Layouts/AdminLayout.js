// client/components/Layouts/AdminLayout.js

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import AdminSidebar from './AdminSidebar';
import AdminAppBar from './AdminAppBar';
import { AccountCircle, Assignment, AutoFixHigh, CalendarMonth, Chat, Dashboard, EmojiEvents, LibraryBooks, PhotoCamera, PhotoLibrary } from '@mui/icons-material';
//import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { CircularProgress, Typography, Alert, AlertTitle } from '@mui/material';
import { useAuth } from '@/context/AuthContext';




const AdminLayout = ({ children, themeMode, setThemeMode }) => {

    // Récupération de l'utilisateur actuel depuis le store Redux
    //const { currentUser } = useSelector(state => state.users);
    //const dispatch = useDispatch();

    const { currentUser, isAuthenticated, loading, logout } = useAuth();
    const router = useRouter();

    // États locaux pour gérer le chargement et les erreurs lors de la récupération de l'utilisateur
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [userError, setUserError] = useState(null);
    const [currentLinks, setCurrentLinks] = useState([]); // État pour les liens dynamiques


    // Liens de navigation pour la barre latérale de l'administrateur
    const adminLinks = [
        { text: 'Tableau de bord', path: '/admin/dashboard', icon: <Dashboard /> },
        { text: 'Articles et Conseils', path: '/admin/articles', icon: <AutoFixHigh /> },
        { text: 'Rendez-vous', path: '/admin/rendezvous', icon: <CalendarMonth /> },
        { text: 'Formules', path: '/admin/formules', icon: <LibraryBooks /> },
        { text: 'Utilisateurs', path: '/admin/users', icon: <ContactPageIcon /> },
        { text: 'Chat', path: '/admin/chat', icon: <Chat /> },
        { text: 'Galerie', path: '/admin/galerie', icon: <PhotoLibrary /> },
        { text: 'Bannières', path: '/admin/banner', icon: <PhotoCamera /> },

    ];

    const clientLinks = [
        { text: 'Mon compte', path: '/admin/moncompte', icon: <AccountCircle /> },
        { text: 'Historique des soins', path: '/admin/mes-soins', icon: <Assignment /> },
        { text: 'Mes rendez-vous', path: '/admin/mesrendezvous', icon: <CalendarMonth /> },
        { text: 'Historique de Fidélité', path: '/admin/fidelite', icon: <EmojiEvents /> },
        { text: 'Chat', path: '/admin/chat', icon: <Chat /> },

    ];

    //État pour gérer l'ouverture/fermeture de la barre latérale (drawer)
    const [open, setOpen] = useState(false);

    //Fonctions de rappel pour ouvrir et fermer le drawer
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    //useEffect pour gérer les redirections et définir les liens en fonction de l'état du contexte

    useEffect(() => {
        // Attendre que le contexte ait fini de charger (vérification initiale du token)
        if (!loading) {
            if (!isAuthenticated) {
                // Si pas authentifié (et `loading` est terminé), redirige vers la connexion
                setUserError("Vous devez être connecté pour accéder à cette section.");
                router.push('/connexion');
            } else {
                // Si authentifié, définit les liens et gère les accès spécifiques
                if (currentUser?.role === 'admin') {
                    setCurrentLinks(adminLinks);
                } else { // C'est un client
                    setCurrentLinks(clientLinks);
                    // Si un client tente d'accéder à une page purement admin (non listée dans clientLinks)
                    const isClientAllowedPath = clientLinks.some(link => router.pathname.startsWith(link.path));
                    if (!isClientAllowedPath && router.pathname.startsWith('/admin')) {
                        // Rediriger vers la page par défaut du client
                        router.push('/admin/moncompte');
                        setUserError("Vous n'avez pas les permissions pour accéder à cette section.");
                    }
                }
            }
        }
    }, [loading, isAuthenticated, currentUser, router]); // Dépendances importantes !


    // --- Affichage conditionnel basé sur l'état de chargement et d'erreur ---
    // Affiche un spinner pendant le chargement initial du contexte
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2 }}>Chargement de l'espace...</Typography>
            </Box>
        );
    }

    // Affiche un message d'erreur si la récupération de l'utilisateur a échoué
    if (userError) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Accès Refusé</AlertTitle>
                    {userError}
                </Alert>
            </Box>
        );
    }

    // Si l'utilisateur n'est pas authentifié après le chargement, ne rien rendre.
    // La redirection devrait déjà avoir eu lieu.
    if (!currentUser) {
        return null;
    }

    // Vérification finale pour les clients essayant d'accéder à des pages admin.
    // Cette vérification est cruciale car `useEffect` peut être asynchrone.
    const isCurrentPathAllowedForClient = currentUser.role === 'client' && clientLinks.some(link => router.pathname.startsWith(link.path));
    if (currentUser.role === 'client' && !isCurrentPathAllowedForClient) {
        router.push('/admin/moncompte'); // Rediriger le client vers sa page par défaut
        return null; // Empêcher le rendu du contenu non autorisé
    }



    // --- Rendu du Layout Admin si l'utilisateur est un administrateur authentifié ---
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Barre d'application supérieure de l'administrateur */}
            <AdminAppBar
                title={currentUser.role === 'admin' ? "Nana Head Spa - Admin" : "Mon Espace Client"}
                open={open}
                drawerWidth={240}
                handleDrawerOpen={handleDrawerOpen}
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                logout={logout}
            />
            {/* Barre latérale de navigation de l'administrateur */}
            <AdminSidebar
                open={open}
                handleDrawerClose={handleDrawerClose}
                links={currentLinks}
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                currentUser={currentUser}
                logout={logout}
            />
            {/* Contenu principal de la page, avec un espace pour la barre d'application */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> {/* Ceci ajoute l'espace nécessaire pour que le contenu ne soit pas sous l'AppBar */}
                {children} {/* Les composants de la page active sont rendus ici */}
            </Box>
        </Box>
    );
};

export default AdminLayout;