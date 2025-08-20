// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { GetCurrentUser } from '@/apiCalls/users';
import { useRouter } from 'next/router';
import { LogoutUser } from '@/apiCalls/auth';

export const AuthContext = createContext({
    currentUser: null,
    isAuthenticated: false,
    loading: true,
    login: async (userData) => { },
    logout: () => { },
});

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const login = useCallback(async (userData) => {
        setCurrentUser(userData);
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(
        async (redirect = true) => {
            try {
                await LogoutUser(); // supprime le cookie côté backend
            } catch (err) {
                console.error('Erreur lors de la déconnexion:', err);
            }
            setCurrentUser(null);
            setIsAuthenticated(false);

            // ✅ On ne redirige que si on n’est pas déjà sur /connexion
            if (redirect && router.pathname !== '/connexion') {
                router.push('/connexion');
            }
        },
        [router]
    );

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                const response = await GetCurrentUser();
                if (response.success && response.data) {
                    setCurrentUser(response.data);
                    setIsAuthenticated(true);
                } else {
                    console.log('Token invalide ou expiré, nettoyage...');
                    await logout(false); // ✅ On ne redirige pas automatiquement
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de session:', error);
                await logout(false);
            }
            setLoading(false);
        };

        checkAuth();
    }, [logout]);

    return (
        <AuthContext.Provider
            value={{ currentUser, isAuthenticated, loading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
