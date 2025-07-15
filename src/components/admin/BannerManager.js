// client/components/admin/BannerManager.js

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Button, CircularProgress, Alert, Paper,
    IconButton, Dialog, DialogContent,
    CardMedia
} from '@mui/material';
import { Add, Edit as EditIcon, Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import ReusableDataGrid from '@/components/admin/common/ReusableDataGrid'; // Assurez-vous que ce chemin est correct

import {
    GetAllPageBanners, DeletePageBanner
} from '@/apiCalls/banners'; // Vos appels API (seul GetAll et Delete restent ici)

import BannerForm from './forms/BannerForm'; // Importe le nouveau composant de formulaire

function BannerManager() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectionModel, setSelectionModel] = useState([]);

    // États pour le modal d'édition/ajout
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedBannerForEdit, setSelectedBannerForEdit] = useState(null); // Bannière sélectionnée pour modification

    // Fonction pour récupérer toutes les bannières
    const fetchBanners = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetAllPageBanners();
            if (response.success) {
                const formattedBanners = response.data.map(banner => ({
                    ...banner,
                    id: banner._id, // Utilise _id comme id pour DataGrid
                    mediaUrl: banner.media?.url || '', // Assurez-vous que media est bien un objet avec une URL
                }));
                setBanners(formattedBanners);
            } else {
                setError(response.message || "Erreur lors du chargement des bannières.");
            }
        } catch (err) {
            console.error("Erreur API lors du chargement des bannières:", err);
            setError("Impossible de se connecter au serveur pour récupérer les bannières.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    // Ouvre le modal d'ajout/édition
    const handleOpenFormModal = (banner = null) => {
        setSelectedBannerForEdit(banner); // Définit la bannière à éditer (null pour un ajout)
        setIsFormModalOpen(true);
    };

    // Ferme le modal et recharge les données après une soumission réussie
    const handleFormSuccess = () => {
        setIsFormModalOpen(false);
        setSelectedBannerForEdit(null);
        fetchBanners(); // Recharger les bannières après succès de la création/modification
    };

    // Gère la suppression d'une bannière
    const handleDeleteBanner = async (bannerId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette bannière ? Cette action est irréversible.")) {
            setLoading(true);
            try {
                const response = await DeletePageBanner(bannerId);
                if (response.success) {
                    alert(response.message);
                    fetchBanners(); // Recharger les bannières après suppression
                } else {
                    setError(response.message || "Erreur lors de la suppression de la bannière.");
                }
            } catch (err) {
                console.error("Erreur API lors de la suppression de la bannière:", err);
                setError(err.response?.data?.message || "Impossible de supprimer la bannière.");
            } finally {
                setLoading(false);
            }
        }
    };

    // Définition des colonnes pour le ReusableDataGrid
    const columns = [
        {
            field: 'mediaUrl',
            headerName: 'Média',
            width: 150,
            renderCell: (params) => (
                params.row.mediaUrl ? (
                    params.row.type === 'video' ? (
                        <video controls style={{ width: '100%', height: 'auto', maxHeight: '80px', objectFit: 'cover', borderRadius: 4 }}>
                            <source src={params.row.mediaUrl} type="video/mp4" />
                            Votre navigateur ne supporte pas la balise vidéo.
                        </video>
                    ) : ( // Par défaut, ou si type est 'image'
                        <CardMedia
                            component="img"
                            image={params.row.mediaUrl}
                            alt={params.row.title || 'Bannière'}
                            sx={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 1 }}
                        />
                    )
                ) : (
                    <ImageIcon color="action" sx={{ fontSize: 40 }} />
                )
            ),
            sortable: false,
            filterable: false,
        },
        { field: 'pageName', headerName: 'Page', width: 150 },
        { field: 'type', headerName: 'Type', width: 120 },
        { field: 'title', headerName: 'Titre', width: 250 },
        { field: 'subtitle', headerName: 'Sous-titre', flex: 1, minWidth: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        color="primary"
                        aria-label="Modifier"
                        onClick={() => handleOpenFormModal(params.row)}
                        title="Modifier la bannière"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        aria-label="Supprimer"
                        onClick={() => handleDeleteBanner(params.row._id)}
                        title="Supprimer la bannière"
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
            <Typography variant="h4" component="h1" gutterBottom>
                Gestion des Bannières de Page
            </Typography>

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenFormModal()}
                sx={{ mb: 3 }}
            >
                Ajouter une nouvelle bannière
            </Button>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, alignItems: 'center' }}>
                    <CircularProgress size={20} />
                    <Typography ml={1}>Chargement des bannières...</Typography>
                </Box>
            )}

            {!loading && banners.length === 0 && !error && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Aucune bannière à afficher pour le moment.
                </Alert>
            )}

            {!loading && banners.length > 0 && (
                <Paper elevation={3} sx={{ height: 600, width: '100%' }}>
                    <ReusableDataGrid
                        rows={banners}
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

            {/* Modal qui enveloppe le formulaire BannerForm */}
            <Dialog open={isFormModalOpen} onClose={handleFormSuccess} fullWidth maxWidth="sm">
                {/* BannerForm prend en charge son propre titre */}
                <DialogContent>
                    <BannerForm
                        bannerData={selectedBannerForEdit} // Passe les données de la bannière si en mode édition
                        onClose={handleFormSuccess} // Callback pour fermer le modal et recharger les données
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default BannerManager;