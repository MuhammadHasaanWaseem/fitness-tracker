import { createSlice } from "@reduxjs/toolkit"
import type { User } from "@supabase/supabase-js"

interface AuthState {
  user: User | null
}

const initialState: AuthState = { user: null }

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }: { payload: User | null }) => {
      state.user = payload
    },
    signOut: (state) => {
      state.user = null
    },
  },
})

export const { setUser, signOut } = authSlice.actions
export const selectAuth = (state: { auth: AuthState }) => state.auth
export default authSlice.reducer
