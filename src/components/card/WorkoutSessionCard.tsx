import React from "react"
import { StyleSheet, View } from "react-native"
import Text from "../Text"
import { colors, fonts, ResponsiveFonts } from "../../themes"
import { heightRem, widthRem } from "../../themes/dimensions"
import type { ExerciseRow } from "../../types/workout"

interface WorkoutSessionCardProps {
  id: string
  startedAt: string
  duration: string
  exerciseCount: number
  exercises?: ExerciseRow[]
}

export function WorkoutSessionCard({
  startedAt,
  duration,
  exerciseCount,
  exercises = [],
}: WorkoutSessionCardProps) {
  return (
    <View style={styles.container}>
      <Text
        text={startedAt}
        fontFamily={fonts.poppinsSemiBold600}
        fontSize={ResponsiveFonts.px14}
        color={colors.text}
      />
      <Text
        text={`${duration} • ${exerciseCount} exercise${exerciseCount !== 1 ? "s" : ""}`}
        fontSize={ResponsiveFonts.px12}
        color={colors.t4}
      />
      {exercises.length > 0 && (
        <View style={styles.exerciseList}>
          {exercises.map((ex) => (
            <Text
              key={ex.id}
              text={`${ex.name} — ${ex.sets}×${ex.reps}${ex.weight ? ` • ${ex.weight} kg` : ""}`}
              fontSize={ResponsiveFonts.px12}
              color={colors.t4}
              style={styles.exerciseRow}
            />
          ))}
        </View>
      )}
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
  exerciseList: { marginTop: heightRem * 1.5 },
  exerciseRow: { marginBottom: heightRem * 0.5 },
})
