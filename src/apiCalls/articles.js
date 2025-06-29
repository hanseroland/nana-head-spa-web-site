// client/apiCalls/articles.js

import { axiosInstance, axiosInstanceUploade } from ".";

/**
 * @function CreateArticle
 * @description Appelle l'API pour créer un nouvel article.
 * @param {FormData} articleData - Les données de l'article, incluant l'image (doit être un objet FormData).
 * @returns {Promise<object>} La réponse de l'API.
 */
export const CreateArticle = async (articleData) => {
    try {
        // Utilise axiosInstanceUploade car nous envoyons un fichier (FormData)
        const response = await axiosInstanceUploade('post', '/articles', articleData);
        return response;
    } catch (error) {
        console.error("Erreur lors de la création de l'article :", error);
        return { success: false, message: error.message || "Impossible de créer l'article." };
    }
};

/**
 * @function GetAllArticles
 * @description Appelle l'API pour récupérer tous les articles.
 * @param {object} [filters={}] - Un objet contenant les filtres optionnels (ex: { category: 'nouveauté', showAll: true }).
 * @returns {Promise<object>} La réponse de l'API.
 */
export const GetAllArticles = async (filters = {}) => {
    try {
        const queryString = new URLSearchParams(filters).toString();
        const url = `/articles${queryString ? `?${queryString}` : ''}`;
        const response = await axiosInstance('get', url);
        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
        return { success: false, message: error.message || "Impossible de récupérer les articles." };
    }
};

/**
 * @function GetArticleBySlug
 * @description Appelle l'API pour récupérer un article spécifique par son slug.
 * @param {string} slug - Le slug de l'article.
 * @returns {Promise<object>} La réponse de l'API.
 */
export const GetArticleBySlug = async (slug) => {
    try {
        const response = await axiosInstance('get', `/articles/${slug}`);
        return response;
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'article ${slug} :`, error);
        return { success: false, message: error.message || "Impossible de récupérer l'article." };
    }
};

/**
 * @function UpdateArticle
 * @description Appelle l'API pour mettre à jour un article existant par son slug.
 * @param {string} slug - Le slug de l'article à mettre à jour.
 * @param {FormData | object} articleData - Les données de l'article à mettre à jour. Si l'image est modifiée, cela doit être un objet FormData. Sinon, un objet JSON simple.
 * @returns {Promise<object>} La réponse de l'API.
 */
export const UpdateArticle = async (slug, articleData) => {
    try {
        // Détermine si articleData est un FormData (ce qui indique un upload de fichier)
        const isFormData = articleData instanceof FormData;
        const instance = isFormData ? axiosInstanceUploade : axiosInstance;

        const response = await instance('put', `/articles/${slug}`, articleData);
        return response;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'article ${slug} :`, error);
        return { success: false, message: error.message || "Impossible de mettre à jour l'article." };
    }
};

/**
 * @function DeleteArticle
 * @description Appelle l'API pour supprimer un article par son slug.
 * @param {string} slug - Le slug de l'article à supprimer.
 * @returns {Promise<object>} La réponse de l'API.
 */
export const DeleteArticle = async (slug) => {
    try {
        const response = await axiosInstance('delete', `/articles/${slug}`);
        return response;
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'article ${slug} :`, error);
        return { success: false, message: error.message || "Impossible de supprimer l'article." };
    }
};