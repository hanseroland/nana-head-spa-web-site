import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Alert, CircularProgress, Paper, Chip } from '@mui/material';
import { GetAllUsers, DeleteUser } from '@/apiCalls/users';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit as EditIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import UserForm from '@/components/admin/forms/UserForm';
import ReusableDataGrid from '@/components/admin/common/ReusableDataGrid';
import HeaderFeature from '@/components/admin/common/HeaderFeature';

function Users() {


    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectionModel, setSelectionModel] = useState([]); // Pour gérer la sélection de lignes

    // États pour le modal d'ajout/édition
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState(null); // Null pour l'ajout, objet pour l'édition

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetAllUsers();
            if (response.success) {
                // S'assurer que les données sont un tableau avant de mapper
                const rawUsers = Array.isArray(response.data) ? response.data : [];
                const formattedUsers = rawUsers.map(user => ({
                    ...user,
                    id: user._id, // Utilise _id comme id pour DataGrid
                    // Pas de conversion complexe ici car les champs sont simples
                }));
                setUsers(formattedUsers);
            } else {
                setError(response.message || "Erreur lors du chargement des utilisateurs.");
                setUsers([]);
            }
        } catch (err) {
            console.error("Erreur API lors du chargement des utilisateurs:", err);
            setError("Impossible de se connecter au serveur pour récupérer les utilisateurs.");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Gérer l'ouverture du modal en mode ajout
    const handleAddUserClick = () => {
        setSelectedUserForEdit(null); // Important pour passer en mode ajout
        setIsFormModalOpen(true);
    };

    // Gérer l'ouverture du modal en mode édition
    const handleEditUserClick = (user) => {
        // Avant d'ouvrir en mode édition, vérifie le rôle
        if (user.role !== 'admin') {
            alert('Vous ne pouvez modifier que les utilisateurs avec le rôle "admin".');
            return;
        }
        setSelectedUserForEdit(user);
        setIsFormModalOpen(true);
    };

    // Gérer la fermeture du modal de formulaire
    const handleFormModalClose = () => {
        setIsFormModalOpen(false);
        setSelectedUserForEdit(null); // Réinitialise l'utilisateur sélectionné
    };

    // Gérer la suppression d'un utilisateur
    const handleDeleteUser = async (userId, userRole) => {
        if (userRole !== 'admin') {
            alert('Vous ne pouvez supprimer que les utilisateurs avec le rôle "admin".');
            return;
        }
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            setLoading(true); // Optionnel: pour bloquer la grille
            try {
                const response = await DeleteUser(userId);
                if (response.success) {
                    alert(response.message);
                    fetchUsers(); // Recharger les utilisateurs après suppression
                } else {
                    alert(`Échec de la suppression: ${response.message}`);
                }
            } catch (err) {
                console.error("Erreur lors de la suppression de l'utilisateur:", err);
                alert("Erreur de connexion lors de la suppression de l'utilisateur.");
            } finally {
                setLoading(false);
            }
        }
    };

    // Callback de succès après l'ajout/modification dans le modal
    const handleSaveSuccess = () => {
        fetchUsers(); // Recharger la liste après un ajout ou une modification réussie
        handleFormModalClose(); // Fermer le modal
    };


    const columns = [
        { field: 'firstName', headerName: 'Prénom', width: 150 },
        { field: 'lastName', headerName: 'Nom', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Téléphone', width: 150 },
        {
            field: 'role',
            headerName: 'Rôle',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'admin' ? 'secondary' : 'default'} // Style les admins différemment
                    size="small"
                />
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Date d\'inscription',
            width: 180,
            renderCell: (params) => format(new Date(params.value), 'dd/MM/yyyy HH:mm', { locale: fr }),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        color="primary"
                        aria-label="Éditer"
                        onClick={() => handleEditUserClick(params.row)}
                        title="Modifier l'utilisateur"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        aria-label="Supprimer"
                        onClick={() => handleDeleteUser(params.row._id, params.row.role)} // Passe le rôle pour la vérif
                        title="Supprimer l'utilisateur"
                        disabled={params.row.role !== 'admin'} // Désactive le bouton pour les clients
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
        },
    ];

    return (
        <Box sx={{ p: 3 }}>

            <HeaderFeature
                headerTitle="Gestion des Utilisateurs"
                buttonTitle="Ajouter un nouvel utilisateur"
                onAdd={handleAddUserClick} // L'action pour le bouton "Nouvel article"
            />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, alignItems: 'center' }}>
                    <CircularProgress size={20} />
                    <Typography ml={1}>Chargement des utilisateurs...</Typography>
                </Box>
            )}

            {!loading && users.length === 0 && !error && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Aucun utilisateur à afficher pour le moment.
                </Alert>
            )}

            {!loading && users.length > 0 && (
                <Paper elevation={3} sx={{ height: 600, width: '100%' }}>
                    <ReusableDataGrid
                        rows={users}
                        columns={columns}
                        loading={loading}
                        checkboxSelection
                        onRowSelectionModelChange={(newSelectionModel) => {
                            setSelectionModel(newSelectionModel);
                            console.log('Lignes sélectionnées:', newSelectionModel);
                        }}
                        getRowId={(row) => row._id}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10, page: 0 },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        disableRowSelectionOnClick
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f0f0f0',
                            },
                        }}
                    />
                </Paper>
            )}

            {/* Modal de formulaire pour ajouter/modifier un utilisateur */}
            <UserForm
                isOpen={isFormModalOpen}
                onClose={handleFormModalClose}
                userData={selectedUserForEdit} // Null pour l'ajout, objet pour l'édition
                onSaveSuccess={handleSaveSuccess}
            />
        </Box>
    );
}

export default Users;