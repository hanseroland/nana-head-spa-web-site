import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Stack,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { AdminUpdateUser, CreateUser } from '@/apiCalls/users';
import DialogModal from '@/components/common/DialogModal';

/**
 * Modal de formulaire pour ajouter ou modifier un utilisateur.
 * @param {Object} props - Props du composant.
 * @param {boolean} props.isOpen - Contrôle l'ouverture/fermeture du modal.
 * @param {function} props.onClose - Fonction à appeler pour fermer le modal.
 * @param {Object|null} props.userData - Données de l'utilisateur à modifier (null pour l'ajout).
 * @param {function} props.onSaveSuccess - Callback appelé après une sauvegarde réussie.
 */
const UserForm = ({ isOpen, onClose, userData, onSaveSuccess }) => {
    // Détermine si le modal est en mode édition ou ajout
    const isEditMode = Boolean(userData && userData._id);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '', // Uniquement pour l'ajout, non affiché en mode édition
        role: 'client', // Valeur par défaut pour l'ajout
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialise le formulaire avec les données de l'utilisateur si en mode édition
    useEffect(() => {
        if (isOpen) {
            setError(null);
            setLoading(false); // Réinitialise l'état de chargement

            if (isEditMode) {
                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    password: '', // Ne jamais pré-remplir le mot de passe en édition
                    role: userData.role || 'client', // Garde le rôle existant
                });
            } else {
                // Réinitialise pour le mode ajout
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    password: '',
                    role: 'client', // Par défaut à 'client' pour l'ajout par admin, peut être changé en 'admin'
                });
            }
        }
    }, [isOpen, isEditMode, userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        const payload = { ...formData };
        if (isEditMode) {
            delete payload.password; // Ne pas envoyer le mot de passe en édition
            // Si tu ne veux pas que le rôle puisse être changé en mode édition, supprime payload.role aussi
            // delete payload.role;
        }

        // Validation basique
        if (!payload.firstName || !payload.lastName || !payload.email || !payload.phone || (!isEditMode && !payload.password)) {
            setError("Veuillez remplir tous les champs obligatoires.");
            setLoading(false);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            setError("Veuillez entrer une adresse email valide.");
            setLoading(false);
            return;
        }
        if (!isEditMode && payload.password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            setLoading(false);
            return;
        }


        let response;
        try {
            if (isEditMode) {
                response = await AdminUpdateUser(userData._id, payload);
            } else {
                response = await CreateUser(payload);
            }

            if (response.success) {
                alert(response.message);
                onSaveSuccess(); // Appelle le callback de succès
                onClose(); // Ferme le modal
            } else {
                setError(response.message || 'Échec de l\'opération.');
            }
        } catch (err) {
            console.error("Erreur API lors de la sauvegarde de l'utilisateur:", err);
            setError('Erreur de connexion au serveur. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const formContent = (
        <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="Prénom"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                disabled={loading}
            />
            <TextField
                label="Nom"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                disabled={loading}
            />
            <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                type="email"
                disabled={isEditMode || loading} // L'email ne peut pas être modifié en mode édition
            />
            <TextField
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                disabled={loading}
            />

            {!isEditMode && ( // Mot de passe uniquement pour l'ajout
                <TextField
                    label="Mot de passe"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    disabled={loading}
                />
            )}

            {/* Le rôle est modifiable lors de la création, mais non modifiable en édition si l'utilisateur n'est pas admin */}
            <FormControl fullWidth disabled={isEditMode && formData.role !== 'admin' || loading}>
                <InputLabel>Rôle</InputLabel>
                <Select
                    name="role"
                    value={formData.role}
                    label="Rôle"
                    onChange={handleChange}
                >
                    <MenuItem value="client">Client</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    {/* Ajoutez d'autres rôles si nécessaire */}
                </Select>
            </FormControl>

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? 'Enregistrer les modifications' : 'Ajouter l\'utilisateur')}
                </Button>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                >
                    Annuler
                </Button>
            </Stack>
        </Stack>
    );

    return (
        <DialogModal
            openModal={isOpen}
            setOpenModal={onClose}
            title={isEditMode ? `Modifier ${userData.firstName} ${userData.lastName}` : 'Ajouter un nouvel utilisateur'}
            form={formContent}
        />
    );
};

export default UserForm;