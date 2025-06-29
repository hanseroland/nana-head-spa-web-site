import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogModal from './DialogModal';
import { DataGrid } from '@mui/x-data-grid';

const DataTable = ({
    refreshTrigger,
    setRefreshTrigger,
    fetchData,          // Fonction pour récupérer les données
    deleteData,         // Fonction pour supprimer un élément
    columnsConfig,      // Configuration des colonnes
    editFormComponent = null,  // Composant de formulaire d'édition
    tableTitle,         // Titre pour les modals
    dataType,           // Type de données (pour les messages)
    mockData = [],     // Nouvelle prop pour les données fictives
    mockMode = false   // Nouvelle prop pour activer le mode mock
}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModalForEdit, setOpenModalForEdit] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    // Fonction pour récupérer les données
    const fetchDataList = async () => {
        setLoading(true);
        try {
            if (mockMode) {
                // Utilise les données fictives directement
                setData(mockData);
            } else {
                // Mode normal avec appel API
                const response = await fetchData();
                if (response?.success) {
                    setData(response.data);
                }
            }
        } catch (error) {
            console.error(`Erreur lors de la récupération des ${dataType}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            if (mockMode) {
                // Simulation de suppression
                setData(prev => prev.filter(item => item.id !== id));
                console.log(`${dataType} supprimé (mock)`);
                setRefreshTrigger(prev => !prev);
            } else {
                // Mode normal avec appel API
                const response = await deleteData(id);
                if (response?.success) {
                    console.log(`${dataType} supprimé`);
                    setRefreshTrigger(prev => !prev);
                }
            }
        } catch (error) {
            console.error(`Erreur lors de la suppression du ${dataType}:`, error);
        }
    };

    // Ouvrir le modal pour modifier les données
    const handleEdit = (values) => {
        setSelectedData(values.row);
        setOpenModalForEdit(true);
    };



    // Charger les données lors du montage ou du changement de refreshTrigger
    useEffect(() => {
        fetchDataList();
    }, [refreshTrigger]);

    // Colonnes avec actions par défaut
    const defaultColumns = [
        ...columnsConfig,
        {
            field: 'actions',
            headerName: 'Actions',
            width: 170,
            renderCell: (params) => (
                <div>
                    <IconButton
                        color="primary"
                        onClick={() => handleEdit(params)}
                        style={{ marginRight: 8 }}
                    >
                        <EditIcon />
                    </IconButton>

                    <IconButton
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Box sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={data}
                    columns={defaultColumns}
                    pageSize={20}
                    loading={loading}
                />
            </Box>

            {/* Modifier le rendu conditionnel des modals */}
            {editFormComponent && (
                <DialogModal
                    openModal={openModalForEdit}
                    setOpenModal={setOpenModalForEdit}
                    title={`Modifier ${tableTitle}`}
                    form={
                        React.cloneElement(editFormComponent, {
                            data: selectedData,
                            setOpenModal: setOpenModalForEdit,
                            setRefreshTrigger: setRefreshTrigger
                        })
                    }
                />
            )}


        </div>
    );
};

export default DataTable;