import { useState } from "react";
import Head from "next/head";
import ReusableHero from "@/components/ui/ReusableHero";
import { Alert, AlertTitle, Box, Button, CircularProgress, Container, Typography, useTheme } from "@mui/material";
import BookingCalendar from "@/components/ui/BookingCalendar";
import BookingModal from "@/components/ui/BookingModal"; // 👈 Importe BookingModal
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/router";



const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const Reservations = () => {

  const [isModalOpen, setIsModalOpen] = useState(false); // État pour contrôler l'ouverture de la modale
  const [selectedDate, setSelectedDate] = useState(null); // État pour stocker la date sélectionnée
  //const { bookings } = useContext(BookingContext); // 👈 Utilise useContext pour accéder à bookings


  // ✅ Accède à l'état de l'utilisateur via le Context
  const { currentUser, isAuthenticated, loading } = useAuth(); // Récupère isAuthenticated et loading
  const router = useRouter();
  const theme = useTheme();



  // Fonction pour ouvrir la modale et stocker la date sélectionnée
  const handleDateClick = (dateStr) => {
    // ✅ Vérifie si l'utilisateur est authentifié avant d'ouvrir la modale
    if (isAuthenticated) {
      setSelectedDate(dateStr);
      setIsModalOpen(true);
    } else {
      // Si l'utilisateur n'est pas authentifié, ne pas ouvrir la modale
      // et potentiellement afficher un message ou rediriger.
      // Le message visuel est géré dans le JSX ci-dessous.
      console.log("Veuillez vous connecter ou vous inscrire pour réserver.");
      // Optionnel : router.push('/connexion'); pour rediriger automatiquement.
    }
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
        image=""
        title={"Réservez votre moment de détente"}
        subtitle={"Choisissez votre soin et réservez en ligne pour profiter d'une expérience de bien-être unique."}
        pageName="reservations"
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
            sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Réservez dès maintenant votre séance
          </MotionTypography>

          {/* ✅ Affichage conditionnel du message d'authentification */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
              {/* Optionnel: un petit spinner pendant le chargement de l'état d'auth */}
              <CircularProgress size={60} />
              <Typography>Chargement...</Typography>
            </Box>
          ) : (
            !isAuthenticated && (
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ mb: 4 }}
              >
                <Alert
                  severity="info"
                  sx={{
                    justifyContent: 'center', // Centre le contenu horizontalement
                    alignItems: 'center',     // Centre le contenu verticalement
                    py: 2, // Plus de padding vertical
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.info.light,
                    color: theme.palette.mode === 'dark' ? theme.palette.info.light : theme.palette.info.dark,
                    '.MuiAlert-icon': {
                      color: theme.palette.mode === 'dark' ? theme.palette.info.light : theme.palette.info.dark,
                    }
                  }}
                >
                  <AlertTitle>Important</AlertTitle>
                  <Typography variant="h6">
                    Veuillez vous <Link href="/connexion" passHref style={{ color: theme.palette.primary.main, fontWeight: 'bold', textDecoration: 'none' }}>connecter</Link> ou vous <Link href="/inscription" passHref style={{ color: theme.palette.primary.main, fontWeight: 'bold', textDecoration: 'none' }}>inscrire</Link> pour réserver.
                  </Typography>
                </Alert>
              </MotionBox>
            )
          )}


          <BookingCalendar onDateClick={handleDateClick} />{/* 👈 Passe la fonction handleDateClick au calendrier */}

          {/* 👈 Affiche la modale conditionnellement */}
          <BookingModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            selectedDate={selectedDate}
          />

          {/* QR Code pour Instagram */}
          <Box sx={{ mt: 3 }}>
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
          </Box>

          {/* Bouton Réserver via Instagram */}
          <Box sx={{ mt: 6 }}>
            <Button
              component={Link}
              href="https://ig.me/m/nana_head_spa"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: '#000',
                borderRadius: '2rem',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  color: '#000'
                },
              }}
            >
              Réserver sur Instagram
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

// 👇 Emballe la page dans le BookingProvider
//const Reservations = () => (
//<BookingProvider>
//<ReservationPage />
//</BookingProvider>
//);



export default Reservations;