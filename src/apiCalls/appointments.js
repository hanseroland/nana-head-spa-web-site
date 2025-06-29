// client/apiCalls/appointments.js

import { axiosInstance } from "."; // Assure-toi que le chemin est correct


/**
 * @function CreateAppointment
 * @description Enregistre un nouveau rendez-vous pour le client connecté.
 * @param {object} appointmentData - Données du rendez-vous (date, startTime, endTime, formulaId).
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const CreateAppointment = async (appointmentData) => {

    console.log(" rendez-vous :  ", appointmentData)
    // 2. Appeler axiosInstance comme une fonction, en passant la méthode et l'URL
    const responseData = await axiosInstance("post", "/appointments", appointmentData);
    // Ton axiosInstance personnalisé retourne déjà response.data, donc pas besoin de .data.data
    return responseData //{ success: true, data: responseData.data, message: responseData.message };

};

/**
 * @function GetMyAppointments
 * @description Récupère tous les rendez-vous du client actuellement connecté.
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const GetMyAppointments = async () => {
    try {
        const responseData = await axiosInstance("get", "/appointments/my");
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de la récupération de mes rendez-vous:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la récupération de vos rendez-vous." };
    }
};

/**
 * @function GetUpcomingAppointmentsForAdmin
 * @description Récupère les rendez-vous à venir pour le tableau de bord admin.
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const GetUpcomingAppointmentsForAdmin = async () => {
    try {
        const responseData = await axiosInstance("get", "/appointments/upcoming");
        if (responseData && responseData.success) {
            return { success: true, data: responseData.data, message: responseData.message };
        } else {
            console.error("Réponse backend non réussie (GetUpcomingAppointmentsForAdmin):", responseData);
            return { success: false, message: responseData?.message || "Échec de la récupération des rendez-vous à venir." };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous à venir:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur de connexion lors de la récupération des rendez-vous à venir." };
    }
};


/**
 * @function GetAppointmentCountsByStatus
 * @description Récupère le nombre total de rendez-vous et leur répartition par statut.
 * @returns {Promise<{success: boolean, data?: {totalAppointments: number, statusCounts: object}, message?: string}>}
 */
export const GetAppointmentCountsByStatus = async () => {
    try {
        const responseData = await axiosInstance("get", "/appointments/stats/counts-by-status");
        if (responseData && responseData.success) {
            return { success: true, data: responseData.data, message: responseData.message };
        } else {
            console.error("Réponse backend non réussie (GetAppointmentCountsByStatus):", responseData);
            return { success: false, message: responseData?.message || "Échec de la récupération des statistiques de rendez-vous." };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques de rendez-vous:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur de connexion lors de la récupération des statistiques de rendez-vous." };
    }
};

/**
 * @function GetFormulaPopularity
 * @description Récupère le top 5 des formules les plus et moins réservées.
 * @returns {Promise<{success: boolean, data?: {mostReserved: Array<object>, leastReserved: Array<object>}, message?: string}>}
 */
export const GetFormulaPopularity = async () => {
    try {
        const responseData = await axiosInstance("get", "/appointments/stats/formula-popularity");
        if (responseData && responseData.success) {
            return { success: true, data: responseData.data, message: responseData.message };
        } else {
            console.error("Réponse backend non réussie (GetFormulaPopularity):", responseData);
            return { success: false, message: responseData?.message || "Échec de la récupération de la popularité des formules." };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la popularité des formules:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur de connexion lors de la récupération de la popularité des formules." };
    }
};


/**
 * @function GetMonthlyAppointmentTrend
 * @description Récupère la progression mensuelle des rendez-vous sur une période donnée.
 * @param {object} [filters] - Options de filtrage (ex: { status: 'confirmed', formulaId: 'abc' })
 * @returns {Promise<{success: boolean, data?: Array<{date: string, count: number}>, message?: string}>}
 */
export const GetMonthlyAppointmentTrend = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const url = `/appointments/stats/monthly-trend${queryParams ? `?${queryParams}` : ''}`;
        const responseData = await axiosInstance("get", url);
        if (responseData && responseData.success) {
            return { success: true, data: responseData.data, message: responseData.message };
        } else {
            console.error("Réponse backend non réussie (GetMonthlyAppointmentTrend):", responseData);
            return { success: false, message: responseData?.message || "Échec de la récupération de la progression des rendez-vous." };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la progression des rendez-vous:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur de connexion lors de la récupération de la progression des rendez-vous." };
    }
};



/**
 * @function GetMyAppointmentsHistory
 * @description Récupère tous les rendez-vous du client actuellement connecté.
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const GetMyAppointmentsHistory = async () => {
    try {
        const responseData = await axiosInstance("get", "/appointments/history");
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de la récupération de mes rendez-vous:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la récupération de vos rendez-vous." };
    }
};

/**
 * @function CancelAppointment
 * @description Annule un rendez-vous spécifique. Peut être appelé par le client ou un admin.
 * @param {string} appointmentId - L'ID du rendez-vous à annuler.
 * @param {string} [cancellationReason] - Motif facultatif de l'annulation.
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const CancelAppointment = async (appointmentId, cancellationReason = '') => {
    try {
        const responseData = await axiosInstance("put", `/appointments/${appointmentId}/cancel`, { cancellationReason });
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de l'annulation du rendez-vous:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de l'annulation du rendez-vous." };
    }
};

/**
 * @function GetAllAppointmentsForAdmin
 * @description Récupère tous les rendez-vous (accessible uniquement par l'admin).
 * @param {object} [filters] - Filtres optionnels (status, date, client).
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const GetAllAppointmentsForAdmin = async (filters = {}) => {
    try {
        // Pour les requêtes GET avec des paramètres, tu dois les construire dans l'URL
        const params = new URLSearchParams(filters).toString();
        const url = params ? `/appointments/admin?${params}` : "/appointments/admin";
        const responseData = await axiosInstance("get", url);
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les rendez-vous (admin):", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la récupération des rendez-vous admin." };
    }
};

/**
 * @function GetAppointmentById
 * @description Récupère un rendez-vous spécifique par son ID (accessible par le client si c'est son RDV, ou par l'admin).
 * @param {string} appointmentId - L'ID du rendez-vous.
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const GetAppointmentById = async (appointmentId) => {
    try {
        const responseData = await axiosInstance("get", `/appointments/${appointmentId}`);
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de la récupération du rendez-vous par ID:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la récupération du rendez-vous." };
    }
};

/**
 * @function UpdateAppointmentStatus
 * @description Met à jour le statut d'un rendez-vous (accessible uniquement par l'admin).
 * @param {string} appointmentId - L'ID du rendez-vous à mettre à jour.
 * @param {string} status - Le nouveau statut (e.g., 'confirmed', 'cancelled', 'completed').
 * @param {string} [adminNotes] - Notes facultatives de l'administrateur.
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const UpdateAppointmentStatus = async (appointmentId, status, adminNotes = undefined) => {
    try {
        const responseData = await axiosInstance("put", `/appointments/${appointmentId}/status`, { status, adminNotes });
        return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut du rendez-vous:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur lors de la mise à jour du statut du rendez-vous." };
    }
};


/**
 * @function UpdateAppointmentDetails
 * @description Met à jour les détails d'un rendez-vous (accessible uniquement par l'admin).
 * @param {string} appointmentId - L'ID du rendez-vous à mettre à jour.
 * @param {object} updateData - Les données à mettre à jour (date, startTime, endTime, formulaId, status, adminNotes, cancellationReason).
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const UpdateAppointmentDetails = async (appointmentId, updateData) => {
    try {
        const responseData = await axiosInstance("put", `/appointments/${appointmentId}`, updateData);
        if (responseData && responseData.success) {
            return { success: true, data: responseData.data, message: responseData.message };
        } else {
            console.error("Réponse backend non réussie (UpdateAppointmentDetails):", responseData);
            return { success: false, message: responseData?.message || "Échec de la mise à jour des détails du rendez-vous." };
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour des détails du rendez-vous:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Erreur inconnue lors de la mise à jour des détails du rendez-vous." };
    }
};