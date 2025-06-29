import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Stack,
    Alert,
    CircularProgress,
} from '@mui/material';
import { UpdateAppointmentDetails } from '@/apiCalls/appointments';
import { GetAllFormulas } from '@/apiCalls/formulas';
import { format } from 'date-fns';
import DialogModal from '../common/DialogModal';

const AppointmentEditModal = ({ isOpen, onClose, appointmentData, onUpdateSuccess }) => {
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
        if (isOpen && appointmentData) {
            setError(null);
            setLoadingUpdate(false);

            setFormData({
                date: appointmentData.date ? format(new Date(appointmentData.date), 'yyyy-MM-dd') : '',
                startTime: appointmentData.startTime || '',
                endTime: appointmentData.endTime || '',
                formulaId: appointmentData.formula ? appointmentData.formula._id : '',
                status: appointmentData.status || '',
                adminNotes: appointmentData.adminNotes || '',
                cancellationReason: appointmentData.cancellationReason || '',
            });

            const fetchFormulas = async () => {
                setLoadingFormulas(true);
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
    }, [isOpen, appointmentData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setError(null);
        setLoadingUpdate(true);


        if (!formData.date || !formData.startTime || !formData.endTime || !formData.formulaId || !formData.status) {
            setError("Veuillez remplir tous les champs obligatoires (Date, Heure de début, Heure de fin, Formule, Statut).");
            setLoadingUpdate(false);
            return;
        }

        console.log("appoint data ", appointmentData)
        try {
            const response = await UpdateAppointmentDetails(appointmentData._id, formData);
            if (response?.success) {
                alert('Rendez-vous mis à jour avec succès !');
                onUpdateSuccess();
                onClose();
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

    // Le formulaire d'édition que tu passeras à DialogModal
    const editFormContent = (
        <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={loadingUpdate}
            />
            <TextField
                label="Heure de début"
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }} // 5 minute intervals
                disabled={loadingUpdate}
            />
            <TextField
                label="Heure de fin"
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                disabled={loadingUpdate}
            />

            <FormControl fullWidth disabled={loadingUpdate}>
                <InputLabel>Formule de soin</InputLabel>
                <Select
                    name="formulaId"
                    value={formData.formulaId}
                    label="Formule de soin"
                    onChange={handleChange}
                >
                    <MenuItem value="">
                        <em>Sélectionner une formule</em>
                    </MenuItem>
                    {formulas.map((formula) => (
                        <MenuItem key={formula._id} value={formula._id}>
                            {formula.title} - {formula.duration} min ({formula.price}€)
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth disabled={loadingUpdate}>
                <InputLabel>Statut</InputLabel>
                <Select
                    name="status"
                    value={formData.status}
                    label="Statut"
                    onChange={handleChange}
                >
                    <MenuItem value="pending">En attente</MenuItem>
                    <MenuItem value="confirmed">Confirmé</MenuItem>
                    <MenuItem value="in_progress">En cours</MenuItem>
                    <MenuItem value="completed">Terminé</MenuItem>
                    <MenuItem value="cancelled">Annulé</MenuItem>
                </Select>
            </FormControl>

            <TextField
                label="Notes Administrateur"
                name="adminNotes"
                value={formData.adminNotes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                disabled={loadingUpdate}
                placeholder="Ajouter des notes internes sur ce rendez-vous..."
            />

            {formData.status === 'cancelled' && (
                <TextField
                    label="Motif d'annulation"
                    name="cancellationReason"
                    value={formData.cancellationReason}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={2}
                    disabled={loadingUpdate}
                    placeholder="Indiquer la raison de l'annulation..."
                />
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loadingUpdate}
                >
                    {loadingUpdate ? <CircularProgress size={24} color="inherit" /> : 'Enregistrer les modifications'}
                </Button>
                <Button
                    variant="outlined"
                    onClick={onClose} // Utilise onClose ici pour fermer le modal via DialogModal
                    disabled={loadingUpdate}
                >
                    Annuler
                </Button>
            </Stack>
        </Stack>
    );

    return (
        <DialogModal
            openModal={isOpen}
            setOpenModal={onClose} // Passe la fonction onClose directement à setOpenModal
            title={`Modifier le Rendez-vous : ${appointmentData?.clientName || ''} - ${appointmentData?.date ? format(new Date(appointmentData.date), 'dd/MM/yyyy') : ''}`}
            form={loadingFormulas ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, alignItems: 'center' }}>
                    <CircularProgress size={20} />
                    <Typography ml={1}>Chargement des formules...</Typography>
                </Box>
            ) : editFormContent} // Passe le contenu du formulaire ou le spinner si formules en chargement
        />
    );
};

export default AppointmentEditModal;