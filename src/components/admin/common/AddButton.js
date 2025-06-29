import React from 'react'
import { Button } from '@mui/material'


function AddButton({ title, onAdd }) {

    return (
        <div>

            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={onAdd}
                sx={{ textTransform: 'none', fontSize: 14 }}
            >
                {title}
            </Button>
        </div>
    )
}

export default AddButton
