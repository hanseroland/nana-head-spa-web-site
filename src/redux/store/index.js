import { configureStore } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    // Importez ces actions pour les ignorer dans le middleware et éviter les avertissements
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Utilise localStorage par défaut
import usersReducer from "../slices/userSlice";


// 1. configuration de la persistance
const persistConfig = {
    key: 'root', // Clé unique pour votre état persistant dans le stockage (ex: 'root', 'myApp')
    storage,
    whitelist: ['users'], // Indique quels réducteurs vous voulez persister.
    // 'users' correspond à la clé de du réducteur dans l'objet reducer ci-dessous.
    // blacklist: ['someNonPersistedSlice'] // Optionnel : réducteurs à NE PAS persister
};

// 2.réducteur "persistant" en enveloppant votre réducteur combiné (même s'il n'y en a qu'un)
const persistedReducer = persistReducer(persistConfig, usersReducer);


const store = configureStore({
    reducer: {
        users: usersReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),

});

// 4. Créez et exportez le "persistor"
export const persistor = persistStore(store);

export default store; 