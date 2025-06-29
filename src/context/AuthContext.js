// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { GetCurrentUser } from '@/apiCalls/users'; // Assurez-vous que ce chemin est correct
import { useRouter } from 'next/router';

// Créez le Contexte d'authentification
export const AuthContext = createContext({
    currentUser: null,
    isAuthenticated: false,
    loading: true, // Indique si la vérification initiale de l'authentification est en cours
    login: async (userData, token) => { }, // Fonction pour mettre à jour l'état après connexion
    logout: () => { }, // Fonction de déconnexion
});

// Créez le composant fournisseur de Contexte
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // État de chargement initial du contexte
    const router = useRouter();

    // Fonction de connexion : elle sera appelée après une authentification réussie
    const login = useCallback(async (userData, token) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token); // Stocke le token
        }
        setCurrentUser(userData); // Stocke les données de l'utilisateur
        setIsAuthenticated(true);
        // Pas de redirection ici, les composants l'appelleront si nécessaire
    }, []);

    // Fonction de déconnexion
    const logout = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token'); // Supprime le token
        }
        setCurrentUser(null);
        setIsAuthenticated(false);
        // La redirection sera gérée par le composant appelant (ex: AdminLayout)
        router.push('/connexion');
    }, [router]);

    // Effet pour vérifier le token au montage du AuthProvider et réhydrater l'état
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true); // Démarre le chargement
            let token = null;
            if (typeof window !== 'undefined') {
                token = localStorage.getItem('token');
            }

            if (token) {
                try {
                    const response = await GetCurrentUser(); // Utilise la fonction API pour vérifier le token
                    if (response.success && response.data) {
                        setCurrentUser(response.data);
                        setIsAuthenticated(true);
                    } else {
                        // Token invalide ou expiré côté backend
                        console.log("Token invalide ou expiré, déconnexion...");
                        logout(); // Utilise la fonction logout pour nettoyer et rediriger
                    }
                } catch (error) {
                    // Erreur réseau ou autre lors de la vérification du token
                    console.error("Erreur lors de la vérification du token:", error);
                    logout(); // Utilise la fonction logout en cas d'erreur
                }
            } else {
                // Pas de token, l'utilisateur n'est pas authentifié
                setIsAuthenticated(false);
                setCurrentUser(null);
            }
            setLoading(false); // Arrête le chargement
        };

        checkAuth();
    }, [logout]); // Dépend de `logout` car il est appelé à l'intérieur, bien que stable avec useCallback

    return (
        <AuthContext.Provider value={{ currentUser, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour une utilisation plus facile du Contexte
export const useAuth = () => useContext(AuthContext);