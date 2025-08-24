import { axiosInstance } from ".";

// Créer un nouvel utilisateur
export const RegisterUser = async (userData) => {
    const response = await axiosInstance("post", '/auth/register', userData);
    return response;
}

// Se connecter avec un utilisateur
export const LoginUser = async (loginData) => {
    const response = await axiosInstance("post", '/auth/login', loginData);
    return response;
}


// mot de passe oublié
export const ForgotPasswordRequest = async (userData) => {
    const response = await axiosInstance("post", '/auth/forgot-password', userData);
    return response;
}

//Reset mot de passe oublié
export const ResetPassword = async (token, userData) => {
    const response = await axiosInstance("put", `/auth/reset-password/${token}`, userData);
    return response;
}

// Se déconnecter 
export const LogoutUser = async (loginData) => {
    const response = await axiosInstance("post", '/auth/logout');
    return response;
}