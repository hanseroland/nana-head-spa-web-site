//src/apiCalls/index.js
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const axiosInstance = async (method, url, payload) => {
    try {
        const response = await axios({
            method,
            url: `${API_BASE_URL}/api/v1${url}`,
            data: payload,
            withCredentials: true, // ✅ envoie bien le cookie `httpOnly`
        });
        return response.data;
    } catch (error) {
        console.error("Erreur axiosInstance :", error.response?.data || error.message);
        return error.response ? error.response.data : { success: false, message: error.message };
    }
};

// Pour upload
export const axiosInstanceUploade = async (method, url, payload) => {
    try {
        const response = await axios({
            method,
            url: `${API_BASE_URL}/api/v1${url}`,
            data: payload,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Erreur axiosInstanceUpload :", error.response?.data || error.message);
        return error.response ? error.response.data : { success: false, message: error.message };
    }
};
