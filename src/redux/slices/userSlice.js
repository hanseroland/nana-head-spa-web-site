import { createSlice } from '@reduxjs/toolkit'


const usersSlice = createSlice({
    name: 'users',
    initialState: {
        currentUser: null,
        userUpdated: null,
        loading: false,
        error: null,
    },
    reducers: {
        SetCurrentUser(state, action) {
            state.currentUser = action.payload
        },
        UpdateUserProfil(state, action) {
            state.userUpdated = action.payload
        },
        // ... tes actions de connexion/déconnexion/enregistrement
        loginSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload; // L'utilisateur est mis à jour ici
            state.error = null;
        },
        logout: (state) => {
            state.currentUser = null; // L'utilisateur est mis à null à la déconnexion
            state.loading = false;
            state.error = null;
        },
    }
})

export const {
    SetCurrentUser,
    UpdateUserProfil,
    loginSuccess,
    logout
} = usersSlice.actions;
export default usersSlice.reducer;