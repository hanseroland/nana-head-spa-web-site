import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';

const userTestimonials = [
    {
      avatar: <Avatar alt="Sophie Morel" src="/images/avatar/person_110935.png" />,
      name: 'Sophie Morel',
      occupation: 'Professeure de yoga',
      testimonial:
        "Un vrai moment d’évasion. Dès mon arrivée, j’ai été accueillie avec douceur. Le rituel de soin capillaire accompagné du massage crânien a libéré toutes mes tensions.",
    },
    {
      avatar: <Avatar alt="Claire Dubois" src="/images/avatar/person_110935.png" />,
      name: 'Claire Dubois',
      occupation: 'Architecte d’intérieur',
      testimonial:
        "Le head spa est devenu mon rendez-vous mensuel. L’ambiance est si apaisante, et les praticiennes sont aux petits soins. Je ressors chaque fois rechargée en énergie.",
    },
    {
      avatar: <Avatar alt="Léa Garnier" src="/images/avatar/person_110935.png" />,
      name: 'Léa Garnier',
      occupation: 'Chargée de communication',
      testimonial:
        "Entre les huiles naturelles, les massages et l’aromathérapie, c’est une vraie bulle de douceur. Mon cuir chevelu respire, et moi aussi !",
    },
    {
      avatar: <Avatar alt="Nina Rousseau" src="/images/avatar/person_110935.png" />,
      name: 'Nina Rousseau',
      occupation: 'Chef pâtissière',
      testimonial:
        "Une expérience sensorielle unique. Les sons relaxants, les senteurs délicates et les gestes précis m’ont profondément détendue.",
    },
    {
      avatar: <Avatar alt="Camille Lefèvre" src="/images/avatar/person_110935.png" />,
      name: 'Camille Lefèvre',
      occupation: 'Consultante RH',
      testimonial:
        "Mon cuir chevelu était irrité et mes longueurs ternes — aujourd’hui, mes cheveux sont revitalisés, et moi aussi ! Merci pour cette bulle de bien-être.",
    },
    {
      avatar: <Avatar alt="Émilie Laurent" src="/images/avatar/person_110935.png" />,
      name: 'Émilie Laurent',
      occupation: 'Coach de vie',
      testimonial:
        "On entre fatiguée, stressée… et on ressort légère, rayonnante. Le diagnostic personnalisé a transformé ma chevelure. Une renaissance !",
    },
  ];

const whiteLogos = [
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628e8573c43893fe0ace_Sydney-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d520d0517ae8e8ddf13_Bern-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f46794c159024c1af6d44_Montreal-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e891fa22f89efd7477a_TerraLight.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a09d1f6337b1dfed14ab_colorado-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5caa77bf7d69fb78792e_Ankara-white.svg',
];

const darkLogos = [
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628889c3bdf1129952dc_Sydney-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d4d8b829a89976a419c_Bern-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f467502f091ccb929529d_Montreal-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e911fa22f2203d7514c_TerraDark.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a0990f3717787fd49245_colorado-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5ca4e548b0deb1041c33_Ankara-black.svg',
];

const logoStyle = {
  width: '64px',
  opacity: 0.3,
};

export default function Testimonials() {
    const theme = useTheme();
    const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos;
  
    return (
      <Container
        id="testimonials"
        sx={{
          pt: { xs: 4, sm: 12 },
          pb: { xs: 8, sm: 16 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { xs: 'center', md: 'center' },
          }}
        >
          <Typography
            component="h2"
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              fontFamily: 'Poppins',
            }}
          >
            Témoignages
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.primary,
              fontFamily: 'Poppins',
            }}
          >
            Découvrez pourquoi nos clientes adorent notre expérience head spa.
            Relaxation, douceur et résultats sont au rendez-vous.
          </Typography>
        </Box>
  
        <Grid container spacing={4}>
          {userTestimonials.map((testimonial, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index} sx={{ display: 'flex' }}>
              <Card
                elevation={1}
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '2rem',
                  boxShadow: theme.shadows[1],
                  px: 2,
                  py: 3,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontStyle: 'italic',
                      fontFamily: 'Poppins',
                    }}
                  >
                    {testimonial.testimonial}
                  </Typography>
                </CardContent>
  
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: 2,
                  }}
                >
                  <CardHeader
                    avatar={testimonial.avatar}
                    title={
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontFamily: 'Poppins',
                        }}
                      >
                        {testimonial.name}
                      </Typography>
                    }
                    subheader={
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.primary.main,
                          fontFamily: 'Poppins',
                        }}
                      >
                        {testimonial.occupation}
                      </Typography>
                    }
                    sx={{ p: 0 }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }