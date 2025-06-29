import axios from "axios";



const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"; // Fallback pour le dev local


export const axiosInstance = async (method, url, payload) => {
    //console.log(" local storage", localStorage.getItem('token'))
    try {
        const response = await axios({
            method,
            url: `${API_BASE_URL}/api/v1${url}`,
            data: payload,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        },
        );
        //console.log(" local storage", localStorage.getItem('token'))
        return response.data
    } catch (error) {
        return error;
    }
}

export const axiosInstanceUploade = async (method, url, payload) => {
    try {
        const response = await axios({
            method,
            url: `${API_BASE_URL}/api/v1${url}`,
            data: payload,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "multipart/form-data",
            }

        },


        );
        return response.data
    } catch (error) {
        return error;
    }
} 