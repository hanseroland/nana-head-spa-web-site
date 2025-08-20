import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import {
    GetConversations,
    GetConversationMessages,
    StartClientAdminConversation,
    StartAdminClientConversation,
    SendMessage,
    // GetClients // Si GetClients n'est pas utilisé directement dans ce contexte, on peut l'omettre.
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

    // Stocke une référence aux messages actuels pour éviter les problèmes de clôture (closure) dans les callbacks de socket
    const messagesRef = useRef(messages);
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    // Stocke une référence à la conversation sélectionnée
    const selectedConversationRef = useRef(selectedConversation);
    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);

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
    }, [isAuthenticated, authLoading]);

    const fetchMessages = useCallback(async (conversationId) => {
        if (!conversationId) return;
        setIsChatLoading(true);
        setChatError(null);
        try {
            const response = await GetConversationMessages(conversationId);
            if (response.success) {
                setMessages(response.data);
                // Réinitialise le compteur de messages non lus pour la conversation sélectionnée
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
    }, []);

    const selectConversation = useCallback(async (conversation) => {
        setSelectedConversation(conversation);
        if (conversation) {
            setMessages([]); // Nettoie les messages avant de charger les nouveaux
            await fetchMessages(conversation._id);
        } else {
            setMessages([]);
        }
    }, [fetchMessages]);

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
    }, [isAuthenticated, currentUser, fetchMessages]);

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
    }, [isAuthenticated, currentUser, fetchMessages]);

    // Fonction pour envoyer un message (mise à jour optimiste + API REST + Socket.IO)
    const sendMessage = useCallback((receiverId, content) => {
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
            content,
            timestamp: new Date().toISOString(),
            readBy: [currentUser._id],
            isOptimistic: true
        };

        // Ajout du message optimiste
        setMessages(prev => [...prev, optimisticMessage]);

        // Envoi via Socket.IO
        socket.current.emit('send_message', {
            conversationId: selectedConversation._id,
            sender: currentUser._id,
            content,
            receiver: receiverId
        });

    }, [socket, selectedConversation, currentUser]);


    // --- Initialisation et gestion du Socket.IO ---
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

                // Vérifie si le message existe déjà (optimiste ou réel) avant de l'ajouter
                setMessages(prevMessages => {

                    const existingMessageIndex = prevMessages.findIndex(msg =>
                        msg._id === message._id || // Si l'ID réel correspond
                        (msg.isOptimistic && msg.content === message.content && msg.conversationId === message.conversationId && message.sender._id === currentUser._id)
                    );

                    if (existingMessageIndex > -1) {
                        const updatedMessages = [...prevMessages];
                        // Remplacer le message existant (optimiste ou doublon) par le message réel
                        updatedMessages[existingMessageIndex] = { ...message, isOptimistic: false };
                        return updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    } else {

                        return [...prevMessages, { ...message, isOptimistic: false }].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    }
                });


                // Mettre à jour la liste des conversations avec le dernier message et les non lus
                setConversations(prevConversations => {
                    const updatedConversations = prevConversations.map(conv => {
                        if (conv._id === message.conversationId) {
                            const isSender = message.sender._id === currentUser._id;
                            // Incrémenter le compteur de non lus si le message n'est pas de nous et que la conversation n'est pas active
                            let unreadCount = conv.unreadCount || 0;
                            if (!isSender && (selectedConversationRef.current?._id !== message.conversationId)) {
                                unreadCount += 1;
                            } else if (selectedConversationRef.current?._id === message.conversationId) {
                                // Si la conversation est active et c'est le message de l'autre, on le marque lu
                                unreadCount = 0;
                            }
                            return { ...conv, lastMessage: message, updatedAt: new Date(message.timestamp), unreadCount: unreadCount };
                        }
                        return conv;
                    });

                    // Si le message reçu concerne une conversation qui n'est pas encore dans la liste (ex: nouvelle conversation initiée par l'autre)
                    // Il faut re-fetch les conversations pour être sûr.
                    if (!updatedConversations.some(conv => conv._id === message.conversationId)) {
                        fetchConversations();
                        return prevConversations; // Retourne l'état précédent en attendant le re-fetch
                    }

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
    }, [isAuthenticated, currentUser, fetchConversations]); // selectedConversation n'est plus une dépendance directe car on utilise selectedConversationRef.current


    // Effet pour fetchConversations au chargement ou changement d'authentification
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            fetchConversations();
        }
    }, [isAuthenticated, authLoading, fetchConversations]);

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
        setMessages, // Gardez cette fonction si elle est utilisée ailleurs pour des manipulations directes
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
};