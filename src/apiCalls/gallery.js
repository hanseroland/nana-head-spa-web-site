// client/apiCalls/gallery.js

import { axiosInstance } from '.'; // Assurez-vous que ce chemin est correct

/** 
 * @function GetAllGalleryImages
 * @description Récupère toutes les images de la galerie.
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const GetAllGalleryImages = async () => {
    try {
        const responseData = await axiosInstance("get", "/gallery-images");
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de la récupération des images de la galerie:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la récupération des images de la galerie." };
    }
};

/**
 * @function GetGalleryImageById
 * @description Récupère une image de galerie par son ID (usage admin).
 * @param {string} id - L'ID de l'image de la galerie.
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const GetGalleryImageById = async (id) => {
    try {
        const responseData = await axiosInstance("get", `/gallery-images/${id}`);
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'image de galerie ${id}:`, error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la récupération de l'image de galerie." };
    }
};

/**
 * @function CreateGalleryImage
 * @description Ajoute une nouvelle image à la galerie (usage admin).
 * @param {FormData} formData - Les données du formulaire contenant l'image et ses détails.
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const CreateGalleryImage = async (formData) => {
    try {
        // axiosInstance doit être configuré pour gérer les headers 'multipart/form-data' automatiquement
        // ou vous devrez ajouter le header manuellement si axiosInstance ne le fait pas.
        const responseData = await axiosInstance("post", "/gallery-images", formData);
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de l'ajout d'une image à la galerie:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de l'ajout de l'image à la galerie." };
    }
};

/**
 * @function UpdateGalleryImage
 * @description Met à jour une image de la galerie existante (usage admin).
 * @param {string} id - L'ID de l'image de la galerie à mettre à jour.
 * @param {FormData} formData - Les données du formulaire contenant les mises à jour.
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const UpdateGalleryImage = async (id, formData) => {
    try {
        const responseData = await axiosInstance("put", `/gallery-images/${id}`, formData);
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'image de galerie ${id}:`, error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la mise à jour de l'image de galerie." };
    }
};

/**
 * @function DeleteGalleryImage
 * @description Supprime une image de la galerie (usage admin).
 * @param {string} id - L'ID de l'image de la galerie à supprimer.
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const DeleteGalleryImage = async (id) => {
    try {
        const responseData = await axiosInstance("delete", `/gallery-images/${id}`);
        return { success: true, message: responseData.message };
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'image de galerie ${id}:`, error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la suppression de l'image de galerie." };
    }
};