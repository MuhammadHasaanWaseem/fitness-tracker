import React, { useState, useCallback } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useSelector } from "react-redux"
import Text from "../components/Text"
import { supabase } from "../config/supabase"
import { selectAuth } from "../redux/slices/authSlice"
import { colors, fonts, ResponsiveFonts } from "../themes"
import { format } from "date-fns"

type Aggregates = {
  loginCount: number
  logoutCount: number
  workoutCount: number
  totalExercises: number
  lastLoginAt: string | null
  lastLogoutAt: string | null
}

const empty: Aggregates = {
  loginCount: 0,
  logoutCount: 0,
  workoutCount: 0,
  totalExercises: 0,
  lastLoginAt: null,
  lastLogoutAt: null,
}

export default function AnalyticsScreen() {
  const { user } = useSelector(selectAuth)
  const [data, setData] = useState<Aggregates>(empty)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAnalytics = useCallback(async () => {
    if (!user?.id) {
      setData(empty)
      setLoading(false)
      return
    }
    try {
      const eventsRes = await supabase
        .from("user_analytics")
        .select("event_type, created_at, metadata")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      const events = (eventsRes.data ?? []) as Array<{ event_type: string; created_at: string; metadata?: { exercise_count?: number } }>
      const loginEvents = events.filter((e) => e.event_type === "login")
      const logoutEvents = events.filter((e) => e.event_type === "logout")
      const lastLogin = loginEvents[0]?.created_at ?? null
      const lastLogout = logoutEvents[0]?.created_at ?? null
      let totalExFromMeta = 0
      events
        .filter((e) => e.event_type === "workout_completed" && e.metadata?.exercise_count != null)
        .forEach((e) => (totalExFromMeta += e.metadata!.exercise_count ?? 0))

      const { count: workoutCount } = await supabase
        .from("workouts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
      const { data: workoutIds } = await supabase.from("workouts").select("id").eq("user_id", user.id)
      const ids = workoutIds?.map((w) => w.id) ?? []
      const { count: exerciseCount } =
        ids.length > 0
          ? await supabase.from("exercises").select("id", { count: "exact", head: true }).in("workout_id", ids)
          : { count: 0 }

      setData({
        loginCount: loginEvents.length,
        logoutCount: logoutEvents.length,
        workoutCount: workoutCount ?? 0,
        totalExercises: exerciseCount ?? totalExFromMeta,
        lastLoginAt: lastLogin,
        lastLogoutAt: lastLogout,
      })
    } catch {
      setData(empty)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user?.id])

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      fetchAnalytics()
    }, [fetchAnalytics])
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchAnalytics()
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  const Row = ({ label, value }: { label: string; value: string | number }) => (
    <View style={styles.row}>
      <Text text={label} fontSize={ResponsiveFonts.px14} color={colors.t4} fontFamily={fonts.poppinsSemiBold600} />
      <Text text={String(value)} fontSize={ResponsiveFonts.px16} color={colors.text} fontFamily={fonts.poppinsBold700} />
    </View>
  )

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
    >
      <Text
        text="Analytics"
        fontFamily={fonts.poppinsBold700}
        fontSize={ResponsiveFonts.px20}
        color={colors.text}
        bottom={16}
      />
      <View style={styles.card}>
        <Row label="Logins" value={data.loginCount} />
        <Row label="Last login" value={data.lastLoginAt ? format(new Date(data.lastLoginAt), "MMM d, HH:mm") : "—"} />
        <Row label="Logouts" value={data.logoutCount} />
        <Row label="Last logout" value={data.lastLogoutAt ? format(new Date(data.lastLogoutAt), "MMM d, HH:mm") : "—"} />
        <Row label="Workouts completed" value={data.workoutCount} />
        <Row label="Total exercises" value={data.totalExercises} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBackground },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.screenBackground },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
})
