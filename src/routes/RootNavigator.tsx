import React, { useEffect, useState } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useDispatch, useSelector } from "react-redux"
import { AUTH_STACK, MAIN_STACK } from "../constants"
import { setUser } from "../redux/slices/authSlice"
import { selectAuth } from "../redux/slices/authSlice"
import { supabase } from "../config/supabase"
import SplashScreen from "../screens/SplashScreen"
import AuthStack from "./AuthStack"
import MainStack from "./MainStack"

const RootStack = createNativeStackNavigator()
const SPLASH_DURATION = 2000

export default function RootNavigator() {
  const dispatch = useDispatch()
  const user = useSelector(selectAuth)?.user ?? null
  const [ready, setReady] = useState(false)
  const [splashDone, setSplashDone] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setUser(session?.user ?? null))
      setReady(true)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user ?? null))
    })
    return () => subscription.unsubscribe()
  }, [dispatch])

  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => setSplashDone(true), SPLASH_DURATION)
    return () => clearTimeout(t)
  }, [ready])

  if (!ready || !splashDone) return <SplashScreen />

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name={MAIN_STACK} component={MainStack} />
      ) : (
        <RootStack.Screen name={AUTH_STACK} component={AuthStack} />
      )}
    </RootStack.Navigator>
  )
}
