import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {
  ACTIVE_WORKOUT_SCREEN,
  WORKOUT_HISTORY_SCREEN,
  PROFILE_SCREEN,
} from "../constants"
import ActiveWorkoutScreen from "../screens/ActiveWorkoutScreen"
import WorkoutHistoryScreen from "../screens/WorkoutHistoryScreen"
import ProfileScreen from "../screens/ProfileScreen"
import EmptyScreen from "../screens/EmptyScreen"
import FitnessBottomTabBar from "../components/BottomTabBar/FitnessBottomTabBar"

const Tab = createBottomTabNavigator()

export default function MainStack() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FitnessBottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name={ACTIVE_WORKOUT_SCREEN} component={ActiveWorkoutScreen} />
      <Tab.Screen
        name="Add"
        component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault()
            navigation.navigate(ACTIVE_WORKOUT_SCREEN, { openAddModal: true })
          },
        })}
      />
      <Tab.Screen name={WORKOUT_HISTORY_SCREEN} component={WorkoutHistoryScreen} />
      <Tab.Screen name={PROFILE_SCREEN} component={ProfileScreen} />
    </Tab.Navigator>
  )
}
