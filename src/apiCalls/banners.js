// client/apiCalls/banners.js

import { axiosInstance } from '.'; // Assurez-vous que ce chemin est correct

/**
 * @function GetPageBanner
 * @description Récupère la bannière d'une page spécifique pour l'affichage public.
 * @param {string} pageName - Le nom de la page (ex: 'accueil', 'présentation').
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const GetPageBanner = async (pageName) => {
    try {
        const responseData = await axiosInstance("get", `/page-banners/${pageName}`);
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error(`Erreur lors de la récupération de la bannière pour la page ${pageName}:`, error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la récupération de la bannière de page." };
    }
};

/**
 * @function GetAllPageBanners
 * @description Récupère toutes les bannières de page (usage admin).
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const GetAllPageBanners = async () => {
    try {
        const responseData = await axiosInstance("get", "/page-banners");
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de la récupération de toutes les bannières de page:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la récupération des bannières de page." };
    }
};

/**
 * @function ManagePageBanner
 * @description Crée ou met à jour une bannière de page (usage admin).
 * Utilise une requête POST pour un comportement d'upsert côté backend.
 * @param {FormData} formData - Les données du formulaire (pageName, type, title, subtitle, media file).
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const ManagePageBanner = async (formData) => {
    try {
        const responseData = await axiosInstance("post", "/page-banners", formData);
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de la gestion (création/mise à jour) de la bannière de page:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la gestion de la bannière de page." };
    }
};

/**
 * @function DeletePageBanner
 * @description Supprime une bannière de page (usage admin).
 * @param {string} id - L'ID de la bannière de page à supprimer.
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const DeletePageBanner = async (id) => {
    try {
        const responseData = await axiosInstance("delete", `/page-banners/${id}`);
        return { success: true, message: responseData.message };
    } catch (error) {
        console.error(`Erreur lors de la suppression de la bannière de page ${id}:`, error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la suppression de la bannière de page." };
    }
};