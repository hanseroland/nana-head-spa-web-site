// client/components/FormulaCard.js

import React from 'react';
import { motion } from 'framer-motion';
import {
    Card,
    CardActions,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
    useTheme,
    Chip,
    Button,
    Box
} from '@mui/material';

function FormulaCard({ formula, onEditClick, onDeleteClick }) { // Ajouté onDeleteClick

    const theme = useTheme();

    if (!formula) {
        return null;
    }

    return (
        <div>
            <Card
                component={motion.div}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                elevation={1}
                sx={{
                    borderRadius: '2rem',
                    overflow: 'hidden',
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[1],
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '400px',
                    height: '100%',
                }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {formula.title}{" "}
                        {formula.etiquette && (
                            <Chip
                                label={formula.etiquette}
                                sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    color: '#000',
                                    fontWeight: 600,
                                    marginTop: '0.5rem',
                                    ml: 1,
                                }}
                            />
                        )}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600, mt: 1 }}>
                        {formula.price} €  ・ {formula.duration} min
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {formula.soins && formula.soins.length > 0 && (
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
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Box display="block" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            Pourquoi on l'adore ?
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600, mt: 1 }}>
                            {formula.raison}
                        </Typography>
                    </Box>
                </CardContent>

                <CardActions sx={{ mt: 'auto', p: 2, display: 'flex', justifyContent: 'space-between' }}> {/* Ajouté justifyContent */}
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        // Appelle la fonction onEditClick avec l'ID de la formule
                        onClick={() => onEditClick(formula._id)}
                        sx={{ textTransform: 'none', fontSize: 14 }}
                    >
                        Modifier
                    </Button>
                    <Button
                        variant="outlined" // Généralement 'outlined' pour supprimer, moins intrusif
                        color="error" // Couleur rouge pour supprimer
                        size="small"
                        // Appelle la fonction onDeleteClick avec l'ID de la formule
                        onClick={() => onDeleteClick(formula._id)}
                        sx={{ textTransform: 'none', fontSize: 14 }}
                    >
                        Supprimer
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}

export default FormulaCard;