export interface ExerciseRow {
  id: string
  workout_id: string
  name: string
  sets: number
  reps: number
  weight: string
}

export interface WorkoutRow {
  id: string
  user_id: string
  started_at: string
  ended_at: string | null
  duration_seconds: number | null
  created_at: string
}

export interface WorkoutWithExercises extends WorkoutRow {
  exercises: ExerciseRow[]
}
