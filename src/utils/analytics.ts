const ANALYTICS_EVENTS = { WORKOUT_STARTED: "workout_started" } as const

function track(event: string, _props?: Record<string, unknown>) {
  if (__DEV__) return
  // Replace with your SDK: e.g. analytics().logEvent(event, props)
  // or Segment: track(event, props)
}

export function trackWorkoutStarted() {
  track(ANALYTICS_EVENTS.WORKOUT_STARTED)
}
