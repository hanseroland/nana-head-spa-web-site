// src/components/ui/ChatFloatingButton.js
import React, { useState, useEffect } from 'react';
import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat';
import Badge from '@mui/material/Badge';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import ChatWindow from './ChatWindow'; // Assurez-vous que le chemin est correct
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';

const ChatFloatingButton = () => {
    const theme = useTheme();
    const { isAuthenticated, currentUser, loading: authLoading } = useAuth();
    const { conversations, isChatLoading, chatError, fetchConversations, selectConversation, startClientAdminConversation } = useChat();

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    // Calculer le nombre de messages non lus
    useEffect(() => {
        if (isAuthenticated && currentUser?.role === 'client' && conversations) {
            const count = conversations.reduce((total, conv) => {
                // Seulement les conversations avec l'admin pour le client
                if (conv.participants.some(p => p.role === 'admin')) {
                    return total + (conv.unreadCount || 0);
                }
                return total;
            }, 0);
            setUnreadMessagesCount(count);
        } else {
            setUnreadMessagesCount(0);
        }
    }, [conversations, isAuthenticated, currentUser]);

    // Ouvre la fenêtre de chat
    const handleOpenChat = async () => {
        if (authLoading) {
            toast.loading("Vérification de votre statut...");
            return;
        }

        if (!isAuthenticated) {
            toast.error("Veuillez vous connecter pour discuter avec l'administration.");
            return;
        }

        if (currentUser?.role === 'admin') {
            // Pour les admins, le chat est dans l'espace admin, ce bouton ne doit pas les ouvrir
            toast("Accédez au chat depuis votre tableau de bord administrateur.", { icon: 'ℹ️' });
            return;
        }

        // Si client
        setIsChatOpen(true);
        // Si aucune conversation n'est présente, en démarrer une avec l'admin
        if (conversations && conversations.length === 0 && !isChatLoading) {
            const conversation = await startClientAdminConversation();
            if (conversation) {
                selectConversation(conversation);
            }
        } else if (conversations && conversations.length > 0) {
            // Si le client a déjà une conversation, la sélectionner (assumant une seule conversation client-admin)
            // Cela peut être affiné si vous avez plusieurs types de conversations pour le client.
            // Pour l'instant, on sélectionne la première conversation client-admin trouvée
            const clientAdminConv = conversations.find(conv => conv.participants.some(p => p.role === 'admin'));
            if (clientAdminConv) {
                selectConversation(clientAdminConv);
            } else {
                // Si aucune conversation client-admin n'est trouvée (possible après filtre), en démarrer une
                const conversation = await startClientAdminConversation();
                if (conversation) {
                    selectConversation(conversation);
                }
            }
        }
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        // Au besoin, réinitialiser la conversation sélectionnée ou les messages pour la prochaine ouverture
        selectConversation(null);
    };

    // Le bouton n'est affiché que si l'utilisateur est un client (ou en cours de chargement initial)
    // et qu'il n'est pas un admin.
    if (!authLoading && (currentUser?.role === 'admin' || !isAuthenticated)) {
        return null; // Ne pas afficher le bouton pour les admins ou les non-authentifiés (la modale de connexion est suggérée)
    }

    return (
        <Box>
            <Fab
                color="primary"
                aria-label="chat"
                onClick={handleOpenChat}
                sx={{
                    position: 'fixed',
                    bottom: theme.spacing(3),
                    right: theme.spacing(3),
                    zIndex: theme.zIndex.drawer + 1000, // Pour s'assurer qu'il est au-dessus d'autres éléments
                }}
            >
                <Badge badgeContent={unreadMessagesCount} color="error">
                    <ChatIcon />
                </Badge>
            </Fab>

            {/* Fenêtre de chat modale */}
            <ChatWindow
                isOpen={isChatOpen}
                onClose={handleCloseChat}
                embedded={false} // Important : c'est une modale pour le client
            />
        </Box>
    );
};

export default ChatFloatingButton;