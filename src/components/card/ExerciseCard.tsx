import React from "react"
import { StyleSheet, View } from "react-native"
import Text from "../Text"
import { colors, fonts, ResponsiveFonts } from "../../themes"
import { heightRem, widthRem } from "../../themes/dimensions"

interface ExerciseCardProps {
  name: string
  sets: number
  reps: number
  weight: string
}

export function ExerciseCard({ name, sets, reps, weight }: ExerciseCardProps) {
  return (
    <View style={styles.container}>
      <Text
        text={name}
        fontFamily={fonts.poppinsSemiBold600}
        fontSize={ResponsiveFonts.px14}
        color={colors.text}
      />
      <Text
        text={`${sets} sets × ${reps} reps${weight ? ` • ${weight} kg` : ""}`}
        fontSize={ResponsiveFonts.px12}
        color={colors.t4}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: widthRem * 4,
    marginHorizontal: widthRem * 4,
    marginBottom: heightRem * 2,
    borderRadius: widthRem * 2,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
})
