import { axiosInstance, axiosInstanceUploade } from ".";

/**
 * @function GetAllUsers
 * @description Récupère la liste de tous les utilisateurs (Admin seulement).
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const GetAllUsers = async () => {
    try {
        const responseData = await axiosInstance("get", "/users");
        if (responseData && responseData.success) {
            return { success: true, data: responseData.data, message: responseData.message };
        } else {
            console.error("Réponse backend non réussie (GetAllUsers):", responseData);
            return { success: false, message: responseData?.message || "Échec de la récupération des utilisateurs." };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur de connexion lors de la récupération des utilisateurs." };
    }
};



/**
 * @function CreateUser
 * @description Crée un nouvel utilisateur (Admin seulement).
 * @param {object} userData - Données du nouvel utilisateur (firstName, lastName, email, password, role, phone).
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const CreateUser = async (userData) => {
    try {
        const responseData = await axiosInstance("post", "/users/add", userData);
        if (responseData && responseData.success) {
            return { success: true, data: responseData.data, message: responseData.message };
        } else {
            console.error("Réponse backend non réussie (CreateUser):", responseData);
            return { success: false, message: responseData?.message || "Échec de la création de l'utilisateur." };
        }
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur de connexion lors de la création de l'utilisateur." };
    }
};



/**
 * @function UpdateUser
 * @description Met à jour les informations d'un utilisateur existant (Admin seulement, pour les admins uniquement).
 * @param {string} userId - L'ID de l'utilisateur à modifier.
 * @param {object} updateData - Les champs à mettre à jour (firstName, lastName, email, phone).
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const AdminUpdateUser = async (userId, updateData) => {
    try {
        const responseData = await apiCaller("put", `/users/admin/${userId}`, updateData);
        if (responseData && responseData.success) {
            return { success: true, data: responseData.data, message: responseData.message };
        } else {
            console.error("Réponse backend non réussie (UpdateUser):", responseData);
            return { success: false, message: responseData?.message || "Échec de la mise à jour de l'utilisateur." };
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur de connexion lors de la mise à jour de l'utilisateur." };
    }
};

// Obtenir tous les utilisateurs
export const GetTotalUsers = async () => {
    const response = await axiosInstance("get", "/users/count");
    return response;
};

// Obtenir tous les récents
export const GetTotalRecentUsers = async () => {
    const response = await axiosInstance("get", "/users/recent");
    return response;
};

// Obtenir les informations d'un utilisateur par son ID
export const GetUserById = async (userId) => {
    const response = await axiosInstance("get", `/users/${userId}`);
    return response;
};

// Obtenir les informations d'un utilisateur par son email
export const GetUserByEmail = async (email) => {
    const response = await axiosInstance("get", `/users/email/${email}`);
    return response;
};

// Obtenir les informations de l'utilisateur en cours
export const GetCurrentUser = async () => {
    const response = await axiosInstance("get", "/users/current-user");
    return response;
};


/**
 * @function GetNewRegistrationsLast7Days
 * @description Récupère le nombre de nouvelles inscriptions par jour sur les 7 derniers jours.
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const GetNewRegistrationsLast7Days = async () => {
    try {
        const responseData = await axiosInstance("get", "/users/registrations-last-7-days");
        if (responseData && responseData.success) {
            return { success: true, data: responseData.data, message: responseData.message };
        } else {
            console.error("Réponse backend non réussie (GetNewRegistrationsLast7Days):", responseData);
            return { success: false, message: responseData?.message || "Échec de la récupération des nouvelles inscriptions." };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des nouvelles inscriptions:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur de connexion lors de la récupération des nouvelles inscriptions." };
    }
};



/**
 * @function GetUserCountsByRole
 * @description Récupère le nombre total d'utilisateurs, clients et admins.
 * @returns {Promise<{success: boolean, data?: {totalUsers: number, totalClients: number, totalAdmins: number}, message?: string}>}
 */
export const GetUserCountsByRole = async () => {
    try {
        const responseData = await axiosInstance("get", "/users/stats/counts-by-role");
        if (responseData && responseData.success) {
            return { success: true, data: responseData.data, message: responseData.message };
        } else {
            console.error("Réponse backend non réussie (GetUserCountsByRole):", responseData);
            return { success: false, message: responseData?.message || "Échec de la récupération des statistiques utilisateurs." };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques utilisateurs:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur de connexion lors de la récupération des statistiques utilisateurs." };
    }
};

/**
 * @function GetFidelityAndEngagementStats
 * @description Récupère les statistiques de fidélité et d'engagement des utilisateurs.
 * @returns {Promise<{success: boolean, data?: {usersAboveLevel500: number, usersAboveLevel1000: number, totalAdsWatchedCount: number, activeClientsCount: number}, message?: string}>}
 */
export const GetFidelityAndEngagementStats = async () => {
    try {
        const responseData = await axiosInstance("get", "/users/stats/fidelity-engagement");
        if (responseData && responseData.success) {
            return { success: true, data: responseData.data, message: responseData.message };
        } else {
            console.error("Réponse backend non réussie (GetFidelityAndEngagementStats):", responseData);
            return { success: false, message: responseData?.message || "Échec de la récupération des statistiques de fidélité et engagement." };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques de fidélité et engagement:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur de connexion lors de la récupération des statistiques de fidélité et engagement." };
    }
};


// Mettre à jour les informations d'un utilisateur
export const UpdateUser = async (userId, updates) => {
    const response = await axiosInstance("put", `/users/${userId}`, updates);
    return response;
};

/**
 * @function DeleteUser
 * @description Supprime un utilisateur (Admin seulement).
 * @param {string} userId - L'ID de l'utilisateur à supprimer.
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const DeleteUser = async (userId) => {
    try {
        const responseData = await apiCaller("delete", `/users/${userId}`);
        if (responseData && responseData.success) {
            return { success: true, message: responseData.message };
        } else {
            console.error("Réponse backend non réussie (DeleteUser):", responseData);
            return { success: false, message: responseData?.message || "Échec de la suppression de l'utilisateur." };
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur de connexion lors de la suppression de l'utilisateur." };
    }
};

// Ajouter des informations à un utilisateur existant
export const AddUserInfo = async (userData) => {
    const response = await axiosInstance("post", "/users", userData);
    return response;
};


// Ajouter des informations à un utilisateur existant 
export const AdminAddUser = async (userData) => {
    const response = await axiosInstance("post", "/users/add", userData);
    return response;
};

// Mettre à jour la photo de profil d'un utilisateur
export const UpdateProfilePicture = async (userId, photo) => {

    const response = await axiosInstanceUploade("put", `/users/update-picture/${userId}`, photo);
    return response;
};