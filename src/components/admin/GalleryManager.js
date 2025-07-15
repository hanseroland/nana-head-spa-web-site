// client/components/admin/GalleryManager.js

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Button, CircularProgress, Alert, Paper,
    IconButton, Dialog, DialogContent, CardMedia
} from '@mui/material';
import { Add, Edit as EditIcon, Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import ReusableDataGrid from '@/components/admin/common/ReusableDataGrid'; // Assurez-vous que ce chemin est correct

import {
    GetAllGalleryImages, DeleteGalleryImage
} from '@/apiCalls/gallery'; // Vos appels API (seul GetAll et Delete restent ici)

import GalleryForm from './forms/GalleryForm'; // Importe le nouveau composant de formulaire

function GalleryManager() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectionModel, setSelectionModel] = useState([]);

    // États pour le modal d'édition/ajout
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedImageForEdit, setSelectedImageForEdit] = useState(null); // Image sélectionnée pour modification

    // Fonction pour récupérer les images de la galerie
    const fetchImages = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetAllGalleryImages();
            if (response.success) {
                const formattedImages = response.data.map(img => ({
                    ...img,
                    id: img._id, // Utilise _id comme id pour DataGrid
                }));
                setImages(formattedImages);
            } else {
                setError(response.message || "Erreur lors du chargement des images de la galerie.");
            }
        } catch (err) {
            console.error("Erreur API lors du chargement de la galerie:", err);
            setError("Impossible de se connecter au serveur pour récupérer les images de la galerie.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    // Ouvre le modal d'ajout/édition
    const handleOpenFormModal = (image = null) => {
        setSelectedImageForEdit(image); // Définit l'image à éditer (null pour un ajout)
        setIsFormModalOpen(true);
    };

    // Ferme le modal et recharge les données après une soumission réussie
    const handleFormSuccess = () => {
        setIsFormModalOpen(false);
        setSelectedImageForEdit(null);
        fetchImages(); // Recharger les images après succès de la création/modification
    };

    // Gère la suppression d'une image
    const handleDeleteImage = async (imageId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette image de la galerie ? Cette action est irréversible.")) {
            setLoading(true);
            try {
                const response = await DeleteGalleryImage(imageId);
                if (response.success) {
                    alert(response.message);
                    fetchImages(); // Recharger les images après suppression
                } else {
                    setError(response.message || "Erreur lors de la suppression de l'image.");
                }
            } catch (err) {
                console.error("Erreur API lors de la suppression de l'image:", err);
                setError(err.response?.data?.message || "Impossible de supprimer l'image.");
            } finally {
                setLoading(false);
            }
        }
    };

    // Définition des colonnes pour le ReusableDataGrid
    const columns = [
        {
            field: 'image',
            headerName: 'Image',
            width: 120,
            renderCell: (params) => (
                params.row.image && params.row.image.url ? (
                    <CardMedia
                        component="img"
                        image={params.row.image.url}
                        alt={params.row.title || 'Image de galerie'}
                        sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1 }}
                    />
                ) : (
                    <ImageIcon color="action" />
                )
            ),
            sortable: false,
            filterable: false,
        },
        { field: 'title', headerName: 'Titre', width: 250 },
        { field: 'description', headerName: 'Description', flex: 1, minWidth: 250 },
        { field: 'order', headerName: 'Ordre', type: 'number', width: 100 },
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
                        title="Modifier l'image"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        aria-label="Supprimer"
                        onClick={() => handleDeleteImage(params.row._id)}
                        title="Supprimer l'image"
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
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Gestion de la Galerie Photo
            </Typography>

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenFormModal()}
                sx={{ mb: 3 }}
            >
                Ajouter une nouvelle image
            </Button>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, alignItems: 'center' }}>
                    <CircularProgress size={20} />
                    <Typography ml={1}>Chargement des images de la galerie...</Typography>
                </Box>
            )}

            {!loading && images.length === 0 && !error && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Aucune image à afficher dans la galerie pour le moment.
                </Alert>
            )}

            {!loading && images.length > 0 && (
                <Paper elevation={3} sx={{ height: 600, width: '100%' }}>
                    <ReusableDataGrid
                        rows={images}
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

            {/* Modal qui enveloppe le formulaire GalleryForm */}
            <Dialog open={isFormModalOpen} onClose={handleFormSuccess} fullWidth maxWidth="sm">
                <DialogContent>
                    <GalleryForm
                        imageData={selectedImageForEdit} // Passe les données de l'image si en mode édition
                        onClose={handleFormSuccess} // Callback pour fermer le modal et recharger les données
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default GalleryManager;