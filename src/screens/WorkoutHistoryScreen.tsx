import React, { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { useSelector, useDispatch } from "react-redux"
import Toast from "react-native-toast-message"
import { useGetWorkoutHistoryQuery, workoutApi, workoutHistoryTag } from "../redux/api/workoutApi"
import { selectAuth } from "../redux/slices/authSlice"
import Text from "../components/Text"
import { WorkoutSessionCard } from "../components/card"
import { colors, fonts, ResponsiveFonts } from "../themes"
import type { WorkoutWithExercises } from "../types/workout"
import { format } from "date-fns"

function formatDuration(sec: number | null) {
  if (sec == null) return "0m"
  const m = Math.floor(sec / 60)
  return `${m}m`
}

export default function WorkoutHistoryScreen() {
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)
  const [page, setPage] = useState(0)
  const [allList, setAllList] = useState<WorkoutWithExercises[]>([])
  const { data, isLoading, isFetching, error } = useGetWorkoutHistoryQuery(
    { page, userId: user?.id ?? "" },
    { skip: !user?.id }
  )

  useEffect(() => {
    if (error) Toast.show({ type: "error", text1: "Failed to load history" })
  }, [error])

  useEffect(() => {
    if (!data?.list) return
    setAllList((prev) => (page === 0 ? data.list : [...prev, ...data.list]))
  }, [data?.list, page])

  const hasMore = data?.hasMore ?? false

  const onRefresh = () => {
    setPage(0)
    setAllList([])
    dispatch(workoutApi.util.invalidateTags([workoutHistoryTag]))
  }

  const onEndReached = () => {
    if (!isFetching && hasMore) setPage((p) => p + 1)
  }

  const renderItem = ({ item }: { item: WorkoutWithExercises }) => (
    <WorkoutSessionCard
      id={item.id}
      startedAt={format(new Date(item.started_at), "MMM d, yyyy HH:mm")}
      duration={formatDuration(item.duration_seconds)}
      exerciseCount={item.exercises?.length ?? 0}
      exercises={item.exercises}
    />
  )

  return (
    <View style={styles.container}>
      <Text
        text="Workout History"
        fontFamily={fonts.poppinsBold700}
        fontSize={ResponsiveFonts.px20}
        color={colors.text}
        bottom={16}
      />
      <FlatList
        data={allList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={page === 0 && (isLoading || isFetching)}
            onRefresh={onRefresh}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isFetching && page > 0 ? (
            <ActivityIndicator size="small" color={colors.primary} style={styles.footer} />
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <Text
              text="No workouts yet"
              fontSize={ResponsiveFonts.px14}
              color={colors.t4}
              center
            />
          ) : null
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBackground, padding: 16 },
  footer: { paddingVertical: 16 },
})
