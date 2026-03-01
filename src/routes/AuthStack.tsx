import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SIGNIN_SCREEN, SIGNUP_SCREEN } from "../constants"
import SignInScreen from "../screens/auth/SignInScreen"
import SignUpScreen from "../screens/auth/SignUpScreen"

const Stack = createNativeStackNavigator()

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={SIGNIN_SCREEN}
    >
      <Stack.Screen name={SIGNIN_SCREEN} component={SignInScreen} />
      <Stack.Screen name={SIGNUP_SCREEN} component={SignUpScreen} />
    </Stack.Navigator>
  )
}
