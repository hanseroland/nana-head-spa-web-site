import { Box, Chip, useTheme } from "@mui/material";

export default function CategoryChips({ categories, onClick, selectedCategory }) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <Chip
            key={category}
            label={category}
            clickable
            onClick={() => onClick(category)}
            sx={{
              borderRadius: "1.5rem",
              px: 2,
              fontWeight: 600,
              color: isSelected
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
              backgroundColor: isSelected
                ? theme.palette.primary.main
                : theme.palette.background.paper,
              border: isSelected ? "none" : `1px solid ${theme.palette.divider}`,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: isSelected
                  ? theme.palette.primary.dark
                  : theme.palette.action.hover,
              },
            }}
          />
        );
      })}
    </Box>
  );
}
