import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import { workoutApi } from "./api/workoutApi"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [workoutApi.reducerPath]: workoutApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(workoutApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
