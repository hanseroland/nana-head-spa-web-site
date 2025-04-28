import Head from "next/head";
import ReusableHero from "@/components/ui/ReusableHero";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { BookingContext, BookingProvider } from '@/context/BookingContext';
import BookingCalendar from "@/components/ui/BookingCalendar";
import BookingModal from "@/components/ui/BookingModal"; // 👈 Importe BookingModal
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";



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

          {/* QR Code pour Instagram */}
          {/*<Box sx={{ mt: 3 }}>
            <Typography
              variant="h6"
              component="p"
              sx={{ mb: 2, fontWeight: 500 }}
            >
              Scannez pour accéder directement à notre page Instagram ✨
            </Typography>

            <Box
              sx={{
                width: 200,
                height: 200,
                mx: 'auto',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: 3,
              }}
            >
              <Image
                src="/images/instagramQR.jpeg"
                alt="QR Code Instagram Nana Head Spa"
                width={200}
                height={200}
                style={{ objectFit: 'cover' }}
              />
            </Box>
          </Box>*/}

          {/* Bouton Réserver via Instagram */}
          {/*<Box sx={{ mt: 6 }}>
            <Button
              component={Link}
              href="https://ig.me/m/nana_head_spa"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                borderRadius: '2rem',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  color: 'primary.main'
                },
              }}
            >
              Réserver sur Instagram
            </Button>
          </Box>*/}
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