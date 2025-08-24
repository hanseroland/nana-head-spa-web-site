import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton,
    TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, styled
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { format } from 'date-fns';
import { GetAllFormulas } from '@/apiCalls/formulas';
import { UpdateAppointmentDetails } from '@/apiCalls/appointments';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function AppointmentEditModal({ open, onClose, appointment, onEditSuccess }) {
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        formulaId: '',
        status: '',
        adminNotes: '',
        cancellationReason: '',
    });
    const [formulas, setFormulas] = useState([]);
    const [loadingFormulas, setLoadingFormulas] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open && appointment) {
            setFormData({
                date: appointment.date ? format(new Date(appointment.date), 'yyyy-MM-dd') : '',
                startTime: appointment.startTime || '',
                endTime: appointment.endTime || '',
                formulaId: appointment.formula ? appointment.formula._id : '',
                status: appointment.status || '',
                adminNotes: appointment.adminNotes || '',
                cancellationReason: appointment.cancellationReason || '',
            });

            const fetchFormulas = async () => {
                setLoadingFormulas(true);
                setError(null);
                try {
                    const response = await GetAllFormulas();
                    if (response.success) {
                        setFormulas(response.data);
                    } else {
                        setError(response.message || "Erreur lors du chargement des formules.");
                    }
                } catch (err) {
                    console.error("Erreur API lors du chargement des formules:", err);
                    setError("Impossible de se connecter au serveur pour récupérer les formules.");
                } finally {
                    setLoadingFormulas(false);
                }
            };
            fetchFormulas();
        }
    }, [open, appointment]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async () => {
        setError(null);
        setLoadingUpdate(true);
        if (!formData.date || !formData.startTime || !formData.endTime || !formData.formulaId || !formData.status) {
            setError("Veuillez remplir tous les champs obligatoires.");
            setLoadingUpdate(false);
            return;
        }
        try {
            const response = await UpdateAppointmentDetails(appointment._id, formData);
            if (response?.success) {
                onEditSuccess(); // Appelle la fonction de succès passée en prop
            } else {
                setError(response.message || "Échec de la mise à jour du rendez-vous.");
            }
        } catch (err) {
            console.error("Erreur lors de la mise à jour du rendez-vous (API) :", err);
            setError('Erreur de connexion au serveur lors de la mise à jour. Veuillez réessayer.');
        } finally {
            setLoadingUpdate(false);
        }
    };

    return (
        <BootstrapDialog
            open={open}
            onClose={onClose}
            aria-labelledby="edit-appointment-dialog-title"
            maxWidth="md"
            fullWidth={true}
            keepMounted
        >
            <DialogTitle id="edit-appointment-dialog-title">
                {`Modifier le Rendez-vous : ${appointment?.clientName || ''} - ${appointment?.date ? format(new Date(appointment.date), 'dd/MM/yyyy') : ''}`}
            </DialogTitle>
            <IconButton aria-label="close" onClick={onClose} sx={(theme) => ({
                position: 'absolute', right: 8, top: 8, backgroundColor: "#ffff", color: theme.palette.grey[500],
            })}>
                <Close />
            </IconButton>
            <DialogContent>
                {error && <Alert severity="error">{error}</Alert>}
                {loadingFormulas ? (
                    <CircularProgress size={24} />
                ) : (
                    <>
                        {/* Les champs du formulaire */}
                        <TextField
                            label="Date" type="date" name="date" value={formData.date} onChange={handleChange} fullWidth disabled={loadingUpdate} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Heure de début" type="time" name="startTime" value={formData.startTime} onChange={handleChange} fullWidth disabled={loadingUpdate} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Heure de fin" type="time" name="endTime" value={formData.endTime} onChange={handleChange} fullWidth disabled={loadingUpdate} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth disabled={loadingUpdate} sx={{ mb: 2 }}>
                            <InputLabel>Formule de soin</InputLabel>
                            <Select name="formulaId" value={formData.formulaId} label="Formule de soin" onChange={handleChange}>
                                <MenuItem value=""><em>Sélectionner une formule</em></MenuItem>
                                {formulas.map((formula) => (
                                    <MenuItem key={formula._id} value={formula._id}>
                                        {formula.title} - {formula.duration} min ({formula.price}€)
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth disabled={loadingUpdate} sx={{ mb: 2 }}>
                            <InputLabel>Statut</InputLabel>
                            <Select name="status" value={formData.status} label="Statut" onChange={handleChange}>
                                <MenuItem value="pending">En attente</MenuItem>
                                <MenuItem value="confirmed">Confirmé</MenuItem>
                                <MenuItem value="in_progress">En cours</MenuItem>
                                <MenuItem value="completed">Terminé</MenuItem>
                                <MenuItem value="cancelled">Annulé</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Notes Administrateur" name="adminNotes" value={formData.adminNotes} onChange={handleChange} fullWidth multiline rows={3} disabled={loadingUpdate} sx={{ mb: 2 }}
                            placeholder="Ajouter des notes internes sur ce rendez-vous..."
                        />
                        {formData.status === 'cancelled' && (
                            <TextField
                                label="Motif d'annulation" name="cancellationReason" value={formData.cancellationReason} onChange={handleChange} fullWidth multiline rows={2} disabled={loadingUpdate}
                                placeholder="Indiquer la raison de l'annulation..."
                            />
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} disabled={loadingUpdate}>
                    {loadingUpdate ? <CircularProgress size={24} color="inherit" /> : 'Enregistrer les modifications'}
                </Button>
                <Button onClick={onClose} disabled={loadingUpdate} autoFocus>
                    Annuler
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default AppointmentEditModal;