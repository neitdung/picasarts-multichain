import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// import cacheReducer from "./cache/slice";
import chainReducer from "./chain/slice";
import hubReducer from "./hub/slice";
import loanReducer from "./loan/slice";
import marketReducer from "./market/slice";
import rentalReducer from "./rental/slice";

const persistConfig = {
    key: 'chain',
    storage,
}

const chain = persistReducer(persistConfig, chainReducer)

export const store = configureStore({
    reducer: {
        // cache: cacheReducer,
        chain: chain,
        hub: hubReducer,
        loan: loanReducer,
        market: marketReducer,
        rental: rentalReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export const persistor = persistStore(store)