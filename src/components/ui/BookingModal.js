'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Stack,
  useTheme,
  Alert,
  CircularProgress,
} from '@mui/material';
import { GetAllFormulas } from '@/apiCalls/formulas';
import { CreateAppointment } from '@/apiCalls/appointments';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh', // Ajout pour gérer le contenu plus grand
  overflowY: 'auto', // Ajout pour le défilement
};

const BookingModal = ({ isOpen, onClose, selectedDate }) => {
  const theme = useTheme();

  // On utilise un seul état pour l'ID de la formule sélectionnée
  const [selectedFormulaId, setSelectedFormulaId] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formulas, setFormulas] = useState([]); // État pour stocker les formules récupérées du backend
  const [loadingFormulas, setLoadingFormulas] = useState(true); // État de chargement des formules
  const [formulaError, setFormulaError] = useState(null); // État d'erreur pour la récupération des formules

  const [loadingBooking, setLoadingBooking] = useState(false); // État de chargement pour la réservation
  const [bookingError, setBookingError] = useState(null); // État d'erreur pour la réservation

  // ✅ Définir les heures de réservation fixes
  const availableTimes = ['10:00', '14:00', '16:00', '18:00'];

  // Helper pour calculer l'heure de fin (plus besoin de parsing de string, car duration est un Number)
  const calculateEndTime = (startTimeStr, durationMinutes) => {
    const [startHour, startMinute] = startTimeStr.split(':').map(Number);
    let totalMinutes = startHour * 60 + startMinute + durationMinutes;

    let endHour = Math.floor(totalMinutes / 60);
    let endMinute = totalMinutes % 60;

    // Gérer le cas où l'heure dépasse 23:59 (simple wrap-around)
    endHour = endHour % 24;

    return `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
  };

  // Récupère les formules depuis le backend quand la modale s'ouvre
  useEffect(() => {
    if (isOpen) {
      // Réinitialise les états quand le modal s'ouvre pour une nouvelle réservation
      setSelectedFormulaId('');
      setSelectedTime('');
      setBookingError(null);
      setFormulaError(null);

      const fetchFormulas = async () => {
        setLoadingFormulas(true);
        try {
          const response = await GetAllFormulas();
          if (response.success) {
            setFormulas(response.data);
          } else {
            setFormulaError(response.message || "Erreur lors du chargement des formules.");
          }
        } catch (err) {
          console.error("Erreur API lors du chargement des formules :", err);
          setFormulaError("Impossible de se connecter au serveur pour récupérer les formules.");
        } finally {
          setLoadingFormulas(false);
        }
      };
      fetchFormulas();
    }
  }, [isOpen]); // Déclenche l'effet quand `isOpen` change

  // La fonction de changement de formule doit maintenant utiliser setSelectedFormulaId
  const handleFormulaChange = (event) => {
    setSelectedFormulaId(event.target.value); // <-- Correction ici
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleBooking = async () => {
    setBookingError(null);

    if (!selectedFormulaId || !selectedTime || !selectedDate) {
      setBookingError('Veuillez sélectionner une formule et une heure.');
      return;
    }

    // Trouver la formule sélectionnée basée sur son ID
    const formula = formulas.find(f => f._id === selectedFormulaId);
    if (!formula) {
      setBookingError('Formule sélectionnée invalide.');
      return;
    }

    // `formula.duration` est maintenant un nombre (en minutes)
    const endTimeCalculated = calculateEndTime(selectedTime, formula.duration);

    const appointmentPayload = {
      date: selectedDate,
      startTime: selectedTime,
      endTime: endTimeCalculated,
      formulaId: formula._id,
    };

    setLoadingBooking(true);
    try {
      const response = await CreateAppointment(appointmentPayload);
      if (response.success) {
        alert('Rendez-vous pris avec succès ! Vous recevrez une confirmation.');
        onClose(); // Ferme la modale après le succès
      } else {
        setBookingError(response.message || 'Échec de la prise de rendez-vous.');
      }
    } catch (err) {
      console.error("Erreur lors de la prise de rendez-vous (API) :", err);
      setBookingError('Erreur de connexion au serveur lors de la réservation. Veuillez réessayer.');
    } finally {
      setLoadingBooking(false);
    }
  };

  // Fonction pour gérer la fermeture de la modale et réinitialiser les états
  const handleCloseModal = () => {
    setSelectedFormulaId(''); // Réinitialise l'ID de la formule sélectionnée
    setSelectedTime('');      // Réinitialise l'heure sélectionnée
    setBookingError(null);    // Réinitialise l'erreur de réservation
    setFormulaError(null);    // Réinitialise l'erreur de formule
    // Ne pas réinitialiser 'formulas' ou 'loadingFormulas' ici si tu les recharges à chaque ouverture
    onClose(); // Appel de la prop onClose
  };


  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
          Réserver une séance pour le {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'une date non définie'}
        </Typography>

        {loadingFormulas && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, alignItems: 'center' }}>
            <CircularProgress size={20} />
            <Typography ml={1}>Chargement des formules...</Typography>
          </Box>
        )}

        {formulaError && (
          <Alert severity="error" sx={{ my: 2 }}>
            {formulaError}
          </Alert>
        )}

        {!loadingFormulas && formulas.length === 0 && !formulaError && (
          <Alert severity="info" sx={{ my: 2 }}>
            Aucune formule de soin disponible pour le moment.
          </Alert>
        )}

        {!loadingFormulas && formulas.length > 0 && (
          <Stack spacing={2}>
            <FormControl fullWidth disabled={loadingBooking}>
              <InputLabel id="formula-label">Formule</InputLabel>
              <Select
                labelId="formula-label"
                id="formula"
                value={selectedFormulaId} // <-- Utilise selectedFormulaId comme valeur
                label="Formule"
                onChange={handleFormulaChange} // <-- Appelle handleFormulaChange
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


            <FormControl fullWidth disabled={loadingBooking}>
              <InputLabel id="time-label">Heure de début</InputLabel>
              <Select
                labelId="time-label"
                id="time"
                value={selectedTime}
                label="Heure de début"
                onChange={handleTimeChange}
              >
                <MenuItem value="">
                  <em>Sélectionner une heure</em>
                </MenuItem>
                {availableTimes.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>

            </FormControl>

            {bookingError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {bookingError}
              </Alert>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={handleBooking}
                disabled={!selectedFormulaId || !selectedTime || loadingBooking}
                color="primary"
                variant="contained"
                size="medium"
                sx={{
                  fontWeight: 600,
                  fontFamily: 'Poppins',
                  textTransform: 'none',
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              >
                {loadingBooking ? <CircularProgress size={24} color="inherit" /> : 'Valider la réservation'}
              </Button>
              <Button
                color="primary"
                variant="outlined"
                size="medium"
                sx={{
                  fontWeight: 600,
                  fontFamily: 'Poppins',
                  textTransform: 'none',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    color: theme.palette.primary.contrastText,
                  },
                }}
                onClick={handleCloseModal}
                disabled={loadingBooking}
              >
                Annuler
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default BookingModal;