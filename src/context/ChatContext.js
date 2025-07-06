// src/context/ChatContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import {
    GetConversations,
    GetConversationMessages,
    StartClientAdminConversation,
    StartAdminClientConversation,
    SendMessage,
    GetClients
} from '@/apiCalls/chat';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
    const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [chatError, setChatError] = useState(null);
    const socket = useRef(null);

    // --- Déclarations des fonctions de chargement des données via API REST (déplacées en haut) ---

    const fetchConversations = useCallback(async () => {
        if (!isAuthenticated || authLoading) return;
        setIsChatLoading(true);
        setChatError(null);
        try {
            const response = await GetConversations();
            if (response.success) {
                setConversations(response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
            } else {
                setChatError(response.message);
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des conversations:", error);
            setChatError("Erreur lors du chargement des conversations.");
            toast.error("Erreur lors du chargement des conversations.");
        } finally {
            setIsChatLoading(false);
        }
    }, [isAuthenticated, authLoading]); // Ces dépendances sont stables ou contrôlées

    const fetchMessages = useCallback(async (conversationId) => {
        if (!conversationId) return;
        setIsChatLoading(true);
        setChatError(null);
        try {
            const response = await GetConversationMessages(conversationId);
            if (response.success) {
                setMessages(response.data);
                setConversations(prev => prev.map(conv =>
                    conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
                ));
            } else {
                setChatError(response.message);
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des messages:", error);
            setChatError("Erreur lors du chargement des messages.");
            toast.error("Erreur lors du chargement des messages.");
        } finally {
            setIsChatLoading(false);
        }
    }, []); // Pas de dépendances changeantes ici, donc stable

    const selectConversation = useCallback(async (conversation) => {
        setSelectedConversation(conversation);
        if (conversation) {
            setMessages([]);
            await fetchMessages(conversation._id);
        } else {
            setMessages([]);
        }
    }, [fetchMessages]); // Dépend de fetchMessages

    const startClientAdminConversation = useCallback(async () => {
        if (!isAuthenticated || currentUser?.role !== 'client') {
            toast.error("Seuls les clients peuvent initier ce type de conversation.");
            return null;
        }
        setIsChatLoading(true);
        setChatError(null);

        try {
            const response = await StartClientAdminConversation();
            if (response.success) {
                const newOrExistingConversation = response.data;
                setConversations(prev => {
                    const existingIndex = prev.findIndex(c => c._id === newOrExistingConversation._id);
                    if (existingIndex > -1) {
                        const updated = [...prev];
                        updated[existingIndex] = newOrExistingConversation;
                        return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    }
                    return [newOrExistingConversation, ...prev].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                });
                setSelectedConversation(newOrExistingConversation);
                await fetchMessages(newOrExistingConversation._id);
                return newOrExistingConversation;
            } else {
                setChatError(response.message);
                toast.error(response.message);
                return null;
            }
        } catch (error) {
            console.error("Erreur dans startClientAdminConversation:", error);
            setChatError("Une erreur est survenue lors du démarrage de la conversation.");
            toast.error("Une erreur est survenue lors du démarrage de la conversation.");
            return null;
        } finally {
            setIsChatLoading(false);
        }
    }, [isAuthenticated, currentUser, fetchMessages, fetchConversations, selectConversation]); // Ajout de fetchConversations et selectConversation si utilisées

    const startAdminClientConversation = useCallback(async (clientId) => {
        if (!isAuthenticated || currentUser?.role !== 'admin') {
            toast.error("Seuls les administrateurs peuvent initier ce type de conversation.");
            return null;
        }
        setIsChatLoading(true);
        setChatError(null);

        try {
            const response = await StartAdminClientConversation(clientId);
            if (response.success) {
                const newOrExistingConversation = response.data;
                setConversations(prev => {
                    const existingIndex = prev.findIndex(c => c._id === newOrExistingConversation._id);
                    if (existingIndex > -1) {
                        const updated = [...prev];
                        updated[existingIndex] = newOrExistingConversation;
                        return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    }
                    return [newOrExistingConversation, ...prev].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                });
                setSelectedConversation(newOrExistingConversation);
                await fetchMessages(newOrExistingConversation._id);
                return newOrExistingConversation;
            } else {
                setChatError(response.message);
                toast.error(response.message);
                return null;
            }
        } catch (error) {
            console.error("Erreur dans startAdminClientConversation:", error);
            setChatError("Une erreur est survenue lors du démarrage de la conversation avec le client.");
            toast.error("Une erreur est survenue lors du démarrage de la conversation avec le client.");
            return null;
        } finally {
            setIsChatLoading(false);
        }
    }, [isAuthenticated, currentUser, fetchMessages, fetchConversations, selectConversation]); // Ajout de fetchConversations et selectConversation si utilisées

    // Fonction pour envoyer un message (mise à jour optimiste + API REST)
    const sendMessage = useCallback(async (receiverId, content) => {
        if (!socket.current || !selectedConversation || !currentUser) {
            toast.error("Chat non initialisé ou conversation non sélectionnée.");
            return;
        }

        const tempId = `temp_${Date.now()}`;
        const optimisticMessage = {
            _id: tempId,
            conversationId: selectedConversation._id,
            sender: {
                _id: currentUser._id,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                role: currentUser.role
            },
            content: content,
            timestamp: new Date().toISOString(),
            readBy: [currentUser._id],
            isOptimistic: true
        };

        setMessages(prevMessages => [...prevMessages, optimisticMessage]);

        const messageDataForApi = {
            conversationId: selectedConversation._id,
            content: content,
            receiverId: receiverId,
        };

        try {
            const response = await SendMessage(messageDataForApi);
            if (response.success) {
                const sentMessage = response.data;
                toast.success('Message envoyé !');
            } else {
                toast.error("Échec de l'envoi du message via API.");
                setMessages(prevMessages => prevMessages.filter(msg => msg._id !== tempId));
            }
        } catch (error) {
            console.error("Erreur API sendMessage:", error);
            toast.error("Erreur réseau lors de l'envoi du message.");
            setMessages(prevMessages => prevMessages.filter(msg => msg._id !== tempId));
        }
    }, [socket, selectedConversation, currentUser]); // Ajouter SendMessage si ce n'est pas une fonction locale mais une importée qui peut changer

    // --- Initialisation et gestion du Socket.IO (maintenant après les déclarations de fonctions) ---
    useEffect(() => {
        if (isAuthenticated && currentUser && currentUser._id && !socket.current) {
            socket.current = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
                query: { userId: currentUser._id },
                withCredentials: true,
                transports: ['websocket', 'polling'],
            });

            socket.current.on('connect', () => {
                console.log('Socket connecté avec l\'ID :', socket.current.id);
            });

            socket.current.on('receive_message', (message) => {
                console.log("Message reçu via Socket:", message);

                setMessages(prevMessages => {
                    const existingIndex = prevMessages.findIndex(msg =>
                        (message._id && message._id === msg._id) ||
                        (msg._id && msg._id.startsWith("temp_") && msg.content === message.content && msg.conversationId === message.conversationId && message.sender._id === currentUser._id)
                    );

                    if (existingIndex > -1) {
                        const updatedMessages = [...prevMessages];
                        // Remplacer le message temporaire par le message définitif si c'est le nôtre
                        if (updatedMessages[existingIndex]._id && updatedMessages[existingIndex]._id.startsWith("temp_")) {
                            updatedMessages[existingIndex] = message;
                            return updatedMessages;
                        }
                        return prevMessages; // Message déjà présent, c'est un doublon de réception
                    }
                    return [...prevMessages, message];
                });

                setConversations(prevConversations => {
                    const updatedConversations = prevConversations.map(conv => {
                        if (conv._id === message.conversationId) {
                            const isSender = message.sender._id === currentUser._id;
                            let unreadCount = conv.unreadCount || 0;

                            if (!isSender && (!selectedConversation || selectedConversation._id !== message.conversationId)) {
                                unreadCount += 1;
                            } else if (selectedConversation && selectedConversation._id === message.conversationId) {
                                unreadCount = 0;
                            }
                            return { ...conv, lastMessage: message, updatedAt: new Date(message.timestamp), unreadCount: unreadCount };
                        }
                        return conv;
                    });
                    return updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                });
            });

            socket.current.on('error', (err) => {
                console.error('Erreur Socket.IO :', err);
                toast.error("Erreur de connexion au chat.");
            });

            socket.current.on('disconnect', () => {
                console.log('Socket déconnecté.');
            });

            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                    socket.current = null;
                }
            };
        } else if ((!isAuthenticated || !currentUser) && socket.current) {
            console.log('Déconnexion de l\'utilisateur, fermeture du socket.');
            socket.current.disconnect();
            socket.current = null;
            setConversations([]);
            setSelectedConversation(null);
            setMessages([]);
        }
    }, [isAuthenticated, currentUser, selectedConversation, setMessages, setConversations]); // selectedConversation est une dépendance cruciale pour l'update des messages non lus, setMessages et setConversations sont nécessaires car utilisés à l'intérieur du useCallback du useEffect principal.


    // Effet pour fetchConversations au chargement ou changement d'authentification
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            fetchConversations();
        }
    }, [isAuthenticated, authLoading, fetchConversations]); // fetchConversations est maintenant défini avant d'être utilisé ici

    // --- Valeurs fournies par le contexte ---
    const contextValue = {
        conversations,
        selectedConversation,
        messages,
        isChatLoading,
        chatError,
        fetchConversations,
        fetchMessages,
        selectConversation,
        sendMessage,
        startClientAdminConversation,
        startAdminClientConversation,
        setMessages,
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
};