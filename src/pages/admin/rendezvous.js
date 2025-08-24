import React, { useState, useCallback, useMemo } from 'react';
import { Box, Typography, IconButton, Alert, CircularProgress, Paper, Chip } from '@mui/material';
import { UpdateAppointmentStatus, CancelAppointment } from '@/apiCalls/appointments';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit as EditIcon, Cancel as CancelIcon, CheckCircle as CheckCircleIcon, Block as BlockIcon } from '@mui/icons-material';
import ReusableDataGrid from '@/components/admin/common/ReusableDataGrid';
import AppointmentEditModal from '@/components/admin/AppointmentEditModal';
import { useAppointments } from '@/components/admin/useAppointment';



function RendezVous() {
    const { appointments, loading, setLoading, error, fetchAppointments, updateAppointmentInState } = useAppointments();

    const [selectionModel, setSelectionModel] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAppointmentForEdit, setSelectedAppointmentForEdit] = useState(null);


    const getStatusChip = useCallback((status) => {
        let color;
        switch (status) {
            case 'pending': color = 'warning'; break;
            case 'confirmed': color = 'success'; break;
            case 'cancelled': color = 'error'; break;
            case 'completed': color = 'primary'; break;
            case 'in_progress': color = 'info'; break;
            default: color = 'default';
        }
        return <Chip label={status.replace('_', ' ')} color={color} size="small" />;
    }, []);

    const handleStatusUpdate = useCallback(async (appointmentId, newStatus) => {
        setLoading(true); // Bloque la grille pendant la mise à jour
        try {
            const response = await UpdateAppointmentStatus(appointmentId, newStatus);
            setAppointments((prev) =>
                prev.map((rdv) => (rdv._id === id ? { ...rdv, status: newStatus } : rdv))
            );

            setTimeout(() => setOpenModal(false), 100);
        } catch (err) {
            console.error("Erreur lors de la mise à jour du statut:", err);
            alert("Erreur de connexion lors de la mise à jour du statut.");
        } finally {
            setLoading(false);
        }
    }, [updateAppointmentInState]);

    const handleCancelAppointment = useCallback(async (appointmentId) => {
        if (window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
            setLoading(true);
            try {
                const response = await CancelAppointment(appointmentId, "Annulé par l'administrateur"); // Tu peux ajouter un motif dynamique
                if (response.success) {
                    alert('Rendez-vous annulé avec succès !');
                    fetchAppointments();
                } else {
                    alert(`Échec de l'annulation: ${response.message}`);
                }
            } catch (err) {
                console.error("Erreur lors de l'annulation du rendez-vous:", err);
                alert("Erreur de connexion lors de l'annulation du rendez-vous.");
            } finally {
                setLoading(false);
            }
        }
    }, [updateAppointmentInState]);

    const handleEditClick = useCallback((appointment) => {
        setSelectedAppointmentForEdit(appointment);
        setIsEditModalOpen(true);
    }, []);

    const handleEditModalClose = useCallback(() => {
        setIsEditModalOpen(false);
        setSelectedAppointmentForEdit(null);
    }, []);

    const handleEditSuccess = useCallback(() => {
        fetchAppointments(); // Recharger les données après une édition réussie
        handleEditModalClose();
    }, [fetchAppointments, handleEditModalClose]);

    const columns = useMemo(() => [
        {
            field: 'date',
            headerName: 'Date',
            width: 150,
            renderCell: (params) => format(new Date(params.value), 'dd/MM/yyyy', { locale: fr }),
        },
        { field: 'startTime', headerName: 'Début', width: 100 },
        { field: 'endTime', headerName: 'Fin', width: 100 },
        { field: 'clientName', headerName: 'Client', width: 200 },
        { field: 'formulaTitle', headerName: 'Formule', width: 200 },
        {
            field: 'status',
            headerName: 'Statut',
            width: 150,
            renderCell: (params) => getStatusChip(params.value), // Utilise la fonction de puce
        },
        {
            field: 'adminNotes', // NOUVELLE COLONNE pour les notes admin
            headerName: 'Notes Admin',
            width: 200,
            renderCell: (params) => params.row.adminNotes || 'Aucune',
        },
        {
            field: 'processedBy', // NOUVELLE COLONNE pour les notes admin
            headerName: 'Chargée',
            width: 200,
            renderCell: (params) => params.row.processedBy?.firstName || 'Aucune',
        },


        {
            field: 'actions',
            headerName: 'Actions',
            width: 250,
            renderCell: (params) => (
                <Box>
                    {params.row.status === 'pending' && (
                        <IconButton
                            color="success"
                            aria-label="Confirmer"
                            onClick={() => handleStatusUpdate(params.row._id, 'confirmed')}
                            title="Confirmer le rendez-vous"
                        >
                            <CheckCircleIcon />
                        </IconButton>
                    )}
                    {params.row.status !== 'cancelled' && params.row.status !== 'completed' && (
                        <IconButton
                            color="error"
                            aria-label="Annuler"
                            onClick={() => handleCancelAppointment(params.row._id)}
                            title="Annuler le rendez-vous"
                        >
                            <CancelIcon />
                        </IconButton>
                    )}
                    {/* Exemple: Bouton pour marquer comme "en cours" */}
                    {params.row.status === 'confirmed' && (
                        <IconButton
                            color="info"
                            aria-label="En cours"
                            onClick={() => handleStatusUpdate(params.row._id, 'in_progress')}
                            title="Marquer comme en cours"
                        >
                            <BlockIcon /> {/* Ou une autre icône appropriée */}
                        </IconButton>
                    )}
                    {/* Exemple: Bouton pour marquer comme "terminé" */}
                    {params.row.status === 'in_progress' && (
                        <IconButton
                            color="primary"
                            aria-label="Terminer"
                            onClick={() => handleStatusUpdate(params.row._id, 'completed')}
                            title="Marquer comme terminé"
                        >
                            <CheckCircleIcon /> {/* Ou une autre icône appropriée */}
                        </IconButton>
                    )}

                    <IconButton
                        color="primary"
                        aria-label="Éditer"
                        onClick={() => handleEditClick(params.row)}
                        title="Modifier le rendez-vous"
                    >
                        <EditIcon />
                    </IconButton>


                </Box>
            ),
            sortable: false, // Les actions ne sont généralement pas triables
            filterable: false, // Ni filtrables
            disableColumnMenu: true, // Cache le menu de colonne pour les actions
        },
    ], [handleStatusUpdate, handleCancelAppointment, handleEditClick]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Gestion des Rendez-vous
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, alignItems: 'center' }}>
                    <CircularProgress size={20} />
                    <Typography ml={1}>Chargement des rendez-vous...</Typography>
                </Box>
            )}
            {!loading && appointments.length === 0 && !error && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Aucun rendez-vous à afficher pour le moment.
                </Alert>
            )}
            {!loading && appointments.length > 0 && (
                <Paper elevation={3} sx={{ height: 600, width: '100%' }}>
                    <ReusableDataGrid
                        rows={appointments}
                        columns={columns}
                        loading={loading}
                        checkboxSelection
                        onRowSelectionModelChange={(newSelectionModel) => {
                            setSelectionModel(newSelectionModel);
                        }}
                        getRowId={(row) => row._id}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10, page: 0 } },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        disableRowSelectionOnClick
                        sx={{
                            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f0f0f0' },
                        }}
                    />
                </Paper>
            )}
            {selectionModel.length > 0 && (
                <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                    <Typography>
                        {selectionModel.length} rendez-vous sélectionné(s).
                    </Typography>
                </Box>
            )}

            {/* Le modal d'édition a été extrait dans un composant séparé */}
            {selectedAppointmentForEdit && (
                <AppointmentEditModal
                    open={isEditModalOpen}
                    onClose={handleEditModalClose}
                    appointment={selectedAppointmentForEdit}
                    onEditSuccess={handleEditSuccess}
                />
            )}
        </Box>
    );
}

export default RendezVous;