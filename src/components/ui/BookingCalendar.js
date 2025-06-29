// Dans BookingCalendar.js
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr'; // Ou '@fullcalendar/daygrid/locales/fr' si vous n'utilisez que dayGrid
import { Box } from '@mui/material'; // Pour ajouter des styles personnalisés plus facilement


const BookingCalendar = ({ onDateClick }) => { // 👈 Récupère la prop onDateClick

  const handleDateClick = (info) => {
    // Vérifier si le jour cliqué est un dimanche (getDay() retourne 0 pour dimanche)
    const clickedDate = new Date(info.dateStr);
    if (clickedDate.getDay() === 0) { // 0 = dimanche
      console.log("Les réservations ne sont pas autorisées le dimanche.");
      // Optionnel: Afficher un message à l'utilisateur (via un toast ou une alerte)
      return; // Ne pas appeler onDateClick
    }
    onDateClick(info.dateStr);
  };

  const handleDayCellDidMount = (info) => {
    // info.date.getDay() retourne 0 pour dimanche, 1 pour lundi, etc.
    if (info.date.getDay() === 0) { // Si c'est un dimanche
      info.el.style.backgroundColor = '#f0f0f0'; // Couleur de fond plus claire ou grise
      info.el.style.opacity = '0.7'; // Rendre le jour légèrement transparent
      info.el.style.cursor = 'not-allowed'; // Changer le curseur
      info.el.classList.add('fc-day-disabled'); // Ajout d'une classe pour plus de stylisation CSS
    }
  };

  // Une alternative plus directe pour empêcher la sélection : `selectAllow`
  const selectAllow = (selectInfo) => {
    const startDay = selectInfo.start.getDay();
    const endDay = selectInfo.end.getDay(); // Pour la sélection de plage, bien que vous utilisiez dayClick

    // Permettre la sélection uniquement si ce n'est pas un dimanche
    // Pour dayClick, selectInfo.start et selectInfo.end sont la même date
    return startDay !== 0; // Retourne false si c'est un dimanche (0)
  };

  return (

    // Encapsuler FullCalendar pour appliquer des styles globaux ou spécifiques aux jours désactivés
    <Box sx={{
      '.fc-day-disabled': {
        // Vous pouvez ajouter d'autres styles CSS ici pour la classe désactivée
        // par exemple, pour masquer les numéros de jour ou changer la couleur du texte
        color: '#b0b0b0',
      },
      // S'assurer que le contenu du jour est également grisé
      '.fc-day-disabled .fc-daygrid-day-number': {
        color: '#b0b0b0',
      }
    }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        locale={frLocale}
        dayCellDidMount={handleDayCellDidMount} // ✅ Appliquer le style au jour
        selectAllow={selectAllow} // ✅
      />
    </Box>
  );
};

export default BookingCalendar;