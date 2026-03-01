import React from "react"
import { View, StyleSheet } from "react-native"
import Text from "../components/Text"
import { colors, fonts, ResponsiveFonts } from "../themes"

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text
        text="Fitness Tracker"
        fontFamily={fonts.poppinsExtraBold800}
        fontSize={ResponsiveFonts.px36}
        color={colors.white}
        center
        style={styles.title}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    letterSpacing: 1.2,
    textShadowColor: colors.transparentBlack65,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
})
