import React, { useState, useEffect, useRef } from "react"
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { useRoute, useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import Text from "../components/Text"
import Button from "../components/Buttons/Buttons"
import TextInput from "../components/Input/TextInput"
import VerticalSpace from "../components/VerticalSpace"
import { ExerciseCard } from "../components/card"
import { SvgIcon } from "../utils"
import { iconPlay, iconStop, iconTimer } from "../utils/svgIcons"
import { supabase } from "../config/supabase"
import { selectAuth } from "../redux/slices/authSlice"
import { workoutApi, workoutHistoryTag } from "../redux/api/workoutApi"
import { trackWorkoutStarted } from "../utils/analytics"
import { recordUserAnalytics } from "../utils/userAnalytics"
import { colors, fonts, ResponsiveFonts } from "../themes"
import type { ExerciseRow } from "../types/workout"

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export default function ActiveWorkoutScreen() {
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)
  const route = useRoute()
  const nav = useNavigation()
  const [active, setActive] = useState(false)
  const [workoutId, setWorkoutId] = useState<string | null>(null)
  const [seconds, setSeconds] = useState(0)
  const [exercises, setExercises] = useState<ExerciseRow[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [name, setName] = useState("")
  const [sets, setSets] = useState("")
  const [reps, setReps] = useState("")
  const [weight, setWeight] = useState("")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const p = (route.params as { openAddModal?: boolean })?.openAddModal
    if (p) {
      setModalVisible(true)
      nav.setParams({ openAddModal: false })
    }
  }, [(route.params as { openAddModal?: boolean })?.openAddModal])

  useEffect(() => {
    if (active) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [active])

  const startWorkout = async () => {
    if (!user?.id) {
      Toast.show({ type: "error", text1: "Please sign in to start a workout" })
      return
    }
    const startedAt = new Date().toISOString()
    const { data, error } = await supabase
      .from("workouts")
      .insert({ user_id: user.id, started_at: startedAt })
      .select("id")
      .single()
    if (error) {
      Toast.show({ type: "error", text1: error.message })
      return
    }
    setWorkoutId(data.id)
    setActive(true)
    setSeconds(0)
    setExercises([])
    trackWorkoutStarted()
    Toast.show({
      type: "success",
      text1: "Workout started",
      text2: "Add exercises to your workout below",
    })
    setModalVisible(true)
  }

  const stopWorkout = async () => {
    if (!workoutId) return
    const { error } = await supabase
      .from("workouts")
      .update({
        ended_at: new Date().toISOString(),
        duration_seconds: seconds,
      })
      .eq("id", workoutId)
    if (error) {
      Toast.show({ type: "error", text1: error.message })
      return
    }
    if (user?.id) await recordUserAnalytics(user.id, "workout_completed", { exercise_count: exercises.length })
    dispatch(workoutApi.util.invalidateTags([workoutHistoryTag]))
    setActive(false)
    setWorkoutId(null)
    Toast.show({ type: "success", text1: "Workout saved" })
  }

  const addExercise = async () => {
    if (!workoutId) {
      Toast.show({ type: "error", text1: "Start a workout first" })
      return
    }
    const trimmedName = name.trim()
    if (!trimmedName) {
      Toast.show({ type: "error", text1: "Exercise name is required" })
      return
    }
    if (trimmedName.length < 2) {
      Toast.show({ type: "error", text1: "Exercise name must be at least 2 characters" })
      return
    }
    const setsNum = parseInt(sets, 10)
    const repsNum = parseInt(reps, 10)
    if (isNaN(setsNum) || setsNum < 0) {
      Toast.show({ type: "error", text1: "Sets must be 0 or more" })
      return
    }
    if (isNaN(repsNum) || repsNum < 0) {
      Toast.show({ type: "error", text1: "Reps must be 0 or more" })
      return
    }
    const weightStr = weight.trim()
    const weightNum = weightStr ? parseFloat(weightStr) : 0
    if (weightStr && (isNaN(weightNum) || weightNum < 0)) {
      Toast.show({ type: "error", text1: "Weight must be 0 or more" })
      return
    }
    const { data, error } = await supabase
      .from("exercises")
      .insert({
        workout_id: workoutId,
        name: trimmedName,
        sets: setsNum,
        reps: repsNum,
        weight: weightStr || "0",
      })
      .select()
      .single()
    if (error) {
      Toast.show({ type: "error", text1: error.message })
      return
    }
    setExercises((prev) => [...prev, data])
    setName("")
    setSets("")
    setReps("")
    setWeight("")
    setModalVisible(false)
    Toast.show({ type: "success", text1: "Exercise added" })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timerRow}>
          <SvgIcon xml={iconTimer} width={28} height={28} color={colors.primary} />
          <Text
            text={formatDuration(seconds)}
            fontFamily={fonts.poppinsBold700}
            fontSize={ResponsiveFonts.px28}
            color={colors.text}
          />
        </View>
        {!active ? (
          <Button
            text="Start Workout"
            LeftIcon={({ color }) => <SvgIcon xml={iconPlay} width={20} height={20} color={color} />}
            onPress={startWorkout}
          />
        ) : (
          <>
            <Button
              variant="secondary"
              text="Stop Workout"
              LeftIcon={({ color }) => <SvgIcon xml={iconStop} width={20} height={20} color={color} />}
              onPress={stopWorkout}
            />
            <VerticalSpace h={2} />
            <Button variant="outline" text="Add Exercise" onPress={() => setModalVisible(true)} />
          </>
        )}
      </View>
      <VerticalSpace h={2} />
      <Text
        text="Exercises"
        fontFamily={fonts.poppinsSemiBold600}
        fontSize={ResponsiveFonts.px16}
        color={colors.text}
      />
      {active && exercises.length === 0 && (
        <Text
          text="Add exercises to your workout"
          fontSize={ResponsiveFonts.px14}
          color={colors.primary}
          style={styles.hint}
        />
      )}
      <VerticalSpace h={2} />
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseCard
            name={item.name}
            sets={item.sets}
            reps={item.reps}
            weight={item.weight}
          />
        )}
        ListEmptyComponent={
          <Text
            text={active ? "Tap 'Add Exercise' to add your first exercise" : "No exercises yet"}
            fontSize={ResponsiveFonts.px14}
            color={colors.t4}
          />
        }
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalBox}>
              <Text
                text="Add Exercise"
                fontFamily={fonts.poppinsBold700}
                fontSize={ResponsiveFonts.px18}
              />
              <VerticalSpace h={2} />
              <TextInput
                title="Name"
                placeholder="Exercise name"
                value={name}
                onChangeText={setName}
              />
              <VerticalSpace h={2} />
              <TextInput
                title="Sets"
                placeholder="0"
                value={sets}
                onChangeText={setSets}
                keyboardType="number-pad"
              />
              <VerticalSpace h={2} />
              <TextInput
                title="Reps"
                placeholder="0"
                value={reps}
                onChangeText={setReps}
                keyboardType="number-pad"
              />
              <VerticalSpace h={2} />
              <TextInput
                title="Weight (kg)"
                placeholder="0"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
              />
              <VerticalSpace h={3} />
              <Button text="Add" onPress={addExercise} />
              <VerticalSpace h={1} />
              <Button variant="outline" text="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBackground, padding: 16 },
  header: { alignItems: "center" },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.transparentBlack15,
    justifyContent: "center",
    padding: 24,
  },
  modalBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
  },
  hint: { marginTop: 4 },
})
