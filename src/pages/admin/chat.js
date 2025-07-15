// src/pages/chat/index.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import ChatWindow from '@/components/admin/ChatWindow';
import ConversationList from '@/components/admin/ConversationList';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';

const ChatPage = () => {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const { selectedConversation, selectConversation, isChatLoading, fetchConversations } = useChat();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login'); // Redirige vers la page de connexion si non authentifié
    } else if (!authLoading && isAuthenticated) {
      // Si l'utilisateur est authentifié, on peut initier le chargement des conversations
      // Le ChatContext gère déjà la logique de fetch initial via son useEffect
      // Mais on peut le forcer ici si on veut
      fetchConversations();
    }
  }, [isAuthenticated, authLoading, router, fetchConversations]);

  if (authLoading || !isMounted) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirection gérée par useEffect
  }

  // Détermine le mode (client ou admin)
  const isClientMode = currentUser?.role === 'client';
  const isAdminMode = currentUser?.role === 'admin';

  // Placeholder pour un futur ajout d'une modale pour démarrer un nouveau chat admin
  const handleStartNewClientChat = () => {
    // Cette fonction sera appelée par ConversationList pour ouvrir la NewChatModal
    // La logique est maintenant dans NewChatModal elle-même et gérée par ConversationList
  };

  return (
    <Box>
      <Head>
        <title>Chat - Spa & Beauté</title>
      </Head>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
        {isClientMode ? 'Votre Chat avec l\'Administration' : 'Gérer les Conversations Clients'}
      </Typography>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }} >
            {/* Colonne de gauche : Liste des conversations */}
            <ConversationList
              onSelectConversation={selectConversation}
              onStartNewClientChat={handleStartNewClientChat} // Pour l'admin
              isClientMode={isClientMode} // Indique au composant son mode d'affichage
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Colonne de droite : Fenêtre de chat */}
            <ChatWindow
              isOpen={true} // Toujours ouverte car intégrée
              embedded={true} // Indique que le composant est embarqué dans la page
              isClientMode={isClientMode} // Indique au composant son mode d'affichage
            // onClose n'est pas nécessaire ici car embedded est true
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ChatPage;