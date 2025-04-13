import React from "react";
import { Box, FormControl, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function SearchBar({onSearch}) {

    const handleChange = (e) => {
        onSearch(e.target.value);
      };
  return (
    <Box >
      <FormControl sx={{ width: { xs: "100%", md: "25ch" } }} variant="outlined">
        <OutlinedInput
          size="small"
          id="search"
          placeholder="Rechercher…"
          onChange={handleChange}
          startAdornment={
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" />
            </InputAdornment>
          }
          inputProps={{
            "aria-label": "search",
          }}
        />
      </FormControl>
    </Box>
  );
}