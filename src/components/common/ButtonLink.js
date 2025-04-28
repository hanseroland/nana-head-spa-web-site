'use client';

import React from 'react';
import {  Button, useTheme} from '@mui/material';
import { useRouter } from 'next/router';



const ButtonLink = ({title,link}) => {
  const theme = useTheme();
  const router = useRouter();
 

  return (
   
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
          onClick={() => router.push(`${link}`)}
        >
            {title}
        </Button>
   
 
  );
};

export default ButtonLink;
