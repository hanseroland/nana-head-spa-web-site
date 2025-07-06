// src/components/ui/ConversationList.js
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    CircularProgress,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import NewChatModal from './NewChatModal';

const ConversationList = ({ onSelectConversation, onStartNewClientChat, isClientMode = false }) => {
    const {
        conversations,
        fetchConversations,
        isChatLoading,
        chatError,
        selectedConversation,
        startClientAdminConversation,
    } = useChat();
    const { currentUser, loading: authLoading } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

    useEffect(() => {
        if (!authLoading && currentUser) {
            fetchConversations();
        }
    }, [fetchConversations, authLoading, currentUser]);


    const handleClientStartChat = async () => {
        if (!currentUser || currentUser.role !== 'client') {
            toast.error("Cette action est réservée aux clients.");
            return;
        }
        const conversation = await startClientAdminConversation();
        if (conversation) {
            onSelectConversation(conversation);
        }
    };


    const getParticipantName = (conversation) => {
        if (!currentUser || !conversation.participants) return 'Chargement...';
        const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);
        return otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Utilisateur inconnu';
    };

    const getOtherParticipantAvatar = (conversation) => {
        if (!currentUser || !conversation.participants) return '';
        const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);
        return otherParticipant?.firstName ? otherParticipant.firstName[0] : '';
    };

    const filteredConversations = conversations.filter(conv => {
        const partnerName = getParticipantName(conv).toLowerCase();
        return partnerName.includes(searchTerm.toLowerCase());
    });

    return (
        <Paper elevation={1} sx={{ width: { xs: '100%', md: 350 }, minHeight: '60vh', display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Conversations</Typography>
                {!isClientMode && (
                    <IconButton color="inherit" onClick={() => setIsNewChatModalOpen(true)}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                )}
            </Box>
            <Box sx={{ p: 1, borderBottom: '1px solid #e0e0e0' }}>
                {isClientMode ? (
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleClientStartChat}
                        disabled={isChatLoading}
                        sx={{ my: 1 }}
                    >
                        Démarrer une conversation avec l'Admin
                    </Button>
                ) : (
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Rechercher une conversation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '20px' }
                        }}
                    />
                )}
            </Box>

            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                {isChatLoading && !conversations.length ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : chatError ? (
                    <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>{chatError}</Typography>
                ) : filteredConversations.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                        {isClientMode ? "Aucune conversation active. Cliquez sur le bouton ci-dessus pour en démarrer une." : "Aucune conversation trouvée."}
                    </Typography>
                ) : (
                    filteredConversations.map((conv) => (
                        <React.Fragment key={conv._id}>
                            <ListItem
                                button
                                onClick={() => onSelectConversation(conv)}
                                selected={selectedConversation?._id === conv._id}
                                sx={{
                                    py: 1.5,
                                    borderRadius: '10px',
                                    mb: 0.5,
                                    '&.Mui-selected': {
                                        backgroundColor: 'rgba(0, 150, 136, 0.1) !important',
                                        borderLeft: '4px solid',
                                        borderColor: 'primary.main',
                                        borderRadius: '4px',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                                        {getOtherParticipantAvatar(conv)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}> {/* Utilise text.primary */}
                                                {getParticipantName(conv)}
                                            </Typography>
                                            {conv.lastMessage?.timestamp && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '80%' }}>
                                                {conv.lastMessage ? conv.lastMessage.content : 'Pas de message.'}
                                            </Typography>
                                            {conv.unreadCount > 0 && (
                                                <Box
                                                    sx={{
                                                        minWidth: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        bgcolor: 'error.main',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 'bold',
                                                        ml: 1,
                                                    }}
                                                >
                                                    {conv.unreadCount}
                                                </Box>
                                            )}
                                        </Box>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" sx={{ ml: 7 }} />
                        </React.Fragment>
                    ))
                )}
            </List>

            {!isClientMode && (
                <NewChatModal
                    isOpen={isNewChatModalOpen}
                    onClose={() => setIsNewChatModalOpen(false)}
                    onChatInitiated={(conversation) => {
                        setIsNewChatModalOpen(false);
                        onSelectConversation(conversation);
                    }}
                />
            )}
        </Paper>
    );
};

export default ConversationList;