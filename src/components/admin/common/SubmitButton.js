import React from 'react'
import { Button, useTheme } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'


function SubmitButton({ loading, title }) {

    const theme = useTheme();

    return (
        <div>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        color: 'primary.main'
                    },
                }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : title || 'Envoyer'}
            </Button>
        </div>
    )
}

export default SubmitButton