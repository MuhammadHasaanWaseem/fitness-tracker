import { createApi } from "@reduxjs/toolkit/query/react"
import { supabase } from "../../config/supabase"
import type { WorkoutWithExercises } from "../../types/workout"

const PAGE_SIZE = 10

const WORKOUT_HISTORY_TAG = "WorkoutHistory"

export const workoutApi = createApi({
  reducerPath: "workoutApi",
  baseQuery: async () => ({ data: null as unknown }),
  tagTypes: [WORKOUT_HISTORY_TAG],
  endpoints: (builder) => ({
    getWorkoutHistory: builder.query<
      { list: WorkoutWithExercises[]; hasMore: boolean },
      { page: number; userId: string }
    >({
      providesTags: [WORKOUT_HISTORY_TAG],
      queryFn: async ({ page, userId }) => {
        const from = page * PAGE_SIZE
        const to = from + PAGE_SIZE - 1
        const { data: workouts, error } = await supabase
          .from("workouts")
          .select("id, user_id, started_at, ended_at, duration_seconds, created_at")
          .eq("user_id", userId)
          .order("started_at", { ascending: false })
          .range(from, to)
        if (error) return { error: { status: "CUSTOM", error: error.message } }
        const list: WorkoutWithExercises[] = []
        for (const w of workouts || []) {
          const { data: exercises } = await supabase
            .from("exercises")
            .select("id, workout_id, name, sets, reps, weight")
            .eq("workout_id", w.id)
          list.push({ ...w, exercises: exercises || [] })
        }
        return {
          data: { list, hasMore: (workouts?.length ?? 0) === PAGE_SIZE },
        }
      },
    }),
  }),
})

export const { useGetWorkoutHistoryQuery } = workoutApi
export const workoutHistoryTag = WORKOUT_HISTORY_TAG
