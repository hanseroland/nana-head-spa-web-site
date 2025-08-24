import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

/**
 * Composant DataGrid réutilisable pour afficher des données tabulaires.
 *
 * @param {Object} props - Les props passées au composant.
 * @param {Array<Object>} props.rows - Les données à afficher sous forme de lignes. Doit inclure un champ 'id' ou utiliser getRowId.
 * @param {Array<Object>} props.columns - Les définitions des colonnes du DataGrid.
 * @param {boolean} [props.loading=false] - Indique si les données sont en cours de chargement.
 * @param {Array<number>} [props.pageSizeOptions=[5, 10, 25, 50, 100]] - Options pour le nombre de lignes par page.
 * @param {boolean} [props.checkboxSelection=false] - Active la sélection par case à cocher pour les lignes.
 * @param {function} [props.onRowSelectionModelChange] - Callback appelé quand la sélection de ligne change.
 * @param {function} [props.getRowId] - Fonction pour obtenir l'ID unique de chaque ligne (par défaut row => row._id).
 * @param {number|string} [props.height='400px'] - Hauteur du DataGrid.
 * @param {boolean} [props.autoHeight=false] - Si vrai, le DataGrid ajuste sa hauteur automatiquement.
 * @param {Object} [props.sx] - Styles personnalisés à appliquer au composant DataGrid via la prop sx de MUI.
 * @param {Object} [props.initialState] - État initial du DataGrid (pagination, tri, etc.).
 * @param {boolean} [props.disableRowSelectionOnClick=true] - Désactive la sélection de ligne au clic sur la ligne.
 * @param {string} [props.noRowsMessage="Aucune donnée disponible."] - Message affiché si aucune ligne n'est présente.
 * @param {string} [props.density='standard'] - Densité des lignes ('compact', 'standard', 'comfortable').
 */
const ReusableDataGrid = ({
    rows,
    columns,
    loading = false,
    pageSizeOptions = [5, 10, 25, 50, 100],
    checkboxSelection = false,
    onRowSelectionModelChange,
    getRowId = (row) => row._id, // Par défaut, utilise _id pour l'ID de ligne
    height = '600px', // Hauteur par défaut
    autoHeight = false,
    sx,
    initialState,
    disableRowSelectionOnClick = true, // Plus sûr pour ne pas sélectionner au simple clic
    noRowsMessage = "Aucune donnée disponible.",
    density = 'standard',
    ...otherProps // Pour passer d'autres props directement à DataGrid
}) => {
    if (!rows || !columns) {
        console.error("ReusableDataGrid: 'rows' and 'columns' props are required.");
        return <Typography color="error">Erreur: Les props 'rows' et 'columns' sont requises pour DataGrid.</Typography>;
    }

    // Si autoHeight est vrai, nous devons gérer la hauteur différemment.
    // MUI X DataGrid n'a pas une prop 'autoHeight' directe qui fonctionne sans une hauteur fixe.
    // Pour simuler l'autoHeight, on peut définir une minHeight et laisser le Box s'adapter.
    const containerStyle = autoHeight ? { minHeight: height, width: '100%' } : { height, width: '100%' };

    return (
        <Box sx={{ ...containerStyle, ...sx }}>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                pageSizeOptions={pageSizeOptions}
                checkboxSelection={checkboxSelection}
                onRowSelectionModelChange={onRowSelectionModelChange}
                getRowId={getRowId}
                // Pour gérer l'autoHeight, on ne passe pas de height fixe au DataGrid
                // mais on laisse le container Box gérer la hauteur.
                // DataGrid interne ajuste sa propre hauteur basée sur le container.
                initialState={initialState}
                disableRowSelectionOnClick={disableRowSelectionOnClick}
                density={density}
                localeText={{
                    noRowsLabel: noRowsMessage,
                    // Personnalise d'autres textes si besoin (ex: pagination)
                    MuiTablePagination: {
                        labelRowsPerPage: 'Lignes par page :',
                        labelDisplayedRows: ({ from, to, count }) =>
                            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`,
                    },
                    // ... d'autres personnalisations de texte si nécessaire
                }}
                {...otherProps} // Passe toutes les autres props à DataGrid
            />
        </Box>
    );
};

export default ReusableDataGrid;