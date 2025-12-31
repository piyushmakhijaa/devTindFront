import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice.js"


const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);


export const appStore = configureStore({
    reducer : {

        user : persistedReducer
    },
})


export const persistor = persistStore(appStore);