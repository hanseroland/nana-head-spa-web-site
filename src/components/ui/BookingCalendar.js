// Dans BookingCalendar.js
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const BookingCalendar = ({ onDateClick }) => { // 👈 Récupère la prop onDateClick

  const handleDateClick = (info) => {
    onDateClick(info.dateStr); // 👈 Appelle la fonction passée en prop avec la date sélectionnée
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      dateClick={handleDateClick}
    />
  );
};

export default BookingCalendar;