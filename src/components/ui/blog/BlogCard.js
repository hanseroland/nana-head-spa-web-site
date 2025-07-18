import React from "react";
import Link from 'next/link';
import { Card, CardMedia, CardContent, Typography, Box, AvatarGroup, Avatar } from "@mui/material";
import PropTypes from "prop-types";
import { styled } from '@mui/material/styles';

const SyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));

const SyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: theme.palette.text.primary, // Utilisation de la couleur primaire du thème
}));

function Author({ authors, date }) {
  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
      >
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {authors.map((author) => author.name).join(', ')}
        </Typography>
      </Box>
      <Typography variant="caption">Avril 2025</Typography>
    </Box>
  );
}

Author.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  date: PropTypes.string.isRequired,  // Date format prop
};



export default function BlogCard({ img, tag, title, description, authors, date, slug }) {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  // Fonction utilitaire pour extraire un extrait de texte
  const getExcerpt = (htmlContent, maxLength = 160) => {
    if (!htmlContent) return '';
    // ✅ Cette ligne supprime toutes les balises HTML
    const textContent = htmlContent.replace(/<[^>]*>/g, '');
    if (textContent.length > maxLength) {
      return textContent.substring(0, maxLength) + '...';
    }
    return textContent;
  };

  return (
    <Link href={`/nouveautes/${slug}`} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
      <SyledCard
        variant="outlined"
        onFocus={() => handleFocus(0)}
        onBlur={handleBlur}
        tabIndex={0}
        className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
      >
        <CardMedia
          component="img"
          alt={title}
          image={img}
          sx={{
            aspectRatio: "16 / 9",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        />
        <SyledCardContent>
          <StyledTypography variant="caption" fontWeight={600} gutterBottom>
            {tag}
          </StyledTypography>
          <StyledTypography variant="h6" gutterBottom>
            {title}
          </StyledTypography>
          <StyledTypography
            variant="body2"
            color="text.secondary"
            gutterBottom
          >
            {getExcerpt(description)}
          </StyledTypography>
        </SyledCardContent>
        {/* <Author authors={authors} date={date} />*/}
      </SyledCard>
    </Link>
  );
}

BlogCard.propTypes = {
  img: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  date: PropTypes.string.isRequired,  // Date prop type
  slug: PropTypes.string.isRequired, // C'est déjà bien ici !
};
