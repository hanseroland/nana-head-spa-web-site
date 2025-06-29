import React from 'react'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import AddButton from './AddButton'


function HeaderFeature({ headerTitle, buttonTitle, onAdd }) {
    return (

        <Box display="flex" justifyContent="space-between" mb={2}>

            <Typography variant="h5" mb={3}>
                {headerTitle}
            </Typography>
            <AddButton
                title={buttonTitle}
                onAdd={onAdd}
            />
        </Box>

    )
}

export default HeaderFeature