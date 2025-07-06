// src/components/ui/NewChatModal.js
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText, CircularProgress, Box, Typography, Avatar, ListItemAvatar } from '@mui/material';
import { useChat } from '@/context/ChatContext';
import toast from 'react-hot-toast';
import { GetClients } from '@/apiCalls/chat'; // Assurez-vous que cette fonction est bien disponible

const NewChatModal = ({ isOpen, onClose, onChatInitiated }) => {
    const { isChatLoading, startAdminClientConversation } = useChat();
    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const fetchAllClients = async () => {
                setLoadingClients(true);
                try {
                    const response = await GetClients(); // Récupère tous les clients via votre API
                    if (response.success) {
                        setClients(response.data);
                    } else {
                        toast.error(response.message || "Erreur lors du chargement des clients.");
                    }
                } catch (error) {
                    toast.error("Erreur réseau lors du chargement des clients.");
                    console.error("Erreur GetClients:", error);
                } finally {
                    setLoadingClients(false);
                }
            };
            fetchAllClients();
        } else {
            // Réinitialiser l'état quand la modale est fermée
            setSearchQuery('');
            setSelectedClient(null);
            setClients([]);
        }
    }, [isOpen]);

    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setSearchQuery(`${client.firstName} ${client.lastName}`); // Pré-remplir le champ de recherche
    };

    const handleStartChat = async () => {
        if (!selectedClient) {
            toast.error("Veuillez sélectionner un client.");
            return;
        }
        const conversation = await startAdminClientConversation(selectedClient._id);
        if (conversation) {
            onChatInitiated(conversation);
        }
    };

    const filteredClients = clients.filter(client =>
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                Démarrer une nouvelle conversation
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    fullWidth
                    label="Rechercher un client (Nom, Prénom, Email)"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // Réinitialiser le client sélectionné si la recherche change après sélection
                        if (selectedClient && `${selectedClient.firstName} ${selectedClient.lastName}`.toLowerCase() !== e.target.value.toLowerCase()) {
                            setSelectedClient(null);
                        }
                    }}
                    sx={{ mb: 2 }}
                />

                {loadingClients ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : filteredClients.length === 0 ? (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                        Aucun client trouvé.
                    </Typography>
                ) : (
                    <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                        {filteredClients.map((client) => (
                            <ListItem
                                key={client._id}
                                button
                                onClick={() => handleSelectClient(client)}
                                selected={selectedClient?._id === client._id}
                                sx={{ py: 1 }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'secondary.light', color: 'white' }}>
                                        {client.firstName ? client.firstName[0] : ''}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${client.firstName} ${client.lastName}`}
                                    secondary={client.email}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}

                {selectedClient && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'action.selected', borderRadius: 1 }}>
                        <Typography variant="subtitle1">Client sélectionné :</Typography>
                        <Typography variant="body1">{selectedClient.firstName} {selectedClient.lastName} ({selectedClient.email})</Typography>
                    </Box>
                )}

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" disabled={isChatLoading}>Annuler</Button>
                <Button
                    onClick={handleStartChat}
                    color="primary"
                    variant="contained"
                    disabled={!selectedClient || isChatLoading}
                >
                    Démarrer le Chat
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewChatModal;