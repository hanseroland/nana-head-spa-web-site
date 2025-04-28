import React, { useState, useContext } from 'react';
import { BookingContext } from '@/context/BookingContext';
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
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const BookingModal = ({ isOpen, onClose, selectedDate }) => {

  const theme = useTheme();

  const { addBooking } = useContext(BookingContext);
  const [selectedFormula, setSelectedFormula] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const formulas = [
    { name: 'Eclat express', duration: 45, price: 60 },
    { name: 'Sérénité Absolue', duration: 60, price: 80 },
    { name: 'Renaissance suprême', duration: 90, price: 180 }, // Durée en minutes
  ];

  const handleFormulaChange = (event) => {
    setSelectedFormula(event.target.value);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleBooking = () => {
    if (selectedFormula && selectedTime && selectedDate) {
      const formula = formulas.find(f => f.name === selectedFormula);
      if (formula) {
        // Calcul de la date et heure de fin
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const startTime = new Date(selectedDate);
        startTime.setHours(hours);
        startTime.setMinutes(minutes);

        const endTime = new Date(startTime.getTime() + formula.duration * 60000); // Ajoute la durée en millisecondes

        const newBooking = {
          title: formula.name,
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          date: selectedDate,
          time: selectedTime,
          formula: formula.name,
        };

        addBooking(newBooking);
        onClose(); // Ferme la modale après la réservation
      }
    } else {
      alert('Veuillez sélectionner une formule et une heure.');
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
          Réserver une séance pour le {new Date(selectedDate).toLocaleDateString()}
        </Typography>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="formula-label">Formule</InputLabel>
            <Select
              labelId="formula-label"
              id="formula"
              value={selectedFormula}
              label="Formule"
              onChange={handleFormulaChange}
            >
              <MenuItem value="">
                <em>Sélectionner une formule</em>
              </MenuItem>
              {formulas.map((formula) => (
                <MenuItem key={formula.name} value={formula.name}>
                  {formula.name} - {formula.duration} min ({formula.price}€)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              id="time"
              label="Heure"
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={handleBooking}
              disabled={!selectedFormula || !selectedTime}
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
                  color: 'primary.main'
                },
              }}
            >
              Valider la réservation
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
                color: 'primary.main'
              },
            }}
            onClick={onClose}
            >
              Annuler
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default BookingModal;