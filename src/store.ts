import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import selectionReducer from "./features/selectionSlice";
import type { RootState as AppRootState } from "./types/store";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    selection: selectionReducer,
  },
});

export type RootState = AppRootState;
export type AppDispatch = typeof store.dispatch;

export default store;