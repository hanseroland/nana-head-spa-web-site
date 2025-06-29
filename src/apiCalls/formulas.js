// client/apiCalls/formulas.js (ou un fichier similaire)

import { axiosInstance } from "."; // Assure-toi que le chemin est correct

// --- Fonctions publiques (consultation des formules) ---

/**
 * @function GetAllFormulas
 * @description Récupère toutes les formules actives disponibles.
 * @returns {Promise<object>} La réponse de l'API contenant la liste des formules.
 */
export const GetAllFormulas = async () => {
    const response = await axiosInstance("get", "/formulas");
    return response;
};

/**
 * @function GetFormulaById
 * @description Récupère les détails d'une formule spécifique par son ID.
 * @param {string} formulaId L'ID de la formule à récupérer.
 * @returns {Promise<object>} La réponse de l'API contenant les détails de la formule.
 */
export const GetFormulaById = async (formulaId) => {
    const response = await axiosInstance("get", `/formulas/${formulaId}`);
    return response;
};

// --- Fonctions Administrateur (gestion des formules) ---
// Ces fonctions nécessitent un token JWT d'administrateur dans le header d'autorisation.

/**
 * @function CreateFormula
 * @description Crée une nouvelle formule. Nécessite un rôle d'administrateur.
 * @param {object} formulaData Les données de la nouvelle formule (title, price, duration, image, etc.).
 * @returns {Promise<object>} La réponse de l'API après la création de la formule.
 */
export const CreateFormula = async (formulaData) => {
    const response = await axiosInstance("post", "/formulas", formulaData);
    return response;
};

/**
 * @function UpdateFormula
 * @description Met à jour une formule existante par son ID. Nécessite un rôle d'administrateur.
 * @param {string} formulaId L'ID de la formule à mettre à jour.
 * @param {object} updates Les champs de la formule à modifier.
 * @returns {Promise<object>} La réponse de l'API après la mise à jour de la formule.
 */
export const UpdateFormula = async (formulaId, updates) => {
    const response = await axiosInstance("put", `/formulas/${formulaId}`, updates);
    return response;
};

/**
 * @function DeleteFormula
 * @description Supprime une formule par son ID. Nécessite un rôle d'administrateur.
 * @param {string} formulaId L'ID de la formule à supprimer.
 * @returns {Promise<object>} La réponse de l'API après la suppression de la formule.
 */
export const DeleteFormula = async (formulaId) => {
    const response = await axiosInstance("delete", `/formulas/${formulaId}`);
    return response;
};