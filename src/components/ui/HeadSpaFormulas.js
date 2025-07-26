'use client';


import React, { useEffect, useState } from 'react'; // Importez useEffect et useState
import { Card, CardContent, useTheme, Typography, Box, Chip, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material'; // Importez CircularProgress
import { motion } from 'framer-motion';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router'; // Si vous êtes dans le dossier 'pages'
// Si vous êtes dans le dossier 'app', utilisez: import { useRouter } from 'next/navigation';
import ButtonLink from '../common/ButtonLink';
import { GetAllFormulas } from '@/apiCalls/formulas'; // Importez votre fonction API


// Le composant FormulaCard reste le même car il reçoit une 'formula' via les props
const FormulaCard = ({ formula }) => {
  const theme = useTheme();

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <Card
        elevation={0}
        sx={{
          maxWidth: "100%",
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontSize: { xs: '15px', sm: '1.5rem', md: '1.5rem' },
                }}
              >
                {formula.title} {" "}
                {
                  formula.etiquette && (
                    <Chip
                      label={formula.etiquette}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: '#000',
                        fontWeight: 600,
                        marginTop: '0.5rem',
                      }}
                    />
                  )
                }
                {" "} -  ⏱ {formula.duration} min
              </Typography>

            </Box>

            <Chip
              label={`${formula.price} €`}
              sx={{
                fontWeight: 800,
              }}
            />
          </Box>
          <Box>
            <Box
              display={{ xs: 'block', sm: 'flex', md: 'flex' }}
              justifyContent="space-between"
              alignItems="center"
              sx={{ height: '100%' }}
            >
              {/* Assurez-vous que formula.soins est un tableau. Si c'est du HTML, utilisez dangerouslySetInnerHTML */}
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
              ) : ( // Au cas où 'soins' serait du HTML brut (moins probable pour des points de formule)
                <Box dangerouslySetInnerHTML={{ __html: formula.soins }} />
              )}

              <Box
                display="flex"
                flexDirection="column"
                justifyContent={{ xs: 'flex-start', sm: 'flex-end', md: 'flex-end' }}
                alignItems="start"
                height={{ xs: '100%', sm: '200px', md: '200px' }}
              >
                <ButtonLink
                  link="/reservations"
                  title="Reserver maintenant"
                />
              </Box>
            </Box>

            <Box display="block" justifyContent="space-between" alignItems="center">
              <Typography variant="h6"
                sx={{ color: theme.palette.primary.main, mt: 4, fontWeight: 600, textAlign: 'left' }}
              >
                Pourquoi on l'adore ?
              </Typography>
              {/* Si 'raison' est du HTML, utilisez dangerouslySetInnerHTML */}
              <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 600, mt: 1 }}>
                {formula.raison}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HeadSpaFormulas = () => {
  const theme = useTheme();
  const router = useRouter();

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
          setFormulas(response.data); // Toutes les formules
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
    <Box sx={{ px: 2, py: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        fontWeight="bold"
        sx={{ color: theme.palette.primary.main, mb: 4, fontWeight: 600, textAlign: 'center' }}
      >
        Toutes les formules
      </Typography>
      <Box sx={{
        px: 2,
        py: 4,
        borderRadius: '2rem',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
      }}
      >
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
            <Typography variant="body1" color="text.secondary">Aucune formule trouvée pour le moment.</Typography>
          </Box>
        )}

        {!loading && !error && formulas.length > 0 && (
          <Grid container spacing={4} justifyContent="center">
            {formulas.map((formula) => (
              // ✅ Utilisez formula._id si c'est l'ID de votre BDD
              <Grid item xs={12} key={formula._id}> {/* Garde xs=12 pour une carte par ligne */}
                <FormulaCard formula={formula} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default HeadSpaFormulas;