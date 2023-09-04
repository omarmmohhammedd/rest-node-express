import { configureStore } from "@reduxjs/toolkit";
import { LoginReducer, RegisterReducer } from "./Reducers/Auth";


export const base_url = "https://bolg-app-backend.onrender.com"

export const  store = configureStore({
    reducer: {
        Login: LoginReducer,
        Register:RegisterReducer
    }
})