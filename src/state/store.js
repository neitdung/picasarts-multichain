import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// import cacheReducer from "./cache/slice";
import chainReducer from "./chain/slice";
import hubReducer from "./hub/slice";
import loanReducer from "./loan/slice";
import marketReducer from "./market/slice";
import rentalReducer from "./rental/slice";
import profileReducer from "./profile/slice";

const chainPersistConfig = {
    key: 'chain',
    storage,
}

const chainPersist = persistReducer(chainPersistConfig, chainReducer)

export const store = configureStore({
    reducer: {
        // cache: cacheReducer,
        chain: chainPersist,
        hub: hubReducer,
        loan: loanReducer,
        market: marketReducer,
        rental: rentalReducer,
        profile: profileReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export const persistor = persistStore(store)