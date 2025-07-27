import axios from "axios";



const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"; // Fallback pour le dev local


export const axiosInstance = async (method, url, payload) => {
    let headers = {};

    //console.log(" local storage", localStorage.getItem('token'))

    // ✅ ACCÈS CONDITIONNEL À LOCALSTORAGE
    // Vérifie si `window` est défini (signifiant que nous sommes dans un environnement de navigateur)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    try {
        const response = await axios({
            method,
            url: `${API_BASE_URL}/api/v1${url}`,
            data: payload,
            headers: headers,

        },
        );
        //console.log(" local storage", localStorage.getItem('token'))
        return response.data
    } catch (error) {
        return error;
    }
}

export const axiosInstanceUploade = async (method, url, payload) => {
    let headers = {
        "Content-Type": "multipart/form-data",
    };

    // ✅ ACCÈS CONDITIONNEL À LOCALSTORAGE
    // Vérifie si `window` est défini (signifiant que nous sommes dans un environnement de navigateur)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    try {
        const response = await axios({
            method,
            url: `${API_BASE_URL}/api/v1${url}`,
            data: payload,
            headers: headers // Utilise les en-têtes créés conditionnellement
        });
        return response.data;
    } catch (error) {
        console.error("Erreur axiosInstanceUploade :", error.response?.data?.message || error.message);
        return error.response ? error.response.data : { success: false, message: error.message || "Une erreur inattendue est survenue lors du téléchargement." };
    }
};