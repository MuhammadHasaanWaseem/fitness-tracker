import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import React from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import Toast from "react-native-toast-message"
import { Provider } from "react-redux"
import { store } from "./src/redux/store"
import RootNavigator from "./src/routes/RootNavigator"

const App = () => (
  <Provider store={store}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootNavigator />
        <Toast position="top" />
      </NavigationContainer>
    </GestureHandlerRootView>
  </Provider>
)

export default App
