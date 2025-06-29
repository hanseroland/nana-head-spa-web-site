// client/components/common/ConfirmationModal.js
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

/**
 * @function ConfirmationModal
 * @description Composant de modal de confirmation réutilisable.
 * @param {object} props - Les props du composant.
 * @param {boolean} props.open - L'état d'ouverture du modal.
 * @param {function} props.onClose - Fonction à appeler pour fermer le modal (quand l'utilisateur annule).
 * @param {function} props.onConfirm - Fonction à appeler quand l'utilisateur confirme l'action.
 * @param {string} props.title - Le titre du modal.
 * @param {string} props.message - Le message de confirmation à afficher.
 * @param {string} [props.confirmText='Confirmer'] - Le texte du bouton de confirmation.
 * @param {string} [props.cancelText='Annuler'] - Le texte du bouton d'annulation.
 */
function ConfirmationModal({ open, onClose, onConfirm, title, message, confirmText = 'Confirmer', cancelText = 'Annuler' }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
        >
            <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirmation-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {cancelText}
                </Button>
                <Button onClick={onConfirm} color="error" autoFocus>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationModal;