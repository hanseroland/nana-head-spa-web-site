import Head from "next/head";
import ReusableHero from "@/components/ui/ReusableHero";
import { Box, Container, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { BookingContext, BookingProvider } from '@/context/BookingContext';
import BookingCalendar from "@/components/ui/BookingCalendar";
import BookingModal from "@/components/ui/BookingModal"; // 👈 Importe BookingModal
import { motion } from "framer-motion";


const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const ReservationPage = () => {

  const [isModalOpen, setIsModalOpen] = useState(false); // État pour contrôler l'ouverture de la modale
  const [selectedDate, setSelectedDate] = useState(null); // État pour stocker la date sélectionnée
  const { bookings } = useContext(BookingContext); // 👈 Utilise useContext pour accéder à bookings

  const theme = useTheme();


  // Fonction pour ouvrir la modale et stocker la date sélectionnée
  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  // Fonction pour fermer la modale
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <>
      <Head>
        <title> Reservation | NANA HEAD SPA </title>
        <meta name="description" content="Découvrez nos spa head pour le bien-être et la relaxation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ReusableHero
        image="/images/pexels-arina-krasnikova-6663572.jpg"
        title={"Réservez votre moment de détente"}
        subtitle={"Choisissez votre soin et réservez en ligne pour profiter d'une expérience de bien-être unique."}
      />

      <Container maxWidth="lg">
        <Box
          component="section"
          sx={{
            px: { xs: 3, md: 8 },
            py: { xs: 6, md: 10 },
            backgroundColor: theme.palette.background.default,
            textAlign: "center",
          }}
        >

          <MotionTypography
            variant="h3"
            fontFamily="Poppins"
            fontWeight="bold"
            color={theme.palette.primary.main}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            mb={6}
          >
            Réservation dès maintenant votre séance
          </MotionTypography>

          <Typography variant="h6" align="center"> Choisissez une date dans le calendrier ci-dessous </Typography>
          <BookingCalendar onDateClick={handleDateClick} /> {/* 👈 Passe la fonction handleDateClick au calendrier */}

          {/* 👈 Affiche la modale conditionnellement */}
          <BookingModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            selectedDate={selectedDate}
          />
          {/* 👈 Affichage des réservations */}
          {/*  <Typography variant="h4" mt={4}>Réservations Actuelles :</Typography> */}
          {/*  {bookings.length > 0 ? (
            <List>
              {bookings.map((booking, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={booking.title}
                    secondary={`Le ${new Date(booking.start).toLocaleDateString()} à ${new Date(booking.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - Fin à ${new Date(booking.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>Aucune réservation pour le moment.</Typography>
          )} */}
        </Box>
      </Container>
    </>
  );
};

// 👇 Emballe la page dans le BookingProvider
const Reservations = () => (
  <BookingProvider>
    <ReservationPage />
  </BookingProvider>
);

export default Reservations;