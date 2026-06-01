import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import selectionReducer from "./features/selectionSlice";
import { pokemonApi } from "./services/pokemonApi";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        selection: selectionReducer,
        [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
