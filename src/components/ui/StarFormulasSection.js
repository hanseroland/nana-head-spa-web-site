// StarFormulasSection.js
'use client';

import React, { useEffect, useState } from 'react'; // Importez useEffect et useState
import { Box, Typography, Button, Card, CardContent, useTheme, useMediaQuery, List, ListItem, ListItemText, Chip, Divider, CircularProgress } from '@mui/material'; // Importez CircularProgress
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Utilisez 'next/navigation' pour le dossier app router
import { GetAllFormulas } from '@/apiCalls/formulas'; // Importez votre fonction API

const StarFormulasSection = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ✅ États pour stocker les formules, l'état de chargement et les erreurs
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ useEffect pour récupérer les données au montage du composant
  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        setLoading(true); // Commencer le chargement
        const response = await GetAllFormulas();
        if (response.success) {
          // Filtrer et prendre les 3 ou 4 premières formules comme "stars"
          // Vous pourriez ajouter une propriété "isStar" à vos formules dans la BDD
          // ou une logique pour choisir les plus populaires/récentes.
          // Pour l'exemple, nous prenons les 3 premières.
          setFormulas(response.data.slice(0, 3)); // Limiter à 3 pour la section "Stars"
        } else {
          setError(response.message || "Erreur lors de la récupération des formules.");
          console.error("Erreur API:", response.message);
        }
      } catch (err) {
        setError("Une erreur inattendue est survenue: " + err.message);
        console.error("Erreur inattendue:", err);
      } finally {
        setLoading(false); // Arrêter le chargement
      }
    };

    fetchFormulas();
  }, []); // Le tableau vide assure que l'effet ne s'exécute qu'une seule fois au montage

  return (
    <Box
      component="section"
      sx={{
        px: { xs: 3, md: 8 },
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        sx={{ color: theme.palette.primary.main, mb: 4, fontWeight: 600, textAlign: 'center' }}
      >
        Mes formules stars
      </Typography>

      {/* ✅ Afficher un indicateur de chargement */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Chargement des formules...</Typography>
        </Box>
      )}

      {/* ✅ Afficher un message d'erreur si une erreur est survenue */}
      {error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography variant="body1" color="error">{error}</Typography>
        </Box>
      )}

      {/* ✅ Afficher les formules si elles sont chargées et qu'il n'y a pas d'erreur */}
      {!loading && !error && formulas.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">Aucune formule star trouvée pour le moment.</Typography>
        </Box>
      )}

      {!loading && !error && formulas.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
            mb: 6,
          }}
        >
          {formulas.map((formula) => (
            <Card
              key={formula._id} // Assurez-vous d'utiliser l'ID unique de votre BDD (souvent _id pour MongoDB)
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              elevation={1}
              sx={{
                borderRadius: '2rem',
                overflow: 'hidden',
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[1],
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  {formula.title}{" "}
                  {/* Assurez-vous que votre API renvoie une propriété "etiquette" si vous l'utilisez */}
                  {formula.etiquette && (
                    <Chip
                      label={formula.etiquette}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: '#000',
                        fontWeight: 600,
                        marginTop: '0.5rem',
                      }}
                    />
                  )}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600, mt: 1 }}>
                  {formula.price} € ・ {formula.duration} min
                </Typography>

                {/* Si 'soins' est une chaîne de caractères contenant du HTML, utilisez dangerouslySetInnerHTML */}
                {/* Ou si c'est un tableau de chaînes comme dans votre exemple statique, continuez comme ça */}
                {/* J'ai laissé la version tableau, mais si c'est HTML, ajustez */}
                {Array.isArray(formula.soins) ? (
                  <List dense sx={{ pl: 0.1 }}>
                    {formula.soins.map((soin, index) => (
                      <ListItem key={index} disableGutters sx={{ py: 0.1 }}>
                        <ListItemText
                          primary={soin}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            color: theme.palette.text.secondary,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : ( // Si 'soins' est une chaîne HTML (improbable pour cette section, mais au cas où)
                  <Box
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: '0.875rem',
                    }}
                    dangerouslySetInnerHTML={{ __html: formula.soins }}
                  />
                )}

                <Divider sx={{ my: 2 }} />
                <Box display="block" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    Pourquoi on l'adore ?
                  </Typography>
                  {/* Si 'raison' est une chaîne de caractères contenant du HTML, utilisez dangerouslySetInnerHTML */}
                  {/* Sinon, un Typography suffit */}
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600, mt: 1 }}>
                    {formula.raison}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box display="flex" justifyContent="center">
        <Button
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
          onClick={() => router.push('/formules')}
        >
          Voir toutes nos formules
        </Button>
      </Box>
    </Box>
  );
};

export default StarFormulasSection;