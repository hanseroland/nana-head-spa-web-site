import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Alert, CircularProgress, Paper, Chip } from '@mui/material';
import { GetAllAppointmentsForAdmin, UpdateAppointmentStatus, CancelAppointment } from '@/apiCalls/appointments';
import { format } from 'date-fns'; // Pour formater les dates
import { fr } from 'date-fns/locale'; // Pour avoir les jours/mois en français
import { Edit as EditIcon, Cancel as CancelIcon, CheckCircle as CheckCircleIcon, Block as BlockIcon } from '@mui/icons-material';
import ReusableDataGrid from '@/components/admin/common/ReusableDataGrid';
import AppointmentEditModal from '@/components/admin/AppointmentEditModal';




function RendezVous() {

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectionModel, setSelectionModel] = useState([]); // Pour gérer la sélection de lignes

    // NOUVEAUX ÉTATS pour le modal d'édition
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAppointmentForEdit, setSelectedAppointmentForEdit] = useState(null);




    // Fonction pour formater l'affichage du statut avec une puce colorée
    const getStatusChip = (status) => {
        let color;
        switch (status) {
            case 'pending':
                color = 'warning'; // Orange
                break;
            case 'confirmed':
                color = 'success'; // Vert
                break;
            case 'cancelled':
                color = 'error'; // Rouge
                break;
            case 'completed':
                color = 'primary'; // Bleu
                break;
            case 'in_progress':
                color = 'info'; // Cyan
                break;
            default:
                color = 'default';
        }
        return <Chip label={status.replace('_', ' ')} color={color} size="small" />;
    };



    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetAllAppointmentsForAdmin(); // Pas de filtres pour l'instant
            if (response.success) {
                // Ajoute un 'id' unique si ton _id n'est pas directement utilisable par DataGrid
                // ou si tu as besoin d'un 'id' numérique pour certaines opérations.
                // DataGrid utilise 'id' par défaut, sinon il faut la prop getRowId
                const formattedAppointments = response?.data.map(app => ({
                    ...app,
                    id: app._id, // Utilise _id comme id pour DataGrid
                    // Assure-toi que client et formula sont populés par ton backend
                    clientName: app.client ? `${app.client.firstName} ${app.client.lastName}` : 'N/A',
                    formulaTitle: app.formula ? app.formula.title : 'N/A',
                    adminNotes: app.adminNotes || '', // Assure-toi que adminNotes est une chaîne
                    processedBy: app.processedBy ? {
                        firstName: app.processedBy.firstName,
                        lastName: app.processedBy.lastName
                    } : null, // Ou undefined, selon comment tu préfères gérer l'absence

                }));
                setAppointments(formattedAppointments);
            } else {
                setError(response.message || "Erreur lors du chargement des rendez-vous.");
            }
        } catch (err) {
            console.error("Erreur API lors du chargement des rendez-vous admin:", err);
            setError("Impossible de se connecter au serveur pour récupérer les rendez-vous.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []); // Se déclenche une seule fois au montage du composant



    const handleStatusUpdate = async (appointmentId, newStatus) => {
        setLoading(true); // Bloque la grille pendant la mise à jour
        try {
            const response = await UpdateAppointmentStatus(appointmentId, newStatus);
            if (response.success) {
                alert(`Statut du rendez-vous mis à jour en "${newStatus}" !`);
                fetchAppointments(); // Recharger les données après la mise à jour
            } else {
                alert(`Échec de la mise à jour du statut: ${response.message}`);
            }
        } catch (err) {
            console.error("Erreur lors de la mise à jour du statut:", err);
            alert("Erreur de connexion lors de la mise à jour du statut.");
        } finally {
            setLoading(false);
        }
    };



    const handleCancelAppointment = async (appointmentId) => {
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
    };


    const handleEditClick = (appointment) => {
        setSelectedAppointmentForEdit(appointment);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedAppointmentForEdit(null);
    };

    const handleEditSuccess = () => {
        fetchAppointments(); // Recharger les données après une édition réussie
        handleEditModalClose();
    };

    const columns = [
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
    ];




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
                <Paper elevation={3} sx={{ height: 600, width: '100%' }}> {/* Donne une hauteur fixe au conteneur */}
                    <ReusableDataGrid
                        rows={appointments}
                        columns={columns}
                        loading={loading} // La prop loading du DataGrid reflète l'état de chargement
                        checkboxSelection // Active les checkboxes de sélection
                        onRowSelectionModelChange={(newSelectionModel) => {
                            setSelectionModel(newSelectionModel);
                            console.log('Lignes sélectionnées:', newSelectionModel);
                        }}
                        getRowId={(row) => row._id} // Dit à DataGrid d'utiliser _id comme ID unique
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10, page: 0 },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]} // Options de pagination
                        disableRowSelectionOnClick // Empêche la sélection au clic sur la ligne (seul le checkbox sélectionne)
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f0f0f0', // Exemple de style pour les en-têtes
                            },
                        }}
                    />
                </Paper>
            )}

            {/* Exemple d'utilisation de la sélection de lignes (par exemple, pour une action groupée) */}
            {selectionModel.length > 0 && (
                <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                    <Typography>
                        {selectionModel.length} rendez-vous sélectionné(s).
                    </Typography>
                    {/* <Button variant="contained" color="secondary" onClick={() => alert('Action groupée')}>
                    Exécuter action sur sélection
                </Button> */}
                </Box>
            )}

            {/* Rendu du modal d'édition */}
            <AppointmentEditModal
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                appointmentData={selectedAppointmentForEdit}
                onUpdateSuccess={handleEditSuccess}
            />

        </Box>
    );
}

export default RendezVous;