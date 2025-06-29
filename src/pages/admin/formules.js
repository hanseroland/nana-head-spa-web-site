import React, { useCallback, useEffect, useState } from 'react'
import HeaderFeature from '@/components/admin/common/HeaderFeature'
import DialogModal from '@/components/common/DialogModal'
import { Alert, Box, CircularProgress, Container, Grid, Typography } from '@mui/material'
import { DeleteFormula, GetAllFormulas } from '@/apiCalls/formulas'
import FormulaCard from '@/components/admin/cards/FormulaCard'
import FormulaForm from '@/components/admin/forms/FormulaForm'
import ConfirmationModal from '@/components/common/ConfirmationModal'

function Formules() {

    const [openModal, setOpenModal] = useState(false); // État pour ouvrir/fermer le modal
    const [selectedFormulaId, setSelectedFormulaId] = useState(null); // ID de la formule à modifier (null pour ajout)
    const [modalTitle, setModalTitle] = useState(''); // Titre du modal
    const [formulas, setFormulas] = useState([]); // État pour stocker les formules
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState(null); // État d'erreur

    // --- ÉTATS POUR LE MODAL DE CONFIRMATION ---
    const [openConfirmModal, setOpenConfirmModal] = useState(false); // État pour ouvrir/fermer le modal de confirmation
    const [formulaToDeleteId, setFormulaToDeleteId] = useState(null); // ID de la formule en attente de suppression
    const [deletingFormula, setDeletingFormula] = useState(false); // État de chargement pour la suppression
    const [deleteError, setDeleteError] = useState(null); // État d'erreur pour la suppression
    // ---------------------------------------------------


    // Fonction pour charger les formules depuis l'API
    const fetchFormulas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetAllFormulas();
            if (response.success) {
                setFormulas(response.data);
            } else {
                setError(response.message || "Erreur lors du chargement des formules.");
            }
        } catch (err) {
            console.error("Erreur API lors du chargement des formules :", err);
            setError("Impossible de se connecter au serveur pour récupérer les formules.");
        } finally {
            setLoading(false);
        }
    }, []);


    // Charge les formules au montage du composant
    useEffect(() => {
        fetchFormulas();
    }, [fetchFormulas]);

    // Ouvre le modal en mode "Ajout"
    const handleAddFormulaClick = () => {
        setSelectedFormulaId(null); // Pas d'ID pour l'ajout
        setModalTitle('Ajouter une nouvelle formule');
        setOpenModal(true);
    };

    // Ouvre le modal en mode "Modification"
    const handleEditFormulaClick = (formulaId) => {
        setSelectedFormulaId(formulaId); // Passe l'ID de la formule à modifier
        setModalTitle('Modifier la formule');
        setOpenModal(true);
    };

    // Ferme le modal et rafraîchit les formules
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedFormulaId(null); // Réinitialise l'ID sélectionné
        fetchFormulas(); // Rafraîchit la liste après ajout/modification
    };

    // --- GESTION DE LA SUPPRESSION ---

    // Ouvre le modal de confirmation de suppression
    const handleDeleteFormulaClick = (formulaId) => {
        setFormulaToDeleteId(formulaId); // Stocke l'ID de la formule à supprimer
        setOpenConfirmModal(true); // Ouvre le modal de confirmation
        setDeleteError(null); // Réinitialise l'erreur de suppression
    };

    // Fonction appelée lorsque l'utilisateur annule la suppression
    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
        setFormulaToDeleteId(null);
    };

    // Fonction appelée lorsque l'utilisateur confirme la suppression
    const handleConfirmDelete = useCallback(async () => {
        if (!formulaToDeleteId) return; // S'assurer qu'un ID est présent

        setDeletingFormula(true); // Active l'état de chargement
        setDeleteError(null); // Réinitialise les erreurs

        try {
            const response = await DeleteFormula(formulaToDeleteId); // Appel à l'API de suppression
            if (response.success) {
                // Si la suppression réussit, ferme le modal et rafraîchit la liste
                handleCloseConfirmModal();
                fetchFormulas();
            } else {
                // Affiche un message d'erreur si l'API échoue
                setDeleteError(response.message || "Erreur lors de la suppression de la formule.");
            }
        } catch (err) {
            console.error("Erreur API lors de la suppression de la formule :", err);
            setDeleteError("Impossible de se connecter au serveur pour supprimer la formule.");
        } finally {
            setDeletingFormula(false); // Désactive l'état de chargement
        }
    }, [formulaToDeleteId, fetchFormulas]);


    return (
        <Box
            px={3}
        >
            <HeaderFeature
                headerTitle="Formules"
                buttonTitle="Nouvelle formule"
                onAdd={handleAddFormulaClick} // L'action pour le bouton "Nouvelle formule"
            />

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30vh' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Chargement des formules...</Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ my: 3 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && formulas.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6">Aucune formule disponible pour le moment.</Typography>
                </Box>
            )}

            {!loading && !error && formulas.length > 0 && (
                <Grid container spacing={4}> {/* Augmenté le spacing pour un meilleur espacement */}
                    {formulas.map((formula) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={formula._id}>
                            <FormulaCard
                                formula={formula}
                                onEditClick={handleEditFormulaClick} // Passe la fonction pour éditer
                                onDeleteClick={handleDeleteFormulaClick} // Passe la fonction pour supprimer (si implémenté)

                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            <DialogModal
                form={<FormulaForm formulaId={selectedFormulaId} onClose={handleCloseModal} />} // Passe formulaId et la fonction de fermeture
                title={modalTitle}
                openModal={openModal}
                setOpenModal={setOpenModal} // Le DialogModal utilise setOpenModal pour sa fermeture

            />

            {/* Modal de confirmation de suppression */}
            <ConfirmationModal
                open={openConfirmModal}
                onClose={handleCloseConfirmModal}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                message={`Voulez-vous vraiment supprimer cette formule ? Cette action est irréversible.`}
                confirmText={deletingFormula ? <CircularProgress size={24} color="inherit" /> : 'Supprimer'}
                cancelText="Annuler"
            />

            {/* Affichage des erreurs de suppression */}
            {deleteError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {deleteError}
                </Alert>
            )}

        </Box>
    )
}

export default Formules