import { axiosInstance } from '.';

/**
 * @function WatchAdAndLevelUp
 * @description Appelle l'API pour enregistrer le visionnage d'une pub et passer au niveau suivant.
 * @param {string} [adId] - ID de la publicité visionnée (optionnel).
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const WatchAdAndLevelUp = async (adId = null) => {
    try {
        const responseData = await axiosInstance("post", "/fidelity/watch-ad", { adId });
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors du visionnage de la pub et de la progression de niveau:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la progression de niveau." };
    }
};

/**
 * @function GetMyFidelityLevel
 * @description Récupère le niveau de fidélité actuel et la dernière date de progression du client connecté.
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const GetMyFidelityLevel = async () => {
    try {
        const responseData = await axiosInstance("get", "/fidelity/my-level");
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de la récupération du niveau de fidélité:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la récupération du niveau de fidélité." };
    }
};

/**
 * @function GetMyAdHistory
 * @description Récupère l'historique des publicités visionnées par le client connecté.
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const GetMyAdHistory = async () => {
    try {
        const responseData = await axiosInstance("get", "/fidelity/ad-history");
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de la récupération de l'historique des publicités:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la récupération de l'historique des publicités." };
    }
};