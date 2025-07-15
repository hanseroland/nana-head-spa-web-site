// src/components/ui/ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, Avatar, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const ChatWindow = ({ isOpen, onClose, embedded = false, isClientMode = false }) => {
    const {
        selectedConversation,
        messages,
        sendMessage,
        isChatLoading,
        chatError,
        fetchMessages, // On le garde si on veut re-fetch manuellement
        setMessages, // Pour réinitialiser ou manipuler l'état local des messages
    } = useChat();
    const { currentUser, loading: authLoading } = useAuth();

    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null); // Référence pour faire défiler automatiquement

    // Faire défiler vers le bas à chaque nouveau message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Re-charger les messages si la conversation sélectionnée change
    useEffect(() => {
        if (selectedConversation) {
            // Le ChatContext.selectConversation appelle déjà fetchMessages
            // Ici, on s'assure juste que l'état local 'messages' est celui du contexte
            // Si la logique de `selectConversation` du context est bonne, on n'a pas besoin de fetch ici
            // mais on réinitialise au cas où la conversation change sans passer par selectConversation (moins probable)
            setMessages(messages); // Assurer la synchro avec l'état global du contexte
        } else {
            setMessages([]); // Réinitialiser si aucune conversation n'est sélectionnée
        }
    }, [selectedConversation]); // selectedConversation en dépendance

    if (!isOpen && !embedded) return null; // Ne rien rendre si la fenêtre est fermée et non embarquée

    // Fonction pour déterminer le nom de l'interlocuteur
    const getChatPartnerName = () => {
        if (!selectedConversation || !currentUser || !selectedConversation.participants) {
            return 'Chargement...';
        }

        // Trouver le participant qui n'est pas l'utilisateur actuel
        const partner = selectedConversation.participants.find(
            p => p._id !== currentUser._id
        );
        return partner ? `${partner.firstName} ${partner.lastName}` : 'Utilisateur Inconnu';
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedConversation || isChatLoading) {
            if (!messageInput.trim()) toast.error("Le message ne peut pas être vide.");
            return;
        }

        // Trouver l'ID du destinataire (l'autre participant de la conversation)
        const receiverId = selectedConversation.participants.find(
            p => p._id !== currentUser._id
        )?._id;

        if (receiverId) {
            // Appeler la fonction d'envoi de message du contexte
            await sendMessage(receiverId, messageInput.trim());
            setMessageInput(''); // Vider le champ après envoi
        } else {
            toast.error("Impossible d'envoyer le message : destinataire non trouvé.");
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                width: embedded ? '100%' : { xs: '100%', md: 800 },
                height: embedded ? '100%' : '80vh',
                display: 'flex',
                flexDirection: 'column',
                position: embedded ? 'static' : 'fixed',
                bottom: embedded ? 'auto' : 20,
                right: embedded ? 'auto' : 20,
                zIndex: 1000,
                borderRadius: 2,
                overflow: 'hidden',
                maxHeight: 'calc(100vh - 40px)', // Empêche le débordement sur de petits écrans si non embedded
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e0e0e0',
            }}
        >
            {/* En-tête de la fenêtre de chat */}
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderBottom: '1px solid #ccc',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {selectedConversation ? getChatPartnerName() : 'Sélectionnez une conversation'}
                </Typography>
                {!embedded && ( // Le bouton de fermeture n'est pas affiché si le chat est embarqué dans une page
                    <IconButton onClick={onClose} color="inherit" size="small">
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>

            {/* Zone des messages */}
            <List
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 2,
                    bgcolor: '#f5f5f5', // Couleur de fond légère pour le chat
                }}
            >
                {isChatLoading ? (
                    <Typography align="center" sx={{ mt: 2 }}>Chargement des messages...</Typography>
                ) : chatError ? (
                    <Typography align="center" color="error" sx={{ mt: 2 }}>{chatError}</Typography>
                ) : !selectedConversation ? (
                    <Typography align="center" sx={{ mt: 2, color: '#000' }}>
                        {isClientMode ? "Cliquez sur 'Démarrer une conversation' pour parler à l'administration." : "Sélectionnez une conversation pour commencer à discuter."}
                    </Typography>
                ) : messages.length === 0 ? (
                    <Typography align="center" sx={{ mt: 2, color: '#000' }}>
                        Aucun message dans cette conversation. Soyez le premier !
                    </Typography>
                ) : (
                    messages.map((message) => (
                        <ListItem
                            key={message._id}
                            sx={{
                                justifyContent: message.sender._id === currentUser._id ? 'flex-end' : 'flex-start',
                                mb: 1,
                                px: 0, // Enlève le padding horizontal par défaut
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    flexDirection: message.sender._id === currentUser._id ? 'row-reverse' : 'row',
                                    maxWidth: '80%',
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: message.sender._id === currentUser._id ? 'primary.light' : 'secondary.light',
                                        ml: message.sender._id === currentUser._id ? 1 : 0,
                                        mr: message.sender._id === currentUser._id ? 0 : 1,
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {message.sender.firstName ? message.sender.firstName[0] : ''}
                                </Avatar>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 1.2,
                                        borderRadius: '20px', // Bords plus arrondis
                                        bgcolor: message.sender._id === currentUser._id ? '#DCF8C6' : '#FFFFFF', // Couleurs de bulle de chat
                                        borderColor: message.sender._id === currentUser._id ? '#DCF8C6' : '#E0E0E0',
                                        boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
                                        wordBreak: 'break-word', // Empêche le texte de déborder
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: '#000' }}>
                                        {message.content}
                                    </Typography>
                                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: '#000', fontSize: '0.7rem' }}>
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                </Paper>
                            </Box>
                        </ListItem>
                    ))
                )}
                <div ref={messagesEndRef} /> {/* Point de défilement */}
            </List>

            {/* Zone de saisie du message */}
            {selectedConversation && ( // Afficher la zone de saisie uniquement si une conversation est sélectionnée
                <Box
                    component="form"
                    onSubmit={handleSendMessage}
                    sx={{
                        p: 2,
                        borderTop: '1px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Écrivez votre message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        size="small"
                        sx={{ mr: 1, '& fieldset': { borderRadius: '25px' } }} // Bords arrondis pour le champ de saisie
                        disabled={isChatLoading} // Désactiver pendant le chargement
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter' && !ev.shiftKey) { // Envoyer avec Enter, nouvelle ligne avec Shift+Enter
                                ev.preventDefault();
                                handleSendMessage(ev);
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={!messageInput.trim() || isChatLoading}
                        sx={{
                            borderRadius: '25px', // Bouton rond
                            minWidth: '48px', // Taille minimale pour le bouton rond
                            height: '48px',
                            p: 0, // Enlever le padding interne par défaut
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <SendIcon />
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default ChatWindow;