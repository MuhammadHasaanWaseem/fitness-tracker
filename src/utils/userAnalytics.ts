import { supabase } from "../config/supabase"

export type AnalyticsEvent = "login" | "logout" | "workout_completed"

export async function recordUserAnalytics(
  userId: string,
  eventType: AnalyticsEvent,
  metadata?: Record<string, unknown>
) {
  await supabase.from("user_analytics").insert({
    user_id: userId,
    event_type: eventType,
    metadata: metadata ?? {},
  })
}
