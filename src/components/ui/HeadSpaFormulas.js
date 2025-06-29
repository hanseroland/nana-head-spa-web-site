import React from 'react';
import { Card, CardContent, useTheme, Typography, Box, Chip, List, ListItem, ListItemText, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import ButtonLink from '../common/ButtonLink';

const formulas = [
  {
    id: 1,
    title: 'Formule : Eclat express',
    etiquette: 'Découverte',
    price: '60€',
    duration: '45 min',
    image: '/images/pexels-karolina-grabowska-4041386.jpg',
    soins: [
      '🪞 Diagnostic capillaire',
      '💆‍♀️ Massage du crâne relaxant',
      '- Brosses spécifique pour activer la circulation sanguine',
      '🌿 Huiles essentielles adaptées',
      '+ 🚿 Rinçage classique',
      '+ 🧴 2 Shampooings',
      '+ 💧 Après-shampooing',
    ],
    raison: "Une pause bien-être express qui redonne vie aux cheveux et booste l'énergie en moins d'une heure. Parfait pour les personnes pressées!"
  },
  {
    id: 2,
    title: 'Formule : Sérénité Absolue',
    etiquette: '',
    price: '80€',
    duration: '60 min',
    image: '/images/pexels-hannah-barata-776560167-27925507.jpg',
    soins: [
      '🪞 Diagnostic capillaire',
      '💆‍♀️ Massage du crâne relaxant',
      '- Brosses spécifiques pour activer la circulation sanguine',
      '🌿 Huiles essentielles adaptées',
      "🤲 Massage visage, des cervicales, jusqu'au bout des doigts",
      '🌫️ Soin vapeur drainant (cellules mortes & sébum)',
      '🚿 Rinçage sous l’arche',
      '+ 🧴 2 shampooings + après-shampooing',
    ],
    raison: "Ce soin est parfait pour celles qui souhaitent s'offrir un moment de lâcher-prise tout en revitalisant leur chevelure. Un moment suspendu qui relie relaxation et beauté!"
  },
  {
    id: 3,
    title: "Formule : Renaissance suprême",
    etiquette: '',
    price: "120€",
    duration: "1h30 min",
    image: "/images/pexels-elly-fairytale-3865560.jpg",
    soins: [
      '🪞 Diagnostic capillaire',
      '💆‍♀️ Massage du crâne relaxant',
      '- Brosses spécifiques pour activer la circulation sanguine',
      '🌿 Huiles essentielles adaptées',
      "🤲 Massage visage, des cervicales, jusqu'au bout des doigts",
      '🌫️ Soin vapeur drainant (cellules mortes & sébum)',
      '🚿 Rinçage sous l’arche',
      '+ 🧴 2 shampooings + après-shampooing',
    ],
    raison: 'Cette formule complète offre une parenthèse de bien-être inégalée. On en ressort avec un esprit apaisé et des cheveux resplendissants! Une expérience unique, parfaite pour un cadeau ou un moment de ressourcement total.'
  },
];

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
                {" "} -  ⏱ {formula.duration}
              </Typography>

            </Box>

            <Chip
              label={formula.price}

              sx={{

                fontWeight: 800,

              }}
            />
          </Box>
          <Box

          >
            <Box
              display={{ xs: 'block', sm: 'flex', md: 'flex' }}
              justifyContent="space-between"
              alignItems="center"
              sx={{ height: '100%' }}
            >
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

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        fontWeight="bold"
        sx={{ color: theme.palette.primary.main, mb: 4, fontWeight: 600, textAlign: 'center' }}
      >
        Mes formules stars
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
        <Grid container spacing={4} justifyContent="center">
          {formulas.map((formula) => (
            <Grid size={{ xs: 12, sm: 12, md: 12 }} key={formula.id}>
              <FormulaCard formula={formula} />
            </Grid>

          ))}
        </Grid>
      </Box>

    </Box>
  );
};

export default HeadSpaFormulas;