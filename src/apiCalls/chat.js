// src/apiCalls/chat.js

import { axiosInstance } from "."; // Assure-toi que le chemin est correct (e.g., ../utils/axiosInstance ou ../axiosInstance)


/**
 * @function GetConversations
 * @description Récupère toutes les conversations de l'utilisateur connecté.
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const GetConversations = async () => {
    try {
        const responseData = await axiosInstance("get", "/chat");
        // axiosInstance devrait déjà gérer les erreurs et retourner l'objet structuré si non succès
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de la récupération des conversations:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la récupération des conversations." };
    }
};

/**
 * @function GetConversationMessages
 * @description Récupère tous les messages d'une conversation spécifique.
 * @param {string} conversationId - L'ID de la conversation.
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const GetConversationMessages = async (conversationId) => {
    try {
        const responseData = await axiosInstance("get", `/chat/${conversationId}/messages`);
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la récupération des messages." };
    }
};

/**
 * @function StartClientAdminConversation
 * @description Pour un client : démarre ou accède à sa conversation unique avec un admin.
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const StartClientAdminConversation = async () => {
    try {
        const responseData = await axiosInstance("post", "/chat/start-with-admin");
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors du démarrage de la conversation client-admin:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors du démarrage de la conversation client-admin." };
    }
};

/**
 * @function StartAdminClientConversation
 * @description Pour un admin : démarre ou accède à une conversation avec un client spécifique.
 * @param {string} clientId - L'ID du client avec qui l'admin veut discuter.
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const StartAdminClientConversation = async (clientId) => {
    try {
        const responseData = await axiosInstance("post", `/chat/admin/start-conversation/${clientId}`);
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors du démarrage de la conversation admin-client:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors du démarrage de la conversation admin-client." };
    }
};

/**
 * @function SendMessage
 * @description Envoie un message dans une conversation existante.
 * @param {object} messageData - Données du message (conversationId, content, receiverId).
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const SendMessage = async (messageData) => {
    try {
        const responseData = await axiosInstance("post", "/chat/send-message", messageData);
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de l'envoi du message." };
    }
};

/**
 * @function GetClients
 * @description Récupère la liste de tous les utilisateurs ayant le rôle 'client'.
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const GetClients = async () => {
    try {
        // Cette route n'est pas dans chatRoutes. Il faut s'assurer que `/users` existe
        // et qu'elle retourne une liste d'utilisateurs que nous pouvons filtrer.
        // Si vous avez une route spécifique comme `/users/clients` qui ne retourne que les clients, utilisez-la.
        const responseData = await axiosInstance("get", "/users"); // Assurez-vous que cette route retourne tous les utilisateurs
        // Filtrer côté client si la route /users renvoie tous les rôles
        const clients = responseData.data.filter(user => user.role === 'client');
        return { success: true, data: clients, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la récupération des clients." };
    }
};